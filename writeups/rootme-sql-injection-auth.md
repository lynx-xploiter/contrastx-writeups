# SQL Injection - Authentication Bypass

**Date:** March 20, 2026  
**Platform:** Root-Me  
**Difficulty:** Easy  
**Category:** Web / Server-Side  

## 📝 Executive Summary
This challenge focuses on a classic SQL Injection (SQLi) vulnerability within a web login form. By exploiting a lack of input sanitization in the authentication query, I was able to bypass the password requirement and gain unauthorized access to the `admin` account by manipulating the backend SQL logic.

## 🔍 Initial Analysis
The target application features a standard login interface. In a secure environment, the backend should use **Prepared Statements** to handle user input. However, initial testing suggests the application directly concatenates user-provided strings into the SQL query.

### Vulnerability Identification
The backend logic is hypothesized to follow this vulnerable pattern:
```sql
SELECT * FROM users 
WHERE username = '$username' 
AND password = '$password';
```
If the `$username` variable is not sanitized, an attacker can use special characters like the single quote (`'`) to "break out" of the data string and start writing their own SQL commands.

## 🚀 Exploitation

### 1. The OR-Based Bypass
To test for a general bypass, I used a tautology (a statement that is always true).

**Payload:**
`administrator' OR 1=1--`

**Resulting Query:**
```sql
SELECT * FROM users WHERE username = 'administrator' OR 1=1--' AND password = '';
```
**Technical Breakdown:**
* `OR 1=1`: This makes the entire `WHERE` clause true for every row in the database.
* `--`: This is a SQL comment. It tells the database to ignore everything after it, effectively deleting the `AND password = ...` check.
* **Outcome:** The database returns the first user in the table (usually `user1`), and the application logs me in as that user.

### 2. Targeting the Admin Account
To specifically target the administrative node, I refined the payload to ensure the `username` check matched the `admin` record while still commenting out the password requirement.

**Final Payload:**
`admin' AND 1=1--`

**Resulting Query:**
```sql
SELECT * FROM users WHERE username = 'admin' AND 1=1;
```
**Execution Flow:**
1. The database looks for a user where the name is exactly `admin`.
2. The `AND 1=1` remains true, confirming the logic.
3. The password check is bypassed via the `--` comment.
4. **Outcome:** Successful authentication as `admin`.

## 🏆 Capture
After bypassing the authentication gate, the application redirected to the administrative dashboard. The flag (password) was located directly within the page source of the protected area.

## 🛠️ Mitigation & Lessons Learned
1.  **Prepared Statements (Parameterized Queries):** This is the primary defense. By using placeholders (`?`), the database treats user input strictly as data, never as executable code.
2.  **Input Sanitization:** Implement a filter to strip or escape special SQL characters like `'`, `--`, and `;`.
3.  **Least Privilege:** Ensure the database user account running the web application has the minimum permissions necessary to function, limiting the impact of a successful injection.
