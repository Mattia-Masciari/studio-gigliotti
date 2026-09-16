import subprocess, sys, time

cwd = "/Users/mattiamasciari/Documents/🤖 APP & AI/STUDIO GIGLIOTTI/frontend"
p = subprocess.Popen(
    ["npx", "next", "dev", "--webpack", "-p", "3000"],
    cwd=cwd
)
print(f"Dev server started on port 3000 with PID {p.pid}")
time.sleep(3)
