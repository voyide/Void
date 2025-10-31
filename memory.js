// The secret brain of the operation.
document.addEventListener('DOMContentLoaded', () => {
    // ---===[ FIREBASE CONFIGURATION ]===---
    const firebaseConfig = {
      apiKey: "AIzaSyD19FsJIWCif0h-ExcGODrok4M7wk_bSBc",
      authDomain: "void-81e60.firebaseapp.com",
      databaseURL: "https://void-81e60-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "void-81e60",
      storageBucket: "void-81e60.appspot.com",
      messagingSenderId: "749357378719",
      appId: "1:749357378719:web:6343550759a405e5c1c6aa"
    };

    // ---===[ YOUR SECRET PASSWORD ]===---
    const SECRET_KEY = "alpha-zero-nine"; 
    //======================================

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    // Function to log the visitor's "impression" with full device data
    async function logImpression() {
        try {
            // --- Capture all available device data ---
            const deviceInfo = {
                userAgent: navigator.userAgent,
                screen: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                language: navigator.language,
                referrer: document.referrer || 'Direct visit', // Provide a default if referrer is empty
                timezoneOffset: new Date().getTimezoneOffset()
            };

            const response = await fetch('https://api.ipify.org?format=json');
            if (!response.ok) return; // Fail silently
            const data = await response.json();
            const ip = data.ip;
            const timestamp = new Date().toISOString();
            
            // --- Combine all data and push to Firebase ---
            db.ref('records').push({ ip, timestamp, deviceInfo });

            const engagementRef = db.ref('engagements');
            engagementRef.transaction(currentValue => (currentValue || 0) + 1);
        } catch (error) {
            console.error("Impression logging failed. This is hidden from users.");
        }
    }
    
    logImpression();

    // --- The Secret Trigger Logic (Button Version) ---
    const requestAccess = () => {
        const entry = prompt("ACCESS CODE:");
        if (entry === SECRET_KEY) {
            window.location.href = 'console.html';
        } else if (entry) {
            alert("ACCESS DENIED.");
        }
    };

    const accessButton = document.getElementById('access-point');
    accessButton.addEventListener('click', requestAccess);
});
