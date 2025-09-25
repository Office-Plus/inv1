# Version Management System v1.0.1

## Overview
This system provides automatic version checking, cache busting, and update notifications for the complaints management application.

## Features

### 1. Version Display
- Shows current version (v1.0.1) in the menu header
- Version is prominently displayed next to user email

### 2. Cache Busting
- Automatically adds version parameters to all resource URLs
- Prevents browser caching issues when deploying updates
- Format: `?v=1.0.1&t=timestamp`

### 3. Update Notifications
- Beautiful popup notification when new version is available
- Auto-dismisses after 10 seconds
- Manual "Update Now" button for immediate refresh
- Smooth animations and modern UI

### 4. Automatic Update Detection
- Checks for updates when pages load
- Compares version numbers intelligently
- Stores last checked version to avoid repeated notifications

## Files Added/Modified

### New Files:
- `version-config.js` - Core version management logic
- `trigger-update.js` - Testing utilities
- `VERSION_MANAGEMENT.md` - This documentation

### Modified Files:
- `menu.html` - Added version display in header
- `menu.js` - Integrated version checking
- `new-complaint.html` - Added cache busting and version management

## How to Use

### For Developers:

1. **Update Version Number:**
   ```javascript
   // In version-config.js
   const APP_VERSION = '1.0.1'; // Change this when deploying
   ```

2. **Deploy Updates:**
   - Update the version number
   - Upload all files
   - Users will automatically see the update notification

3. **Test Update Notification:**
   ```javascript
   // In browser console
   triggerUpdate(); // Simulates new version
   resetVersion();  // Resets to current version
   ```

### For Users:

1. **Automatic Detection:**
   - System checks for updates on page load
   - No manual action required

2. **Update Notification:**
   - Beautiful popup appears when new version is available
   - Click "Update Now" to refresh and get latest version
   - Or wait for auto-dismiss (10 seconds)

3. **Version Display:**
   - Current version shown in menu header
   - Easy to identify which version you're running

## Technical Details

### Version Comparison Logic:
- Semantic versioning support (1.0.1, 1.0.2, etc.)
- Compares major.minor.patch versions
- Handles missing version parts gracefully

### Cache Busting:
- Adds timestamp to prevent caching
- Applies to all resource URLs
- Maintains user session data during updates

### Update Process:
1. Clears browser cache
2. Clears localStorage (except user data)
3. Forces page reload
4. Loads fresh version

## Testing

### Manual Testing:
1. Open browser console
2. Run `triggerUpdate()` to simulate new version
3. Verify notification appears
4. Click "Update Now" to test update process
5. Run `resetVersion()` to reset

### Automated Testing:
- Version comparison logic is unit testable
- Update notification can be triggered programmatically
- Cache busting can be verified in network tab

## Future Enhancements

1. **Server-Side Version Checking:**
   - API endpoint to check latest version
   - Real-time version comparison

2. **Progressive Updates:**
   - Background download of new version
   - Seamless update process

3. **Update Logs:**
   - Track which users updated
   - Version adoption analytics

4. **Rollback Support:**
   - Ability to revert to previous version
   - Emergency rollback procedures

## Troubleshooting

### Common Issues:

1. **Update notification not showing:**
   - Check if VersionManager is loaded
   - Verify localStorage permissions
   - Check browser console for errors

2. **Cache not clearing:**
   - Verify cache busting parameters
   - Check browser cache settings
   - Try hard refresh (Ctrl+F5)

3. **Version display issues:**
   - Check if menu.js is loading properly
   - Verify DOM elements exist
   - Check for JavaScript errors

### Debug Commands:
```javascript
// Check current version
console.log(VersionManager.getVersionInfo());

// Check localStorage
console.log(localStorage.getItem('serverVersion'));
console.log(localStorage.getItem('lastCheckedVersion'));

// Force update check
VersionManager.checkForUpdates();
```

## Security Considerations

1. **Version Validation:**
   - Validate version format before comparison
   - Sanitize version strings

2. **Update Source:**
   - Verify update source authenticity
   - Implement checksums for critical files

3. **User Data Protection:**
   - Preserve user session during updates
   - Backup critical localStorage data

## Support

For issues or questions about the version management system:
1. Check browser console for errors
2. Verify all files are properly loaded
3. Test with trigger-update.js utilities
4. Review this documentation

---

**Current Version:** 1.0.1  
**Last Updated:** $(date)  
**Maintainer:** Development Team 