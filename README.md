# Authface

[![GitHub Pages](https://github.com/mohammadthoufiq007/Authface/actions/workflows/pages.yml/badge.svg)](https://mohammadthoufiq007.github.io/Authface/)

Secure Offline Facial-Recognition & Liveness Detection for Datalake 3.0.

## 🚀 Live Demo

**[View the live proposal link here!](https://mohammadthoufiq007.github.io/Authface/)**

## ✨ Features

- **Offline Processing**: All face recognition and liveness detection runs locally on-device
- **Cross-Platform**: React Native implementation for Android and iOS
- **High Accuracy**: Powered by TensorFlow Lite models for real-time performance
- **Enterprise Security**: Designed for secure authentication in enterprise environments
- **TypeScript Support**: Full type safety for better development experience

## 🛠️ Tech Stack

- **Frontend**: React Native, TypeScript
- **Mobile**: Android (Kotlin), iOS (Swift)
- **ML**: TensorFlow Lite, Python
- **Testing**: Jest, React Native Testing Library
- **CI/CD**: GitHub Actions, GitHub Pages

## 📋 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/mohammadthoufiq007/Authface.git
   cd Authface/DatalakeApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add TensorFlow Lite models:
   - Place `.tflite` files in `ml_pipeline/tflite_models/`
   - Copy to `DatalakeApp/android/app/src/main/assets/models/`
   - Copy to `DatalakeApp/ios/DatalakeApp/`

4. Start the Metro bundler:
   ```bash
   npm start
   ```

5. Run on Android:
   ```bash
   npm run android
   ```

6. Run on iOS:
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```

## 📁 Project Structure

```
Authface/
├── DatalakeApp/          # React Native application
│   ├── src/              # Source code
│   ├── __tests__/        # Jest tests
│   ├── __mocks__/        # Jest mocks
│   ├── android/          # Android native code
│   └── ios/              # iOS native code
├── ml_pipeline/          # ML models and utilities
│   └── tflite_models/    # TensorFlow Lite models (add here)
├── index.html            # GitHub Pages landing page
└── .github/workflows/    # CI/CD workflows
```

## ✅ Testing

Run the Jest test suite:

```bash
npm test -- --runInBand
```

Run TypeScript type checking:

```bash
npx tsc --noEmit
```

Run ESLint:

```bash
npm run lint
```

## 📝 Notes

- Ensure TensorFlow Lite models are placed in `ml_pipeline/tflite_models/`
- For iOS, always run `pod install` after updating native dependencies
- The application requires camera permissions at runtime
- All biometric processing happens locally—no data is sent to external servers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created by **[Mohammad Thoufiq](https://github.com/mohammadthoufiq007)**

For questions or support, please open an issue on [GitHub](https://github.com/mohammadthoufiq007/Authface/issues).

---

**Built for Datalake 3.0** • **Perfect for Hackathons** ✨
