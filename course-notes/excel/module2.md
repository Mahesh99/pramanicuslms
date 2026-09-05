> 🎯 **Learning Objectives**
> By the end of this module you will look up product names and prices with VLOOKUP, read quarter targets with HLOOKUP, replace both with XLOOKUP, and recognise #N/A, approximate-match mistakes, and left-lookup limits.

> 💡 **Session Info**
> **Week 1** · **Level:** Beginner–Intermediate · **Files:** `/excel/products.csv`, `/excel/practice_basics.csv`, `/excel/quarterly_targets.csv`

🔗
Section 2.1
## Why lookups exist

`practice_basics.csv` has **ProductID** but not the product name or category. That lives in `products.csv`. A lookup function finds a key in a table and returns a related column — the Excel version of a SQL join on `ProductID`.

Import:

1. Sheet **Basics** — `practice_basics.csv`
2. Sheet **Products** — `products.csv` (headers in row 1, data `A2:G13`, twelve products P001–P012)
3. Sheet **Targets** — `quarterly_targets.csv` (ProductID in column A, Q1–Q4 in B–E)

On **Products**, columns are:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ProductID | ProductName | Category | Subcategory | Brand | UnitPrice | Cost |

**Golden rule:** the lookup value in Basics (e.g. `C2` = `P001`) must match the key column in Products **exactly** (no extra spaces).

📋
Section 2.2
## VLOOKUP

**VLOOKUP** (*vertical* lookup) searches **down** the first column of a range, then returns a value from a column to the **right**.

```
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
```

- `lookup_value` — what you have (ProductID in Basics!C2)
- `table_array` — the product table, starting at the key column
- `col_index_num` — 1 = first column of the range, 2 = second, …
- `range_lookup` — **FALSE** (or 0) for exact match. Use this almost always.

Product name for the first sale:

```
=VLOOKUP(C2,Products!$A$2:$G$13,2,FALSE)
```

For SalesID 1001 (`P001`) this returns **NovaPhone 12**.

Category (3rd column of the table):

```
=VLOOKUP(C2,Products!$A$2:$G$13,3,FALSE)
```

Result: **Electronics**.

List price (column 6):

```
=VLOOKUP(C2,Products!$A$2:$G$13,6,FALSE)
```

Result: **24999**. Compare it to Basics `UnitPrice` — they should match. If they do not, the sale was keyed at a special price.

**Lock the table with `$`** so the range does not slide when you fill down.

> ⚠️ **VLOOKUP cannot look left**
> The key must be the **leftmost** column of `table_array`. You cannot return ProductID by searching ProductName unless you rearrange columns or use XLOOKUP / INDEX-MATCH.

**Approximate match (`TRUE`)** is for sorted numeric bands (tax brackets). If you omit the fourth argument, Excel uses TRUE and can return the **wrong product**. Always pass **FALSE** unless you have a sorted band table on purpose.

↔️
Section 2.3
## HLOOKUP

**HLOOKUP** (*horizontal* lookup) searches **across** the first **row** of a range, then returns a value from a row beneath.

`quarterly_targets.csv` is wide: ProductID on the left, then Q1, Q2, Q3, Q4. That layout is awkward for HLOOKUP, because HLOOKUP wants **headers in a row**, not a column.

Build a small transpose for teaching — on sheet **TargetsWide**:

| | A | B | C | D | E |
|---|---|---|---|---|---|
| 1 | Metric | Q1 | Q2 | Q3 | Q4 |
| 2 | P001 | *(copy Q1–Q4 for P001)* | | | |

Or select the Q1–Q4 header row:

If row 1 of **Targets** is `ProductID, Q1, Q2, Q3, Q4`, then to get P001's Q2 you are still better with VLOOKUP/XLOOKUP on ProductID.

HLOOKUP shines when **quarters are in the first row** and product metrics sit in rows below:

```
=HLOOKUP("Q2",$B$1:$E$5,2,FALSE)
```

This looks for the header `Q2` in `B1:E1` and returns the value from the **2nd row** of that range (row 2).

**When to use it:** old finance templates with months across the top. For Pramanicus Mart catalogue data, prefer XLOOKUP on ProductID.

🆕
Section 2.4
## XLOOKUP (recommended)

**XLOOKUP** is the modern replacement (Excel 2021 / Microsoft 365). It can look left or right, has a built-in “not found” message, and defaults to exact match.

```
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])
```

Product name:

```
=XLOOKUP(C2,Products!$A$2:$A$13,Products!$B$2:$B$13,"Unknown SKU")
```

Category:

```
=XLOOKUP(C2,Products!$A$2:$A$13,Products!$C$2:$C$13,"Unknown SKU")
```

Look **left**: find ProductID from a name (name must be unique):

```
=XLOOKUP("PulseBuds Pro",Products!$B$2:$B$13,Products!$A$2:$A$13)
```

Result: **P003**.

Q2 target for the product on the Basics row (Targets sheet, ProductID in A, Q2 in C):

```
=XLOOKUP(C2,Targets!$A$2:$A$13,Targets!$C$2:$C$13)
```

For `P001`, Q1 is **199992** (`24999 × 8`) and Q2 is **219991** (Q1 × 1.1, rounded).

**match_mode:** `0` exact (default), `-1` exact or next smaller, `1` exact or next larger, `2` wildcard.

> ✅ **Prefer XLOOKUP**
> Same idea as VLOOKUP, fewer #N/A surprises, and you never count column numbers. If a colleague is on Excel 2016, give them VLOOKUP as a fallback.

🚨
Section 2.5
## Errors and good habits

| Symptom | Cause | Fix |
|---------|--------|-----|
| `#N/A` | Key not found | Check spelling, spaces, `P001` vs `p001` |
| Wrong product | VLOOKUP with TRUE / omitted 4th argument | Use FALSE or XLOOKUP |
| `#REF!` | col_index wider than table | Count columns again |
| Slow workbook | Whole-column VLOOKUP (`A:G`) on 100k rows | Bound the range or use a Table |

Trim keys if imports add spaces:

```
=XLOOKUP(TRIM(C2),Products!$A$2:$A$13,Products!$B$2:$B$13,"Unknown SKU")
```

Approximate VLOOKUP example (tax-style bands) — **only** if column 1 is sorted ascending:

```
=VLOOKUP(G2,$J$2:$K$5,2,TRUE)
```

Do **not** use TRUE against ProductID.

✏️
Practice

## Module 2 Practice Exercises: Lookups

**Files:** `practice_basics.csv`, `products.csv`, `quarterly_targets.csv`

1. **(Beginner)** In Basics, add **ProductName** with VLOOKUP (column index 2, FALSE). Fill down. Row 2 must be NovaPhone 12.
2. **(Beginner)** Add **Category** with XLOOKUP. COUNTIF that column for `"Electronics"` — you should get **5** on the 10-row practice sheet (P001, P003, P002, P010, P004).
3. **(Intermediate)** XLOOKUP the **Cost** from products. Helper: **Margin** `=Amount - Quantity*Cost`.
4. **(Intermediate)** Return Q3 target for each ProductID from `quarterly_targets.csv`.
5. **(Challenge)** Type a fake id `P999` in C12 and write an XLOOKUP that shows `Missing from catalogue` instead of `#N/A`.
6. **(Challenge)** Explain in one sentence why VLOOKUP cannot return ProductID from a Category column without moving columns.

> 💡 **Next up — Module 3**
> Summarise `sales.csv` with PivotTables and slicers — no formulas required for the first summary.
