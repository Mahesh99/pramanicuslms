> 🎯 **Learning Objectives**
> By the end of this module you will create drop-down lists from a range, apply whole-number and date rules, write a custom formula rule, and show useful input/error messages.

> 💡 **Session Info**
> **Week 3** · **Level:** Intermediate · **Files:** `/excel/products.csv`, `/excel/regions.csv`, `/excel/practice_basics.csv`

📋
Section 8.1
## Why validate

Lookups and PivotTables fail when someone types `p001`, `South`, or a negative quantity. **Data Validation** restricts what can be entered **before** the formula layer.

Create a sheet **Entry** that mimics a new sale line: ProductID, RegionID, Quantity, Discount, Date.

Keep lists on a sheet **Lists** (or use the Products / Regions sheets):

- ProductIDs: `Products!A2:A13`
- RegionIDs: `N`, `S`, `E`, `W` from `regions.csv`

✅
Section 8.2
## Drop-down lists

1. Select the ProductID entry cell (`B2`).
2. Data → **Data Validation**.
3. Allow: **List**.
4. Source: `=Products!$A$2:$A$13`
5. Tick **In-cell dropdown**.

Fill down the rule (or set `Applies to` `B2:B50`). Users pick `P001`–`P012` only.

Region drop-down:

```
=Regions!$A$2:$A$5
```

**Named ranges** (Formulas → Define Name): `ProductIDs` = `Products!$A$2:$A$13`. Then Source: `=ProductIDs`. Easier to maintain.

**Table-based lists:** if Products is a Table named `tblProducts`, use `=INDIRECT("tblProducts[ProductID]")` as the list source so new SKUs appear automatically.

> ⚠️ **List source must be a single row or column**
> A block of cells two columns wide is invalid for List validation.

🔢
Section 8.3
## Numbers, dates, and text length

**Quantity** (whole units, 1–20):

- Allow: Whole number
- Data: between
- Minimum 1, Maximum 20

**Discount** (0 to 0.2 meaning 0–20%):

- Allow: Decimal
- Between 0 and 0.2
- Input message: `Enter 0.1 for 10%`

**Date** (course window 2024-01-01 to 2025-12-31):

- Allow: Date
- Between `2024-01-01` and `2025-12-31`

**Text length** for a remarks column: less than or equal to 40 characters.

**Circle invalid data:** Data → Data Validation → Circle Invalid Data. Useful after a paste that bypassed the drop-down. **Clear Validation Circles** when done.

Pasting values **can skip** validation. Protect the sheet (Review → Protect) after setting rules if this is a shared template.

🧮
Section 8.4
## Custom formulas

Allow: **Custom**. The formula must return TRUE for a valid entry. It is evaluated for the **active cell** of the selected range — lock columns like CF.

**ProductID must exist** (if you did not use a list):

```
=COUNTIF(Products!$A$2:$A$13,B2)=1
```

**Quantity required when ProductID is filled:**

```
=OR(B2="",AND(C2>=1,C2<=20))
```

(Adjust column letters to your Entry sheet.)

**Discount only if Quantity ≥ 3** (bulk deal):

```
=OR(D2=0,C2>=3)
```

**Prevent weekend dates** (optional):

```
=WEEKDAY(E2,2)<=5
```

`WEEKDAY(...,2)` makes Monday=1 … Sunday=7.

**Error alert:** Style **Stop** (cannot enter), **Warning** (can override), **Information**. Use Stop for ProductID and Quantity; Warning for Discount exceptions.

**Input message:** short, e.g. `Choose a SKU from the catalogue`.

✏️
Practice

## Module 8 Practice Exercises: Data validation

**Files:** `products.csv`, `regions.csv`

1. **(Beginner)** Drop-down of ProductID on an Entry sheet. Try typing `P999` — it must fail.
2. **(Beginner)** RegionID list from `regions.csv`. Input message naming the four regions.
3. **(Intermediate)** Quantity whole number 1–5 (matches how `sales.csv` was generated).
4. **(Intermediate)** Custom rule: Discount ≤ 0.12 (the maximum in the generated sales file).
5. **(Challenge)** `COUNTIF` custom rule so CustomerID must exist on `customers.csv`.
6. **(Challenge)** Paste a junk ProductID with validation on — then use Circle Invalid Data. Write one sentence on why paste is dangerous on shared templates.

> 💡 **Next up — Module 9**
> STDEV, CORREL, and the Data Analysis ToolPak (Regression, ANOVA) on sales numbers.
