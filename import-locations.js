import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc
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

const importBtn = document.getElementById("importBtn");
const csvFile = document.getElementById("csvFile");
const status = document.getElementById("status");

importBtn.addEventListener("click", async () => {

    if (!csvFile.files.length) {
        alert("Please select a CSV file.");
        return;
    }

    const file = csvFile.files[0];

    const text = await file.text();

    const rows = text.trim().split("\n");

    if (rows.length <= 1) {
        alert("CSV file is empty.");
        return;
    }

    let count = 0;

    // Skip Header
    for (let i = 1; i < rows.length; i++) {

        const cols = rows[i].split(",");

        if (cols.length < 3) continue;

        const village = cols[0].trim();
        const taluka = cols[1].trim();
        const district = cols[2].trim();

        await addDoc(collection(db, "locations"), {

            village,
            taluka,
            district

        });

        count++;

        status.innerText = `Imported ${count} locations...`;

    }

    status.innerHTML = `✅ Successfully Imported ${count} Locations`;

});