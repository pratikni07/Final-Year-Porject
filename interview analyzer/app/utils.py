import os
from werkzeug.utils import secure_filename
from config import Config

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def save_video(file, job_id, application_id):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        video_dir = os.path.join(Config.UPLOAD_FOLDER, job_id, application_id)
        os.makedirs(video_dir, exist_ok=True)
        video_path = os.path.join(video_dir, filename)
        file.save(video_path)
        return video_path
    return None