import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
} from '@/components/ui/field';

describe('Field', () => {
  it('renders field label and description', () => {
    render(
      <Field>
        <FieldLabel>Username</FieldLabel>
        <FieldDescription>Enter your username</FieldDescription>
      </Field>
    );
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Enter your username')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    const errors = [{ message: 'Username is required' }];
    render(
      <Field>
        <FieldError errors={errors} />
      </Field>
    );
    expect(screen.getByText('Username is required')).toBeInTheDocument();
  });

  it('does not render error if none provided', () => {
    render(
      <Field>
        <FieldError errors={[]} />
      </Field>
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders field group with legend', () => {
    render(
      <FieldGroup>
        <FieldLegend>Personal Info</FieldLegend>
        <Field>
          <FieldLabel>Name</FieldLabel>
        </Field>
      </FieldGroup>
    );
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });
});
