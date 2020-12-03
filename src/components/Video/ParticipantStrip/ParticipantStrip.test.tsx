import React from 'react';
import { EventEmitter } from 'events';
import { render } from '@testing-library/react';
import useSelectedParticipant from '~/components/Video/VideoProvider/useSelectedParticipant/useSelectedParticipant';
import Participant from '~/components/Video/Participant/Participant';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import ParticipantStrip from './ParticipantStrip';

jest.mock('~/hooks/Video/useVideoContext/useVideoContext');
jest.mock('~/components/Video/VideoProvider/useSelectedParticipant/useSelectedParticipant');
jest.mock('~/components/Video/Participant/Participant');
const mockedVideoContext = useVideoContext as jest.Mock<any>;
const mockUseSelectedParticipant = useSelectedParticipant as jest.Mock<any>;
const mockParticipant = Participant as jest.Mock<any>;

mockParticipant.mockImplementation(() => null);
mockUseSelectedParticipant.mockImplementation(() => [null, () => {}]);

describe('the ParticipantStrip component', () => {
  it('should correctly render ParticipantInfo components', () => {
    const mockRoom: any = new EventEmitter();
    mockRoom.participants = new Map([
      [0, { sid: 0 }],
      [1, { sid: 1 }],
    ]);
    mockRoom.localParticipant = 'localParticipant';
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    render(<ParticipantStrip />);
    expect(mockParticipant).toBeCalledTimes(3);
    expect(mockParticipant).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ isSelected: false, participant: 'localParticipant' }),
      expect.anything(),
    );
    expect(mockParticipant).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ isSelected: false, participant: { sid: 0 } }),
      expect.anything(),
    );
    expect(mockParticipant).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ isSelected: false, participant: { sid: 1 } }),
      expect.anything(),
    );
  });

  it('should add the isSelected prop to the local participant when it is selected', () => {
    mockUseSelectedParticipant.mockImplementation(() => ['localParticipant', () => {}]);
    const mockRoom: any = new EventEmitter();
    mockRoom.participants = new Map([
      [0, { sid: 0 }],
      [1, { sid: 1 }],
    ]);
    mockRoom.localParticipant = 'localParticipant';
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    render(<ParticipantStrip />);
    expect(mockParticipant).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ isSelected: true, participant: 'localParticipant' }),
      expect.anything(),
    );
  });

  it('should add the isSelected prop to the first remote participant when it is selected', () => {
    const newParticipant = { sid: 0 };
    mockUseSelectedParticipant.mockImplementation(() => [newParticipant, () => {}]);
    const mockRoom: any = new EventEmitter();
    mockRoom.participants = new Map([
      [0, newParticipant],
      [1, { sid: 1 }],
    ]);
    mockRoom.localParticipant = 'localParticipant';
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    render(<ParticipantStrip />);
    expect(mockParticipant).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ isSelected: true, participant: newParticipant }),
      expect.anything(),
    );
  });
});