import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const studentNameEl = document.getElementById("student-name");
const studentAdmissionEl = document.getElementById("student-admission");
const studentEmailEl = document.getElementById("student-email");
const studentEventsEl = document.getElementById("student-events");
const studentSubscriptionEl = document.getElementById("student-subscription");

// Check auth state
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Redirect to login if not logged in
    window.location.href = "login.html";
    return;
  }

  try {
    // Fetch user data
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      alert("User data not found. Contact admin.");
      return;
    }
    const userData = userDoc.data();

    // Fill profile info
    studentNameEl.textContent = userData.fullName || "";
    studentAdmissionEl.textContent = userData.admissionNumber || "";
    studentEmailEl.textContent = userData.email || "";
    studentSubscriptionEl.textContent = userData.subscription || "Not Subscribed";

    // Fetch upcoming events from Firestore
    const eventsSnapshot = await getDocs(collection(db, "events"));
    studentEventsEl.innerHTML = ""; // clear loading
    eventsSnapshot.forEach((docSnap) => {
      const event = docSnap.data();
      const li = document.createElement("li");
      li.textContent = `${event.name} - ${event.date || "Date TBD"}`;
      studentEventsEl.appendChild(li);
    });

  } catch (error) {
    console.error("Error loading dashboard:", error);
    alert("Error loading dashboard: " + error.message);
  }
});
