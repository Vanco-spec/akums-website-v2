import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "../firebase.mjs";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const adminNameEl = document.getElementById("admin-name");
const adminEmailEl = document.getElementById("admin-email");
const adminUsersEl = document.getElementById("admin-users");
const adminApplicationsEl = document.getElementById("admin-applications");
const adminEventsEl = document.getElementById("admin-events");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists() || !userDoc.data().isAdmin) {
      alert("Access denied. Admins only.");
      window.location.href = "login.html";
      return;
    }
    const userData = userDoc.data();

    adminNameEl.textContent = userData.fullName || "";
    adminEmailEl.textContent = userData.email || "";

    // Load all users
    const usersSnapshot = await getDocs(collection(db, "users"));
    adminUsersEl.innerHTML = "";
    usersSnapshot.forEach((docSnap) => {
      const user = docSnap.data();
      const li = document.createElement("li");
      li.textContent = `${user.fullName} (${user.role}) - ${user.email}`;
      adminUsersEl.appendChild(li);
    });

    // Load all applications
    const applicationsSnapshot = await getDocs(collection(db, "applications"));
    adminApplicationsEl.innerHTML = "";
    applicationsSnapshot.forEach((docSnap) => {
      const app = docSnap.data();
      const li = document.createElement("li");
      li.textContent = `${app.studentName} applied for ${app.eventName}`;
      adminApplicationsEl.appendChild(li);
    });

    // Load all events
    const eventsSnapshot = await getDocs(collection(db, "events"));
    adminEventsEl.innerHTML = "";
    eventsSnapshot.forEach((docSnap) => {
      const event = docSnap.data();
      const li = document.createElement("li");
      li.textContent = `${event.name} - ${event.date || "Date TBD"}`;
      adminEventsEl.appendChild(li);
    });

  } catch (error) {
    console.error("Error loading admin dashboard:", error);
    alert("Error loading dashboard: " + error.message);
  }
});
