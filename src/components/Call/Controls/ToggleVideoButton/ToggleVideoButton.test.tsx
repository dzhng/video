import React from 'react';
import { screen, render } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import useLocalVideoToggle from '~/hooks/Call/useLocalVideoToggle/useLocalVideoToggle';

import ToggleVideoButton from './ToggleVideoButton';

jest.mock('~/hooks/Call/useLocalVideoToggle/useLocalVideoToggle');

const mockUseLocalVideoToggle = useLocalVideoToggle as jest.Mock<any>;

describe('the ToggleVideoButton component', () => {
  it('should render correctly when video is enabled', async () => {
    mockUseLocalVideoToggle.mockImplementation(() => [true, () => {}]);
    render(<ToggleVideoButton />);
    fireEvent.hover(screen.getByRole('button'));

    expect(screen.queryByTestId('video-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('videooff-icon')).not.toBeInTheDocument();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip').textContent).toBe('Mute Video');
  });

  it('should render correctly when video is disabled', async () => {
    mockUseLocalVideoToggle.mockImplementation(() => [false, () => {}]);
    render(<ToggleVideoButton />);
    fireEvent.hover(screen.getByRole('button'));

    expect(screen.queryByTestId('video-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('videooff-icon')).toBeInTheDocument();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip').textContent).toBe('Unmute Video');
  });

  it('should call the correct toggle function when clicked', () => {
    const mockFn = jest.fn();
    mockUseLocalVideoToggle.mockImplementation(() => [false, mockFn]);
    render(<ToggleVideoButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });

  it('should throttle the toggle function to 200ms', () => {
    const mockFn = jest.fn();
    mockUseLocalVideoToggle.mockImplementation(() => [false, mockFn]);
    render(<ToggleVideoButton />);
    const button = screen.getByRole('button');
    Date.now = () => 100000;
    fireEvent.click(button); // Should register
    Date.now = () => 100300;
    fireEvent.click(button); // Should be ignored
    Date.now = () => 100301;
    fireEvent.click(button); // Should register
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
