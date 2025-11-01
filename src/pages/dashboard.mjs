// src/dashboard.js
import { auth, db } from "../firebase.mjs";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Initialize dashboard after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initDashboard();
});

async function initDashboard() {
  // Wait for auth to load user properly
  const user = auth.currentUser;
  if (!user) {
    const unsub = onAuthStateChanged(auth, async (u) => {
      unsub();
      await renderForUser(u);
    });
  } else {
    await renderForUser(user);
  }

  attachGlobalHandlers();
}

/* ===============================
   Render user info into dashboard
   =============================== */
async function renderForUser(user) {
  const nameEl = document.getElementById("user-name");
  const emailEl = document.getElementById("user-email");
  const roleEl = document.getElementById("user-role");
  const avatarEl = document.getElementById("avatar") || document.querySelector(".welcome-avatar i");
  const profileSummary = document.getElementById("profile-summary");
  const joinedEl = document.getElementById("user-joined");
  const lastLoginEl = document.getElementById("last-login");
  const nameMiniEl = document.getElementById("user-name-mini");
  const sinceEl = document.getElementById("user-since");

  // Handle guest / not signed in
  if (!user) {
    if (nameEl) nameEl.textContent = "Guest";
    if (emailEl) emailEl.textContent = "Not signed in";
    if (roleEl) roleEl.textContent = "Visitor";
    if (avatarEl) avatarEl.textContent = "👤";
    if (profileSummary) profileSummary.textContent = "Please sign in to access your dashboard.";
    if (nameMiniEl) nameMiniEl.textContent = "Guest";
    if (sinceEl) sinceEl.textContent = "—";
    return;
  }

  try {
    // Fetch user data from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);
    const userData = userSnap.exists() ? userSnap.data() : {};

    // Derive all display fields
    const displayName =
      userData.fullName ||
      user.displayName ||
      (user.email ? user.email.split("@")[0] : "User");

    const email = user.email || userData.email || "—";
    const role =
      userData.role || localStorage.getItem("userRole") || "Member";

    const memberSince =
      user.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString()
        : userData.createdAt
        ? new Date(userData.createdAt).toLocaleDateString()
        : "—";

    const lastLogin =
      user.metadata?.lastSignInTime
        ? new Date(user.metadata.lastSignInTime).toLocaleString()
        : "Just now";

    // Update DOM safely
    if (nameEl) nameEl.textContent = displayName;
    if (emailEl) emailEl.textContent = email;
    if (roleEl) roleEl.textContent = formatRole(role);

    if (avatarEl && avatarEl.tagName === "I") {
      avatarEl.className = "bi bi-person-fill"; // retain icon style
    } else if (avatarEl) {
      avatarEl.textContent = initials(displayName);
    }

    if (profileSummary)
      profileSummary.textContent = `Role: ${formatRole(role)}${
        memberSince ? " • Member since: " + memberSince : ""
      }`;

    if (joinedEl) joinedEl.textContent = memberSince;
    if (lastLoginEl) lastLoginEl.textContent = lastLogin;
    if (nameMiniEl) nameMiniEl.textContent = displayName;
    if (sinceEl) sinceEl.textContent = memberSince;

    // Cache locally
    localStorage.setItem("userRole", role);
    localStorage.setItem("isLoggedIn", "true");
  } catch (err) {
    console.error("Error loading user profile:", err);
    if (profileSummary)
      profileSummary.textContent = "Could not load profile details.";
  }
}

/* Format role for display */
function formatRole(role) {
  if (!role) return "Member";
  const clean = role.toLowerCase();
  if (clean.includes("admin")) return "Admin";
  if (clean.includes("rep")) return "Representative";
  if (clean.includes("leader")) return "Leader";
  if (clean.includes("student") || clean.includes("member")) return "Member";
  return "Visitor";
}

/* Create initials for avatar fallback */
function initials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}


/* =================================
   Global button + event listeners
   ================================= */
function attachGlobalHandlers() {
  // Logout button
  const logoutBtn =
    document.getElementById("logout-from-dashboard") ||
    document.getElementById("sign-out");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await signOut(auth);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
        window.location.href = "/index.html";
      } catch (err) {
        console.error("Sign out failed", err);
      }
    });
  }

  // Edit / Manage profile
  const manageProfile = document.getElementById("manage-profile");
  const editProfile = document.getElementById("edit-profile");
  [manageProfile, editProfile].forEach((el) => {
    if (el)
      el.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/update_profile.html";
      });
  });

  // "Notify me" interest buttons
  const notifySubscription = document.getElementById("notify-subscription");
  const notifyResources = document.getElementById("notify-resources");
  if (notifySubscription)
    notifySubscription.addEventListener("click", () =>
      notifyInterest("subscription")
    );
  if (notifyResources)
    notifyResources.addEventListener("click", () =>
      notifyInterest("resources")
    );
}

/* Store feature interest in Firestore + show toast */
async function notifyInterest(type) {
  const user = auth.currentUser;
  const toastEl = document.getElementById("dashboardToast");
  const body = document.getElementById("dashboardToastBody");

  try {
    await addDoc(collection(db, "notifications"), {
      uid: user ? user.uid : null,
      email: user ? user.email : null,
      type,
      createdAt: serverTimestamp(),
    });

    if (toastEl && body) {
      body.textContent =
        "Thanks — we'll notify you when this feature is available.";
      const t = new bootstrap.Toast(toastEl);
      t.show();
    }
  } catch (err) {
    console.error("Notify error:", err);
    if (toastEl && body) {
      body.textContent =
        "Could not register your interest. Try again later.";
      const t = new bootstrap.Toast(toastEl);
      t.show();
    }
  }
}
