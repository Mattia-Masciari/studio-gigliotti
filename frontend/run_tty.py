import os
import pty
import select
import subprocess

master, slave = pty.openpty()
env = dict(os.environ)
env["NEXT_TELEMETRY_DISABLED"] = "1"
env["CI"] = "1"

proc = subprocess.Popen(
    ["/usr/local/bin/node", "node_modules/next/dist/bin/next", "dev", "-p", "3005"],
    cwd="/Users/mattiamasciari/Documents/🤖 APP & AI/STUDIO GIGLIOTTI/frontend",
    stdin=slave,
    stdout=slave,
    stderr=slave,
    env=env,
    close_fds=True
)
os.close(slave)

log = open("/Users/mattiamasciari/Documents/🤖 APP & AI/STUDIO GIGLIOTTI/frontend/next_tty.log", "wb")

try:
    while proc.poll() is None:
        r, _, _ = select.select([master], [], [], 0.5)
        if master in r:
            data = os.read(master, 1024)
            if not data:
                break
            log.write(data)
            log.flush()
except Exception as e:
    log.write(str(e).encode())

log.close()
