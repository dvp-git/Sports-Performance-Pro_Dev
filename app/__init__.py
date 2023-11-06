# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

app = Flask(__name__)
app.secret_key = 'your_secret_key_here' 
app.config.from_object(Config)
db = SQLAlchemy(app)

from app import routes, models  # Import routes and models after creating app and db
