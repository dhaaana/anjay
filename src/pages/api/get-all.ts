// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';

type Data = {
  name: string;
};

export default async function getAll(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const links = await prisma.links.findMany()
  res.status(200).json(links);
}
