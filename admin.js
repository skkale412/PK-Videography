import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB9Fr0Acu2FU0rjOIwySJY65kLIp-r7OLk",
    authDomain: "pk-videography.firebaseapp.com",
    projectId: "pk-videography",
    storageBucket: "pk-videography.firebasestorage.app",
    messagingSenderId: "104934212977",
    appId: "1:104934212977:web:3e65632ef6d3284997a2d0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const bookingList = document.getElementById("bookingList");

const total = document.getElementById("total");
const pending = document.getElementById("pending");
const confirmed = document.getElementById("confirmed");
const rejected = document.getElementById("rejected");

onAuthStateChanged(auth, (user) => {

    if (user) {

        loadBookings();

    } else {

        const email = prompt("Enter Admin Email");
        const password = prompt("Enter Password");

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {

                loadBookings();

            })
            .catch((error) => {

                console.log(error);
                alert(error.code);

            });

    }

});

async function loadBookings() {

    bookingList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "bookings"));

    let totalCount = 0;
    let pendingCount = 0;
    let confirmedCount = 0;
    let rejectedCount = 0;

    snapshot.forEach((docSnap) => {

        totalCount++;

        const booking = docSnap.data();

        if (booking.status === "Pending") pendingCount++;
        if (booking.status === "Confirmed") confirmedCount++;
        if (booking.status === "Rejected") rejectedCount++;

        bookingList.innerHTML += `

        <div class="booking">

        <h2>${booking.name}</h2>

        <p><b>Location:</b> ${booking.location}</p>

        <p><b>Mobile:</b> ${booking.mobile}</p>

        <p><b>Event:</b> ${booking.event}</p>

        <p><b>Date:</b> ${booking.date}</p>

        <p><b>Message:</b> ${booking.message}</p>

        <p><b>Status:</b> ${booking.status}</p>

        <button class="accept"
        onclick="acceptBooking('${docSnap.id}')">

        Accept

        </button>

        <button class="reject"
        onclick="rejectBooking('${docSnap.id}')">

        Reject

        </button>

        <button class="delete"
        onclick="deleteBooking('${docSnap.id}')">

        Delete

        </button>

        </div>

        `;

    });

    total.innerText = totalCount;
    pending.innerText = pendingCount;
    confirmed.innerText = confirmedCount;
    rejected.innerText = rejectedCount;

}

window.acceptBooking = async function(id){

    await updateDoc(doc(db,"bookings",id),{

        status:"Confirmed"

    });

    location.reload();

}

window.rejectBooking = async function(id){

    await updateDoc(doc(db,"bookings",id),{

        status:"Rejected"

    });

    location.reload();

}

window.deleteBooking = async function(id){

    if(confirm("Delete booking?")){

        await deleteDoc(doc(db,"bookings",id));

        location.reload();

    }

}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    location.href = "index.html";

});