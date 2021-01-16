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

import PresentationForm from '../CreateForm/Presentation';
import VideoForm from '../CreateForm/Video';
import PollForm from '../CreateForm/Poll';
import QuestionsForm from '../CreateForm/Questions';
import ScreenShareForm from '../CreateForm/ScreenShare';
import BreakoutForm from '../CreateForm/Breakout';

import PresentationDisplay from '../CallDisplay/Presentation';
import VideoDisplay from '../CallDisplay/Video';
import PollDisplay from '../CallDisplay/Poll';
import QuestionsDisplay from '../CallDisplay/Questions';
import ScreenShareDisplay from '../CallDisplay/Screenshare';
import BreakoutDisplay from '../CallDisplay/Breakout';

const iconClassName = 'TypeIcon';

export const ActivityTypeConfig: {
  type: ActivityTypes;
  name: string;
  isComingSoon?: boolean;
  description: string;
  icon: React.ReactElement;
  form: React.ReactElement;
  display: React.ReactElement;
  initialValue: ActivityMetadata[ActivityTypes];
  schema: Yup.AnySchema;
}[] = [
  {
    type: 'presentation',
    name: 'Presentation',
    description: 'Present a PowerPoint or PDF slide document.',
    icon: <PresentIcon className={iconClassName} />,
    form: <PresentationForm />,
    display: <PresentationDisplay />,
    initialValue: { presentationId: '' },
    schema: Yup.object().shape({
      presentationId: Yup.string().max(30).required('Presentation not uploaded'),
    }),
  },
  {
    type: 'poll',
    name: 'Poll',
    description: 'Get instant feedback on a question.',
    icon: <PollIcon className={iconClassName} />,
    form: <PollForm />,
    display: <PollDisplay />,
    initialValue: {
      showResultsRightAway: false,
      isMultipleChoice: false,
      numberOfVotes: 2, // TODO: this is not implemented yet
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
    description: 'Ask participants questions with open-ended responses.',
    icon: <QuestionsIcon className={iconClassName} />,
    form: <QuestionsForm />,
    display: <QuestionsDisplay />,
    initialValue: {
      questions: [''], // start with 1 (invalid) option already defined
      allowMultipleSubmissions: false,
      allowAnonymousSubmissions: false,
    },
    schema: Yup.object().shape({
      questions: Yup.array(
        Yup.string()
          .min(1, 'Please enter question text')
          .max(1000)
          .required('Please enter question text'),
      )
        .min(1)
        .max(100)
        .required(),
    }),
  },
  {
    type: 'video',
    name: 'Video',
    description: 'Watch a video together during the call.',
    isComingSoon: true,
    icon: <VideoIcon className={iconClassName} />,
    form: <VideoForm />,
    display: <VideoDisplay />,
    initialValue: { videoId: '' },
    schema: Yup.object().shape({
      videoId: Yup.string().max(30).required('Video not uploaded'),
    }),
  },
  {
    type: 'screenshare',
    name: 'Screenshare',
    description: 'Share your screen to participants.',
    isComingSoon: true,
    icon: <ScreenShareIcon className={iconClassName} />,
    form: <ScreenShareForm />,
    display: <ScreenShareDisplay />,
    initialValue: { hostOnly: false },
    schema: Yup.object().shape({
      hostOnly: Yup.boolean().required(),
    }),
  },
  {
    type: 'breakout',
    name: 'Breakout',
    description: 'Divide up the call into multiple smaller, private conversations',
    isComingSoon: true,
    icon: <BreakoutIcon className={iconClassName} />,
    form: <BreakoutForm />,
    display: <BreakoutDisplay />,
    initialValue: {
      numberOfRooms: 2,
    },
    schema: Yup.object().shape({
      numberOfRooms: Yup.number().min(2).max(50).required(),
    }),
  },
];
