import React from 'react';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import useParticipantIsReconnecting from '~/hooks/useParticipantIsReconnecting/useParticipantIsReconnecting';
import ParticipantConnectionIndicator from './ParticipantConnectionIndicator';

jest.mock('~/hooks/useParticipantIsReconnecting/useParticipantIsReconnecting');

const mockUseParticipantIsReconnecting = useParticipantIsReconnecting as jest.Mock<boolean>;

describe('the ParticipantConnectionIndicator component', () => {
  describe('when the participant is reconnecting', () => {
    beforeEach(() => mockUseParticipantIsReconnecting.mockImplementation(() => true));

    it('should render the correct toolip', async () => {
      render(<ParticipantConnectionIndicator participant={{} as any} />);
      fireEvent.mouseOver(screen.getByTestId('indicator'));

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

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
      fireEvent.mouseOver(screen.getByTestId('indicator'));

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      expect(screen.getByRole('tooltip').textContent).toBe('Participant is connected');
    });

    it('should not have isReconnecting css class', () => {
      render(<ParticipantConnectionIndicator participant={{} as any} />);
      expect(screen.getByTestId('indicator').classList).not.toContain('isReconnecting');
    });
  });
});
