import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///mydb.sqlite3'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
