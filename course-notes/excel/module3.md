> 🎯 **Learning Objectives**
> By the end of this module you will create a PivotTable from `sales.csv`, rearrange rows/columns/values, change value summaries and number formats, group dates, and filter with slicers.

> 💡 **Session Info**
> **Week 1** · **Level:** Intermediate · **Files:** `/excel/sales.csv`, `/excel/products.csv`, `/excel/regions.csv`

📐
Section 3.1
## What a PivotTable is

A **PivotTable** is an interactive summary. You drag fields into four buckets:

| Bucket | Role | Example |
|--------|------|---------|
| **Rows** | Categories down the side | Category, RegionName |
| **Columns** | Categories across the top | Year, Segment |
| **Values** | Numbers to summarise | Sum of Amount, Count of SalesID |
| **Filters** | Page-level filter | Year = 2024 |

It is the Excel equivalent of `GROUP BY` plus drag-and-drop. You do **not** write SUMIF for every category.

Use **`sales.csv`** (180 rows, SalesID 2001–2180). For category and region names, either:

- **Data → Get Data** and merge `products.csv` / `regions.csv` in Power Query, or
- Add helper columns with XLOOKUP (Module 2) named **Category** and **RegionName**

This module assumes helpers on a sheet **Sales**:

```
=XLOOKUP([@ProductID],Products!A:A,Products!C:C)
=XLOOKUP([@RegionID],Regions!A:A,Regions!B:B)
```

(Convert Sales to a Table first so `[@ProductID]` works.)

🏗️
Section 3.2
## Create and rearrange

1. Click any cell in the Sales table.
2. **Insert → PivotTable** → New Worksheet.
3. Drag **Category** to Rows, **Amount** to Values, **RegionName** to Columns.

You should see a matrix: categories down, regions across, **Sum of Amount** in the middle, and a Grand Total.

**Rearrange without rebuilding:** drag Category off Rows onto Filters, put RegionName on Rows — the same data, a different question (“how did each region do?” vs “how did each category do by region?”).

**Count vs Sum:** if Amount is summarised as Count, Excel thought the field was text. Set data type to Number, refresh (**PivotTable Analyze → Refresh**), then Value Field Settings → **Sum**.

> 💡 **Refresh**
> PivotTables cache data. After you add sales rows: refresh. After you change source columns: **Change Data Source**.

🧮
Section 3.3
## Value settings, % of total, and date grouping

Right-click a value → **Value Field Settings**:

- Summarize: Sum, Count, Average, Min, Max
- **Show Values As:** % of Grand Total, % of Row, Difference From

Example — share of revenue:

1. Add Amount to Values twice.
2. First stays Sum.
3. Second → Show Values As → **% of Grand Total**. Format as Percentage.

**Group dates:** put **Date** on Rows, right-click a date → **Group** → Months + Years. You get a hierarchy Year → Month.

**Calculated field (light):** PivotTable Analyze → Fields, Items & Sets → Calculated Field, e.g. `Net = Amount` (we already store Amount). A more useful one if you add Cost via lookup: `Margin = Amount - Quantity * Cost` only works if both Quantity and Cost are in the pivot cache as fields — often easier to add Margin as a column on Sales first, then pivot Sum of Margin.

🎨
Section 3.4
## Formatting and slicers

**Design tab:**

- Banded rows
- **Report Layout → Show in Tabular Form** (one field per column — easier to copy out)
- Repeat all item labels
- Subtotals: do not show if you only have one row field

**Number format:** Value Field Settings → Number Format → ₹ or Number with thousands separators.

**Slicers** are clickable filter buttons:

1. Click the PivotTable.
2. **PivotTable Analyze → Insert Slicer**.
3. Tick **RegionName** and **Category**.
4. Hold **Ctrl** to select several regions.

**Timeline** (for Date fields): Insert Timeline → Date. Drag 2024 vs 2025.

**Slicer style:** Slicer tab → columns = 2 so Electronics / Fashion / Home & Kitchen sit in a compact grid.

Connect one slicer to **two** pivots: Slicer → Report Connections → tick both PivotTables on the sheet (dashboard layout).

> ⚠️ **Classic trap**
> Filtering the source sheet with AutoFilter does **not** hide rows from a PivotTable. Use pivot filters or slicers. To analyse a subset in the grid, copy to a new table or use a helper column Flag.

✏️
Practice

## Module 3 Practice Exercises: Pivot tables

**Files:** `sales.csv`, `products.csv`, `regions.csv`

1. **(Beginner)** Pivot: Rows = Category, Values = Sum of Amount. Note the largest category.
2. **(Beginner)** Add RegionName to Columns. Format values with thousands separators.
3. **(Intermediate)** Show Amount as % of Grand Total. Which Category–Region cell is the largest share?
4. **(Intermediate)** Group Date by Year and Month. Insert a Timeline and a Category slicer.
5. **(Challenge)** Second PivotTable on the same sheet: Rows = Brand (lookup from products), Values = Average of Discount. Connect the Category slicer to both pivots.
6. **(Challenge)** Tabular layout, copy the pivot to a new sheet as **values only** (Paste Special). Explain why the copy does not refresh.

> 💡 **Next up — Module 4**
> Clean `dirty_staff.csv`: trim names, split text, remove duplicate staff IDs.
