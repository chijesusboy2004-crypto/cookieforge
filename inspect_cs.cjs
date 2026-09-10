async function check() {
  const res = await fetch('https://cookiescan.io');
  const html = await res.text();
  console.log(html);
}
check();
