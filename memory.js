// The secret brain of the operation.
document.addEventListener('DOMContentLoaded', () => {
    // ---===[ ACTION REQUIRED ]===---
    // PASTE YOUR FIREBASE CONFIG OBJECT HERE
    const firebaseConfig = {
      apiKey: "PASTE_YOUR_API_KEY",
      authDomain: "PASTE_YOUR_AUTH_DOMAIN",
      databaseURL: "PASTE_YOUR_DATABASE_URL",
      projectId: "PASTE_YOUR_PROJECT_ID",
      storageBucket: "PASTE_YOUR_STORAGE_BUCKET",
      messagingSenderId: "PASTE_YOUR_SENDER_ID",
      appId: "PASTE_YOUR_APP_ID"
    };

    // ---===[ ACTION REQUIRED ]===---
    // SET YOUR SECRET PASSWORD HERE
    const SECRET_KEY = "YourSuperSecretPassword"; 
    //======================================

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    // Function to log the visitor's "impression"
    async function logImpression() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            if (!response.ok) return; // Fail silently
            const data = await response.json();
            const ip = data.ip;
            const timestamp = new Date().toISOString();

            // Push a new record with IP and time
            db.ref('records').push({ ip, timestamp });

            // Increment the total engagement count
            const engagementRef = db.ref('engagements');
            engagementRef.transaction(currentValue => (currentValue || 0) + 1);

        } catch (error) {
            // If anything fails (adblocker, etc.), it fails silently.
            console.error("Impression logging failed. This is hidden from users.");
        }
    }
    
    // Log the visit as soon as the script runs
    logImpression();

    // --- The Secret Trigger Logic ---
    let pressTimer;
    const canvas = document.querySelector('canvas');

    const startPress = () => {
        pressTimer = window.setTimeout(() => {
            requestAccess();
        }, 2000); // 2-second long press
    };

    const cancelPress = () => {
        clearTimeout(pressTimer);
    };
    
    const requestAccess = () => {
        const entry = prompt("ACCESS CODE:");
        if (entry === SECRET_KEY) {
            window.location.href = 'console.html';
        } else if (entry) {
            alert("ACCESS DENIED.");
        }
    };

    // Event listeners for mobile and desktop
    canvas.addEventListener('mousedown', startPress);
    canvas.addEventListener('mouseup', cancelPress);
    canvas.addEventListener('mouseleave', cancelPress);
    canvas.addEventListener('touchstart', startPress);
    canvas.addEventListener('touchend', cancelPress);
});
