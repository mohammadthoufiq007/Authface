# Secure Offline Facial-Recognition & Liveness for Datalake 3.0

**Tagline:** A lightweight (< 20 MB) TensorFlow-Lite model with native Android/iOS bridges that authenticates field personnel completely offline and syncs encrypted logs when connectivity returns.

## Problem Statement

Field operators in remote environments often cannot rely on continuous connectivity or centralized authentication servers. The challenge is to provide secure, biometric access control and fraud-resistant liveness verification without internet access, while preserving privacy and supporting later encrypted sync once the network is available.

## Solution Overview

This submission delivers a compact React-Native mobile application that runs entirely offline using on-device TensorFlow Lite inference. The solution uses a native bridge to execute a quantised face recognition and liveness model, then stores verified access logs in an encrypted SQLite database. When connectivity is restored, logs are synced securely to a backend service.

The architecture isolates camera capture and UX in React Native, while delegating heavy model execution to native Kotlin/Swift code. This ensures a responsive user experience and supports both Android and iOS platforms with the same offline-first security model.

## Core Components

- **React-Native UI + LivenessScreen** – handles camera capture, random challenge prompts, and displays verification feedback.
- **Native Kotlin/Swift TensorFlow-Lite bridge** – runs the quantised model on-device with sub-second latency.
- **Encrypted SQLite-SQLCipher + SyncService** – stores logs locally in an encrypted database and pushes them to AWS when online.

## Technical Highlights

- Model size: ≈ 2.5 MB (INT8-quantised) – well under the 20 MB limit.
- Inference latency: ≈ 350 ms on a mid-range Android device (Pixel 5a, Android 13).
- Accuracy: 97% TAR @ 0.1% FAR on a diverse Indian-demographic test set.
- Fully offline operation; secure background sync (AES-256) when network returns.

## Architecture Diagram

React-Native (JS) → Native Bridge (Kotlin/Swift) → TensorFlow-Lite (.tflite) → Embedding → SQLite-SQLCipher → SyncService → AWS API Gateway

## Demo & Usage

1. Clone the repository.
2. Install dependencies in `DatalakeApp`.
3. Copy `.tflite` files into the native asset folders.
4. Run `npm start` and then `npm run android`.
5. Perform a liveness challenge and observe secure authentication logging.

## Submission Artefacts

- ZIP file: [Authface_Hackathon.zip](https://github.com/mohammadthoufiq007/Authface-Hackathon/releases/download/v1.0/Authface_Hackathon.zip)
- GitHub repo: this repository.
- `ml_pipeline/BENCHMARKS.md`
- `ml_pipeline/HACKATHON_SUBMISSION.md`

## Team & Contact

- Your Name – Project Lead (email@example.com)
- Teammate 1 – ML & Model Quantisation (email@example.com)
- Teammate 2 – React-Native & Native Bridges (email@example.com)

## Future Work / Impact

This submission can be merged into the full Datalake 3.0 product by replacing the placeholder AWS endpoint with the real backend and adding secure device enrollment flows. Future upgrades can include multimodal biometrics, stronger anti-spoofing, and support for enterprise credential federation.
