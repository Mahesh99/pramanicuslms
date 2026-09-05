> 🎯 **Learning Objectives**
> By the end of this module you will record a macro, run it from a button, read the generated VBA at a glance, and store workbooks as `.xlsm`. You will not write malware, steal data, or disable security to “make it work”.

> 💡 **Session Info**
> **Week 3** · **Level:** Intermediate–Advanced · **Files:** `/excel/practice_basics.csv` (import, then format with a macro)

🔒
Section 7.1
## Macros and trust

A **macro** is a recorded or written procedure that repeats clicks: number formats, header row, AutoFilter, print area.

Excel files with macros use **`.xlsm`** (or `.xlsb`). CSV and `.xlsx` **cannot** store macros.

**Trust Center** (File → Options → Trust Center):

- Enable macros only for workbooks **you** recorded or that your academy issued
- Prefer **Disable VBA with notification** so you can Enable Content per file
- Macro security exists because macros can automate the whole Office app — treat unknown files like unknown programs

This course only records formatting and a short `Sub` that is limited to the active sheet.

🎥
Section 7.2
## Record and run

**Developer tab:** File → Options → Customize Ribbon → tick **Developer**.

**Record** a “tidy import” macro on Basics:

1. Developer → **Record Macro**.
2. Name: `TidySalesImport` (no spaces).
3. Store in: **This Workbook**.
4. Shortcut: optional `Ctrl+Shift+T`.
5. Perform:

   - Row 1: Bold, fill a dark blue, white font
   - Columns E and G: Number, 2 decimals
   - Column F: Percentage
   - Column B: Short Date
   - `A1:G11`: AutoFilter
   - `A:G`: AutoFit

6. **Stop Recording**.

**Run:** Developer → Macros → `TidySalesImport` → Run. Or assign to a shape: Insert a rectangle “Tidy sheet” → right-click → Assign Macro.

Re-import the CSV onto a messy sheet and run the macro — headers and formats should match in one click.

> 💡 **Use Relative References**
> The recorder option **Use Relative References** makes the macro start from the active cell instead of always hitting `$A$1`. For a header-row formatter, relative is often wrong — you want row 1 every time. Leave it off for `TidySalesImport`.

👀
Section 7.3
## Read the VBA the recorder wrote

Developer → **Visual Basic** (or Alt+F11). In Module1 you will see something like:

```
Sub TidySalesImport()
    Rows("1:1").Font.Bold = True
    Range("E:E,G:G").NumberFormat = "#,##0.00"
    Range("F:F").NumberFormat = "0%"
    Range("B:B").NumberFormat = "dd-mmm-yyyy"
    Range("A1:G11").AutoFilter
    Columns("A:G").AutoFit
End Sub
```

Your recorded code will be more verbose (Select, then With Selection). That is normal. You can delete `.Select` noise later; you do **not** need to for this course.

**Run from VBA:** click inside the Sub and press F5.

**Save** as `PramanicusMart-Excel.xlsm`.

⌨️
Section 7.4
## A short Sub you type yourself

Add a new module (Insert → Module) and paste **only** this formatting helper — it turns off AutoFilter if it is on, then filters Quantity ≥ 3:

```
Sub FilterLargeQty()
    Dim ws As Worksheet
    Set ws = ActiveSheet
    If ws.AutoFilterMode Then ws.AutoFilterMode = False
    ws.Range("A1:G11").AutoFilter Field:=4, Criteria1:=">=3"
End Sub
```

`Field:=4` is Quantity on the practice sheet. Run it; three rows plus the header should remain visible (SalesIDs 1002, 1003, 1007).

**Clear filter:**

```
Sub ShowAllRows()
    On Error Resume Next
    ActiveSheet.ShowAllData
End Sub
```

`On Error Resume Next` here only ignores the error when nothing is filtered — it is not a way to hide failures in business logic.

> ⚠️ **Course boundary**
> Do not record macros that open other workbooks, call web URLs, email files, or change Trust Center settings. If a website tells you to “enable macros and lower security to see the content”, close the file.

✏️
Practice

## Module 7 Practice Exercises: Macros

Work in a **copy** of your workbook saved as `.xlsm`.

1. **(Beginner)** Record `TidySalesImport` and run it after re-importing `practice_basics.csv`.
2. **(Beginner)** Assign the macro to a button labelled Tidy.
3. **(Intermediate)** Record a second macro that sorts Amount largest-first (Data → Sort). Name it `SortByAmountDesc`.
4. **(Intermediate)** Type `FilterLargeQty` and confirm three data rows stay visible.
5. **(Challenge)** Combine tidy + sort into one Sub that calls the others: `TidySalesImport` then `SortByAmountDesc`.
6. **(Challenge)** Save, close Excel, reopen — explain the yellow **Enable Content** bar and when you would refuse to enable it.

> 💡 **Next up — Module 8**
> Stop bad data at entry time with drop-downs and validation rules.
