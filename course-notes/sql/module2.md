> 🎯 **Learning Objectives**
> By the end of this module you will understand Oracle users and schemas, basic data modeling concepts, how to explore the data dictionary, and the core Oracle SQL data types used when defining tables.

> 💡 **Session Info**
> **Week 1** · **Level:** Beginner · Covers curriculum Chapters 2

👤
Section 2.1
## Users and Schemas

In Oracle, a **user** is an account that can connect to the database. Each user owns a **schema** — a logical container for that user's database objects (tables, views, indexes, etc.).

- **User** = login identity (username + password)
- **Schema** = collection of objects owned by that user
- In Oracle, **user name and schema name are the same** by default

**Why this matters:** When you run `CREATE TABLE employees (...)`, the table is created in *your* schema. Other users need permissions (covered in Module 5) to access it.

**Common schema objects:** Tables, Views, Indexes, Sequences, Synonyms, Procedures (procedural objects are outside this SQL-only course).

🏗️
Section 2.2
## Introduction to Data Modeling

**Data modeling** is the process of designing how data is stored — identifying entities, attributes, and relationships before writing any SQL.

**Key concepts:**

| Concept | Description | Example |
|---------|-------------|---------|
| **Entity** | A real-world object we store data about | Employee, Department, Order |
| **Attribute** | A property of an entity | EmpName, Salary, DeptID |
| **Relationship** | How entities connect | Employee *belongs to* Department |
| **Primary Key** | Unique identifier for each row | EmpID |
| **Foreign Key** | Links to a primary key in another table | DeptID in Employee → Department |

**Entity-Relationship (ER) diagram** — a visual blueprint of tables and their relationships. We use this before writing `CREATE TABLE` statements in Module 3.

📖
Section 2.3
## Introduction to Data Dictionary

The **data dictionary** is a set of read-only tables and views that Oracle maintains automatically. It stores metadata — information *about* your database objects.

**Useful data dictionary views:**

| View | What it shows |
|------|---------------|
| `USER_TABLES` | Tables in your schema |
| `USER_TAB_COLUMNS` | Columns of your tables |
| `USER_CONSTRAINTS` | Constraints on your tables |
| `ALL_TABLES` | Tables you can access (any schema) |
| `DBA_TABLES` | All tables in the database (DBA only) |

**Example — list your tables:**

```sql
SELECT table_name FROM user_tables;
```

**Example — describe a table's columns:**

```sql
SELECT column_name, data_type, nullable
FROM user_tab_columns
WHERE table_name = 'EMPLOYEES';
```

> 💡 **Tip**
> In SQL*Plus or SQL Developer, the shortcut `DESC table_name` shows column details instantly.

🔢
Section 2.4
## Oracle SQL Data Types

When you create a table, every column must have a **data type** — it defines what kind of data the column can hold.

### Character Types

| Type | Description | Example |
|------|-------------|---------|
| `CHAR(n)` | Fixed-length string, padded with spaces | `CHAR(10)` for codes |
| `VARCHAR2(n)` | Variable-length string up to n chars | `VARCHAR2(100)` for names |
| `NCHAR` / `NVARCHAR2` | Unicode character types | Multi-language text |

### Numeric Types

| Type | Description | Example |
|------|-------------|---------|
| `NUMBER` | Generic numeric | `NUMBER(10,2)` — 10 digits, 2 decimal |
| `NUMBER(p,s)` | Precision and scale | Salary: `NUMBER(8,2)` |
| `INTEGER` | Whole numbers | Age, quantity |

### Date & Time Types

| Type | Description |
|------|-------------|
| `DATE` | Date and time to the second |
| `TIMESTAMP` | Fractional seconds precision |
| `TIMESTAMP WITH TIME ZONE` | Includes timezone offset |

### Large Object (LOB) Types

| Type | Description |
|------|-------------|
| `CLOB` | Large text (Character LOB) |
| `BLOB` | Binary data (images, files) |

**Example table definition (preview for Module 3):**

```sql
CREATE TABLE employees (
  emp_id    NUMBER(5)       PRIMARY KEY,
  emp_name  VARCHAR2(100)   NOT NULL,
  hire_date DATE            DEFAULT SYSDATE,
  salary    NUMBER(10,2),
  bio       CLOB
);
```

✏️
Practice
## Practice Exercises

1. What is the difference between a **user** and a **schema** in Oracle?
2. Name three entities and their attributes for a **library management** system.
3. Write a query to list all table names in your schema using `USER_TABLES`.
4. Which data type would you choose for: (a) a person's name, (b) a product price, (c) an order date?

> 💡 **Next up — Module 3**
> DDL & DML Commands: CREATE, ALTER, DROP, TRUNCATE, INSERT, UPDATE, DELETE, and MERGE.
