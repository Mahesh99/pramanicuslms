# Module 1: Power BI Foundations | 9 hours across 3 topics

## Module Objectives

- Understand what Business Intelligence (BI) is and where Power BI fits in the Microsoft data stack.
- Get comfortable navigating the Power BI Desktop interface (Report, Data, Model views) and connecting to real-world data sources (Excel, CSV, SQL database).
- Learn to use Power Query to clean and shape raw, messy data before it enters the data model.
- Understand star schema modeling — the difference between fact and dimension tables — and build correct relationships between them.
- Set up the **Pramanicus Mart** retail dataset that will be used as the running example for the entire course.

## Introduction

This is the opening module of the course, so there is no previous module to connect back to — instead, this module lays the foundation that every other module builds on. By the end of Module 1, you will have Power BI Desktop installed, connected to our running dataset (a fictional retail chain called **Pramanicus Mart**), cleaned that data in Power Query, and modeled it into a proper star schema with `Fact_Sales` at the center surrounded by `Dim_Product`, `Dim_Customer`, `Dim_Region`, and `Dim_Calendar`. This model is the exact foundation Module 2 will use to write your first DAX measures — so getting the relationships right here saves you pain later. Think of this module as "setting up the database and ER diagram" before you start "writing queries" (which is what DAX will feel like).

## Sub-topics

1. **1.1 Introduction to Power BI & Connecting to Data** — What BI/Power BI is, a tour of the Desktop interface, and connecting to Excel/CSV/SQL sources using the Pramanicus Mart dataset.
2. **1.2 Power Query Cleaning** — Fixing data types, splitting/merging columns, removing duplicates, and unpivoting messy Excel exports.
3. **1.3 Data Modeling & Star Schema** — Fact vs. dimension tables, cardinality, and building the relationships that power every DAX calculation later in the course.

---

# 1.1 Introduction to Power BI & Connecting to Data | 3 hours

## Objectives

- Explain what Business Intelligence (BI) is and where Power BI fits compared to Excel and databases.
- Navigate the three core views in Power BI Desktop: Report, Data, and Model.
- Connect Power BI to Excel, CSV, and SQL Server data sources.
- Load the **Pramanicus Mart** dataset (our running dataset for the whole course) and recognize its five tables.

### The Running Dataset: Pramanicus Mart

Throughout this entire course, we will use one consistent scenario: **Pramanicus Mart**, a fictional retail chain in India selling Electronics, Fashion, and Home & Kitchen products across four regions (North, South, East, West). Every module from here to Module 11 reuses these same tables, so the column names below are worth remembering.

| Table | Type | Key Columns |
|---|---|---|
| `Fact_Sales` | Fact | `SalesID`, `Date`, `ProductID`, `CustomerID`, `RegionID`, `Quantity`, `UnitPrice`, `Discount`, `Amount`, `Cost` |
| `Dim_Product` | Dimension | `ProductID`, `ProductName`, `Category`, `Subcategory`, `Brand` |
| `Dim_Customer` | Dimension | `CustomerID`, `CustomerName`, `Segment`, `City`, `Country` |
| `Dim_Region` | Dimension | `RegionID`, `RegionName`, `Country`, `Manager` |
| `Dim_Calendar` | Dimension | `Date`, `Year`, `Quarter`, `Month`, `MonthName`, `Day`, `Weekday`, `IsWeekend` |

You will receive this data as three source files that mimic real business messiness: `Sales_2023.csv`, `Sales_2024.xlsx`, and a `PramanicusMart` SQL database containing the dimension tables. We deliberately split it this way because in real jobs, data rarely arrives from one clean source.

## 1.1.1 What is Business Intelligence, and where does Power BI fit?

Business Intelligence is the practice of turning raw transactional data (like every sale Pramanicus Mart makes) into decisions — "Which region underperformed this quarter?", "Which product category has the best margin?". Excel handles this at small scale with PivotTables, but breaks down with millions of rows, multiple tables, and refresh automation. Power BI is Microsoft's BI tool: it combines a query engine (Power Query), a modeling engine (the Data Model, using the DAX language), and a visualization layer (Report view) in one product.

