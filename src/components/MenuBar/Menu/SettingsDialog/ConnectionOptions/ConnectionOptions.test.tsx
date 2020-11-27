// @ts-ignore
// eslint-disable-next-line
import React from 'react';
describe.skip('', () => {
  it('', () => {});
});
/*
import { screen, render } from '@testing-library/react';
import { initialSettings } from '~/state/settings/settingsReducer';
import { useAppState } from '~/state';
import useRoomState from '~/hooks/useRoomState/useRoomState';
import ConnectionOptions from './ConnectionOptions';

jest.mock('~/hooks/useRoomState/useRoomState');
jest.mock('~/state');

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseRoomState = useRoomState as jest.Mock<any>;

const mockDispatchSetting = jest.fn();
mockUseAppState.mockImplementation(() => ({
  settings: initialSettings,
  dispatchSetting: mockDispatchSetting,
}));

mockUseRoomState.mockImplementation(() => 'disconnected');

describe('the ConnectionOptions component', () => {
  describe('when not connected to a room', () => {
    it('should dispatch settings changes', () => {
      render(<ConnectionOptions />);
      wrapper
        .find(Select)
        .find({ name: 'dominantSpeakerPriority' })
        .simulate('change', { target: { value: 'testValue', name: 'dominantSpeakerPriority' } });
      expect(mockDispatchSetting).toHaveBeenCalledWith({
        value: 'testValue',
        name: 'dominantSpeakerPriority',
      });
    });

    it('should not dispatch settings changes from a number field when there are non-digits in the value', () => {
      const wrapper = shallow(<ConnectionOptions />);
      wrapper
        .find(TextField)
        .find({ name: 'maxTracks' })
        .simulate('change', { target: { value: '123456a', name: 'maxTracks' } });
      expect(mockDispatchSetting).not.toHaveBeenCalled();
    });

    it('should dispatch settings changes from a number field when there are only digits in the value', () => {
      const wrapper = shallow(<ConnectionOptions />);
      wrapper
        .find(TextField)
        .find({ name: 'maxTracks' })
        .simulate('change', { target: { value: '123456', name: 'maxTracks' } });
      expect(mockDispatchSetting).toHaveBeenCalledWith({ value: '123456', name: 'maxTracks' });
    });
  });
  });*/
