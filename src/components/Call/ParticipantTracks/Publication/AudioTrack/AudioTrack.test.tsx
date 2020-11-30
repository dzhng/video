import React from 'react';
import { render } from '@testing-library/react';
import useActiveSinkId from '~/hooks/Call/useActiveSinkId/useActiveSinkId';
import AudioTrack from './AudioTrack';

const audioEl = document.createElement('audio');
audioEl.setSinkId = jest.fn();

const mockTrack = { attach: jest.fn(() => audioEl), detach: jest.fn(() => [audioEl]) } as any;

jest.mock('~/hooks/Call/useActiveSinkId/useActiveSinkId');
const mockUseActiveSinkId = useActiveSinkId as jest.Mock<any>;

mockUseActiveSinkId.mockImplementation(() => ({ activeSinkId: '' }));

describe('the AudioTrack component', () => {
  it('should add an audio element to the DOM when the component mounts', () => {
    render(<AudioTrack track={mockTrack} />);
    expect(mockTrack.attach).toHaveBeenCalled();
    expect(mockTrack.detach).not.toHaveBeenCalled();
    expect(document.querySelector('audio')).toBe(audioEl);
    expect(audioEl.setSinkId).not.toHaveBeenCalledWith('mock-sink-id');
  });

  it('should remove the audio element from the DOM when the component unmounts', () => {
    const { unmount } = render(<AudioTrack track={mockTrack} />);
    unmount();
    expect(mockTrack.detach).toHaveBeenCalled();
    expect(document.querySelector('audio')).toBe(null);
  });

  describe('with an activeSinkId', () => {
    it('should set the sinkId when the component mounts', () => {
      mockUseActiveSinkId.mockImplementationOnce(() => ({ activeSinkId: 'mock-sink-id' }));
      render(<AudioTrack track={mockTrack} />);
      expect(audioEl.setSinkId).toHaveBeenCalledWith('mock-sink-id');
    });
  });
});