If you have a SQL/dev background: think of Power BI as three layers stacked together — Power Query is your ETL/staging script, the Data Model is your normalized database schema plus a calculation layer, and Report view is your front-end dashboard framework. In Django terms, Power Query is like your data migration/ETL scripts, the Data Model with relationships is like your `models.py` with `ForeignKey` relations, and DAX measures are like computed properties or annotated querysets — except recalculated live as a user clicks filters.

**Worked example:** Suppose a regional manager asks, "What was our total sales `Amount` for the Electronics category in the South region last month?" In Excel, you'd build a PivotTable filtering `Dim_Product[Category]` and `Dim_Region[RegionName]` against `Fact_Sales[Amount]`. Power BI does the same conceptually, but the filtering logic becomes reusable DAX measures that work across every report page, refresh automatically, and scale to millions of `Fact_Sales` rows.

## 1.1.2 Tour of the Power BI Desktop Interface

Power BI Desktop has three main views, switchable from icons on the left sidebar:

- **Report view** — where you build visuals (charts, tables, cards) on a canvas, arranged across multiple pages.
- **Data view** — a spreadsheet-like view of every table currently loaded into the model (e.g., you can scroll through `Fact_Sales` row by row).
- **Model view** — a diagram showing all your tables and the relationship lines connecting them (this is where Topic 1.3 will live).

There's also the **Ribbon** at the top (Home, Insert, Modeling, View tabs) and the **Fields pane** on the right, listing every table and column you've loaded — this is what you'll drag onto visuals or reference in DAX formulas.

**Analogy:** If you've used Excel, Data view feels like a worksheet, Report view feels like a dashboard sheet built from PivotCharts, and Model view is like an Access/SQL Server database diagram showing table relationships — except it's interactive and drives every visual automatically.

## 1.1.3 Connecting to Data Sources (Excel, CSV, SQL)

To bring data in, use **Home → Get Data**, choose a source type, and Power BI opens the Navigator/Query editor. For Pramanicus Mart, we'll connect to all three source types so you're comfortable with each:

**Connecting to a CSV file** (`Sales_2023.csv`):

```
Home → Get Data → Text/CSV → select Sales_2023.csv → Transform Data (opens Power Query, don't click Load yet)
```

**Connecting to an Excel workbook** (`Sales_2024.xlsx`, containing a `Sales2024` sheet):

```
Home → Get Data → Excel workbook → select Sales_2024.xlsx →
tick the "Sales2024" sheet in Navigator → Transform Data
```

**Connecting to SQL Server** (dimension tables live here):

```
Home → Get Data → SQL Server database
Server: pramanicus-sql-server.database.windows.net
Database: PramanicusMart
→ Navigator: tick Dim_Product, Dim_Customer, Dim_Region, Dim_Calendar
→ Transform Data
```

Always click **Transform Data** instead of **Load** directly — this routes every table through Power Query first, which is where Topic 1.2 cleans it up before it ever touches your model. If you have a SQL background: connecting to SQL Server here is exactly like pointing a BI tool at a live database connection string — Power BI can even push filtering back down to SQL Server via a feature called **query folding**, which we'll cover in depth in Topic 5.3.

### Common Beginner Mistakes

- Clicking **Load** instead of **Transform Data**, which skips Power Query and forces you to redo cleaning steps later.
- Loading the same CSV/Excel file twice under different names because of a typo, resulting in duplicate tables in the model.
- Ignoring the **Navigator** preview pane and loading an entire SQL schema instead of just the four dimension tables you need.

## Recap

- Business Intelligence turns raw data into decisions; Power BI is Microsoft's end-to-end BI tool (Query + Model + Report).
- Power BI Desktop has three views: Report, Data, and Model.
- We introduced the **Pramanicus Mart** dataset: `Fact_Sales` plus four dimension tables (`Dim_Product`, `Dim_Customer`, `Dim_Region`, `Dim_Calendar`), sourced from CSV, Excel, and SQL Server.
- Always route new data through **Transform Data** (Power Query) rather than **Load** directly.

