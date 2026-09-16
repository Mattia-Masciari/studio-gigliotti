import os
import subprocess
import time

log_path = '/Users/mattiamasciari/Documents/🤖 APP & AI/STUDIO GIGLIOTTI/frontend/server.log'
cwd = '/Users/mattiamasciari/Documents/🤖 APP & AI/STUDIO GIGLIOTTI/frontend'

with open(log_path, 'w', buffering=1) as f:
    env = dict(os.environ)
    env["NEXT_TELEMETRY_DISABLED"] = "1"
    p = subprocess.Popen(
        ['/usr/local/bin/node', 'node_modules/next/dist/bin/next', 'dev', '-p', '3005'],
        cwd=cwd,
        stdout=f,
        stderr=f,
        env=env
    )
    # Keep process running
    while p.poll() is None:
        time.sleep(1)
