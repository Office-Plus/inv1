// Load Font Awesome
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
document.head.appendChild(link);

// Load version configuration (only if not already loaded)
if (!window.APP_VERSION) {
    const versionScript = document.createElement('script');
    versionScript.src = 'version-config.js?v=1.0.3&t=' + Date.now();
    versionScript.onload = function() {
        // Set app version after version config is loaded
        setAppVersion();
    };
    document.head.appendChild(versionScript);
} else {
    // Version already loaded, set it immediately
    setAppVersion();
}

// Set user email
const userEmail = localStorage.getItem('userEmail');
if (userEmail) {
    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement) {
        userEmailElement.textContent = userEmail;
    }
}

// Function to set app version
function setAppVersion() {
    const appVersionElement = document.getElementById('appVersion');
    if (appVersionElement) {
        if (window.APP_VERSION) {
            appVersionElement.textContent = 'v' + window.APP_VERSION;
        } else {
            // Fallback if version is not available
            appVersionElement.textContent = 'v1.0.3';
        }
    }
}

// Function to filter menu items based on user rights
function filterMenuItemsByRights() {
    // Prevent multiple simultaneous executions
    if (window.menuFilteringInProgress) {
        return;
    }
    window.menuFilteringInProgress = true;
    
    const userRights = localStorage.getItem('userRights');
    const userLevel = localStorage.getItem('userlevel');
    
    // If user is admin, show all menu items
    if ((userLevel && userLevel.toLowerCase() === 'admin') || (userRights && userRights.toLowerCase() === 'admin')) {
        const menuItems = document.querySelectorAll('.menu-items li');
        menuItems.forEach(item => {
            item.style.display = 'block';
        });
    } else if (userRights) {
        // Parse user rights (comma-separated string)
        const allowedRights = userRights.split(',').map(right => right.trim());
        
        // Hide all menu items first
        const menuItems = document.querySelectorAll('.menu-items li');
        menuItems.forEach(item => {
            item.style.display = 'none';
        });
        
        // First pass: Show individual menu items based on rights (including submenu items)
        menuItems.forEach(item => {
            const menuLink = item.querySelector('a[data-form]');
            if (menuLink) {
                const formId = menuLink.getAttribute('data-form');
                const linkText = menuLink.textContent.trim();
                
                // Skip dropdown parents for now (handle them in second pass)
                if (formId === 'masters' || formId === 'reports') {
                    return;
                }
                
                // Check if user has rights for this menu item
                const hasRights = allowedRights.some(right => {
                    // Direct match with form ID (for new format: "unitmaster")
                    if (right === formId) {
                        return true;
                    }
                    // Direct match with link text (for old format: "Unit Master")
                    if (right === linkText) {
                        return true;
                    }
                    // Specific mappings (for backward compatibility)
                    const mappings = {
                        'dashboard': 'Dashboard',
                        'unitmaster': 'Unit Master',
                        'itemmaster': 'Item Master',
                        'partmaster': 'Part Master',
                        'receive': 'Receive',
                        'issue': 'Issue',
                        'gatepass': 'Gate Pass',
                        'new-complaint': 'New Complaint',
                        'settings': 'Settings',
                        'usermanager': 'User Manager'
                    };
                    
                    if (mappings[formId] === right) {
                        return true;
                    }
                    
                    return false;
                });
                
                if (hasRights) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            } else {
                // Show items without data-form (like logout)
                item.style.display = 'block';
            }
        });
        
        // Second pass: Show dropdown parents if any of their children have rights
        menuItems.forEach(item => {
            const menuLink = item.querySelector('a[data-form]');
            if (menuLink) {
                const formId = menuLink.getAttribute('data-form');
                
                if (formId === 'masters') {
                    // Check if any masters submenu items have rights
                    const mastersSubmenuItems = document.querySelectorAll('.masters-submenu');
                    let hasAnyMastersRights = false;
                    
                    mastersSubmenuItems.forEach(subItem => {
                        if (subItem.style.display !== 'none') {
                            hasAnyMastersRights = true;
                        }
                    });
                    
                    if (hasAnyMastersRights) {
                        item.style.display = 'block';
                    }
                } else if (formId === 'reports') {
                    // Check if any reports submenu items have rights
                    const reportsSubmenuItems = document.querySelectorAll('.reports-submenu');
                    let hasAnyReportsRights = false;
                    
                    reportsSubmenuItems.forEach(subItem => {
                        if (subItem.style.display !== 'none') {
                            hasAnyReportsRights = true;
                        }
                    });
                    
                    if (hasAnyReportsRights) {
                        item.style.display = 'block';
                    }
                }
            }
        });
    } else {
        // No rights specified, hide all menu items except logout
        const menuItems = document.querySelectorAll('.menu-items li');
        menuItems.forEach(item => {
            const menuLink = item.querySelector('a[data-form]');
            if (!menuLink) {
                // Show items without data-form (like logout)
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Ensure masters and reports submenus are closed by default
    // But only if they don't have specific display settings from filtering
    const mastersSubmenuItems = document.querySelectorAll('.masters-submenu');
    mastersSubmenuItems.forEach(item => {
        // Only set to none if it wasn't already set by filtering logic
        if (item.style.display === 'block') {
            // Keep it visible if filtering made it visible
        } else {
            item.style.display = 'none';
        }
    });
    
    const reportsSubmenuItems = document.querySelectorAll('.reports-submenu');
    reportsSubmenuItems.forEach(item => {
        // Only set to none if it wasn't already set by filtering logic
        if (item.style.display === 'block') {
            // Keep it visible if filtering made it visible
        } else {
            item.style.display = 'none';
        }
    });
    
    // Reset the flag
    window.menuFilteringInProgress = false;
}

// Universal menu initialization for ALL pages
function initializeMenuOnAllPages() {
    // Wait for menu to be loaded
    const checkMenu = setInterval(() => {
        const menu = document.querySelector('.side-menu');
        if (menu) {
            filterMenuItemsByRights();
            
            // Ensure app version is set
            setAppVersion();
            
            // Check for updates after menu is loaded
            if (window.VersionManager) {
                VersionManager.checkForUpdates();
            }
            
            clearInterval(checkMenu);
        }
    }, 100);
    
    // Also try after delays to ensure menu loads properly
    setTimeout(() => {
        const menu = document.querySelector('.side-menu');
        if (menu) {
            filterMenuItemsByRights();
        }
    }, 500);
    
    setTimeout(() => {
        const menu = document.querySelector('.side-menu');
        if (menu) {
            filterMenuItemsByRights();
        }
    }, 1000);
    
    // Also try to set version after a short delay to ensure version-config.js is loaded
    setTimeout(() => {
        setAppVersion();
    }, 500);
}

// Call initializeMenuOnAllPages when DOM is ready
document.addEventListener('DOMContentLoaded', initializeMenuOnAllPages);

// Also call it when window loads (fallback for pages that load menu dynamically)
window.addEventListener('load', initializeMenuOnAllPages);

// Auto-refresh menu filtering when localStorage changes (for user rights updates)
window.addEventListener('storage', function(e) {
    if (e.key === 'userRights' || e.key === 'userlevel') {
        setTimeout(() => {
            filterMenuItemsByRights();
        }, 100);
    }
});

// Toggle menu function
window.toggleMenu = function() {
    const menu = document.querySelector('.side-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Function to refresh menu filtering (can be called when user rights are updated)
window.refreshMenuFiltering = function() {
    filterMenuItemsByRights();
}

// Centralized function to ensure menu is properly loaded and filtered on any page
window.ensureMenuLoaded = function() {
    // Multiple attempts to find and filter menu
    const attempts = [100, 300, 500, 1000, 2000];
    
    attempts.forEach((delay, index) => {
        setTimeout(() => {
            const menu = document.querySelector('.side-menu');
            if (menu) {
                filterMenuItemsByRights();
            }
        }, delay);
    });
    
    // Also try with interval as fallback
    const checkMenu = setInterval(() => {
        const menu = document.querySelector('.side-menu');
        if (menu) {
            filterMenuItemsByRights();
            clearInterval(checkMenu);
        }
    }, 200);
    
    // Clear interval after 5 seconds to prevent infinite checking
    setTimeout(() => {
        clearInterval(checkMenu);
    }, 5000);
}

// Toggle masters submenu
window.toggleMasters = function() {
    const submenuItems = document.querySelectorAll('.masters-submenu');
    const userRights = localStorage.getItem('userRights');
    const userLevel = localStorage.getItem('userlevel');
    
    // Check if user is admin - if so, toggle all items normally
    const isAdmin = (userLevel && userLevel.toLowerCase() === 'admin') || 
                   (userRights && userRights.toLowerCase() === 'admin');
    
    if (isAdmin) {
        // Admin user - toggle all submenu items normally
        submenuItems.forEach(item => {
            item.style.display = item.style.display === 'none' ? 'block' : 'none';
        });
    } else {
        // Non-admin user - only toggle items they have rights to
        const allowedRights = userRights ? userRights.split(',').map(right => right.trim()) : [];
        
        submenuItems.forEach(item => {
            const menuLink = item.querySelector('a[data-form]');
            if (menuLink) {
                const formId = menuLink.getAttribute('data-form');
                const linkText = menuLink.textContent.trim();
                
                // Check if user has rights for this submenu item
                const hasRights = allowedRights.some(right => {
                    if (right === formId || right === linkText) return true;
                    const mappings = {
                        'dashboard': 'Dashboard', 'unitmaster': 'Unit Master', 'itemmaster': 'Item Master',
                        'partmaster': 'Part Master', 'receive': 'Receive', 'issue': 'Issue',
                        'gatepass': 'Gate Pass', 'new-complaint': 'New Complaint',
                        'settings': 'Settings', 'usermanager': 'User Manager'
                    };
                    return mappings[formId] === right;
                });
                
                // Only toggle if user has rights to this item
                if (hasRights) {
                    item.style.display = item.style.display === 'none' ? 'block' : 'none';
                }
            }
        });
    }
}

// Toggle reports submenu
window.toggleReports = function() {
    const submenuItems = document.querySelectorAll('.reports-submenu');
    const userRights = localStorage.getItem('userRights');
    const userLevel = localStorage.getItem('userlevel');
    
    // Check if user is admin - if so, toggle all items normally
    const isAdmin = (userLevel && userLevel.toLowerCase() === 'admin') || 
                   (userRights && userRights.toLowerCase() === 'admin');
    
    if (isAdmin) {
        // Admin user - toggle all submenu items normally
        submenuItems.forEach(item => {
            item.style.display = item.style.display === 'none' ? 'block' : 'none';
        });
    } else {
        // Non-admin user - only toggle items they have rights to
        const allowedRights = userRights ? userRights.split(',').map(right => right.trim()) : [];
        
        submenuItems.forEach(item => {
            const menuLink = item.querySelector('a[data-form]');
            if (menuLink) {
                const formId = menuLink.getAttribute('data-form');
                const linkText = menuLink.textContent.trim();
                
                // Check if user has rights for this submenu item
                const hasRights = allowedRights.some(right => {
                    if (right === formId || right === linkText) return true;
                    const mappings = {
                        'dashboard': 'Dashboard', 'unitmaster': 'Unit Master', 'itemmaster': 'Item Master',
                        'partmaster': 'Part Master', 'receive': 'Receive', 'issue': 'Issue',
                        'gatepass': 'Gate Pass', 'new-complaint': 'New Complaint',
                        'settings': 'Settings', 'usermanager': 'User Manager'
                    };
                    return mappings[formId] === right;
                });
                
                // Only toggle if user has rights to this item
                if (hasRights) {
                    item.style.display = item.style.display === 'none' ? 'block' : 'none';
                }
            }
        });
    }
}

// Generic dropdown toggle function for any dropdown type
window.toggleDropdown = function(dropdownClass) {
    const submenuItems = document.querySelectorAll(`.${dropdownClass}`);
    const userRights = localStorage.getItem('userRights');
    const userLevel = localStorage.getItem('userlevel');
    
    // Check if user is admin - if so, toggle all items normally
    const isAdmin = (userLevel && userLevel.toLowerCase() === 'admin') || 
                   (userRights && userRights.toLowerCase() === 'admin');
    
    if (isAdmin) {
        // Admin user - toggle all submenu items normally
        submenuItems.forEach(item => {
            item.style.display = item.style.display === 'none' ? 'block' : 'none';
        });
    } else {
        // Non-admin user - only toggle items they have rights to
        const allowedRights = userRights ? userRights.split(',').map(right => right.trim()) : [];
        
        submenuItems.forEach(item => {
            const menuLink = item.querySelector('a[data-form]');
            if (menuLink) {
                const formId = menuLink.getAttribute('data-form');
                const linkText = menuLink.textContent.trim();
                
                // Check if user has rights for this submenu item
                const hasRights = allowedRights.some(right => {
                    if (right === formId || right === linkText) return true;
                    const mappings = {
                        'dashboard': 'Dashboard', 'unitmaster': 'Unit Master', 'itemmaster': 'Item Master',
                        'partmaster': 'Part Master', 'receive': 'Receive', 'issue': 'Issue',
                        'gatepass': 'Gate Pass', 'new-complaint': 'New Complaint',
                        'settings': 'Settings', 'usermanager': 'User Manager'
                    };
                    return mappings[formId] === right;
                });
                
                // Only toggle if user has rights to this item
                if (hasRights) {
                    item.style.display = item.style.display === 'none' ? 'block' : 'none';
                }
            }
        });
    }
}

// Logout function
window.logout = function() {
    // First clear all localStorage items
    localStorage.clear();  // This will remove all items including userRights and userlevel
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRights');
    localStorage.removeItem('userlevel');
    localStorage.removeItem('companyCode');
    localStorage.removeItem(' faceId');
    
    // Check if Firebase auth is available (Firebase v9+ modular SDK)
    if (window.auth) {
        // Use Firebase v9+ modular SDK
        window.auth.signOut().then(() => {
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error('Error signing out:', error);
            // Still redirect even if signOut fails
            window.location.href = 'login.html';
        });
    } else {
        // Fallback: just redirect to login if Firebase auth is not available
        console.log('Firebase auth not available, redirecting to login');
        window.location.href = 'login.html';
    }
} 