import datetime

def now(): return datetime.datetime.today()

def elapsed(t): return (now() - t).total_seconds()

start = now()
charmap = {}

for b in data:
    key = ord(b)
    if key in charmap:
        charmap[key] += 1
    else:
        charmap[key] = 1

print(charmap)
duration = elapsed(start)

print("run lasted: %d seconds" % duration)