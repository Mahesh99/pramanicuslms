# Section 8.7 — Decorators

> **Module:** 8 — Iterators, Generators & Decorators  
> **Level:** Advanced  
> **Format:** Slide-based (8 slides)  
> **Prerequisites:** Closures (8.6), First-class functions (Module 4)

---

<!-- slide: 1 | title: What is a Decorator? -->

## Slide 1: What is a Decorator?

A **decorator** is a *higher-order function* — a callable that accepts another function as its argument and returns a new, augmented version of that function called the *wrapper*. The wrapper executes extra logic before and/or after delegating to the original function, without modifying the original function's source code in any way.

Decorators implement the **Decorator design pattern**: they let you attach cross-cutting concerns — such as logging, timing, input validation, caching, or access control — to any function in a clean, reusable, non-invasive way.

### The @ Shorthand

Writing `@my_decorator` immediately above a function definition is *syntactic sugar* provided by Python. The two forms below are exactly identical:

| With @ syntax | Without @ syntax |
|---|---|
| `@my_decorator` <br> `def greet(): ...` | `def greet(): ...` <br> `greet = my_decorator(greet)` |

Python sees `@my_decorator` and translates it internally to `greet = my_decorator(greet)` at class or module load time — before any call is made to `greet`.

---

<!-- slide: 2 | title: Why Use Decorators? -->

## Slide 2: Why Use Decorators?

Decorators solve a fundamental software engineering challenge: how do you add the same behaviour to many functions without duplicating code or modifying each function's body?

**Separation of Concerns**  
Business logic stays inside the function; infrastructure concerns (logging, authentication, rate-limiting, timing) live in the decorator. Neither is tangled with the other.

