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

// =====================================
// Booking + UPI Payment
// =====================================

const bookingForm = document.getElementById("bookingForm");
const payNow = document.getElementById("payNow");
const paidBtn = document.getElementById("paidBtn");

// Proceed to Payment
if (payNow) {

    payNow.addEventListener("click", function (e) {

        e.preventDefault();

        const booking = {

            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            mobile: document.getElementById("mobile").value.trim(),
            event: document.getElementById("event").value,
            date: document.getElementById("date").value,
            message: document.getElementById("message").value.trim()

        };

        // Validation
        if (
            booking.name === "" ||
            booking.email === "" ||
            booking.mobile === "" ||
            booking.event === ""
        ) {

            alert("Please fill all required details first.");
            return;

        }

      // Save booking details
localStorage.setItem("bookingData", JSON.stringify(booking));

const paymentCard = document.querySelector(".payment-card");

if (paymentCard) {

    paymentCard.style.display = "block";

    paymentCard.scrollIntoView({
        behavior: "smooth"
    });

}

if (paidBtn) {

    paidBtn.style.display = "block";

}
        // Open UPI App
        const upi =
            "upi://pay?pa=9934730101@ybl&pn=PK%20Videography&am=500&cu=INR&tn=Advance%20Booking";

        window.location.href = upi;

    });

}

// I've Paid Button
if (paidBtn) {

    paidBtn.addEventListener("click", function () {

        const booking = JSON.parse(localStorage.getItem("bookingData"));

        if (!booking) {

            alert("Booking details not found.");
            return;

        }

        const whatsappMessage =
`Hello PK Videography!

Payment Completed ✅

Name: ${booking.name}
Email: ${booking.email}
Mobile: ${booking.mobile}
Event: ${booking.event}
Date: ${booking.date}
Message: ${booking.message}

I have paid ₹500 advance.
Please confirm my booking.`;

        const url =
`https://wa.me/919934730101?text=${encodeURIComponent(whatsappMessage)}`;

        window.open(url, "_blank");

    });

}