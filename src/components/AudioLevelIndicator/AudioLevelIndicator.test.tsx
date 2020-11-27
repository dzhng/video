import React from 'react';
import { screen, render } from '@testing-library/react';
import useIsTrackEnabled from '~/hooks/useIsTrackEnabled/useIsTrackEnabled';
import AudioLevelIndicator from './AudioLevelIndicator';

jest.mock('~/hooks/useIsTrackEnabled/useIsTrackEnabled');

const mockUseIsTrackEnabled = useIsTrackEnabled as jest.Mock<boolean>;

describe('the AudioLevelIndicator component', () => {
  it('should render a MicOff icon when the audioTrack is not enabled', () => {
    mockUseIsTrackEnabled.mockImplementationOnce(() => false);
    render(<AudioLevelIndicator />);
    expect(screen.queryByTestId('micoff-icon')).toBeInTheDocument();
  });

  it('should not render a MicOff icon when the audioTrack is enabled', () => {
    mockUseIsTrackEnabled.mockImplementationOnce(() => true);
    render(<AudioLevelIndicator />);
    expect(screen.queryByTestId('micoff-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('svg')).toBeInTheDocument();
  });

  it('should change the size of the indicator when the size prop is used', () => {
    mockUseIsTrackEnabled.mockImplementationOnce(() => true);
    render(<AudioLevelIndicator size={35} />);
    const svg = screen.getByTestId('svg');
    expect(svg).toHaveAttribute('width', '35px');
    expect(svg).toHaveAttribute('height', '35px');
  });

  it('should change the background of the indicator when background prop is used', () => {
    mockUseIsTrackEnabled.mockImplementationOnce(() => true);
    render(<AudioLevelIndicator background="#123456" />);
    const svg = screen.getByTestId('background');
    expect(svg).toHaveAttribute('fill', '#123456');
  });
});
