const http = require('http');

async function getError() {
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
    path: '/json/new?http://localhost:4173/',
    method: 'PUT'
  }, (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
      const page = JSON.parse(data);
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
        ws.send(JSON.stringify({ id: 3, method: 'Page.navigate', params: { url: 'http://localhost:4173/' } }));
      };
      ws.onmessage = (msg) => {
        const m = JSON.parse(msg.data);
        if (m.method === 'Runtime.exceptionThrown') {
          console.log('\n--- UNCAUGHT EXCEPTION ---');
          console.log(m.params.exceptionDetails.text);
          console.log(m.params.exceptionDetails.exception?.description);
        } else if (m.id === 4) {
          console.log('\n--- ROOT HTML VALUE ---');
          console.log(m.result?.result?.value);
          edge.kill();
          process.exit(0);
        }
      };
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 4,
          method: 'Runtime.evaluate',
          params: { expression: 'document.getElementById("root") ? document.getElementById("root").innerHTML : "NO ROOT"' }
        }));
      }, 3000);
    });
  });
  req.on('error', e => {
    console.error('Req error:', e);
    edge.kill();
    process.exit(1);
  });
  req.end();
}

getError();