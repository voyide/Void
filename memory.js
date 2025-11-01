// The secret brain of the operation.
document.addEventListener('DOMContentLoaded', async () => { // Made the main function async for await
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

    // Function to get GPU info
    const getGpuInfo = () => {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'N/A';
            }
        } catch (e) { /* Fallback */ }
        return 'N/A';
    };

    // --- The main logging function ---
    const logImpression = async () => {
        try {
            // --- Capture the full spectrum of data ---
            const [ipResponse, battery] = await Promise.all([
                fetch('https://api.ipify.org?format=json'),
                navigator.getBattery ? navigator.getBattery() : Promise.resolve(null)
            ]);

            const ipData = await ipResponse.json();

            const fullDeviceInfo = {
                // Standard Info
                userAgent: navigator.userAgent,
                screen: `${screen.width}x${screen.height}`,
                language: navigator.language,
                referrer: document.referrer || 'Direct visit',
                timezoneOffset: new Date().getTimezoneOffset(),
                // Hardware Fingerprint
                gpu: getGpuInfo(),
                cpuCores: navigator.hardwareConcurrency || 'N/A',
                ram: `${navigator.deviceMemory || 'N/A'} GB`,
                touchPoints: navigator.maxTouchPoints || 0,
                // Connection & Status
                connection: navigator.connection ? navigator.connection.effectiveType : 'N/A',
                battery: battery ? `${Math.round(battery.level * 100)}% (${battery.charging ? 'Charging' : 'Discharging'})` : 'N/A',
                plugins: Array.from(navigator.plugins).map(p => p.name)
            };

            const ip = ipData.ip;
            const timestamp = new Date().toISOString();
            
            db.ref('records').push({ ip, timestamp, fullDeviceInfo });
            db.ref('engagements').transaction(currentValue => (currentValue || 0) + 1);

        } catch (error) {
            console.error("Impression logging failed. This is hidden from users.");
        }
    };
    
    await logImpression();

    // --- The Secret Trigger Logic ---
    const requestAccess = () => {
        const entry = prompt("ACCESS CODE:");
        if (entry === SECRET_KEY) { window.location.href = 'console.html'; } 
        else if (entry) { alert("ACCESS DENIED."); }
    };
    document.getElementById('access-point').addEventListener('click', requestAccess);
});
