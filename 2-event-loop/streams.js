const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  //soln-1
  //   fs.readFile("test-file.txt", (err, data) => {
  //     if (err) console.log(err);
  //     res.end(data);
  //   });
  //soln-2: streams
  //   const readable = fs.createReadStream("test-file.txt");
  //   readable.on("data", chunk => {
  //     res.write(chunk);
  //   });
  //   readable.on("end", () => {
  //     res.end();
  //   });
  //   readable.on("error", (err) => {
  //     console.log(err);
  //     res.statusCode(500);
  //     res.end("File not found");
  //   });
  //solution - 3. we read data more faster than we can send in the response so to match the speed we use this(pipe method)
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
  //readableSource.pipe(writeableDest)
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for the requests!!!");
});
