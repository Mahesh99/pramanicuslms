> 🎯 **Learning Objectives**
> By the end of this module you will understand all major Oracle constraints for data integrity, and how to manage transactions with COMMIT, ROLLBACK, and SAVEPOINT.

> 💡 **Session Info**
> **Week 2** · **Level:** Beginner–Intermediate · Covers curriculum Chapters 5–6

🔒
Section 5.1
## What are Constraints?

**Constraints** are rules enforced on table columns to maintain **data integrity** — ensuring data is accurate, consistent, and valid.

| Constraint | Purpose |
|------------|---------|
| `NOT NULL` | Column cannot be empty |
| `CHECK` | Value must satisfy a condition |
| `UNIQUE` | All values must be distinct |
| `PRIMARY KEY` | Unique + NOT NULL identifier |
| `FOREIGN KEY` | References a primary key in another table |

Constraints can be defined at **column level** (inline) or **table level**.

🚫
Section 5.2
## NOT NULL Constraint

Ensures a column always has a value:

```sql
CREATE TABLE employees (
  emp_id   NUMBER(5) PRIMARY KEY,
  emp_name VARCHAR2(100) NOT NULL,
  email    VARCHAR2(100)  -- nullable
);
```

✅
Section 5.3
## CHECK Constraint

Validates data against a condition:

```sql
CREATE TABLE employees (
  emp_id NUMBER(5) PRIMARY KEY,
  salary NUMBER(10,2) CHECK (salary > 0),
  grade  CHAR(1) CHECK (grade IN ('A','B','C','D'))
);
```

🔑
Section 5.4
## UNIQUE & PRIMARY KEY Constraints

```sql
CREATE TABLE employees (
  emp_id   NUMBER(5)   PRIMARY KEY,
  email    VARCHAR2(100) UNIQUE,
  aadhar   VARCHAR2(12) UNIQUE
);
```

- **PRIMARY KEY** = UNIQUE + NOT NULL; one per table
- **UNIQUE** allows one NULL (in Oracle, multiple NULLs are allowed in UNIQUE columns)

🔗
Section 5.5
## FOREIGN KEY & ON DELETE CASCADE

Links a column to a parent table's primary key:

```sql
CREATE TABLE employees (
  emp_id  NUMBER(5) PRIMARY KEY,
  dept_id NUMBER(4) REFERENCES departments(dept_id)
);

-- With cascade delete
CREATE TABLE orders (
  order_id NUMBER PRIMARY KEY,
  cust_id  NUMBER REFERENCES customers(cust_id)
    ON DELETE CASCADE
);
```

**ON DELETE CASCADE** — when a parent row is deleted, all related child rows are automatically deleted.

🧩
Section 5.6
## Composite Keys

A **composite key** uses two or more columns together as a primary key or unique constraint:

```sql
CREATE TABLE enrollments (
  student_id NUMBER,
  course_id  NUMBER,
  grade      CHAR(2),
  PRIMARY KEY (student_id, course_id)
);
```

💾
Section 6.1
## Transaction Control Language (TCL)

A **transaction** is a logical unit of work — a group of DML statements treated as one operation. TCL manages when changes become permanent.

| Command | Purpose |
|---------|---------|
| `COMMIT` | Save all changes permanently |
| `ROLLBACK` | Undo all changes since last COMMIT |
| `SAVEPOINT` | Mark a point to roll back to |

✅
Section 6.2
## COMMIT

```sql
INSERT INTO employees VALUES (104, 'Priya', 48000);
UPDATE employees SET salary = 50000 WHERE emp_id = 104;
COMMIT;  -- Both changes are now permanent
```

💡
Section 6.3
## ROLLBACK

```sql
DELETE FROM employees WHERE dept_id = 99;
-- Oops — wrong department!
ROLLBACK;  -- DELETE is undone
```

📍
Section 6.4
## SAVEPOINT

```sql
SAVEPOINT before_update;
UPDATE employees SET salary = 0 WHERE emp_id = 999;
ROLLBACK TO before_update;  -- Only the UPDATE is undone
COMMIT;
```

✏️
Practice
## Practice Exercises

1. Create an `orders` table with a FOREIGN KEY to a `customers` table.
2. Add a CHECK constraint so `order_amount` must be greater than 0.
3. Explain the difference between PRIMARY KEY and UNIQUE.
4. Write a transaction with INSERT + UPDATE, then ROLLBACK — what happens?

> 💡 **Next up — Module 5**
> Data Control Language (GRANT, REVOKE) and Data Retrieval (SELECT, WHERE, ORDER BY, GROUP BY, HAVING).
