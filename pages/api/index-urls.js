// /pages/api/index-urls.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { urls } = req.body;
  const apiKey = process.env.BING_API_KEY;

  if (!Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid URL list' });
  }

  const endpoint = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        siteUrl: 'https://www.expensegoose.com', // change to your domain
        urlList: urls,
      }),
    });

    const result = await response.json();

    // Build custom result for UI
    const results = urls.map(url => ({
      url,
      status: result?.ErrorCode === 0 ? 'Submitted' : result?.Message || 'Failed',
    }));

    return res.status(200).json({ success: true, results });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
