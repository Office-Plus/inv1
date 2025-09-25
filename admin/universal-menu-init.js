// Universal Menu Initialization Script
// This script ensures menu filtering works on ALL pages in the admin folder

(function() {
    'use strict';
    
    // Universal Menu Init Script Loaded
    
    // Function to apply menu filtering
    function applyMenuFiltering() {
        // Check if menu.js functions are available
        if (window.filterMenuItemsByRights) {
            window.filterMenuItemsByRights();
        } else if (window.ensureMenuLoaded) {
            window.ensureMenuLoaded();
        }
    }
    
    // Function to check if user is logged in
    function isUserLoggedIn() {
        const userEmail = localStorage.getItem('userEmail');
        const userId = localStorage.getItem('userId');
        return !!(userEmail && userId);
    }
    
    // Function to redirect to login if not authenticated
    function checkAuthentication() {
        if (!isUserLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
    
    // Function to initialize menu on current page
    function initializeMenuOnPage() {
        // Check authentication first
        if (!checkAuthentication()) {
            return;
        }
        
        // Wait for menu to be available
        const waitForMenu = (attempts = 0) => {
            const menu = document.querySelector('.side-menu');
            
            if (menu) {
                applyMenuFiltering();
            } else if (attempts < 20) {
                setTimeout(() => waitForMenu(attempts + 1), 200);
            }
        };
        
        // Start waiting for menu
        waitForMenu();
        
        // Also try after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(waitForMenu, 100);
            });
        } else {
            // DOM already ready
            setTimeout(waitForMenu, 100);
        }
    }
    
    // Function to refresh menu when user rights change
    function setupMenuRefresh() {
        // Listen for localStorage changes
        window.addEventListener('storage', function(e) {
            if (e.key === 'userRights' || e.key === 'userlevel') {
                setTimeout(applyMenuFiltering, 100);
            }
        });
        
        // Also listen for custom events (for same-tab updates)
        window.addEventListener('userRightsUpdated', function() {
            setTimeout(applyMenuFiltering, 100);
        });
    }
    
    // Initialize everything
    function init() {
        // Set up menu refresh listeners
        setupMenuRefresh();
        
        // Initialize menu on current page
        initializeMenuOnPage();
        
        // Also try initialization after a delay for pages that load menu dynamically
        setTimeout(initializeMenuOnPage, 1000);
        setTimeout(initializeMenuOnPage, 2000);
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also try on window load as fallback
    window.addEventListener('load', () => {
        setTimeout(initializeMenuOnPage, 500);
    });
    
    // Export functions for manual use
    window.universalMenuInit = {
        applyFiltering: applyMenuFiltering,
        initializeMenu: initializeMenuOnPage,
        checkAuth: checkAuthentication
    };
})();
