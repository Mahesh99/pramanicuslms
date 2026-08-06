# Python Training — Detailed Syllabus
### Pramanicus Academy — Ramanthapur, Hyderabad

**Duration:** 4 Weeks | **Mode:** Classroom / Online  
**Prerequisite:** Basic computer literacy (no prior programming experience required)  
**Python Version:** 3.x

---

## Table of Contents

1. [Module 1 — Python Fundamentals](#module-1)
2. [Module 2 — Control Flow](#module-2)
3. [Module 3 — Data Structures](#module-3)
4. [Module 4 — Functions](#module-4)
5. [Module 5 — Object-Oriented Programming](#module-5)
6. [Module 6 — Exception Handling & File I/O](#module-6)
7. [Module 7 — Modules, Packages & Standard Library](#module-7)
8. [Module 8 — Iterators, Generators & Decorators](#module-8)
9. [Assessment Structure](#assessment)
10. [Tools & Resources](#tools)

---

## Module 1 — Python Fundamentals <a name="module-1"></a>

**Week:** 1 | **Sessions:** 4–5

### Overview
This module lays the foundation for all future learning. Students will set up their environment, understand how Python works, and write their first programs.

---

### 1.1 Introduction to Python

- **History & Philosophy** — Guido van Rossum, 1991; "batteries included" design; readability first
- **Python 2 vs Python 3** — key differences, why Python 3 is the standard
- **Installation** — Python.org installer, verifying with `python --version`, PATH setup
- **IDEs & Editors**
  - **VS Code** — extensions (Python, Pylance), settings, integrated terminal
  - **PyCharm** — Community vs Professional, project setup, debugger overview
  - **Jupyter Notebook / JupyterLab** — cell-based execution, use in data tasks
- **Running Python code**
  - Interactive shell (`python` / `python3`) — REPL concept
  - Running script files (`python filename.py`)
  - Difference between script mode and interactive mode

> **Practice:** Install Python and VS Code. Run `print("Hello, World!")` both in the shell and as a script.

---

### 1.2 Variables & Data Types

- **What is a variable?** — name, value, reference model
- **Naming conventions** — `snake_case`, reserved keywords, valid identifiers
- **Core Data Types**

  | Type    | Example            | Notes                          |
  |---------|--------------------|--------------------------------|
  | `int`   | `x = 10`           | Whole numbers, unlimited size  |
  | `float` | `pi = 3.14`        | Decimal / IEEE 754             |
  | `str`   | `name = "Alice"`   | Immutable sequence of chars    |
  | `bool`  | `flag = True`      | `True` / `False`; subclass of `int` |
  | `complex` | `z = 3 + 4j`   | Real + imaginary parts         |

- **Dynamic typing** — variables can rebind to different types
- **`type()` function** — checking the type at runtime
- **`id()` function** — understanding object identity

> **Practice:** Create variables of each type, print them and their types.

---

### 1.3 Type Casting & Type Checking

- **Implicit vs Explicit conversion**
  - `int()`, `float()`, `str()`, `bool()`, `complex()`
  - Common pitfalls: `int("3.14")` raises `ValueError`; use `int(float("3.14"))` instead
- **`isinstance(value, type)`** — safe type checking
- **`type(value) == SomeType`** — exact type check (does not account for subclasses)

```python
x = "42"
y = int(x)          # explicit cast
z = float(x)        # 42.0
print(isinstance(y, int))   # True
```

---

### 1.4 Operators

- **Arithmetic:** `+`, `-`, `*`, `/`, `//` (floor div), `%` (modulo), `**` (power)
- **Comparison:** `==`, `!=`, `<`, `>`, `<=`, `>=` — always return `bool`
- **Logical:** `and`, `or`, `not` — short-circuit evaluation
- **Bitwise:** `&`, `|`, `^`, `~`, `<<`, `>>` — operate on binary representation
- **Assignment:** `=`, `+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `**=`, `&=`, `|=`, `^=`
- **Identity:** `is`, `is not` — compare object identity (not value)
- **Membership:** `in`, `not in` — check containment in sequences/sets
- **Operator precedence** — PEMDAS/BODMAS, use parentheses for clarity

> **Practice:** Write expressions that demonstrate precedence; predict and verify results.

---

### 1.5 Input / Output & String Formatting

- **`input(prompt)`** — always returns `str`; cast as needed
- **`print(*objects, sep, end, file, flush)`** — multiple arguments, custom separator/end

**String Formatting Methods:**

```python
name = "Arjun"
score = 95.5

# f-string (Python 3.6+) — recommended
print(f"Student: {name}, Score: {score:.1f}")

# .format()
print("Student: {}, Score: {:.1f}".format(name, score))

# % formatting (legacy)
print("Student: %s, Score: %.1f" % (name, score))
```

- **Multi-line strings** — triple quotes `"""..."""`
- **Raw strings** — `r"path\to\file"` (no escape processing)
- **Escape sequences** — `\n`, `\t`, `\\`, `\'`, `\"`

---

### 1.6 Comments & Docstrings

- **Single-line comments** — `# this is a comment`
- **Inline comments** — use sparingly; keep on the same line as code
- **Multi-line comments** — consecutive `#` lines (Python has no `/* */`)
- **Docstrings** — `"""..."""` immediately after `def` or `class`; accessible via `__doc__`

```python
def greet(name):
    """
    Return a greeting string for the given name.

    Args:
        name (str): The person's name.

    Returns:
        str: A greeting message.
    """
    return f"Hello, {name}!"
```

---

### 1.7 Indentation & PEP 8 Basics

- **Indentation defines blocks** — 4 spaces per level (no tabs)
- **Why indentation?** — enforced readability, no `{}` needed
- **PEP 8 highlights**
  - Max line length: 79 characters
  - Two blank lines around top-level functions/classes
  - One blank line between methods inside a class
  - Spaces around operators; no space before `:` in slices
  - Imports at top; one import per line
- **`pycodestyle` / `flake8`** — tools to check PEP 8 compliance automatically

---

## Module 2 — Control Flow <a name="module-2"></a>

**Week:** 1–2 | **Sessions:** 3–4

### Overview
Control flow lets programs make decisions and repeat actions. This module covers every branching and looping construct in Python.

---

### 2.1 Conditional Statements

```python
age = int(input("Enter age: "))

if age < 13:
    print("Child")
elif age < 18:
    print("Teenager")
elif age < 60:
    print("Adult")
else:
    print("Senior")
```

- **Truthiness** — `0`, `""`, `[]`, `{}`, `None`, `False` are falsy; everything else is truthy
- **`not` keyword** — negate a condition
- **Nested `if`** — indent additional `if` inside another block

---

### 2.2 Loops

#### `for` Loop
- Iterates over any iterable (list, string, range, dict, ...)

```python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# with index
for i, fruit in enumerate(fruits):
    print(i, fruit)
```

#### `while` Loop
- Runs as long as condition is `True`

```python
count = 0
while count < 5:
    print(count)
    count += 1
```

- **Infinite loop guard** — always ensure the condition eventually becomes `False`
- **`while True` with `break`** — common pattern for menu-driven programs

---

### 2.3 Loop Control Statements

| Statement  | Effect                                        |
|------------|-----------------------------------------------|
| `break`    | Exit the nearest enclosing loop immediately   |
| `continue` | Skip the rest of this iteration; go to next   |
| `pass`     | Do nothing; placeholder for empty blocks      |

```python
for n in range(10):
    if n == 3:
        continue   # skip 3
    if n == 7:
        break      # stop at 7
    print(n)
```

- **`for/else` and `while/else`** — `else` block runs only if loop completed without `break`

---

### 2.4 Useful Built-ins for Loops

```python
# range(start, stop, step)
for i in range(0, 20, 2):   # 0, 2, 4, ..., 18
    print(i)

# enumerate — index + value
for idx, val in enumerate(["a", "b", "c"], start=1):
    print(idx, val)

# zip — pair elements from multiple iterables
names  = ["Alice", "Bob", "Carol"]
scores = [88, 92, 75]
for name, score in zip(names, scores):
    print(f"{name}: {score}")
```

---

### 2.5 Ternary (Conditional) Expression

```python
# value_if_true if condition else value_if_false
label = "even" if x % 2 == 0 else "odd"
```

- Useful for simple one-liners; avoid nesting ternaries (hurts readability)

---

### 2.6 Practice Problems

- Print a right-angle triangle of `*` using nested loops
- Print the multiplication table (1–10)
- FizzBuzz (1–100): print "Fizz" for multiples of 3, "Buzz" for 5, "FizzBuzz" for both
- Reverse a number without using string conversion
- Find all prime numbers up to N using a sieve

---

## Module 3 — Data Structures <a name="module-3"></a>

**Week:** 2 | **Sessions:** 4–5

### Overview
Python's built-in data structures handle most real-world data needs. Understanding each one's strengths and trade-offs is essential.

---

### 3.1 Strings

- **Immutable** — cannot modify in place; every operation returns a new string
- **Indexing & slicing:** `s[0]`, `s[-1]`, `s[1:4]`, `s[::-1]` (reverse)
- **Key methods:**

  ```python
  s = "  Hello, World!  "
  s.strip()           # "Hello, World!"
  s.lower()           # "  hello, world!  "
  s.upper()
  s.replace("World", "Python")
  s.split(", ")       # ["  Hello", "World!  "]
  ",".join(["a","b"]) # "a,b"
  s.find("World")     # index of first occurrence, -1 if not found
  s.startswith("  He")
  s.endswith("!  ")
  s.count("l")        # 3
  s.isdigit()         # False
  s.isalpha()         # False
  ```

- **String multiplication:** `"ha" * 3` → `"hahaha"`
- **`in` operator:** `"llo" in "Hello"` → `True`

---

### 3.2 Lists

- **Mutable, ordered, allows duplicates**
- **Creation:** `[]`, `list()`, `list(range(5))`

  ```python
  nums = [3, 1, 4, 1, 5, 9]
  nums.append(2)
  nums.insert(0, 0)
  nums.remove(1)          # removes first occurrence
  nums.pop()              # removes & returns last element
  nums.pop(2)             # removes & returns index 2
  nums.sort()
  nums.sort(reverse=True)
  nums.reverse()
  nums.index(4)           # first index of value 4
  nums.count(1)
  len(nums)
  nums.copy()             # shallow copy
  nums.clear()
  ```

- **Slicing:** `nums[1:4]`, `nums[::2]`, `nums[::-1]`
- **List comprehension:**

  ```python
  squares = [x**2 for x in range(1, 11)]
  evens   = [x for x in range(20) if x % 2 == 0]
  matrix  = [[i*j for j in range(1,4)] for i in range(1,4)]
  ```

---

### 3.3 Tuples

- **Immutable, ordered, allows duplicates**
- Prefer tuples for fixed collections (coordinates, RGB values, DB rows)
- **Creation:** `(1, 2, 3)`, `tuple([1,2,3])`, single-element: `(42,)` (trailing comma required)
- **Packing & unpacking:**

  ```python
  point = (10, 20)
  x, y = point               # unpacking
  a, *rest = (1, 2, 3, 4)    # starred unpacking: a=1, rest=[2,3,4]
  ```

- **Named tuples** (`collections.namedtuple`) — readable field access without full class

---

### 3.4 Sets

- **Mutable, unordered, no duplicates**
- Use for membership testing (O(1)) and mathematical set operations

  ```python
  a = {1, 2, 3, 4}
  b = {3, 4, 5, 6}

  a | b   # union        → {1,2,3,4,5,6}
  a & b   # intersection → {3,4}
  a - b   # difference   → {1,2}
  a ^ b   # symmetric diff → {1,2,5,6}

  a.add(10)
  a.discard(2)   # no error if missing
  a.remove(2)    # KeyError if missing
  3 in a         # True
  ```

- **`frozenset`** — immutable set; can be used as dict key

---

### 3.5 Dictionaries

- **Mutable, ordered (Python 3.7+), key-value pairs, keys must be hashable**

  ```python
  student = {"name": "Riya", "age": 20, "grade": "A"}

  student["name"]            # "Riya"
  student.get("score", 0)    # 0 (default if missing)
  student["score"] = 98      # add/update
  del student["grade"]
  student.pop("age")

  student.keys()
  student.values()
  student.items()            # (key, value) pairs

  student.update({"city": "Hyderabad", "score": 99})
  ```

- **Dictionary comprehension:**

  ```python
  squares = {x: x**2 for x in range(1, 6)}
  filtered = {k: v for k, v in scores.items() if v >= 60}
  ```

- **`defaultdict`, `Counter`, `OrderedDict`** from `collections` — worth knowing

---

### 3.6 Nested Data Structures

```python
# List of dicts — common for tabular data
students = [
    {"name": "Alice", "marks": 88},
    {"name": "Bob",   "marks": 72},
]
for s in students:
    print(s["name"], s["marks"])

# Dict of lists — grouping
schedule = {
    "Monday":    ["Math", "Physics"],
    "Tuesday":   ["Chemistry", "English"],
}
```

---

### 3.7 Choosing the Right Data Structure

| Scenario                             | Best choice     |
|--------------------------------------|-----------------|
| Ordered, changeable collection       | `list`          |
| Fixed, unchangeable collection       | `tuple`         |
| Unique items, fast lookup/set ops    | `set`           |
| Key → value mapping                  | `dict`          |
| Ordered dict with default values     | `defaultdict`   |
| Counting / frequency analysis        | `Counter`       |

---

## Module 4 — Functions <a name="module-4"></a>

**Week:** 2–3 | **Sessions:** 4

### Overview
Functions are the primary unit of code reuse in Python. This module covers everything from basic definitions to advanced functional programming tools.

---

### 4.1 Defining & Calling Functions

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("Kiran")
print(message)
```

- `def` keyword, function name, parameters in parentheses, body indented
- `return` exits the function and optionally sends a value back
- Functions without `return` implicitly return `None`

---

### 4.2 Types of Arguments

```python
def describe(name, age=18, *hobbies, **details):
    print(f"{name}, age {age}")
    print("Hobbies:", hobbies)
    print("Details:", details)

describe("Priya", 22, "chess", "coding", city="Hyderabad", grade="A")
```

| Type           | Syntax           | Description                                 |
|----------------|------------------|---------------------------------------------|
| Positional     | `def f(a, b)`    | Matched by position                         |
| Keyword        | `f(a=1, b=2)`    | Matched by name at call site                |
| Default         | `def f(x=10)`    | Used if caller doesn't supply the argument  |
| `*args`        | `def f(*args)`   | Collects extra positional args as tuple     |
| `**kwargs`     | `def f(**kwargs)`| Collects extra keyword args as dict         |
| Keyword-only   | `def f(*, k)`    | Must be passed by keyword (after `*`)       |

- **Argument unpacking at call site:** `f(*list_)`, `f(**dict_)`

---

### 4.3 Return Values & Multiple Returns

```python
def min_max(numbers):
    return min(numbers), max(numbers)   # returns a tuple

lo, hi = min_max([3, 1, 4, 1, 5, 9])
```

- Python always returns exactly one object; multiple values are packed in a tuple
- Unpacking at assignment separates them

---

### 4.4 Variable Scope

```python
x = "global"

def outer():
    x = "outer"
    def inner():
        nonlocal x
        x = "inner"
    inner()
    print(x)   # "inner"

outer()
print(x)       # "global"
```

| Scope    | Keyword    | Description                                     |
|----------|------------|-------------------------------------------------|
| Local    | —          | Inside the current function                     |
| Enclosing| `nonlocal` | In the nearest enclosing function (closures)    |
| Global   | `global`   | Module-level name                               |
| Built-in | —          | Python's built-in names (`print`, `len`, ...)   |

- **LEGB rule** — Python looks up names in this order: Local → Enclosing → Global → Built-in

---

### 4.5 Lambda Functions

```python
square = lambda x: x ** 2
add    = lambda a, b: a + b

# Most useful when passed as arguments:
nums = [3, 1, 4, 1, 5]
nums.sort(key=lambda x: -x)   # descending sort
```

- Anonymous, single-expression functions
- Cannot contain statements (loops, `if` blocks, `return`)
- Prefer named functions for anything complex

---

### 4.6 Recursion

```python
def factorial(n):
    if n == 0:          # base case
        return 1
    return n * factorial(n - 1)   # recursive case
```

- **Base case** — prevents infinite recursion
- **Stack depth** — default recursion limit is 1000 (`sys.setrecursionlimit`)
- **Use cases:** tree traversal, divide-and-conquer, mathematical sequences
- **Practical examples:** Fibonacci, Tower of Hanoi, binary search

---

### 4.7 Functional Tools

```python
from functools import reduce

nums = [1, 2, 3, 4, 5]

squares  = list(map(lambda x: x**2, nums))    # [1,4,9,16,25]
evens    = list(filter(lambda x: x%2==0, nums)) # [2,4]
total    = reduce(lambda a, b: a+b, nums)       # 15
```

| Tool       | Description                                           |
|------------|-------------------------------------------------------|
| `map(f, iter)` | Apply `f` to each element; returns iterator       |
| `filter(f, iter)` | Keep elements where `f(x)` is truthy          |
| `reduce(f, iter)` | Cumulatively apply `f` to collapse to one value|

- List comprehensions are often more Pythonic than `map`/`filter`

---

### 4.8 Docstrings & Documentation

- Write docstrings for every public function, method, and class
- Follow **Google style**, **NumPy style**, or **Sphinx/reStructuredText** — choose one and be consistent
- Use `help(function_name)` to view docstrings in the REPL
- Tools: `pydoc`, `Sphinx` for auto-generating documentation sites

---

## Module 5 — Object-Oriented Programming <a name="module-5"></a>

**Week:** 3 | **Sessions:** 5–6

### Overview
OOP organises code around objects that bundle data (attributes) and behaviour (methods). This is essential for building larger, maintainable applications.

---

### 5.1 Classes & Objects

```python
class Dog:
    species = "Canis lupus familiaris"   # class variable

    def __init__(self, name, breed):
        self.name  = name    # instance variable
        self.breed = breed

    def bark(self):
        return f"{self.name} says: Woof!"

rex = Dog("Rex", "Labrador")
print(rex.bark())
print(Dog.species)
```

- `class` keyword defines a blueprint
- `__init__` is the **constructor** — called automatically when creating an instance
- `self` refers to the current instance; must be the first parameter of instance methods
- **Instance variables** (`self.x`) belong to one object; **class variables** are shared

---

### 5.2 Encapsulation

```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance    # private (name-mangled to _BankAccount__balance)

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount

    def get_balance(self):
        return self.__balance
```

| Convention | Prefix | Meaning                               |
|------------|--------|---------------------------------------|
| Public     | none   | Accessible everywhere                 |
| Protected  | `_`    | "Internal use" — convention only      |
| Private    | `__`   | Name-mangled; harder to access externally |

- Python relies on convention more than strict enforcement

---

### 5.3 Inheritance

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError

class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

# Multiple inheritance
class C(A, B): ...

# Method Resolution Order
print(C.__mro__)
```

- **`super()`** — call parent class methods
- **MRO** (C3 linearisation) — determines which parent's method is called in diamond inheritance
- **`isinstance(obj, Class)`** — check inheritance chain
- **`issubclass(Child, Parent)`**

---

### 5.4 Polymorphism

```python
animals = [Dog("Rex"), Cat("Whiskers")]
for animal in animals:
    print(animal.speak())   # different behaviour, same interface
```

- **Method overriding** — child class re-implements a parent method
- **Duck typing** — "If it walks like a duck and quacks like a duck, it's a duck"
  - Python checks what an object *can do*, not what it *is*

---

### 5.5 Abstraction

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass

class Circle(Shape):
    def __init__(self, r):
        self.r = r

    def area(self):
        import math
        return math.pi * self.r ** 2

    def perimeter(self):
        import math
        return 2 * math.pi * self.r
```

- `ABC` + `@abstractmethod` — cannot instantiate abstract class directly
- Enforces that subclasses implement specific methods

---

### 5.6 Dunder / Magic Methods

| Method           | Triggered by                        |
|------------------|-------------------------------------|
| `__init__`       | `MyClass()`                         |
| `__str__`        | `str(obj)`, `print(obj)`            |
| `__repr__`       | `repr(obj)`, REPL output            |
| `__len__`        | `len(obj)`                          |
| `__eq__`         | `obj == other`                      |
| `__lt__`         | `obj < other`                       |
| `__add__`        | `obj + other`                       |
| `__getitem__`    | `obj[key]`                          |
| `__contains__`   | `item in obj`                       |
| `__enter__/exit__` | `with` statement                  |

```python
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"
```

---

### 5.7 Class Methods, Static Methods & Properties

```python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Temperature below absolute zero!")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

    @classmethod
    def from_fahrenheit(cls, f):
        return cls((f - 32) * 5/9)

    @staticmethod
    def is_valid(c):
        return c >= -273.15
```

| Decorator       | Receives     | Use case                                      |
|-----------------|--------------|-----------------------------------------------|
| `@property`     | `self`       | Computed attribute; getter/setter/deleter     |
| `@classmethod`  | `cls`        | Alternative constructors; factory methods     |
| `@staticmethod` | nothing      | Utility functions logically grouped with class|

---

## Module 6 — Exception Handling & File I/O <a name="module-6"></a>

**Week:** 3–4 | **Sessions:** 3

### Overview
Robust programs anticipate and handle errors gracefully. File I/O is among the most common real-world tasks.

---

### 6.1 Errors vs Exceptions

- **Syntax errors** — caught before execution (`SyntaxError`, `IndentationError`)
- **Exceptions** — runtime errors that can be caught and handled
- **Exception hierarchy** — `BaseException` → `Exception` → specific exceptions

---

### 6.2 try / except / else / finally

```python
try:
    result = 10 / int(input("Divisor: "))
except ZeroDivisionError:
    print("Cannot divide by zero.")
except ValueError as e:
    print(f"Invalid input: {e}")
except (TypeError, OverflowError):
    print("Type or overflow error.")
else:
    print(f"Result: {result}")   # runs only if no exception
finally:
    print("Execution complete.")  # always runs
```

- **Multiple `except` clauses** — most specific first
- **`except Exception as e`** — access the exception object
- **Bare `except`** — catches everything including `KeyboardInterrupt`; avoid this

---

### 6.3 Raising & Custom Exceptions

```python
class InsufficientFundsError(Exception):
    def __init__(self, amount, balance):
        self.amount  = amount
        self.balance = balance
        super().__init__(f"Cannot withdraw {amount}; balance is {balance}.")

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(amount, balance)
    return balance - amount
```

- `raise ExceptionClass(args)` — raise a new exception
- `raise` (bare) — re-raise the current exception inside an `except` block
- Custom exception classes inherit from `Exception` (or a more specific built-in)

---

### 6.4 File Handling

```python
# Reading
with open("data.txt", "r", encoding="utf-8") as f:
    content  = f.read()          # entire file as string
    lines    = f.readlines()     # list of lines
    # or iterate: for line in f:

# Writing
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("Hello\n")
    f.writelines(["line1\n", "line2\n"])

# Appending
with open("log.txt", "a") as f:
    f.write("New entry\n")
```

**File modes:**

| Mode | Description                        |
|------|------------------------------------|
| `r`  | Read (default); file must exist    |
| `w`  | Write; creates or truncates        |
| `a`  | Append; creates or appends         |
| `r+` | Read + write; file must exist      |
| `b`  | Binary mode (add to any above)     |

- Always use `with` — guarantees `close()` even if exception occurs

---

### 6.5 CSV & JSON Files

```python
import csv, json

# CSV — read
with open("students.csv", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["score"])

# CSV — write
with open("out.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name","score"])
    writer.writeheader()
    writer.writerow({"name": "Alice", "score": 92})

# JSON
data = {"name": "Bob", "scores": [88, 91]}
json_str = json.dumps(data, indent=2)      # dict → JSON string
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)           # dict → JSON file

with open("data.json") as f:
    loaded = json.load(f)                  # JSON file → dict
```

---

### 6.6 File Paths

```python
import os
from pathlib import Path

# pathlib (recommended)
p = Path("data") / "students.csv"
p.exists()
p.stem          # "students"
p.suffix        # ".csv"
p.parent        # Path("data")
p.read_text()
p.write_text("content")
list(p.parent.glob("*.csv"))

# os.path (older style)
os.path.join("data", "file.txt")
os.path.exists("data/file.txt")
os.listdir(".")
os.makedirs("new/dir", exist_ok=True)
```

---

## Module 7 — Modules, Packages & Standard Library <a name="module-7"></a>

**Week:** 4 | **Sessions:** 3

### Overview
Python's "batteries included" philosophy means the standard library covers a huge range of tasks. This module also covers code organisation and dependency management.

---

### 7.1 Modules & Packages

```python
# Importing
import math
from math import pi, sqrt
from math import pi as PI
import math as m

# Your own module (myutils.py)
# from myutils import helper_function

# Packages
# my_package/
#   __init__.py
#   module_a.py
#   module_b.py
```

- `__init__.py` — marks directory as a package; can be empty or contain init code
- `if __name__ == "__main__":` — guard to prevent code running on import

---

### 7.2 Virtual Environments & pip

```bash
# Create virtual environment
python -m venv venv

# Activate (Linux/macOS)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install a package
pip install requests

# Freeze dependencies
pip freeze > requirements.txt

# Install from requirements
pip install -r requirements.txt
```

- Always use a virtual environment per project — isolates dependencies
- **`pip list`** — list installed packages
- **`pip show requests`** — details about a package

---

### 7.3 Key Standard Library Modules

#### `datetime`
```python
from datetime import datetime, timedelta, date

now   = datetime.now()
today = date.today()
delta = timedelta(days=7)
next_week = today + delta
formatted = now.strftime("%d-%m-%Y %H:%M")
parsed    = datetime.strptime("04-07-2026", "%d-%m-%Y")
```

#### `math`
```python
import math
math.sqrt(16), math.pi, math.e, math.ceil(3.2), math.floor(3.8)
math.log(100, 10), math.factorial(5), math.gcd(12, 8)
```

#### `random`
```python
import random
random.randint(1, 100)
random.choice(["a","b","c"])
random.shuffle(my_list)
random.sample(range(100), 10)
random.random()   # float in [0.0, 1.0)
```

#### `os` & `sys`
```python
import os, sys
os.getcwd(), os.listdir("."), os.environ.get("HOME")
os.makedirs("new_dir", exist_ok=True)
sys.argv        # command-line arguments
sys.exit(0)
sys.path        # module search paths
```

#### `re` — Regular Expressions
```python
import re
pattern = r"\d{3}-\d{4}"
re.match(pattern, "123-4567")
re.search(r"\bPython\b", text)
re.findall(r"\w+", sentence)
re.sub(r"\s+", " ", messy_string)
re.split(r"[,;]", "a,b;c")
```

---

## Module 8 — Iterators, Generators & Decorators <a name="module-8"></a>

**Week:** 4 | **Sessions:** 4

### Overview
These advanced features power Python's elegant lazy evaluation, memory efficiency, and metaprogramming patterns.

---

### 8.1 Iterables & Iterators

```python
# Any object with __iter__ is iterable
# __iter__ returns an iterator object
# The iterator has __next__

my_list = [1, 2, 3]
it = iter(my_list)
print(next(it))   # 1
print(next(it))   # 2
print(next(it))   # 3
# next(it) → StopIteration

# Building a custom iterator
class Countdown:
    def __init__(self, n):
        self.n = n

    def __iter__(self):
        return self

    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1
```

- `for` loops internally call `iter()` then `next()` until `StopIteration`

---

### 8.2 Generators

```python
# Generator function — uses yield
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

gen = fibonacci()
for _ in range(10):
    print(next(gen))

# Generator expression (lazy list comprehension)
squares = (x**2 for x in range(1_000_000))  # uses almost no memory
```

- `yield` suspends execution; resumes on next `next()` call
- Generator functions return a generator object (an iterator)
- **Memory efficiency** — values produced one at a time, not all at once
- **`yield from`** — delegate to another generator/iterable

---

### 8.3 Closures

```python
def make_multiplier(n):
    def multiplier(x):
        return x * n    # n is "closed over" from the enclosing scope
    return multiplier

triple = make_multiplier(3)
print(triple(7))   # 21
```

- A closure is a function that captures variables from its enclosing scope
- The captured variables are stored in `function.__closure__`

---

### 8.4 Decorators

```python
import functools

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        import time
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end   = time.perf_counter()
        print(f"{func.__name__} took {end - start:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    import time
    time.sleep(1)

slow_function()
```

- A decorator is a function that takes a function and returns a new function
- `@decorator` is syntactic sugar for `func = decorator(func)`
- **`@functools.wraps`** — preserves the original function's name and docstring
- **Decorators with arguments:**

```python
def repeat(n):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(n):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)
def hello():
    print("Hello!")
```

- **Stacking decorators** — applied bottom-up

---

### 8.5 `functools` Module

| Function              | Description                                          |
|-----------------------|------------------------------------------------------|
| `functools.wraps`     | Preserve metadata when wrapping functions            |
| `functools.lru_cache` | Memoisation — cache results of expensive functions   |
| `functools.partial`   | Fix some arguments to create a specialised function  |
| `functools.reduce`    | Cumulative fold over an iterable                     |
| `functools.total_ordering` | Supply `__eq__` + one comparison; get the rest  |

```python
from functools import lru_cache, partial

@lru_cache(maxsize=None)
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)

double = partial(pow, exp=2)   # partial application
```

---

## Assessment Structure <a name="assessment"></a>

| Component                | Weight | Description                                                       |
|--------------------------|--------|-------------------------------------------------------------------|
| Weekly Assignments       | 30%    | Coding problems after each module (submitted via GitHub/LMS)      |
| Mini Project 1           | 15%    | Console application using Modules 1–4 (e.g., a grade calculator)  |
| Mini Project 2           | 15%    | OOP + File I/O project using Modules 5–7 (e.g., a contact book)   |
| Capstone Project         | 30%    | End-to-end application covering all 8 modules                     |
| Final Assessment         | 10%    | Written + practical coding test                                   |

### Suggested Capstone Ideas
- **Expense Tracker** — CSV/JSON storage, OOP design, CLI interface
- **Student Management System** — File I/O, exception handling, data structures
- **Weather Report Tool** — API calls (`requests`), JSON parsing, formatted output
- **Text Analyzer** — Regex, generators, file processing
- **Library Management System** — Full OOP, file persistence, search & filter

---

## Tools & Resources <a name="tools"></a>

### Software
| Tool              | Purpose                                 | Download / Access                    |
|-------------------|-----------------------------------------|--------------------------------------|
| Python 3.x        | Language runtime                        | [python.org](https://python.org)     |
| VS Code           | Recommended editor                      | [code.visualstudio.com](https://code.visualstudio.com) |
| PyCharm Community | Full-featured Python IDE                | [jetbrains.com/pycharm](https://www.jetbrains.com/pycharm/) |
| Git               | Version control for assignments         | [git-scm.com](https://git-scm.com)  |

### VS Code Extensions to Install
- **Python** (Microsoft)
- **Pylance** — fast type checking
- **Jupyter** — run notebooks inside VS Code
- **GitLens** — enhanced Git integration

### Recommended References
- [Official Python Docs](https://docs.python.org/3/)
- [Real Python](https://realpython.com) — tutorials & articles
- [Python Tutor](https://pythontutor.com) — visualise code execution step-by-step
- [PEP 8](https://peps.python.org/pep-0008/) — Style Guide for Python Code

### Submission Guidelines
- All assignments submitted via the course GitHub repository or LMS portal
- Name files as: `module1_assignment.py`, `module2_assignment.py`, etc.
- Include your name, roll number, and date as comments at the top of every file
- Projects include a `README.md` with setup instructions and brief description

---

*Pramanicus Academy — Ramanthapur, Hyderabad*  
*Python Training | 4-Week Programme*
