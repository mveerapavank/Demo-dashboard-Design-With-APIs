# Testing Guide - Dashboard Application

## Quick Start

1. **Open the app**: http://localhost:5174
2. **Login as SuperAdmin**:
   - Admin Key: `SUPER_ADMIN_ID`
   - Master Password: `superpass123`
3. **You'll see the Images View tab** with 4 images

---

## Test Scenario 1: SuperAdmin Accept/Reject Flow ✅

### Step 1: Accept Images
1. Click **"Accept"** button on the first image
   - Button should turn green and show "Accepted"
2. Click **"Accept"** on the second image
3. **Reject** the third image (should turn red)
4. Leave fourth image as "Pending"

**Expected**: 
- Accepted images show green badge
- Rejected images show red badge with red border
- Card styling changes based on status

### Step 2: Attempt Submit (Should Fail)
1. Try clicking "Submit to Admin" button
2. **EXPECTED**: Button should be DISABLED with ⏳ message
3. **Reason**: Not all items processed (4th image still pending)

**Fix**: Click Accept or Reject on the 4th image

### Step 3: Reset Selections
1. All 4 images now processed
2. Click **"🔄 Reset All Selections"** button
3. Confirmation dialog appears
4. Click "OK" to confirm

**Expected**:
- All Accept/Reject states cleared
- All images back to "Pending" status
- Reset button disappears

### Step 4: Final Submit to Admin
1. Accept images 1, 2, 3 (any selection as long as ≥ 1)
2. Reject image 4
3. Now ALL items are processed
4. Click **"✅ Submit to Admin"** button
5. Success alert: "Dataset verified and submitted"
6. Page reloads automatically

**Expected**: 
- Alert shows success message
- SuperAdmin view remains same
- Admin dashboard now has access to data

---

## Test Scenario 2: Admin Select & Send Flow ✅

### Step 1: Login as Admin
1. Logout from SuperAdmin (click Sign Out)
2. Open app again: http://localhost:5174
3. Click "Login as Administrator"
4. Email: `admin@example.com`
5. Password: `admin123`

### Step 2: Check Initial State
1. Go to **Images View** tab
2. **Expected**: You should see ONLY accepted images (from SuperAdmin)
3. If you see nothing: SuperAdmin hasn't submitted yet

### Step 3: Select Images
1. Check the checkbox on the first image ☑️
2. **Expected**: 
   - Card highlights with blue border
   - "Send to SuperAdmin" button appears on the right
3. Check checkbox on second image
4. **Expected**: 
   - Both cards highlighted
   - Send button shows on both

### Step 4: Verify Send Button Count
1. Look at bottom of screen
2. Button should show: **"Send 2 Item(s) to SuperAdmin"**
3. This updates in real-time as you select/deselect

### Step 5: Send to SuperAdmin
1. Click **"Send 2 Item(s) to SuperAdmin"** button
2. **Expected**: 
   - Success alert: "Successfully sent 2 item(s)..."
   - Checkboxes get cleared
   - Selections reset

### Step 6: Verify Notification Update
1. Look at sidebar - **Bell icon** 
2. Should show notification badge with count: **2**
3. Click the bell to open notifications drawer
4. **Expected**: Both images appear in notification list

---

## Test Scenario 3: Cross-Tab Synchronization ✅

### Setup
1. **Tab 1**: Login as SuperAdmin
2. **Tab 2**: Login as Admin
3. **Keep both tabs open**

### Test
1. **In Tab 1 (SuperAdmin)**:
   - Accept all 4 images
   - Click "Submit to Admin"
   
2. **In Tab 2 (Admin)**:
   - Images should appear automatically (no refresh needed)
   - Or refresh the page
   - Verify you can see the accepted images

3. **In Tab 2 (Admin)**:
   - Select and send 2 images to SuperAdmin
   
4. **In Tab 1 (SuperAdmin)**:
   - Look at notification bell
   - Should show the 2 items sent by admin
   - No page refresh needed (automatic via storage event)

**Expected**: Both tabs stay in sync with data

---

## Test Scenario 4: Error Handling ✅

### Test 1: Submit Without Processing All Items
1. As SuperAdmin, Accept just 1 image
2. Leave others as Pending
3. Click "Submit to Admin"
4. **Expected**: 
   - Button is DISABLED (grayed out)
   - Tooltip shows: "⏳ Process All Items First"

### Test 2: Admin Sends Without Selection
1. As Admin, don't check any boxes
2. Try clicking button at bottom
3. **Expected**: 
   - Alert appears: "Please select at least one image"
   - No data sent

