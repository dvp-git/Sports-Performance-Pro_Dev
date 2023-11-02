# app/routes.py
from app import app,db
from app.models import Coaches, Athletes, Teams, TeamMemberships, Workouts, Blocks, Exercises, Notes, AthleteExercises, AthleteBlocks, AthleteWorkouts, TeamWorkoutsAssignments
from flask import jsonify,request, Flask, render_template, request, redirect, url_for, session
from app import methods
from mysqlx import IntegrityError
from flask_bcrypt import Bcrypt
from sqlalchemy import insert
bcrypt = Bcrypt(app)
#Get all coaches or get coaches by id
@app.route('/getAllCoaches', methods=['GET'])
def get_all_coaches():
    coach_id = request.args.get('coachId')
    if coach_id is not None:
        coach = Coaches.query.filter(Coaches.coach_id == coach_id).first()
        if coach:
            coach_data = {
                'coach_id': coach.coach_id,
                'name': coach.name,
                'address': coach.address,
                'email': coach.email,
                'gender': coach.gender
            }
            return jsonify(coach_data)
        else:
            return jsonify({'error': 'Coach not found'}), 404
    else:
        coaches = Coaches.query.all()
        coach_list = []
        for coach in coaches:
            coach_data = {
                'coach_id': coach.coach_id,
                'name': coach.name,
                'address': coach.address,
                'email': coach.email,
                'gender': coach.gender
            }
            coach_list.append(coach_data)
        return jsonify(coaches=coach_list)


