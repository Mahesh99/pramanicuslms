> 🎯 **Learning Objectives**
> By the end of this module you will be able to: explain what a database, DBMS, and RDBMS are; describe how SQL fits into the relational model; compare file-based storage with a database; and name the major RDBMS products used in industry — with a focus on Oracle SQL for this course.

> 💡 **Session Info**
> **Duration:** ~90 minutes · **Prerequisite:** None — this is the foundation session · **Course:** Pramanicus Academy — Oracle SQL Training (3-week programme)

🗄️
Section 1.1
## What is a Database?

A **database** is an organized collection of related data that can be easily accessed, managed, and updated.

**Analogy:** Think of a database like a well-organized cupboard of files in a company — instead of loose papers scattered everywhere, everything is filed in labeled folders so anyone can find what they need quickly.

**Examples of data stored in a database:**

- Student records in a college (name, roll number, marks)
- Customer orders in an e-commerce app (order ID, product, price)
- Employee details in a company (ID, department, salary)

### Why not just use Excel or text files?

| File System (Excel/Notepad) | Database |
|---|---|
| No security control | User-level access control |
| Data duplication is common | Data redundancy is minimized |
| Difficult to handle large data | Handles millions of records efficiently |
| No relationships between files | Data can be linked via relationships |
| Manual backup | Built-in backup & recovery |

⚙️
Section 1.2
## What is a DBMS?

**DBMS (Database Management System)** is software used to create, store, manage, and manipulate databases.

It acts as an **interface between the user and the database** — the user never talks to raw data files directly; they talk to the DBMS, and the DBMS handles the data underneath.

**Core functions of a DBMS:**

- Data storage and retrieval
- Data security (user permissions)
- Data integrity (accuracy and consistency)
- Concurrent access (multiple users at once)
- Backup and recovery

**Examples of DBMS software:** File-based systems, early hierarchical/network databases.

📊
Section 1.3
## What is an RDBMS?

**RDBMS (Relational Database Management System)** is a type of DBMS that stores data in the form of **tables (rows and columns)**, and these tables can be **related to each other** using keys (like Primary Key and Foreign Key — covered in Module 4).

**Table structure example:**

| EmpID | EmpName | Department | Salary |
|-------|---------|------------|--------|
| 101   | Ravi    | IT         | 50000  |
| 102   | Anjali  | HR         | 45000  |
| 103   | Kiran   | IT         | 55000  |

- Each **row** = one record (one employee)
- Each **column** = one attribute/field (EmpName, Department, etc.)
- **Table** = collection of related rows

### DBMS vs RDBMS

| DBMS | RDBMS |
|---|---|
| Stores data as files | Stores data as tables |
| No relationship between data | Data can be related via keys |
| Data redundancy is higher | Data redundancy is reduced (normalization) |
| Suitable for small data | Suitable for large, structured data |
| Example concept: flat file storage | Example: Oracle, MySQL, SQL Server |

💬
Section 1.4
## What is SQL?

**SQL (Structured Query Language)** is the standard language used to communicate with an RDBMS — to create, read, update, and delete data.

SQL commands are grouped into **5 categories** (each gets its own module in this course):

| Category | Full Form | Purpose | Example Commands |
|----------|-----------|---------|-------------------|
| **DDL** | Data Definition Language | Defines structure | CREATE, ALTER, DROP, TRUNCATE |
| **DML** | Data Manipulation Language | Modifies data | INSERT, UPDATE, DELETE, MERGE |
| **DCL** | Data Control Language | Controls access | GRANT, REVOKE |
| **TCL** | Transaction Control Language | Manages transactions | COMMIT, ROLLBACK, SAVEPOINT |
| **DRL/DQL** | Data Retrieval/Query Language | Fetches data | SELECT |

> 💡 **Course Roadmap**
> This table is your guide for the entire SQL programme. Modules 3–8 walk through each category in depth, from creating tables to writing complex queries with joins and subqueries.

🏢
Section 1.5
## RDBMS Products in the Market

| RDBMS | Owned By | Common Use Case |
|-------|----------|------------------|
| Oracle Database | Oracle Corporation | Enterprise applications, banking |
| MySQL | Oracle Corporation (open source) | Web applications |
| Microsoft SQL Server | Microsoft | Enterprise Windows-based systems |
| PostgreSQL | Open Source Community | Advanced open-source applications |
| SQLite | Open Source | Mobile apps, lightweight local storage |
| IBM DB2 | IBM | Large enterprise/mainframe systems |

**In this course, we work with Oracle SQL** — one of the most widely used RDBMS in industry and a strong foundation for learning any other SQL dialect (MySQL, SQL Server, PostgreSQL all follow similar core syntax).

> ⚠️ **Note on PL/SQL**
> This course covers **SQL only** (querying and managing relational data). PL/SQL — Oracle's procedural extension — is **not** part of this syllabus.

📋
Section 1.6
## Key Terms & Recap

**Key terms covered today:**

- **Database** — organized collection of data
- **DBMS** — software to manage databases
- **RDBMS** — DBMS that uses related tables
- **SQL** — language to interact with RDBMS
- **Table, Row, Column** — building blocks of relational data

**Quick recap:**

1. A **database** stores related data in an organized way.
2. A **DBMS** is the software that manages that data.
3. An **RDBMS** stores data in tables that can be linked together.
4. **SQL** is how we talk to an RDBMS — through five command categories (DDL, DML, DCL, TCL, DRL).
5. **Oracle Database** is our focus in this 3-week programme.

✏️
Practice
## Homework for Next Class

1. List **3 real-life examples** of databases you interact with daily (apps, systems).
2. In your own words, explain the difference between **DBMS** and **RDBMS**.
3. Write down which SQL command category (DDL / DML / DCL / TCL / DRL) you think each of these belongs to — no need to know syntax yet, just guess based on today's class:
   - Creating a new table → **DDL**
   - Adding a new row of data → **DML**
   - Fetching a list of customers → **DRL**
   - Giving another user permission to view a table → **DCL**

> 💡 **Next up — Module 2**
> Basics of Oracle SQL: Users & Schemas, Data Modeling, Data Dictionary, and Oracle SQL Data Types.
