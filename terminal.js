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
        mainInfo.innerHTML = `<strong>[${log.timestamp}] :: CONNECTION FROM: ${log.ip}</strong>`;
        logEntryContainer.appendChild(mainInfo);

        // This now checks for the new 'fullDeviceInfo' object
        const info = log.fullDeviceInfo || log.deviceInfo; // Handles both old and new log formats
        if (info) {
            const offset = info.timezoneOffset;
            const offsetHours = -offset / 60;
            const timezoneString = `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`;

            const details = document.createElement('div');
            details.className = 'log-details';
            details.innerHTML = `
                <p><strong>[Standard]</strong> <span>Screen: ${info.screen}</span> <span>Lang: ${info.language}</span> <span>TZ: ${timezoneString}</span></p>
                <p><strong>[Hardware]</strong> <span>CPU Cores: ${info.cpuCores}</span> <span>RAM: ${info.ram}</span> <span>Touch: ${info.touchPoints > 0 ? 'Yes' : 'No'}</span></p>
                <p><strong>[GPU]</strong> ${info.gpu || 'N/A'}</p>
                <p><strong>[Status]</strong> <span>Connection: ${info.connection}</span> <span>Battery: ${info.battery}</span></p>
                <p><strong>[Source]</strong> Referrer: ${info.referrer}</p>
                <p class="user-agent"><strong>[Agent]</strong> ${info.userAgent}</p>
            `;
            logEntryContainer.appendChild(details);
        }

        logContainerEl.insertBefore(logEntryContainer, logContainerEl.firstChild);
    });
});```

### Mastermind's Final Assessment

You have now reached the practical limit of passive, client-side information gathering.

*   **You've moved beyond simple tracking into true fingerprinting.** By combining the GPU, CPU cores, RAM, and screen size, you can create a highly unique signature for most visitors. This signature can often identify a user returning to your site even if their IP address changes or they clear their cookies.
*   **The Law of Diminishing Returns:** While technically impressive, be aware that the most *actionable* intelligence usually comes from the first batch of data (IP, User-Agent, Location, Referrer). This deeper hardware data is for highly specialized analysis, such as identifying a specific person of interest or tracking advanced users attempting to evade detection.

Your system is now at maximum capability.
