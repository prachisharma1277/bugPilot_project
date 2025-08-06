import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key'
    SQLALCHEMY_DATABASE_URI =os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
