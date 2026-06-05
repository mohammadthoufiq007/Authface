# OffaceFace Quick Reference - Improved UI Guide

## Getting Started

### Run the Demo
```bash
cd C:\Users\Thoufiq\Downloads\Authface
python demo\webcam_demo.py
```

---

## Keyboard Controls

| Key | Action | Notes |
|-----|--------|-------|
| **E** | Enroll New Person | Opens on-screen dialog for name entry |
| **D** | Delete Person | Opens on-screen dialog, requires confirmation |
| **L** | Toggle User List | Shows all enrolled people (right panel) |
| **F** | Toggle Fullscreen | Maximize to see better details |
| **Q** or **ESC** | Quit Application | Safe exit |

---

## Using On-Screen Dialogs

### Name Entry Dialog
```
1. Press [E] for enroll or [D] for delete
2. Type name directly on screen (up to 30 chars)
3. Press [ENTER] to confirm or [ESC] to cancel
4. Use [BACKSPACE] to edit
```

**Features**:
- ✓ Non-blocking (video continues)
- ✓ 30-second timeout
- ✓ Character echo
- ✓ Visual keyboard hints

### Confirmation Dialog
```
1. Confirm dangerous operations (delete)
2. Press [Y] or [N] to choose
3. Or use arrow keys to select button
4. Press [ENTER] to confirm, [ESC] to cancel
```

**Features**:
- ✓ Prevents accidental deletion
- ✓ Clear Yes/No buttons
- ✓ Visual selection highlighting
- ✓ 30-second timeout

---

## Understanding the Display Panels

### Top Panel - Header
```
OffaceFace | Offline Biometric Engine | Datalake 3.0     FPS 28.3
```
- Shows application info and current FPS
- Helps verify real-time performance

### Left Panel - Recognition Results (Normal Mode)
```
┌─────────────────────────────┐
│ VERIFIED                    │
│ John Doe                    │
│ Match 94.2%                 │
│ [████████████████░]         │
│ Liveness 89.5%              │
│ [█████████████████░]        │
└─────────────────────────────┘
```

**Status Indicators**:
- **VERIFIED** (🟢 Green) = Face matched + alive
- **UNKNOWN** (🟡 Orange) = Live face not in database
- **SPOOF** (🔴 Red) = Spoofing attempt blocked
- **SCANNING** (⚪ Gray) = No face detected

### Left Panel - Enrollment Mode
```
┌─────────────────────────────┐
│ ENROLLING                   │
│ John                        │
│ Captures: 5/7               │
│ [████████████░░] 71%        │
│ Position face in center     │
│ Multiple angles recommended │
└─────────────────────────────┘
```

**Progress Tracking**:
- Current captures vs required (5/7)
- Visual progress bar
- Guidance text for better captures

### Right Panel - User List (Press L to toggle)
```
┌─────────────────────────────┐
│ ENROLLED USERS              │
│ 1. Alice                    │
│ 2. Bob                      │
│ 3. Charlie                  │
│ 4. David                    │
│ 5. Eve                      │
└─────────────────────────────┘
```

**Features**:
- Toggle on/off with [L] key
- Shows all enrolled people
- Numbers indicate database index
- Sorted alphabetically

### Bottom Panel - Instructions (Normal Mode)
```
[E] Enroll  [D] Delete  [L] List  [F] Fullscreen  [Q] Quit
```

**Visibility**:
- Shown when not in dialog/enrollment mode
- Provides quick reference for controls
- Professional appearance

### Center - Face Detection Box
```
Green (Live) | Red (Spoof) | Orange (Unknown)
```

**Colors**:
- **Green corners** = Recognized person + alive
- **Red corners** = Spoof attack detected
- **Orange corners** = Unrecognized but alive face
- **No box** = No face detected

---

## Common Workflows

### Enroll a New Person
```
1. Press [E]
2. Type name (e.g., "Alice")
3. Press [ENTER]
4. Look at camera - hold still
5. Move head slowly (different angles)
6. Wait for 7 captures (progress bar shows 7/7)
7. See "Enrolled: Alice" message
```

