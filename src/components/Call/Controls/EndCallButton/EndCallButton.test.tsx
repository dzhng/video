import React from 'react';
import { screen, render } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';

import EndCallButton from './EndCallButton';

const mockRoom: any = { disconnect: jest.fn() };
jest.mock('~/hooks/Call/useVideoContext/useVideoContext', () => () => ({ room: mockRoom }));

describe('End Call button', () => {
  it('should disconnect from the room when clicked', () => {
    render(<EndCallButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockRoom.disconnect).toHaveBeenCalled();
  });
});
