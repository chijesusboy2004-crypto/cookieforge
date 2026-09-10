async function test() {
  const res = await fetch('https://cookiescan.io/address/2s3TVpCX5FxSJG3FyFXSStVwLwgVNkNukSpgECWUadV5');
  console.log('HTTP Status:', res.status);
}
test();
