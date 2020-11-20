# Video React App

## Make sure you have the necessary dependencies

### Install firebase-tools globally

`npm install -g firebase-tools`

### Install Java

Some versions of Linux may not have Java installed by default (required for Firebase emulators)

`sudo apt update && sudo apt install openjdk-11-jdk`

## Pull env Variables from Vercel

`vercel env pull`

To run the app locally:

`vercel dev`

## Tests

This application has unit tests (using [Jest](https://jestjs.io/)) and E2E tests (using [Cypress](https://www.cypress.io/)). You can run the tests with the following scripts.

### Unit Tests

Run unit tests with

    $ npm test

This will run all unit tests with Jest and output the results to the console.

To run a specific test

    $ npm test <SEARCH_TERM>

The grep command will automatically run all tests that matches the given search term

If you need to pass more arguments into jest, add a `--` before adding additional arguments.

    $ npm test <SEARCH_TERM> -- --watch

### E2E Tests (WORK IN PROGRESS)

Run end to end tests with

    $ npm run cypress:open

This will open the Cypress test runner. When it's open, select a test file to run.

## Video Architecture

The state of this application (with a few exceptions) is managed by the [room object](https://media.twiliocdn.com/sdk/js/video/releases/2.0.0/docs/Room.html) that is supplied by the SDK. The `room` object contains all information about the room that the user is connected to. The class hierarchy of the `room` object can be viewed [here](https://www.twilio.com/docs/video/migrating-1x-2x#object-model).

One great way to learn about the room object is to explore it in the browser console. When you are connected to a room, the application will expose the room object as a window variable: `window.twilioRoom`.

Since the Twilio Video SDK manages the `room` object state, it can be used as the source of truth. It isn't necessary to use a tool like Redux to track the room state. The `room` object and most child properties are [event emitters](https://nodejs.org/api/events.html#events_class_eventemitter), which means that we can subscribe to these events to update React components as the room state changes.

[React hooks](https://reactjs.org/docs/hooks-intro.html) can be used to subscribe to events and trigger component re-renders. This application frequently uses the `useState` and `useEffect` hooks to subscribe to changes in room state. Here is a simple example:

```
import { useEffect, useState } from 'react';

export default function useDominantSpeaker(room) {
  const [dominantSpeaker, setDominantSpeaker] = useState(room.dominantSpeaker);

  useEffect(() => {
    room.on('dominantSpeakerChanged', setDominantSpeaker);
    return () => {
      room.off('dominantSpeakerChanged', setDominantSpeaker);
    };
  }, [room]);

  return dominantSpeaker;
}
```

In this hook, the `useEffect` hook is used to subscribe to the `dominantSpeakerChanged` event emitted by the `room` object. When this event is emitted, the `setDominantSpeaker` function is called which will update the `dominantSpeaker` variable and trigger a re-render of any components that are consuming this hook.

For more information on how React hooks can be used with the Twilio Video SDK, see this tutorial: https://www.twilio.com/blog/video-chat-react-hooks. To see all of the hooks used by this application, look in the `src/hooks` directory.

### Video Settings

The `connect` function from the SDK accepts a [configuration object](https://media.twiliocdn.com/sdk/js/video/releases/2.0.0/docs/global.html#ConnectOptions). The configuration object for this application can be found in [src/index.ts](https://github.com/twilio/twilio-video-app-react/blob/master/src/index.tsx#L20). In this object, we 1) enable dominant speaker detection, 2) enable the network quality API, and 3) supply various options to configure the [bandwidth profile](https://www.twilio.com/docs/video/tutorials/using-bandwidth-profile-api).

### Track Priority Settings

This application dynamically changes the priority of remote video tracks to provide an optimal collaboration experience. Any video track that will be displayed in the main video area will have `track.setPriority('high')` called on it (see the [VideoTrack](https://github.com/twilio/twilio-video-app-react/blob/master/src/components/VideoTrack/VideoTrack.tsx#L25) component) when the component is mounted. This higher priority enables the track to be rendered at a high resolution. `track.setPriority(null)` is called when the component is unmounted so that the track's priority is set to its publish priority (low).
