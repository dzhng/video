import React from 'react';
import { screen, render } from '@testing-library/react';
import usePublications from '~/hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '~/hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useParticipantIsReconnecting from '~/hooks/useParticipantIsReconnecting/useParticipantIsReconnecting';
import NetworkQualityLevel from '~/components/NetworkQualityLevel/NetworkQualityLevel';
import ParticipantConnectionIndicator from './ParticipantConnectionIndicator/ParticipantConnectionIndicator';
import ParticipantInfo from './ParticipantInfo';

jest.mock('~/hooks/usePublications/usePublications');
jest.mock('~/hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff');
jest.mock('~/hooks/useTrack/useTrack');
jest.mock('~/hooks/useParticipantIsReconnecting/useParticipantIsReconnecting');
jest.mock('~/components/NetworkQualityLevel/NetworkQualityLevel');
jest.mock('./ParticipantConnectionIndicator/ParticipantConnectionIndicator');

const mockUsePublications = usePublications as jest.Mock<any>;
const mockUseIsTrackSwitchedOff = useIsTrackSwitchedOff as jest.Mock<any>;
const mockParticipantConnectionIndicator = ParticipantConnectionIndicator as jest.Mock<any>;
const mockUseParticipantIsReconnecting = useParticipantIsReconnecting as jest.Mock<boolean>;
const mockNetworkQualityLevel = NetworkQualityLevel as jest.Mock<any>;

mockParticipantConnectionIndicator.mockImplementation(() => null);
mockNetworkQualityLevel.mockImplementation(() => null);

describe('the ParticipantInfo component', () => {
  it('should display connection indicator with the correct participant', () => {
    const participant = { identity: 'mockIdentity' };
    mockUsePublications.mockImplementation(() => []);
    render(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={participant as any}>
        mock children
      </ParticipantInfo>,
    );
    expect(mockParticipantConnectionIndicator).toBeCalledWith(
      expect.objectContaining({ participant }),
      expect.anything(),
    );
  });

  it('should display network quality level indicator with the correct participant', () => {
    const participant = { identity: 'mockIdentity' };
    mockUsePublications.mockImplementation(() => []);
    render(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={participant as any}>
        mock children
      </ParticipantInfo>,
    );
    expect(mockNetworkQualityLevel).toBeCalledWith(
      expect.objectContaining({ participant }),
      expect.anything(),
    );
  });

  it('should display ScreenShare icon when participant has published a screen share track', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'screen' }]);
    render(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>,
    );
    expect(screen.queryByTestId('screenshare-icon')).toBeInTheDocument();
  });

  it('should not display ScreenShare icon when participant has not published a screen share track', () => {
    mockUsePublications.mockImplementation(() => []);
    render(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>,
    );
    expect(screen.queryByTestId('screenshare-icon')).not.toBeInTheDocument();
  });

  it('should add hideVideoProp to InfoContainer component when no video tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    render(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>,
    );
    expect(screen.getByTestId('info-container').className).toContain('hideVideo');
  });

  it('should not add hideVideoProp to InfoContainer component when a video track is published', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    render(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>,
    );
    expect(screen.getByTestId('info-container').className).not.toContain('hideVideo');
  });

  it('should render a VideoCamOff icon when no video tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    render(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>,
    );
    expect(screen.queryByTestId('camoff-icon')).toBeInTheDocument();
  });

  it('should not render a VideoCamOff icon when a video track is published', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    render(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>,
    );
    expect(screen.queryByTestId('camoff-icon')).not.toBeInTheDocument();
  });

  it('should render the reconnecting UI when the user is reconnecting', () => {
    mockUseParticipantIsReconnecting.mockImplementationOnce(() => true);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    render(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>,
    );
    expect(screen.queryByTestId('reconnecting')).toBeInTheDocument();
  });

  it('should add isSwitchedOff class to Container component when video is switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => true);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    render(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>,
    );
    expect(screen.getByTestId('container').className).toContain('isVideoSwitchedOff');
  });

  it('should not add isSwitchedOff class to Container component when video is not switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    render(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>,
    );
    expect(screen.getByTestId('container').className).not.toContain('isVideoSwitchedOff');
  });

  it('should render the PinIcon component when the participant is selected', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    render(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={true}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>,
    );
    expect(screen.queryByTestId('pin-icon')).toBeInTheDocument();
  });

  it('should not render the PinIcon component when the participant is not selected', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    render(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>,
    );
    expect(screen.queryByTestId('pin-icon')).not.toBeInTheDocument();
  });
});
