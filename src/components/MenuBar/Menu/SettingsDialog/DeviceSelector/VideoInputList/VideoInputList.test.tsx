import React from 'react';
import { screen, render } from '@testing-library/react';
import useVideoContext from '~/hooks/useVideoContext/useVideoContext';
import VideoTrack from '~/components/VideoTrack/VideoTrack';
import { useVideoInputDevices } from '../deviceHooks/deviceHooks';
import VideoInputList from './VideoInputList';

jest.mock('~/hooks/useVideoContext/useVideoContext');
jest.mock('~/hooks/useMediaStreamTrack/useMediaStreamTrack');
jest.mock('~/components/VideoTrack/VideoTrack');
jest.mock('../deviceHooks/deviceHooks');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseVideoInputDevices = useVideoInputDevices as jest.Mock<any>;
const mockVideoTrack = VideoTrack as jest.Mock<any>;
const mockGetLocalVideotrack = jest.fn(() => Promise.resolve);

const mockDevice = {
  deviceId: '123',
  label: 'mock device',
};

const mockLocalTrack = {
  kind: 'video',
  mediaStreamTrack: {
    label: 'mock local video track',
    getSettings: () => ({ deviceId: '123' }),
  },
};

mockVideoTrack.mockImplementation(() => null);

describe('the VideoInputList component', () => {
  beforeEach(() => {
    mockUseVideoInputDevices.mockImplementation(() => []);
    mockUseVideoContext.mockImplementation(() => ({
      room: {},
      getLocalVideoTrack: mockGetLocalVideotrack,
      localTracks: [mockLocalTrack],
    }));
  });

  it('should render VideoTrack with local track when it exists', () => {
    render(<VideoInputList />);
    expect(mockVideoTrack).toBeCalledWith(
      expect.objectContaining({ isLocal: true, track: mockLocalTrack }),
      expect.anything(),
    );
  });

  it('should not render VideoTrack if there are no local track', () => {
    mockUseVideoContext.mockImplementation(() => ({
      room: {},
      getLocalVideoTrack: mockGetLocalVideotrack,
      localTracks: [],
    }));

    render(<VideoInputList />);
    expect(mockVideoTrack).not.toBeCalled();
  });

  it('should not display a Select menu and instead display the name of the local video track', () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice]);
    render(<VideoInputList />);
    expect(screen.queryByTestId('select-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('default-track-name').textContent).toBe('mock local video track');
  });

  it('should display "No Local Video" when there is no local video track', () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice]);
    mockUseVideoContext.mockImplementationOnce(() => ({
      room: {},
      getLocalVideoTrack: mockGetLocalVideotrack,
      localTracks: [],
    }));
    render(<VideoInputList />);
    expect(screen.getByTestId('default-track-name').textContent).toBe('No Local Video');
  });

  it('should render a Select menu when there are multiple video input devices', () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    render(<VideoInputList />);
    expect(screen.queryByTestId('select-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('default-track-name')).not.toBeInTheDocument();
  });
});