## Homework / Practice

Using the Pramanicus Mart files provided:
1. Connect to `Sales_2023.csv` and `Sales_2024.xlsx` separately using **Get Data**, clicking **Transform Data** each time (do not load yet).
2. Connect to the `PramanicusMart` SQL database and load only `Dim_Product`, `Dim_Customer`, `Dim_Region`, and `Dim_Calendar` into the Power Query editor.
3. Without clicking "Close & Apply" yet, take a screenshot of your Power Query editor showing all 6 queries listed on the left (2 sales files + 4 dimension tables) — you'll clean these in the 1.2 homework.

---

# 1.2 Power Query Cleaning | 3 hours

## Objectives

- Fix incorrect data types (text-as-number, text-as-date) on Pramanicus Mart tables.
- Split and merge columns to extract usable fields from combined data.
- Remove duplicate rows and blank rows safely.
- Unpivot a wide, cross-tab style Excel export into a clean long format table.

## 1.2.1 Fixing Data Types

Raw exports rarely have correct data types — `Sales_2023.csv` loads `Date` as text (`"15-01-2023"`) and `Amount` as text with currency symbols (`"₹12,500"`). Power Query needs correct types before any DAX math or date logic works, because a text column can't be summed and a text "date" can't be filtered by year/month.

In the Power Query Editor, click the data-type icon (ABC123) in each column header, or right-click the column → **Change Type**.

```
// M code equivalent of manually changing types via the UI
Table.TransformColumnTypes(
    #"Previous Step",
    {{"Date", type date}, {"Amount", type number}, {"Quantity", Int64.Type}}
)
```

**Worked example:** After changing `Fact_Sales[Amount]` from text to Decimal Number, and `Fact_Sales[Date]` from text to Date, you can now drag `Date` onto a line chart and Power BI automatically recognizes it as a time axis — try that with a text column and it will just sort alphabetically instead.

**SQL analogy:** This is the equivalent of `ALTER TABLE Fact_Sales ALTER COLUMN Amount DECIMAL(10,2)` — you're enforcing a schema on data that arrived untyped, exactly like casting a CSV import in Python with `pd.to_numeric()` or `pd.to_datetime()`.

## 1.2.2 Splitting and Merging Columns

The SQL export for `Dim_Customer` contains a single `CustomerFullLocation` column like `"Mumbai, Maharashtra, India"`. We need separate `City`, `State`, `Country` columns to filter by city later.

**Split by delimiter:**

```
Select column CustomerFullLocation → Transform → Split Column → By Delimiter → Comma
→ rename resulting columns to City, State, Country
```

Equivalent M code:

```
= Table.SplitColumn(#"Previous Step", "CustomerFullLocation",
    Splitter.SplitTextByDelimiter(", ", QuoteStyle.Csv),
    {"City", "State", "Country"})
```

**Merge columns** is the reverse — useful if `Dim_Product` has separate `Category` and `Subcategory` columns but you want a single `CategoryPath` column like `"Electronics - Mobiles"` for a slicer label:

```
Select Category, then Subcategory (Ctrl+Click) → Transform → Merge Columns → Separator: " - " → New column name: CategoryPath
```

**Excel analogy:** Split Column is exactly like Excel's **Data → Text to Columns**; Merge Columns is like using `=CONCATENATE(A2," - ",B2)` — except Power Query remembers the step and reapplies it automatically every refresh, unlike a one-time Excel formula drag.

## 1.2.3 Removing Duplicates and Blank Rows

`Sales_2024.xlsx` has a known issue: a few rows were accidentally pasted twice, and there are trailing blank rows at the bottom of the sheet from Excel formatting.

```
Home → Remove Rows → Remove Blank Rows
Select SalesID column → Home → Remove Rows → Remove Duplicates
```

