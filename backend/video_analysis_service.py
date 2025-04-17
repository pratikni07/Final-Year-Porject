from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import cv2
import numpy as np
import mediapipe as mp
import librosa
import torch
from typing import Dict
import os

app = FastAPI()

class VideoRequest(BaseModel):
    video_path: str

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

def extract_mouth_landmarks(frame, face_landmarks):
    """Extract mouth landmarks from the frame."""
    try:
        mouth_landmarks = []
        for i in [61, 185, 40, 39, 37, 0, 267, 269, 270, 409]:  # Mouth landmarks
            landmark = face_landmarks.landmark[i]
            x = int(landmark.x * frame.shape[1])
            y = int(landmark.y * frame.shape[0])
            mouth_landmarks.append((x, y))
        return np.array(mouth_landmarks)
    except Exception as e:
        print(f"Error extracting mouth landmarks: {str(e)}")
        return np.array([])

def analyze_facial_expressions(frame, face_landmarks):
    """Analyze facial expressions using landmark distances."""
    expressions = {
        "happiness": 0.0,
        "surprise": 0.0,
        "neutral": 0.0
    }
    
    try:
        if face_landmarks and len(face_landmarks.landmark) > 291:
            # Example: Check for smile based on mouth corner positions
            mouth_corner_left = face_landmarks.landmark[61]
            mouth_corner_right = face_landmarks.landmark[291]
            
            if mouth_corner_left.y < face_landmarks.landmark[0].y and \
               mouth_corner_right.y < face_landmarks.landmark[0].y:
                expressions["happiness"] = 0.8
                expressions["neutral"] = 0.2
            else:
                expressions["neutral"] = 0.7
                expressions["happiness"] = 0.2
        else:
            # Default values when no face is detected
            expressions["neutral"] = 1.0
            
    except Exception as e:
        print(f"Error analyzing facial expressions: {str(e)}")
        expressions["neutral"] = 1.0
        
    return expressions

def safe_mean(values, default=0.0):
    """Safely calculate mean of a list, handling empty lists and NaN values."""
    if not values:
        return default
    filtered_values = [v for v in values if v is not None and not np.isnan(v)]
    return float(np.mean(filtered_values)) if filtered_values else default

def detect_lipsync(video_path: str) -> Dict:
    """
    Analyze video for lip sync detection and facial expressions.
    Returns a dictionary with analysis results.
    """
    try:
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            raise HTTPException(status_code=400, detail="Could not open video file")
        
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        # Extract audio from video
        try:
            y, sr = librosa.load(video_path)
        except Exception as e:
            print(f"Error loading audio: {str(e)}")
            y, sr = np.array([]), 44100  # Default sample rate
        
        lipsync_scores = []
        expression_data = []
        frame_count = 0
        faces_detected = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            # Convert frame to RGB for MediaPipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(rgb_frame)
            
            if results.multi_face_landmarks:
                faces_detected += 1
                face_landmarks = results.multi_face_landmarks[0]
                
                # Analyze facial expressions
                expressions = analyze_facial_expressions(frame, face_landmarks)
                expression_data.append(expressions)
                
                # Extract mouth landmarks and analyze lip movement
                mouth_landmarks = extract_mouth_landmarks(frame, face_landmarks)
                
                if len(mouth_landmarks) > 0:
                    # Simple lip sync detection based on mouth movement and audio amplitude
                    audio_time = frame_count / fps
                    audio_index = int(audio_time * sr)
                    if audio_index < len(y):
                        audio_amplitude = abs(y[audio_index])
                        mouth_movement = np.std(mouth_landmarks[:, 1])  # Vertical movement
                        
                        # Calculate lip sync score (simplified version)
                        sync_score = 1.0 if abs(audio_amplitude - mouth_movement) < 0.5 else 0.0
                        lipsync_scores.append(sync_score)
            else:
                # No face detected in this frame
                expression_data.append({
                    "happiness": 0.0,
                    "surprise": 0.0,
                    "neutral": 1.0
                })
            
            frame_count += 1
            if frame_count >= total_frames:
                break
        
        cap.release()
        
        # Calculate final results with safe handling of empty lists and NaN values
        avg_lipsync_score = safe_mean(lipsync_scores, default=0.0)
        
        # Aggregate expression data safely
        avg_expressions = {
            "happiness": safe_mean([e["happiness"] for e in expression_data]),
            "surprise": safe_mean([e["surprise"] for e in expression_data]),
            "neutral": safe_mean([e["neutral"] for e in expression_data])
        }
        
        face_detection_rate = (faces_detected / frame_count) if frame_count > 0 else 0
        
        return {
            "lipsync_score": float(avg_lipsync_score),
            "lipsync_confidence": "High" if avg_lipsync_score > 0.7 else "Low",
            "is_fake": avg_lipsync_score < 0.5,
            "facial_expressions": avg_expressions,
            "analysis_summary": {
                "total_frames_analyzed": frame_count,
                "faces_detected": faces_detected,
                "face_detection_rate": float(face_detection_rate),
                "video_duration_seconds": frame_count / fps if fps > 0 else 0,
                "overall_quality": "Good" if avg_lipsync_score > 0.7 and face_detection_rate > 0.8 else "Poor"
            }
        }
    except Exception as e:
        print(f"Error in detect_lipsync: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Video analysis failed: {str(e)}")

@app.post("/analyze-video")
async def analyze_video(request: VideoRequest):
    """
    Endpoint to analyze video for lip sync detection and facial expressions.
    """
    try:
        if not os.path.exists(request.video_path):
            raise HTTPException(status_code=404, detail="Video file not found")
            
        results = detect_lipsync(request.video_path)
        return results
        
    except Exception as e:
        print(f"Error in analyze_video endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 