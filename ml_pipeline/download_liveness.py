import urllib.request, os

os.makedirs('models', exist_ok=True)

# Pre-converted MiniFASNetV2 ONNX from a reliable mirror
urls = [
    "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx",
]

# Actually download from insightface's anti-spoof collection
url = "https://raw.githubusercontent.com/Tencent/MNN/master/resource/model/liveness.mnn"

# Best working mirror for MiniFASNet ONNX
import urllib.request
url = "https://github.com/hpc203/Retinaface-Anti-Spoof/raw/main/models/MiniFASNetV2.onnx"
dest = "models/2.7_80x80_MiniFASNetV2.onnx"
print(f"Downloading from {url}")
urllib.request.urlretrieve(url, dest)
print(f"Done: {os.path.getsize(dest):,} bytes")
