import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import useLocalAudioToggle from '~/hooks/useLocalAudioToggle/useLocalAudioToggle';

import ToggleAudioButton from './ToggleAudioButton';

jest.mock('~/hooks/useLocalAudioToggle/useLocalAudioToggle');

const mockUseLocalAudioToggle = useLocalAudioToggle as jest.Mock<any>;

describe('the ToggleAudioButton component', () => {
  it('should render correctly when audio is enabled', async () => {
    mockUseLocalAudioToggle.mockImplementation(() => [true, () => {}]);
    render(<ToggleAudioButton />);
    fireEvent.mouseOver(screen.getByRole('button'));

    expect(screen.queryByTestId('mic-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('micoff-icon')).not.toBeInTheDocument();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip').textContent).toBe('Mute Audio');
  });

  it('should render correctly when audio is disabled', async () => {
    mockUseLocalAudioToggle.mockImplementation(() => [false, () => {}]);
    render(<ToggleAudioButton />);
    fireEvent.mouseOver(screen.getByRole('button'));

    expect(screen.queryByTestId('mic-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('micoff-icon')).toBeInTheDocument();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip').textContent).toBe('Unmute Audio');
  });

  it('should call the correct toggle function when clicked', () => {
    const mockFn = jest.fn();
    mockUseLocalAudioToggle.mockImplementation(() => [false, mockFn]);
    render(<ToggleAudioButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
