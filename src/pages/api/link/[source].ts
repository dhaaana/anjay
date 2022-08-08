import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';

export default async function getAll(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const source = req.url?.split('/')[3];
  const destination = await prisma.links.findFirst({
    where: {
      source: source,
    },
    select: {
      destination: true,
    },
  });
  if (destination) {
    return res.status(200).json(destination);
  }
  return res.status(404).send({ destination: 'back home' });
}