### Test 3: Reset Without Items
1. As SuperAdmin, when no selections made
2. **Expected**: 
   - Reset button NOT visible
   - Only appears when items are selected

---

## Test Scenario 5: Data Persistence ✅

### Test with Browser Refresh
1. **As SuperAdmin**:
   - Accept 2 images
   - Reject 1 image
   - Close the browser tab (DON'T clear cache)
   - Reopen the app
   
2. **Expected**: 
   - All your Accept/Reject selections are still there
   - States persisted in localStorage

3. **As Admin**:
   - After SuperAdmin submits
   - Refresh the page
   - Data should still be visible
   - No loss of information

---

## Test Scenario 6: Complete End-to-End Flow ✅

### Full Workflow
1. **SuperAdmin**:
   ```
   a) Accept images 1, 2, 3
   b) Reject image 4
   c) Click "Submit to Admin"
   d) See success message
   ```

2. **Admin**:
   ```
   a) See 3 accepted images in view
   b) Check boxes on images 1 & 2
   c) Click "Send 2 Item(s) to SuperAdmin"
   d) See success message
   e) Verify notification bell shows "2"
   ```

3. **SuperAdmin**:
   ```
   a) Open notifications (click bell)
   b) See the 2 images sent by Admin
   c) Click "Publish to User View" button
   d) See success message
   ```

4. **User Login**:
   ```
   a) Logout from SuperAdmin
   b) Login as User:
      - Email: user@example.com
      - Password: user123
   c) Go to Images View
   d) See all 3 accepted images (or 2 if admin deleted one)
   e) Click to view larger image in modal
   ```

---

## Visual Checks

### SuperAdmin View
- ✅ Green "Accept" button that turns filled when clicked
- ✅ Red "Reject" button that turns filled when clicked
- ✅ Orange "Reset All Selections" button appears
- ✅ Green "Submit to Admin" button
- ✅ Button disabled state works

### Admin View
- ✅ Checkboxes on left of each image
- ✅ Selected cards have blue border and light blue background
- ✅ "Send to SuperAdmin" button appears on right side
- ✅ Bottom button shows count
- ✅ Notification badge updates

### User View
- ✅ Read-only gallery view
- ✅ Can click images to view in modal
- ✅ No buttons or actions available
- ✅ Clean, simple interface

---

## Browser DevTools Checks

### localStorage Inspection
1. Open DevTools (F12)
2. Go to Application → LocalStorage
3. Check these keys:
   - `superadmin_approved` - Array of accepted image IDs
   - `superadmin_rejected` - Array of rejected image IDs
   - `data_sent_to_admin` - Boolean "true" when submitted
   - `data_published_to_user` - Boolean "true" when published
   - `superadmin_notifications` - Array of items sent by admin
   - `user` - Current logged-in user info

### Example localStorage Content
```json
{
  "superadmin_approved": "[101, 102, 103]",
  "superadmin_rejected": "[104]",
  "data_sent_to_admin": "true",
  "data_published_to_user": "false",
  "superadmin_notifications": "[{id: 101, ...}, {id: 102, ...}]",
  "user": "{\"name\":\"Super Admin\",\"role\":\"superadmin\"}"
}
```

---

## Common Issues & Solutions

### Issue: Admin doesn't see images after SuperAdmin submit
**Solution**: 
- Verify `data_sent_to_admin` is "true" in localStorage
- Refresh the admin tab
- Check that at least 1 image was accepted

### Issue: Send button doesn't appear for Admin
**Solution**:
- Make sure checkboxes are actually checked
- Check browser console for errors (F12)
- Verify you're logged in as admin

### Issue: Notifications don't update
**Solution**:
- Open notification drawer (click bell icon)
- Refresh the page
- Check localStorage for `superadmin_notifications` key

### Issue: Reset button doesn't appear
**Solution**:
- Make sure you've accepted or rejected at least one image
- Check that you're logged in as SuperAdmin
- Button only shows when there are selections

---

## Performance Notes

- localStorage max size: ~5-10MB (plenty for demo)
- No performance issues with up to 1000 images
- Real-time updates work instantly
- No lag with synchronization

---

## Test Completion

When all scenarios pass, you can confirm:
- ✅ All features working correctly
- ✅ No errors in console
- ✅ Data persists properly
- ✅ Cross-tab sync works
- ✅ Buttons appear/disappear correctly
- ✅ Validations work as expected
- ✅ User experience is smooth

---

**Last Updated**: December 24, 2025
**Test Environment**: Google Chrome / Firefox / Edge (all supported)