Equivalent M code:

```
= Table.Distinct(#"Removed Blank Rows", {"SalesID"})
```

**Common Beginner Mistake:** Running **Remove Duplicates** on the *entire table selection* instead of the unique key column (`SalesID`) — this can accidentally delete legitimate rows where every other column happens to match (e.g., two different customers buying the same product on the same day for the same amount). Always dedupe on the primary/unique key column, not the whole row, unless you're certain full-row duplication is the issue.

## 1.2.4 Unpivoting Wide Data

Pramanicus Mart's finance team sends a monthly budget file shaped like an Excel cross-tab — one row per `Category`, and separate columns per month (`Jan`, `Feb`, `Mar`, ...). This "wide" shape is unusable in Power BI, which needs one row per `Category` + `Month` + `Budget` combination ("long" format) to relate it to `Dim_Calendar`.

Before (wide):

| Category | Jan | Feb | Mar |
|---|---|---|---|
| Electronics | 50000 | 52000 | 51000 |
| Fashion | 30000 | 31000 | 29000 |

```
Select the Category column → right-click → Unpivot Other Columns
```

Equivalent M code:

```
= Table.UnpivotOtherColumns(#"Previous Step", {"Category"}, "Month", "Budget")
```

After (long — this is now model-ready):

| Category | Month | Budget |
|---|---|---|
| Electronics | Jan | 50000 |
| Electronics | Feb | 52000 |
| Fashion | Jan | 30000 |

**Python/pandas analogy:** Unpivot is identical to `pd.melt(df, id_vars=["Category"], var_name="Month", value_name="Budget")` — both reshape a cross-tab into a tidy, relational format that a data model (or a database table) can actually join against.

## Recap

- Correct data types (`type date`, `type number`) are mandatory before DAX or time-based visuals work correctly.
- **Split Column** and **Merge Columns** reshape single columns into multiple, or vice versa.
- Dedupe on a unique key column (like `SalesID`), never the whole row blindly.
- **Unpivot Other Columns** turns wide, cross-tab Excel exports into clean long-format tables ready for modeling.

## Homework / Practice

Using the 6 queries you loaded in the 1.1 homework:
1. Fix data types on `Fact_Sales`: `Date` → Date, `Amount`/`UnitPrice`/`Cost` → Decimal Number, `Quantity` → Whole Number.
2. Split `Dim_Customer[CustomerFullLocation]` into `City`, `State`, `Country` columns.
3. Remove duplicate rows from `Fact_Sales` based on `SalesID`, and remove any fully blank rows.
4. You'll be given a `Budget_2024.xlsx` wide-format file (`Category` + 12 month columns) — unpivot it into a long-format `Category, Month, Budget` table.

---

# 1.3 Data Modeling & Star Schema | 3 hours

## Objectives

- Distinguish fact tables from dimension tables and identify which Pramanicus Mart tables are which.
- Understand cardinality (one-to-many) and cross-filter direction in relationships.
- Build a correct star schema in Model view by connecting `Fact_Sales` to all four dimension tables.
- Recognize and avoid the most common modeling mistake: many-to-many relationships from missing surrogate keys.

## 1.3.1 Fact Tables vs. Dimension Tables

A **fact table** stores measurable events — every row in `Fact_Sales` is one transaction, with numeric columns you'll aggregate (`Amount`, `Quantity`, `Cost`). A **dimension table** stores descriptive attributes you filter and group by — `Dim_Product[Category]`, `Dim_Customer[Segment]`, `Dim_Region[RegionName]`. The rule of thumb: if a column answers "how much/how many," it belongs in the fact table; if it answers "what kind/who/where/when," it belongs in a dimension table.

**SQL analogy:** This is a normalized schema — `Fact_Sales` is your transactional table with foreign keys (`ProductID`, `CustomerID`, `RegionID`), and each `Dim_*` table is a lookup table you'd `JOIN` against. Power BI relationships are declarative joins: you define them once in Model view instead of writing `JOIN` in every query.

