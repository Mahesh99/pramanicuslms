> 🎯 **Learning Objectives**
> By the end of this module you will be able to create and modify table structures using DDL commands, and insert, update, delete, and merge data using DML commands in Oracle SQL.

> 💡 **Session Info**
> **Week 1** · **Level:** Beginner · Covers curriculum Chapters 3–4

🏗️
Section 3.1
## Data Definition Language (DDL) — Overview

**DDL** commands define and change the **structure** of database objects. They auto-commit in Oracle — changes take effect immediately and cannot be rolled back with TCL.

| Command | Purpose |
|---------|---------|
| `CREATE TABLE` | Create a new table |
| `ALTER TABLE` | Modify an existing table |
| `DROP TABLE` | Permanently remove a table |
| `TRUNCATE TABLE` | Remove all rows, keep structure |
| `RENAME` | Rename a table or column |

📋
Section 3.2
## CREATE TABLE

```sql
CREATE TABLE departments (
  dept_id   NUMBER(4)     PRIMARY KEY,
  dept_name VARCHAR2(50)  NOT NULL,
  location  VARCHAR2(100)
);
```

**Key points:**

- Column name + data type are required
- Constraints (NOT NULL, PRIMARY KEY) can be inline or added later
- Use `CREATE TABLE ... AS SELECT` to copy structure + data from another table

📝
Section 3.3
## ALTER TABLE

Modify structure without losing the table:

```sql
-- Add a column
ALTER TABLE employees ADD (email VARCHAR2(100));

-- Modify a column
ALTER TABLE employees MODIFY (salary NUMBER(12,2));

-- Drop a column
ALTER TABLE employees DROP COLUMN email;

-- Rename a column
ALTER TABLE employees RENAME COLUMN emp_name TO full_name;
```

🔧
Section 3.4
## TRUNCATE, DROP & RENAME

| Command | Effect | Reversible? |
|---------|--------|-------------|
| `TRUNCATE TABLE t` | Deletes all rows, keeps table | No (DDL auto-commits) |
| `DROP TABLE t` | Removes table and all data | No — use with caution |
| `RENAME t TO new_name` | Renames the table | Yes (rename back) |

```sql
TRUNCATE TABLE temp_data;
DROP TABLE old_backup;
RENAME employees TO staff;
```

✏️
Section 4.1
## Data Manipulation Language (DML) — Overview

**DML** commands modify the **data inside** tables. Changes can be committed or rolled back using TCL (Module 4).

| Command | Purpose |
|---------|---------|
| `INSERT` | Add new rows |
| `UPDATE` | Modify existing rows |
| `DELETE` | Remove rows |
| `MERGE` | Insert or update in one statement (upsert) |

➕
Section 4.2
## INSERT Command

```sql
-- Insert one row
INSERT INTO employees (emp_id, emp_name, salary)
VALUES (101, 'Ravi', 50000);

-- Insert from another table
INSERT INTO emp_backup
SELECT * FROM employees WHERE dept_id = 10;

-- Insert multiple rows
INSERT ALL
  INTO employees VALUES (102, 'Anjali', 45000)
  INTO employees VALUES (103, 'Kiran', 55000)
SELECT * FROM dual;
```

✏️
Section 4.3
## UPDATE Command

```sql
-- Update specific rows
UPDATE employees
SET salary = salary * 1.10
WHERE dept_id = 10;

-- Update with subquery (preview — full coverage in Module 8)
UPDATE employees e
SET salary = (SELECT avg_sal FROM dept_avg WHERE dept_id = e.dept_id)
WHERE emp_id = 101;
```

> ⚠️ **Warning**
> Always use a `WHERE` clause with UPDATE and DELETE unless you intend to affect every row.

🗑️
Section 4.4
## DELETE Command

```sql
-- Delete specific rows
DELETE FROM employees WHERE emp_id = 105;

-- Delete all rows (prefer TRUNCATE for large tables)
DELETE FROM employees;
```

🔀
Section 4.5
## MERGE Command

**MERGE** (upsert) — insert if not exists, update if exists:

```sql
MERGE INTO employees e
USING new_hires n ON (e.emp_id = n.emp_id)
WHEN MATCHED THEN
  UPDATE SET e.salary = n.salary
WHEN NOT MATCHED THEN
  INSERT (emp_id, emp_name, salary)
  VALUES (n.emp_id, n.emp_name, n.salary);
```

✏️
Practice
## Practice Exercises

1. Create a `students` table with columns: `roll_no`, `name`, `marks` (choose appropriate data types).
2. Insert 3 rows into your `students` table.
3. Update the marks of one student by roll number.
4. What is the difference between `DELETE`, `TRUNCATE`, and `DROP`?

> 💡 **Next up — Module 4**
> Constraints and Transaction Control: NOT NULL, CHECK, UNIQUE, PRIMARY KEY, FOREIGN KEY, COMMIT, ROLLBACK, SAVEPOINT.
