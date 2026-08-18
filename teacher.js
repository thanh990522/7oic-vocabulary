import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  inMemoryPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import {
  firebaseConfig,
  normalizeStudentUsername,
  studentUsernameToEmail,
  TEACHER_EMAIL
} from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provisioningApp = initializeApp(firebaseConfig, "student-provisioning");
const provisioningAuth = getAuth(provisioningApp);

const state = {
  classes: [],
  students: [],
  activity: [],
  unsubscribers: [],
  activityUnsubscribe: null,
  activePanel: "overview",
  selectedClassCode: null,
  selectedStudentId: null,
  studentDetailBackPanel: "students"
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
  backFromClassButton: document.querySelector("#backFromClassButton"),
  classDetailName: document.querySelector("#classDetailName"),
  classDetailNote: document.querySelector("#classDetailNote"),
  classDetailCode: document.querySelector("#classDetailCode"),
  classDetailStudentCount: document.querySelector("#classDetailStudentCount"),
  classDetailActiveCount: document.querySelector("#classDetailActiveCount"),
  classDetailAverage: document.querySelector("#classDetailAverage"),
  classDetailStudentTable: document.querySelector("#classDetailStudentTable"),
  classDetailEmpty: document.querySelector("#classDetailEmpty"),
  backFromStudentButton: document.querySelector("#backFromStudentButton"),
  studentDetailAvatar: document.querySelector("#studentDetailAvatar"),
  studentDetailName: document.querySelector("#studentDetailName"),
  studentDetailUsername: document.querySelector("#studentDetailUsername"),
  studentDetailClass: document.querySelector("#studentDetailClass"),
  studentDetailStatus: document.querySelector("#studentDetailStatus"),
  openDeleteStudentButton: document.querySelector("#openDeleteStudentButton"),
  studentInfoName: document.querySelector("#studentInfoName"),
  studentInfoUsername: document.querySelector("#studentInfoUsername"),
  studentInfoClass: document.querySelector("#studentInfoClass"),
  studentInfoCreated: document.querySelector("#studentInfoCreated"),
  studentInfoLastActive: document.querySelector("#studentInfoLastActive"),
  studentInfoAccount: document.querySelector("#studentInfoAccount"),
  studentDetailPracticed: document.querySelector("#studentDetailPracticed"),
  studentDetailKnown: document.querySelector("#studentDetailKnown"),
  studentDetailReview: document.querySelector("#studentDetailReview"),
  studentDetailPercent: document.querySelector("#studentDetailPercent"),
  studentDetailProgressBar: document.querySelector("#studentDetailProgressBar"),
  studentDetailProgressLabel: document.querySelector("#studentDetailProgressLabel"),
  studentPracticeGrid: document.querySelector("#studentPracticeGrid"),
  studentThemeGrid: document.querySelector("#studentThemeGrid"),
  activityCountBadge: document.querySelector("#activityCountBadge"),
  studentActivityTable: document.querySelector("#studentActivityTable"),
  studentActivityEmpty: document.querySelector("#studentActivityEmpty"),
  classDialog: document.querySelector("#classDialog"),
  createClassForm: document.querySelector("#createClassForm"),
  classNameInput: document.querySelector("#classNameInput"),
  classNoteInput: document.querySelector("#classNoteInput"),
  createClassButton: document.querySelector("#createClassButton"),
  studentDialog: document.querySelector("#studentDialog"),
  createStudentForm: document.querySelector("#createStudentForm"),
  studentNameInput: document.querySelector("#studentNameInput"),
  studentUsernameInput: document.querySelector("#studentUsernameInput"),
  studentPasswordInput: document.querySelector("#studentPasswordInput"),
  generateStudentPasswordButton: document.querySelector("#generateStudentPasswordButton"),
  toggleStudentPasswordButton: document.querySelector("#toggleStudentPasswordButton"),
  studentClassInput: document.querySelector("#studentClassInput"),
  createStudentButton: document.querySelector("#createStudentButton"),
  credentialDialog: document.querySelector("#credentialDialog"),
  createdStudentName: document.querySelector("#createdStudentName"),
  createdStudentUsername: document.querySelector("#createdStudentUsername"),
  createdStudentPassword: document.querySelector("#createdStudentPassword"),
  copyStudentCredentialsButton: document.querySelector("#copyStudentCredentialsButton"),
  deleteStudentDialog: document.querySelector("#deleteStudentDialog"),
  deleteStudentName: document.querySelector("#deleteStudentName"),
  confirmDeleteStudentButton: document.querySelector("#confirmDeleteStudentButton"),
  dashboardToast: document.querySelector("#dashboardToast")
};

