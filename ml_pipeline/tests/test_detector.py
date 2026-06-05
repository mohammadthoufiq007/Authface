import numpy as np
import cv2
import pytest
from offaceface.detector import FaceDetector

def test_black_frame_returns_none():
    detector = FaceDetector()
    black = np.zeros((480, 640, 3), dtype=np.uint8)
    assert detector.detect_face(black) is None

def test_output_shape_when_face_found():
    # Use a real photo from data/test_images/ if available
    # Otherwise skip gracefully
    import os
    test_img_dir = "data/test_images"
    images = [f for f in os.listdir(test_img_dir) if f.endswith(".jpg")] if os.path.exists(test_img_dir) else []
    if not images:
        pytest.skip("No test images available")
    img = cv2.imread(os.path.join(test_img_dir, images[0]))
    detector = FaceDetector()
    result = detector.detect_face(img)
    if result is not None:
        assert result.shape == (112, 112, 3)

def test_none_input_returns_none():
    detector = FaceDetector()
    assert detector.detect_face(None) is None

def test_tiny_frame_returns_none():
    detector = FaceDetector()
    tiny = np.zeros((10, 10, 3), dtype=np.uint8)
    assert detector.detect_face(tiny) is None
