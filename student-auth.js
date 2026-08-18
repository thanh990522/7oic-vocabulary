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
  collection,
  doc,
  getDoc,
  getFirestore,
  increment,
  serverTimestamp,
  updateDoc,
  writeBatch
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
let pendingProgress = null;
const pendingActions = new Map();

function initials(name) {
  return String(name || "ST")
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map(part => part[0]?.toUpperCase() || "")
    .join("") || "ST";
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
    return "The username or password is incorrect.";
  }
  if (code.includes("too-many-requests")) return "Too many attempts. Please wait a moment and try again.";
  if (code.includes("network-request-failed")) return "Unable to connect. Please check your Internet connection.";
  if (code.includes("operation-not-allowed")) return "Student sign-in has not been enabled yet.";
  return "Unable to sign in. Please check the account details provided by your teacher.";
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
    deferredLoginMessage = "This account has not been activated for the learning page.";
    await signOut(studentAuth);
    return;
  }

  const student = { id: snapshot.id, ...snapshot.data() };
  if (!student.accountReady || student.authUid !== user.uid) {
    deferredLoginMessage = "This student account is incomplete. Please contact your teacher.";
    await signOut(studentAuth);
    return;
  }

  activeStudent = student;
  const vocabularyApp = await waitForVocabularyApp();
  const themeOne = student.themeProgress?.theme1 || {};
  vocabularyApp.setStudentSession({
    uid: user.uid,
    known: Array.isArray(themeOne.known) ? themeOne.known : [],
    review: Array.isArray(themeOne.review) ? themeOne.review : [],
    practice: themeOne.practice || {}
  });

  elements.accountAvatar.textContent = initials(student.name);
  elements.accountName.textContent = student.name || student.username;
  elements.accountClass.textContent = `${student.classCode || "No class assigned"} · @${student.username}`;
  setSyncStatus("", "Synced");
  elements.gate.hidden = true;
  elements.learningApp.hidden = false;
  document.body.classList.remove("student-auth-pending");
  setMessage();

  updateDoc(studentRef, {
    lastActive: serverTimestamp(),
    updatedAt: serverTimestamp()
  }).catch(() => setSyncStatus("error", "Not synced"));
}

async function syncProgress() {
  if (!activeStudent || !studentAuth.currentUser) return;
  const progress = pendingProgress;
  if (!progress) return;
  const actions = [...pendingActions.values()];
  pendingProgress = null;
  pendingActions.clear();
  setSyncStatus("syncing", "Saving...");
  try {
    const studentUid = studentAuth.currentUser.uid;
    const batch = writeBatch(db);
    batch.update(doc(db, "students", studentUid), {
      "themeProgress.theme1.known": progress.known,
      "themeProgress.theme1.review": progress.review,
      "themeProgress.theme1.practiced": progress.practiced,
      "themeProgress.theme1.total": 60,
      "themeProgress.theme1.practice": progress.practice || {},
      totalKnown: progress.known.length,
      totalPracticed: progress.practiced,
      lastActive: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    actions.forEach(action => {
      const activityId = action.activityId || (action.type === "flashcard"
        ? `theme${action.themeId}-word-${action.wordId}`
        : `theme${action.themeId || 1}-${action.type}${action.wordId ? `-word-${action.wordId}` : ""}`);
      batch.set(doc(collection(db, "students", studentUid, "activity"), activityId), {
        studentUid,
        type: action.type,
        exercise: action.exercise || "",
        exerciseTitle: action.exerciseTitle || "",
        themeId: action.themeId || 1,
        wordId: action.wordId || null,
        word: action.word || "",
        lesson: action.lesson || "",
        status: action.status || "",
        score: Number.isFinite(Number(action.score)) ? Number(action.score) : null,
        total: Number.isFinite(Number(action.total)) ? Number(action.total) : null,
        durationSeconds: Number.isFinite(Number(action.durationSeconds)) ? Number(action.durationSeconds) : null,
        completed: Number.isFinite(Number(action.completed)) ? Number(action.completed) : null,
        coverageCount: Number.isFinite(Number(action.coverageCount)) ? Number(action.coverageCount) : 0,
        attemptCount: increment(action.count || 1),
        updatedAt: serverTimestamp()
      }, { merge: true });
    });
    await batch.commit();
    setSyncStatus("", "Synced");
  } catch {
    pendingProgress = progress;
    actions.forEach(action => {
      const newer = pendingActions.get(action.key);
      pendingActions.set(action.key, {
        ...action,
        ...newer,
        count: (action.count || 0) + (newer?.count || 0)
      });
    });
    setSyncStatus("error", "Not synced");
  }
}

elements.form.addEventListener("submit", async event => {
  event.preventDefault();
  const username = normalizeStudentUsername(elements.username.value);
  if (username.length < 3) {
    setMessage("The username must contain at least 3 characters.");
    return;
  }
  elements.username.value = username;
  elements.loginButton.disabled = true;
  elements.loginButton.textContent = "⏳ Signing in...";
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
      setMessage("Teacher accounts must sign in through the Teacher Dashboard.");
    }
  } catch (error) {
    setMessage(readableLoginError(error));
  } finally {
    elements.loginButton.disabled = false;
    elements.loginButton.textContent = "🚀 Enter my learning space";
  }
});

elements.togglePassword.addEventListener("click", () => {
  const show = elements.password.type === "password";
  elements.password.type = show ? "text" : "password";
  elements.togglePassword.textContent = show ? "🙈" : "👁️";
  elements.togglePassword.setAttribute("aria-label", show ? "Hide password" : "Show password");
});

elements.logoutButton.addEventListener("click", async () => {
  clearTimeout(syncTimer);
  await signOut(studentAuth);
});

document.addEventListener("oic:progress-changed", event => {
  clearTimeout(syncTimer);
  pendingProgress = event.detail;
  const action = event.detail.action;
  if (action) {
    const key = action.activityId || (action.type === "flashcard"
      ? `theme${action.themeId}-word-${action.wordId}`
      : `theme${action.themeId || 1}-${action.type}${action.wordId ? `-word-${action.wordId}` : ""}`);
    const existing = pendingActions.get(key);
    pendingActions.set(key, { ...action, key, count: (existing?.count || 0) + 1 });
  }
  syncTimer = setTimeout(syncProgress, 350);
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
      ? "Firestore Rules do not allow access for this student account. Please contact your teacher."
      : "Unable to open your learning profile. Please sign in again.";
    await signOut(studentAuth);
  }
});
