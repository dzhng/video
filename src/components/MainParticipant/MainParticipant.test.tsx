import React from 'react';
import { shallow } from 'enzyme';
import useMainSpeaker from '~/hooks/useMainSpeaker/useMainSpeaker';
import useScreenShareParticipant from '~/hooks/useScreenShareParticipant/useScreenShareParticipant';
import ParticipantTracks from '~/components/ParticipantTracks/ParticipantTracks';
import useSelectedParticipant from '~/components/VideoProvider/useSelectedParticipant/useSelectedParticipant';
import MainParticipant from './MainParticipant';

jest.mock('~/components/VideoProvider/useSelectedParticipant/useSelectedParticipant');
jest.mock('~/hooks/useMainSpeaker/useMainSpeaker');
jest.mock('~/hooks/useScreenShareParticipant/useScreenShareParticipant');

const mockUseMainSpeaker = useMainSpeaker as jest.Mock<any>;
const mockUseSelectedParticipant = useSelectedParticipant as jest.Mock<any>;
const mockUseScreenShareParticipant = useScreenShareParticipant as jest.Mock<any>;

describe('the MainParticipant component', () => {
  it('should set the videoPriority to high when the main participant is the selected participant', () => {
    const mockParticipant = {};
    mockUseMainSpeaker.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [mockParticipant]);
    mockUseScreenShareParticipant.mockImplementationOnce(() => ({}));
    const wrapper = shallow(<MainParticipant />);
    expect(wrapper.find(ParticipantTracks).prop('videoPriority')).toBe('high');
  });

  it('should set the videoPriority to high when the main participant is sharing their screen', () => {
    const mockParticipant = {};
    mockUseMainSpeaker.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [{}]);
    mockUseScreenShareParticipant.mockImplementationOnce(() => mockParticipant);
    const wrapper = shallow(<MainParticipant />);
    expect(wrapper.find(ParticipantTracks).prop('videoPriority')).toBe('high');
  });

  it('should set the videoPriority to null when the main participant is not the selected participant and they are not sharing their screen', () => {
    const mockParticipant = {};
    mockUseMainSpeaker.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [{}]);
    mockUseScreenShareParticipant.mockImplementationOnce(() => ({}));
    const wrapper = shallow(<MainParticipant />);
    expect(wrapper.find(ParticipantTracks).prop('videoPriority')).toBe(null);
  });
});
