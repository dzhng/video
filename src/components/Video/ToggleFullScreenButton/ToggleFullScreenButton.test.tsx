import React from 'react';
import { screen, render } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import useFullScreenToggle from '~/hooks/Video/useFullScreenToggle/useFullScreenToggle';

import ToggleFullscreenButton from './ToggleFullScreenButton';

jest.mock('~/hooks/Video/useFullScreenToggle/useFullScreenToggle');
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
    expect(screen.queryByTestId('disable-icon')).toBeInTheDocument();
  });

  it('should render FullscreenIcon when the page is not in full screen mode', () => {
    mockeduseFullScreenToggle.mockImplementation(() => [false, toggleFullScreen]);
    render(<ToggleFullscreenButton />);
    expect(screen.queryByTestId('enable-icon')).toBeInTheDocument();
  });

  it('should not render when Fullscreen API is not supported', () => {
    // @ts-ignore
    document.fullscreenEnabled = false;
    render(<ToggleFullscreenButton />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    // @ts-ignore
    document.fullscreenEnabled = true; // Reset value
  });
});
