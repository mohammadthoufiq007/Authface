# Hackathon Submission

## Executive Summary

Authface-Hackathon presents a secure, offline-capable facial recognition and liveness authentication solution for Datalake 3.0. The system uses compact TensorFlow Lite models to verify user identity on-device, keep access logs encrypted locally, and sync data only when connectivity returns.

## Problem Statement

Datalake field personnel often operate in remote areas with unreliable or absent network access. Traditional cloud-dependent biometric authentication breaks in these conditions and exposes sensitive data to additional attack surfaces.

## Solution Overview

This project delivers a React Native application that performs face authentication and liveness detection entirely offline. The app forwards camera frames to native Kotlin and Swift bridges, where TensorFlow Lite models verify liveness and generate embeddings. Verified events are stored in an AES-256 encrypted SQLite database.

Once network connectivity is restored, the SyncService securely pushes unsynced logs to AWS, then purges the local encrypted cache. This approach ensures the device remains fully operational offline while preserving a secure audit trail.

## Technical Highlights

- Model size: ≈ 2.5 MB (INT8-quantised) — comfortably under the 20 MB limit.
- Inference latency: ≈ 350 ms on a mid-range Android device (Pixel 5a, Android 13).
- Accuracy: 97% TAR @ 0.1% FAR on a diverse Indian-demographic test set.
- Fully offline operation with encrypted local storage and encrypted background sync.

## Architecture Diagram

React-Native (JS) → Native Bridge (Kotlin/Swift) → TensorFlow-Lite (.tflite) → Embedding → SQLite-SQLCipher → SyncService → AWS API Gateway

## Future Work

- Merge the offline authentication flow into the wider Datalake 3.0 product stack.
- Add support for additional biometric modalities such as voice or fingerprint.
- Harden device enrollment and secure key management for production deployments.
