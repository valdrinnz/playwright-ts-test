# Manual Test Cases — Shifts

**Module:** Capabilities → Shifts

---

## Legend

| Symbol | Meaning                                |
| ------ | -------------------------------------- |
| P0     | Critical — blocks release if failing   |
| P1     | High priority — tested on every build  |
| P2     | Medium priority — regression / nightly |
| ✅     | Automated test exists                  |
| 📋     | Manual only                            |

---

## 1. Navigation

### TC-NAV-01 — Capabilities menu expands to show Shifts `P0` 📋

**Steps:**

1. Log in to the application.
2. Click the **Capabilities** tab in the sidebar.

**Expected:** The sub-menu expands and **Shifts** is visible as a menu item.

---

### TC-NAV-02 — Navigate to Shifts page `P0` 📋

**Steps:**

1. Expand the Capabilities menu.
2. Click **Shifts**.

**Expected:** The Shifts page loads. The calendar, filter panel, slider, and Settings button are all visible.

---

## 2. Shift — Create

### TC-SHF-CREATE-01 — Create a shift `P0` ✅

**Steps:**

1. Navigate to Shifts.
2. Click the **+** (add shift) button.
3. Fill in: Title, Description, Shift Type, Resources, Date, Start Time, End Time.
4. Click **Save**.

**Expected:** The form closes. The new shift event appears on the calendar on the selected date.

---

### TC-SHF-CREATE-02 — Save with missing required fields shows validation `P1` 📋

**Steps:**

1. Navigate to Shifts.
2. Click the **+** button.
3. Leave all required fields empty.
4. Click **Save**.

**Expected:** Validation errors are displayed. No shift is created.

---

### TC-SHF-CREATE-03 — Cancel creating a shift discards the form `P1` 📋

**Steps:**

1. Navigate to Shifts.
2. Click the **+** button.
3. Fill in some fields.
4. Close the form without saving (X or Cancel).

**Expected:** No shift is created. The calendar is unchanged.

---

## 3. Shift — Edit

### TC-SHF-EDIT-01 — Edit an existing shift's type `P0` ✅

**Steps:**

1. Navigate to Shifts.
2. Double-click an existing shift event on the calendar.
3. Change the **Shift Type** via the dropdown.
4. Click **Save**.

**Expected:** The edit drawer closes. The shift reflects the updated type.

---

### TC-SHF-EDIT-02 — Edit an existing shift's time range `P1` 📋

**Steps:**

1. Double-click an existing shift event.
2. Change Start Time and/or End Time.
3. Click **Save**.

**Expected:** The shift reflects the new time range on the calendar.

---

### TC-SHF-EDIT-03 — Cancel editing a shift discards changes `P1` 📋

**Steps:**

1. Double-click an existing shift event.
2. Modify any field.
3. Close the edit drawer without saving.

**Expected:** No changes are applied. The shift remains as it was before.

---

## 4. Shift — Delete

### TC-SHF-DELETE-01 — Delete an existing shift `P0` ✅

**Steps:**

1. Navigate to Shifts.
2. Double-click an existing shift event.
3. Click the **Delete** button.
4. Confirm deletion if prompted.

**Expected:** The shift is removed from the calendar.

---

## 5. Filter

### TC-SHF-FLT-01 — Filter by Employee `P1` 📋

**Steps:**

1. Navigate to Shifts.
2. Open the filter panel.
3. Select or type an employee name in the **Employee** filter.

**Expected:** Only shifts assigned to that employee are shown on the calendar.

---

### TC-SHF-FLT-02 — Filter by Position `P1` 📋

**Steps:**

1. Navigate to Shifts.
2. Open the filter panel.
3. Select a **Position** from the filter.

**Expected:** Only shifts matching that position are shown.

---

### TC-SHF-FLT-03 — Filter by Telephone `P1` 📋

**Steps:**

1. Navigate to Shifts.
2. Open the filter panel.
3. Enter a phone number in the **Telephone** filter.

**Expected:** Only shifts associated with that telephone entry are shown.

---

### TC-SHF-FLT-04 — Filter by Note `P1` 📋

**Steps:**

1. Navigate to Shifts.
2. Open the filter panel.
3. Enter a keyword in the **Note** filter.

**Expected:** Only shifts whose notes contain the keyword are shown.

---

### TC-SHF-FLT-05 — No-match filter shows empty calendar `P1` 📋

**Steps:**

1. Enter a value that matches no records (e.g. `~~~NOMATCH~~~`) in any filter field.

**Expected:** No shift events are displayed. The app does not crash.

---

### TC-SHF-FLT-06 — Combine multiple filters (AND logic) `P2` 📋

**Steps:**

1. Apply a filter for Employee AND Position simultaneously.

**Expected:** Only shifts matching both criteria are displayed. No crash.

---

## 6. Slider (Day Range)

### TC-SHF-SLD-01 — Slider expands the calendar to show more days `P1` 📋

**Steps:**

1. Navigate to Shifts.
2. Drag the slider to the right (toward maximum).

**Expected:** The calendar expands horizontally to show more days in view.

---

### TC-SHF-SLD-02 — Slider contracts the calendar to show fewer days `P1` 📋

**Steps:**

1. Navigate to Shifts.
2. Drag the slider to the left (toward minimum).

**Expected:** The calendar contracts horizontally to show fewer days in view.

---

## 7. Settings — Layers

### TC-SHF-SET-01 — Open Settings panel `P1` 📋

**Steps:**

1. Navigate to Shifts.
2. Click the **Settings** button.

**Expected:** The Settings panel opens and displays the list of available layers.

---

### TC-SHF-SET-02 — Uncheck a layer hides it from the calendar `P1` 📋

