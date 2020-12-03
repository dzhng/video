import React from 'react';
import { screen, render, waitFor, within } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import { Formik, Form } from 'formik';
import EmailsField from './EmailsField';

const WrappedComponent = ({
  name,
  initialValues,
  onSubmit,
  ...otherProps
}: {
  name: string;
  initialValues: object;
  onSubmit?(): void;
  otherProps?: any;
}) => (
  <Formik initialValues={initialValues} onSubmit={onSubmit ?? (() => null)} validate={() => {}}>
    {({ values }) => (
      <Form>
        <EmailsField name={name} values={(values as any)[name]} {...otherProps} />
        <button data-testid="mock-submit" type="submit">
          Submit
        </button>
      </Form>
    )}
  </Formik>
);

describe('the EmailsField component', () => {
  it('should render correct values', () => {
    const initialValues = { name: ['test@test.com', 'test2@test.com'] };
    render(<WrappedComponent name="name" initialValues={initialValues} />);
    expect(screen.getAllByRole('textbox').map((e) => e.getAttribute('value'))).toEqual(
      expect.arrayContaining(initialValues.name),
    );
  });

  it('should submit with the correct name', async () => {
    const mockSubmit = jest.fn();
    const initialValues = { name: ['test@test.com', 'test2@test.com'] };

    render(<WrappedComponent name="name" initialValues={initialValues} onSubmit={mockSubmit} />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('mock-submit'));
    });

    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith(expect.objectContaining(initialValues), expect.anything());
  });

  describe('adding emails', () => {
    beforeEach(() => {
      const initialValues = { name: [] };
      render(<WrappedComponent name="name" initialValues={initialValues} />);
    });

    it('should allow users to add valid emails, and then clear inputs and refocuses', async () => {
      fireEvent.type(screen.getByTestId('email-input'), 'hello@world.com');

      await waitFor(() => {
        fireEvent.click(screen.getByTestId('add-button'));
      });

      expect(within(screen.getByTestId('email-item')).getByRole('textbox')).toHaveAttribute(
        'value',
        'hello@world.com',
      );

      const textbox = within(screen.getByTestId('email-input')).getByRole('textbox');
      expect(textbox).toHaveAttribute('value', '');
      expect(textbox).toEqual(document.activeElement);
    });

    it('should not allow invalid emails', async () => {
      fireEvent.type(screen.getByTestId('email-input'), 'hello2@world');

      await waitFor(() => {
        fireEvent.click(screen.getByTestId('add-button'));
      });

      expect(screen.queryByTestId('email-item')).not.toBeInTheDocument();
      expect(screen.getByTestId('email-error').textContent).toMatch(/valid email/i);
    });

    it('should allow submission via enter', () => {
      fireEvent.type(screen.getByTestId('email-input'), 'hello3@world.com{enter}');

      expect(within(screen.getByTestId('email-item')).getByRole('textbox')).toHaveAttribute(
        'value',
        'hello3@world.com',
      );
    });
  });
});
