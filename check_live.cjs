const http = require('http');

async function checkConsole() {
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
      console.log('Connecting to dev server target:', page.webSocketDebuggerUrl);
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
        ws.send(JSON.stringify({ id: 3, method: 'Page.navigate', params: { url: 'http://localhost:3000/' } }));
      };
      ws.onmessage = (msg) => {
        const m = JSON.parse(msg.data);
        if (m.method === 'Runtime.exceptionThrown') {
          console.log('\n--- BROWSER EXCEPTION DETECTED ---');
          console.log(m.params.exceptionDetails.text);
          console.log(m.params.exceptionDetails.exception?.description);
        } else if (m.method === 'Runtime.consoleAPICalled') {
          console.log('[BROWSER CONSOLE]', m.params.args.map(a => a.value || a.description).join(' '));
        } else if (m.id === 10) {
          console.log('\n--- ROOT INNER HTML LENGTH ---:', m.result?.result?.value?.length || 0);
          if (m.result?.result?.value) {
            console.log('SNIPPET:', m.result.result.value.substring(0, 300));
          }
          edge.kill();
          process.exit(0);
        }
      };
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: 'Runtime.evaluate',
          params: { expression: 'document.getElementById("root").innerHTML' }
        }));
      }, 4000);
    });
  });
  req.on('error', e => {
    console.error('Req error:', e);
    edge.kill();
    process.exit(1);
  });
  req.end();
}

checkConsole();