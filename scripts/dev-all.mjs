import { spawn } from "node:child_process";
import process from "node:process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const children = [
  spawn(npm, ["run", "dev"], { stdio: "inherit", cwd: process.cwd(), shell: false }),
  spawn(npm, ["run", "dev"], { stdio: "inherit", cwd: `${process.cwd()}/backend`, shell: false }),
];
const stop = () => children.forEach(c => c.kill("SIGTERM"));
process.on("SIGINT", stop); process.on("SIGTERM", stop);
children.forEach(c => c.on("exit", code => { if (code && code !== 0) process.exitCode = code; }));
