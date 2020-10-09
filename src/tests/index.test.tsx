import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { useRouter } from 'next/router';

import useRoomState from '~/hooks/useRoomState/useRoomState';
import useVideoContext from '~/hooks/useVideoContext/useVideoContext';
import { useAppState } from '~/state';
import { IVideoContext } from '~/components/VideoProvider';
import IndexPage from '~/pages/index';

jest.mock('next/router');
jest.mock('~/hooks/useRoomState/useRoomState');
jest.mock('~/hooks/useVideoContext/useVideoContext');
jest.mock('~/state');

const mockUseRouter = useRouter as jest.Mock<any>;
const mockUseRoomState = useRoomState as jest.Mock<string>;
const mockUseVideoContext = useVideoContext as jest.Mock<IVideoContext>;
const mockUseAppState = useAppState as jest.Mock<any>;
const mockConnect = jest.fn();
const mockPush = jest.fn();

describe('index page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppState.mockImplementation(() => ({ isAuthReady: true, user: {} }));
    mockUseRouter.mockImplementation(() => ({ push: mockPush }));
  });

  it('should update the URL to include the room name on submit', () => {
    mockUseRoomState.mockImplementation(() => 'disconnected');
    mockUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, connect: mockConnect, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(<IndexPage />);
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo Test' } });
    fireEvent.click(getByTestId('join-button'));
    expect(mockPush).toHaveBeenCalledWith('/room/Foo%20Test');
  });

  it('should disable the Join Room button when the Room input is empty', () => {
    mockUseRoomState.mockImplementation(() => 'disconnected');
    mockUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(<IndexPage />);
    expect(getByTestId('join-button')).toBeDisabled();
    fireEvent.change(getByLabelText('Room'), { target: { value: '' } });
    expect(getByTestId('join-button')).toBeDisabled();
  });

  it('should enable the Join Room button when the Room input is not empty', () => {
    mockUseRoomState.mockImplementation(() => 'disconnected');
    mockUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(<IndexPage />);
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByTestId('join-button')).not.toBeDisabled();
  });
});
