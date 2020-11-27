import React from 'react';
import Video from 'twilio-video';
import { screen, render } from '@testing-library/react';

import UnsupportedBrowserWarning from './UnsupportedBrowserWarning';

const IsSupported = () => <span data-testid="is-supported">Is supported</span>;

describe('the UnsupportedBrowserWarning component', () => {
  it('should render correctly when isSupported is false', () => {
    // @ts-ignore
    Video.isSupported = false;
    render(
      <UnsupportedBrowserWarning>
        <IsSupported />
      </UnsupportedBrowserWarning>,
    );
    expect(screen.queryByTestId('is-supported')).not.toBeInTheDocument();
    expect(screen.queryByTestId('container')).toBeInTheDocument();
  });

  it('should render children when isSupported is true', () => {
    // @ts-ignore
    Video.isSupported = true;
    render(
      <UnsupportedBrowserWarning>
        <IsSupported />
      </UnsupportedBrowserWarning>,
    );
    expect(screen.queryByTestId('is-supported')).toBeInTheDocument();
  });
});
