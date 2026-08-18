export const firebaseConfig = {
  apiKey: "AIzaSyBLYSGVx1dIs2D4aM1XEWsrrXKJgj67Ib4",
  authDomain: "oic-vocabulary.firebaseapp.com",
  projectId: "oic-vocabulary",
  storageBucket: "oic-vocabulary.firebasestorage.app",
  messagingSenderId: "1091311367678",
  appId: "1:1091311367678:web:c9ffcc499e1c925880fcaf",
  measurementId: "G-RNXDMCRYT9"
};

export const TEACHER_EMAIL = "hachithanh2251999@gmail.com";
export const FIREBASE_SDK_VERSION = "12.17.1";
export const STUDENT_EMAIL_DOMAIN = "students.oic-vocabulary.firebaseapp.com";

export function normalizeStudentUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "");
}

export function studentUsernameToEmail(username) {
  return `${normalizeStudentUsername(username)}@${STUDENT_EMAIL_DOMAIN}`;
}
