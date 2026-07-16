// ===============================
// auth.js
// ===============================

let currentUser = null;
let authMode = "login"; // login | signup

// -------------------------------
// فتح وغلق نافذة تسجيل الدخول
// -------------------------------
function openAuthPanel() {
  document.getElementById("authOverlay").classList.add("open");
  document.getElementById("authError").style.display = "none";
}

function closeAuthPanel() {
  document.getElementById("authOverlay").classList.remove("open");
}

// -------------------------------
// تغيير بين تسجيل الدخول وإنشاء حساب
// -------------------------------
function toggleAuthMode() {

  authMode = authMode === "login" ? "signup" : "login";

  const title = document.getElementById("authSubtitle");
  const btn = document.getElementById("authSubmitBtn");
  const sw = document.getElementById("authSwitchText");

  if (authMode === "login") {

    title.textContent = "سجّلي دخولك عشان تقدري تعدّلي على الموقع";

    btn.textContent = "تسجيل الدخول";

    sw.innerHTML =
      'لسه معملتيش حساب؟ <a onclick="toggleAuthMode()">اعملي حساب جديد</a>';

  } else {

    title.textContent = "اعملي حساب جديد";

    btn.textContent = "إنشاء حساب";

    sw.innerHTML =
      'عندك حساب بالفعل؟ <a onclick="toggleAuthMode()">تسجيل الدخول</a>';

  }

}

// -------------------------------
// تسجيل دخول أو إنشاء حساب
// -------------------------------
async function handleAuthSubmit() {

  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value.trim();

  const err = document.getElementById("authError");

  err.style.display = "none";

  if (!email || !password) {

    err.textContent = "اكتبي البريد وكلمة السر";

    err.style.display = "block";

    return;

  }

  try {

    let result;

    if (authMode === "signup") {

      result = await supabase.auth.signUp({

        email,

        password

      });

    } else {

      result = await supabase.auth.signInWithPassword({

        email,

        password

      });

    }

    if (result.error) throw result.error;

    currentUser = result.data.user;

    await ensureOwnerDoc();

    document.getElementById("loggedOutControls").style.display = "none";

    document.getElementById("loggedInControls").style.display = "inline-flex";

    document.getElementById("ownerControls").style.display = "inline-flex";

    document.getElementById("userEmailBadge").textContent = currentUser.email;

    closeAuthPanel();

  }

  catch (e) {

    err.textContent = e.message;

    err.style.display = "block";

  }

}

// -------------------------------
// تسجيل خروج
// -------------------------------
async function handleLogout() {

  await supabase.auth.signOut();

  currentUser = null;

  document.getElementById("loggedOutControls").style.display = "inline-flex";

  document.getElementById("loggedInControls").style.display = "none";

  document.getElementById("ownerControls").style.display = "none";

  if (editMode) {

    toggleEdit();

  }

}

// -------------------------------
// نسيت كلمة السر
// -------------------------------
async function handleForgotPassword() {

  const email = document.getElementById("authEmail").value.trim();

  if (!email) {

    alert("اكتبي البريد الإلكتروني أولاً");

    return;

  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {

    alert(error.message);

  } else {

    alert("تم إرسال رابط إعادة تعيين كلمة السر إلى بريدك.");

  }

}

// -------------------------------
// Google Login
// -------------------------------
async function handleGoogleSignIn() {

  await supabase.auth.signInWithOAuth({

    provider: "google"

  });

}

// -------------------------------
// التحقق عند فتح الموقع
// -------------------------------
supabase.auth.getSession().then(async ({ data }) => {

  if (data.session) {

    currentUser = data.session.user;

    document.getElementById("loggedOutControls").style.display = "none";

    document.getElementById("loggedInControls").style.display = "inline-flex";

    document.getElementById("ownerControls").style.display = "inline-flex";

    document.getElementById("userEmailBadge").textContent = currentUser.email;

    await ensureOwnerDoc();

  }

});

// -------------------------------
// مراقبة تسجيل الدخول والخروج
// -------------------------------
supabase.auth.onAuthStateChange((event, session) => {

  currentUser = session ? session.user : null;

});
