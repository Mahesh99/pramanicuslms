> 🎯 **Learning Objectives**
> By the end of this module you will calculate STDEV.S / STDEV.P, CORREL, and a few related stats functions, enable the Data Analysis ToolPak, and run a Regression and a single-factor ANOVA on Pramanicus Mart numbers — then interpret output without over-claiming.

> 💡 **Session Info**
> **Week 3** · **Level:** Advanced · **Files:** `/excel/practice_basics.csv`, `/excel/sales.csv`

📐
Section 9.1
## Spread and relationship

On **Basics**, Amount is `G2:G11`.

**Average** (already Module 1):

```
=AVERAGE(G2:G11)
```

**Sample standard deviation** — use this when the 10 rows are a *sample* of sales:

```
=STDEV.S(G2:G11)
```

**Population standard deviation** — use `STDEV.P` only if these 10 rows *are* the entire population you care about (they are not; `sales.csv` has 180). For the practice sheet, report **STDEV.S**.

Older Excel: `STDEV` ≈ `STDEV.S`, `STDEVP` ≈ `STDEV.P`. Prefer the `.S` / `.P` names.

**Variance:** `VAR.S` / `VAR.P`.

**CORREL** — linear association from −1 to 1. Quantity vs Amount:

```
=CORREL(D2:D11,G2:G11)
```

A moderate positive value would mean more units tend to coincide with higher Amount — **not** guaranteed, because UnitPrice varies (one NovaPhone beats five t-shirts).

Discount vs Amount:

```
=CORREL(F2:F11,G2:G11)
```

High-ticket phones also carry discounts, so this may be weakly positive — **correlation is not a discount policy**.

**Other useful functions:**

| Function | Role |
|----------|------|
| `MEDIAN` | Middle value — less sensitive to SalesID 1001 |
| `QUARTILE.INC` | 25th / 75th percentiles |
| `LARGE` / `SMALL` | 1st largest, 2nd largest |
| `SLOPE` / `INTERCEPT` | Simple linear trend Amount vs Quantity |

```
=MEDIAN(G2:G11)
=SLOPE(G2:G11,D2:D11)
=INTERCEPT(G2:G11,D2:D11)
```

SLOPE here is “how much Amount changes per extra unit” **on this tiny sheet** — treat it as a teaching number, not a forecast model.

🧰
Section 9.2
## Data Analysis ToolPak

1. File → Options → **Add-ins**
2. Manage: **Excel Add-ins** → Go
3. Tick **Analysis ToolPak** → OK

A **Data Analysis** button appears on the **Data** tab.

This is the add-in the syllabus means by “data analysis add-ins (Regression, ANOVA, etc.)”. It writes **static** output tables — if source data changes, run the tool again.

If Data Analysis is missing, you are often in Excel Online or a viewer — use the desktop app.

📉
Section 9.3
## Regression

Question: *Does Quantity help explain Amount on the practice sheet?*

1. Data → Data Analysis → **Regression**
2. Y Range: `G1:G11` (include header, tick Labels)
3. X Range: `D1:D11`
4. Output: new sheet `Reg_Qty_Amount`

Read:

- **R Square** — fraction of Amount variation “explained” by Quantity. On 10 mixed-price rows this is often **low**. That is the lesson: quantity alone is a weak model when SKUs differ.
- **Coefficients** — Intercept and Quantity slope (same idea as `INTERCEPT` / `SLOPE`)
- **P-value** on Quantity — a large p-value means you should **not** claim a significant linear effect on this sample

Better regression teaching set: use **`sales.csv` filtered to one ProductID** (e.g. P007) so price is nearly constant, then Y = Amount, X = Quantity. R Square should jump.

Multiple X: add Discount as a second X column (contiguous range). ToolPak multiple regression needs X columns side by side.

> ⚠️ **Interpretation**
> Regression on observational sales data is not a randomised experiment. “Associated with” ≠ “if we force quantity up, Amount must rise by the slope.”

📦
Section 9.4
## ANOVA and a simple comparison

**ANOVA (single factor):** are mean Amounts different across Categories?

1. Build three columns of Amount (Electronics / Fashion / Home & Kitchen) with XLOOKUP + FILTER (365) or three helper ranges from a pivot dump.
2. Data Analysis → **Anova: Single Factor**
3. Input range: the three columns including headers; Grouped by Columns; Labels in first row.

Read **P-value** on the ANOVA table:

- Small (commonly below 0.05 in textbooks) → evidence that **not all category means are equal**
- Large → you cannot claim a difference from this test

On only 10 practice rows, ANOVA is under-powered. Use **`sales.csv`** (more rows per category).

**Other ToolPak items** (optional demo, not required homework): Descriptive Statistics (Mean, Std Dev, Min, Max in one dump), Histogram (bin counts — complements COUNTIF).

**Descriptive Statistics** on Amount `G2:G11` should match your Module 1 SUM/AVERAGE/MIN/MAX and Module 9 STDEV.S — use it as a checksum.

✏️
Practice

## Module 9 Practice Exercises: Statistics

**Files:** `practice_basics.csv`, then `sales.csv`

1. **(Beginner)** STDEV.S and MEDIAN of Amount on the practice sheet. Compare MEDIAN to AVERAGE (12079.80) — which is pulled more by SalesID 1001?
2. **(Beginner)** CORREL of Quantity vs Amount and Discount vs Amount. Write one sentence each.
3. **(Intermediate)** Enable ToolPak. Run Descriptive Statistics on Amount with Labels. Tick Summary statistics.
4. **(Intermediate)** Regression: Amount vs Quantity on **one SKU** from `sales.csv` (filter ProductID). Note R Square vs the mixed 10-row sheet.
5. **(Challenge)** Single-factor ANOVA of Amount by Category on `sales.csv`. State whether you reject “all means equal” at 5%, in plain language.
6. **(Challenge)** Add a scatter chart (Module 6) with a trendline for the single-SKU regression and screenshot-compare the trendline slope to the ToolPak coefficient.

> 💡 **Course wrap-up**
> You can now summarise Pramanicus Mart with functions, lookups, pivots, clean imports, format by rule, chart, light automation, lock data entry, and run a basic statistical pass. Reuse the same CSVs in Power BI later if you take that course — the grain of `sales.csv` is the same fact table idea.
