import React from 'react';
import { render } from '@testing-library/react';
import usePublications from '~/hooks/usePublications/usePublications';
import useVideoContext from '~/hooks/useVideoContext/useVideoContext';
import Publication from './Publication/Publication';
import ParticipantTracks from './ParticipantTracks';

jest.mock('~/hooks/usePublications/usePublications', () =>
  jest.fn(() => [
    { trackSid: 0, kind: 'video', trackName: '' },
    { trackSid: 1, kind: 'audio', trackName: '' },
  ]),
);
jest.mock('../../hooks/useVideoContext/useVideoContext');
jest.mock('./Publication/Publication');

const mockUsePublications = usePublications as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockPublication = Publication as jest.Mock<any>;

mockPublication.mockImplementation(() => null);

describe('the ParticipantTracks component', () => {
  it('should render an array of publications', () => {
    mockUseVideoContext.mockImplementation(() => ({ room: {} }));
    render(<ParticipantTracks participant={'mockParticipant' as any} />);
    expect(usePublications).toHaveBeenCalledWith('mockParticipant');
    expect(mockPublication).toBeCalledTimes(2);
    expect(mockPublication).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        isLocal: false,
        publication: { trackSid: 0, kind: 'video', trackName: '' },
      }),
      expect.anything(),
    );
    expect(mockPublication).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        isLocal: false,
        publication: { trackSid: 1, kind: 'audio', trackName: '' },
      }),
      expect.anything(),
    );
  });

  it('should render publications with "isLocal" set to true when the localParticipant is provided', () => {
    mockUseVideoContext.mockImplementation(() => ({
      room: { localParticipant: 'mockParticipant' },
    }));
    render(<ParticipantTracks participant={'mockParticipant' as any} />);
    expect(mockPublication).toBeCalledTimes(2);
    expect(mockPublication).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ isLocal: true }),
      expect.anything(),
    );
    expect(mockPublication).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ isLocal: true }),
      expect.anything(),
    );
  });

  it('should filter out any screen share publications', () => {
    mockUseVideoContext.mockImplementation(() => ({ room: {} }));
    mockUsePublications.mockImplementation(() => [
      { trackName: 'screen', trackSid: 0, kind: 'video' },
      { trackName: 'camera-123456', trackSid: 1, kind: 'video' },
    ]);
    render(<ParticipantTracks participant={'mockParticipant' as any} />);
    expect(mockPublication).toBeCalledTimes(1);
    expect(mockPublication).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        publication: {
          trackName: 'camera-123456',
          trackSid: 1,
          kind: 'video',
        },
      }),
      expect.anything(),
    );
  });

  describe('with enableScreenShare prop', () => {
    it('should filter out camera publications when a screen share publication is present', () => {
      mockUseVideoContext.mockImplementation(() => ({ room: {} }));
      mockUsePublications.mockImplementation(() => [
        { trackName: 'screen', trackSid: 0, kind: 'video' },
        { trackName: 'camera-123456', trackSid: 1, kind: 'video' },
      ]);
      render(<ParticipantTracks participant={'mockParticipant' as any} enableScreenShare />);
      expect(mockPublication).toBeCalledTimes(1);
      expect(mockPublication).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          publication: {
            trackName: 'screen',
            trackSid: 0,
            kind: 'video',
          },
        }),
        expect.anything(),
      );
    });

    it('should render camera publications when a screen share publication is absent', () => {
      mockUseVideoContext.mockImplementation(() => ({ room: {} }));
      mockUsePublications.mockImplementation(() => [
        { trackName: 'camera-123456', trackSid: 1, kind: 'video' },
      ]);
      render(<ParticipantTracks participant={'mockParticipant' as any} enableScreenShare />);
      expect(mockPublication).toBeCalledTimes(1);
      expect(mockPublication).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          publication: {
            trackName: 'camera-123456',
            trackSid: 1,
            kind: 'video',
          },
        }),
        expect.anything(),
      );
    });
  });
});
