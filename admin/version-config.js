// Version Configuration - Prevent multiple declarations
if (typeof window.APP_VERSION === 'undefined') {
    window.APP_VERSION = '1.0.10';
    window.VERSION_TIMESTAMP = Date.now();
}

// Cache busting function
function getCacheBuster() {
    return `?v=${window.APP_VERSION}&t=${window.VERSION_TIMESTAMP}`;
}

// Version management - Prevent multiple declarations
if (typeof window.VersionManager === 'undefined') {
    window.VersionManager = {
        currentVersion: window.APP_VERSION,
        lastCheckedVersion: localStorage.getItem('lastCheckedVersion') || '1.0.0',
    
    // Check for updates
    checkForUpdates: function() {
        // In a real app, you'd check against a server
        // For now, we'll use localStorage to simulate version checking
        const serverVersion = localStorage.getItem('serverVersion') || window.APP_VERSION;
        
        if (this.isNewerVersion(serverVersion, this.lastCheckedVersion)) {
            this.showUpdateNotification();
        }
        
        // Update last checked version
        localStorage.setItem('lastCheckedVersion', serverVersion);
    },
    
    // Compare versions
    isNewerVersion: function(newVersion, oldVersion) {
        const newParts = newVersion.split('.').map(Number);
        const oldParts = oldVersion.split('.').map(Number);
        
        for (let i = 0; i < Math.max(newParts.length, oldParts.length); i++) {
            const newPart = newParts[i] || 0;
            const oldPart = oldParts[i] || 0;
            
            if (newPart > oldPart) return true;
            if (newPart < oldPart) return false;
        }
        
        return false;
    },
    
    // Show update notification
    showUpdateNotification: function() {
        const notification = document.createElement('div');
        notification.id = 'updateNotification';
        notification.innerHTML = `
            <div class="update-notification">
                <div class="update-content">
                    <div class="update-icon">🔄</div>
                    <div class="update-text">
                        <h3>New Version Available!</h3>
                        <p>A new version (${window.APP_VERSION}) of the application is available.</p>
                    </div>
                    <button class="update-btn" onclick="VersionManager.updateApp()">Update Now</button>
                    <button class="update-close" onclick="VersionManager.closeUpdateNotification()">×</button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .update-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 350px;
                animation: slideInRight 0.3s ease;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .update-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .update-icon {
                font-size: 24px;
                flex-shrink: 0;
            }
            
            .update-text {
                flex: 1;
            }
            
            .update-text h3 {
                margin: 0 0 5px 0;
                font-size: 16px;
            }
            
            .update-text p {
                margin: 0;
                font-size: 14px;
                opacity: 0.9;
            }
            
            .update-btn {
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
            }
            
            .update-btn:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-1px);
            }
            
            .update-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.7;
                transition: opacity 0.3s ease;
            }
            
            .update-close:hover {
                opacity: 1;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            this.closeUpdateNotification();
        }, 10000);
    },
    
    // Close update notification
    closeUpdateNotification: function() {
        const notification = document.getElementById('updateNotification');
        if (notification) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    },
    
    // Update app
    updateApp: function() {
        console.log('Update app called');
        
        // Update the last checked version to current version to prevent re-notification
        localStorage.setItem('lastCheckedVersion', window.APP_VERSION);
        console.log('Updated lastCheckedVersion to:', window.APP_VERSION);
        
        // Clear cache and reload
        if ('caches' in window) {
            caches.keys().then(names => {
                console.log('Clearing caches:', names);
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        
        // Clear localStorage cache (but keep user data and version info)
        const keysToKeep = ['userEmail', 'userId', 'userRights', 'userlevel', 'companyCode', 'lastCheckedVersion'];
        const allKeys = Object.keys(localStorage);
        console.log('Clearing localStorage keys:', allKeys.filter(key => !keysToKeep.includes(key)));
        allKeys.forEach(key => {
            if (!keysToKeep.includes(key)) {
                localStorage.removeItem(key);
            }
        });
        
        console.log('Reloading page...');
        // Reload the page
        window.location.reload(true);
    },
    
    // Get version info
    getVersionInfo: function() {
        return {
            version: this.currentVersion,
            timestamp: window.VERSION_TIMESTAMP,
            cacheBuster: getCacheBuster()
        };
    }
    };
}

// Make getCacheBuster globally available (only if not already defined)
if (typeof window.getCacheBuster === 'undefined') {
    window.getCacheBuster = getCacheBuster;
} 