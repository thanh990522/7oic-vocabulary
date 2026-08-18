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
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { firebaseConfig, TEACHER_EMAIL } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const state = {
  classes: [],
  students: [],
  unsubscribers: [],
  activePanel: "overview"
};

const elements = {
  authView: document.querySelector("#authView"),
  dashboardView: document.querySelector("#dashboardView"),
  teacherLoginForm: document.querySelector("#teacherLoginForm"),
  teacherPassword: document.querySelector("#teacherPassword"),
  teacherLoginButton: document.querySelector("#teacherLoginButton"),
  togglePasswordButton: document.querySelector("#togglePasswordButton"),
  loginMessage: document.querySelector("#loginMessage"),
  logoutButton: document.querySelector("#logoutButton"),
  dashboardTitle: document.querySelector("#dashboardTitle"),
  navButtons: [...document.querySelectorAll("[data-dashboard-panel]")],
  panels: [...document.querySelectorAll("[data-dashboard-view]")],
  dataNotice: document.querySelector("#dataNotice"),
  classCount: document.querySelector("#classCount"),
  studentCount: document.querySelector("#studentCount"),
  activeStudentCount: document.querySelector("#activeStudentCount"),
  averageProgress: document.querySelector("#averageProgress"),
  overviewClassList: document.querySelector("#overviewClassList"),
  overviewClassEmpty: document.querySelector("#overviewClassEmpty"),
  recentStudentTable: document.querySelector("#recentStudentTable"),
  recentStudentEmpty: document.querySelector("#recentStudentEmpty"),
  classCardGrid: document.querySelector("#classCardGrid"),
  classEmptyState: document.querySelector("#classEmptyState"),
  studentSearchInput: document.querySelector("#studentSearchInput"),
  studentClassFilter: document.querySelector("#studentClassFilter"),
  studentTableBody: document.querySelector("#studentTableBody"),
  studentEmptyState: document.querySelector("#studentEmptyState"),
  classDialog: document.querySelector("#classDialog"),
  createClassForm: document.querySelector("#createClassForm"),
  classNameInput: document.querySelector("#classNameInput"),
  classNoteInput: document.querySelector("#classNoteInput"),
  createClassButton: document.querySelector("#createClassButton"),
  studentDialog: document.querySelector("#studentDialog"),
  createStudentForm: document.querySelector("#createStudentForm"),
  studentNameInput: document.querySelector("#studentNameInput"),
  studentUsernameInput: document.querySelector("#studentUsernameInput"),
  studentClassInput: document.querySelector("#studentClassInput"),
  createStudentButton: document.querySelector("#createStudentButton"),
  dashboardToast: document.querySelector("#dashboardToast")
};

const PANEL_TITLES = {
  overview: "Tổng quan lớp học",
  classes: "Quản lý lớp học",
  students: "Tiến độ học sinh"
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initials(name) {
  return String(name || "HS")
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map(part => part[0]?.toUpperCase() || "")
    .join("") || "HS";
}

function valueCount(value) {
  if (Array.isArray(value)) return value.length;
  return Number(value) || 0;
}

function themeOneProgress(student) {
  const theme = student.themeProgress?.theme1 || {};
  const known = valueCount(theme.known);
  const review = valueCount(theme.review);
  const practiced = Number(theme.practiced) || known + review;
  const total = Number(theme.total) || 60;
  const percent = Math.min(100, Math.round((practiced / total) * 100));
  return { known, review, practiced, total, percent };
}

function timestampToDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
  const date = timestampToDate(value);
  if (!date) return "Chưa học";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function isRecentlyActive(student) {
  const date = timestampToDate(student.lastActive);
  return date ? Date.now() - date.getTime() <= 7 * 24 * 60 * 60 * 1000 : false;
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  elements.dashboardToast.textContent = message;
  elements.dashboardToast.classList.add("is-visible");
  toastTimer = setTimeout(() => elements.dashboardToast.classList.remove("is-visible"), 3000);
}

function setLoginMessage(message = "") {
  elements.loginMessage.textContent = message;
}

function readableAuthError(error) {
  const code = error?.code || "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
    return "Mật khẩu chưa đúng. Vui lòng kiểm tra và thử lại.";
  }
  if (code.includes("too-many-requests")) return "Có quá nhiều lần thử. Vui lòng chờ một lúc rồi đăng nhập lại.";
  if (code.includes("network-request-failed")) return "Không thể kết nối Firebase. Hãy kiểm tra mạng Internet.";
  if (code.includes("operation-not-allowed")) return "Firebase chưa bật phương thức Email/Password.";
  return "Chưa thể đăng nhập. Hãy kiểm tra tài khoản giáo viên trong Firebase Authentication.";
}

