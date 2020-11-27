import React from 'react';
import { screen, render } from '@testing-library/react';

import useRoomState from '~/hooks/useRoomState/useRoomState';
import useIsUserActive from './useIsUserActive/useIsUserActive';
import Controls from './Controls';

jest.mock('~/hooks/useRoomState/useRoomState');
jest.mock('./EndCallButton/EndCallButton', () => () => null);
jest.mock('./ToggleAudioButton/ToggleAudioButton', () => () => null);
jest.mock('./ToggleVideoButton/ToggleVideoButton', () => () => null);
jest.mock('./ToggleScreenShareButton/ToggleScreenShareButton', () => () => null);
jest.mock('./useIsUserActive/useIsUserActive');

const mockIsUserActive = useIsUserActive as jest.Mock<boolean>;
const mockUseRoomState = useRoomState as jest.Mock<any>;

describe('the Controls component', () => {
  describe('when the user is active', () => {
    mockIsUserActive.mockImplementation(() => true);

    it('should have the "active" class', () => {
      mockUseRoomState.mockImplementation(() => 'disconnected');
      render(<Controls />);
      expect(screen.getByTestId('container').className).toContain('showControls');
    });

    it('should not render the ToggleScreenShare and EndCall buttons when not connected to a room', () => {
      mockUseRoomState.mockImplementation(() => 'disconnected');
      render(<Controls />);
      expect(screen.queryByTestId('screenshare-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('endcall-button')).not.toBeInTheDocument();
    });

    it('should render the ToggleScreenShare and EndCall buttons when connected to a room', () => {
      mockUseRoomState.mockImplementation(() => 'connected');
      render(<Controls />);
      screen.debug();
      expect(screen.queryByTestId('screenshare-button')).toBeInTheDocument();
      expect(screen.queryByTestId('endcall-button')).toBeInTheDocument();
    });

    it('should disable the ToggleAudio, ToggleVideo, and ToggleScreenShare buttons when reconnecting to a room', () => {
      mockUseRoomState.mockImplementation(() => 'reconnecting');
      const wrapper = shallow(<Controls />);
      expect(wrapper.find('ToggleAudioButton').prop('disabled')).toBe(true);
      expect(wrapper.find('ToggleVideoButton').prop('disabled')).toBe(true);
      expect(wrapper.find('ToggleScreenShareButton').prop('disabled')).toBe(true);
    });
  });

  describe('when the user is inactive', () => {
    mockIsUserActive.mockImplementation(() => false);

    it('should have the "active" class when the user is not connected to a room', () => {
      mockUseRoomState.mockImplementation(() => 'disconnected');
      const wrapper = shallow(<Controls />);
      expect(wrapper.find('div').prop('className')).toContain('showControls');
    });

    it('should not have the "active" class when the user is connected to a room', () => {
      mockUseRoomState.mockImplementation(() => 'connected');
      const wrapper = shallow(<Controls />);
      expect(wrapper.find('div').prop('className')).not.toContain('showControls');
    });
  });
});
