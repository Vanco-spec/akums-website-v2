import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const visitorNameEl = document.getElementById("visitor-name");
const visitorEmailEl = document.getElementById("visitor-email");
const visitorEventsEl = document.getElementById("visitor-events");

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

    visitorNameEl.textContent = userData.fullName || "";
    visitorEmailEl.textContent = userData.email || "";

    const eventsSnapshot = await getDocs(collection(db, "events"));
    visitorEventsEl.innerHTML = "";
    eventsSnapshot.forEach((docSnap) => {
      const event = docSnap.data();
      const li = document.createElement("li");
      li.textContent = `${event.name} - ${event.date || "Date TBD"}`;
      visitorEventsEl.appendChild(li);
    });

  } catch (error) {
    console.error("Error loading visitor dashboard:", error);
    alert("Error loading dashboard: " + error.message);
  }
});
