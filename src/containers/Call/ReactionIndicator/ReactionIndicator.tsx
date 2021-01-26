import React, { useState, useEffect, useRef } from 'react';
import { fill, without } from 'lodash';
import { motion } from 'framer-motion';
import useDimensions from 'react-cool-dimensions';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ReactionMap, ReactionType } from '~/firebase/rtdb-types';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import { CallEvents } from '~/components/CallProvider/events';

const reactionTimeMs = 1000;
const elementsPerReaction = 40;

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3,
      fontSize: '40px',
      color: 'white',
      pointerEvents: 'none',

      '& >span': {
        position: 'absolute',
        visibility: 'hidden',
        animation: `globalReaction ${reactionTimeMs / 1000}s`,
        cursor: 'default',
        pointerEvents: 'none',
      },
    },

    // define animation for pop in text
    '@global': {
      '@keyframes globalReaction': {
        '0%': {
          visibility: 'visible',
          transform: 'scale(1.0)',
          opacity: 1,
        },
        '60%': {
          opacity: 1,
          transform: 'scale(1.0)',
        },
        '100%': {
          visibility: 'hidden',
          transform: 'scale(1.5)',
          opacity: 0,
        },
      },
    },
  }),
);

export default function ReactionIndicator() {
  // measure width and height to figure out how far elements needs to float up
  const { ref, width, height } = useDimensions<HTMLDivElement>();
  const classes = useStyles();
  const { events } = useCallContext();
  const [reactionElements, setReactionElements] = useState<React.ReactNode[]>([]);
  const timerId = useRef<any>();

  // stop timer on unmount
  useEffect(
    () => () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    },
    [],
  );

  // everytime noti messages change, send to snackbar
  useEffect(() => {
    const handleNewReaction = (reaction: ReactionType) => {
      const elements = fill(Array(elementsPerReaction), null).map((_, idx) => (
        <motion.span
          key={`${new Date().getTime()}${idx}`}
          style={{ bottom: '-50px', left: Math.random() * width }}
          animate={{ bottom: (Math.random() * 0.4 + 0.2) * height }}
          transition={{
            ease: 'easeOut',
            duration: reactionTimeMs / 1000,
            delay: Math.random() * 0.5,
          }}
        >
          {ReactionMap[reaction.type]}
        </motion.span>
      ));

      setReactionElements((state) => [...elements, ...state]);

      // after animation is over, remove all elements
      timerId.current = setTimeout(() => {
        setReactionElements((state) => without(state, ...elements));
      }, reactionTimeMs);
    };

    events.on(CallEvents.NEW_REACTION, handleNewReaction);
    return () => {
      events.off(CallEvents.NEW_REACTION, handleNewReaction);
    };
  }, [events, width, height]);

  return (
    <div ref={ref} className={classes.container}>
      {reactionElements}
    </div>
  );
}
