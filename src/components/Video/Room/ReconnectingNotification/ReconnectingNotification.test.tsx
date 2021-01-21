import React from 'react';
import ReconnectingNotification from './ReconnectingNotification';
import { screen, render } from '@testing-library/react';
import useRoomState from '~/hooks/Video/useRoomState/useRoomState';

jest.mock('~/hooks/Video/useRoomState/useRoomState');
const mockUseRoomState = useRoomState as jest.Mock<string>;

describe('the ReconnectingNotification component', () => {
  it('should not open Snackbar when room state is not "reconnecting"', () => {
    mockUseRoomState.mockImplementation(() => 'connected');
    render(<ReconnectingNotification />);
    expect(screen.queryByTestId('container')).not.toBeInTheDocument();
  });

  it('should open Snackbar when room state is "reconnecting"', () => {
    mockUseRoomState.mockImplementation(() => 'reconnecting');
    render(<ReconnectingNotification />);
    expect(screen.queryByTestId('container')).toBeInTheDocument();
  });
});
