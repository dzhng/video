import React from 'react';
import { screen, render } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';

import { Call } from '~/firebase/schema-types';
import useRoomState from '~/hooks/Video/useRoomState/useRoomState';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import { IVideoContext } from '~/components/Video/VideoProvider';
import { useAppState } from '~/state';
import CallContainer from './Call';

jest.mock('next/router');
jest.mock('~/state');
jest.mock('~/hooks/Video/useRoomState/useRoomState');
jest.mock('~/hooks/Video/useVideoContext/useVideoContext');
jest.mock('~/utils/useConnectionOptions/useConnectionOptions');
jest.mock(
  '~/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning',
  () => ({ children }: { children: React.ReactChildren }) => children,
);
jest.mock('~/components/Video/VideoProvider', () => ({
  VideoProvider: ({ children }: { children: React.ReactChildren }) => children,
}));
jest.mock('~/components/Video/Room/Room', () => () => null);
jest.mock('~/components/PrivateRoute/withPrivateRoute', () => (component: any) => component);

const mockedUseRoomState = useRoomState as jest.Mock<string>;
const mockedUseVideoContext = useVideoContext as jest.Mock<IVideoContext>;
const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseRouter = useRouter as jest.Mock<any>;
const mockConnect = jest.fn();
const mockGetToken = jest.fn(() => Promise.resolve('mockToken'));

const mockCall: Call = {
  name: 'hello',
  state: 'started',
  users: [],
  createdAt: new Date(),
};

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
    render(<CallContainer call={mockCall} />);
    expect(screen.queryByTestId('progress-spinner')).toBeInTheDocument();
  });

  it('should display a loading spinner while fetching a token', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    mockUseAppState.mockImplementation(() => ({ isFetching: true }));
    render(<CallContainer call={mockCall} />);
    expect(screen.queryByTestId('progress-spinner')).toBeInTheDocument();
  });

  it('should disable the Join Room button when connecting to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: true, room: {}, localTracks: [] } as any),
    );
    render(<CallContainer call={mockCall} />);
    expect(screen.getByTestId('join-button')).toBeDisabled();
  });

  it('should disable the Join Room button while local tracks are being acquired', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isAcquiringLocalTracks: true, room: {}, localTracks: [] } as any),
    );
    render(<CallContainer call={mockCall} />);
    expect(screen.getByTestId('join-button')).toBeDisabled();
  });

  it('should call getToken() and connect() on submit', (done) => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, connect: mockConnect, room: {}, localTracks: [] } as any),
    );
    render(<CallContainer call={mockCall} />);
    fireEvent.click(screen.getByTestId('join-button'));
    setImmediate(() => {
      expect(mockGetToken).toHaveBeenCalledWith('test-room');
      expect(mockConnect).toHaveBeenCalledWith('mockToken');
      done();
    });
  });
});