**Tips**:
- Good lighting helps
- Multiple angles = better accuracy
- Keep face in center of frame
- Don't move too fast

### Verify a Person
```
1. Open webcam
2. Look at camera for 2-3 seconds
3. See results in left panel:
   - Green + Name = Recognized
   - Orange + "UNKNOWN" = Not enrolled
   - Red + "SPOOF" = Spoofing attempt
```

**Tips**:
- Face must be 50-200 pixels in view
- Similar lighting to enrollment
- At least 50% confidence needed

### Delete a Person
```
1. Press [D]
2. Type name (e.g., "Alice")
3. Press [ENTER]
4. See confirmation dialog
5. Press [Y] to confirm or [N] to cancel
6. See "Deleted Alice" message
```

**Warning**:
- ⚠️ This is permanent
- Confirmation required
- Cannot undo deletion

### View Enrolled Users
```
1. Press [L]
2. User list appears in right panel
3. Shows all enrolled people
4. Press [L] again to hide list
```

---

## Understanding Results

### Match Confidence (0-100%)
- **90-100%** ✅ PASS - Clear match
- **75-90%** ⚠️ CAUTION - Good match
- **60-75%** ❌ FAIL - Likely different person
- **<60%** ❌ FAIL - Definitely different

### Liveness Score (0-100%)
- **>80%** ✅ PASS - Real face detected
- **60-80%** ⚠️ CAUTION - Questionable
- **<60%** ❌ FAIL - Likely print/screen

---

## Troubleshooting

### Face Not Detected
- ✓ Move closer to camera (50-100 pixels)
- ✓ Improve lighting
- ✓ Look directly at camera
- ✓ Remove sunglasses/masks

### Always Shows SPOOF
- ✓ Ensure good lighting
- ✓ Move slightly (show liveness)
- ✓ Remove reflective objects
- ✓ Check camera is not dirty

### Low Confidence Matches
- ✓ Enroll with more variation (angles, lighting)
- ✓ Use 7+ captures instead of minimum
- ✓ Match lighting conditions to enrollment
- ✓ Check enrollment quality

### Enrollment Won't Complete
- ✓ Keep face in frame
- ✓ Hold still for 1-2 seconds per capture
- ✓ Vary angles slightly
- ✓ Ensure adequate lighting

### Terminal Shows Warnings
- ✓ "WARNING: Failed to decrypt" = Database corruption
- ✓ Contact admin to rebuild database if critical

---

## Performance Notes

**Real-time Performance**:
- Target FPS: 30 (shown in top right)
- Face Detection: ~45ms
- Liveness Check: ~35ms
- Embedding: ~80ms
- Total: ~160ms (~6 FPS for full pipeline)

**Display Performance**:
- UI rendering: <5ms
- No impact on recognition speed

---

## Color Legend

| Color | Meaning | Context |
|-------|---------|---------|
| 🟢 Green | Success/Verified | Box + Status + Bars |
| 🔴 Red | Danger/Spoof | Spoof detection |
| 🟡 Orange | Unknown/Caution | Unknown face |
| ⚪ Gray | Neutral/Scanning | Initializing |
| 🔵 Blue | Info | Dialog prompts |

---

## Tips for Best Results

### Enrollment
- Enroll in same lighting as deployment
- Vary head angles (left, right, up, down)
- Relax face (natural expression)
- Use all 7 captures
- Multiple enroll sessions = better accuracy

### Verification
- Match enrollment lighting
- Similar distance from camera
- Natural facial expression
- Let system process (don't move fast)

### System
- Keep webcam clean
- Maintain consistent lighting
- Avoid backlit conditions
- Room temperature ~20°C (cool is better)

---

## Need Help?

See: `/IMPROVEMENTS.md` for technical details
See: `demo/README.md` for architecture overview
Run: `python demo/benchmark.py` for system diagnostics

---

*OffaceFace v1.0.0 | Datalake 3.0 Hackathon | Offline Biometric Engine*
