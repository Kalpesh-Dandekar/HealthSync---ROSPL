#!/usr/bin/env python3
import json, sys
try:
    import clingo
except ImportError:
    print(json.dumps({"ok": False, "error": "Clingo is not installed"}))
    raise SystemExit(2)
payload=json.load(sys.stdin)
with open(__file__.replace("solve.py","appointment.lp"), encoding="utf-8") as f:
    program=f.read()+"\n"+payload.get("facts","")
ctl=clingo.Control(["--opt-mode=opt"])
ctl.add("base",[],program)
ctl.ground([("base",[])])
model=None
with ctl.solve(yield_=True) as h:
    for m in h:
        model=m
atoms=[] if model is None else [str(a) for a in model.symbols(shown=True)]
print(json.dumps({"ok": bool(model),"atoms":atoms}))
