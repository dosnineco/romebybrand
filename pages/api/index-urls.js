// pages/api/index-urls.js
import { google } from 'googleapis';
import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { urls } = req.body;

    const keyPath = path.join(process.cwd(), 'indexing-service-account.json');
    const keyFile = await fs.readFile(keyPath, 'utf8');
    const key = JSON.parse(keyFile);

    const auth = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/indexing']
    );

    const indexing = google.indexing({ version: 'v3', auth });

    const results = [];

    for (const url of urls) {
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        },
      });
      results.push({ url, status: 'Submitted' });
    }

    res.status(200).json({ message: 'All URLs submitted!', results });
  } catch (error) {
    console.error('Indexing error:', error);
    res.status(500).json({ message: 'Error submitting URLs', error: error.message });
  }
}
