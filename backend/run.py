from flask import Flask
from flask_cors import CORS
from app.models import db
from app.routes.auth_routes import auth_bp  # Import your blueprint
from app.routes.project_routes import project_bp
from app.routes.bug_routes import bug_bp
import os
from dotenv import load_dotenv


load_dotenv()  # loads .env



    
app = Flask(__name__)

# 1. Database Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydb.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
print(f"Using DB at: {app.config['SQLALCHEMY_DATABASE_URI']}")
app.secret_key = os.getenv("SECRET_KEY")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL")
# 2. Enable CORS (allow frontend access)
CORS(app, origins=[os.getenv("FRONTEND_URL")], supports_credentials=True)

# 3. Register Auth Blueprint with correct prefix
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(project_bp, url_prefix='/api/projects')
app.register_blueprint(bug_bp, url_prefix='/api/bugs')

# 4. Create DB Tables
with app.app_context():
     
     db.create_all()
    
    
if __name__ == '__main__':
    app.run(debug=True)
