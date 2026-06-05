import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import LivenessScreen from './src/screens/LivenessScreen';

function App(): React.JSX.Element {
  const onVerificationSuccess = (embedding) => {
    console.log('User verified with embedding length: ', embedding.length);
    // Proceed to sync or login
  };

  const onVerificationFailed = () => {
    console.log('Liveness check failed.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Datalake 3.0 Face Auth</Text>
      </View>
      <LivenessScreen 
        onVerificationSuccess={onVerificationSuccess}
        onVerificationFailed={onVerificationFailed}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#111',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default App;
