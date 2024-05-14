const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');

//////////////
//FILES

/*

// const textInput = fs.readFileSync("./txt/input.txt", "utf-8");

// const textOut = `This is what we know about avocado \n ${textInput} \n created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("Done!!!!");

//Non-blocking, asyncronous
fs.readFile("./txt/start.txt", (err, data1) => {
    if(err){
       return console.error("ERROR!!!!!")
    }
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log("Data: \n" + data2);
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      console.log("Data: " + data3);
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log("Your file has been written !!!");
      });
    });
  });
});
console.log("Reading filee!!!");

*/ //

/////////////////////////////////
//SERVER//

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const dataObject = JSON.parse(data);

const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview page
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObject.map((el) => replaceTemplate(tempCard, el)).join('');

    const finalOutput = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(finalOutput);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  } else if (pathname === '/product') {
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }

  //   res.end("Hello from the server! ");
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
