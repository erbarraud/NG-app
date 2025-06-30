# Neural Grader Dashboard Codebase Documentation

## Overview

The Neural Grader Dashboard is a web application for monitoring and managing the grading of wooden boards. This document provides an overview of the codebase structure, key components, and best practices.

## Directory Structure

- `/app`: Next.js App Router pages and layouts
- `/components`: React components
  - `/ui`: Reusable UI components
  - `/line-check`: Components specific to the line check feature
  - `/claims`: Components specific to the claims feature
- `/contexts`: React context providers
- `/data`: Sample data and data utilities
- `/hooks`: Custom React hooks
- `/lib`: Utility functions and constants
- `/public`: Static assets
- `/types`: TypeScript type definitions

## Key Components

### UI Components

- `dashboard-shell.tsx`: Main layout component for the dashboard
- `board-card-compact.tsx`: Reusable card for displaying board information
- `status-badge.tsx`: Badge component for displaying status information
- `info-tooltip.tsx`: Component for displaying informational tooltips
- `data-table.tsx`: Reusable data table with sorting, filtering, and pagination
- `loading-spinner.tsx`: Loading indicator component
- `error-message.tsx`: Error message component
- `empty-state.tsx`: Component for displaying empty states

### Feature Components

- `line-check-live-view.tsx`: Real-time view of boards being scanned
- `board-detail-view.tsx`: Detailed view of a single board
- `board-magnifier.tsx`: Component for zooming in on board images
- `board-defect-markers.tsx`: Component for displaying defect markers on board images

## Utilities

- `constants.ts`: Application-wide constants
- `data-utils.ts`: Utility functions for data manipulation
- `utils.ts`: General utility functions
- `preview-utils.ts`: Utilities for preview environments

## Best Practices

### Component Structure

1. **Separation of Concerns**: Components should have a single responsibility
2. **Reusability**: Extract common patterns into reusable components
3. **Performance**: Use memoization and optimization techniques for performance-critical components
4. **Accessibility**: Ensure all components are accessible

### State Management

1. **Local State**: Use `useState` for component-specific state
2. **Context API**: Use React Context for shared state across components
3. **Memoization**: Use `useMemo` and `useCallback` to prevent unnecessary re-renders

### Data Fetching

1. **Server Components**: Use Next.js Server Components for data fetching where possible
2. **Client Components**: Use the `use client` directive for interactive components
3. **Error Handling**: Implement proper error handling for all data fetching operations

### Styling

1. **Tailwind CSS**: Use Tailwind for styling components
2. **Consistency**: Maintain consistent spacing, colors, and typography
3. **Responsive Design**: Ensure all components work well on different screen sizes

## Performance Optimization

1. **Code Splitting**: Use dynamic imports for code splitting
2. **Virtualization**: Use virtualization for long lists
3. **Memoization**: Memoize expensive calculations and component renders
4. **Lazy Loading**: Lazy load images and components when appropriate

## Type Safety

1. **TypeScript**: Use TypeScript for all components and utilities
2. **Strict Mode**: Enable strict mode in TypeScript configuration
3. **Type Definitions**: Define clear interfaces for component props and data structures

## Testing

1. **Unit Tests**: Write unit tests for utility functions
2. **Component Tests**: Test components in isolation
3. **Integration Tests**: Test component interactions
4. **End-to-End Tests**: Test complete user flows

## Deployment

1. **Vercel**: Deploy the application to Vercel
2. **Environment Variables**: Use environment variables for configuration
3. **Preview Environments**: Use Vercel preview environments for testing changes

## Conclusion

This codebase is designed to be maintainable, performant, and scalable. By following the best practices outlined in this document, we can ensure that the Neural Grader Dashboard continues to meet the needs of its users.
