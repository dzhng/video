import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import useLocalAudioToggle from '~/hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '~/hooks/useVideoContext/useVideoContext';

import ToggleAudioButton from './ToggleAudioButton';

jest.mock('~/hooks/useLocalAudioToggle/useLocalAudioToggle');
jest.mock('~/hooks/useVideoContext/useVideoContext');

const mockUseLocalAudioToggle = useLocalAudioToggle as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

describe('the ToggleAudioButton component', () => {
  beforeEach(() => {
    mockUseLocalAudioToggle.mockImplementation(() => [true, () => {}]);
    mockUseVideoContext.mockImplementation(() => ({ localTracks: [{ kind: 'audio' }] }));
  });

  it('should show button if there is a local audio track', () => {
    render(<ToggleAudioButton />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('should disable button if there is no local audio track', () => {
    mockUseVideoContext.mockImplementation(() => ({ localTracks: [] }));
    render(<ToggleAudioButton />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

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
