// src/signup.js
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const signupForm = document.getElementById("signup-form");
const roleSelect = document.getElementById("role");
const studentField = document.getElementById("student-field");
const sponsorField = document.getElementById("sponsor-field");

// 🔹 Show/hide role-specific fields
roleSelect.addEventListener("change", () => {
  const role = roleSelect.value;
  studentField.style.display = role === "student" ? "block" : "none";
  sponsorField.style.display = role === "sponsor" ? "block" : "none";
});

// 🔹 Handle signup form submission
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const role = roleSelect.value;
  const admissionNumber = document.getElementById("admissionNumber")?.value.trim();
  const institutionName = document.getElementById("institutionName")?.value.trim();

  // Validation
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  if (role === "student" && !admissionNumber) {
    alert("Please enter your admission number");
    return;
  }
  if (role === "sponsor" && !institutionName) {
    alert("Please enter your institution name");
    return;
  }

  try {
    // ✅ Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Save extra info to Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName,
      email,
      role,
      isAdmin: false,
      admissionNumber: role === "student" ? admissionNumber : null,
      institutionName: role === "sponsor" ? institutionName : null
    });

    // ✅ Save session data locally
    localStorage.setItem("userRole", role);
    localStorage.setItem("isLoggedIn", "true");

    alert("Signup successful!");
    signupForm.reset();
    window.location.href = "index.html"; // redirect after signup
  } catch (error) {
    console.error("Error signing up:", error);
    alert(error.message);
  }
});

// 🔹 Password visibility toggle
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", () => {
    const targetId = icon.getAttribute("data-target");
    const input = document.getElementById(targetId);

    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace("bi-eye", "bi-eye-slash");
    } else {
      input.type = "password";
      icon.classList.replace("bi-eye-slash", "bi-eye");
    }
  });
});

// 🔹 Back button
const backBtn = document.getElementById("backBtn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.history.back();
  });
}
