// src/components/ErrorBoundary.js
import React from 'react';
import { Text, View } from 'react-native';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View>
          <Text>Error: {this.state.error?.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
