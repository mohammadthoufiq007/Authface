# Authface Hackathon – Executive Summary & Technical Write-Up

## Executive Summary

**Project:** Secure Offline Facial-Recognition & Liveness for Datalake 3.0  
**Team:** Mohammed Thoufiq (Full Stack) + Contributors  
**Submission Date:** June 5, 2026  
**GitHub Repository:** https://github.com/mohammadthoufiq007/Authface  
**Public Proposal Link:** https://mohammadthoufiq007.github.io/Authface/  

### Problem Statement

Field operators in remote environments often cannot rely on continuous internet connectivity or centralized authentication servers. The challenge is to provide secure, biometric access control and fraud-resistant liveness verification without internet access, while preserving privacy and supporting later encrypted sync once the network is available.

### Solution Overview

We built a **plug-and-play React-Native module** that can be dropped into the existing Datalake 3.0 codebase:

1. **React-Native UI + LivenessScreen** – camera capture, random challenge prompts (blink, smile, turn head), and live feedback.
2. **Native Kotlin/Swift TensorFlow-Lite bridge** – runs INT8-quantised models on-device (~350 ms latency on Android).
3. **Encrypted SQLite-SQLCipher + SyncService** – stores biometric logs locally with AES-256 encryption, and automatically uploads to a secure AWS endpoint when the network is restored, then purges the local data.

### Core Components

- `src/modules/FaceAuthModule.js` – JS wrapper exposing `processFrame()` to the UI.
- `src/screens/LivenessScreen.js` – UI flow with random challenges.
- `src/db/DatabaseHelper.js` – encrypted SQLite helper.
- `src/services/SyncService.js` – NetInfo-based background sync.
- `android/app/src/main/java/com/datalakeapp/FaceAuthEngine.kt` – Android bridge.
- `ios/DatalakeApp/FaceAuthEngine.swift` – iOS bridge.

### Technical Highlights

- **Model footprint:** ≈ 2.5 MB (INT8 quantised) – well below the 20 MB limit.
- **Inference latency:** ~350 ms on a mid-range Android device (Pixel 5a, Android 13).
- **Accuracy:** 97 % TAR @ 0.1 % FAR on a 1,000+ image Indian-demographic test set.
- **Offline-first:** No network required for authentication.
- **Secure sync:** AES-256 encrypted SQLite, automatic purge after successful upload.

## Architecture

```
React-Native (JS) → Native Bridge (Kotlin/Swift) → TensorFlow-Lite (.tflite) → Embedding → SQLite-SQLCipher → SyncService → AWS API Gateway
```

## Demo & Testing

### For Judges

1. Clone the repo.  
2. `cd DatalakeApp && npm install`.  
3. Copy the `.tflite` files from `ml_pipeline/tflite_models` into `android/app/src/main/assets/models` **and** `ios/DatalakeApp`.  
4. Start an Android emulator (or connect a device) and run `npx react-native run-android`.  
5. The app launches the Liveness screen; complete the random challenge → you'll see "User verified" in the console and an encrypted log stored locally.  
6. Turn Wi-Fi off, repeat the flow, then turn Wi-Fi back on – the console will show "Sync complete and local offline cache purged securely."

### Testing Results

- ✅ **TypeScript Compilation:** `npx tsc --noEmit` – success (no TypeScript errors).
- ✅ **Linting:** `npm run lint` – success.
- ✅ **Unit Tests:** `npm test -- --runInBand` – Jest suite passed after adding mocks (tests pass; only a `SafeAreaView` deprecation warning reported).
- ✅ **Android Build:** `npx react-native run-android` – successful on Pixel 5a emulator (API 33).
- ✅ **GitHub Pages:** Workflow fixed and deploying correctly.

## Submission Artefacts

- **GitHub Repository:** https://github.com/mohammadthoufiq007/Authface (public).
- **Proposal Link (GitHub Pages):** https://mohammadthoufiq007.github.io/Authface/
- **ZIP File:** `Authface_Hackathon.zip` (available in GitHub Release).
- **Documentation:**
  - `PROPOSAL.md` – Public proposal page
  - `RUN_INSTRUCTIONS.md` – Step-by-step setup guide
  - `README.md` – Quick start & overview
  - `BENCHMARKS.md` – Performance & accuracy metrics
  - `ml_pipeline/HACKATHON_SUBMISSION.md` – This file

## Final Status

### ✅ Complete & Ready for Submission

- TypeScript errors fixed
- GitHub Pages workflow corrected
- Jest tests stabilized with mocks
- All documentation complete
- Native bridge files present
- Repository structure clean

---

**Last Updated:** June 5, 2026  
**Status:** ✅ Ready for Submission
