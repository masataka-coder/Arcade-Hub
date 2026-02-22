import sys

try:
    with open(r'c:\Users\kohata\Desktop\MyGames\games\tank\script.js', 'r', encoding='utf-8') as f:
        content = f.read()
        
    backticks = content.count('`')
    print(f"Total backticks: {backticks}")
    if backticks % 2 != 0:
        print("ALERT: Unbalanced backticks found!")
        # Find the line number of potential issues
        lines = content.split('\n')
        count = 0
        for i, line in enumerate(lines):
            line_count = line.count('`')
            count += line_count
            if line_count > 0:
                print(f"Line {i+1}: {line_count} backticks (Running total: {count})")
    else:
        print("Backticks are balanced.")
        
except Exception as e:
    print(f"Error: {e}")
