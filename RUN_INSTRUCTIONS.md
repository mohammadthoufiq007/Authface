# Run Instructions

## Prerequisites
- Node.js `>= 18`
- Android Studio + Android SDK
- Xcode + CocoaPods for iOS testing

## Setup
1. Open a terminal and navigate to the mobile project:
   ```bash
   cd DatalakeApp
   ```
2. Install JavaScript dependencies:
   ```bash
   npm install
   ```
3. Install CocoaPods dependencies on macOS:
   ```bash
   cd ios
   pod install
   cd ..
   ```

## Copy the Models
Before launching the app, copy your `.tflite` files into the native asset folders:
- Android: `DatalakeApp/android/app/src/main/assets/models/`
- iOS: `DatalakeApp/ios/DatalakeApp/`

## Start Metro
In the `DatalakeApp` folder, start the bundler:
```bash
npm start
```

## Run on Android
```bash
npm run android
```

## Run on iOS (optional)
```bash
npm run ios
```

## Notes
- Ensure a connected Android device or emulator is available before running Android.
- If your `.tflite` files are missing, the native bridge will fail to load the models.
- The offline sync service uploads encrypted logs when the device regains network connectivity.
