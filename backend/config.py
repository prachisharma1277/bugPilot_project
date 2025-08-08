import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key'
    SQLALCHEMY_DATABASE_URI =os.getenv("DATABASE_URL") or "postgresql://postgres:b6%21s%3CHS%2Fagamy123@db.srulgrsvkaeabkvywgiz.supabase.co:5432/postgres"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
