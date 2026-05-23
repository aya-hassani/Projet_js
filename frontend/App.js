import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { View, StyleSheet } from 'react-native';
import Login from './src/components/Login';
import ActivityFeed from './src/components/ActivityFeed';

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <Login />
        {/* Tu peux ajouter la navigation ici */}
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});