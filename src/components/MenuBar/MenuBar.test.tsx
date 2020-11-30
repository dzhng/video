import React from 'react';
import { screen, render } from '@testing-library/react';
import { useRouter } from 'next/router';

import useRoomState from '~/hooks/Call/useRoomState/useRoomState';
import useFullScreenToggle from '~/hooks/Call/useFullScreenToggle/useFullScreenToggle';
import useVideoContext from '~/hooks/Call/useVideoContext/useVideoContext';
import { useAppState } from '~/state';
import { IVideoContext } from '~/components/Call/VideoProvider';
import MenuBar from './MenuBar';

jest.mock('next/router');
jest.mock('~/hooks/Call/useVideoContext/useVideoContext');
jest.mock('~/hooks/Call/useRoomState/useRoomState');
jest.mock('~/hooks/Call/useFullScreenToggle/useFullScreenToggle');
jest.mock('~/components/Call/FlipCameraButton/FlipCameraButton', () => () => null);
jest.mock('~/state');

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
