import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import {
  firebaseConfig,
  normalizeStudentUsername,
  studentUsernameToEmail,
  TEACHER_EMAIL
} from "./firebase-config.js";

const studentApp = initializeApp(firebaseConfig, "student-portal");
const studentAuth = getAuth(studentApp);
const db = getFirestore(studentApp);

const elements = {
  gate: document.querySelector("#studentAuthGate"),
  learningApp: document.querySelector("#learningApp"),
  form: document.querySelector("#studentLoginForm"),
  username: document.querySelector("#studentLoginUsername"),
  password: document.querySelector("#studentLoginPassword"),
  togglePassword: document.querySelector("#toggleStudentLoginPassword"),
  loginButton: document.querySelector("#studentLoginButton"),
  message: document.querySelector("#studentLoginMessage"),
  accountAvatar: document.querySelector("#studentAccountAvatar"),
  accountName: document.querySelector("#studentAccountName"),
  accountClass: document.querySelector("#studentAccountClass"),
  syncStatus: document.querySelector("#studentSyncStatus"),
  logoutButton: document.querySelector("#studentLogoutButton")
};

let activeStudent = null;
let syncTimer = null;
let deferredLoginMessage = "";

function initials(name) {
  return String(name || "HS")
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map(part => part[0]?.toUpperCase() || "")
    .join("") || "HS";
}

function setMessage(message = "") {
  elements.message.textContent = message;
}

function setSyncStatus(status, label) {
  elements.syncStatus.className = `student-sync-status${status ? ` is-${status}` : ""}`;
  elements.syncStatus.innerHTML = `<i></i> ${label}`;
}

function readableLoginError(error) {
  const code = error?.code || "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
    return "Tên đăng nhập hoặc mật khẩu chưa đúng.";
  }
  if (code.includes("too-many-requests")) return "Có quá nhiều lần thử. Em hãy chờ một lúc rồi đăng nhập lại.";
  if (code.includes("network-request-failed")) return "Không thể kết nối. Em hãy kiểm tra mạng Internet.";
  if (code.includes("operation-not-allowed")) return "Hệ thống đăng nhập chưa được giáo viên kích hoạt.";
  return "Chưa thể đăng nhập. Em hãy kiểm tra lại thông tin giáo viên đã cấp.";
}

function waitForVocabularyApp() {
  if (window.OICVocabulary) return Promise.resolve(window.OICVocabulary);
  return new Promise(resolve => {
    document.addEventListener("oic:app-ready", () => resolve(window.OICVocabulary), { once: true });
  });
}

async function showLogin(message = "") {
  clearTimeout(syncTimer);
  activeStudent = null;
  const vocabularyApp = await waitForVocabularyApp();
  vocabularyApp.clearStudentSession();
  elements.learningApp.hidden = true;
  elements.gate.hidden = false;
  document.body.classList.add("student-auth-pending");
  elements.password.value = "";
  setMessage(message || deferredLoginMessage);
  deferredLoginMessage = "";
}

async function openStudentLearning(user) {
  const studentRef = doc(db, "students", user.uid);
  const snapshot = await getDoc(studentRef);
  if (!snapshot.exists()) {
    deferredLoginMessage = "Tài khoản chưa được giáo viên kích hoạt cho trang học.";
    await signOut(studentAuth);
    return;
  }

  const student = { id: snapshot.id, ...snapshot.data() };
  if (!student.accountReady || student.authUid !== user.uid) {
    deferredLoginMessage = "Tài khoản học sinh chưa hoàn tất. Em hãy liên hệ giáo viên.";
    await signOut(studentAuth);
    return;
  }

  activeStudent = student;
  const vocabularyApp = await waitForVocabularyApp();
  const themeOne = student.themeProgress?.theme1 || {};
  vocabularyApp.setStudentSession({
    uid: user.uid,
    known: Array.isArray(themeOne.known) ? themeOne.known : [],
    review: Array.isArray(themeOne.review) ? themeOne.review : []
  });

  elements.accountAvatar.textContent = initials(student.name);
  elements.accountName.textContent = student.name || student.username;
  elements.accountClass.textContent = `${student.classCode || "Chưa xếp lớp"} · @${student.username}`;
  setSyncStatus("", "Đã đồng bộ");
  elements.gate.hidden = true;
  elements.learningApp.hidden = false;
  document.body.classList.remove("student-auth-pending");
  setMessage();

  updateDoc(studentRef, {
    lastActive: serverTimestamp(),
    updatedAt: serverTimestamp()
  }).catch(() => setSyncStatus("error", "Chưa đồng bộ"));
}

async function syncProgress(progress) {
  if (!activeStudent || !studentAuth.currentUser) return;
  setSyncStatus("syncing", "Đang lưu...");
  try {
    await updateDoc(doc(db, "students", studentAuth.currentUser.uid), {
      "themeProgress.theme1.known": progress.known,
      "themeProgress.theme1.review": progress.review,
      "themeProgress.theme1.practiced": progress.practiced,
      "themeProgress.theme1.total": 60,
      totalKnown: progress.known.length,
      totalPracticed: progress.practiced,
      lastActive: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    setSyncStatus("", "Đã đồng bộ");
  } catch {
    setSyncStatus("error", "Chưa đồng bộ");
  }
}

elements.form.addEventListener("submit", async event => {
  event.preventDefault();
  const username = normalizeStudentUsername(elements.username.value);
  if (username.length < 3) {
    setMessage("Tên đăng nhập phải có ít nhất 3 ký tự.");
    return;
  }
  elements.username.value = username;
  elements.loginButton.disabled = true;
  elements.loginButton.textContent = "⏳ Đang xác thực...";
  setMessage();
  try {
    await setPersistence(studentAuth, browserLocalPersistence);
    const credential = await signInWithEmailAndPassword(
      studentAuth,
      studentUsernameToEmail(username),
      elements.password.value
    );
    if (credential.user.email?.toLowerCase() === TEACHER_EMAIL.toLowerCase()) {
      await signOut(studentAuth);
      setMessage("Tài khoản giáo viên vui lòng đăng nhập tại Teacher Dashboard.");
    }
  } catch (error) {
    setMessage(readableLoginError(error));
  } finally {
    elements.loginButton.disabled = false;
    elements.loginButton.textContent = "🚀 Vào trang học của em";
  }
});

elements.togglePassword.addEventListener("click", () => {
  const show = elements.password.type === "password";
  elements.password.type = show ? "text" : "password";
  elements.togglePassword.textContent = show ? "🙈" : "👁️";
  elements.togglePassword.setAttribute("aria-label", show ? "Ẩn mật khẩu" : "Hiện mật khẩu");
});

elements.logoutButton.addEventListener("click", async () => {
  clearTimeout(syncTimer);
  await signOut(studentAuth);
});

document.addEventListener("oic:progress-changed", event => {
  clearTimeout(syncTimer);
  const progress = event.detail;
  syncTimer = setTimeout(() => syncProgress(progress), 350);
});

setPersistence(studentAuth, browserLocalPersistence).catch(() => {});
onAuthStateChanged(studentAuth, async user => {
  if (!user) {
    await showLogin();
    return;
  }
  try {
    await openStudentLearning(user);
  } catch (error) {
    deferredLoginMessage = error?.code?.includes("permission-denied")
      ? "Firestore Rules chưa cấp quyền cho tài khoản học sinh. Hãy liên hệ giáo viên."
      : "Chưa thể mở hồ sơ học tập. Em hãy thử đăng nhập lại.";
    await signOut(studentAuth);
  }
});
