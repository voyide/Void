document.addEventListener('DOMContentLoaded', () => {
    // ---===[ FIREBASE CONFIGURATION ]===---
    // This configuration must match the one in memory.js.
    const firebaseConfig = {
      apiKey: "AIzaSyD19FsJIWCif0h-ExcGODrok4M7wk_bSBc",
      authDomain: "void-81e60.firebaseapp.com",
      databaseURL: "https://void-81e60-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "void-81e60",
      storageBucket: "void-81e60.appspot.com", // Corrected storage bucket URL
      messagingSenderId: "749357378719",
      appId: "1:749357378719:web:6343550759a405e5c1c6aa"
    };
    //======================================

    // Initialize the Firebase connection
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    const visitCountEl = document.getElementById('visit-count');
    const logContainerEl = document.getElementById('log-container');

    // Create a real-time listener for the total engagement count.
    // 'on('value', ...)' means this will update automatically if the data changes.
    const engagementRef = db.ref('engagements');
    engagementRef.on('value', (snapshot) => {
        visitCountEl.textContent = snapshot.val() || '0';
    });

    // Create a listener for new records being added.
    // 'on('child_added', ...)' is efficient as it only fires for new items.
    // We limit the query to the last 100 entries to avoid loading too much data.
    const recordsRef = db.ref('records').limitToLast(100); 
    recordsRef.on('child_added', (snapshot) => {
        const log = snapshot.val();
        if (!log) return; // Sanity check

        const logEntry = document.createElement('p');
        // Format the output for the console display
        logEntry.textContent = `[${log.timestamp}] :: CONNECTION FROM: ${log.ip}`;
        
        // Add the newest entry to the top of the log container
        logContainerEl.insertBefore(logEntry, logContainerEl.firstChild);
    });
});
