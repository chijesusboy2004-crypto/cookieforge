const http = require('http');

async function checkConsole() {
  const edge = require('child_process').spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get('http://127.0.0.1:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const tabs = JSON.parse(data);
      const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('3000'));
      if (pageTab) {
        console.log('Connecting to page:', pageTab.webSocketDebuggerUrl);
        const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
        ws.onopen = () => {
          ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
          ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
          ws.send(JSON.stringify({ id: 3, method: 'Page.reload' }));
        };
        ws.onmessage = (msg) => {
          const m = JSON.parse(msg.data);
          if (m.method === 'Runtime.consoleAPICalled' || m.method === 'Runtime.exceptionThrown') {
            console.log('BROWSER LOG/ERROR:\n', JSON.stringify(m, null, 2));
          }
        };
        setTimeout(() => {
          edge.kill();
          process.exit(0);
        }, 4000);
      } else {
        console.log('No page tab found');
        edge.kill();
        process.exit(0);
      }
    });
  });
}

checkConsole();