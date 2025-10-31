// The secret brain of the operation.
document.addEventListener('DOMContentLoaded', () => {
    // ---===[ FIREBASE CONFIGURATION ]===---
    // This has been updated with your project details.
    const firebaseConfig = {
      apiKey: "AIzaSyD19FsJIWCif0h-ExcGODrok4M7wk_bSBc",
      authDomain: "void-81e60.firebaseapp.com",
      databaseURL: "https://void-81e60-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "void-81e60",
      storageBucket: "void-81e60.appspot.com", // Corrected storage bucket URL
      messagingSenderId: "749357378719",
      appId: "1:749357378719:web:6343550759a405e5c1c6aa"
    };

    // ---===[ YOUR SECRET PASSWORD ]===---
    // Change this to whatever you want.
    const SECRET_KEY = "spycevoid"; 
    //======================================

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    // Function to log the visitor's "impression"
    async function logImpression() {
        try {
            // We use a third-party service to get the IP, as this is client-side.
            const response = await fetch('https://api.ipify.org?format=json');
            if (!response.ok) return; // Fail silently if the service is down
            const data = await response.json();
            const ip = data.ip;
            const timestamp = new Date().toISOString();

            // Push a new record with IP and time to the 'records' path in your database
            db.ref('records').push({ ip, timestamp });

            // Increment the total engagement count atomically
            const engagementRef = db.ref('engagements');
            engagementRef.transaction(currentValue => (currentValue || 0) + 1);

        } catch (error) {
            // If anything fails (adblocker, network error), it fails silently.
            // This ensures the art site never looks broken to a normal user.
            console.error("Impression logging failed. This is hidden from users.");
        }
    }
    
    // Log the visit as soon as the script runs
    logImpression();

    // --- The Secret Trigger Logic ---
    let pressTimer;
    const canvas = document.querySelector('canvas');

    // This function starts a 2-second timer when the user presses on the screen.
    const startPress = (e) => {
        // Prevent default browser actions like text selection on long press
        e.preventDefault(); 
        pressTimer = window.setTimeout(() => {
            requestAccess();
        }, 2000); // 2-second long press
    };

    // If the user lifts their finger before 2 seconds, the timer is cancelled.
    const cancelPress = () => {
        clearTimeout(pressTimer);
    };
    
    // This function is called only if the long press is successful.
    const requestAccess = () => {
        const entry = prompt("ACCESS CODE:");
        if (entry === SECRET_KEY) {
            // If the code is correct, redirect to the hidden console.
            window.location.href = 'console.html';
        } else if (entry) { // If they entered something but it was wrong
            alert("ACCESS DENIED.");
        }
    };

    // Event listeners for both mobile (touchstart/touchend) and desktop (mousedown/mouseup)
    canvas.addEventListener('mousedown', startPress);
    canvas.addEventListener('mouseup', cancelPress);
    canvas.addEventListener('mouseleave', cancelPress); // Also cancel if mouse leaves the canvas
    canvas.addEventListener('touchstart', startPress);
    canvas.addEventListener('touchend', cancelPress);
});
