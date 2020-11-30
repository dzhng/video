import React from 'react';
import { screen, render } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import useParticipantIsReconnecting from '~/hooks/useParticipantIsReconnecting/useParticipantIsReconnecting';
import ParticipantConnectionIndicator from './ParticipantConnectionIndicator';

jest.mock('~/hooks/useParticipantIsReconnecting/useParticipantIsReconnecting');

const mockUseParticipantIsReconnecting = useParticipantIsReconnecting as jest.Mock<boolean>;

describe('the ParticipantConnectionIndicator component', () => {
  describe('when the participant is reconnecting', () => {
    beforeEach(() => mockUseParticipantIsReconnecting.mockImplementation(() => true));

    it('should render the correct toolip', async () => {
      render(<ParticipantConnectionIndicator participant={{} as any} />);
      fireEvent.hover(screen.getByTestId('indicator'));

      expect(await screen.findByRole('tooltip')).toBeInTheDocument();

      expect(screen.getByRole('tooltip').textContent).toBe('Participant is reconnecting');
    });

    it('should have isReconnecting css class', () => {
      render(<ParticipantConnectionIndicator participant={{} as any} />);
      expect(screen.getByTestId('indicator').className).toContain('isReconnecting');
    });
  });

  describe('when the participant is not reconnecting', () => {
    beforeEach(() => mockUseParticipantIsReconnecting.mockImplementation(() => false));

    it('should render the correct tooltip', async () => {
      render(<ParticipantConnectionIndicator participant={{} as any} />);
      fireEvent.hover(screen.getByTestId('indicator'));

      expect(await screen.findByRole('tooltip')).toBeInTheDocument();

      expect(screen.getByRole('tooltip').textContent).toBe('Participant is connected');
    });

    it('should not have isReconnecting css class', () => {
      render(<ParticipantConnectionIndicator participant={{} as any} />);
      expect(screen.getByTestId('indicator').classList).not.toContain('isReconnecting');
    });
  });
});
