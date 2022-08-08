// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';

type Data = {
  name: string;
};

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { source, destination } = JSON.parse(req.body);
  if (!source || !destination) {
    return res.status(400).send({ message: 'field must not empty' });
  }
  try {
    const link = await prisma.links.create({
      data: {
        source: source,
        destination: destination,
        ownerToken: nanoid(),
      },
    });
    return res.status(200).json(link);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return res.status(400).send({
          message: 'short link already in use',
        });
      }
      throw err;
    }
  }
}
