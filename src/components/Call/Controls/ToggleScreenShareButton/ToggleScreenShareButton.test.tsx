import { EventEmitter } from 'events';
import React from 'react';
import { screen, render } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import useScreenShareParticipant from '~/hooks/Call/useScreenShareParticipant/useScreenShareParticipant';
import useScreenShareToggle from '~/hooks/Call/useScreenShareToggle/useScreenShareToggle';
import useVideoContext from '~/hooks/Call/useVideoContext/useVideoContext';

import ToggleScreenShareButton, {
  SCREEN_SHARE_TEXT,
  STOP_SCREEN_SHARE_TEXT,
  SHARE_IN_PROGRESS_TEXT,
  SHARE_NOT_SUPPORTED_TEXT,
} from './ToggleScreenShareButton';

jest.mock('~/hooks/Call/useScreenShareToggle/useScreenShareToggle');
jest.mock('~/hooks/Call/useScreenShareParticipant/useScreenShareParticipant');
jest.mock('~/hooks/Call/useVideoContext/useVideoContext');

const mockUseScreenShareToggle = useScreenShareToggle as jest.Mock<any>;
const mockUseScreenShareParticipant = useScreenShareParticipant as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

mockUseVideoContext.mockImplementation(() => ({ room: new EventEmitter() }));

Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getDisplayMedia: () => {},
  },
  configurable: true,
});

describe('the ToggleScreenShareButton component', () => {
  beforeEach(() => mockUseScreenShareParticipant.mockImplementation(() => null));

  it('should render correctly when screenSharing is allowed', async () => {
    mockUseScreenShareToggle.mockImplementation(() => [false, () => {}]);
    render(<ToggleScreenShareButton />);
    fireEvent.hover(screen.getByRole('button'));

    expect(screen.queryByTestId('screenshare-icon')).toBeInTheDocument();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip').textContent).toBe(SCREEN_SHARE_TEXT);
  });

  it('should render correctly when the user is sharing their screen', async () => {
    mockUseScreenShareToggle.mockImplementation(() => [true, () => {}]);
    render(<ToggleScreenShareButton />);
    fireEvent.hover(screen.getByRole('button'));

    expect(screen.queryByTestId('stop-icon')).toBeInTheDocument();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip').textContent).toBe(STOP_SCREEN_SHARE_TEXT);
  });

  it('should render correctly when another user is sharing their screen', async () => {
    mockUseScreenShareParticipant.mockImplementation(() => 'mockParticipant');
    mockUseScreenShareToggle.mockImplementation(() => [false, () => {}]);
    render(<ToggleScreenShareButton />);
    // get hover-div instead since disabled button don't trigger hover events
    fireEvent.hover(screen.getByTestId('hover-div'));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip').textContent).toBe(SHARE_IN_PROGRESS_TEXT);
  });

  it('should call the correct toggle function when clicked', () => {
    const mockFn = jest.fn();
    mockUseScreenShareToggle.mockImplementation(() => [false, mockFn]);
    render(<ToggleScreenShareButton />);
    fireEvent.click(screen.getByRole('button'));

    expect(mockFn).toHaveBeenCalled();
  });

  it('should render the screenshare button with the correct messaging if screensharing is not supported', async () => {
    Object.defineProperty(navigator, 'mediaDevices', { value: { getDisplayMedia: undefined } });
    mockUseScreenShareToggle.mockImplementation(() => [false, () => {}]);
    render(<ToggleScreenShareButton />);
    // get hover-div instead since disabled button don't trigger hover events
    fireEvent.hover(screen.getByTestId('hover-div'));

    expect(screen.queryByTestId('screenshare-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip').textContent).toBe(SHARE_NOT_SUPPORTED_TEXT);
  });
});