function showAuthView() {
  elements.authView.hidden = false;
  elements.dashboardView.hidden = true;
  elements.teacherPassword.value = "";
  clearSubscriptions();
}

function showDashboardView() {
  elements.authView.hidden = true;
  elements.dashboardView.hidden = false;
  setLoginMessage();
  switchPanel(state.activePanel);
  subscribeToData();
}

function clearSubscriptions() {
  state.unsubscribers.forEach(unsubscribe => unsubscribe());
  state.unsubscribers = [];
  state.classes = [];
  state.students = [];
}

function switchPanel(panelName) {
  state.activePanel = panelName;
  elements.navButtons.forEach(button => button.classList.toggle("is-active", button.dataset.dashboardPanel === panelName));
  elements.panels.forEach(panel => {
    const active = panel.dataset.dashboardView === panelName;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
  elements.dashboardTitle.textContent = PANEL_TITLES[panelName] || PANEL_TITLES.overview;
}

function showDataError(error) {
  const permissionDenied = error?.code?.includes("permission-denied");
  elements.dataNotice.hidden = false;
  elements.dataNotice.textContent = permissionDenied
    ? "Firestore đang từ chối quyền truy cập. Hãy xuất bản nội dung file firestore.rules trong Firebase Console để dashboard đọc dữ liệu an toàn."
    : "Không thể tải dữ liệu Firestore. Vui lòng kiểm tra cấu hình database và kết nối mạng.";
}

function hideDataError() {
  elements.dataNotice.hidden = true;
  elements.dataNotice.textContent = "";
}

function subscribeToData() {
  clearSubscriptions();
  const teacher = auth.currentUser;
  if (!teacher) return;

  const classesQuery = query(collection(db, "classes"), where("teacherUid", "==", teacher.uid));
  const studentsQuery = query(collection(db, "students"), where("teacherUid", "==", teacher.uid));

  state.unsubscribers.push(onSnapshot(classesQuery, snapshot => {
    hideDataError();
    state.classes = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    state.classes.sort((a, b) => String(a.name).localeCompare(String(b.name), "vi"));
    renderDashboard();
  }, showDataError));

  state.unsubscribers.push(onSnapshot(studentsQuery, snapshot => {
    hideDataError();
    state.students = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    state.students.sort((a, b) => String(a.name).localeCompare(String(b.name), "vi"));
    renderDashboard();
  }, showDataError));
}

function classStudentCount(classCode) {
  return state.students.filter(student => student.classCode === classCode).length;
}

function renderMetrics() {
  const activeStudents = state.students.filter(isRecentlyActive).length;
  const average = state.students.length
    ? Math.round(state.students.reduce((sum, student) => sum + themeOneProgress(student).percent, 0) / state.students.length)
    : 0;
  elements.classCount.textContent = state.classes.length;
  elements.studentCount.textContent = state.students.length;
  elements.activeStudentCount.textContent = activeStudents;
  elements.averageProgress.textContent = `${average}%`;
}

function renderOverviewClasses() {
  const items = state.classes.slice(0, 4);
  elements.overviewClassEmpty.hidden = items.length > 0;
  elements.overviewClassList.hidden = items.length === 0;
  elements.overviewClassList.innerHTML = items.map(item => `
    <div class="class-mini-item">
      <span aria-hidden="true">🏫</span>
      <div><strong>${escapeHtml(item.name)}</strong><small>${classStudentCount(item.id)} học sinh</small></div>
      <span class="class-code">${escapeHtml(item.id)}</span>
    </div>
  `).join("");
}

function renderRecentStudents() {
  const items = [...state.students]
    .sort((a, b) => (timestampToDate(b.lastActive)?.getTime() || 0) - (timestampToDate(a.lastActive)?.getTime() || 0))
    .slice(0, 5);
  elements.recentStudentEmpty.hidden = items.length > 0;
  elements.recentStudentTable.parentElement.parentElement.hidden = items.length === 0;
  elements.recentStudentTable.innerHTML = items.map(student => {
    const progress = themeOneProgress(student);
    return `
      <tr>
        <td><div class="mini-person"><span class="mini-avatar">${escapeHtml(initials(student.name))}</span><strong>${escapeHtml(student.name)}</strong></div></td>
        <td>${escapeHtml(student.classCode || "—")}</td>
        <td><div class="mini-progress"><span><i style="width:${progress.percent}%"></i></span><strong>${progress.percent}%</strong></div></td>
      </tr>
    `;
  }).join("");
}

function renderClassCards() {
  elements.classEmptyState.hidden = state.classes.length > 0;
  elements.classCardGrid.hidden = state.classes.length === 0;
  elements.classCardGrid.innerHTML = state.classes.map((item, index) => `
    <article class="class-card">
      <div class="class-card__top"><span class="class-card__icon">${["🚀", "🪐", "🔬", "🧬"][index % 4]}</span><span class="class-code">${escapeHtml(item.id)}</span></div>
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.note || "Lớp học từ vựng Oxford Discover Futures 2.")}</p>
      <div class="class-card__bottom"><span>🧑‍🎓 ${classStudentCount(item.id)} học sinh</span><strong>1/9 THEMES</strong></div>
    </article>
  `).join("");
}

function renderClassOptions() {
  const filterValue = elements.studentClassFilter.value || "all";
  const inputValue = elements.studentClassInput.value || "";
  const options = state.classes.map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)} · ${escapeHtml(item.id)}</option>`).join("");
  elements.studentClassFilter.innerHTML = `<option value="all">Tất cả lớp</option>${options}`;
  elements.studentClassInput.innerHTML = `<option value="">Chọn lớp học</option>${options}`;
  if (["all", ...state.classes.map(item => item.id)].includes(filterValue)) elements.studentClassFilter.value = filterValue;
  if (state.classes.some(item => item.id === inputValue)) elements.studentClassInput.value = inputValue;
}

function filteredStudents() {
  const search = elements.studentSearchInput.value.trim().toLocaleLowerCase("vi");
  const classCode = elements.studentClassFilter.value;
  return state.students.filter(student => {
    const matchesClass = classCode === "all" || student.classCode === classCode;
    const haystack = `${student.name || ""} ${student.username || ""}`.toLocaleLowerCase("vi");
    return matchesClass && (!search || haystack.includes(search));
  });
}

function renderStudentTable() {
  const students = filteredStudents();
  elements.studentEmptyState.hidden = students.length > 0;
  elements.studentTableBody.parentElement.parentElement.hidden = students.length === 0;
  elements.studentTableBody.innerHTML = students.map(student => {
    const progress = themeOneProgress(student);
    const active = isRecentlyActive(student);
    return `
      <tr>
        <td><div class="student-identity"><span class="student-avatar">${escapeHtml(initials(student.name))}</span><div><strong>${escapeHtml(student.name)}</strong><small>@${escapeHtml(student.username || "chưa-có")}</small></div></div></td>
        <td><span class="class-code">${escapeHtml(student.classCode || "—")}</span></td>
        <td class="progress-cell"><div><span><i style="width:${progress.percent}%"></i></span><strong>${progress.practiced}/${progress.total}</strong></div></td>
        <td>✅ ${progress.known}</td>
        <td>🔁 ${progress.review}</td>
        <td>${escapeHtml(formatDate(student.lastActive))}</td>
        <td><span class="status-pill${active ? "" : " status-pill--idle"}">${active ? "Hoạt động" : "Chưa hoạt động"}</span></td>
      </tr>
    `;
  }).join("");
}

function renderDashboard() {
  renderMetrics();
  renderOverviewClasses();
  renderRecentStudents();
  renderClassCards();
  renderClassOptions();
  renderStudentTable();
}

function createThemeProgress() {
  return Object.fromEntries(Array.from({ length: 9 }, (_, index) => [
    `theme${index + 1}`,
    { known: 0, review: 0, practiced: 0, total: index === 0 ? 60 : 0 }
  ]));
}

function randomClassCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
}

async function uniqueClassCode() {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const code = randomClassCode();
    const existing = await getDoc(doc(db, "classes", code));
    if (!existing.exists()) return code;
  }
  throw new Error("Không thể tạo mã lớp duy nhất. Vui lòng thử lại.");
}

async function handleCreateClass(event) {
  event.preventDefault();
  const teacher = auth.currentUser;
  if (!teacher) return;
  elements.createClassButton.disabled = true;
  try {
    const code = await uniqueClassCode();
    await setDoc(doc(db, "classes", code), {
      name: elements.classNameInput.value.trim(),
      note: elements.classNoteInput.value.trim(),
      teacherUid: teacher.uid,
      teacherEmail: TEACHER_EMAIL,
      themeCount: 9,
      releasedThemes: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    elements.createClassForm.reset();
    elements.classDialog.close();
    showToast(`Đã tạo lớp ${code} thành công! 🚀`);
  } catch (error) {
    showDataError(error);
    showToast("Chưa thể tạo lớp. Hãy kiểm tra Firestore Rules.");
  } finally {
    elements.createClassButton.disabled = false;
  }
}

async function handleCreateStudent(event) {
  event.preventDefault();
  const teacher = auth.currentUser;
  if (!teacher) return;
  const username = elements.studentUsernameInput.value.trim().toLowerCase();
  const safeUsername = username.replace(/[^a-z0-9._-]/g, "");
  const studentId = `${teacher.uid}_${safeUsername}`;
  elements.createStudentButton.disabled = true;
  try {
    const existing = await getDoc(doc(db, "students", studentId));
    if (existing.exists()) throw new Error("Tên đăng nhập đã tồn tại trong lớp học.");
    await setDoc(doc(db, "students", studentId), {
      name: elements.studentNameInput.value.trim(),
      username: safeUsername,
      classCode: elements.studentClassInput.value,
      teacherUid: teacher.uid,
      teacherEmail: TEACHER_EMAIL,
      themeProgress: createThemeProgress(),
      totalKnown: 0,
      totalPracticed: 0,
      lastActive: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    elements.createStudentForm.reset();
    elements.studentDialog.close();
    showToast(`Đã thêm học sinh @${safeUsername} ✨`);
  } catch (error) {
    if (error.message.includes("đã tồn tại")) showToast(error.message);
    else {
      showDataError(error);
      showToast("Chưa thể thêm học sinh. Hãy kiểm tra Firestore Rules.");
    }
  } finally {
    elements.createStudentButton.disabled = false;
  }
}

function bindEvents() {
  elements.teacherLoginForm.addEventListener("submit", async event => {
    event.preventDefault();
    setLoginMessage();
    elements.teacherLoginButton.disabled = true;
    elements.teacherLoginButton.innerHTML = "⏳ Đang xác thực...";
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, TEACHER_EMAIL, elements.teacherPassword.value);
    } catch (error) {
      setLoginMessage(readableAuthError(error));
    } finally {
      elements.teacherLoginButton.disabled = false;
      elements.teacherLoginButton.innerHTML = "<span>🚀</span> Mở Teacher Dashboard";
    }
  });

  elements.togglePasswordButton.addEventListener("click", () => {
    const show = elements.teacherPassword.type === "password";
    elements.teacherPassword.type = show ? "text" : "password";
    elements.togglePasswordButton.textContent = show ? "🙈" : "👁️";
    elements.togglePasswordButton.setAttribute("aria-label", show ? "Ẩn mật khẩu" : "Hiện mật khẩu");
  });

  elements.logoutButton.addEventListener("click", async () => {
    await signOut(auth);
    showToast("Đã đăng xuất khỏi Teacher Dashboard 🔐");
  });

  elements.navButtons.forEach(button => button.addEventListener("click", () => switchPanel(button.dataset.dashboardPanel)));
  document.querySelectorAll("[data-dashboard-link]").forEach(button => button.addEventListener("click", () => switchPanel(button.dataset.dashboardLink)));
  document.querySelectorAll("[data-open-dialog]").forEach(button => button.addEventListener("click", () => {
    const dialog = document.querySelector(`#${button.dataset.openDialog}`);
    if (dialog === elements.studentDialog && !state.classes.length) {
      showToast("Hãy tạo ít nhất một lớp trước khi thêm học sinh 🏫");
      switchPanel("classes");
      return;
    }
    dialog?.showModal();
  }));
  document.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => document.querySelector(`#${button.dataset.closeDialog}`)?.close()));

  elements.createClassForm.addEventListener("submit", handleCreateClass);
  elements.createStudentForm.addEventListener("submit", handleCreateStudent);
  elements.studentSearchInput.addEventListener("input", renderStudentTable);
  elements.studentClassFilter.addEventListener("change", renderStudentTable);
}

bindEvents();
setPersistence(auth, browserLocalPersistence).catch(() => {});
onAuthStateChanged(auth, async user => {
  if (!user) {
    showAuthView();
    return;
  }
  if (user.email?.toLowerCase() !== TEACHER_EMAIL.toLowerCase()) {
    await signOut(auth);
    setLoginMessage("Tài khoản này không có quyền giáo viên.");
    return;
  }
  showDashboardView();
});
