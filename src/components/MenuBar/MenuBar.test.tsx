import React from 'react';
import { screen, render } from '@testing-library/react';
import { useRouter } from 'next/router';

import useRoomState from '~/hooks/useRoomState/useRoomState';
import useFullScreenToggle from '~/hooks/useFullScreenToggle/useFullScreenToggle';
import useVideoContext from '~/hooks/useVideoContext/useVideoContext';
import { useAppState } from '~/state';
import { IVideoContext } from '~/components/VideoProvider';
import MenuBar from './MenuBar';

jest.mock('next/router');
jest.mock('~/hooks/useVideoContext/useVideoContext');
jest.mock('~/hooks/useRoomState/useRoomState');
jest.mock('~/hooks/useFullScreenToggle/useFullScreenToggle');
jest.mock('~/state');
jest.mock('./FlipCameraButton/FlipCameraButton', () => () => null);

const mockedUseRoomState = useRoomState as jest.Mock<string>;
const mockedUseFullScreenToggle = useFullScreenToggle as jest.Mock;
const mockedUseVideoContext = useVideoContext as jest.Mock<IVideoContext>;
const mockToggleFullScreen = jest.fn();
const mockUseRouter = useRouter as jest.Mock<any>;
const mockUseAppState = useAppState as jest.Mock<any>;

const mockReplaceState = jest.fn();
Object.defineProperty(window.history, 'replaceState', { value: mockReplaceState });

mockedUseFullScreenToggle.mockImplementation(() => [true, mockToggleFullScreen]);
mockUseAppState.mockImplementation(() => ({ user: {} }));
mockUseRouter.mockImplementation(() => ({ query: { slug: 'test' } }));

describe('the MenuBar component', () => {
  it('should populate the Room name from the URL', () => {
    mockedUseRoomState.mockImplementation(() => 'connected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );

    render(<MenuBar />);
    expect(screen.queryByText('test')).toBeInTheDocument();
  });
});
