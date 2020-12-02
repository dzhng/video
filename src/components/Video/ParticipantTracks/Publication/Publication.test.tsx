import React from 'react';
import { render } from '@testing-library/react';
import useTrack from '~/hooks/Video/useTrack/useTrack';
import VideoTrack from '~/components/Video/VideoTrack/VideoTrack';
import AudioTrack from './AudioTrack/AudioTrack';
import Publication from './Publication';

jest.mock('~/hooks/Video/useTrack/useTrack');
jest.mock('~/components/Video/VideoTrack/VideoTrack');
jest.mock('./AudioTrack/AudioTrack');

const mockUseTrack = useTrack as jest.Mock<any>;
const mockVideoTrack = VideoTrack as jest.Mock<any>;
const mockAudioTrack = AudioTrack as jest.Mock<any>;

mockVideoTrack.mockImplementation(() => null);
mockAudioTrack.mockImplementation(() => null);

describe('the Publication component', () => {
  describe('when track.kind is "video"', () => {
    it('should render a VideoTrack', () => {
      mockUseTrack.mockImplementation(() => ({ kind: 'video', name: 'camera-123456' }));
      render(
        <Publication
          isLocal
          publication={'mockPublication' as any}
          participant={'mockParticipant' as any}
        />,
      );
      expect(useTrack).toHaveBeenCalledWith('mockPublication');
      expect(mockVideoTrack).toBeCalledTimes(1);
    });

    it('should ignore the "isLocal" prop when track.name is not "camera"', () => {
      mockUseTrack.mockImplementation(() => ({ kind: 'video', name: 'screen-123456' }));
      render(
        <Publication
          isLocal
          publication={'mockPublication' as any}
          participant={'mockParticipant' as any}
        />,
      );
      expect(useTrack).toHaveBeenCalledWith('mockPublication');
      expect(mockVideoTrack).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          isLocal: false,
        }),
        expect.anything(),
      );
    });

    it('should use the "isLocal" prop when track.name is "camera"', () => {
      mockUseTrack.mockImplementation(() => ({ kind: 'video', name: 'camera-123456' }));
      render(
        <Publication
          isLocal
          publication={'mockPublication' as any}
          participant={'mockParticipant' as any}
        />,
      );
      expect(useTrack).toHaveBeenCalledWith('mockPublication');
      expect(mockVideoTrack).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          isLocal: true,
        }),
        expect.anything(),
      );
    });
  });

  describe('when track.kind is "audio"', () => {
    it('should render an AudioTrack', () => {
      mockUseTrack.mockImplementation(() => ({ kind: 'audio', name: '123456' }));
      render(
        <Publication
          isLocal
          publication={'mockPublication' as any}
          participant={'mockParticipant' as any}
        />,
      );
      expect(useTrack).toHaveBeenCalledWith('mockPublication');
      expect(mockAudioTrack).toBeCalledTimes(1);
    });

    it('should render null when disableAudio is true', () => {
      mockUseTrack.mockImplementation(() => ({ kind: 'audio' }));
      render(
        <Publication
          isLocal
          publication={'mockPublication' as any}
          participant={'mockParticipant' as any}
          disableAudio={true}
        />,
      );
      expect(useTrack).toHaveBeenCalledWith('mockPublication');
      expect(mockAudioTrack).toBeCalledTimes(0);
    });
  });

  it('should render null when there is no track', () => {
    mockUseTrack.mockImplementation(() => null);
    render(
      <Publication
        isLocal
        publication={'mockPublication' as any}
        participant={'mockParticipant' as any}
      />,
    );
    expect(useTrack).toHaveBeenCalledWith('mockPublication');
    expect(mockAudioTrack).toBeCalledTimes(0);
    expect(mockVideoTrack).toBeCalledTimes(0);
  });
});
