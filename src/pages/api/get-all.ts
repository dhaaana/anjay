// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';

type Data = {
  name: string;
};

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const links = await prisma.links.findMany();
  return res.status(200).json(links);
}
