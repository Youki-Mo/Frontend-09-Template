const net = require('net');

class Request {
  constructor(options) {
    this.method = options.method || 'GET';
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || '/';
    this.headers = options.headers || {};
    this.body = options.body || {};

    !this.headers['Content-Type'] && (this.headers['Content-Type'] = 'application/x-www-form-urlencoded');

    this.headers['Content-Type'] === 'application/json' && (
      this.bodyText = JSON.stringify(this.body)
    );

    this.headers['Content-Type'] === 'application/x-www-form-urlencoded' && (
      this.bodyText = Object.keys(this.body).map(key => `${key}=${this.body[key]}`).join('&')
    );

    this.headers['Content-Length'] = this.bodyText.length;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser;
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString());
        });
      }
      connection.on('data', data => {
        console.log(data.toString());
        resolve('ok');
        connection.end();
      })
      connection.on('error', err => {
        reject(err);
        connection.end();
      })
      resolve('ok');
    })
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\n\r\n${this.bodyText}`
  }
}

class ResponseParser {
  constructor() {
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';
    this.bodyParser = null;
  }
  receive(str) {
    for (let i=0; i<str.length; i++) {
      this.#statusLine(str.charAt(i));
    }
  }
  #statusLine(char) {
    if (char === '\r') {
      return this.#statusLineEnd;
    } else {
      this.statusLine += char;
      return this.#statusLine;
    }
  }
  #statusLineEnd(char) {
    if (char === '\n') {
      return this.#headerName;
    }
  }
  #headerName(char) {
    if (char === ':') {
      return this.#headerSpace;
    } else if (char === '\r') {
      if (this.headers['Transfer-Encoding'] === 'chunked') {
        this.bodyParser = new TrunkedBodyParser();
      }
      return this.#headerBlockEnd;
    } else {
      this.statusLine += char;
      return this.#headerName;
    }
  }
  #headerSpace(char) {
    if (char === ' ') {
      return this.#headerValue;
    }
  }
  #headerValue(char) {
    if (char === '\r') {
      this.headers[this.headerName] = this.headerValue;
      this.headerName = '';
      this.headerValue = '';
      return this.#headerLineEnd;
    } else {
      return this.#headerValue;
    }
  }
  #headerLineEnd(char) {
    if (char === '\n') {
      return this.#headerName;
    }
  }
  #headerBlockEnd(char) {
    if (char === '\n') {
      return this.#body;
    }
  }
  #body(char) {
    this.bodyParser.receiveChar(char);
  }
}

class TrunkedBodyParser {
  constructor() {
    this.length = 0;
    this.content = [];
    this.isFinished = false;
  }
  receiveChar(char) {
    if (char === '\r') {
      if (this.length === 0) {
        this.isFinished = true;
      }
      return this.#lengthLineEnd;
    } else {
      this.length *= 16;
      this.length += parseInt(char, 16);
    }
  }
  #lengthLineEnd(char) {
    if (char === '\n') {
      return this.#redingTrunk;
    }
  }
  #redingTrunk(char) {
    this.content.push(char);
    this.length--;
    if (this.length === 0) {
      return this.#newLine;
    }
  }
  #newLine(char) {
    if (char === '\r') {
      return this.#newLineEnd;
    }
  }
  #newLineEnd(char) {
    if (char === '\n') {
      return this.receiveChar;
    }
  }
}

void async function() {
  const request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8088',
    path: '/',
    headers: {
      ['X-Foo2']: 'customerd'
    },
    body: {
      name: 'bod'
    }
  });
  let response = await request.send();
  console.log('response:')
  console.log(response);
}()