import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

describe('Card', () => {
  describe('Card Component', () => {
    it('should render with default props', () => {
      render(<Card>Card Content</Card>);
      const card = screen.getByText('Card Content');
      expect(card).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Card className="custom-class">Card</Card>);
      const card = screen.getByText('Card');
      expect(card).toHaveClass('custom-class');
    });

    it('should have data-slot attribute', () => {
      render(<Card>Card</Card>);
      const card = screen.getByText('Card');
      expect(card).toHaveAttribute('data-slot', 'card');
    });

    it('should render as div', () => {
      render(<Card>Card</Card>);
      const card = screen.getByText('Card');
      expect(card.tagName).toBe('DIV');
    });
  });

  describe('CardHeader', () => {
    it('should render with default props', () => {
      render(<CardHeader>Header Content</CardHeader>);
      const header = screen.getByText('Header Content');
      expect(header).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      render(<CardHeader>Header</CardHeader>);
      const header = screen.getByText('Header');
      expect(header).toHaveAttribute('data-slot', 'card-header');
    });

    it('should render with custom className', () => {
      render(<CardHeader className="custom-header">Header</CardHeader>);
      const header = screen.getByText('Header');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('CardTitle', () => {
    it('should render with default props', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title).toHaveAttribute('data-slot', 'card-title');
    });

    it('should render with custom className', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('CardDescription', () => {
    it('should render with default props', () => {
      render(<CardDescription>Description</CardDescription>);
      const description = screen.getByText('Description');
      expect(description).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      render(<CardDescription>Description</CardDescription>);
      const description = screen.getByText('Description');
      expect(description).toHaveAttribute('data-slot', 'card-description');
    });

    it('should have muted text class', () => {
      render(<CardDescription>Description</CardDescription>);
      const description = screen.getByText('Description');
      expect(description).toHaveClass('text-muted-foreground');
    });
  });

  describe('CardAction', () => {
    it('should render with default props', () => {
      render(<CardAction>Action</CardAction>);
      const action = screen.getByText('Action');
      expect(action).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      render(<CardAction>Action</CardAction>);
      const action = screen.getByText('Action');
      expect(action).toHaveAttribute('data-slot', 'card-action');
    });
  });

  describe('CardContent', () => {
    it('should render with default props', () => {
      render(<CardContent>Content</CardContent>);
      const content = screen.getByText('Content');
      expect(content).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      render(<CardContent>Content</CardContent>);
      const content = screen.getByText('Content');
      expect(content).toHaveAttribute('data-slot', 'card-content');
    });

    it('should have padding class', () => {
      render(<CardContent>Content</CardContent>);
      const content = screen.getByText('Content');
      expect(content).toHaveClass('px-6');
    });
  });

  describe('CardFooter', () => {
    it('should render with default props', () => {
      render(<CardFooter>Footer</CardFooter>);
      const footer = screen.getByText('Footer');
      expect(footer).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      render(<CardFooter>Footer</CardFooter>);
      const footer = screen.getByText('Footer');
      expect(footer).toHaveAttribute('data-slot', 'card-footer');
    });

    it('should render with custom className', () => {
      render(<CardFooter className="custom-footer">Footer</CardFooter>);
      const footer = screen.getByText('Footer');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('Full Card Composition', () => {
    it('should render a complete card', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description text</CardDescription>
            <CardAction>
              <button>Action</button>
            </CardAction>
          </CardHeader>
          <CardContent>Main content here</CardContent>
          <CardFooter>Footer content</CardFooter>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card description text')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Action' })
      ).toBeInTheDocument();
      expect(screen.getByText('Main content here')).toBeInTheDocument();
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });
  });
});
