import React from 'react';
import { screen, render } from '@testing-library/react';
import useIsTrackSwitchedOff from '~/hooks/Call/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '~/hooks/Call/usePublications/usePublications';
import useTrack from '~/hooks/Call/useTrack/useTrack';
import MainParticipantInfo from './MainParticipantInfo';

jest.mock(
  '~/hooks/Call/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel',
  () => () => 4,
);
jest.mock('~/hooks/Call/usePublications/usePublications');
jest.mock('~/hooks/Call/useIsTrackSwitchedOff/useIsTrackSwitchedOff');
jest.mock('~/hooks/Call/useTrack/useTrack');

const mockUsePublications = usePublications as jest.Mock<any>;
const mockUseIsTrackSwitchedOff = useIsTrackSwitchedOff as jest.Mock<any>;
const mockUseTrack = useTrack as jest.Mock<any>;

describe('the MainParticipantInfo component', () => {
  it('should render a VideoCamOff icon when no camera tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    render(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </MainParticipantInfo>,
    );
    expect(screen.queryByTestId('camoff-icon')).toBeInTheDocument();
  });

  it('should not render a VideoCamOff icon when a camera track is published', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    render(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </MainParticipantInfo>,
    );
    expect(screen.queryByTestId('camoff-icon')).not.toBeInTheDocument();
  });

  it('should add isVideoSwitchedOff class to container div when video is switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => true);
    render(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </MainParticipantInfo>,
    );
    expect(screen.getByTestId('container').className).toContain('isVideoSwitchedOff');
  });

  it('should not add isVideoSwitchedOff class to container div when video is not switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    render(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </MainParticipantInfo>,
    );
    expect(screen.getByTestId('container').className).not.toContain('isVideoSwitchedOff');
  });

  it('should use the switchOff status of the screen share track when it is available', () => {
    mockUsePublications.mockImplementation(() => [
      { trackName: 'screen' },
      { trackName: 'camera-123456' },
    ]);
    render(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </MainParticipantInfo>,
    );
    expect(mockUseTrack).toHaveBeenCalledWith({ trackName: 'screen' });
  });

  it('should use the switchOff status of the camera track when the screen share track is not available', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    render(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </MainParticipantInfo>,
    );
    expect(mockUseTrack).toHaveBeenCalledWith({ trackName: 'camera-123456' });
  });
});
