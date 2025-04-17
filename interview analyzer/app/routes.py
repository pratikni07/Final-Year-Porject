from flask import Blueprint, request, jsonify
from app.models import InterviewAnalyzer
from app.utils import save_video
from config import Config
import os

main = Blueprint('main', __name__)

# Initialize the analyzer
analyzer = InterviewAnalyzer(
    aws_access_key_id=Config.AWS_ACCESS_KEY,
    aws_secret_access_key=Config.AWS_SECRET_KEY,
    region_name=Config.AWS_REGION
)

@main.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@main.route('/analyze', methods=['POST'])
def analyze_interview():
    try:
        # Validate request
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        
        file = request.files['video']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        job_id = request.form.get('job_id')
        application_id = request.form.get('application_id')
        
        if not job_id or not application_id:
            return jsonify({'error': 'job_id and application_id are required'}), 400

        # Save and process video
        video_path = save_video(file, job_id, application_id)
        if not video_path:
            return jsonify({'error': 'Invalid file type'}), 400

        # Analyze video
        try:
            results = analyzer.analyze_video(video_path)
            
            # Clean up - remove the video file after processing
            if os.path.exists(video_path):
                os.remove(video_path)
            
            # Prepare response
            response = {
                'job_id': job_id,
                'application_id': application_id,
                'analysis': results
            }
            
            return jsonify(response)
            
        except Exception as e:
            # Clean up in case of processing error
            if os.path.exists(video_path):
                os.remove(video_path)
            raise e

    except Exception as e:
        return jsonify({'error': str(e)}), 500
