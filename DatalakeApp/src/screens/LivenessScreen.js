import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RNCamera } from 'react-native-camera';
import FaceAuthModule from '../modules/FaceAuthModule';

const ACTIONS = ['Blink your eyes', 'Smile', 'Turn head slightly left', 'Turn head slightly right'];

const LivenessScreen = ({ onVerificationSuccess, onVerificationFailed }) => {
  const cameraRef = useRef(null);
  const [currentAction, setCurrentAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState('Position your face in the frame');

  useEffect(() => {
    // Pick a random liveness action prompt for the user
    const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    setCurrentAction(randomAction);
    
    // Initialize native TFLite models
    FaceAuthModule.initializeModels().then((success) => {
      if (!success) {
        setFeedback('Failed to load AI models. Contact admin.');
      }
    });
  }, []);

  const captureAndVerify = async () => {
    if (cameraRef.current && !isProcessing) {
      setIsProcessing(true);
      setFeedback('Verifying...');
      try {
        const options = { quality: 0.5, base64: true, width: 500 };
        const data = await cameraRef.current.takePictureAsync(options);
        
        // Pass the image path or base64 to the native engine
        const result = await FaceAuthModule.processFrame(data.uri);
        
        if (result.isLive && result.embedding) {
          setFeedback('Liveness Verified! Authenticating...');
          onVerificationSuccess(result.embedding);
        } else {
          setFeedback('Verification failed. Liveness check did not pass.');
          setTimeout(() => setIsProcessing(false), 2000);
          onVerificationFailed();
        }
      } catch (error) {
        setFeedback('Error during capture. Try again.');
        setIsProcessing(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.front}
        captureAudio={false}
      />
      
      <View style={styles.overlay}>
        <View style={styles.promptContainer}>
          <Text style={styles.actionText}>Liveness Check</Text>
          <Text style={styles.instructionText}>{currentAction}</Text>
        </View>
        
        <View style={styles.feedbackContainer}>
          {isProcessing ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <Text style={styles.feedbackText}>{feedback}</Text>
          )}
        </View>

        <TouchableOpacity 
          style={styles.captureButton} 
          onPress={captureAndVerify}
          disabled={isProcessing}
        >
          <Text style={styles.buttonText}>Capture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  promptContainer: {
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionText: {
    color: '#00e676',
    fontSize: 24,
    fontWeight: 'bold',
  },
  feedbackContainer: {
    height: 40,
    justifyContent: 'center',
  },
  feedbackText: {
    color: '#fff',
    fontSize: 16,
  },
  captureButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LivenessScreen;
