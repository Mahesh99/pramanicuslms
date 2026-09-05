> 🎯 **Learning Objectives**
> By the end of this module you will be able to: open the Pramanicus Mart practice sheet; write SUM, AVERAGE, MIN, and MAX; count rows with COUNT, COUNTA, and COUNTBLANK; and filter counts/totals with COUNTIF, COUNTIFS, and SUMIF.

> 💡 **Session Info**
> **Week 1** · **Level:** Beginner · **Course:** Pramanicus Academy — Advanced Excel · **Files:** `/excel/practice_basics.csv`, `/excel/products.csv`

📊
Section 1.1
## The running dataset: Pramanicus Mart

This course uses one fictional retailer: **Pramanicus Mart**, selling Electronics, Fashion, and Home & Kitchen products across North, South, East, and West India.

Download the CSVs from this site (same origin as the LMS), then **Data → From Text/CSV** in Excel, or open them directly.

| File | What it is |
|------|------------|
| `practice_basics.csv` | 10 sales rows — use this for every formula in Module 1 |
| `products.csv` | Product catalogue (you will look this up in Module 2) |
| `sales.csv` | 180 transactions — PivotTables from Module 3 onward |
| `customers.csv` / `regions.csv` | Dimensions for region and customer analysis |
| `quarterly_targets.csv` | Wide (one quarter per column) — HLOOKUP in Module 2 |
| `dirty_staff.csv` | Messy HR export — cleaning in Module 4 |

Import `practice_basics.csv` onto a sheet named **Basics**. Put headers in row 1. Your columns should be:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| SalesID | Date | ProductID | Quantity | UnitPrice | Discount | Amount |

Row 2 is SalesID `1001` (NovaPhone 12, quantity 2). Row 11 is SalesID `1010`. That block `A1:G11` is the range every example below uses.

> 💡 **Tip**
> After import, set **Amount** and **UnitPrice** to Number with 2 decimal places, and **Discount** to Percentage. Excel sometimes treats CSV numbers as text — if SUM returns 0, use Data → Text to Columns on the column.

➕
Section 1.2
## SUM and AVERAGE

**SUM** adds numbers. **AVERAGE** is the arithmetic mean (sum divided by count of numbers).

Total of all Amount values (rows 2–11):

```
=SUM(G2:G11)
```

Expected result: **120797.95**

Average sale Amount:

```
=AVERAGE(G2:G11)
```

Expected result: **12079.80** (Excel may show 12079.795)

**SUM of Quantity:**

```
=SUM(D2:D11)
```

That is 2+5+3+2+1+1+4+2+1+2 = **23** units.

**Why not add with +:** `=G2+G3+...` breaks when you insert a row. `SUM` expands with the range (especially inside Excel Tables).

> ⚠️ **Watch out**
> `AVERAGE` ignores empty cells but **does not ignore zeros**. A genuine zero sale pulls the mean down. If “no sale” should be blank, leave the cell empty rather than typing 0.

📉
Section 1.3
## MIN and MAX

**MIN** returns the smallest number in a range; **MAX** returns the largest.

```
=MIN(G2:G11)
=MAX(G2:G11)
```

On this sheet: MIN Amount is **2499** (SalesID 1005, HomeBlend Mixer) and MAX Amount is **44998.20** (SalesID 1001).

Useful combo — spread of sale sizes:

```
=MAX(G2:G11)-MIN(G2:G11)
```

**MIN/MAX with a condition (preview):** Excel 365 has `MINIFS` / `MAXIFS`. Example — largest Amount where Quantity is at least 3:

```
=MAXIFS(G2:G11,D2:D11,">=3")
```

If you are on an older Excel without MAXIFS, you will use a PivotTable (Module 3) or a helper column.

🔢
Section 1.4
## COUNT, COUNTA, and COUNTBLANK

| Function | Counts |
|----------|--------|
| `COUNT` | Cells that contain **numbers** |
| `COUNTA` | Cells that are **not empty** (numbers or text) |
| `COUNTBLANK` | Empty cells |
| `COUNTIF` / `COUNTIFS` | Cells that match a condition (next section) |

How many Amount values are numeric?

```
=COUNT(G2:G11)
```

Result: **10**

How many ProductIDs are filled in?

```
=COUNTA(C2:C11)
```

Also **10**. If you delete C6, COUNTA becomes 9 while COUNT on Amount stays 10.

Empty Discount cells (there should be none on this sheet):

```
=COUNTBLANK(F2:F11)
```

Result: **0**

**Analogy:** COUNT is “how many numbers?”, COUNTA is “how many cells have anything?”, COUNTBLANK is “how many holes?”.

🎯
Section 1.5
## COUNTIF, COUNTIFS, and SUMIF

**COUNTIF** counts rows that match one condition. **COUNTIFS** uses several conditions. **SUMIF** / **SUMIFS** add amounts that match.

How many lines sold **3 or more** units?

```
=COUNTIF(D2:D11,">=3")
```

Result: **3** (SalesIDs 1002, 1003, 1007).

How many rows are product `P001`?

```
=COUNTIF(C2:C11,"P001")
```

Result: **1**

Quantity at least 2 **and** discount greater than 0:

```
=COUNTIFS(D2:D11,">=2",F2:F11,">0")
```

Total Amount for product `P007`:

```
=SUMIF(C2:C11,"P007",G2:G11)
```

Result: **3995** (the five CottonTee Classic units).

Total Amount where Quantity is 1:

```
=SUMIF(D2:D11,1,G2:G11)
```

That adds SalesIDs 1005, 1006, and 1009.

**Criteria syntax:**

| Criteria | Meaning |
|----------|---------|
| `">=3"` | Number comparison — wrap in quotes |
| `"P001"` | Exact text |
| `"P*"` | ProductIDs starting with P |
| `"<>"` | Not equal (non-blank if used carefully) |

```
=COUNTIF(C2:C11,"P00*")
```

All ten ProductIDs match `P00*`.

> 💡 **Excel Table tip**
> Convert the range to a Table (**Ctrl+T**). Then you can write `=SUM(Basics[Amount])` and new rows are included automatically.

✏️
Practice

## Module 1 Practice Exercises: Basic functions

**Files:** `practice_basics.csv` (required), `products.csv` (optional extra)
**Level:** Beginner

1. **(Beginner)** Confirm `=SUM(G2:G11)` equals 120797.95. If not, check that Amount imported as numbers.
2. **(Beginner)** Write AVERAGE, MIN, and MAX for **Quantity** (column D). You should get AVERAGE 2.3, MIN 1, MAX 5.
3. **(Beginner)** Count rows with Discount equal to 0 using COUNTIF.
4. **(Intermediate)** SUMIF the Amount for ProductID `P010`.
5. **(Intermediate)** COUNTIFS: Quantity greater than 1 and UnitPrice greater than 2000.
6. **(Challenge)** Add a helper column **Net without discount** `=D2*E2` and SUM it. Compare to SUM of Amount — the difference is total discount rupees given.

> 💡 **Next up — Module 2**
> Pull product names and categories from `products.csv` with VLOOKUP, HLOOKUP, and XLOOKUP.
