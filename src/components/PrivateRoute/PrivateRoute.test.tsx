import React from 'react';
import { mount } from 'enzyme';
import { useRouter } from 'next/router';
import { useAppState } from '~/state';
import PrivateRoute from './PrivateRoute';

jest.mock('next/router');
jest.mock('~/state');

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseRouter = useRouter as jest.Mock<any>;
const MockComponent = () => <h1>test</h1>;

const mockPush = jest.fn();
mockUseRouter.mockImplementation(() => ({ push: mockPush }));

describe('the PrivateRoute component', () => {
  describe('with auth enabled', () => {
    describe('when isAuthReady is true', () => {
      it('should redirect to /login when there is no user', () => {
        mockUseAppState.mockImplementation(() => ({ user: false, isAuthReady: true }));
        const wrapper = mount(
          <PrivateRoute>
            <MockComponent />
          </PrivateRoute>,
        );
        expect(mockPush).toHaveBeenCalledWith('/login');
        expect(wrapper.exists(MockComponent)).toBe(false);
      });

      it('should render children when there is a user', () => {
        mockUseAppState.mockImplementation(() => ({ user: {}, isAuthReady: true }));
        const wrapper = mount(
          <PrivateRoute>
            <MockComponent />
          </PrivateRoute>,
        );
        expect(wrapper.exists(MockComponent)).toBe(true);
      });
    });

    describe('when isAuthReady is false', () => {
      it('should not render children', () => {
        mockUseAppState.mockImplementation(() => ({ user: false, isAuthReady: false }));
        const wrapper = mount(
          <PrivateRoute>
            <MockComponent />
          </PrivateRoute>,
        );
        expect(wrapper.exists(MockComponent)).toBe(false);
      });
    });
  });
});
