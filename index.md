# Secure Offline Facial-Recognition & Liveness for Datalake 3.0

**Tagline:** A lightweight (< 20 MB) TensorFlow-Lite model with native Android/iOS bridges that authenticates field personnel completely offline and securely syncs encrypted logs when connectivity returns.

---

## Problem Statement

Field operators in remote environments often cannot rely on continuous internet connectivity or centralized authentication servers. The challenge is to provide secure, biometric access control and fraud-resistant liveness verification without internet access, while preserving privacy and supporting later encrypted sync once the network is available.

---

## Solution Overview

We built a **plug-and-play React-Native module** that can be dropped into the existing Datalake 3.0 codebase:

### Core Components

1. **React-Native UI + LivenessScreen** – camera capture, random challenge prompts (blink, smile, turn head), and live feedback.
2. **Native Kotlin/Swift TensorFlow-Lite bridge** – runs INT8-quantised models on-device (~350 ms latency on Android).
3. **Encrypted SQLite-SQLCipher + SyncService** – stores biometric logs locally with AES-256 encryption, and automatically uploads to a secure AWS endpoint when the network is restored, then purges the local data.

### Architecture Components

- `src/modules/FaceAuthModule.js` – JS wrapper exposing `processFrame()`, `verifyLiveness()`, `compareEmbeddings()` to the UI.
- `src/screens/LivenessScreen.js` – Full UI flow with random challenges and real-time feedback.
- `src/db/DatabaseHelper.js` – Encrypted SQLite-SQLCipher helper for secure log storage.
- `src/services/SyncService.js` – NetInfo-based background sync service with AWS API Gateway.
- `android/app/src/main/java/com/datalakeapp/FaceAuthEngine.kt` – Android native bridge with TensorFlow-Lite integration.
- `ios/DatalakeApp/FaceAuthEngine.swift` – iOS native bridge with TensorFlow-Lite Swift support.

---

## Technical Highlights

| Metric | Value |
|--------|-------|
| **Model footprint (total)** | ≈ **2.5 MB** (INT8 quantised) |
| **Inference latency (Android)** | ~**350 ms** (Pixel 5a, API 33) |
| **Inference latency (iOS)** | ~**200 ms** (iPhone SE 2nd Gen) |
| **True Acceptance Rate (TAR)** | **97 %** @ 0.1 % FAR |
| **Spoof-rejection (liveness)** | **98.5 %** |
| **Offline operation** | ✅ No network required |
| **Secure sync** | ✅ AES-256 encrypted SQLite |
| **Cross-platform** | ✅ Android 10+ & iOS 12+ |

---

## Architecture Diagram

```
React-Native (JS)
    ↓
Native Bridge (Kotlin/Swift)
    ↓
TensorFlow-Lite (.tflite)
    ↓
Embedding Vector (128D)
    ↓
SQLite-SQLCipher (Local Encryption)
    ↓
SyncService (NetInfo Listener)
    ↓
AWS API Gateway (Secure Endpoint)
```

---

## Demo & Usage (for Judges)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohammadthoufiq007/Authface.git
   cd Authface/DatalakeApp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Copy TensorFlow-Lite models:**
   ```bash
   mkdir -p android/app/src/main/assets/models
   cp ../ml_pipeline/tflite_models/*.tflite android/app/src/main/assets/models/
   cp ../ml_pipeline/tflite_models/*.tflite ios/DatalakeApp/
   ```

4. **Start an Android emulator:**
   - Open Android Studio → AVD Manager → Launch Pixel 5a (API 33)

5. **Run the app:**
   ```bash
   npx react-native run-android
   ```

6. **Test the flow:**
   - The app launches the Liveness screen
   - Complete the random challenge (blink, smile, turn head)
   - Console prints: **"User verified with embedding length: 128"**
   - Turn Wi-Fi off, repeat the flow, turn Wi-Fi back on
   - Console prints: **"Sync complete and local offline cache purged securely."**

---

## Submission Artefacts

- **GitHub Repository:** https://github.com/mohammadthoufiq007/Authface (public)
- **Proposal Link (GitHub Pages):** https://mohammadthoufiq007.github.io/Authface/
- **ZIP File:** `Authface_Hackathon.zip` (in GitHub Release)
- **Documentation:**
  - `PROPOSAL.md` – Public proposal page (this page)
  - `RUN_INSTRUCTIONS.md` – Step-by-step setup guide
  - `README.md` – Quick start & overview
  - `ml_pipeline/BENCHMARKS.md` – Detailed performance & accuracy metrics
  - `ml_pipeline/HACKATHON_SUBMISSION.md` – Executive summary & technical write-up

---

## Testing Results

✅ **TypeScript Compilation:** `npx tsc --noEmit` – **No errors**  
✅ **Linting:** `npm run lint` – **No errors**  
✅ **Unit Tests:** `npm test -- --runInBand` – **All pass**  
✅ **Android Build:** `npx react-native run-android` – **Successful**  
✅ **GitHub Pages:** Workflow fixed – **Deploying correctly**  

---

## Future Work / Impact

1. **Direct Integration:** Drop into Datalake 3.0 as an npm module (`npm install authface-module`).
2. **Multimodal Biometrics:** Extend to voice, iris, or fingerprint using the same offline-first pipeline.
3. **Cloud Fallback:** Optional cloud-based verification for environments with guaranteed connectivity.
4. **Enterprise Federation:** Support SAML/OIDC for enterprise credential integration.
5. **Analytics Dashboard:** Real-time sync logs and audit trails for security teams.

---

## Team & Contact

- **Mohammed Thoufiq** – Full Stack / Project Lead – [GitHub](https://github.com/mohammadthoufiq007)

---

## Conclusion

Authface delivers a **production-ready, secure, and scalable** offline biometric authentication solution that meets all hackathon constraints:

- ✅ **Performant** (~350 ms latency)
- ✅ **Accurate** (97 % TAR)
- ✅ **Compact** (2.5 MB)
- ✅ **Secure** (AES-256 encrypted)
- ✅ **Easy to integrate** into existing Datalake 3.0 workflows

The public GitHub Pages proposal link and comprehensive documentation make it ready for immediate hackathon submission and real-world deployment.

---

**Status:** ✅ **Ready for Submission**  
**Last Updated:** June 5, 2026
