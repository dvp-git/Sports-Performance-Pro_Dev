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

class Admin(db.Model):
    admin_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)


class Athletes(db.Model):
    athlete_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), unique=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    age = db.Column(db.Integer)
    sports = db.Column(db.String(255))
    gender = db.Column(db.String(30), db.CheckConstraint("gender IN ('Male', 'Female', 'Non-binary','Transgender','Genderqueer','Other')"),nullable=False) 
    institute = db.Column(db.String(255))
    password = db.Column(db.String(60), nullable=False)
    # coach_id = db.Column(db.Integer, db.ForeignKey('coaches.coach_id'), nullable=False)
    # coach = db.relationship('Coaches', backref='athletes')


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
    workout_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    date_added = db.Column(db.Date, default=date.today())
    coach_id = db.Column(db.Integer, db.ForeignKey('coaches.coach_id'), nullable=False)
    # athlete_id =  db.Column(db.Integer, db.ForeignKey('athletes.athlete_id'))
    # team_id = db.Column(db.Integer,db.ForeignKey('teams.team_id'))
    # Define a relationship with Coach and Athletes
    coach = db.relationship('Coaches', backref=db.backref('assigned_workouts', lazy=True))
    # athlete = db.relationship('Athletes', backref=db.backref('workouts', lazy=True))
    # team = db.relationship('Teams',backref=db.backref('team_workouts', lazy=True))

    
class Blocks(db.Model):
    block_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.workout_id'), nullable=False)
    workout = db.relationship('Workouts', backref=db.backref('blocks', lazy=True))

class Exercises(db.Model):
    exercise_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    loads_reps = db.Column(JSON) 
    sets = db.Column(db.Integer)
    block_id = db.Column(db.Integer, db.ForeignKey('blocks.block_id'), nullable=False)
    block = db.relationship('Blocks', backref=db.backref('exercises', lazy=True))


class Notes(db.Model):
    note_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    coach_id = db.Column(db.Integer, db.ForeignKey('coaches.coach_id'), nullable=False)
    athlete_id = db.Column(db.Integer, db.ForeignKey('athletes.athlete_id'), nullable=False)
    date_created = db.Column(db.Date, nullable=False)
    subject = db.Column(db.String, nullable=False)
    athlete_reply = db.Column(db.String, nullable=True)
    coach_reply = db.Column(db.String, nullable=True)

class TeamWorkoutsAssignments(db.Model):
    __tablename__ = 'team_workouts_assignments'
    assignment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.team_id'), nullable=False)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.workout_id'), nullable=False)


class AthleteWorkouts(db.Model):
    __tablename__ = 'athlete_workouts'
    # FIXME: Remember to change this before push : athlete_workout_id --> assignment_id
    athlete_workout_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  
    athlete_id = db.Column(db.Integer, db.ForeignKey('athletes.athlete_id'), nullable=False)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.workout_id'), nullable=False)
    athlete = db.relationship('Athletes', backref=db.backref('workout_assignments', lazy=True))
    workout = db.relationship('Workouts', backref=db.backref('assigned_athletes', lazy=True))



class CoachAthleteMembership(db.Model):
    __tablename__ = 'coach_athlete_membership'
    ca_membership_id = db.Column(db.Integer, primary_key=True)
    athlete_id = db.Column(db.Integer, db.ForeignKey('athletes.athlete_id'))
    coach_id = db.Column(db.Integer, db.ForeignKey('coaches.coach_id'))