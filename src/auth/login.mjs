// src/auth/login.js
import { auth, db } from "../firebase.mjs";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// ===== Form submission =====
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get Firestore user document
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        showErrorToast("User data not found. Please contact admin.");
        return;
      }

      const userData = userDoc.data();
      const role = userData.role || "user";
      const isAdmin = userData.isAdmin || false;

      // Save basic info in localStorage
      localStorage.setItem("userRole", role);
      localStorage.setItem("isAdmin", isAdmin);
      localStorage.setItem("isLoggedIn", "true");

      showSuccessToast("✅ Login successful! Redirecting...");

      // Redirect after short delay
      setTimeout(() => window.location.href = "index.html", 2000);

    } catch (error) {
      console.error("Login error:", error);
      handleAuthError(error);
    }
  });
}

// ===== Helper functions =====
function showSuccessToast(message) {
  const toastEl = document.getElementById("loginSuccessToast");
  if (toastEl) {
    toastEl.querySelector(".toast-body").innerHTML = message;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
}

function showErrorToast(message) {
  const toastEl = document.getElementById("loginErrorToast");
  if (toastEl) {
    toastEl.querySelector(".toast-body").innerHTML = `❌ ${message}`;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
}

function handleAuthError(error) {
  let message;
  switch (error.code) {
    case "auth/invalid-email":
      message = "Invalid email format. Please check and try again.";
      break;
    case "auth/user-not-found":
      message = "No account found with this email. Please sign up first.";
      break;
    case "auth/wrong-password":
      message = "Incorrect password. Try again or reset it.";
      break;
    case "auth/too-many-requests":
      message = "Too many failed attempts. Please wait and retry.";
      break;
    case "auth/network-request-failed":
      message = "Network error. Check your internet connection.";
      break;
    default:
      message = error.message || "Something went wrong. Please try again.";
  }
  showErrorToast(message);
}

// ===== Password toggle visibility =====
document.querySelectorAll('.toggle-password').forEach(icon => {
  icon.addEventListener('click', () => {
    const targetId = icon.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (!input) return;

    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace("bi-eye", "bi-eye-slash");
    } else {
      input.type = "password";
      icon.classList.replace("bi-eye-slash", "bi-eye");
    }
  });
});

// ===== Back button =====
const backBtn = document.getElementById("backBtn");
if (backBtn) {
  backBtn.addEventListener("click", () => window.history.back());
}
