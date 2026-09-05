> 🎯 **Learning Objectives**
> By the end of this module you will apply highlight-cell rules, formula rules, data bars, colour scales, and icon sets, and you will manage rule order and `Applies to` ranges.

> 💡 **Session Info**
> **Week 2** · **Level:** Intermediate · **Files:** `/excel/sales.csv`, `/excel/practice_basics.csv`

🎨
Section 5.1
## What conditional formatting does

**Conditional formatting (CF)** changes a cell’s colour, border, bar, or icon **when a condition is true**. The value stays the same — only the display changes. Managers read a sheet faster: red = problem, green = on track.

Open **Basics** (`practice_basics.csv`) first (10 rows). Select `G2:G11` (Amount).

Home → **Conditional Formatting**.

Rules live in **Conditional Formatting → Manage Rules**. Each rule has:

- Condition
- Format
- **Applies to** range
- Stop If True (optional)
- Order (top rule wins when Stop If True is on)

🔴
Section 5.2
## Highlight cells and formula rules

**Preset highlights** (select Amount first):

- Greater Than `20000` — only SalesID **1001** (44998.20) qualifies. 1009 is 16719.12; 1006 is 13799.08.
- Top 10 Items → set **3** — the three largest Amounts.
- Duplicate Values — useful on ProductID (`C2:C11`); none duplicate on the practice sheet. On `dirty_staff.csv` StaffID, ST-03 and ST-07 light up.

**Formula rule** — format an entire row when Discount is greater than 0:

1. Select `A2:G11` (start on A2 — the active cell matters).
2. New Rule → **Use a formula**.
3. Formula (note the mixed lock):

```
=$F2>0
```

4. Fill a light orange.

`$F` locks the Discount column; `2` is relative so row 3 uses `$F3`. If you write `$F$2`, every row follows only F2.

Highlight Quantity ≥ 3:

```
=$D2>=3
```

**Based on another sheet:** you can, but keep CF formulas simple. Prefer a helper column `HighValue` = `TRUE/FALSE` on the same sheet, then CF on that.

📊
Section 5.3
## Data bars, colour scales, and icon sets

Select Amount `G2:G11` again.

**Data bars:** Gradient Fill. Bar length is relative to the **selected range** (min–max of those 10 cells). MAX 44998.20 gets a full bar; MIN 2499 a short one.

**Colour scales:** Green–Yellow–Red. High Amount green, low red (or reverse if “low is good”, e.g. Discount).

**Icon sets:** 3 Traffic Lights. Default thresholds are percentiles. For Quantity `D2:D11`, use **Number** thresholds: green ≥ 4, yellow ≥ 2, red below 2.

Show **icon only:** Manage Rules → Edit → Show Icon Only (then the number can live in a helper if you still need it).

On **Sales** (180 rows), data bars on Amount work, but colour scales on 180 rows are noisy. Prefer:

- Data bars on a **PivotTable** (Module 3) for category totals
- Icon set on **Discount** (0 = grey, 0.1 or more = flag)

> 💡 **PivotTables**
> Click inside a pivot → Home → Conditional formatting still works on the values area. Refreshing the pivot keeps CF if `Applies to` was the values range; if the pivot grows, re-apply or format as a pivot style plus CF on `Show Values As`.

⚙️
Section 5.4
## Managing rules without making a mess

- **Do not CF entire columns** (`G:G`) on a 100k-row file — Excel recalculates constantly. Bound `G2:G181`.
- Copying cells copies CF. Paste Special → Values if you only wanted numbers.
- Conflicting fills: two rules both set fill; the one higher in the list wins if Stop If True is checked.
- Clear rules: Conditional Formatting → Clear Rules → From Selected Cells.

**KPI example on Basics:** green Amount if ≥ AVERAGE of the block:

```
=$G2>=AVERAGE($G$2:$G$11)
```

AVERAGE of Amount is **12079.80**. Rows above that average: **1001** (44998.20), **1006** (13799.08), **1009** (16719.12). 1003 and 1010 sit just below.

✏️
Practice

## Module 5 Practice Exercises: Conditional formatting

**Files:** `practice_basics.csv`, then `sales.csv`

1. **(Beginner)** Amount greater than 15000 — fill yellow. Which SalesIDs light up on the practice sheet?
2. **(Beginner)** Data bars on Quantity.
3. **(Intermediate)** Formula rule: entire row when ProductID is `P001`.
4. **(Intermediate)** Icon set on Discount: 0, 0–10%, ≥ 10% as three distinct icons (set Number thresholds).
5. **(Challenge)** On `sales.csv`, colour scale on Amount, then add a formula rule for Discount ≥ 0.12 that turns the **row** red. Put the red rule on top with Stop If True.
6. **(Challenge)** Explain why `$F2>0` works for a row but `F2>0` (no `$`) fails when the selection starts in column A.

> 💡 **Next up — Module 6**
> Turn the same numbers into bar, line, pie, and scatter charts.
