#!/usr/bin/env python3
import os
import sys
import shutil
import onnx
import tf2onnx
import tensorflow as tf

def convert_onnx_to_tflite(onnx_path: str, tflite_path: str, quantize: bool = True) -> None:
    """Convert an ONNX model to a (optionally quantized) TFLite model.

    Steps:
    1. Load the ONNX model.
    2. Convert it to a TensorFlow SavedModel using onnx‑tf backend.
    3. Convert the SavedModel to TFLite, applying INT8 quantisation if requested.
    """
    # Load ONNX model
    onnx_model = onnx.load(onnx_path)

    # Convert ONNX -> TensorFlow graph using tf2onnx
    tf_rep, _ = tf2onnx.convert.from_onnx(onnx_model)
    saved_model_dir = os.path.join(os.path.dirname(onnx_path), "saved_model_temp")
    if os.path.isdir(saved_model_dir):
        shutil.rmtree(saved_model_dir)
    tf_rep.export_graph(saved_model_dir)

    # TFLite conversion
    converter = tf.lite.TFLiteConverter.from_saved_model(saved_model_dir)
    if quantize:
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        # Simple representative dataset (random data) – adjust shape if needed
        def rep_dataset():
            for _ in range(100):
                yield [tf.random.uniform([1, 224, 224, 3], dtype=tf.float32).numpy()]
        converter.representative_dataset = rep_dataset
        converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
        converter.inference_input_type = tf.uint8
        converter.inference_output_type = tf.uint8
    tflite_model = converter.convert()
    os.makedirs(os.path.dirname(tflite_path), exist_ok=True)
    with open(tflite_path, "wb") as f:
        f.write(tflite_model)
    # Clean up temporary SavedModel
    shutil.rmtree(saved_model_dir)
    print(f"Converted {onnx_path} -> {tflite_path}")

def copy_to_assets(tflite_path: str, platform: str) -> None:
    """Copy the generated .tflite file into the appropriate platform assets directory."""
    if platform == "android":
        dest_dir = os.path.abspath(os.path.join(os.getcwd(), "android", "app", "src", "main", "assets", "models"))
    elif platform == "ios":
        dest_dir = os.path.abspath(os.path.join(os.getcwd(), "ios", "AuthFaceApp", "Resources"))
    else:
        raise ValueError(f"Unsupported platform: {platform}")
    os.makedirs(dest_dir, exist_ok=True)
    shutil.copy2(tflite_path, dest_dir)
    print(f"Copied {tflite_path} to {dest_dir}")

def main() -> None:
    base_dir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))
    models = [
        (os.path.join(base_dir, "models", "buffalo_sc", "det_500m.onnx"), "det_500m.tflite"),
        (os.path.join(base_dir, "models", "2.7_80x80_MiniFASNetV2.onnx"), "liveness.tflite"),
        (os.path.join(base_dir, "MobileFaceNet", "weights", "MobileFaceNet.onnx"), "mobilefacenet.tflite"),
    ]
    for onnx_path, tflite_name in models:
        if not os.path.exists(onnx_path):
            print(f"Warning: {onnx_path} not found – skipping.")
            continue
        tflite_path = os.path.join(base_dir, "tflite_models", tflite_name)
        convert_onnx_to_tflite(onnx_path, tflite_path, quantize=True)
        copy_to_assets(tflite_path, "android")
        copy_to_assets(tflite_path, "ios")

if __name__ == "__main__":
    # Verify required packages are importable – exit with message if missing.
    try:
        import onnx  # noqa: F401
        import tensorflow as tf  # noqa: F401
        import tf2onnx  # noqa: F401
    except ImportError as e:
        sys.exit(f"Missing required package: {e}. Please install the required dependencies.")
    main()
