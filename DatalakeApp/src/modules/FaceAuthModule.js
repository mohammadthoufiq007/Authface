import { NativeModules } from 'react-native';

const { FaceAuthEngine } = NativeModules;

/**
 * Interface to the Native Face Authentication Engine.
 */
class FaceAuthModule {
  
  /**
   * Initializes the TFLite models on the native side.
   * @returns {Promise<boolean>} True if initialization succeeded.
   */
  static async initializeModels() {
    try {
      if (!FaceAuthEngine) {
        console.warn('FaceAuthEngine native module is not linked.');
        return false;
      }
      return await FaceAuthEngine.initializeModels();
    } catch (error) {
      console.error('Failed to initialize models:', error);
      return false;
    }
  }

  /**
   * Processes a camera frame (base64 or URI) for liveness and facial recognition.
   * @param {string} imagePath - The path or base64 data of the image.
   * @returns {Promise<object>} Returns { isLive: boolean, embedding: number[] }
   */
  static async processFrame(imagePath) {
    try {
      const result = await FaceAuthEngine.processFrame(imagePath);
      if (result) {
        return {
          isLive: true,
          embedding: result.embedding,
        };
      }
      return { isLive: false, embedding: null };
    } catch (error) {
      console.error('Frame processing failed:', error);
      return { isLive: false, embedding: null };
    }
  }

  /**
   * Calculates cosine similarity between two embeddings.
   * @param {number[]} embedding1 
   * @param {number[]} embedding2 
   * @returns {number} Score between -1 and 1.
   */
  static compareEmbeddings(embedding1, embedding2) {
    if (embedding1.length !== embedding2.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      normA += Math.pow(embedding1[i], 2);
      normB += Math.pow(embedding2[i], 2);
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

export default FaceAuthModule;
