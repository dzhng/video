import React from 'react';
import { screen, render } from '@testing-library/react';

import useRoomState from '~/hooks/Call/useRoomState/useRoomState';
import useIsUserActive from './useIsUserActive/useIsUserActive';
import EndCallButton from './EndCallButton/EndCallButton';
import ToggleAudioButton from './ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from './ToggleVideoButton/ToggleVideoButton';
import ToggleScreenShareButton from './ToggleScreenShareButton/ToggleScreenShareButton';
import Controls from './Controls';

jest.mock('~/hooks/Call/useRoomState/useRoomState');
jest.mock('./EndCallButton/EndCallButton');
jest.mock('./ToggleAudioButton/ToggleAudioButton');
jest.mock('./ToggleVideoButton/ToggleVideoButton');
jest.mock('./ToggleScreenShareButton/ToggleScreenShareButton');
jest.mock('./useIsUserActive/useIsUserActive');

const mockIsUserActive = useIsUserActive as jest.Mock<boolean>;
const mockUseRoomState = useRoomState as jest.Mock<any>;
const mockEndCallButton = EndCallButton as jest.Mock<any>;
const mockToggleAudioButton = ToggleAudioButton as jest.Mock<any>;
const mockToggleVideoButton = ToggleVideoButton as jest.Mock<any>;
const mockToggleScreenShareButton = ToggleScreenShareButton as jest.Mock<any>;

mockEndCallButton.mockImplementation(() => null);
mockToggleAudioButton.mockImplementation(() => null);
mockToggleVideoButton.mockImplementation(() => null);
mockToggleScreenShareButton.mockImplementation(() => null);

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
      expect(mockToggleScreenShareButton).not.toBeCalled();
      expect(mockEndCallButton).not.toBeCalled();
    });

    it('should render the ToggleScreenShare and EndCall buttons when connected to a room', () => {
      mockUseRoomState.mockImplementation(() => 'connected');
      render(<Controls />);
      expect(mockToggleScreenShareButton).toBeCalledTimes(1);
      expect(mockEndCallButton).toBeCalledTimes(1);
    });

    it('should disable the ToggleAudio, ToggleVideo, and ToggleScreenShare buttons when reconnecting to a room', () => {
      mockUseRoomState.mockImplementation(() => 'reconnecting');
      render(<Controls />);
      expect(mockToggleAudioButton).toBeCalledWith(
        expect.objectContaining({ disabled: true }),
        expect.anything(),
      );
      expect(mockToggleVideoButton).toBeCalledWith(
        expect.objectContaining({ disabled: true }),
        expect.anything(),
      );
      expect(mockToggleScreenShareButton).toBeCalledWith(
        expect.objectContaining({ disabled: true }),
        expect.anything(),
      );
    });
  });

  describe('when the user is inactive', () => {
    mockIsUserActive.mockImplementation(() => false);

    it('should have the "active" class when the user is not connected to a room', () => {
      mockUseRoomState.mockImplementation(() => 'disconnected');
      render(<Controls />);
      expect(screen.getByTestId('container').className).toContain('showControls');
    });

    it('should not have the "active" class when the user is connected to a room', () => {
      mockUseRoomState.mockImplementation(() => 'connected');
      render(<Controls />);
      expect(screen.getByTestId('container').className).not.toContain('showControls');
    });
  });
});
