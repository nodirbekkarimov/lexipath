const http = require('http');

const targetPort = 3000;
const proxyPort = 3001;

const server = http.createServer((req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `localhost:${targetPort}` },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Next.js server on 3000 starting up...');
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(proxyPort, () => {
  console.log(`Port 3001 proxy forwarding to http://localhost:${targetPort}`);
});
