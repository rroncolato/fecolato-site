const https = require('https');

const TOKEN = process.env.NOTION_TOKEN;
const DB_ID = process.env.NOTION_DB_ID;

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const body = JSON.stringify({
    filter: { property: 'Ativo', checkbox: { equals: true } },
    sorts:  [{ property: 'Ordem', direction: 'ascending' }],
  });

  const options = {
    hostname: 'api.notion.com',
    path:     `/v1/databases/${DB_ID}/query`,
    method:   'POST',
    headers:  {
      'Authorization':  'Bearer ' + TOKEN,
      'Notion-Version': '2022-06-28',
      'Content-Type':   'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const proxy = https.request(options, (nr) => {
    res.status(nr.statusCode);
    nr.pipe(res);
  });

  proxy.on('error', (e) => {
    res.status(500).json({ error: e.message });
  });

  proxy.write(body);
  proxy.end();
};
