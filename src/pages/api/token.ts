import { NowRequest, NowResponse } from '@vercel/node';
import assert from 'assert';
import twilio from 'twilio';
import admin from '~/utils/firebase-admin';

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID ?? '';
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID ?? '';
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET ?? '';

interface RequestBody {
  idToken: string;
  roomName: string;
}

export default async (req: NowRequest, res: NowResponse) => {
  if (req.method !== 'POST') {
    return res.status(400).end();
  }

  const body: RequestBody = req.body;
  assert(typeof body.idToken === 'string');
  assert(typeof body.roomName === 'string');
  assert(body.idToken.length > 0);
  assert(body.roomName.length > 0);

  const decodedToken = await admin.auth().verifyIdToken(body.idToken);
  const identity = decodedToken.uid;

  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    identity,
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });

  const videoGrant = new VideoGrant({ room: body.roomName });
  token.addGrant(videoGrant);

  res.send(token.toJwt());
};
