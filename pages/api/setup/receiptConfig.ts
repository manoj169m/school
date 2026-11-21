// pages/api/admin/checkReceiptConfig.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const config = await prisma.receiptConfig.findFirst({
      where: {
        isActive: true,
        accountId: null
      }
    });

    return res.status(200).json({
      success: true,
      exists: !!config,
      config: config
    });

  } catch (error) {
    console.error('Error checking receipt configuration:', error);
    return res.status(500).json({
      error: 'Failed to check receipt configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}