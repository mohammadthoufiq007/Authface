# Authface

[![GitHub Pages](https://github.com/mohammadthoufiq007/Authface/actions/workflows/pages.yml/badge.svg)](https://mohammadthoufiq007.github.io/Authface/)

Secure Offline Facial-Recognition & Liveness for Datalake 3.0.

## Quick start

1. Clone the repository:
   ```bash
   git clone https://github.com/mohammadthoufiq007/Authface.git
   cd Authface/DatalakeApp
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy your TensorFlow Lite model files into the app:
   - `DatalakeApp/android/app/src/main/assets/models/`
   - `DatalakeApp/ios/DatalakeApp/`
4. Start the Metro bundler:
   ```bash
   npm start
   ```
5. Launch Android:
   ```bash
   npm run android
   ```

## Notes

- Place `.tflite` files inside `tflite_models/` for reference and copy them into the native app asset folders before running.
- For iOS, run `cd DatalakeApp/ios && pod install` before `npm run ios`.
