from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import librosa
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load image emotion detection model
IMAGE_MODEL_PATH = "advanced_emotion_recognition_model.keras"
AUDIO_MODEL_PATH = "speech_emotion_model.h5"

# Check if models exist and load them
if not os.path.exists(IMAGE_MODEL_PATH):
    raise FileNotFoundError(f"Image model file {IMAGE_MODEL_PATH} not found!")
if not os.path.exists(AUDIO_MODEL_PATH):
    raise FileNotFoundError(f"Audio model file {AUDIO_MODEL_PATH} not found!")

image_model = tf.keras.models.load_model(IMAGE_MODEL_PATH)
audio_model = tf.keras.models.load_model(AUDIO_MODEL_PATH)

# Emotion mappings
IMAGE_EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
AUDIO_EMOTIONS = {
    "01": "neutral",
    "02": "calm",
    "03": "happy",
    "04": "sad",
    "05": "angry",
    "06": "fearful",
    "07": "disgust",
    "08": "surprised"
}

# Image preprocessing function
def preprocess_image(image):
    image = image.convert('L')  # Convert to grayscale
    image = image.resize((48, 48))  # Resize to 48x48
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=(0, -1))
    return image_array

# Audio feature extraction function
def extract_audio_features(file_path, max_pad_len=500):
    try:
        audio, sr = librosa.load(file_path, sr=22050)
        mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40)
        chroma = librosa.feature.chroma_stft(y=audio, sr=sr)
        mel = librosa.feature.melspectrogram(y=audio, sr=sr)
        contrast = librosa.feature.spectral_contrast(y=audio, sr=sr)

        def pad_feature(feature, max_len):
            pad_width = max_len - feature.shape[1]
            return np.pad(feature, pad_width=((0, 0), (0, pad_width)), mode='constant') if pad_width > 0 else feature[:, :max_len]

        mfccs = pad_feature(mfccs, max_pad_len)
        chroma = pad_feature(chroma, max_pad_len)
        mel = pad_feature(mel, max_pad_len)
        contrast = pad_feature(contrast, max_pad_len)

        return np.vstack([mfccs, chroma, mel, contrast])
    except Exception as e:
        raise RuntimeError(f"Feature extraction failed: {str(e)}")

# Image emotion prediction route
@app.route('/predict-image-emotion', methods=['POST'])
def predict_image_emotion():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        image_file = request.files['image']
        image = Image.open(image_file)
        processed_image = preprocess_image(image)
        
        predictions = image_model.predict(processed_image)
        predicted_class = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class])
        predicted_emotion = IMAGE_EMOTIONS[predicted_class]
        
        response = {
            'top_emotion': predicted_emotion,
            'top_confidence': confidence,
            'predictions': {emotion: float(predictions[0][i]) 
                          for i, emotion in enumerate(IMAGE_EMOTIONS)}
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Audio emotion prediction route
@app.route('/predict-audio-emotion', methods=['POST'])
def predict_audio_emotion():
    if 'file' not in request.files:
        return jsonify({'error': 'No audio file uploaded'}), 400
    
    file = request.files['file']
    if not file or file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        file_path = "temp_audio.wav"
        file.save(file_path)

        features = extract_audio_features(file_path)
        features_reshaped = features.reshape(1, -1)

        prediction = audio_model.predict(features_reshaped)
        confidences = prediction[0].tolist()
        
        sorted_keys = sorted(AUDIO_EMOTIONS.keys())
        emotion_confidences = [{
            "emotion": AUDIO_EMOTIONS[key],
            "confidence": float(confidences[idx])
        } for idx, key in enumerate(sorted_keys)]
        
        top_index = np.argmax(confidences)
        top_emotion = AUDIO_EMOTIONS[sorted_keys[top_index]]
        
        return jsonify({
            "predictions": emotion_confidences,
            "top_emotion": top_emotion,
            "top_confidence": float(confidences[top_index])
        }), 200
    except Exception as e:
        return jsonify({'error': f"Prediction error: {str(e)}"}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

# Health check route
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Server is running',
        'models_loaded': {
            'image_model': os.path.exists(IMAGE_MODEL_PATH),
            'audio_model': os.path.exists(AUDIO_MODEL_PATH)
        }
    }), 200

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)