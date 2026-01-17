import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

describe('Tabs', () => {
  const user = userEvent.setup();

  describe('Tabs Container', () => {
    it('should render with default props', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      render(
        <Tabs defaultValue="tab1" data-testid="tabs">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      expect(screen.getByTestId('tabs')).toHaveAttribute('data-slot', 'tabs');
    });
  });

  describe('TabsTrigger', () => {
    it('should render tab trigger', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    });

    it('should handle click to switch tabs', async () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      // Check initial active tab content
      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Click second tab
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      await user.click(tab2);

      // Now second tab content should be there
      await waitFor(() => {
        expect(screen.getByText('Content 2')).toBeInTheDocument();
      });
    });
  });

  describe('TabsContent', () => {
    it('should have data-slot attribute', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" data-testid="content">
            Content
          </TabsContent>
        </Tabs>
      );
      expect(screen.getByTestId('content')).toHaveAttribute(
        'data-slot',
        'tabs-content'
      );
    });
  });

  describe('Full Tabs Composition', () => {
    it('should switch between tabs correctly', async () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">First tab content</TabsContent>
          <TabsContent value="tab2">Second tab content</TabsContent>
        </Tabs>
      );

      // Initial state
      expect(screen.getByText('First tab content')).toBeInTheDocument();

      // Switch to tab2
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      await user.click(tab2);

      await waitFor(() => {
        expect(screen.getByText('Second tab content')).toBeInTheDocument();
      });
    });
  });
});
