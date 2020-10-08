import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import useRoomState from '~/hooks/useRoomState/useRoomState';
import useVideoContext from '~/hooks/useVideoContext/useVideoContext';
import { IVideoContext } from '~/components/VideoProvider';
import IndexPage from '~/pages/index';

jest.mock('~/hooks/useRoomState/useRoomState');
jest.mock('~/hooks/useVideoContext/useVideoContext');
jest.mock('~/state');

const mockedUseRoomState = useRoomState as jest.Mock<string>;
const mockedUseVideoContext = useVideoContext as jest.Mock<IVideoContext>;
const mockConnect = jest.fn();

describe('index page', () => {
  it('should update the URL to include the room name on submit', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, connect: mockConnect, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(<IndexPage />);
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo Test' } });
    fireEvent.click(getByTestId('join-button'));
    expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/room/Foo%20Test');
  });
});
