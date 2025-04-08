import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Text fontSize="xl" mb={2}>Something went wrong</Text>
          <Text mb={4}>{this.state.error?.message}</Text>
          <Button onClick={() => this.setState({ hasError: false })}>
            Try again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
} 