## 1.3.2 Star Schema Shape

Arranging `Fact_Sales` in the center with the four dimension tables around it produces a **star schema**:

```
        Dim_Product
             |
Dim_Customer — Fact_Sales — Dim_Region
             |
        Dim_Calendar
```

This shape (versus a "snowflake" where dimensions link to other dimensions) is preferred in Power BI because it keeps filter paths short and DAX performance predictable — a concept we'll revisit properly in Topic 8.1 on performance best practices.

## 1.3.3 Building Relationships in Model View

Switch to **Model view** (left sidebar icon). Power BI often auto-detects relationships by matching column names, but always verify each one manually:

```
Fact_Sales[ProductID]  → Dim_Product[ProductID]     (Many-to-One)
Fact_Sales[CustomerID] → Dim_Customer[CustomerID]    (Many-to-One)
Fact_Sales[RegionID]   → Dim_Region[RegionID]        (Many-to-One)
Fact_Sales[Date]       → Dim_Calendar[Date]          (Many-to-One)
```

To create one manually: drag `Dim_Product[ProductID]` onto `Fact_Sales[ProductID]` in Model view, or use **Modeling → Manage Relationships → New**. In the dialog, confirm:

- **Cardinality**: Many-to-one (many rows in `Fact_Sales` per one row in `Dim_Product`).
- **Cross filter direction**: Single (filters flow from `Dim_Product` → `Fact_Sales`, not backward) — this is the correct default for a clean star schema.

**Worked example:** Once `Fact_Sales[RegionID] → Dim_Region[RegionID]` exists, dragging `Dim_Region[RegionName]` and a `Sum of Amount` measure onto a bar chart automatically groups total sales by region — no manual `GROUP BY` needed, because the relationship already tells Power BI how to join them.

**Django analogy:** Defining this relationship is like adding `region = models.ForeignKey(Region, on_delete=models.CASCADE)` on your `Sale` model — you declare the relationship once, and every subsequent query (or in Power BI's case, every visual) can traverse it automatically.

### Common Beginner Mistakes

- Building a relationship on the wrong column — e.g., matching `Fact_Sales[CustomerID]` (a number) to `Dim_Customer[CustomerName]` (text) instead of `Dim_Customer[CustomerID]`, which either fails or silently produces wrong results.
- Leaving cross-filter direction set to **Both** on every relationship "just in case" — this can cause ambiguous filter paths and circular logic once more tables are added (we explain why this specifically breaks things in Topic 8.1).
- Forgetting to load `Dim_Calendar` and instead trying to use `Fact_Sales[Date]` directly for time intelligence — Module 3's YTD/MTD functions require a proper marked date table, which we'll set up as "Mark as Date Table" in this very topic's homework.

## Recap

- Fact tables hold measurable numeric events (`Fact_Sales`); dimension tables hold descriptive lookup attributes (`Dim_Product`, `Dim_Customer`, `Dim_Region`, `Dim_Calendar`).
- A star schema places the fact table at the center with dimensions radiating outward, keeping filter paths short.
- Relationships in Power BI are declarative joins — build them once in Model view (Many-to-one cardinality, Single cross-filter direction) and every visual can use them.
- Avoid ambiguous **Both** cross-filter directions and mismatched join columns.

## Homework / Practice

Using your cleaned Pramanicus Mart queries from the 1.2 homework:
1. Switch to Model view and verify/create all four relationships: `Fact_Sales[ProductID]→Dim_Product`, `Fact_Sales[CustomerID]→Dim_Customer`, `Fact_Sales[RegionID]→Dim_Region`, `Fact_Sales[Date]→Dim_Calendar[Date]`.
2. Confirm each relationship is Many-to-one with Single cross-filter direction.
3. Right-click `Dim_Calendar` → **Mark as Date Table**, using the `Date` column — this is required before Module 3's time intelligence functions will work correctly.
4. Take a screenshot of your finished star schema diagram in Model view — it should visually resemble the star diagram shown in section 1.3.2.
