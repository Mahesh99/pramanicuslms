> 🎯 **Learning Objectives**
> By the end of this module you will write subqueries in SELECT, FROM, and WHERE clauses; handle nested subqueries; and combine result sets using UNION, UNION ALL, INTERSECT, and MINUS.

> 💡 **Session Info**
> **Week 3** · **Level:** Advanced · Covers curriculum Chapters 16–17 · **Final module of the SQL programme**

🔍
Section 16.1
## What is a Subquery?

A **subquery** (inner query) is a SELECT statement nested inside another SQL statement (outer query). Subqueries are enclosed in parentheses.

**Types by placement:**

| Location | Purpose |
|----------|---------|
| WHERE clause | Filter based on another query's result |
| SELECT clause | Compute a column value per row |
| FROM clause | Use query result as a temporary table (inline view) |

🎯
Section 16.2
## Subquery in WHERE Clause

Most common use — filter rows based on a computed set:

```sql
-- Employees earning above the average salary
SELECT emp_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Employees in departments located in 'HYDERABAD'
SELECT emp_name
FROM employees
WHERE dept_id IN (
  SELECT dept_id FROM departments WHERE location = 'HYDERABAD'
);

-- EXISTS — true if subquery returns any row
SELECT emp_name
FROM employees e
WHERE EXISTS (
  SELECT 1 FROM departments d
  WHERE d.dept_id = e.dept_id AND d.location = 'MUMBAI'
);
```

📋
Section 16.3
## Subquery in FROM Clause (Inline View)

Treat a subquery result as a table:

```sql
SELECT dept_id, avg_sal
FROM (
  SELECT dept_id, AVG(salary) AS avg_sal
  FROM employees
  GROUP BY dept_id
) dept_avg
WHERE avg_sal > 50000;
```

📊
Section 16.4
## Subquery in SELECT Clause

Scalar subquery — returns one value per row:

```sql
SELECT emp_name,
       salary,
       (SELECT AVG(salary) FROM employees) AS company_avg,
       salary - (SELECT AVG(salary) FROM employees) AS diff_from_avg
FROM employees;
```

> ⚠️ **Note**
> Scalar subqueries in SELECT must return exactly one row and one column per outer row, or Oracle raises an error.

🪆
Section 16.5
## Nested Subqueries

Subqueries inside subqueries — evaluate from inside out:

```sql
SELECT emp_name, salary
FROM employees
WHERE dept_id IN (
  SELECT dept_id FROM departments
  WHERE location IN (
    SELECT city FROM company_locations WHERE country = 'INDIA'
  )
);
```

**Correlated subquery** — inner query references outer query columns:

```sql
SELECT e.emp_name, e.salary
FROM employees e
WHERE e.salary > (
  SELECT AVG(salary) FROM employees WHERE dept_id = e.dept_id
);
```

🔀
Section 17.1
## Set Operators — Overview

Set operators combine the results of two or more SELECT statements into one result set. **Requirements:** same number of columns, compatible data types, and column order.

| Operator | Result |
|----------|--------|
| `UNION` | All rows from both queries, duplicates removed |
| `UNION ALL` | All rows from both queries, duplicates kept |
| `INTERSECT` | Rows appearing in both queries |
| `MINUS` | Rows in first query but not in second |

➕
Section 17.2
## UNION & UNION ALL

```sql
-- Active employees + contractors (no duplicates)
SELECT emp_name, 'Employee' AS type FROM employees
UNION
SELECT contractor_name, 'Contractor' FROM contractors;

-- Keep duplicates
SELECT city FROM offices
UNION ALL
SELECT city FROM warehouses;
```

🔁
Section 17.3
## INTERSECT & MINUS

```sql
-- Cities that have both an office and a warehouse
SELECT city FROM offices
INTERSECT
SELECT city FROM warehouses;

-- Employees who are NOT managers
SELECT emp_id FROM employees
MINUS
SELECT manager_id FROM employees WHERE manager_id IS NOT NULL;
```

> 💡 **Tip**
> `MINUS` is Oracle-specific. In MySQL/PostgreSQL use `EXCEPT` instead.

🎓
Section 17.4
## Course Completion Recap

Congratulations — you have completed the **Oracle SQL Training** programme at Pramanicus Academy!

**What you covered across 8 modules:**

| Module | Topics |
|--------|--------|
| 1 | Database, DBMS, RDBMS, SQL fundamentals |
| 2 | Users, schemas, data modeling, data dictionary, data types |
| 3 | DDL (CREATE, ALTER, DROP, TRUNCATE) & DML (INSERT, UPDATE, DELETE, MERGE) |
| 4 | Constraints & transaction control (COMMIT, ROLLBACK, SAVEPOINT) |
| 5 | DCL (GRANT, REVOKE) & DRL (SELECT, WHERE, ORDER BY, GROUP BY, HAVING) |
| 6 | Relational, negation, logical, and arithmetic operators |
| 7 | Functions (string, numeric, date, group, analytical) & joins |
| 8 | Subqueries & set operators |

**Suggested next steps:** Practice on Oracle Live SQL or a local Oracle XE instance; explore SQL Developer; consider certification paths (Oracle SQL certification).

✏️
Practice
## Final Practice Exercises

1. Write a query using a correlated subquery to find employees earning above their department average.
2. Use UNION to combine `employees` and `contractors` into one contact list.
3. Find products ordered by customers in Hyderabad using nested subqueries (3 levels).
4. Use INTERSECT to find departments that have both senior (salary > 60000) and junior (salary < 40000) employees.

> 🎯 **Programme Complete**
> You now have a solid foundation in Oracle SQL. Keep practicing — real mastery comes from writing queries on live data every day.
