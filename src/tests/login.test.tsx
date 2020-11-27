import React from 'react';
import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAppState } from '~/state';
import LoginPage from '~/pages/login';

jest.mock('next/router');
jest.mock('~/state');
jest.mock('#/google-logo.svg', () => () => null);

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseRouter = useRouter as jest.Mock<any>;
const mockReplace = jest.fn();

describe('login page', () => {
  beforeEach(() => {
    mockUseRouter.mockImplementation(() => ({ replace: mockReplace }));
  });

  describe('with auth enabled', () => {
    it('should redirect to "/" when there is a user ', () => {
      mockUseAppState.mockImplementation(() => ({
        user: {},
        signIn: () => Promise.resolve(),
        isAuthReady: true,
      }));
      render(<LoginPage />);
      expect(mockReplace).toHaveBeenCalledWith('/');
    });

    it('should render the login page when there is no user', () => {
      mockUseAppState.mockImplementation(() => ({
        user: null,
        signIn: () => Promise.resolve(),
        isAuthReady: true,
      }));
      const { getByText } = render(<LoginPage />);
      expect(mockReplace).not.toHaveBeenCalled();
      expect(getByText('Sign in with Google')).toBeTruthy();
    });

    it('should redirect the user to "/" after signIn when there is no previous location', (done) => {
      mockUseAppState.mockImplementation(() => ({
        user: null,
        signIn: () => Promise.resolve(),
        isAuthReady: true,
      }));
      const { getByText } = render(<LoginPage />);
      getByText('Sign in with Google').click();
      setImmediate(() => {
        expect(mockReplace).toHaveBeenCalledWith('/');
        done();
      });
    });

    it('should redirect the user to their previous location after signIn', (done) => {
      mockUseAppState.mockImplementation(() => ({
        user: null,
        signIn: () => Promise.resolve(),
        isAuthReady: true,
      }));
      const { getByText } = render(<LoginPage previousPage={'/room/test'} />);
      getByText('Sign in with Google').click();
      setImmediate(() => {
        expect(mockReplace).toHaveBeenCalledWith('/room/test');
        done();
      });
    });

    it('should not render anything when isAuthReady is false', () => {
      mockUseAppState.mockImplementation(() => ({
        user: null,
        signIn: () => Promise.resolve(),
        isAuthReady: false,
      }));
      const { container } = render(<LoginPage />);
      expect(mockReplace).not.toHaveBeenCalled();
      expect(container.children[0]).toBe(undefined);
    });
  });
});
