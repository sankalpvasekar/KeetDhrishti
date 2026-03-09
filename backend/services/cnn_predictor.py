import os
import logging
import numpy as np
from PIL import Image

# Suppress annoying TF logs
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf
from tensorflow.keras.utils import img_to_array

logging.getLogger('tensorflow').setLevel(logging.ERROR)

IMG_SIZE = (224, 224)

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "insect_best.keras")
CLASSES_PATH = os.path.join(BASE_DIR, "..", "data", "classes.txt")

# Global variables
model = None
id_to_name = {}

# 1. Load Classes
try:
    if os.path.exists(CLASSES_PATH):
        with open(CLASSES_PATH, "r") as f:
            for line in f:
                if line.strip():
                    parts = line.strip().split(" ", 1)
                    if len(parts) == 2:
                        idx, name = parts
                        id_to_name[int(idx) - 1] = name
    else:
        print(f"Warning: Classes file not found at {CLASSES_PATH}")
except Exception as e:
    print(f"Error loading classes: {e}")

# 2. Native Keras 3 Model Loader
def get_model():
    global model
    if model is None:
        try:
            print(f"Loading Keras 3 CNN model from {MODEL_PATH}...")
            # Natively loads Keras 3 models! Zero translation needed.
            model = tf.keras.models.load_model(MODEL_PATH, compile=False)
            print("Model loaded successfully!")
        except Exception as e:
            print(f"CRITICAL ERROR: Model loading failed. Error: {e}")
            raise e
    return model

def predict_insect(image_path):
    """
    Predict insect from image file
    """
    try:
        current_model = get_model()

        # Preprocess image
        img = Image.open(image_path).convert("RGB").resize(IMG_SIZE)
        arr = img_to_array(img) / 255.0
        arr = np.expand_dims(arr, axis=0)

        # Predict
        preds = current_model.predict(arr, verbose=0)
        idx = int(np.argmax(preds))
        conf = float(np.max(preds))

        return id_to_name.get(idx, "Unknown Insect"), round(conf * 100, 2)
    except Exception as e:
        print(f"Prediction Error: {e}")
        return "Error", 0.0

# Test block
if __name__ == "__main__":
    print("--- CNN Predictor Test ---")
    if os.path.exists(MODEL_PATH):
        print("Model file found.")
        try:
            get_model()
            print("Test load successful.")
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"Test load failed: {e}")
    else:
        print(f"Model file NOT found at: {MODEL_PATH}")
