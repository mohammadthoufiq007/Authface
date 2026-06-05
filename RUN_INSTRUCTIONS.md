# How to Run Datalake Face Auth (Hackathon Final)

The project has been restructured for the final submission.
- **Machine Learning Pipeline**: The legacy Python models, scripts, and testing utilities have been securely consolidated into the `ml_pipeline/` directory.
- **Mobile Application**: The `DatalakeApp` directory now holds a full, runnable React Native project containing the Face Authentication and Liveness capabilities.

## Running the React Native Application

### Prerequisites
1. **Node.js**: `v18+`
2. **Android**: Android Studio & Android SDK 33+.
3. **iOS**: Xcode & CocoaPods (if testing on Mac).

### Setup Instructions

1. **Navigate to the Mobile App Directory:**
   ```bash
   cd DatalakeApp
   ```

2. **Install Dependencies:**
   *(Note: Core dependencies like react-native-camera and sqlcipher have already been installed during the setup phase, but if you switch machines, run this again).*
   ```bash
   npm install
   ```

3. **Install iOS Pods (macOS only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Launch the App:**

   **For Android:**
   ```bash
   npx react-native run-android
   ```
   *Note: Ensure an Android emulator is running or a physical device is connected with USB Debugging enabled.*

   **For iOS:**
   ```bash
   npx react-native run-ios
   ```

## Generating the .tflite Models
The Python script to compress and convert the `.onnx` models into `.tflite` is available at `ml_pipeline/scripts/convert_models.py`. 
To run this, you will need a Python environment with access to C++ build tools (like Visual Studio Build Tools on Windows, or a standard Linux/macOS environment).
Once generated, the `.tflite` files should be placed manually into:
- Android: `DatalakeApp/android/app/src/main/assets/models/`
- iOS: `DatalakeApp/ios/DatalakeApp/`
