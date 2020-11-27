import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';

import EndCallButton from './EndCallButton';

const mockRoom: any = { disconnect: jest.fn() };
jest.mock('~/hooks/useVideoContext/useVideoContext', () => () => ({ room: mockRoom }));

describe('End Call button', () => {
  it('should disconnect from the room when clicked', () => {
    render(<EndCallButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockRoom.disconnect).toHaveBeenCalled();
  });
});
