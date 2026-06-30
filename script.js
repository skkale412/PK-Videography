import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy
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



const locationInput = document.getElementById("location");
const suggestionBox = document.getElementById("locationSuggestions");

let locations = [];

// =====================================
// PK Videography JavaScript
// =====================================

// Navbar
const header = document.querySelector(".header");

// Navigation Links
const navLinks = document.querySelectorAll(".nav-links a");

// All Sections
const sections = document.querySelectorAll("section");

// Sticky Navbar
window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.style.background = "rgba(0,0,0,0.85)";
        header.style.backdropFilter = "blur(12px)";

    } else {

        header.style.background = "transparent";

    }

});

// Active Navigation
window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});

// =====================================
// Scroll Reveal Animation
// =====================================

const reveals = document.querySelectorAll(".reveal");

function revealSections() {

    reveals.forEach(section => {

        const windowHeight = window.innerHeight;

        const revealTop = section.getBoundingClientRect().top;

        const revealPoint = 120;

        if (revealTop < windowHeight - revealPoint) {

            section.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealSections);

revealSections();

// =====================================
// Back To Top Button
// =====================================

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

    if(window.scrollY > 300){

        topBtn.style.display = "flex";

    }else{

        topBtn.style.display = "none";

    }

});

topBtn.addEventListener("click", () => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

async function loadLocations(){

    const snapshot = await getDocs(collection(db,"locations"));

    snapshot.forEach((doc)=>{

        const data = doc.data();

locations.push({
    village: data.village,
    taluka: data.taluka,
    district: data.district
});

    });

}

loadLocations();

locationInput.addEventListener("input",()=>{

    const value = locationInput.value.toLowerCase();

    suggestionBox.innerHTML="";

    if(value===""){

        suggestionBox.style.display="none";

        return;

    }

    const filtered = locations.filter(location=>{

    return (
        location.village.toLowerCase().includes(value) ||
        location.taluka.toLowerCase().includes(value) ||
        location.district.toLowerCase().includes(value)
    );

});

    filtered.slice(0,8).forEach(location=>{

        const div=document.createElement("div");

        div.innerText =
`📍 ${location.village}, ${location.taluka}, ${location.district}`;

        div.onclick=()=>{

            locationInput.value =
`${location.village}, ${location.taluka}`;

            suggestionBox.style.display="none";

        };

        suggestionBox.appendChild(div);

    });

    suggestionBox.style.display=
        filtered.length ? "block":"none";

});

document.addEventListener("click",(e)=>{

    if(!e.target.closest(".location-box")){

        suggestionBox.style.display="none";

    }

});

// =====================================
// Booking + UPI Payment
// =====================================

const bookingForm = document.getElementById("bookingForm");
const payNow = document.getElementById("payNow");

// Proceed to Payment
if (payNow) {

    payNow.addEventListener("click", async function (e) {

        e.preventDefault();

        const booking = {

            name: document.getElementById("name").value.trim(),
            location: document.getElementById("location").value.trim(),
            mobile: document.getElementById("mobile").value.trim(),
            event: document.getElementById("event").value,
            date: document.getElementById("date").value,
            message: document.getElementById("message").value.trim()

        };

        const bookingRef = collection(db, "bookings");

const existingBooking = query(
    bookingRef,
    where("date", "==", booking.date)
);

const snapshot = await getDocs(existingBooking);

if (!snapshot.empty) {

    alert("Sorry! This date is already booked.\nPlease choose another date.");

    return;

}

        // Validation
        if (
            booking.name === "" ||
            booking.location === "" ||
            booking.mobile === "" ||
            booking.event === ""
        ) {

            alert("Please fill all required details first.");
            return;

        }

// Save locally


      // Save booking details


        // Create Razorpay Order

const response = await fetch("/.netlify/functions/create-order", {

    method: "POST",

    headers: {

        "Content-Type": "application/json"

    },

    body: JSON.stringify({

        amount: 50000

    })

});

if (!response.ok) {
    alert("Unable to create payment order.");
    return;
}

const order = await response.json();

const options = {

    key: "rzp_live_T7vaqGfKsiMmYT",

    amount: order.amount,

    currency: order.currency,

    name: "PK Videography",

    description: "Advance Booking",

    order_id: order.id,

    handler: async function (response) {

    // Save booking after successful payment
    await addDoc(collection(db, "bookings"), {

        ...booking,

        paymentId: response.razorpay_payment_id,

        orderId: response.razorpay_order_id,

        status: "Paid",

        createdAt: new Date()

    });

    const whatsappMessage =
`Hello PK Videography!

Payment Successful ✅

Name: ${booking.name}
Location: ${booking.location}
Mobile: ${booking.mobile}
Event: ${booking.event}
Date: ${booking.date}
Message: ${booking.message}

Payment ID: ${response.razorpay_payment_id}

Please confirm my booking.`;

    const whatsappURL =
`https://wa.me/919934730101?text=${encodeURIComponent(whatsappMessage)}`;

    alert("Payment Successful!");

    const whatsappBtn = document.getElementById("whatsappBtn");

whatsappBtn.href = whatsappURL;

whatsappBtn.style.display = "inline-block";

},

    prefill: {

        name: booking.name,

        contact: booking.mobile

    },

    theme: {

        color: "#d4af37"

    },

modal: {
    ondismiss: function () {

        console.log("Payment cancelled");

        alert("Payment cancelled. Your booking has not been saved.");

    }
}
    
};

const razor = new Razorpay(options);

razor.on("payment.failed", function (response) {

    console.error(response.error);

    alert(
        "Payment Failed!\n\nReason: " +
        response.error.description
    );

});

razor.open();

    });

}

