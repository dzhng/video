import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';

import useRoomState from '~/hooks/useRoomState/useRoomState';
import useFullScreenToggle from '~/hooks/useFullScreenToggle/useFullScreenToggle';
import useVideoContext from '~/hooks/useVideoContext/useVideoContext';
import { IVideoContext } from '~/components/VideoProvider';
import { useAppState } from '~/state';
import MenuBar from './MenuBar';

const mockedUseRoomState = useRoomState as jest.Mock<string>;
const mockedUseFullScreenToggle = useFullScreenToggle as jest.Mock;
const mockedUseVideoContext = useVideoContext as jest.Mock<IVideoContext>;
const mockUseAppState = useAppState as jest.Mock<any>;
const mockToggleFullScreen = jest.fn();
const mockConnect = jest.fn();
const mockGetToken = jest.fn(() => Promise.resolve('mockToken'));

jest.mock('~/hooks/useVideoContext/useVideoContext');
jest.mock('~/hooks/useRoomState/useRoomState');
jest.mock('~/hooks/useFullScreenToggle/useFullScreenToggle');
jest.mock('~/state');

// @ts-ignore
delete window.location;

// @ts-ignore
window.location = {
  pathname: '',
  search: '',
  origin: '',
};
const renderComponent = () => (
  <MemoryRouter>
    <MenuBar />
  </MemoryRouter>
);

const mockReplaceState = jest.fn();
Object.defineProperty(window.history, 'replaceState', { value: mockReplaceState });

describe('the MenuBar component', () => {
  beforeEach(jest.clearAllMocks);
  mockedUseFullScreenToggle.mockImplementation(() => [true, mockToggleFullScreen]);
  mockUseAppState.mockImplementation(() => ({ getToken: mockGetToken }));

  it('should hide inputs when connected to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'connected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    const { container } = render(renderComponent());
    expect(container.querySelector('input')).toEqual(null);
  });

  it('should display inputs when disconnected from a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    const { container } = render(renderComponent());
    expect(container.querySelectorAll('input').length).toEqual(1);
  });

  it('should display a loading spinner while connecting to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: true, room: {}, localTracks: [] } as any),
    );
    const { container } = render(renderComponent());
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('should display a loading spinner while fetching a token', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    mockUseAppState.mockImplementationOnce(() => ({ isFetching: true }));
    const { container } = render(renderComponent());
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('should disable the Join Room button when the Room input is empty', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(renderComponent());
    expect(getByTestId('join-button')).toBeDisabled();
    fireEvent.change(getByLabelText('Room'), { target: { value: '' } });
    expect(getByTestId('join-button')).toBeDisabled();
  });

  it('should enable the Join Room button when the Room input is not empty', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(renderComponent());
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByTestId('join-button')).not.toBeDisabled();
  });

  it('should disable the Join Room button when connecting to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: true, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(renderComponent());
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByTestId('join-button')).toBeDisabled();
  });

  it('should disable the Join Room button while local tracks are being acquired', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isAcquiringLocalTracks: true, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(renderComponent());
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByTestId('join-button')).toBeDisabled();
  });

  it('should update the URL to include the room name on submit', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, connect: mockConnect, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(renderComponent());
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo Test' } });
    fireEvent.click(getByTestId('join-button'));
    expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/room/Foo%20Test');
  });

  it('should call getToken() and connect() on submit', (done) => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, connect: mockConnect, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText, getByTestId } = render(renderComponent());
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo Test' } });
    fireEvent.click(getByTestId('join-button'));
    expect(mockGetToken).toHaveBeenCalledWith('', 'Foo Test');
    setImmediate(() => {
      expect(mockConnect).toHaveBeenCalledWith('mockToken');
      done();
    });
  });

  it('should populate the Room name from the URL', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: {}, localTracks: [] } as any),
    );
    const { getByLabelText } = render(
      <MemoryRouter initialEntries={['/room/test']}>
        <Route path="/room/:URLRoomName">
          <MenuBar />
        </Route>
      </MemoryRouter>,
    );
    expect(getByLabelText('Room').getAttribute('value')).toEqual('test');
  });
});
