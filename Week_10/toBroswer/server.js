const http = require('http');

http.createServer((request, response) => {
  let body = [];
  request.on('error', err => {
    console.log(err);
  }).on('data', chunk => {
    body.push(chunk);
  }).on('end', () => {
    console.log(body);
    body = Buffer.concat(body).toString();
    console.log(body);
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(
`<html lang="en">
  <head></head>
  <style>
    #box {
      width: 500px;
      height: 300px;
      background-color: rgb(255, 255, 255);
      display: flex;
    }
    #myid {
      background-color: rgb(255, 0, 0);
      width: 200px;
      height: 100px;
    }
    .c1 {
      background-color: rgb(0, 255, 0);
      flex: 1;
    }
  </style>
  <body>
    <div id="box">
      <div id="myid"></div>
      <div class="c1"></div>
    </div>
  </body>
</html>
`);
  })
}).listen(8088);
console.log('server started')