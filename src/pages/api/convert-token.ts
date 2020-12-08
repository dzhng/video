import { NowRequest, NowResponse } from '@vercel/node';
import fetch from 'isomorphic-unfetch';
import assert from 'assert';
import admin from '~/utils/firebase-admin';

const convertApiKeySecret = process.env.CONVERT_SECRET ?? '';

interface RequestBody {
  idToken: string;
}

export default async (req: NowRequest, res: NowResponse) => {
  if (req.method !== 'POST') {
    return res.status(400).end();
  }

  const body: RequestBody = req.body;
  assert(typeof body.idToken === 'string');
  assert(body.idToken.length > 0);

  try {
    await admin.auth().verifyIdToken(body.idToken);
  } catch (e) {
    res.status(400).send('Not authenticated');
  }

  const result = await fetch(
    `https://v2.convertapi.com/token/create?Secret=${convertApiKeySecret}&RequestCount=100`,
    { method: 'POST' },
  );

  const convertResponse = await result.json();
  if (!(convertResponse.tokens && convertResponse.tokens.length > 0)) {
    res.status(400).send('Convert API invalid response');
  }

  const token = convertResponse.tokens[0];
  if (!token.Id) {
    res.status(400).send('Convert API invalid response');
  }

  res.send(token.Id);
};
