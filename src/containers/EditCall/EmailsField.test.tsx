import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
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
});
