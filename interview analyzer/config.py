import os

class Config:
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov'}
    AWS_ACCESS_KEY = 'YOUR_AWS_ACCESS_KEY'
    AWS_SECRET_KEY = 'YOUR_AWS_SECRET_KEY'
    AWS_REGION = 'YOUR_AWS_REGION'
    MAX_CONTENT_LENGTH = 500 * 1024 * 1024  
