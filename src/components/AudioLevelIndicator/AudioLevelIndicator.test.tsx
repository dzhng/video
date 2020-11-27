import React from 'react';
import { screen, render } from '@testing-library/react';

import AudioLevelIndicator from './AudioLevelIndicator';
import MicOff from '@material-ui/icons/MicOff';
import useIsTrackEnabled from '../../hooks/useIsTrackEnabled/useIsTrackEnabled';

jest.mock('../../hooks/useIsTrackEnabled/useIsTrackEnabled');

const mockUseIsTrackEnabled = useIsTrackEnabled as jest.Mock<boolean>;

describe('the AudioLevelIndicator component', () => {
  describe('when the audioTrack is not enabled', () => {
    mockUseIsTrackEnabled.mockImplementation(() => false);
    render(<AudioLevelIndicator color="#123456" />);

    it('should render a mute icon', () => {
      expect(screen.queryByTestId('mute-icon')).toBeInTheDocument();
    });

    it('should change the color of the mute icon when color prop is used', () => {
      const icon = screen.getByTestId('mute-icon');
      expect(icon).toHaveAttribute('fill', '#123456');
    });
  });

  describe('when the audioTrack is enabled', () => {
    mockUseIsTrackEnabled.mockImplementation(() => true);
    render(<AudioLevelIndicator color="#123456" />);

    it('should render the audio level icon', () => {
      expect(screen.queryByTestId('mute-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('audio-icon')).toBeInTheDocument();
    });

    it('should change the color of the audio level icon when color prop is used', () => {
      const icon = screen.getByTestId('audio-icon');
      expect(icon).toHaveAttribute('fill', '#123456');
    });
  });
});
