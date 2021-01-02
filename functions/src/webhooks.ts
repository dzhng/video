import * as functions from 'firebase-functions';
import 'firebase-functions';
import admin from 'firebase-admin';
import { region } from './constants';

// The URL of this is set in the Twilio room settings admin panel
export const twilioVideoStatus = functions.region(region).https.onRequest((req, res) => {
  // only expect post type requests
  if (req.method !== 'POST') {
    return res.status(400).end();
  }

  console.log(req.body);
  // expect a string body
  if (typeof req.body !== 'string') {
    return res.status(400).end();
  }
});
