import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import useFullScreenToggle from '~/hooks/useFullScreenToggle/useFullScreenToggle';

import ToggleFullscreenButton from './ToggleFullScreenButton';

jest.mock('~/hooks/useFullScreenToggle/useFullScreenToggle');
const mockeduseFullScreenToggle = useFullScreenToggle as jest.Mock;

describe('Full screen button', () => {
  const toggleFullScreen = jest.fn();

  it('should call toggleFullScreen when Toggle FullScreen button is clicked', () => {
    mockeduseFullScreenToggle.mockImplementation(() => [false, toggleFullScreen]);
    render(<ToggleFullscreenButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(toggleFullScreen).toHaveBeenCalled();
  });

  it('should render FullscreenExitIcon when the page is in full screen mode', () => {
    mockeduseFullScreenToggle.mockImplementation(() => [true, toggleFullScreen]);
    render(<ToggleFullscreenButton />);
    expect(screen.queryByTestId('disable-icon')).toBeTruthy();
  });

  it('should render FullscreenIcon when the page is not in full screen mode', () => {
    mockeduseFullScreenToggle.mockImplementation(() => [false, toggleFullScreen]);
    render(<ToggleFullscreenButton />);
    expect(screen.queryByTestId('enable-icon')).toBeTruthy();
  });

  it('should not render when Fullscreen API is not supported', () => {
    // @ts-ignore
    document.fullscreenEnabled = false;
    render(<ToggleFullscreenButton />);
    expect(screen.queryByRole('button')).toBeNull();
    // @ts-ignore
    document.fullscreenEnabled = true; // Reset value
  });
});
