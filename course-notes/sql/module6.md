> 🎯 **Learning Objectives**
> By the end of this module you will master all SQL operator categories — relational, negation, logical, and arithmetic — and use them confidently in WHERE clauses and SELECT expressions.

> 💡 **Session Info**
> **Week 2** · **Level:** Intermediate · Covers curriculum Chapters 9–13

⚡
Section 9.1
## Introduction to SQL Operators

**Operators** are symbols or keywords that perform operations on data — comparing values, combining conditions, or performing calculations.

**Four categories in this module:**

| Category | Operators |
|----------|-----------|
| Relational | `=`, `<`, `>`, `<=`, `>=`, `!=`, `IN`, `BETWEEN`, `LIKE`, `IS NULL`, `\|\|` |
| Relational Negation | `NOT LIKE`, `NOT IN`, `NOT BETWEEN`, `IS NOT NULL`, `!=` |
| Logical | `AND`, `OR`, `NOT` |
| Arithmetic | `+`, `-`, `*`, `/` |

🔢
Section 10.1
## Relational Operators

Compare values and return TRUE, FALSE, or NULL:

```sql
-- Equals, less than, greater than
SELECT * FROM employees WHERE salary = 50000;
SELECT * FROM employees WHERE salary < 40000;
SELECT * FROM employees WHERE salary >= 55000;

-- Not equals (Oracle supports all three forms)
SELECT * FROM employees WHERE dept_id != 10;
SELECT * FROM employees WHERE dept_id <> 10;
SELECT * FROM employees WHERE dept_id ^= 10;
```

📋
Section 10.2
## IN, BETWEEN, LIKE & IS NULL

```sql
-- IN — match any value in a list
SELECT * FROM employees WHERE dept_id IN (10, 20, 30);

-- BETWEEN — range (inclusive)
SELECT * FROM employees WHERE salary BETWEEN 40000 AND 60000;

-- LIKE — pattern matching (% = any chars, _ = one char)
SELECT * FROM employees WHERE emp_name LIKE 'R%';    -- starts with R
SELECT * FROM employees WHERE emp_name LIKE '_avi';  -- 4 chars ending in avi

-- IS NULL — check for missing values
SELECT * FROM employees WHERE commission IS NULL;

-- Concatenation
SELECT emp_name || ' - ' || dept_id AS label FROM employees;
```

🚫
Section 11.1
## Relational Negation Operators

Negate relational conditions:

```sql
SELECT * FROM employees WHERE emp_name NOT LIKE 'R%';
SELECT * FROM employees WHERE dept_id NOT IN (10, 20);
SELECT * FROM employees WHERE salary NOT BETWEEN 30000 AND 50000;
SELECT * FROM employees WHERE commission IS NOT NULL;
```

> 💡 **Tip**
> `NOT IN` with NULLs in the list can produce unexpected results — prefer `NOT EXISTS` for subqueries (Module 8).

🔗
Section 12.1
## Logical Operators

Combine multiple conditions:

```sql
-- AND — both conditions must be true
SELECT * FROM employees
WHERE dept_id = 10 AND salary > 50000;

-- OR — either condition
SELECT * FROM employees
WHERE dept_id = 10 OR dept_id = 20;

-- NOT — invert a condition
SELECT * FROM employees
WHERE NOT (dept_id = 10);
```

**Operator precedence:** `NOT` → `AND` → `OR`. Use parentheses to clarify:

```sql
SELECT * FROM employees
WHERE (dept_id = 10 OR dept_id = 20) AND salary > 45000;
```

➕
Section 13.1
## Arithmetic Operators

Perform calculations on numeric columns and literals:

| Operator | Operation | Example |
|----------|-----------|---------|
| `+` | Addition | `salary + bonus` |
| `-` | Subtraction | `salary - deduction` |
| `*` | Multiplication | `salary * 12` |
| `/` | Division | `salary / 2` |

```sql
SELECT emp_name,
       salary,
       salary * 12 AS annual_salary,
       salary + NVL(commission, 0) AS total_comp
FROM employees;
```

> ⚠️ **Note**
> Division by zero returns an error. Use `NULLIF(denominator, 0)` to avoid it.

✏️
Practice
## Practice Exercises

1. Find employees whose names start with 'A' and salary is above 45000.
2. List employees NOT in departments 10 or 20.
3. Write a query using BETWEEN for hire dates in 2023.
4. Calculate each employee's monthly salary from an annual salary column.

> 💡 **Next up — Module 7**
> SQL Functions and Joins: string, numeric, date, conversion, group, and analytical functions; inner and outer joins.
