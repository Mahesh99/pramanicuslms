> 🎯 **Learning Objectives**
> By the end of this module you will control user access with GRANT and REVOKE, and write SELECT queries with filtering, sorting, grouping, and aggregation using Oracle SQL.

> 💡 **Session Info**
> **Week 2** · **Level:** Intermediate · Covers curriculum Chapters 7–8

🔐
Section 7.1
## Data Control Language (DCL)

**DCL** commands manage **who can do what** in the database — permissions and access control.

| Command | Purpose |
|---------|---------|
| `GRANT` | Give privileges to a user or role |
| `REVOKE` | Remove privileges from a user or role |

**Common privileges:**

- `SELECT`, `INSERT`, `UPDATE`, `DELETE` — on specific tables
- `CREATE TABLE`, `CREATE VIEW` — schema-level
- `ALL` — all privileges on an object

✅
Section 7.2
## GRANT

```sql
-- Allow user 'hr_user' to read the employees table
GRANT SELECT ON employees TO hr_user;

-- Allow full DML access
GRANT SELECT, INSERT, UPDATE, DELETE ON employees TO hr_admin;

-- Grant with ability to pass privileges to others
GRANT SELECT ON employees TO hr_user WITH GRANT OPTION;
```

🚫
Section 7.3
## REVOKE

```sql
REVOKE SELECT ON employees FROM hr_user;
REVOKE ALL ON employees FROM hr_admin;
```

> ⚠️ **Note**
> Revoking a privilege does not cascade to users who received it via `WITH GRANT OPTION` in all cases — review Oracle documentation for your version.

🔍
Section 8.1
## SELECT — Data Retrieval

**SELECT** is the most-used SQL command — it retrieves data from one or more tables.

```sql
-- All columns
SELECT * FROM employees;

-- Specific columns
SELECT emp_id, emp_name, salary FROM employees;

-- With alias
SELECT emp_name AS name, salary * 12 AS annual_salary FROM employees;
```

🎯
Section 8.2
## WHERE Clause

Filters rows based on a condition:

```sql
SELECT emp_name, salary
FROM employees
WHERE salary > 50000;

SELECT * FROM employees
WHERE dept_id = 10 AND hire_date >= DATE '2020-01-01';
```

Operators (=, <, >, IN, BETWEEN, LIKE, IS NULL) are covered in depth in Module 6.

📊
Section 8.3
## ORDER BY

Sorts the result set:

```sql
SELECT emp_name, salary
FROM employees
ORDER BY salary DESC;           -- highest first

SELECT dept_id, emp_name, salary
FROM employees
ORDER BY dept_id ASC, salary DESC;
```

**ASC** = ascending (default), **DESC** = descending.

📈
Section 8.4
## GROUP BY

Groups rows that share values and applies aggregate functions:

```sql
SELECT dept_id, COUNT(*) AS emp_count, AVG(salary) AS avg_salary
FROM employees
GROUP BY dept_id;
```

**Common aggregate functions:** `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` (full coverage in Module 7).

🔎
Section 8.5
## HAVING Clause

Filters **groups** after GROUP BY (WHERE filters individual rows):

```sql
SELECT dept_id, AVG(salary) AS avg_salary
FROM employees
GROUP BY dept_id
HAVING AVG(salary) > 45000;
```

**WHERE vs HAVING:**

| Clause | Filters | When applied |
|--------|---------|--------------|
| `WHERE` | Individual rows | Before grouping |
| `HAVING` | Groups | After grouping |

✏️
Practice
## Practice Exercises

1. Write a SELECT to show employee names and salaries where salary is between 40000 and 60000.
2. List departments with more than 5 employees using GROUP BY and HAVING.
3. GRANT SELECT on your `employees` table to another user (if in a shared lab environment).
4. Write a query that returns the top 3 highest-paid employees (hint: ORDER BY + ROWNUM or FETCH FIRST in Oracle 12c+).

> 💡 **Next up — Module 6**
> SQL Operators: relational, negation, logical, and arithmetic operators in depth.
