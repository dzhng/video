import React from 'react';
import { screen, render } from '@testing-library/react';
import { useAppState } from '~/state';
import { useAudioOutputDevices } from '../deviceHooks/deviceHooks';
import AudioOutputList from './AudioOutputList';

jest.mock('~/state');
jest.mock('../deviceHooks/deviceHooks');

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseAudioOutputDevices = useAudioOutputDevices as jest.Mock<any>;

mockUseAppState.mockImplementation(() => ({ activeSinkId: '123' }));

const mockDevice = {
  deviceId: '123',
  label: 'mock device',
};

describe('the AudioOutputList component', () => {
  it('should display the name of the active output device if only one is available', () => {
    mockUseAudioOutputDevices.mockImplementation(() => [mockDevice]);
    render(<AudioOutputList />);
    expect(screen.queryByTestId('select-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('output-label').textContent).toBe('mock device');
  });

  it('should display "System Default Audio Output" when no audio output devices are available', () => {
    mockUseAudioOutputDevices.mockImplementation(() => []);
    render(<AudioOutputList />);
    expect(screen.queryByTestId('select-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('output-label').textContent).toBe('System Default Audio Output');
  });

  it('should display a Select menu when multiple audio output devices are available', () => {
    mockUseAudioOutputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    render(<AudioOutputList />);
    expect(screen.queryByTestId('select-menu')).toBeInTheDocument();
  });
});
