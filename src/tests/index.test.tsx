//import React from 'react';
import { useRouter } from 'next/router';

import { useAppState } from '~/state';
//import IndexPage from '~/pages/index';

jest.mock('next/router');
jest.mock('~/hooks/useRoomState/useRoomState');
jest.mock('~/hooks/useVideoContext/useVideoContext');
jest.mock('~/state');

const mockUseRouter = useRouter as jest.Mock<any>;
const mockUseAppState = useAppState as jest.Mock<any>;
const mockPush = jest.fn();

describe.skip('index page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppState.mockImplementation(() => ({ isAuthReady: true, user: {} }));
    mockUseRouter.mockImplementation(() => ({ push: mockPush }));
  });

  it('should display list of upcoming calls', () => {});

  it('should display list of customers', () => {});
});
