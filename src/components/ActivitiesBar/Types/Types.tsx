import { ActivityTypes } from '~/firebase/schema-types';
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
  initialValue: object;
  schema: Yup.ObjectSchema;
}[] = [
  {
    type: 'presentation',
    name: 'Presentation',
    icon: <PresentIcon className={iconClassName} />,
    form: <PresentationActivity />,
    initialValue: { presentationId: null },
    schema: Yup.object().shape({
      presentationId: Yup.string().nullable().max(30).required('Presentation not uploaded'),
    }),
  },
  {
    type: 'video',
    name: 'Video',
    icon: <VideoIcon className={iconClassName} />,
    form: <VideoActivity />,
    initialValue: { videoId: null },
    schema: Yup.object().shape({
      videoId: Yup.string().nullable().max(30).required('Video not uploaded'),
    }),
  },
  {
    type: 'poll',
    name: 'Poll',
    icon: <PollIcon className={iconClassName} />,
    form: <PollActivity />,
    initialValue: {},
    schema: Yup.object().shape({}),
  },
  {
    type: 'questions',
    name: 'Questions',
    icon: <QuestionsIcon className={iconClassName} />,
    form: <QuestionsActivity />,
    initialValue: {},
    schema: Yup.object().shape({}),
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
    initialValue: {},
    schema: Yup.object().shape({}),
  },
];
