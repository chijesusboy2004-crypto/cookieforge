const http = require('http');

async function checkNetwork() {
  const edge = require('child_process').spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9333',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const req = http.request({
    hostname: '127.0.0.1',
    port: 9333,
    path: '/json/new?http://localhost:3000/',
    method: 'PUT'
  }, (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
      const page = JSON.parse(data);
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Network.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
        ws.send(JSON.stringify({ id: 3, method: 'Page.navigate', params: { url: 'http://localhost:3000/' } }));
      };
      ws.onmessage = (msg) => {
        const m = JSON.parse(msg.data);
        if (m.method === 'Network.responseReceived') {
          console.log(`[HTTP ${m.params.response.status}] ${m.params.response.url}`);
        } else if (m.method === 'Network.loadingFailed') {
          console.log(`[FAILED] ${m.params.errorText}`);
        } else if (m.method === 'Runtime.exceptionThrown') {
          console.log('[EXCEPTION]', m.params.exceptionDetails.text, m.params.exceptionDetails.exception?.description);
        }
      };
      setTimeout(() => {
        edge.kill();
        process.exit(0);
      }, 5000);
    });
  });
  req.end();
}

checkNetwork();