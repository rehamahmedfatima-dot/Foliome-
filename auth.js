// ===============================
// auth.js
// Supabase Authentication
// ===============================

let currentUser = null;
let authMode = "login"; // login | signup

// ===============================
// عناصر الواجهة
// ===============================
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

// ===============================
// واجهة المستخدم
// ===============================

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

// ===============================
// تبديل بين تسجيل الدخول وإنشاء حساب
// ===============================

function toggleAuthMode() {

    authMode = authMode === "login"
        ? "signup"
        : "login";

    if (authMode === "login") {

        authSubtitle.textContent =
            "سجّلي دخولك عشان تقدري تعدّلي على الموقع";

        authSubmitBtn.textContent =
            "تسجيل الدخول";

        authSwitchText.innerHTML =
            'لسه معملتيش حساب؟ <a onclick="toggleAuthMode()">اعملي حساب جديد</a>';

    } else {

        authSubtitle.textContent =
            "اعملي حساب جديد";

        authSubmitBtn.textContent =
            "إنشاء حساب";

        authSwitchText.innerHTML =
            'عندك حساب بالفعل؟ <a onclick="toggleAuthMode()">تسجيل الدخول</a>';

    }

}

// ===============================
// إنشاء حساب / تسجيل دخول
// ===============================

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

            response = await supabase.auth.signUp({
                email,
                password
            });

        } else {

            response = await supabase.auth.signInWithPassword({
                email,
                password
            });

        }

        if (response.error)
            throw response.error;

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

// ===============================
// تسجيل الخروج
// ===============================

async function handleLogout() {

    const { error } = await supabase.auth.signOut();

    if (error) {

        alert(error.message);
        return;

    }

    currentUser = null;

    updateUILoggedOut();

}

// ===============================
// نسيت كلمة السر
// ===============================

async function handleForgotPassword() {

    const email = authEmail.value.trim();

    if (!email) {

        alert("اكتبي البريد الإلكتروني أولاً");
        return;

    }

    const { error } =
        await supabase.auth.resetPasswordForEmail(email);

    if (error) {

        alert(error.message);

    } else {

        alert("تم إرسال رابط إعادة تعيين كلمة السر.");

    }

}

// ===============================
// تسجيل دخول بجوجل
// ===============================

async function handleGoogleSignIn() {

    const { error } =
        await supabase.auth.signInWithOAuth({

            provider: "google"

        });

    if (error) {

        alert(error.message);

    }

}

// ===============================
// عند فتح الموقع
// ===============================

async function checkSession() {

    const { data } =
        await supabase.auth.getSession();

    if (!data.session) {

        updateUILoggedOut();
        return;

    }

    currentUser = data.session.user;

    updateUILoggedIn(currentUser);

    if (typeof ensureOwnerDoc === "function") {
        await ensureOwnerDoc();
    }

}

checkSession();

// ===============================
// مراقبة حالة تسجيل الدخول
// ===============================

supabase.auth.onAuthStateChange(async (event, session) => {

    if (session) {

        currentUser = session.user;

        updateUILoggedIn(currentUser);

        if (typeof ensureOwnerDoc === "function") {
            await ensureOwnerDoc();
        }

    } else {

        currentUser = null;

        updateUILoggedOut();

    }

});
