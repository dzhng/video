import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { useRouter } from 'next/router';

import useRoomState from '~/hooks/useRoomState/useRoomState';
import useVideoContext from '~/hooks/useVideoContext/useVideoContext';
import { IVideoContext } from '~/components/VideoProvider';
import { useAppState } from '~/state';
import RoomPage from '~/pages/room/[slug]';

jest.mock('next/router');
jest.mock('~/hooks/useRoomState/useRoomState');
jest.mock('~/hooks/useVideoContext/useVideoContext');
jest.mock('~/state');

const mockedUseRoomState = useRoomState as jest.Mock<string>;
const mockedUseVideoContext = useVideoContext as jest.Mock<IVideoContext>;
const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseRouter = useRouter as jest.Mock<any>;
const mockConnect = jest.fn();
const mockGetToken = jest.fn(() => Promise.resolve('mockToken'));

mockUseRouter.mockImplementation(() => ({ query: { slug: 'test' } }));
mockUseAppState.mockImplementation(() => ({ getToken: mockGetToken }));

describe('room page', () => {
  beforeEach(jest.clearAllMocks);

  it('should hide inputs when connected to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'connected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    const { container } = render(<RoomPage />);
    expect(container.querySelector('input')).toEqual(null);
  });

  it('should display inputs when disconnected from a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    const { container } = render(<RoomPage />);
    expect(container.querySelectorAll('input').length).toEqual(1);
  });

  it('should display a loading spinner while connecting to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: true, room: {}, localTracks: [] } as any),
    );
    const { container } = render(<RoomPage />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('should display a loading spinner while fetching a token', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    mockUseAppState.mockImplementationOnce(() => ({ isFetching: true }));
    const { container } = render(<RoomPage />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('should disable the Join Room button when the Room input is empty', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(<RoomPage />);
    expect(getByTestId('join-button')).toBeDisabled();
    fireEvent.change(getByLabelText('Room'), { target: { value: '' } });
    expect(getByTestId('join-button')).toBeDisabled();
  });

  it('should enable the Join Room button when the Room input is not empty', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(<RoomPage />);
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByTestId('join-button')).not.toBeDisabled();
  });

  it('should disable the Join Room button when connecting to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: true, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(<RoomPage />);
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByTestId('join-button')).toBeDisabled();
  });

  it('should disable the Join Room button while local tracks are being acquired', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isAcquiringLocalTracks: true, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(<RoomPage />);
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByTestId('join-button')).toBeDisabled();
  });

  it('should call getToken() and connect() on submit', (done) => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, connect: mockConnect, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(<RoomPage />);
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo Test' } });
    fireEvent.click(getByTestId('join-button'));
    expect(mockGetToken).toHaveBeenCalledWith('', 'Foo Test');
    setImmediate(() => {
      expect(mockConnect).toHaveBeenCalledWith('mockToken');
      done();
    });
  });
});
