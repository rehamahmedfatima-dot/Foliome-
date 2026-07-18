// ===============================
// auth.js
// Supabase Authentication
// ===============================

let currentUser = null;
let authMode = "login"; // login | signup

const authOverlay = document.getElementById("authOverlay");
const authError = document.getElementById("authError");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");

const authSubtitle = document.getElementById("authSubtitle");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authSwitchText = document.getElementById("authSwitchText");

const loggedOutControls = document.getElementById("loggedOutControls");
const loggedInControls = document.getElementById("loggedInControls");
const ownerControls = document.getElementById("ownerControls");
const userEmailBadge = document.getElementById("userEmailBadge");

function openAuthPanel() {
    authOverlay.classList.add("open");
    authError.style.display = "none";
}

function closeAuthPanel() {
    authOverlay.classList.remove("open");
}

function showError(message) {
    authError.textContent = message;
    authError.style.display = "block";
}

function hideError() {
    authError.style.display = "none";
}

function updateUILoggedIn(user) {
    loggedOutControls.style.display = "none";
    loggedInControls.style.display = "inline-flex";
    ownerControls.style.display = "inline-flex";
    userEmailBadge.textContent = user.email;
}

function updateUILoggedOut() {
    loggedOutControls.style.display = "inline-flex";
    loggedInControls.style.display = "none";
    ownerControls.style.display = "none";

    if (typeof editMode !== "undefined" && editMode) {
        toggleEdit();
    }
}

function toggleAuthMode() {
    authMode = authMode === "login" ? "signup" : "login";

    if (authMode === "login") {
        authSubtitle.textContent = "سجّلي دخولك عشان تقدري تعدّلي على الموقع";
        authSubmitBtn.textContent = "تسجيل الدخول";
        authSwitchText.innerHTML = 'لسه معملتيش حساب؟ <a onclick="toggleAuthMode()">اعملي حساب جديد</a>';
    } else {
        authSubtitle.textContent = "اعملي حساب جديد";
        authSubmitBtn.textContent = "إنشاء حساب";
        authSwitchText.innerHTML = 'عندك حساب بالفعل؟ <a onclick="toggleAuthMode()">تسجيل الدخول</a>';
    }
}

async function handleAuthSubmit() {
    hideError();
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();

    if (!email || !password) {
        showError("اكتبي البريد الإلكتروني وكلمة السر");
        return;
    }

    try {
        let response;
        if (authMode === "signup") {
            response = await sb.auth.signUp({ email, password });
        } else {
            response = await sb.auth.signInWithPassword({ email, password });
        }

        if (response.error) throw response.error;

        currentUser = response.data.user;

        if (typeof ensureOwnerDoc === "function") {
            await ensureOwnerDoc();
        }

        updateUILoggedIn(currentUser);
        closeAuthPanel();

    } catch (err) {
        showError(err.message);
    }
}

async function handleLogout() {
    const { error } = await sb.auth.signOut();
    if (error) { alert(error.message); return; }
    currentUser = null;
    updateUILoggedOut();
}

async function handleForgotPassword() {
    const email = authEmail.value.trim();
    if (!email) { alert("اكتبي البريد الإلكتروني أولاً"); return; }

    const { error } = await sb.auth.resetPasswordForEmail(email);
    if (error) { alert(error.message); }
    else { alert("تم إرسال رابط إعادة تعيين كلمة السر."); }
}

async function handleGoogleSignIn() {
    const { error } = await sb.auth.signInWithOAuth({ provider: "google" });
    if (error) { alert(error.message); }
}

async function checkSession() {
    const { data } = await sb.auth.getSession();
    if (!data.session) { updateUILoggedOut(); return; }
    currentUser = data.session.user;
    updateUILoggedIn(currentUser);
    if (typeof ensureOwnerDoc === "function") { await ensureOwnerDoc(); }
}

checkSession();

sb.auth.onAuthStateChange(async (event, session) => {
    if (session) {
        currentUser = session.user;
        updateUILoggedIn(currentUser);
        if (typeof ensureOwnerDoc === "function") { await ensureOwnerDoc(); }
    } else {
        currentUser = null;
        updateUILoggedOut();
    }
});