**DRY Principle (Don't Repeat Yourself)**  
Write the wrapper logic once and apply it to as many functions as needed via a single `@` line. Changing the decorator changes the behaviour everywhere it is applied.

**Composability**  
Stack multiple decorators on a single function; each adds an independent, interchangeable layer of behaviour.

**Non-invasive Enhancement**  
The original function's internal code is untouched. It can still be imported, tested, and called in isolation without the decorator in place.

**Readability**  
The `@` annotation at the definition site makes it immediately visible that special behaviour is being applied to that function, without the reader needing to hunt through the code.

---

<!-- slide: 3 | title: Prerequisite — First-Class Functions -->

## Slide 3: Prerequisite — First-Class Functions

Decorators are only possible because Python treats functions as **first-class objects**. This means a function value can be:

- Assigned to a variable: `f = print`
- Passed as an argument to another function
- Returned as a return value from another function
- Stored in a list, dictionary, or any data structure

A **higher-order function** is any function that either takes a function as a parameter, returns a function, or both. A decorator is precisely a higher-order function that accepts a function and returns an enhanced version of it.

```python
# Functions can be assigned and passed around
def shout(text):
    return text.upper()

apply = shout              # assign function to a variable
print(apply("hello"))     # HELLO

def run_twice(fn, value):
    return fn(fn(value))  # pass fn as argument

print(run_twice(shout, "hello"))   # HELLO (already upper)
```

Understanding this is the key to understanding *why* the decorator pattern works: `decorator(func)` is just a function call where `func` is passed as data.

---

<!-- slide: 4 | title: Building a Decorator — Step by Step -->

## Slide 4: Building a Decorator — Step by Step

Every decorator follows the same three-part pattern:

1. **Outer function** accepts the original function as a parameter (`func`).
2. **Inner wrapper function** adds the extra behaviour and calls the original (`func(*args, **kwargs)`).
3. **Return the wrapper** — not the result of calling it.

```python
import functools

# Step 1 — outer function receives the target function
def my_decorator(func):

    # Step 2 — inner wrapper adds behaviour around func
    @functools.wraps(func)        # preserves func.__name__ and __doc__
    def wrapper(*args, **kwargs):
        print("Before the function runs")
        result = func(*args, **kwargs)   # delegate to the original
        print("After the function runs")
        return result

    # Step 3 — return wrapper (not the result of calling it!)
    return wrapper

@my_decorator
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
# Before the function runs
# Hello, Alice!
# After the function runs
```

> **Important:** `wrapper` uses `*args` and `**kwargs` so it can forward any combination of positional and keyword arguments to the original function, making the decorator universally applicable.

---

<!-- slide: 5 | title: functools.wraps — Why It Matters -->

## Slide 5: `functools.wraps` — Why It Matters

When you wrap a function, Python replaces it with the inner `wrapper` function. Without any extra help, the original function's **identity metadata** (`__name__`, `__doc__`, `__annotations__`, `__module__`, etc.) is lost and replaced by the wrapper's metadata. This breaks debugging, documentation tools (`help()`), and introspection.

`@functools.wraps(func)` copies all these attributes from `func` onto the wrapper, so the decorated function still appears to be the original from the outside.

```python
import functools

# Without @functools.wraps
def bad_decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@bad_decorator
def add(a, b):
    """Add two numbers."""
    return a + b

print(add.__name__)   # wrapper          ← WRONG
print(add.__doc__)    # None             ← WRONG

# With @functools.wraps
def good_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@good_decorator
def add(a, b):
    """Add two numbers."""
    return a + b

print(add.__name__)   # add              ← correct
print(add.__doc__)    # Add two numbers. ← correct
```

Always apply `@functools.wraps(func)` to the inner wrapper in every decorator you write. It is a best practice with no downside.

---

<!-- slide: 6 | title: Practical — Timer Decorator -->

## Slide 6: Practical — Timer Decorator

A **timer decorator** measures how long a function takes to execute. It captures a high-resolution timestamp before the call and another immediately after, then prints the elapsed time. This is useful for profiling and benchmarking without cluttering the function body with timing code.

```python
import functools, time

def timer(func):
    """Measure and print the execution time of any decorated function."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start  = time.perf_counter()       # nanosecond-resolution clock
        result = func(*args, **kwargs)
        end    = time.perf_counter()
        elapsed = end - start
        print(f"[timer] {func.__name__} took {elapsed:.6f} seconds")
        return result
    return wrapper

@timer
def slow_sum(n):
    """Return the sum of the first n integers."""
    return sum(range(n))

result = slow_sum(10_000_000)
# [timer] slow_sum took 0.123456 seconds
print(result)      # 49999995000000
```

> `time.perf_counter()` returns a float in seconds measured from an arbitrary reference point. It is the most precise clock available in Python and is always preferred over `time.time()` for benchmarking because it is not affected by system clock adjustments.

---

<!-- slide: 7 | title: Practical — Logger Decorator -->

## Slide 7: Practical — Logger Decorator

A **logger decorator** automatically records every call to a function — printing the function name, the arguments it received, and the value it returned. This replaces manual `print` statements scattered throughout the codebase and is especially valuable during debugging.

```python
import functools

def logger(func):
    """Log each call: function name, arguments, and return value."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        pos_args  = ", ".join(repr(a) for a in args)
        kw_args   = ", ".join(f"{k}={v!r}" for k, v in kwargs.items())
        all_args  = ", ".join(filter(None, [pos_args, kw_args]))
        print(f"CALL  {func.__name__}({all_args})")
        result = func(*args, **kwargs)
        print(f"RETURN {func.__name__} → {result!r}")
        return result
    return wrapper

@logger
def add(a, b):
    return a + b

add(3, 5)
# CALL  add(3, 5)
# RETURN add → 8
```

> The logger decorator uses `repr()` to format arguments so that strings appear with their quotes, making the log output unambiguous and safe to read.

---

<!-- slide: 8 | title: Stacking Decorators -->

## Slide 8: Stacking Decorators

Python allows multiple decorators to be applied to a single function. They are listed one per line above the function definition and are applied in **bottom-up order** — the decorator closest to the function definition is applied first, and each successive decorator wraps the result of the one below it.

```python
# Applying two decorators
@timer
@logger
def multiply(a, b):
    """Return the product of a and b."""
    return a * b

# Python evaluates this as:
# multiply = timer(logger(multiply))
#
# Call chain when multiply(4, 5) is invoked:
#   timer's wrapper is entered first
#     logger's wrapper is entered next
#       original multiply(4, 5) runs → 20
#     logger prints "RETURN multiply → 20"
#   timer prints "[timer] multiply took 0.000012 seconds"

multiply(4, 5)
# CALL  multiply(4, 5)
# RETURN multiply → 20
# [timer] multiply took 0.000012 seconds
```

**Key rule:** The decorator written *closest to the function* runs its inner logic *first*. The outermost decorator's wrapper is the first code executed when the decorated function is called from outside.

**Order matters:** `@timer @logger def f()` produces different output ordering from `@logger @timer def f()`. Choose the order deliberately based on which concern should be the outermost layer.

---

## Summary

| Concept | Key Point |
|---|---|
| Decorator definition | Higher-order function: takes a function, returns a wrapper |
| `@` syntax | Shorthand for `func = decorator(func)` |
| `*args, **kwargs` | Makes wrapper universally applicable to any function signature |
| `functools.wraps` | Preserves `__name__`, `__doc__`, and other metadata |
| Stacking | Applied bottom-up; outermost decorator wraps last but runs first |
| Use cases | Timing, logging, caching, validation, access control, retrying |

> **Next:** Section 8.8 — Decorators with Arguments (decorator factories that accept configuration parameters)
