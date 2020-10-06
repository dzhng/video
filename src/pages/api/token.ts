import { NowRequest, NowResponse } from '@vercel/node';
import assert from 'assert';
import twilio from 'twilio';

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID ?? '';
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID ?? '';
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET ?? '';

interface RequestBody {
  identity: string;
  roomName: string;
}

export default (req: NowRequest, res: NowResponse) => {
  const body: RequestBody = req.query as any;
  assert(typeof body.identity === 'string');
  assert(typeof body.roomName === 'string');

  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    identity: body.identity,
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });

  const videoGrant = new VideoGrant({ room: body.roomName });
  token.addGrant(videoGrant);

  res.send(token.toJwt());
  console.log(`issued token for ${body.identity} in room ${body.roomName}`);
};