**Steps:**

1. Open the Settings panel.
2. Uncheck an active layer.

**Expected:** The layer disappears from the calendar view immediately.

---

### TC-SHF-SET-03 — Re-check a hidden layer restores it `P1` 📋

**Steps:**

1. Open the Settings panel.
2. Uncheck a layer.
3. Check the same layer again.

**Expected:** The layer reappears on the calendar.

---

### TC-SHF-SET-04 — Create a new layer `P1` 📋

**Steps:**

1. Open the Settings panel.
2. Click the **add layer** button.
3. Fill in the required layer details (e.g. name).
4. Click **Save**.

**Expected:** The new layer appears in the layers list and is available in the calendar.

---

### TC-SHF-SET-05 — Edit an existing layer `P1` 📋

**Steps:**

1. Open the Settings panel.
2. Click the edit action for an existing layer.
3. Modify the layer name or configuration.
4. Click **Save**.

**Expected:** The layer is updated. Changes are reflected in the layers list and calendar.

---

### TC-SHF-SET-06 — Cancel editing a layer discards changes `P2` 📋

**Steps:**

1. Open the Settings panel.
2. Click the edit action for a layer.
3. Modify a field.
4. Cancel without saving.

**Expected:** The layer remains unchanged.

---

### TC-SHF-SET-07 — Delete an existing layer `P1` 📋

**Steps:**

1. Open the Settings panel.
2. Click the delete action for an existing layer.
3. Confirm deletion if prompted.

**Expected:** The layer is removed from the list and no longer appears in the calendar.

## 8. Edge Cases

### EC-01 — XSS injection in text inputs `P2` 📋

**Where:** Filter fields (Employee, Position, Telephone, Note), shift Title, Description, layer name.

**How to test:**

1. Type `<script>alert(1)</script>` into any text input.
2. Submit the form or apply the filter.

**Expected:** No JavaScript alert fires. The raw string is treated as plain text. The app remains stable with no visible script execution.

---

### EC-02 — Empty required fields on save `P2` 📋

**Where:** Create Shift modal, Create Layer form.

**How to test:**

1. Open the create form.
2. Leave all required fields blank.
3. Click **Save**.

**Expected:** Inline validation messages appear next to each required field. The form is not submitted. No partial record is created.

---

### EC-03 — Start time after end time `P2` 📋

**Where:** Create Shift and Edit Shift forms (Start Time / End Time fields).

**How to test:**

1. Open the create or edit shift form.
2. Set **Start Time** to a value later than **End Time** (e.g. Start: `20:00`, End: `08:00`).
3. Click **Save**.

**Expected:** A validation error is shown (e.g. "End time must be after start time"). The shift is not saved with an invalid time range.

---

### EC-04 — Duplicate layer name `P2` 📋

**Where:** Settings → Create Layer.

**How to test:**

1. Create a layer with name `TestLayer`.
2. Open the create layer form again.
3. Enter the same name `TestLayer` and click **Save**.

**Expected:** The app shows an error (e.g. "Name already exists") or prevents saving. No duplicate layer is created in the list.

---

### EC-05 — No-match filter text shows empty calendar `P1` 📋

**Where:** All filter fields (Employee, Position, Telephone, Note).

**How to test:**

1. Type a value that cannot match any record (e.g. `~~~NOMATCH~~~`) into any filter field.

**Expected:** Zero shift events are displayed on the calendar. The app does not crash or show an error. An empty-state indicator may be shown.

---

### EC-06 — Very long input (>256 characters) `P2` 📋

**Where:** Shift Title, Description, layer name, and filter fields.

**How to test:**

1. Paste a string of 300+ characters into a text field.
2. Submit the form or apply the filter.

**Expected:** The app either truncates the input at the field's max length, shows a validation message, or saves gracefully. No crash, no server error displayed.

---

### EC-07 — Special characters in layer name `P2` 📋

**Where:** Settings → Create / Edit Layer name field.

**How to test:**

1. Enter a name containing special characters, e.g. `Layer @#&%!`.
2. Click **Save**.

**Expected:** The layer is saved with the name displayed correctly, OR a clear validation message is shown. No crash or corrupted data.

---

### EC-08 — Rapid double-click on add button does not open duplicate forms `P2` 📋

**Where:** The **+** (add shift) button on the Shifts calendar.

**How to test:**

1. Navigate to Shifts.
2. Double-click (or click rapidly twice) the **+** button.

**Expected:** Only one create shift form/drawer opens. No duplicate modals are stacked on top of each other.

---

### EC-09 — Network interruption during save `P2` 📋

**Where:** Create and Edit Shift forms.

**How to test:**

1. Open the create shift form and fill in all fields.
2. Simulate a network interruption (e.g. disable network in browser DevTools).
3. Click **Save**.

**Expected:** A user-friendly error message is displayed (e.g. "Failed to save. Please try again."). The form stays open with the entered data intact. No silent failure.

---

### EC-10 — Concurrent edit by two users `P2` 📋

**Where:** Edit Shift drawer.

**How to test:**

1. Open the same shift for editing in two separate browser sessions simultaneously.
2. Edit and save in session A.
3. Then edit and save in session B with conflicting changes.

**Expected:** The app handles the conflict gracefully — either showing a conflict warning, applying last-write-wins, or preventing the stale update. No silent data corruption.

---

### EC-12 — Session timeout mid-test `P1` 📋

**Where:** Any page requiring authentication.

**How to test:**

1. Log in and navigate to Shifts.
2. Let the session expire (or manually clear auth cookies).
3. Attempt to perform any action (e.g. click **+** to add a shift).

**Expected:** The user is redirected to the login page. No sensitive data is exposed. After re-login the user can continue normally.