const PANEL_TITLES = {
  overview: "Tổng quan lớp học",
  classes: "Quản lý lớp học",
  students: "Tiến độ học sinh",
  "class-detail": "Chi tiết lớp học",
  "student-detail": "Hồ sơ học sinh"
};

const THEME_NAMES = [
  "What is identity?",
  "How do we discover?",
  "What makes us healthy?",
  "How do people create change?",
  "Why do we tell stories?",
  "How does technology help us?",
  "What can we learn from nature?",
  "How do communities grow?",
  "What will the future bring?"
];

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
  state.activityUnsubscribe?.();
  state.activityUnsubscribe = null;
  state.classes = [];
  state.students = [];
  state.activity = [];
}

function switchPanel(panelName) {
  if (panelName !== "student-detail" && state.activityUnsubscribe) {
    state.activityUnsubscribe();
    state.activityUnsubscribe = null;
    state.activity = [];
  }
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

function classByCode(classCode) {
  return state.classes.find(item => item.id === classCode) || null;
}

function studentById(studentId) {
  return state.students.find(item => item.id === studentId) || null;
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
    <button class="class-mini-item" type="button" data-class-detail="${escapeHtml(item.id)}">
      <span aria-hidden="true">🏫</span>
      <div><strong>${escapeHtml(item.name)}</strong><small>${classStudentCount(item.id)} học sinh</small></div>
      <span class="class-code">${escapeHtml(item.id)}</span>
    </button>
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
      <tr data-student-detail="${escapeHtml(student.id)}" data-detail-back="overview">
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
    <button class="class-card" type="button" data-class-detail="${escapeHtml(item.id)}">
      <div class="class-card__top"><span class="class-card__icon">${["🚀", "🪐", "🔬", "🧬"][index % 4]}</span><span class="class-code">${escapeHtml(item.id)}</span></div>
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.note || "Lớp học từ vựng Oxford Discover Futures 2.")}</p>
      <div class="class-card__bottom"><span>🧑‍🎓 ${classStudentCount(item.id)} học sinh</span><strong>1/9 THEMES</strong></div>
      <span class="class-card__open">Xem lớp →</span>
    </button>
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
      <tr data-student-detail="${escapeHtml(student.id)}" data-detail-back="students">
        <td><div class="student-identity"><span class="student-avatar">${escapeHtml(initials(student.name))}</span><div><strong>${escapeHtml(student.name)}</strong><small>@${escapeHtml(student.username || "chưa-có")}</small></div></div></td>
        <td><span class="class-code">${escapeHtml(student.classCode || "—")}</span></td>
        <td class="progress-cell"><div><span><i style="width:${progress.percent}%"></i></span><strong>${progress.practiced}/${progress.total}</strong></div></td>
        <td>✅ ${progress.known}</td>
        <td>🔁 ${progress.review}</td>
        <td>${escapeHtml(formatDate(student.lastActive))}</td>
        <td><span class="status-pill${active ? "" : " status-pill--idle"}">${active ? "Hoạt động" : "Chưa hoạt động"}</span></td>
        <td><button class="row-detail-button" type="button" data-student-detail="${escapeHtml(student.id)}" data-detail-back="students">Xem →</button></td>
      </tr>
    `;
  }).join("");
}

function renderClassDetail() {
  const classroom = classByCode(state.selectedClassCode);
  if (!classroom) return;
  const students = state.students.filter(student => student.classCode === classroom.id);
  const activeCount = students.filter(isRecentlyActive).length;
  const average = students.length
    ? Math.round(students.reduce((sum, student) => sum + themeOneProgress(student).percent, 0) / students.length)
    : 0;

  elements.classDetailName.textContent = classroom.name || "Lớp học";
  elements.classDetailNote.textContent = classroom.note || "Oxford Discover Futures 2 · 9-theme vocabulary journey";
  elements.classDetailCode.textContent = classroom.id;
  elements.classDetailStudentCount.textContent = students.length;
  elements.classDetailActiveCount.textContent = activeCount;
  elements.classDetailAverage.textContent = `${average}%`;
  elements.classDetailEmpty.hidden = students.length > 0;
  elements.classDetailStudentTable.parentElement.parentElement.hidden = students.length === 0;
  elements.classDetailStudentTable.innerHTML = students.map(student => {
    const progress = themeOneProgress(student);
    return `
      <tr data-student-detail="${escapeHtml(student.id)}" data-detail-back="class-detail">
        <td><div class="student-identity"><span class="student-avatar">${escapeHtml(initials(student.name))}</span><div><strong>${escapeHtml(student.name)}</strong><small>@${escapeHtml(student.username || "chưa-có")}</small></div></div></td>
        <td class="progress-cell"><div><span><i style="width:${progress.percent}%"></i></span><strong>${progress.practiced}/${progress.total}</strong></div></td>
        <td>✅ ${progress.known}</td>
        <td>🔁 ${progress.review}</td>
        <td>${escapeHtml(formatDate(student.lastActive))}</td>
        <td><button class="row-detail-button" type="button" data-student-detail="${escapeHtml(student.id)}" data-detail-back="class-detail">Xem →</button></td>
      </tr>
    `;
  }).join("");
}

function openClassDetail(classCode) {
  if (!classByCode(classCode)) return;
  state.selectedClassCode = classCode;
  renderClassDetail();
  switchPanel("class-detail");
}

function renderStudentActivity() {
  const items = state.activity;
  elements.activityCountBadge.textContent = `${items.length} hoạt động`;
  elements.studentActivityEmpty.hidden = items.length > 0;
  elements.studentActivityTable.parentElement.parentElement.hidden = items.length === 0;
  elements.studentActivityTable.innerHTML = items.map(item => {
    const activityLabels = {
      flashcard: "🃏 Flashcard",
      reset: "🧹 Đặt lại tiến độ",
      "practice-matching": "🧩 Nối từ với nghĩa",
      "practice-spelling": "🎧 Nghe & viết từ",
      "practice-situation": "💬 Chọn từ theo ngữ cảnh",
      "practice-speed": "⚡ Speed Quiz"
    };
    const resultLabels = {
      known: ["Đã nhớ", "activity-result--known"],
      review: ["Cần ôn", "activity-result--review"],
      reset: ["Đặt lại", "activity-result--reset"],
      correct: ["Chính xác", "activity-result--known"],
      incorrect: ["Chưa đúng", "activity-result--reset"],
      completed: ["Hoàn thành", "activity-result--known"],
      "timed-out": ["Hết giờ", "activity-result--review"]
    };
    const hasScore = Number.isFinite(Number(item.score)) && Number.isFinite(Number(item.total)) && Number(item.total) > 0;
    const [statusResult, statusClass] = resultLabels[item.status] || ["Đã luyện", ""];
    const result = hasScore ? `${item.score}/${item.total} · ${statusResult}` : statusResult;
    const resultClass = hasScore
      ? (Number(item.score) === Number(item.total) ? "activity-result--known" : Number(item.score) > 0 ? "activity-result--review" : "activity-result--reset")
      : statusClass;
    const duration = Number(item.durationSeconds) > 0 ? `<small>${Number(item.durationSeconds)} giây</small>` : "";
    return `
      <tr>
        <td>${escapeHtml(formatDate(item.updatedAt))}</td>
        <td><strong>${escapeHtml(activityLabels[item.type] || item.exerciseTitle || "Luyện tập")}</strong>${duration}</td>
        <td><strong>${escapeHtml(item.word || "—")}</strong></td>
        <td>${escapeHtml(item.lesson || `Theme ${item.themeId || 1}`)}</td>
        <td><span class="activity-result ${resultClass}">${escapeHtml(result)}</span></td>
        <td>${Math.max(1, Number(item.attemptCount) || 1)}</td>
      </tr>
    `;
  }).join("");
}

function subscribeStudentActivity(studentId) {
  state.activityUnsubscribe?.();
  state.activityUnsubscribe = null;
  state.activity = [];
  renderStudentActivity();
  const activityQuery = query(
    collection(db, "students", studentId, "activity"),
    orderBy("updatedAt", "desc"),
    limit(250)
  );
  state.activityUnsubscribe = onSnapshot(activityQuery, snapshot => {
    hideDataError();
    state.activity = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    renderStudentActivity();
  }, showDataError);
}

function renderStudentDetail() {
  const student = studentById(state.selectedStudentId);
  if (!student) return;
  const classroom = classByCode(student.classCode);
  const classLabel = classroom ? `${classroom.name} · ${classroom.id}` : (student.classCode || "Chưa xếp lớp");
  const progress = themeOneProgress(student);
  const active = isRecentlyActive(student);

  elements.studentDetailAvatar.textContent = initials(student.name);
  elements.studentDetailName.textContent = student.name || "Học sinh";
  elements.studentDetailUsername.textContent = `@${student.username || "chưa-có"}`;
  elements.studentDetailClass.textContent = classLabel;
  elements.studentDetailStatus.className = `status-pill${active ? "" : " status-pill--idle"}`;
  elements.studentDetailStatus.textContent = active ? "Hoạt động" : "Chưa hoạt động";
  elements.studentInfoName.textContent = student.name || "—";
  elements.studentInfoUsername.textContent = `@${student.username || "chưa-có"}`;
  elements.studentInfoClass.textContent = classLabel;
  elements.studentInfoCreated.textContent = formatDate(student.createdAt);
  elements.studentInfoLastActive.textContent = formatDate(student.lastActive);
  elements.studentInfoAccount.textContent = student.accountReady ? "Đã kích hoạt" : "Chưa kích hoạt";
  elements.studentDetailPracticed.textContent = `${progress.practiced}/${progress.total}`;
  elements.studentDetailKnown.textContent = progress.known;
  elements.studentDetailReview.textContent = progress.review;
  elements.studentDetailPercent.textContent = `${progress.percent}%`;
  elements.studentDetailProgressBar.style.width = `${progress.percent}%`;
  elements.studentDetailProgressLabel.textContent = `${progress.percent}% hoàn thành`;

  const practice = student.themeProgress?.theme1?.practice || {};
  const practiceItems = [
    ["🧩", "Nối từ với nghĩa", valueCount(practice.matching?.completedWords)],
    ["🎧", "Nghe & viết từ", valueCount(practice.spelling?.completedWords)],
    ["💬", "Chọn từ theo ngữ cảnh", valueCount(practice.situation?.completedWords)],
    ["⚡", "Speed Quiz", valueCount(practice.speed?.completedWords)]
  ];
  elements.studentPracticeGrid.innerHTML = practiceItems.map(([icon, label, completed]) => {
    const safeCompleted = Math.min(60, Number(completed) || 0);
    const percent = Math.round((safeCompleted / 60) * 100);
    return `
      <div class="teacher-practice-item">
        <div><span>${icon}</span><strong>${escapeHtml(label)}</strong><em>${safeCompleted}/60</em></div>
        <span class="teacher-practice-track"><i style="width:${percent}%"></i></span>
        <small>${percent}% từ đã thực hành</small>
      </div>
    `;
  }).join("");

  elements.studentThemeGrid.innerHTML = THEME_NAMES.map((name, index) => {
    const number = index + 1;
    const raw = student.themeProgress?.[`theme${number}`] || {};
    const total = Number(raw.total) || (number === 1 ? 60 : 0);
    const practiced = Number(raw.practiced) || valueCount(raw.known) + valueCount(raw.review);
    const percent = total ? Math.min(100, Math.round((practiced / total) * 100)) : 0;
    const open = number === 1 || total > 0;
    return `
      <div class="student-theme-item${open ? " is-open" : " is-locked"}">
        <div><span>${open ? ["🧬", "🔭", "🫀", "🌱", "📖", "🤖", "🐚", "🏙️", "🚀"][index] : "🔒"}</span><small>THEME ${number}</small></div>
        <strong>${escapeHtml(name)}</strong>
        <span class="theme-mini-progress"><i style="width:${percent}%"></i></span>
        <p>${open ? `${practiced}/${total} từ · ${percent}%` : "Sắp mở khóa"}</p>
      </div>
    `;
  }).join("");
}

function openStudentDetail(studentId, backPanel = "students") {
  if (!studentById(studentId)) return;
  state.selectedStudentId = studentId;
  state.studentDetailBackPanel = backPanel;
  renderStudentDetail();
  subscribeStudentActivity(studentId);
  switchPanel("student-detail");
}

function renderDashboard() {
  renderMetrics();
  renderOverviewClasses();
  renderRecentStudents();
  renderClassCards();
  renderClassOptions();
  renderStudentTable();
  renderClassDetail();
  renderStudentDetail();
}

function createThemeProgress() {
  const progress = Object.fromEntries(Array.from({ length: 9 }, (_, index) => [
    `theme${index + 1}`,
    { known: [], review: [], practiced: 0, total: index === 0 ? 60 : 0 }
  ]));
  progress.theme1.practice = {
    matching: { completedWords: [], roundsCompleted: [] },
    spelling: { completedWords: [], correctWords: [] },
    situation: { completedWords: [], correctWords: [] },
    speed: { completedWords: [], bestScores: {} }
  };
  return progress;
}

function generateStudentPassword() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const random = Array.from({ length: 8 }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
  const password = `Va7!${random}`;
  elements.studentPasswordInput.value = password;
  elements.studentPasswordInput.type = "text";
  elements.toggleStudentPasswordButton.textContent = "🙈";
  elements.toggleStudentPasswordButton.setAttribute("aria-label", "Ẩn mật khẩu");
}

function readableStudentAccountError(error) {
  const code = error?.code || "";
  if (code.includes("email-already-in-use")) return "Tên đăng nhập này đã có tài khoản.";
  if (code.includes("weak-password")) return "Mật khẩu chưa đáp ứng chính sách bảo mật Firebase.";
  if (code.includes("operation-not-allowed")) return "Firebase chưa bật phương thức Email/Password.";
  if (code.includes("too-many-requests")) return "Đã tạo quá nhiều tài khoản trong thời gian ngắn. Vui lòng thử lại sau.";
  return "Chưa thể tạo tài khoản học sinh. Hãy kiểm tra Firebase Authentication và Firestore Rules.";
}

function showCreatedCredentials({ name, username, password }) {
  elements.createdStudentName.textContent = name;
  elements.createdStudentUsername.textContent = username;
  elements.createdStudentPassword.textContent = password;
  elements.credentialDialog.showModal();
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
  const safeUsername = normalizeStudentUsername(elements.studentUsernameInput.value);
  const password = elements.studentPasswordInput.value;
  const name = elements.studentNameInput.value.trim();
  if (state.students.some(student => student.username === safeUsername)) {
    showToast("Tên đăng nhập này đã tồn tại trong hệ thống.");
    return;
  }
  elements.createStudentButton.disabled = true;
  let createdUser = null;
  let profileCreated = false;
  try {
    await setPersistence(provisioningAuth, inMemoryPersistence);
    const credential = await createUserWithEmailAndPassword(
      provisioningAuth,
      studentUsernameToEmail(safeUsername),
      password
    );
    createdUser = credential.user;
    await setDoc(doc(db, "students", createdUser.uid), {
      authUid: createdUser.uid,
      accountReady: true,
      name,
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
    profileCreated = true;
    await signOut(provisioningAuth).catch(() => {});
    elements.createStudentForm.reset();
    elements.studentDialog.close();
    showCreatedCredentials({ name, username: safeUsername, password });
    showToast(`Đã tạo tài khoản @${safeUsername} ✨`);
  } catch (error) {
    if (createdUser && !profileCreated) await deleteUser(createdUser).catch(() => {});
    await signOut(provisioningAuth).catch(() => {});
    showToast(readableStudentAccountError(error));
  } finally {
    elements.createStudentButton.disabled = false;
  }
}

async function handleDeleteStudent() {
  const student = studentById(state.selectedStudentId);
  if (!student) return;
  elements.confirmDeleteStudentButton.disabled = true;
  elements.confirmDeleteStudentButton.textContent = "⏳ Đang xóa...";
  try {
    const activitySnapshot = await getDocs(collection(db, "students", student.id, "activity"));
    const refs = activitySnapshot.docs.map(item => item.ref);
    for (let start = 0; start < refs.length; start += 400) {
      const batch = writeBatch(db);
      refs.slice(start, start + 400).forEach(ref => batch.delete(ref));
      await batch.commit();
    }
    const profileBatch = writeBatch(db);
    profileBatch.delete(doc(db, "students", student.id));
    await profileBatch.commit();

    elements.deleteStudentDialog.close();
    state.activityUnsubscribe?.();
    state.activityUnsubscribe = null;
    state.activity = [];
    state.selectedStudentId = null;
    const destination = state.studentDetailBackPanel === "class-detail" && classByCode(state.selectedClassCode)
      ? "class-detail"
      : "students";
    switchPanel(destination);
    showToast(`Đã xóa hồ sơ và lịch sử của ${student.name} 🗑️`);
  } catch (error) {
    showDataError(error);
    showToast("Chưa thể xóa học sinh. Hãy kiểm tra Firestore Rules.");
  } finally {
    elements.confirmDeleteStudentButton.disabled = false;
    elements.confirmDeleteStudentButton.textContent = "🗑️ Xác nhận xóa";
  }
}

function handleDashboardDrilldown(event) {
  const classTarget = event.target.closest("[data-class-detail]");
  if (classTarget) {
    openClassDetail(classTarget.dataset.classDetail);
    return;
  }
  const studentTarget = event.target.closest("[data-student-detail]");
  if (studentTarget) {
    const backPanel = studentTarget.dataset.detailBack
      || (state.activePanel === "class-detail" ? "class-detail" : "students");
    openStudentDetail(studentTarget.dataset.studentDetail, backPanel);
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

  elements.generateStudentPasswordButton.addEventListener("click", generateStudentPassword);
  elements.toggleStudentPasswordButton.addEventListener("click", () => {
    const show = elements.studentPasswordInput.type === "password";
    elements.studentPasswordInput.type = show ? "text" : "password";
    elements.toggleStudentPasswordButton.textContent = show ? "🙈" : "👁️";
    elements.toggleStudentPasswordButton.setAttribute("aria-label", show ? "Ẩn mật khẩu" : "Hiện mật khẩu");
  });
  elements.copyStudentCredentialsButton.addEventListener("click", async () => {
    const content = `7OIC Vocabulary\nTên đăng nhập: ${elements.createdStudentUsername.textContent}\nMật khẩu: ${elements.createdStudentPassword.textContent}\nTrang học: https://thanh990522.github.io/7oic-vocabulary/`;
    try {
      await navigator.clipboard.writeText(content);
      showToast("Đã sao chép thông tin đăng nhập 📋");
    } catch {
      showToast("Không thể tự sao chép. Hãy ghi lại thông tin đang hiển thị.");
    }
  });
  elements.credentialDialog.addEventListener("close", () => {
    elements.createdStudentName.textContent = "học sinh";
    elements.createdStudentUsername.textContent = "";
    elements.createdStudentPassword.textContent = "";
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
    if (dialog === elements.studentDialog) {
      if (!elements.studentPasswordInput.value) generateStudentPassword();
      if (state.activePanel === "class-detail" && state.selectedClassCode) {
        elements.studentClassInput.value = state.selectedClassCode;
      }
    }
    dialog?.showModal();
  }));
  document.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => document.querySelector(`#${button.dataset.closeDialog}`)?.close()));

  elements.createClassForm.addEventListener("submit", handleCreateClass);
  elements.createStudentForm.addEventListener("submit", handleCreateStudent);
  elements.studentSearchInput.addEventListener("input", renderStudentTable);
  elements.studentClassFilter.addEventListener("change", renderStudentTable);
  [
    elements.overviewClassList,
    elements.recentStudentTable,
    elements.classCardGrid,
    elements.studentTableBody,
    elements.classDetailStudentTable
  ].forEach(container => container.addEventListener("click", handleDashboardDrilldown));
  elements.backFromClassButton.addEventListener("click", () => switchPanel("classes"));
  elements.backFromStudentButton.addEventListener("click", () => {
    const destination = state.studentDetailBackPanel === "class-detail" && classByCode(state.selectedClassCode)
      ? "class-detail"
      : state.studentDetailBackPanel;
    switchPanel(PANEL_TITLES[destination] ? destination : "students");
  });
  elements.openDeleteStudentButton.addEventListener("click", () => {
    const student = studentById(state.selectedStudentId);
    if (!student) return;
    elements.deleteStudentName.textContent = student.name || "học sinh";
    elements.deleteStudentDialog.showModal();
  });
  elements.confirmDeleteStudentButton.addEventListener("click", handleDeleteStudent);
}

bindEvents();
setPersistence(auth, browserLocalPersistence).catch(() => {});
setPersistence(provisioningAuth, inMemoryPersistence).catch(() => {});
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
