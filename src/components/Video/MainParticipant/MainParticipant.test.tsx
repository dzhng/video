import React from 'react';
import { render } from '@testing-library/react';
import useMainParticipant from '~/hooks/Video/useMainParticipant/useMainParticipant';
import useScreenShareParticipant from '~/hooks/Video/useScreenShareParticipant/useScreenShareParticipant';
import ParticipantTracks from '~/components/Video/ParticipantTracks/ParticipantTracks';
import useSelectedParticipant from '~/components/Video/VideoProvider/useSelectedParticipant/useSelectedParticipant';
import MainParticipantInfo from './MainParticipantInfo/MainParticipantInfo';
import MainParticipant from './MainParticipant';

jest.mock('~/components/Video/VideoProvider/useSelectedParticipant/useSelectedParticipant');
jest.mock('~/hooks/Video/useMainParticipant/useMainParticipant');
jest.mock('~/hooks/Video/useScreenShareParticipant/useScreenShareParticipant');
jest.mock('~/components/Video/ParticipantTracks/ParticipantTracks');
jest.mock('./MainParticipantInfo/MainParticipantInfo');

const mockUseMainParticipant = useMainParticipant as jest.Mock<any>;
const mockUseSelectedParticipant = useSelectedParticipant as jest.Mock<any>;
const mockUseScreenShareParticipant = useScreenShareParticipant as jest.Mock<any>;
const mockParticipantTracks = ParticipantTracks as jest.Mock<any>;
const mockMainParticipantInfo = MainParticipantInfo as jest.Mock<any>;

mockParticipantTracks.mockImplementation(() => null);
mockMainParticipantInfo.mockImplementation(({ children }) => children);

describe('the MainParticipant component', () => {
  it('should show main participant info with correct data', () => {
    const mockParticipant = {};
    mockUseMainParticipant.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [mockParticipant]);
    mockUseScreenShareParticipant.mockImplementationOnce(() => ({}));
    render(<MainParticipant />);
    expect(mockMainParticipantInfo).toBeCalledWith(
      expect.objectContaining({ participant: mockParticipant }),
      expect.anything(),
    );
  });

  it('should set the videoPriority to high when the main participant is the selected participant', () => {
    const mockParticipant = {};
    mockUseMainParticipant.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [mockParticipant]);
    mockUseScreenShareParticipant.mockImplementationOnce(() => ({}));
    render(<MainParticipant />);
    expect(mockParticipantTracks).toBeCalledWith(
      expect.objectContaining({ participant: mockParticipant, videoPriority: 'high' }),
      expect.anything(),
    );
  });

  it('should set the videoPriority to high when the main participant is sharing their screen', () => {
    const mockParticipant = {};
    mockUseMainParticipant.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [{}]);
    mockUseScreenShareParticipant.mockImplementationOnce(() => mockParticipant);
    render(<MainParticipant />);
    expect(mockParticipantTracks).toBeCalledWith(
      expect.objectContaining({ participant: mockParticipant, videoPriority: 'high' }),
      expect.anything(),
    );
  });

  it('should set the videoPriority to null when the main participant is not the selected participant and they are not sharing their screen', () => {
    const mockParticipant = {};
    mockUseMainParticipant.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [{}]);
    mockUseScreenShareParticipant.mockImplementationOnce(() => ({}));
    render(<MainParticipant />);
    expect(mockParticipantTracks).toBeCalledWith(
      expect.objectContaining({ participant: mockParticipant, videoPriority: null }),
      expect.anything(),
    );
  });
});
