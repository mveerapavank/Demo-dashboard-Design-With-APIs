# Quick Reference - Dashboard Features

## 🎯 Key Credentials

### SuperAdmin Login
- **Key**: `SUPER_ADMIN_ID`
- **Password**: `superpass123`

### Admin Login
- **Email**: `admin@example.com`
- **Password**: `admin123`

### User Login
- **Email**: `user@example.com`
- **Password**: `user123`

---

## 🚀 Main Features

### 1. SuperAdmin Panel
| Feature | Action | Result |
|---------|--------|--------|
| **Accept Image** | Click "Accept" button | Button turns green, image marked as "Accepted" |
| **Reject Image** | Click "Reject" button | Button turns red, image marked as "Rejected", card gets red border |
| **Reset All** | Click "🔄 Reset All Selections" | Clear all Accept/Reject decisions (requires confirmation) |
| **Submit to Admin** | Click when all items processed | Data sent to Admin, Admin can see accepted images |

**Requirements for Submit**:
- ✅ ALL 4 images must be either Accepted or Rejected
- ✅ Cannot leave any image in "Pending" state
- ✅ At least 1 image must be Accepted

### 2. Admin Panel
| Feature | Action | Result |
|---------|--------|--------|
| **Select Images** | Check checkbox on image | Card highlights with blue border |
| **Unselect** | Uncheck checkbox | Border removed, selection cleared |
| **Send Selected** | Click "Send X Item(s) to SuperAdmin" | Items added to SuperAdmin's notification panel |

**Visible Only When**:
- SuperAdmin has clicked "Submit to Admin"
- Only Accepted images appear in Admin view

### 3. SuperAdmin Notifications
| Feature | Action | Result |
|---------|--------|--------|
| **View Notifications** | Click Bell icon 🔔 | Drawer opens showing items sent by Admin |
| **Clear All** | Click "Clear All Notifications" | Remove all items from notification list |

**Notification Shows**:
- Image thumbnail
- Card title
- Image ID
- Count badge on bell icon

### 4. User Gallery
| Feature | Action | Result |
|---------|--------|--------|
| **View Images** | Go to Images View tab | See all published images (read-only) |
| **View Full Size** | Click on image | Modal opens with larger image view |
| **Close Modal** | Click ✕ or anywhere outside | Modal closes |

**Visible Only When**:
- Admin clicks "Publish to User View" button

---

## 📊 Data Flow Diagram

```
SuperAdmin View:
  1. Accept/Reject 4 images
  2. Reset (optional)
  3. Submit to Admin
       ↓
Admin View:
  1. Sees 3 accepted images
  2. Selects images with checkboxes
  3. Send selected to SuperAdmin
       ↓
SuperAdmin Notifications:
  1. Bell icon shows count
  2. View sent items in drawer
  3. Publish to User (makes images public)
       ↓
User View:
  1. Sees published images in gallery
  2. Can view full-size images
```

---

## 🎨 Color Coding

| Color | Meaning | Element |
|-------|---------|---------|
| 🟢 Green | Accepted | Accept button & badge |
| 🔴 Red | Rejected | Reject button & border |
| 🔵 Blue | Admin Selection | Card border when checked |
| ⚪ Pending | No Action | Default state |
| 🟡 Orange | Reset Action | Reset button |
| 🟣 Purple | Admin Actions | Send button |

---

## 💾 localStorage Keys

| Key | Type | Content |
|-----|------|---------|
| `superadmin_approved` | Array | IDs of accepted images |
| `superadmin_rejected` | Array | IDs of rejected images |
| `data_sent_to_admin` | Boolean | "true" when SuperAdmin submitted |
| `data_published_to_user` | Boolean | "true" when Admin published |
| `superadmin_notifications` | Array | Items sent by Admin |
| `user` | JSON | Current logged-in user info |

---

## ⚙️ Button States

### SuperAdmin Submit Button
```
States:
1. ❌ DISABLED: Not all items processed
   Message: "⏳ Process All Items First"

2. ❌ DISABLED: No items accepted
   Alert: "No items accepted. Please accept at least one..."

3. ✅ ENABLED: All items processed + ≥1 accepted
   Text: "✅ Submit to Admin"
   Action: Sends data, reloads page
```

### Admin Send Button
```
Visibility:
1. ❌ HIDDEN: No images selected
2. ✅ VISIBLE: Image checkbox is checked
   Text: "Send to SuperAdmin"
   Location: Right side of selected card

Bottom Button:
- Shows count: "Send X Item(s) to SuperAdmin"
- Only visible when X > 0
```

### Reset Button
```
Visibility:
1. ❌ HIDDEN: No selections made
2. ✅ VISIBLE: When Accept/Reject choices exist
   Text: "🔄 Reset All Selections"
   Color: Orange/Amber gradient
   Action: Confirms before clearing
```

---

## 🔄 Real-Time Updates

✅ **What updates automatically**:
- Notification badge count (without refresh)
- Notification drawer items (when opened)
- Admin view (shows new accepted images)
- Button visibility (based on selections)

⚠️ **What requires page refresh**:
- Admin seeing initial submitted data (usually auto-reloads)
- User view after publish (usually auto-reloads)

---

## 🐛 Troubleshooting

### Admin doesn't see images
- ✅ Check that SuperAdmin submitted data
- ✅ At least 1 image must be Accepted
- ✅ Try refreshing the page

### Send button doesn't appear
- ✅ Make sure you're Admin (not SuperAdmin or User)
- ✅ Checkboxes must be checked
- ✅ SuperAdmin must have submitted first

### Reset button missing
- ✅ Button only shows when items are selected
- ✅ Accept or Reject at least 1 image first

### Notifications empty
- ✅ Admin must have sent items first
- ✅ Check localStorage: `superadmin_notifications`
- ✅ Try opening drawer after send

### Submit disabled
- ✅ All 4 images must be processed
- ✅ "Pending" status counts as NOT processed
- ✅ Must accept OR reject each image

---

## 📱 Responsive Design

- ✅ Works on Desktop (1920px - 1280px)
- ✅ Works on Tablet (768px - 1024px)
- ✅ Works on Mobile (320px - 768px)
- ✅ Buttons resize appropriately
- ✅ Drawer works on all sizes

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate buttons |
| `Enter` | Click focused button |
| `Escape` | Close modal/drawer |
| `Space` | Toggle checkbox |

---

## 📝 Notes

- All data stored locally (no server needed)
- Works offline (uses localStorage)
- Data persists between sessions
- Cross-tab sync works automatically
- No external dependencies

---

**Version**: 1.0  
**Last Updated**: December 24, 2025  
**Status**: ✅ Fully Functional
