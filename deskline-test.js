const https = require('https');
const tests = ['query','q','keyword','search','searchTerm','title','name','term','text'];
function test(name) {
  const url = new URL('https://webapi.deskline.net/kaerntenevents/de/events');
  url.searchParams.set('filterId', '');
  url.searchParams.set('pageNo', '0');
  url.searchParams.set('pageSize', '1');
  url.searchParams.set('fields', 'id,name');
  url.searchParams.set(name, 'musik');
  const options = {
    headers: {
      'DW-Source': 'desklineweb',
      'DW-SessionId': 'test-session',
      'User-Agent': 'NodeTest',
    },
  };
  https.get(url, options, (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      console.log(`${name} => ${res.statusCode} ${body.includes('data') ? 'ok' : 'no-data'}`);
    });
  }).on('error', (err) => {
    console.error(`${name} error`, err);
  });
}
for (const name of tests) test(name);
