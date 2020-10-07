import React from 'react';
import AboutDialog from './AboutDialog';
import { render } from '@testing-library/react';

jest.mock('twilio-video', () => ({ version: '1.2', isSupported: true }));

describe('the AboutDialog component', () => {
  it('should display Video.isSupported', () => {
    const { getByText } = render(<AboutDialog open={true} onClose={() => {}} />);
    expect(getByText('Browser supported: true')).toBeTruthy();
  });

  it('should display the SDK version', () => {
    const { getByText } = render(<AboutDialog open={true} onClose={() => {}} />);
    expect(getByText('SDK Version: 1.2')).toBeTruthy();
  });
});
