const fs = require("fs");
const crypto = require("crypto");
setTimeout(() => console.log("Timer 1 finished"), 0);
setImmediate(() => console.log("Immediate 1 finished"));
process.env.UV_THREADPOOL_SIZE = 2;

const start = Date.now();

fs.readFile("test-file.txt", () => {
  console.log("I/O finished");
  console.log("--------------");
  setTimeout(() => console.log("Timer 2 finished"), 0);
  setTimeout(() => console.log("Timer 3 finished"), 3000);
  setImmediate(() => console.log("Immediate 2 finished"));
  process.nextTick(() => console.log("next tick"));
  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password Encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password Encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password Encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password Encrypted");

//   crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
//     console.log(Date.now() - start, "Password Encrypted");
//   });
//   crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
//     console.log(Date.now() - start, "Password Encrypted");
//   });
//   crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
//     console.log(Date.now() - start, "Password Encrypted");
//   });
});

console.log("hello from the top level code");
