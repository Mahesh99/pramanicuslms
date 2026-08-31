> 🎯 **Learning Objectives**
> By the end of this module you will understand how C programs interact with files — file names, streams, text vs binary files, opening and closing files with `fopen`/`fclose`, formatted I/O with `fscanf`/`fprintf`, character I/O with `getc`/`putc`, and block I/O with `fread`/`fwrite`, plus file positioning with `rewind`, `ftell`, and `fseek`.

> 💡 **Session Info**
> **Unit 6** · **Level:** Intermediate · **Course:** Pramanicus Academy — C Programming

📁
Section 6.1
## What is a File?

A **file** is an external collection of related data treated as a unit. Its primary purpose is to keep a **record** of data.

- **Field** — a group of characters that convey meaning (e.g. a roll number, a name)
- **Record** — a group of related fields (e.g. one student's details)
- **File** — a collection of records stored as a unit

Files live on **secondary storage** (hard disk, SSD, CD/DVD, tape). Each file ends with an **end-of-file (EOF)** marker at a specified byte position, recorded in the file structure.

A file must be **opened** before it can be read or written. When opened, the system creates a buffer object and associates a **stream** with it.

🏷️
Section 6.2
## File Names

A file name is a string of characters that make up a valid filename according to the operating system's rules.

Most file names have two parts:

| Part | Example |
|------|---------|
| Primary name | `input`, `program` |
| Extension (optional) | `.txt`, `.c`, `.dat` |

Examples: `input.txt`, `program.c`, `results.dat`

When reading or writing files in C, always follow the OS naming rules for your platform.

📋
Section 6.3
## The FILE Structure

A program that reads or writes files needs to track:

- The file name
- The current position in the file (file marker)
- Buffer and status information

C provides a predefined structure for this. The `stdio.h` header defines it — its type name is **`FILE`**.

When you need a file in your program, declare a pointer to it:

```c
FILE *fp;
```

The actual contents of `FILE` are hidden; you only store the pointer returned by `fopen` and pass it to I/O functions.

🌊
Section 6.4
## Streams

A **stream** is a source or destination for data. It is associated with a physical device (keyboard, monitor) or a file on disk.

C has two forms of streams:

| Stream type | Description |
|-------------|-------------|
| **Text stream** | Sequence of characters divided into lines, each line terminated by `\n` |
| **Binary stream** | Sequence of data values (integers, floats, etc.) using their memory representation |

Keyboards and monitors work only with **text streams**. A keyboard is a source; a monitor is a destination.

### System-created streams

C provides three standard streams — no need to open or close them:

| Stream | Points to | Default device |
|--------|-----------|----------------|
| `stdin` | Standard input | Keyboard |
| `stdout` | Standard output | Monitor |
| `stderr` | Standard error | Monitor |

These are opened automatically by the operating system when your program starts.

🔄
Section 6.5
## Stream File Processing — Four Steps

A **file** exists independently on disk with a name known to the OS. A **stream** is an entity created by your program. You associate the stream with the file name.

Every file operation follows four steps:

1. **Create a stream** — declare `FILE *fp;`
2. **Open the file** — associate the stream with a physical file (`fopen`)
3. **Process the file** — read or write data
4. **Close the file** — release resources (`fclose`)

```c
FILE *fp;
fp = fopen("data.txt", "r");   /* open */
/* ... read or write ... */
fclose(fp);                    /* close */
```

After closing, the stream pointer can be reused for another file.

📚
Section 6.6
## Standard Library I/O Functions

The `stdio.h` header declares the standard input/output functions. They fall into several categories:

| Category | Functions |
|----------|-----------|
| File open/close | `fopen`, `fclose` |
| Formatted I/O | `scanf`, `printf`, `fscanf`, `fprintf` |
| Character I/O | `getchar`, `putchar`, `getc`, `putc`, `fgetc`, `fputc` |
| String I/O | `gets`, `puts`, `fgets`, `fputs` |
| Block I/O | `fread`, `fwrite` |
| File positioning | `rewind`, `ftell`, `fseek` |

🔓
Section 6.7
## Opening and Closing Files

### fopen — open a file

`fopen` connects the physical file to your program's stream and creates the internal `FILE` structure.

```c
FILE *fp = fopen("filename", "mode");
```

It returns a pointer to the `FILE` structure, or **`NULL`** on failure. Always check for `NULL` before using the pointer.

```c
FILE *fp = fopen("mydata.txt", "r");
if (fp == NULL) {
    printf("Error opening file\n");
    return 1;
}
```

### File modes (text)

| Mode | Meaning |
|------|---------|
| `"r"` | Read — file must exist; marker at start |
| `"w"` | Write — creates file or **erases** existing contents |
| `"a"` | Append — write starts after last character |
| `"r+"` | Read and write — file must exist |
| `"w+"` | Read and write — creates or erases existing file |
| `"a+"` | Read and append — read anywhere, write at end |

```c
FILE *fRead  = fopen("mydata.txt", "r");
FILE *fWrite = fopen("results.txt", "w");
FILE *fAppend = fopen("log.txt", "a");
```

Once open, files stay open until you close them or the program ends.

### fclose — close a file

Closing a file flushes buffers and breaks the link between stream and file.

```c
int status = fclose(fp);   /* returns 0 on success, -1 on error */
```

Close files when done, and also when you need to reopen the same file in a different mode.

📝
Section 6.8
## Formatted I/O — fscanf and fprintf

`scanf` and `printf` work with the keyboard and monitor. **`fscanf`** and **`fprintf`** work with any text stream — including files and the standard streams.

### Reading with fscanf

```c
fscanf(stream_pointer, "format string", &var1, &var2, ...);
```

```c
int a, b;
FILE *fptr = fopen("mydata.txt", "r");
fscanf(fptr, "%d %d", &a, &b);
fclose(fptr);
```

The only difference from `scanf`: the first argument is the stream pointer instead of reading from `stdin` implicitly.

Reading from keyboard using `fscanf`:

```c
fscanf(stdin, "%d", &a);
```

**End of file (EOF):** When `fscanf` reaches the end of the file, it returns `EOF`. A common loop pattern:

```c
while (fscanf(fp, "%d", &num) == 1) {
    /* process num */
}
```

### Writing with fprintf

```c
fprintf(stream_pointer, "format string", var1, var2, ...);
```

```c
int a = 5, b = 20;
FILE *fptr = fopen("results.txt", "w");
fprintf(fptr, "%d %d\n", a, b);
fclose(fptr);
```

`fprintf` works like `printf` but writes to the specified stream. You can also write to `stdout` or `stderr`:

```c
fprintf(stdout, "%d\n", 45);   /* displays 45 on monitor */
```

### Example — copy integers from one file to another

```c
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    FILE *spIn, *spOut;
    int numIn;

    spIn  = fopen("input.txt", "r");
    spOut = fopen("output.txt", "w");

    if (spIn == NULL || spOut == NULL) {
        printf("Error opening file\n");
        return 1;
    }

    while (fscanf(spIn, "%d", &numIn) == 1)
        fprintf(spOut, "%d\n", numIn);

    fclose(spIn);
    fclose(spOut);
    return 0;
}
```

🔤
Section 6.9
## Character I/O Functions

Character I/O reads or writes **one character at a time** from a text stream.

### Terminal-only functions

| Function | Purpose | Syntax |
|----------|---------|--------|
| `getchar` | Read from `stdin` | `int getchar(void);` |
| `putchar` | Write to `stdout` | `int putchar(int ch);` |

Both return the character as an `int`, or `EOF` on failure/end-of-file.

### Terminal and file functions

These work with any stream — `stdin`, `stdout`, `stderr`, or a user-opened file:

| Function | Purpose | Syntax |
|----------|---------|--------|
| `getc` / `fgetc` | Read one character | `int getc(FILE *fp);` |
| `putc` / `fputc` | Write one character | `int putc(int ch, FILE *fp);` |

`getc` and `fgetc` are equivalent; `putc` and `fputc` are equivalent.

### Example — append one file to another character by character

```c
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int ch;
    FILE *fp1, *fp2;

    fp1 = fopen("file1.c", "r");
    fp2 = fopen("file2.c", "a");

    if (fp1 == NULL) {
        printf("\nFile1 does not exist");
        return 1;
    }

    while ((ch = getc(fp1)) != EOF)
        putc(ch, fp2);

    fclose(fp1);
    fclose(fp2);
    return 0;
}
```

> 💡 **Tip**
> Always assign the result of `getc` to an `int`, not `char`, so you can distinguish a valid byte `0xFF` from the `EOF` value (typically -1).

📊
Section 6.10
## Text Files vs Binary Files

### Text file

- Data stored as **characters**; numbers are converted to character sequences before storage
- Organized into **lines** terminated by `\n`
- **Human-readable** — openable in any text editor
- Read/written with formatted and character I/O: `scanf`/`printf`, `fscanf`/`fprintf`, `getchar`/`putchar`, `fgets`/`fputs`

### Binary file

- Data stored in the **internal memory format** of the computer
- **Not human-readable** — no lines or newline characters
- Read/written with **block I/O**: `fread` and `fwrite`
- No format conversion — bytes transfer exactly as they appear in memory

| Text file | Binary file |
|-----------|-------------|
| Lines of characters, `\n`-terminated | Raw bytes in memory layout |
| Human readable | Not human readable |
| EOF marker at end | EOF marker at end |
| Readable in any text editor | Readable only by programs designed for it |

### Opening binary files

The workflow is the same as text files; only the **mode string** changes:

| Mode | Meaning |
|------|---------|
| `"rb"` | Read binary |
| `"wb"` | Write binary (creates or erases) |
| `"ab"` | Append binary |
| `"r+b"` | Read and write existing binary file |
| `"w+b"` | Read and write — creates or erases |
| `"a+b"` | Read and append binary |

```c
FILE *fp = fopen("data.dat", "wb");
```

Binary files must still be closed with `fclose`.

🧱
Section 6.11
## Block I/O — fread and fwrite

Block I/O transfers data between memory and a binary file **without format conversion**.

### fread — read a block

```c
size_t fread(void *ptr, size_t size, size_t count, FILE *stream);
```

| Parameter | Meaning |
|-----------|---------|
| `ptr` | Address of memory buffer to store data |
| `size` | Size of each element (use `sizeof`) |
| `count` | Number of elements to read |
| `stream` | File pointer |

Returns the number of items successfully read. Returns **0** on EOF or error.

```c
int arr[3];
fread(arr, sizeof(int), 3, fp);   /* read 3 integers into arr */
```

### fwrite — write a block

```c
size_t fwrite(void *ptr, size_t size, size_t count, FILE *stream);
```

Parameters match `fread`. Returns the number of items written.

```c
int arr[3] = {10, 20, 30};
fwrite(arr, sizeof(int), 3, fp);  /* write 3 integers to file */
```

### Example — reverse the first n characters of a file

```c
#include <stdio.h>
#include <string.h>

int main(void)
{
    FILE *fp;
    char str[100], rev[100];
    int n, i, j;

    printf("\nEnter the number of characters to reverse: ");
    scanf("%d", &n);

    fp = fopen("file3.c", "r+b");
    if (fp == NULL) return 1;

    fread(str, sizeof(char), n, fp);

    for (i = 0, j = n - 1; i < n; i++, j--)
        rev[i] = str[j];
    rev[n] = '\0';

    rewind(fp);
    fwrite(rev, sizeof(char), n, fp);

    fclose(fp);
    return 0;
}
```

📍
Section 6.12
## File Positioning Functions

The **file marker** (file position indicator) tracks your current position in the file.

### rewind — go to the beginning

```c
void rewind(FILE *stream);
```

Sets the file marker to the start. Useful for reading a file more than once without closing and reopening.

### ftell — current position

```c
long int ftell(FILE *stream);
```

Returns the number of bytes from the beginning of the file. Returns **-1** on error.

### fseek — move to a specific position

```c
int fseek(FILE *stream, long offset, int origin);
```

| `origin` | Meaning |
|----------|---------|
| `0` (`SEEK_SET`) | Beginning of file |
| `1` (`SEEK_CUR`) | Current position |
| `2` (`SEEK_END`) | End of file |

`offset` is added to the position given by `origin`. Positive = forward; negative = backward. Returns **0** on success, **-1** on error.

| Statement | Effect |
|-----------|--------|
| `fseek(fp, 0L, 0);` | Go to beginning |
| `fseek(fp, 0L, 1);` | Stay at current position |
| `fseek(fp, 0L, 2);` | Go to end of file |
| `fseek(fp, m, 0);` | Move to byte `(m+1)` from start |
| `fseek(fp, m, 1);` | Go forward `m` bytes |
| `fseek(fp, -m, 1);` | Go backward `m` bytes |
| `fseek(fp, -m, 2);` | Go backward `m` bytes from end |

### Example — file positioning demo

```c
#include <stdio.h>

int main(void)
{
    FILE *fp;
    char arr[30];
    long n;

    fp = fopen("input.txt", "r");
    if (fp == NULL) return 1;

    n = ftell(fp);
    printf("\nCurrent position = %ld", n);

    fseek(fp, -5, 2);          /* 5 bytes back from end */
    n = ftell(fp);
    printf("\nAfter fseek(-5, END) = %ld", n);

    printf("\nCharacters read: ");
    for (int i = 0; i < 5; i++) {
        arr[i] = fgetc(fp);
        printf("%c", arr[i]);
    }

    rewind(fp);                /* back to start */
    n = ftell(fp);
    printf("\nAfter rewind = %ld", n);

    fseek(fp, 5, 1);           /* skip 5 bytes forward */
    printf("\nNext 5 characters: ");
    for (int i = 0; i < 5; i++) {
        arr[i] = fgetc(fp);
        printf("%c", arr[i]);
    }

    fclose(fp);
    return 0;
}
```

✏️
Practice
## Practice Exercises

1. Write a program that opens `scores.txt` for reading, reads integers until EOF, and prints their sum.
2. Write a program that prompts the user for their name and age, then appends that information as a new line to `students.txt` using `"a"` mode.
3. Explain the difference between `"w"` and `"a"` mode. What happens to existing file contents in each case?
4. Write a program that copies `source.txt` to `dest.txt` one character at a time using `getc` and `putc`.
5. Create a binary file `numbers.dat`, write five integers using `fwrite`, then read them back with `fread` and display them.
6. Use `fseek` and `ftell` to print the size of a text file in bytes.

> ⚠️ **Remember**
> Always check `fopen` for `NULL`, close every file you open, and use `"rb"`/`"wb"` modes when working with binary data.