#add a new coach to the system
@app.route('/addNewCoach', methods=['POST'])
def add_new_coach():
    try:
        data = request.get_json()
        new_coach = Coaches(
            name=data['name'],
            address=data['address'],
            email=data['email'],
            gender=data['gender']
        )
        db.session.add(new_coach)
        db.session.commit()

        return jsonify({'message': 'Coach added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400



#Add an athlete
@app.route('/addAthlete', methods=['POST'])
def add_athlete():
    try:
        data = request.get_json()
        coach = Coaches.query.get(data['coach_id'])
        if not coach:
            return jsonify({'error': 'Coach not found'}), 404
        new_athlete = Athletes(
            name=data['name'],
            coach_id=data['coach_id']
        )
        db.session.add(new_athlete)
        db.session.commit()

        return jsonify({'message': 'Athlete added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400



#Add a team
@app.route('/addTeam', methods=['POST'])
def add_team():
    try:
        data = request.get_json()

        coach = Coaches.query.get(data['coach_id'])
        if not coach:
            return jsonify({'error': 'Coach not found'}), 404

        new_team = Teams(
            name=data['name'],
            sport=data['sport'],
            coach_id=data['coach_id']
        )

        db.session.add(new_team)

        db.session.commit()

        return jsonify({'message': 'Team added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400



#Add Team Memberships
@app.route('/addTeamMemberships', methods=['POST'])
def add_team_membership():
    try:
        data = request.get_json()

        athlete = Athletes.query.get(data['athlete_id'])
        team = Teams.query.get(data['team_id'])

        if not athlete:
            return jsonify({'error': 'Athlete not found'}), 404

        if not team:
            return jsonify({'error': 'Team not found'}), 404

        new_membership = TeamMemberships(
            athlete_id=data['athlete_id'],
            team_id=data['team_id']
        )

        db.session.add(new_membership)

        db.session.commit()

        return jsonify({'message': 'Team membership added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400



#Get athletes team wise for a particular coach
@app.route('/getAthletes', methods=['GET'])
def get_coach_with_teams_and_athletes():
    coach_id = request.args.get('coachId')
    if(coach_id is not None):
        try:
            coach = Coaches.query.get(coach_id)
            if not coach:
                return jsonify({'error': 'Coach not found'}), 404

            teams = Teams.query.filter_by(coach_id=coach_id).all()

            response_data = {
                'coach_id': coach.coach_id,
                'coach_name': coach.name,
                'teams': []
            }

           
            for team in teams:
                team_data = {
                    'team_id': team.team_id,
                    'team_name': team.name,
                    'athletes': []
                }
                athletes = Athletes.query.join(TeamMemberships).filter_by(team_id=team.team_id).all()

                for athlete in athletes:
                    athlete_data = {
                        'athlete_id': athlete.athlete_id,
                        'athlete_name': athlete.name,
                        'sport': team.sport 
                    }
                    team_data['athletes'].append(athlete_data)

                response_data['teams'].append(team_data)

            return jsonify(response_data), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    else:
        return jsonify({'error: coachId not found in request'}), 400


# Add a workout
@app.route('/addNewWorkout', methods=['POST'])
def add_workout():
    try:
        data = request.get_json()
        if 'name' not in data or 'coach_id' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        if 'athlete_id' in data:
            athlete = Athletes.query.get(data['athlete_id'])
            if not athlete:
                return jsonify({'error': 'Athlete not found'}), 404

            new_workout = Workouts(name=data['name'], coach_id=data['coach_id'])
            db.session.add(new_workout)
            db.session.commit()

            athlete_workout = AthleteWorkouts(
                athlete_id=data['athlete_id'],
                workout_id=new_workout.workout_id,
                date_completed=data.get('date_completed')
            )
            db.session.add(athlete_workout)
        elif 'team_id' in data:
            team = Teams.query.get(data['team_id'])
            if not team:
                return jsonify({'error': 'Team not found'}), 404

            new_workout = Workouts(name=data['name'], coach_id=data['coach_id'])
            db.session.add(new_workout)
            db.session.commit()

            team_workout_assignment = TeamWorkoutsAssignments(
                team_id=data['team_id'],
                workout_id=new_workout.workout_id
            )
            db.session.add(team_workout_assignment)
        else:
            return jsonify({'error': 'Either athlete_id or team_id must be provided in the payload'}), 400

        db.session.commit()

        return jsonify({'message': 'Workout added successfully', 'workout_id': new_workout.workout_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    

# Add a new block
@app.route('/addNewBlock', methods=['POST'])
def add_block():
    try:
        data = request.get_json()
        if 'name' not in data or 'workout_id' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        workout = Workouts.query.get(data['workout_id'])
        if not workout:
            return jsonify({'error': 'Workout not found'}), 404

        # Create a new block instance and add it to the database
        new_block = Blocks(name=data['name'], workout_id=data['workout_id'])
        db.session.add(new_block)
        db.session.commit()
        return jsonify({'message': 'Block added successfully', 'block_id': new_block.block_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Route to add an exercise (POST)
@app.route('/addNewExercise', methods=['POST'])
def add_exercise():
    try:
        # Parse the request JSON data
        data = request.get_json()

        # Ensure that the required fields are present in the request
        if 'block_id' not in data or 'name' not in data or 'loads_reps' not in data:
            return jsonify({'error': 'Missing required fields'}), 400

        # Check if the specified block_id exists
        block = Blocks.query.get(data['block_id'])
        if not block:
            return jsonify({'error': 'Block not found'}), 404

        # Create a new exercise instance and add it to the database
        new_exercise = Exercises(
            block_id=data['block_id'],
            name=data['name'],
            loads_reps=data['loads_reps'],  # Use loads_reps for combined data
            sets=data.get('sets')
        )
        db.session.add(new_exercise)
        db.session.commit()

        # Return a success response
        return jsonify({'message': 'Exercise added successfully', 'exercise_id': new_exercise.exercise_id}), 201
    except Exception as e:
        # Handle any errors and return an error response
        return jsonify({'error': str(e)}), 400





@app.route('/getAthleteWorkout')

# Get a particular workout with workout id
@app.route('/getWorkout', methods=['GET'])
def get_workout():
    try:
        athlete_id = request.args.get('athleteId', type=int)
        team_id = request.args.get('teamId', type=int)
        coach_id = request.args.get('coachId', type=int)
        date = request.args.get('date', type=str)  # You can adjust the data type as needed

        workouts_query = Workouts.query

        if athlete_id is not None:
            workouts_query = workouts_query.filter(
                Workouts.workout_id.in_(
                    db.session.query(AthleteWorkouts.workout_id).filter_by(athlete_id=athlete_id)
                )
            )
        elif team_id is not None:
            workouts_query = workouts_query.filter(
                Workouts.workout_id.in_(
                    db.session.query(TeamWorkoutsAssignments.workout_id).filter_by(team_id=team_id)
                )
            )
        else:
            return jsonify({"error": "Provide either athleteId or teamId"}), 400

        if coach_id is not None:
            workouts_query = workouts_query.filter_by(coach_id=coach_id)

        if date:
            workouts_query = workouts_query.filter(Workouts.date_added == date)

        workouts = workouts_query.all()

        if not workouts:
            return jsonify({'message': 'No workouts found with the provided constraints'})

        workout_list = []
        for workout in workouts:
            workout_data = {
                'workout_name': workout.name,
                'date_added': workout.date_added.strftime('%Y-%m-%d'),
                'coach_name': workout.coach.name,
                'blocks': []
            }

            blocks = Blocks.query.filter_by(workout_id=workout.workout_id).all()

            for block in blocks:
                block_data = {
                    'block_name': block.name,
                    'exercises': []
                }

                exercises = Exercises.query.filter_by(block_id=block.block_id).all()

                for exercise in exercises:
                    exercise_data = {
                        'exercise_name': exercise.name,
                        'loads_reps': exercise.loads_reps,
                        'sets': exercise.sets
                    }
                    block_data['exercises'].append(exercise_data)
                workout_data['blocks'].append(block_data)
            workout_list.append(workout_data)
        return jsonify(workout_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


#To add a new note
@app.route('/addNote', methods=['POST'])
def add_note():
    data = request.json
    new_note = Notes(
        coach_id=data['coach_id'],
        athlete_id=data['athlete_id'],
        date_created=data['date_created'],
        subject=data['subject'],
        coach_reply=data.get('coach_reply', None),
        athlete_reply=data.get('athlete_reply', None)
    )
    db.session.add(new_note)
    db.session.commit()
    return jsonify({"message": "Note added successfully"})

#Update Note 
@app.route('/updateNote/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    data = request.json
    new_athlete_reply = data.get('athlete_reply')
    note_to_update = Notes.query.get(note_id)

    if note_to_update:
        note_to_update.athlete_reply = new_athlete_reply
        db.session.commit()
        return jsonify({"message": "Note updated successfully"})
    else:
        return jsonify({"message": "Note not found or update failed"}, 404)

# Define a route to retrieve notes for a specific coach and athlete with only date_created and content
@app.route('/getNotes', methods=['GET'])
def get_notes():
    coach_id = request.args.get('coachId')
    athlete_id = request.args.get('athleteId')

    if not coach_id or not athlete_id:
        return jsonify({"error": "Both coachId and athleteId are required"}), 400

    notes = Notes.query.filter_by(coach_id=coach_id, athlete_id=athlete_id).all()

    if not notes:
        return jsonify({"message": "No notes found for the given coach and athlete"})

    note_list = [
        {
           'date_created': note.date_created.strftime('%Y-%m-%d'),
            'subject': note.subject,
            'athlete_reply': note.athlete_reply,
            'coach_reply': note.coach_reply
        }
        for note in notes
   ]
    return jsonify({"notes": note_list})


#Route for coach home
@app.route('/coachAthleteHome')
def coach_signup():
    return render_template("login.html")

#Route for coach login
@app.route('/coachLogin', methods=['POST'])
def coach_login():
    if request.method == 'POST':
        data = request.get_json(force=True)
        if methods.coaches_username_is_valid(data.get('username'), data.get('password')):
            session['username'] = data.get('username')
            return "Successful"
        else:
            message="Wrong coach username password!"
            return message


# FIXME: CHAT-GPT snippet:
# Route for coach login
# @app.route('/coachLogin', methods=['POST'])
# def coach_login():
#     if request.method == 'POST':
#         data = request.get_json(force=True)
#         username = data.get('username')
        
#         # Check if coach username and password are valid
#         if methods.coaches_username_is_valid(username, data.get('password')):
#             # Fetch coach details based on the username
#             coach_details = fetch_coach_details(username)
#             print("Details of coach id : ",coach_details.coach_id)
#             # Store coach details in session or send them in the response
#             session['username'] = coach_details.email
#             session['id'] = coach_details.coach_id
#             session['loggedin'] = True
#             # return jsonify(coach_details)  # Return coach details as JSON
#             return "Successful" 
#         else:
#             message = "Wrong coach username or password!"
#             return message
        
@app.route('/getCoachUsername', methods=['GET'])
def get_coach_username():
    if len(session)!= 0:
        # print(session['username'])
        return jsonify(session)
    else:
        return "Not logged in"
    




#Route for coach landing
@app.route('/coachLanding')
def coach_landing():
    return render_template("coach-landing-page.html")
    

# Route for athlete login
@app.route('/athleteLogin', methods=['POST'])
def athlete_login():
    if request.method == 'POST':
        data = request.get_json(force=True)
        # print(data)
        athlete_fetched =  methods.athlete_username_is_valid(data.get('username'), data.get('password'))
        
        # If None is returned , wrong username
        if not (athlete_fetched):   
            message="Wrong athlete username password!"
            return message
        else:
            session['username'] = data.get('username')
            # return  Details of the user   ## FIXME: REQUIRED OR NOT
            athlete_data = {
                'athlete_id': athlete_fetched.athlete_id,
                'name': athlete_fetched.name,
                'phone': athlete_fetched.phone,
                'email': athlete_fetched.email,
                'gender': athlete_fetched.gender,
                'sports':athlete_fetched.sports,
                'institute':athlete_fetched.institute,
                'age':athlete_fetched.age,
            }
            return jsonify(athlete_data)


#Route for succesful athlete login and landing page
@app.route('/athleteLanding')
def athlete_landing():
    return render_template("athlete_landing-page.html")


#Route for coach registration page
@app.route('/registerCoach')
def register_coach():
    return render_template("registration-coach.html")


#Route for athlete registration page
@app.route('/registerAthlete')
def register_athlete():
    return render_template("registration-athlete.html")


#Route for athlete registration post to DB
@app.route('/postAthlete', methods=['POST'])
def post_athlete():
    data = request.get_json(force=True)
    email = data.get('email')
    phone=data.get('phone')
    existing_athlete = Athletes.query.filter_by(email=email).first() or Athletes.query.filter_by(phone=phone).first()
    if existing_athlete:
        return "User exists, try logging in!"
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    if 'sports' in data and isinstance(data['sports'], list):
        sports_string = ', '.join(data['sports'])
    # If email does not exist, create a new athlete
    new_athlete = Athletes(
        name=data['name'],
        phone=data['phone'],
        gender=data['gender'],
        password=hashed_password,
        email=data['email'],
        age=data.get('age'),
        sports=sports_string,
        institute=data.get('institute')
    )
    
    db.session.add(new_athlete)
    db.session.commit()
    return "Registration successful, go to login!"


#Route for coach registration post to DB
@app.route('/postCoach', methods=['POST'])
def post_coach():
    data = request.get_json(force=True)
    email = data.get('email')
    phone=data.get('phone')
    existing_coach = Coaches.query.filter_by(email=email).first() or Coaches.query.filter_by(phone=phone).first()
    if existing_coach:
        return "User exists, try logging in!"
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    if 'sports' in data and isinstance(data['sports'], list):
        sports_string = ', '.join(data['sports'])
    # If email does not exist, create a new athlete
    new_coach = Coaches(
        name=data['name'],
        phone=data['phone'],
        sports=sports_string,
        institute=data.get('institute'),
        password=hashed_password,
        email=data['email']
    )
    db.session.add(new_coach)
    db.session.commit()
    return "Registration successful, go to login!"


@app.route('/adminLogin')
def admin_login():
    return render_template("admin_login.html")


#Route for athlete login
@app.route('/adminPost', methods=['POST'])
def admin_post():
    if request.method == 'POST':
        data = request.get_json(force=True)
        if methods.admin_username_is_valid(data.get('username'), data.get('password')):
            session['username'] = data.get('username')
            return "Successful"
        else:
            message="Wrong admin username password!"
            return message


#Route for succesful athlete login and landing page
@app.route('/adminLanding')
def admin_landing():
    return render_template("Admin_landing.html")




@app.route('/signup-coach', methods=['GET', 'POST'])
def signup():
    if not (request.method == 'GET'):
        try : 
            user_data = request.get_json()
            print(user_data)
            sports_str = ','.join(user_data['sports'])
            #   if not user_data:
            #     return jsonify({'error': 'Coach not found'}), 404
            # print("below is printing")
            # print(','.join(user_data['sports']))
            new_User = Coaches(
                    name=user_data['name'],
                    email = user_data['email'],
                    password= user_data['password'],
                    phone =user_data['phone'],
                    sports = sports_str,
                    institute = user_data['institute']
                )
            db.session.add(new_User)
            db.session.commit()
            # print(Coaches.query.all())
            return jsonify({'message': 'Coach added successfully'}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    return render_template('registration-coach.html')


@app.route('/signup-athlete', methods=['GET', 'POST'])
def athlete_signup():
    if not (request.method == 'GET'):
        try : 
            user_data = request.get_json()
            print(user_data)
            user_age = int(user_data['age'])
            sports_str = ','.join(user_data['sports'])
            #   if not user_data:
            #     return jsonify({'error': 'Coach not found'}), 404
            print("below is printing")
            print(','.join(user_data['sports']))
            new_User = Athletes(
                    name = user_data['name'],
                    email = user_data['email'],
                    password= user_data['password'],
                    phone =user_data['phone'],
                    sports = sports_str,
                    institute = user_data['institute'],
                    gender =  user_data['gender'],
                    age = user_age,
                )
            db.session.add(new_User)
            db.session.commit()
            # print(Athletes.query.all())
            return jsonify({'message': 'Athlete added successfully'}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    return render_template('registration-athlete.html')


@app.route('/createTeamAndMemberships', methods=['POST'])
def create_team_and_memberships():
    try:
        data = request.get_json()

        # Validate data and check for required fields
        if 'name' not in data or 'sport' not in data or 'coach_id' not in data or 'athlete_ids' not in data:
            return jsonify({'error': 'Missing required fields'}), 400

        coach = Coaches.query.get(data['coach_id'])
        if not coach:
            return jsonify({'error': 'Coach not found'}), 404

        new_team = Teams(
            name=data['name'],
            sport=data['sport'],
            coach_id=data['coach_id']
        )

        db.session.add(new_team)
        db.session.commit()

        team_id = new_team.team_id

        # Iterate over the list of athlete_ids and create team memberships
        for athlete_id in data['athlete_ids']:
            athlete = Athletes.query.get(athlete_id)

            if not athlete:
                return jsonify({'error': f'Athlete with ID {athlete_id} not found'}), 404

            new_membership = TeamMemberships(
                athlete_id=athlete_id,
                team_id=team_id
            )

            db.session.add(new_membership)

        db.session.commit()

        return jsonify({'message': 'Team created and athletes added successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/viewTeam')
def viewTeam():
    return render_template('view-team.html')

@app.route('/createTeam')
def createTeam():
    return render_template('create-team.html')

@app.route('/addTeamAthlete')
def addTeamAthlete():
    return render_template('add-team-athlete.html')



# Route for getting the teams for a particular athlete : DARRYL
@app.route('/getTeamsForAthlete', methods=['GET'])
def get_teams_for_athlete():
    athlete_id = int(request.args.get('athlete_id'))
    if athlete_id is not None:
        try:
            athlete = Athletes.query.filter_by(athlete_id=athlete_id)
            if not athlete:
                return jsonify({"Error" : "Athlete note found"}), 400
            
            teams = Teams.query.join(TeamMemberships).filter_by(athlete_id=athlete_id).all()

            if teams is not None: 
                teams_list = []

                for team in teams:
                    team_data = {
                        'team_id': team.team_id,
                        'name': team.name,
                        'sport': team.sport,
                        'coach_id': team.coach_id,
                    }
                    teams_list.append(team_data)

                return jsonify(teams=teams_list), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    else:
        return jsonify({'error': 'teamId not found in the request'}), 400




@app.route('/getTeamsForAthlete2', methods=['GET'])
def get_teams_for_athlete2():
    athlete_id = int(request.args.get('athlete_id'))
    if athlete_id is not None:
        try:
            athlete = Athletes.query.filter_by(athlete_id=athlete_id)
            if not athlete:
                return jsonify({"Error" : "Athlete note found"}), 400
            
            # Query the TeamMemberships table to get the teams of the athlete
            team_memberships = TeamMemberships.query.filter_by(athlete_id=athlete_id).all()
            
            # Extract the team IDs from the team memberships
            team_ids = [membership.team_id for membership in team_memberships]
            
            # Query the Teams table to get the details of the teams
            teams = Teams.query.filter(Teams.team_id.in_(team_ids)).all()
            
            # Prepare a list of team details
            team_list = []
            for team in teams:
                team_list.append({
                    'team_id': team.team_id,
                    'name': team.name,
                    'sport': team.sport,
                    'coach_id': team.coach_id
                })
            
            return jsonify({'teams': team_list})
        
        except Exception as e:
            return jsonify({'error': str(e)})
    




@app.route('/getAthletesForTeam', methods=['GET'])
def get_athletes_for_team():
    team_id = request.args.get('teamId')
    if team_id is not None:
        try:
            team = Teams.query.get(team_id)
            if not team:
                return jsonify({'error': 'Team not found'}), 404

            athletes = Athletes.query.join(TeamMemberships).filter_by(team_id=team_id).all()

            # Creating a list of athlete data
            athlete_list = []

            for athlete in athletes:
                athlete_data = {
                    'athlete_id': athlete.athlete_id,
                    'name': athlete.name,
                    'email': athlete.email,
                    'phone': athlete.phone,
                    'sports': athlete.sports,
                    'institute': athlete.institute,
                    'gender': athlete.gender,
                    'age': athlete.age,
                }
                athlete_list.append(athlete_data)

            return jsonify(athletes=athlete_list), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    else:
        return jsonify({'error': 'teamId not found in the request'}), 400



# Define the /getTeamName API endpoint
@app.route('/getTeamName', methods=['GET'])
def get_team_name():
    # Get the teamId from the query parameters
    team_id = request.args.get('teamId')

    # Query the Teams model to get the team name
    team = Teams.query.get(team_id)

    if team:
        # Team exists; retrieve the name
        team_name = team.name
        return jsonify({'teamName': team_name})
    else:
        # Team not found
        return jsonify({'error': 'Team not found'}), 404



# Define API for getting all teams for an athlete




@app.route('/removeAthleteFromTeam', methods=['DELETE'])
def remove_athlete_from_team():
    try:
        athlete_id = int(request.form.get('athleteId'))
        team_id = int(request.form.get('teamId'))

        # Remove the athlete from the team
        team_membership = TeamMemberships.query.filter_by(athlete_id=athlete_id, team_id=team_id).first()
        if team_membership:
            db.session.delete(team_membership)
            db.session.commit()
            return jsonify({"message": "Athlete removed from the team successfully"})
        else:
            return jsonify({"error": "Athlete not found in the team"})

    except Exception as e:
        return jsonify({"error": "Failed to remove athlete from the team: " + str(e)})
    


@app.route('/deleteTeam', methods=['DELETE'])
def delete_team():
    try:
        team_id = int(request.form.get('teamId'))

        # Delete the team and its memberships
        team = Teams.query.get(team_id)
        if team:
            # Delete the associated team memberships
            TeamMemberships.query.filter_by(team_id=team_id).delete()
            db.session.delete(team)
            db.session.commit()
            return jsonify({"message": "Team and its memberships deleted successfully"})
        else:
            return jsonify({"error": "Team not found"})

    except Exception as e:
        return jsonify({"error": "Failed to delete team: " + str(e)})



# Define a route to update the team name
@app.route('/updateTeamName', methods=['PUT'])
def update_team_name():
    try:
        # Get the team ID from the request
        team_id = request.args.get('teamId')
        
        # Get the new team name from the request
        new_team_name = request.json.get('newTeamName')

        # Retrieve the team record from the database
        team = Teams.query.filter_by(team_id=team_id).first()

        if team:
            # Update the team name
            team.name = new_team_name

            # Commit the changes to the database
            db.session.commit()

            # Respond with a success message
            return jsonify({'message': 'Team name updated successfully'})
        else:
            return jsonify({'error': 'Team not found'})

    except Exception as e:
        # Handle errors and respond with an error message
        return jsonify({'error': 'Failed to update team name', 'details': str(e)})
    



# API endpoint to add an athlete to the team
@app.route('/addAthleteToTeam', methods=['POST'])
def add_athlete_to_team():
    try:
        data = request.json
        team_id = data.get('team_id')
        athlete_id = data.get('athlete_id')

        print(athlete_id)

        # Check if the athlete is already a member of the team
        existing_membership = TeamMemberships.query.filter_by(
            team_id=team_id, athlete_id=athlete_id).first()

        if existing_membership:
            return jsonify({'message': 'Athlete is already a member of the team.'}), 400

        # Create a new membership
        membership = TeamMemberships(team_id=team_id, athlete_id=athlete_id)
        db.session.add(membership)
        db.session.commit()

        return jsonify({'message': 'Athlete added to the team successfully.'}), 201

    except IntegrityError:
        # Handle database integrity errors (e.g., duplicate keys)
        return jsonify({'error': 'Database integrity error. Athlete might already be a member of the team.'}), 400
    except Exception as e:
        # Handle other exceptions
        return jsonify({'error': 'Failed to add athlete to the team.', 'details': str(e)}), 500
    



@app.route('/getAllAthletes', methods=['GET'])
def get_all_athletes():
    # Query the database to get all teams
    athletes = Athletes.query.all()
    
    # Create a list to store the team data
    athlete_list = []

    # Iterate through the teams and convert them to dictionaries
    for athlete in athletes:
        athlete_data = {
            'athlete_id': athlete.athlete_id,
            'name': athlete.name,
            'sports': athlete.sports,
            'institute' : athlete.institute
            # 'coach_id': athlete.coach_id
            # Add more fields as needed
        }
        athlete_list.append(athlete_data)

    # Return the team data as JSON
    return jsonify(athletes=athlete_list)




@app.route('/getAllTeams', methods=['GET'])
def get_all_teams():
    # Query the database to get all teams
    teams = Teams.query.all()
    
    # Create a list to store the team data
    team_list = []

    # Iterate through the teams and convert them to dictionaries
    for team in teams:
        team_data = {
            'team_id': team.team_id,
            'name': team.name,
            'sports': team.sport,
            'coach_id': team.coach_id
            # Add more fields as needed
        }
        team_list.append(team_data)

    # Return the team data as JSON
    return jsonify(teams=team_list)






