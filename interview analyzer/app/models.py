import boto3
import librosa
import numpy as np
from moviepy.editor import VideoFileClip
from PIL import Image
import io
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor, pipeline

class InterviewAnalyzer:
    def __init__(self, aws_access_key_id, aws_secret_access_key, region_name):
        self.rekognition = boto3.client('rekognition',
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name
        )
        
        # Initialize models
        self.emotion_detector = pipeline("audio-classification", model="superb/wav2vec2-base-superb-er")
        self.speech_recognizer = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
        self.speech_model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")
        
    def extract_audio(self, video_path, output_path="temp_audio.wav"):
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(output_path)
        return output_path

    def detect_faces_in_image(self, image_bytes):
        try:
            response = self.rekognition.detect_faces(
                Image={'Bytes': image_bytes},
                Attributes=['ALL']
            )
            return response['FaceDetails']
        except Exception as e:
            print(f"Error detecting faces: {e}")
            return None

    def get_mouth_landmarks(self, face_details):
        if not face_details:
            return None

        face = face_details[0]
        landmarks = face.get('Landmarks', [])
        mouth_points = []
        mouth_landmarks = [
            'mouthLeft', 'mouthRight', 'upperLipTop',
            'upperLipBottom', 'lowerLipTop', 'lowerLipBottom'
        ]

        for landmark in landmarks:
            if landmark['Type'] in mouth_landmarks:
                point = landmark['X'], landmark['Y']
                mouth_points.append(point)

        return np.array(mouth_points) if mouth_points else None

    def calculate_mouth_movement(self, prev_landmarks, curr_landmarks):
        if prev_landmarks is None or curr_landmarks is None:
            return 0
        movement = np.mean(np.abs(curr_landmarks - prev_landmarks))
        return movement

    def analyze_emotions_from_face(self, face_details):
        if not face_details:
            return None
        emotions = face_details[0].get('Emotions', [])
        return sorted(emotions, key=lambda x: x['Confidence'], reverse=True)

    def check_lipsync(self, video_path, audio_path):
        video = VideoFileClip(video_path)
        y, sr = librosa.load(audio_path, sr=None)
        audio_energy = librosa.feature.rms(y=y)[0]
        
        mouth_movements = []
        sync_scores = []
        prev_landmarks = None
        emotions_data = []

        for frame in video.iter_frames():
            image = Image.fromarray(frame)
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='PNG')
            img_byte_arr = img_byte_arr.getvalue()

            face_details = self.detect_faces_in_image(img_byte_arr)
            curr_landmarks = self.get_mouth_landmarks(face_details)
            
            movement = self.calculate_mouth_movement(prev_landmarks, curr_landmarks)
            mouth_movements.append(movement)
            prev_landmarks = curr_landmarks

            frame_idx = len(mouth_movements) - 1
            audio_idx = int(frame_idx * len(audio_energy) / video.reader.nframes)
            if audio_idx < len(audio_energy):
                sync_score = abs(movement - audio_energy[audio_idx])
                sync_scores.append(sync_score)

            emotions = self.analyze_emotions_from_face(face_details)
            if emotions:
                emotions_data.append(emotions)

        video.close()
        return np.mean(sync_scores), sync_scores, emotions_data

    def evaluate_lipsync(self, sync_score, threshold=0.05):
        return "Suspicious" if sync_score < threshold else "Good"

    def analyze_video(self, video_path):
        audio_path = self.extract_audio(video_path)
        avg_sync_score, sync_scores, emotions_data = self.check_lipsync(video_path, audio_path)
        lipsync_evaluation = self.evaluate_lipsync(avg_sync_score)
        
        # Process emotions
        dominant_emotions = self.process_emotions(emotions_data)

        results = {
            'lipsync_score': float(avg_sync_score),
            'lipsync_evaluation': lipsync_evaluation,
            'emotions': dominant_emotions
        }

        # Clean up temporary audio file
        if os.path.exists(audio_path):
            os.remove(audio_path)

        return results

    def process_emotions(self, emotions_data):
        if not emotions_data:
            return {'dominant_emotion': 'UNKNOWN', 'confidence': 0}

        # Count occurrences of each emotion type as dominant
        emotion_counts = {}
        for frame_emotions in emotions_data:
            if frame_emotions:
                dominant = frame_emotions[0]  # Get the emotion with highest confidence
                emotion_type = dominant['Type']
                emotion_counts[emotion_type] = emotion_counts.get(emotion_type, 0) + 1

        # Find the most frequent dominant emotion
        if emotion_counts:
            dominant_emotion = max(emotion_counts.items(), key=lambda x: x[1])[0]
            # Calculate average confidence for this emotion
            confidence = np.mean([
                frame_emotions[0]['Confidence']
                for frame_emotions in emotions_data
                if frame_emotions and frame_emotions[0]['Type'] == dominant_emotion
            ])
            
            return {
                'dominant_emotion': dominant_emotion,
                'confidence': float(confidence),
                'emotion_distribution': emotion_counts
            }
        
        return {'dominant_emotion': 'UNKNOWN', 'confidence': 0}
