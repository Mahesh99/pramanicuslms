> 🎯 **Learning Objectives**
> By the end of this module you will remove duplicate rows, sort and filter, and reshape text with TRIM, LEFT, RIGHT, MID, LEN, FIND, SUBSTITUTE, CONCATENATE / CONCAT / TEXTJOIN, and Flash Fill.

> 💡 **Session Info**
> **Week 2** · **Level:** Intermediate · **File:** `/excel/dirty_staff.csv`

🧹
Section 4.1
## What is wrong with the file

Import `dirty_staff.csv` to a sheet **Staff**. It mimics a real HR export:

| Problem | Example |
|---------|---------|
| Extra spaces | `"  ananya sharma  "` |
| Mixed case | `ROHAN GUPTA` vs `sneha das` |
| Duplicate rows | ST-03 and ST-07 appear twice |
| Inconsistent department | `sales`, `Sales`, `SALES` |
| Phone formats | `91-9876543210`, `+91 9123456780`, `91.9000011111` |
| Dates as text | `12/03/2022`, `19-Nov-2020`, `8 Jan 2024` |
| Redundant column | `CityDup` copies City |

There are **10 data rows** but only **8 unique StaffIDs**.

📑
Section 4.2
## Remove duplicates, sort, and filter

**Sort:** Data → Sort. Sort by Department, then FullName. Always sort **after** you have a header row checked.

**Filter:** Data → Filter (or Ctrl+Shift+L). Filter Department to `IT`. ST-03 still appears twice until you remove duplicates.

**Remove Duplicates:**

1. Select the table.
2. **Data → Remove Duplicates**.
3. Tick **StaffID** only if one row per employee is the rule — or tick all columns if only *exact* duplicate rows should go.

For this file, removing duplicates on **StaffID** leaves **8 rows** (ST-03 and ST-07 collapse).

> ⚠️ **Undo immediately if you guessed wrong**
> Remove Duplicates is not a formula — it deletes rows. Copy the sheet first (`Staff_raw`).

**Advanced Filter** (unique records to another range): Data → Advanced → Unique records only → Copy to `Staff_unique`. Safer than deleting in place.

✂️
Section 4.3
## Text functions

Assume FullName is column B.

**TRIM** removes extra spaces (not a single space between words):

```
=TRIM(B2)
```

**UPPER / LOWER / PROPER:**

```
=PROPER(TRIM(B2))
```

`"  ananya sharma  "` becomes **Ananya Sharma**.

**LEFT / RIGHT / MID** — StaffID `ST-01`: department prefix `ST`, number `01`.

```
=LEFT(A2,2)
=RIGHT(A2,2)
=MID(A2,4,2)
```

For `ST-01`: LEFT = `ST`, MID from 4 for 2 chars = `01`, RIGHT = `01`.

**LEN** — find messy names:

```
=LEN(B2)-LEN(TRIM(B2))
```

Greater than 0 means extra spaces.

**FIND vs SEARCH:** FIND is case-sensitive; SEARCH is not. Position of space in a trimmed name:

```
=FIND(" ",PROPER(TRIM(B2)))
```

First name:

```
=LEFT(PROPER(TRIM(B2)),FIND(" ",PROPER(TRIM(B2)))-1)
```

Last name (after first space):

```
=MID(PROPER(TRIM(B2)),FIND(" ",PROPER(TRIM(B2)))+1,99)
```

**CONCATENATE** (older Excel) and **CONCAT** / **TEXTJOIN** (newer):

```
=CONCATENATE(D2," ",E2)
=CONCAT(D2," ",E2)
=TEXTJOIN(" ",TRUE,D2,E2)
```

`TEXTJOIN` can skip blanks (`TRUE`).

**SUBSTITUTE** — strip country codes from Phone (column D):

```
=SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(D2,"+91",""),"91-",""),"91.","")
```

Then TRIM and SUBSTITUTE remaining spaces. You will not get a perfect 10-digit number on every row in one formula — that is normal. Use helper columns.

**Flash Fill:** type `Ananya` in a new column next to `  ananya sharma  `, start the next cell, **Data → Flash Fill** (Ctrl+E). Fast, but it is static — it does not update if the source changes. Prefer formulas for a repeatable workbook.

🔤
Section 4.4
## Department and dates

Normalise Department (column C) with a mapping table **DeptMap**:

| Dirty | Clean |
|-------|-------|
| sales | Sales |
| Sales | Sales |
| SALES | Sales |
| hr | HR |
| finance | Finance |
| Finance | Finance |
| IT | IT |
| Warehouse | Warehouse |

```
=XLOOKUP(LOWER(TRIM(C2)),DeptMap!$A$2:$A$9,DeptMap!$B$2:$B$9,PROPER(TRIM(C2)))
```

(Build the map with LOWER dirty values so `sales` / `Sales` collide on purpose — then one row per distinct lowercased label is enough.)

Simpler first pass:

```
=PROPER(TRIM(C2))
```

That turns `hr` into `Hr` — then replace `Hr` with `HR` with Find & Replace or a second IF.

**Dates:** Excel must see a real date (a serial number) before you can sort a timeline. Try:

```
=DATEVALUE(F2)
```

If that fails for `12/03/2022` (day/month vs month/day), split with LEFT/MID/RIGHT and `DATE(year,month,day)`, or use **Data → Text to Columns** with Date = DMY.

Drop **CityDup** after you confirm it matches City (`=G2=F2` should be TRUE on every row).

✏️
Practice

## Module 4 Practice Exercises: Cleaning

**File:** `dirty_staff.csv` — work on a copy.

1. **(Beginner)** TRIM + PROPER on FullName. Sort A–Z by the cleaned name.
2. **(Beginner)** Remove Duplicates on StaffID. How many rows remain?
3. **(Intermediate)** Split FullName into FirstName and LastName with FIND / LEFT / MID.
4. **(Intermediate)** TEXTJOIN a display label `StaffID — First Last`.
5. **(Challenge)** Reduce Phone to digits only using nested SUBSTITUTE (remove `+`, `-`, `.`, spaces). Flag rows whose LEN is not 10 or 12.
6. **(Challenge)** Build a unique Department list (Advanced Filter) and a clean mapping table, then XLOOKUP it back.

> 💡 **Next up — Module 5**
> Highlight outliers and targets with conditional formatting on `sales.csv`.
