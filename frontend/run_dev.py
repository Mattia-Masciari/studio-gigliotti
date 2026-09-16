import subprocess
import os

cwd = "/Users/mattiamasciari/Documents/🤖 APP & AI/STUDIO GIGLIOTTI/frontend"
log_file = open(os.path.join(cwd, "debug.log"), "w")

env = dict(os.environ)

p = subprocess.Popen(
    ["/usr/local/bin/node", "node_modules/next/dist/bin/next", "dev", "-p", "3005"],
    cwd=cwd,
    stdout=log_file,
    stderr=log_file,
    env=env
)
print("Started PID", p.pid)
