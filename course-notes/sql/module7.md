> 🎯 **Learning Objectives**
> By the end of this module you will use Oracle SQL functions for strings, numbers, dates, and conversions; apply group functions for aggregation; and combine data from multiple tables using joins.

> 💡 **Session Info**
> **Week 3** · **Level:** Intermediate–Advanced · Covers curriculum Chapters 14–15

🔤
Section 14.1
## String Functions

Transform and extract text:

| Function | Purpose | Example |
|----------|---------|---------|
| `UPPER` / `LOWER` | Change case | `UPPER(emp_name)` |
| `LENGTH` | Character count | `LENGTH(emp_name)` |
| `SUBSTR` | Extract substring | `SUBSTR(emp_name, 1, 3)` |
| `TRIM` / `LTRIM` / `RTRIM` | Remove spaces | `TRIM(emp_name)` |
| `REPLACE` | Replace text | `REPLACE(phone, '-', '')` |
| `CONCAT` | Join strings | `CONCAT(first, last)` |
| `INITCAP` | Capitalize words | `INITCAP(emp_name)` |

```sql
SELECT UPPER(emp_name) AS name,
       SUBSTR(emp_name, 1, 1) || LOWER(SUBSTR(emp_name, 2)) AS proper_name
FROM employees;
```

🔢
Section 14.2
## Numeric Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `ROUND` | Round to n decimals | `ROUND(salary, -3)` |
| `TRUNC` | Truncate decimals | `TRUNC(salary, -3)` |
| `MOD` | Remainder | `MOD(emp_id, 2)` |
| `CEIL` / `FLOOR` | Round up/down | `CEIL(salary/1000)*1000` |
| `ABS` | Absolute value | `ABS(balance)` |

📅
Section 14.3
## Date Functions

| Function | Purpose |
|----------|---------|
| `SYSDATE` | Current date and time |
| `ADD_MONTHS(d, n)` | Add n months to date d |
| `MONTHS_BETWEEN(d1, d2)` | Months between two dates |
| `LAST_DAY(d)` | Last day of month |
| `NEXT_DAY(d, 'MON')` | Next Monday after d |
| `EXTRACT(YEAR FROM d)` | Extract year, month, day |

```sql
SELECT emp_name,
       hire_date,
       MONTHS_BETWEEN(SYSDATE, hire_date) AS months_employed
FROM employees;
```

🔄
Section 14.4
## Conversion Functions

Convert between data types:

| Function | Purpose |
|----------|---------|
| `TO_CHAR(n, format)` | Number/date to string |
| `TO_NUMBER(s)` | String to number |
| `TO_DATE(s, format)` | String to date |
| `CAST(x AS type)` | Generic cast |

```sql
SELECT TO_CHAR(salary, '₹99,999.99') AS formatted_salary,
       TO_CHAR(hire_date, 'DD-MON-YYYY') AS hire_fmt
FROM employees;
```

📊
Section 14.5
## Group Functions

Aggregate values across rows (used with GROUP BY):

| Function | Purpose |
|----------|---------|
| `COUNT(*)` / `COUNT(col)` | Count rows / non-null values |
| `SUM(col)` | Total |
| `AVG(col)` | Average |
| `MIN(col)` / `MAX(col)` | Minimum / maximum |

```sql
SELECT dept_id,
       COUNT(*) AS headcount,
       ROUND(AVG(salary), 2) AS avg_sal,
       MAX(salary) AS top_sal
FROM employees
GROUP BY dept_id;
```

📈
Section 14.6
## Analytical Functions (Overview)

Analytical functions compute values across a set of rows related to the current row — without collapsing rows like GROUP BY:

```sql
SELECT emp_name, salary, dept_id,
       RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dept_rank,
       SUM(salary) OVER (PARTITION BY dept_id) AS dept_total
FROM employees;
```

Common analytical functions: `RANK`, `DENSE_RANK`, `ROW_NUMBER`, `LAG`, `LEAD`, `SUM/AVG OVER`.

🔗
Section 15.1
## What is a Join?

A **join** combines rows from two or more tables based on a related column — typically a foreign key relationship.

**Sample tables:**

```sql
-- departments: dept_id, dept_name
-- employees: emp_id, emp_name, dept_id
```

🔀
Section 15.2
## Inner Join (Equi Join)

Returns only rows with matching values in both tables:

```sql
SELECT e.emp_name, d.dept_name, e.salary
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;

-- Oracle legacy syntax (still seen in industry)
SELECT e.emp_name, d.dept_name
FROM employees e, departments d
WHERE e.dept_id = d.dept_id;
```

⬅️
Section 15.3
## Outer Joins

Return all rows from one table, plus matches from the other (NULL where no match):

```sql
-- LEFT OUTER JOIN — all employees, even without a department
SELECT e.emp_name, d.dept_name
FROM employees e
LEFT OUTER JOIN departments d ON e.dept_id = d.dept_id;

-- RIGHT OUTER JOIN — all departments, even with no employees
SELECT e.emp_name, d.dept_name
FROM employees e
RIGHT OUTER JOIN departments d ON e.dept_id = d.dept_id;

-- FULL OUTER JOIN — all rows from both tables
SELECT e.emp_name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.dept_id;
```

✖️
Section 15.4
## Cross Join & Non-Equi Join

**Cross Join** — Cartesian product (every row paired with every row):

```sql
SELECT e.emp_name, d.dept_name
FROM employees e
CROSS JOIN departments d;
```

**Non-Equi Join** — join condition uses `<`, `>`, `BETWEEN` instead of `=`:

```sql
SELECT e.emp_name, g.grade_level
FROM employees e
JOIN salary_grades g
  ON e.salary BETWEEN g.min_sal AND g.max_sal;
```

✏️
Practice
## Practice Exercises

1. Write a query showing each employee's name, department name, and formatted salary.
2. Find departments with no employees using a LEFT JOIN and `WHERE d.dept_id IS NULL`.
3. Use `MONTHS_BETWEEN` to list employees hired more than 5 years ago.
4. Rank employees by salary within each department using `RANK() OVER`.

> 💡 **Next up — Module 8**
> Subqueries and Set Operators: nested queries, subqueries in FROM/SELECT/WHERE, UNION, INTERSECT, MINUS.
