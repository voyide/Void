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

    db.ref('engagements').on('value', (snapshot) => {
        visitCountEl.textContent = snapshot.val() || '0';
    });

    db.ref('records').limitToLast(100).on('child_added', (snapshot) => {
        const log = snapshot.val();
        if (!log) return;

        const logEntryContainer = document.createElement('div');
        logEntryContainer.className = 'log-entry';

        const mainInfo = document.createElement('p');
        mainInfo.className = 'main-info';
        mainInfo.innerHTML = `[${log.timestamp}] :: CONNECTION FROM: ${log.ip}`;
        logEntryContainer.appendChild(mainInfo);

        // This handles both old and new log formats
        const info = log.fullDeviceInfo || log.deviceInfo; 
        if (info) {
            const offset = info.timezoneOffset;
            const offsetHours = -offset / 60;
            const timezoneString = `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`;

            const details = document.createElement('div');
            details.className = 'details-grid';
            details.innerHTML = `
                <p><strong>Screen:</strong> ${info.screen || 'N/A'}</p>
                <p><strong>Language:</strong> ${info.language || 'N/A'}</p>
                <p><strong>CPU Cores:</strong> ${info.cpuCores || 'N/A'}</p>
                <p><strong>RAM:</strong> ${info.ram || 'N/A'}</p>
                <p><strong>Touch:</strong> ${(info.touchPoints > 0 ? 'Yes' : 'No') || 'N/A'}</p>
                <p><strong>Timezone:</strong> ${timezoneString || 'N/A'}</p>
                <p><strong>Connection:</strong> ${info.connection || 'N/A'}</p>
                <p><strong>Battery:</strong> ${info.battery || 'N/A'}</p>
                <p class="full-width"><strong>GPU:</strong> ${info.gpu || 'N/A'}</p>
                <p class="full-width"><strong>Referrer:</strong> ${info.referrer || 'N/A'}</p>
                <p class="full-width"><strong>Agent:</strong> ${info.userAgent || 'N/A'}</p>
            `;
            logEntryContainer.appendChild(details);
        }

        logContainerEl.insertBefore(logEntryContainer, logContainerEl.firstChild);
    });
});
