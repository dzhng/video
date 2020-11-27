import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';

import useRoomState from '~/hooks/useRoomState/useRoomState';
import useVideoContext from '~/hooks/useVideoContext/useVideoContext';
import { IVideoContext } from '~/components/VideoProvider';
import { useAppState } from '~/state';
import RoomPage from '~/pages/room/[slug]';

jest.mock('next/router');
jest.mock('~/state');
jest.mock('~/hooks/useRoomState/useRoomState');
jest.mock('~/hooks/useVideoContext/useVideoContext');
jest.mock('~/utils/useConnectionOptions/useConnectionOptions');
jest.mock(
  '~/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning',
  () => ({ children }: { children: React.ReactChildren }) => children,
);
jest.mock('~/components/VideoProvider', () => ({
  VideoProvider: ({ children }: { children: React.ReactChildren }) => children,
}));
jest.mock('~/components/PrivateRoute/withPrivateRoute', () => (component: any) => component);

const mockedUseRoomState = useRoomState as jest.Mock<string>;
const mockedUseVideoContext = useVideoContext as jest.Mock<IVideoContext>;
const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseRouter = useRouter as jest.Mock<any>;
const mockConnect = jest.fn();
const mockGetToken = jest.fn(() => Promise.resolve('mockToken'));

describe('room page', () => {
  beforeEach(() => {
    mockUseRouter.mockImplementation(() => ({ query: { slug: 'test-room' } }));
    mockUseAppState.mockImplementation(() => ({ getToken: mockGetToken }));
  });

  it('should display a loading spinner while connecting to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: true, room: {}, localTracks: [] } as any),
    );
    render(<RoomPage />);
    expect(screen.queryByTestId('progress-spinner')).toBeInTheDocument();
  });

  it('should display a loading spinner while fetching a token', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    mockUseAppState.mockImplementation(() => ({ isFetching: true }));
    render(<RoomPage />);
    expect(screen.queryByTestId('progress-spinner')).toBeInTheDocument();
  });

  it('should disable the Join Room button when connecting to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: true, room: {}, localTracks: [] } as any),
    );
    render(<RoomPage />);
    expect(screen.getByTestId('join-button')).toBeDisabled();
  });

  it('should disable the Join Room button while local tracks are being acquired', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isAcquiringLocalTracks: true, room: {}, localTracks: [] } as any),
    );
    render(<RoomPage />);
    expect(screen.getByTestId('join-button')).toBeDisabled();
  });

  it('should call getToken() and connect() on submit', (done) => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, connect: mockConnect, room: {}, localTracks: [] } as any),
    );
    render(<RoomPage />);
    fireEvent.click(screen.getByTestId('join-button'));
    setImmediate(() => {
      expect(mockGetToken).toHaveBeenCalledWith('test-room');
      expect(mockConnect).toHaveBeenCalledWith('mockToken');
      done();
    });
  });
});
