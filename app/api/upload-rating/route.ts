// pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const filePath = path.join(process.cwd(), 'uploads', req.headers['file-name'] as string);
    const writeStream = fs.createWriteStream(filePath);

    req.pipe(writeStream);

    req.on('end', () => {
      res.status(200).json({ message: 'File uploaded successfully' });
    });

    req.on('error', (err) => {
      console.error(err);
      res.status(500).json({ error: 'File upload failed' });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
