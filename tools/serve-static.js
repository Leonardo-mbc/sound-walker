const os = require('os');
const serveStatic = require('serve-static');
const connect = require('connect');
const http = require('http');

const port = 3000;
const host = '0.0.0.0';
const dir = './public';

const serve = serveStatic(dir);
const app = connect();
app.use(serve);
http.createServer(app).listen(port, host, () => {
  console.log('serving http://localhost:' + port);
  const nets = os.networkInterfaces();
  Object.keys(nets).forEach((name) => {
    (nets[name] || []).forEach((net) => {
      const isIPv4 = net.family === 'IPv4' || net.family === 4;
      if (isIPv4 && !net.internal) {
        console.log('serving http://' + net.address + ':' + port);
      }
    });
  });
});
