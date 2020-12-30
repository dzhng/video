import { ActivityMetadata, ActivityTypes } from '~/firebase/schema-types';
import * as Yup from 'yup';
import {
  PresentIcon,
  VideoIcon,
  PollIcon,
  QuestionsIcon,
  ScreenShareIcon,
  BreakoutIcon,
} from '~/components/Icons';

import PresentationActivity from './PresentationActivity';
import VideoActivity from './VideoActivity';
import PollActivity from './PollActivity';
import QuestionsActivity from './QuestionsActivity';
import ScreenShareActivity from './ScreenShareActivity';
import BreakoutActivity from './BreakoutActivity';

const iconClassName = 'TypeIcon';

export const ActivityTypeForms: {
  type: ActivityTypes;
  name: string;
  icon: JSX.Element;
  form: JSX.Element;
  initialValue: ActivityMetadata[ActivityTypes];
  schema: Yup.ObjectSchema;
}[] = [
  {
    type: 'presentation',
    name: 'Presentation',
    icon: <PresentIcon className={iconClassName} />,
    form: <PresentationActivity />,
    initialValue: { presentationId: '' },
    schema: Yup.object().shape({
      presentationId: Yup.string().max(30).required('Presentation not uploaded'),
    }),
  },
  {
    type: 'video',
    name: 'Video',
    icon: <VideoIcon className={iconClassName} />,
    form: <VideoActivity />,
    initialValue: { videoId: '' },
    schema: Yup.object().shape({
      videoId: Yup.string().max(30).required('Video not uploaded'),
    }),
  },
  {
    type: 'poll',
    name: 'Poll',
    icon: <PollIcon className={iconClassName} />,
    form: <PollActivity />,
    initialValue: {
      showResultsRightAway: false,
      isMultipleChoice: false,
      numberOfVotes: 2,
      options: [''], // start with 1 (invalid) option already defined
    },
    schema: Yup.object().shape({
      showResultsRightAway: Yup.boolean().required(),
      isMultipleChoice: Yup.boolean().required(),
      numberOfVotes: Yup.number().min(2).max(100).required(),
      options: Yup.array(
        Yup.string()
          .min(1, 'Options should be at least 1 character long')
          .max(280)
          .required('Please input a option with at least 1 character'),
      )
        .min(1)
        .max(100)
        .required(),
    }),
  },
  {
    type: 'questions',
    name: 'Questions',
    icon: <QuestionsIcon className={iconClassName} />,
    form: <QuestionsActivity />,
    initialValue: {
      questions: [],
      allowTextSubmission: true,
      allowAnonymousSubmission: true,
    },
    schema: Yup.object().shape({
      questions: Yup.array(Yup.string().min(1).max(280).required()).min(1).max(100).required(),
    }),
  },
  {
    type: 'screenshare',
    name: 'Screenshare',
    icon: <ScreenShareIcon className={iconClassName} />,
    form: <ScreenShareActivity />,
    initialValue: { hostOnly: false },
    schema: Yup.object().shape({
      hostOnly: Yup.boolean().required(),
    }),
  },
  {
    type: 'breakout',
    name: 'Breakout',
    icon: <BreakoutIcon className={iconClassName} />,
    form: <BreakoutActivity />,
    initialValue: {
      numberOfRooms: 2,
    },
    schema: Yup.object().shape({
      numberOfRooms: Yup.number().min(2).max(50).required(),
    }),
  },
];
