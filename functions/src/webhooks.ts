import * as functions from 'firebase-functions';
import 'firebase-functions';
import admin from 'firebase-admin';
import { Collections, Call } from './schema';
import { region } from './constants';

interface TwilioStatusBody {
  AccountSid: string;
  RoomName: string;
  RoomSid: string;
  RoomStatus: string;
  RoomType: string;
  StatusCallbackEvent: string;
  Timestamp: string;
  ParticipantSid?: string;
  ParticipantStatus?: string;
  ParticipantDuration?: string;
  ParticipantIdentity?: string;
  RoomDuration?: string;
  TrackSid?: string;
  TrackKind?: string;
}

// The URL of this is set in the Twilio room settings admin panel
export const twilioVideoStatus = functions.region(region).https.onRequest(async (req, res) => {
  // only expect post type requests
  if (req.method !== 'POST') {
    console.warn('Invalid request method');
    return res.status(400).end();
  }

  // expect an object body
  if (typeof req.body !== 'object') {
    console.warn('Invalid body type');
    return res.status(400).end();
  }

  const { RoomName, StatusCallbackEvent, RoomDuration } = req.body as TwilioStatusBody;
  if (
    (!RoomName && typeof RoomName !== 'string') ||
    (!StatusCallbackEvent && typeof StatusCallbackEvent !== 'string')
  ) {
    console.warn('Invalid body data');
    return res.status(400).end();
  }

  // make sure it's the right event, don't do anything for the rest
  if (StatusCallbackEvent !== 'room-ended') {
    return res.status(200).end();
  }

  // find the call based on room name
  const store = admin.firestore();
  const batch = store.batch();

  const call = await store.collection(Collections.CALLS).doc(RoomName).get();
  if (!call.exists) {
    console.error('Call model does not exist for room ' + RoomName);
    return res.status(400).end();
  }

  const callData = call.data() as Call;

  const callRef = store.collection(Collections.CALLS).doc(RoomName);
  const templateRef = store.collection(Collections.TEMPLATES).doc(callData.templateId);

  batch.update(callRef, {
    isFinished: true,
    duration: Number(RoomDuration),
  });

  batch.update(templateRef, {
    ongoingCallId: null,
  });

  batch.commit().then(
    () => {
      return res.status(200).end();
    },
    (error) => {
      console.error('Document update error', error);
      return res.status(400).end();
    },
  );
});
