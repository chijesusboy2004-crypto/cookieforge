(() => {
  const fileContent = require('node:fs').readFileSync('dist/assets/index-C01dSuQA.js', 'utf8');

  global.window = global;
  global.document = {
    getElementById: (id) => ({ innerHTML: '', appendChild: () => {}, clientWidth: 1000 }),
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: () => ({ style: {}, setAttribute: () => {} }),
    head: { appendChild: () => {} },
    body: { appendChild: () => {} }
  };
  global.navigator = { userAgent: 'Node' };
  global.process = { env: {} };
  global.Buffer = require('buffer').Buffer;
  global.performance = { now: () => Date.now() };

  try {
    (new Function(fileContent))();
    console.log('BUNDLE EVAL SUCCESSFUL!');
  } catch (err) {
    console.error('BUNDLE EVAL ERROR:\n', err);
  }
})();