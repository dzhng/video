import { NowRequest, NowResponse } from '@vercel/node';
import assert from 'assert';
import twilio from 'twilio';

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID ?? '';
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID ?? '';
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET ?? '';

interface RequestBody {
  identity: string;
  roomName: string;
}

export default (req: NowRequest, res: NowResponse) => {
  if (req.method !== 'POST') {
    return res.status(400).end();
  }

  const body: RequestBody = req.body;
  assert(typeof body.identity === 'string');
  assert(typeof body.roomName === 'string');
  assert(body.identity.length > 0);
  assert(body.roomName.length > 0);

  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    identity: body.identity,
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });

  const videoGrant = new VideoGrant({ room: body.roomName });
  token.addGrant(videoGrant);

  res.send(token.toJwt());
};
