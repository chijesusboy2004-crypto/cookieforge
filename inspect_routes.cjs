async function checkRoutes() {
  const res = await fetch('https://cookiescan.io/assets/index-Bn7F3SJQ.js');
  const js = await res.text();
  
  // Find all path: ...
  const matches = js.match(/path:\s*"[^"]+"/g) || [];
  console.log('Routes found in CookieScan bundle:');
  console.log([...new Set(matches)]);
}
checkRoutes();
