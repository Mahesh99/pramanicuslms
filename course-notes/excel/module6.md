> 🎯 **Learning Objectives**
> By the end of this module you will choose the right chart type, build bar, line, pie, and scatter charts from Pramanicus Mart data, and fix titles, axes, legends, and clutter.

> 💡 **Session Info**
> **Week 2** · **Level:** Intermediate · **Files:** `/excel/sales.csv`, `/excel/products.csv`, `/excel/practice_basics.csv`

📈
Section 6.1
## Pick the chart that matches the question

| Question | Chart |
|----------|--------|
| Compare categories (Electronics vs Fashion vs Home & Kitchen) | **Column / bar** |
| Change over time (monthly Amount) | **Line** |
| Share of a whole (one period only) | **Pie** — max ~5–6 slices |
| Relationship between two numbers (Quantity vs Amount, or Discount vs Amount) | **Scatter (XY)** |

Never use a pie for time series. Never use a line chart for unordered categories (it implies sequence).

Build a **summary block** first (PivotTable or UNIQUE+SUMIF). Charts from 180 raw sales rows look like spaghetti.

Example summary on sheet **ChartData** (from a pivot, values pasted):

| Category | Amount |
|----------|--------|
| Electronics | *(your pivot)* |
| Fashion | |
| Home & Kitchen | |

Or for Module 1 practice data, Amount by ProductID (10 rows is already small enough to chart directly).

📊
Section 6.2
## Column, bar, and line

**Clustered column:** select Category + Amount → Insert → Clustered Column.

- Chart title: `Pramanicus Mart — Amount by category` (not “Chart 1”)
- Vertical axis: thousands separators; axis title `Amount (INR)`
- Delete the legend if there is only one series
- **Switch Row/Column** if Excel plotted years as series by mistake

**Bar chart:** same data, horizontal bars — easier when category names are long (`Home & Kitchen`).

**Line chart** from a pivot grouped by Year-Month:

1. Pivot Date (grouped) on Rows, Sum of Amount on Values.
2. Click the pivot → Insert → Line with Markers.
3. If months show as `Jan, Jan, Jan` for two years, put Year on Axis and Month as series, or use `YYYY-MM` helper text.

**Recommended / combo:** Amount as columns, Discount as a line on a **secondary axis** only if the scales differ wildly. Dual axes confuse readers — prefer two charts.

🥧
Section 6.3
## Pie charts — use sparingly

Select the three category totals → Insert → Pie.

Rules:

- Sort slices largest-first (Excel lets you sort the source)
- Data labels: **percentage** and category name; drop the legend to save space
- Do not explode every slice
- If you have 12 products, **do not pie them** — use a bar chart, or group as Other

Practice sheet pie of Amount by Category (after XLOOKUP):

Electronics should be the largest slice on the 10-row sheet (phones and the tablet).

📍
Section 6.4
## Scatter plots and polish

**Scatter** needs two numeric columns. On Basics:

- X = Quantity (`D2:D11`)
- Y = Amount (`G2:G11`)

Insert → Scatter. You should see larger Amounts generally at mixed quantities (price matters more than qty). Add a **trendline** (right-click points → Trendline → Linear) to preview Module 9’s correlation idea — do not over-claim causation.

**Discount vs Amount:** X = Discount, Y = Amount. High-discount rows are not always the largest tickets.

**Polish checklist:**

- No 3-D charts
- No heavy gridlines (light grey or none)
- Direct labels beat a huge legend
- Colours: one brand colour + grey; save red for alerts
- Move the chart to a **dashboard** sheet; keep ChartData hidden or to the right

**Dynamic charts:** convert ChartData to a Table. New category rows expand the chart. Pivot charts refresh with the pivot.

✏️
Practice

## Module 6 Practice Exercises: Charts

**Files:** `practice_basics.csv`, `sales.csv` + product lookup

1. **(Beginner)** Clustered column of Amount by ProductID on the practice sheet. Give it a real title.
2. **(Beginner)** Pie of Amount by Category (three slices). Show % labels.
3. **(Intermediate)** From `sales.csv`, pivot Amount by month (2024 only) and create a line chart.
4. **(Intermediate)** Scatter: UnitPrice vs Amount on the practice sheet. Add a linear trendline.
5. **(Challenge)** Dashboard sheet: column (category) + line (monthly) + Category slicer connected to the pivots that feed the charts.
6. **(Challenge)** Rewrite a pie that has 12 product slices into a bar chart plus an “Other” grouping of the smallest SKUs.

> 💡 **Next up — Module 7**
> Record a macro to apply the same formatting every time a CSV is imported.
