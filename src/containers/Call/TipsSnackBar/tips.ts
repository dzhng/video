export const tips = [
  'Painlessly navigate through your call with hotkeys. Press and hold [tab] to see the available hotkeys.',
  'Engage everone in the call with activities, create polls or questionnaires to easily get everyone involved.',
  'Use notes to easily keep everyone aligned. All created notes will be saved and shared with the host after the call is over.',
];

export const randomTip = () => {
  const index = Math.min(Math.floor(Math.random() * tips.length), tips.length - 1);
  return tips[index];
};
