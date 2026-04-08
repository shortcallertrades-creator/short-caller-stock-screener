#!/usr/bin/env node
console.log("TEST: Script starting...");
setTimeout(() => {
  console.log("TEST: Script ending...");
  process.exit(0);
}, 1000);
