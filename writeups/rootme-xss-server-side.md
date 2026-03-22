# XSS - Server Side (Local File Read via PDF Generator)

**Date:** March 20, 2026  
**Platform:** Root-Me  
**Difficulty:** Medium  
**Category:** Web / Server-Side Injection  

## 📝 Executive Summary
In this challenge, I bypassed a sanitized client-side input field by identifying an overlooked injection point in the user registration form. This led to a Server-Side XSS vulnerability within a certificate generator (`wkhtmltopdf`), which I escalated to a Local File Read (LFI) to exfiltrate the flag from the server's filesystem.

## 🔍 Initial Analysis
The application allows users to generate a certificate based on a message input. While the primary message box was heavily sanitized, the user's profile information (First Name) was not.

### Identifying the Injection Point
By registering a new account with the name `<b>test1</b>`, I observed the name rendered in bold on the generated certificate. This confirmed that HTML tags were being interpreted by the server during the PDF generation process.

### Context Discovery
To identify the rendering engine and environment, I injected the following payload:
`<script>document.write(window.location)</script>`

**Resulting Output:**
`file:///tmp/tmp_wkhtmlto_pdf_R703E4.html`

This revealed two critical pieces of intelligence:
1. The server uses **wkhtmltopdf** to render HTML into a PDF.
2. The rendering happens in a **local file context (`file://`)**, meaning the engine has access to the server's local filesystem.

## 🚀 Exploitation

### Local File Inclusion (LFI)
Since the JavaScript is executing in a local context, I used an `<iframe>` to pull a local file into the rendered document.

**Final Payload:**
```html
<script>
document.write('<iframe src="file:///flag.txt"></iframe>')
</script>
```

**Execution Flow:**
1. I updated my profile name to the payload above.
2. I triggered the certificate generation.
3. The server-side engine rendered the HTML, executed the script, and embedded the contents of `/flag.txt` inside an iframe.
4. The resulting PDF contained the flag.

## 🛠️ Mitigation & Lessons Learned
1. **Global Input Sanitization:** Apply consistent encoding across all user-controlled data (First Name, Last Name, etc.).
2. **Disable JavaScript in PDF Generators:** Use the `--disable-javascript` flag in wkhtmltopdf.
3. **Restrict File Access:** Run the rendering process in a sandboxed environment with no access to system files.
