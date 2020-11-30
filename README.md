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

### Unit Tests

Run unit tests with

    $ npm test

This will run all unit tests with Jest and output the results to the console.

To run a specific test

    $ npm test <SEARCH_TERM>

The grep command will automatically run all tests that matches the given search term

If you want to run in dev mode, which includes auto re-run as well as search term support

    $ npm run test:watch <SEARCH_TERM>

If you need to pass more arguments into jest, add a `--` before adding additional arguments.

    $ npm test <SEARCH_TERM> -- --watch

## Testing Approach

### Rendering in Virtual DOM: testing-library vs enzyme

Of the two popular testing methods for DOM, we're going to follow the strategy defined by testing-library, which tests closer to final rendered output, and not a component's internal states and methods. This is a good [summary of why](https://kentcdodds.com/blog/why-i-never-use-shallow-rendering#calling-methods-in-react-components).

Last thing, familiarize yourself with [this](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) before writing any tests. It is important that we keep the approach and style of all our tests as consistent as possible, just as much as the actual codebase itself.

### Best Practices

Generally, we should use snapshots as least as possible. Components should be mocked explicitly instead of snapshotted. Snapshot does not encourage critical thinking of the tests itself, and would often be updated just to ensure a test passes. On the rare occassion that a snapshot is needed, use `react-test-renderer`, which will produce a JSON version of the component tree to be snapshotted.

For most component tests, use `@testing-library/react`, particularly the `screen` and `render` methods. Do not use the return variables from `render`, as that is deprecated, use `screen` instead to query for rendered components.

To handle user events, use `@testing-library/user-event`. The default `fireEvent` that comes with testing-library is too low level, the `user-event` package introduces a higher-level abstraction that is much closer to what the user would actually do (e.g. instead of individual mouse events, it would just be one `click` event that would also generate the necessary `hover`, `up`, and `down` states; and it will behave much closer actual UX where it will not allow clicks if a button is disabled).

## Package Management

Make sure to keep all dependencies updated. Read release notes whenever there is a major update to access compatibility / learn about new features.

To see a list of all oudated packages

    $ npm outdated

To upgrade all or specific package to latest minor versions (following package.json semver). The `<package_name>` is optional, leave out to upgrade all packages.

    $ npm upgrade <package_name>

To upgrade a specific package to latest major version (make sure to research compatibility first!)

    $ npm install <package_name>@latest

## Style Guides

Style will be automatically enforced via prettier and eslint. An autoformatter will be run on every git commit via lint-staged, and a linting script is available if you want to manually run it.

There are a few things to enforce outside of auto formatting though.

Ensure that imports are destructured whenever possible

```
// bad
import lodash from 'lodash';

// good
import { uniq, compact } from 'lodash';
```

Combine imports whenever possible

```
// bad
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

// good
import { Button, Container } from '@material-ui/core';
```

## Component Structure

There are 3 different types of components in this app, pages (under `src/pages`), containers (under `src/containers`), and components (under `src/components`). The rule of thumb is:

- A page handles all database operations (CRUD) and should just render one container; however, there can be logic that renders different containers based on states (e.g. for loading).
- A container takes in any necessary data from prop and render components and handle layouts; any user interaction business logic should also be here.
- A component should be stateless independent pieces of UI that can be reused; any data should be passed in either through props or context (via providers).

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
