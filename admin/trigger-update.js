// Utility script to trigger update notification for testing
// Run this in browser console to simulate a new version

function triggerUpdate() {
    // Set a newer version in localStorage to trigger update
    localStorage.setItem('serverVersion', '1.0.2');
    
    // Clear the last checked version to force update check
    localStorage.removeItem('lastCheckedVersion');
    
    // Trigger the update check
    if (window.VersionManager) {
        VersionManager.checkForUpdates();
    } else {
        console.log('VersionManager not loaded yet. Please wait a moment and try again.');
    }
}

function resetVersion() {
    // Reset to current version
    localStorage.setItem('serverVersion', '1.0.2');
    localStorage.setItem('lastCheckedVersion', '1.0.2');
    console.log('Version reset to 1.0.2');
}

function forceUpdate() {
    // Force the update notification to show again
    localStorage.setItem('serverVersion', '1.0.3');
    localStorage.removeItem('lastCheckedVersion');
    if (window.VersionManager) {
        VersionManager.checkForUpdates();
    }
    console.log('Forced update notification');
}

function checkVersionState() {
    console.log('Current Version State:');
    console.log('- APP_VERSION:', window.APP_VERSION);
    console.log('- Server Version:', localStorage.getItem('serverVersion'));
    console.log('- Last Checked Version:', localStorage.getItem('lastCheckedVersion'));
    console.log('- VersionManager:', window.VersionManager ? 'Loaded' : 'Not loaded');
}

// Make functions globally available
window.triggerUpdate = triggerUpdate;
window.resetVersion = resetVersion;
window.forceUpdate = forceUpdate;
window.checkVersionState = checkVersionState;

console.log('Update trigger utilities loaded:');
console.log('- triggerUpdate() - Simulates a new version available');
console.log('- resetVersion() - Resets to current version');
console.log('- forceUpdate() - Forces update notification to show again');
console.log('- checkVersionState() - Shows current version state'); 