import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "../firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const sponsorNameEl = document.getElementById("sponsor-name");
const sponsorInstitutionEl = document.getElementById("sponsor-institution");
const sponsorEmailEl = document.getElementById("sponsor-email");
const sponsorEventsEl = document.getElementById("sponsor-events");
const sponsorApplicationsEl = document.getElementById("sponsor-applications");

// Check auth state
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      alert("User data not found. Contact admin.");
      return;
    }
    const userData = userDoc.data();

    // Profile info
    sponsorNameEl.textContent = userData.fullName || "";
    sponsorInstitutionEl.textContent = userData.institutionName || "";
    sponsorEmailEl.textContent = userData.email || "";

    // Fetch events sponsored by this sponsor
    const eventsQuery = query(collection(db, "events"), where("sponsorId", "==", user.uid));
    const eventsSnapshot = await getDocs(eventsQuery);
    sponsorEventsEl.innerHTML = "";
    eventsSnapshot.forEach((docSnap) => {
      const event = docSnap.data();
      const li = document.createElement("li");
      li.textContent = `${event.name} - ${event.date || "Date TBD"}`;
      sponsorEventsEl.appendChild(li);
    });

    // Fetch applications for these events
    const applicationsQuery = query(collection(db, "applications"), where("sponsorId", "==", user.uid));
    const applicationsSnapshot = await getDocs(applicationsQuery);
    sponsorApplicationsEl.innerHTML = "";
    applicationsSnapshot.forEach((docSnap) => {
      const app = docSnap.data();
      const li = document.createElement("li");
      li.textContent = `${app.studentName} applied for ${app.eventName}`;
      sponsorApplicationsEl.appendChild(li);
    });

  } catch (error) {
    console.error("Error loading sponsor dashboard:", error);
    alert("Error loading dashboard: " + error.message);
  }
});
