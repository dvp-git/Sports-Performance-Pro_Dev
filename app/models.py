# app/models.py
from app import db
from datetime import date
from sqlalchemy.dialects.mysql import JSON

class Coaches(db.Model):
    coach_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    #gender = db.Column(db.String(1), nullable=False, check_constraint="gender IN ('M', 'F')")
    password = db.Column(db.String(60), nullable=False)
    phone = db.Column(db.String(255), unique=True)
    sports = db.Column(db.String(255))
    institute = db.Column(db.String(255))

class Athletes(db.Model):
    athlete_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), unique=True)
    sports = db.Column(db.String(255))
    gender = db.Column(db.String(10), db.CheckConstraint("gender IN ('male', 'female', 'other')"), nullable=False)
    institute = db.Column(db.String(255))
    password = db.Column(db.String(60), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    age = db.Column(db.Integer,nullable=False)
    # coach_id = db.Column(db.Integer, nullable=False)

class Teams(db.Model):
    team_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    sport = db.Column(db.String(255), nullable=False)
    coach_id = db.Column(db.Integer, db.ForeignKey('coaches.coach_id'))

class TeamMemberships(db.Model):
    __tablename__ = 'team_memberships'
    membership_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    athlete_id = db.Column(db.Integer, db.ForeignKey('athletes.athlete_id'))
    team_id = db.Column(db.Integer, db.ForeignKey('teams.team_id'))

class Workouts(db.Model):
    workout_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    coach_id = db.Column(db.Integer, db.ForeignKey('coaches.coach_id'), nullable=False)
    # Define a relationship with Coach (assuming you have a Coach model)
    coach = db.relationship('Coaches', backref=db.backref('workouts', lazy=True))
    date_added = db.Column(db.Date, default=date.today())
    
class Blocks(db.Model):
    block_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.workout_id'), nullable=False)
    workout = db.relationship('Workouts', backref=db.backref('blocks', lazy=True))


class Exercises(db.Model):
    exercise_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    block_id = db.Column(db.Integer, db.ForeignKey('blocks.block_id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    loads_reps = db.Column(JSON) 
    sets = db.Column(db.Integer)

class Notes(db.Model):
    note_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    coach_id = db.Column(db.Integer, db.ForeignKey('coaches.coach_id'), nullable=False)
    athlete_id = db.Column(db.Integer, db.ForeignKey('athletes.athlete_id'), nullable=False)
    date_created = db.Column(db.Date, nullable=False)
    content = db.Column(db.Text, nullable=False)


