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
    //======================================

    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    const visitCountEl = document.getElementById('visit-count');
    const logContainerEl = document.getElementById('log-container');

    const engagementRef = db.ref('engagements');
    engagementRef.on('value', (snapshot) => {
        visitCountEl.textContent = snapshot.val() || '0';
    });

    const recordsRef = db.ref('records').limitToLast(100);
    recordsRef.on('child_added', (snapshot) => {
        const log = snapshot.val();
        if (!log) return;

        // Create a container for the entire log entry
        const logEntryContainer = document.createElement('div');
        logEntryContainer.className = 'log-entry';

        // Main info: Timestamp and IP
        const mainInfo = document.createElement('p');
        mainInfo.innerHTML = `<strong>[${log.timestamp}] :: CONNECTION FROM: ${log.ip}</strong>`;
        logEntryContainer.appendChild(mainInfo);

        // Check if the detailed deviceInfo exists (for backward compatibility with old logs)
        if (log.deviceInfo) {
            const info = log.deviceInfo;
            
            // Convert timezone offset from minutes to a readable format (e.g., UTC-5)
            const offset = info.timezoneOffset;
            const offsetHours = -offset / 60;
            const timezoneString = `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`;

            const details = document.createElement('div');
            details.className = 'log-details';
            details.innerHTML = `
                <span>Screen: ${info.screen}</span>
                <span>Language: ${info.language}</span>
                <span>Timezone: ${timezoneString}</span>
                <p>Referrer: ${info.referrer}</p>
                <p class="user-agent">User Agent: ${info.userAgent}</p>
            `;
            logEntryContainer.appendChild(details);
        }

        // Add the newest entry to the top of the log container
        logContainerEl.insertBefore(logEntryContainer, logContainerEl.firstChild);
    });
});
