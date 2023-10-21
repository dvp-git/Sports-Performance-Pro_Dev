# app/routes.py
from app import app,db
from app.models import Coaches, Athletes, Teams, TeamMemberships, Workouts, Blocks, Exercises
from flask import jsonify, request, render_template, redirect, url_for



@app.route('/login')
def login_page():
      return render_template('login.html')

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
            return jsonify({'message': 'Team added successfully'}), 201
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

            teams = Teams.query.filter_by(coach_id=coach_id).all() # list returned of all teams under coach
            
            # Creating empty response json with coach_id
            response_data = {
                'coach_id': coach.coach_id,
                'coach_name': coach.name,
                'teams': []
            }

            # Each teams JSON response
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
            'sport': team.sport,
            'coach_id': team.coach_id
            # Add more fields as needed
        }
        team_list.append(team_data)

    # Return the team data as JSON
    return jsonify(teams=team_list)



# Add a workout
@app.route('/addNewWorkout', methods=['POST'])
def add_workout():
    try:
        data = request.get_json()
        if 'name' not in data or 'coach_id' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        coach = Coaches.query.get(data['coach_id'])
        if not coach:
            return jsonify({'error': 'Coach not found'}), 404

        new_workout = Workouts(name=data['name'], coach_id=data['coach_id'])
        db.session.add(new_workout)
        db.session.commit()

        return jsonify({'message': 'Workout added successfully', 'workout_id': new_workout.workout_id}), 201
    except Exception as e:
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
        if 'block_id' not in data or 'name' not in data:
            return jsonify({'error': 'Missing required fields'}), 400

        # Check if the specified block_id exists
        block = Blocks.query.get(data['block_id'])
        if not block:
            return jsonify({'error': 'Block not found'}), 404

        # Create a new exercise instance and add it to the database
        new_exercise = Exercises(
            block_id=data['block_id'],
            name=data['name'],
            loads=data.get('loads'),
            reps=data.get('reps'),
            sets=data.get('sets')
        )
        db.session.add(new_exercise)
        db.session.commit()

        # Return a success response
        return jsonify({'message': 'Exercise added successfully', 'exercise_id': new_exercise.exercise_id}), 201
    except Exception as e:
        # Handle any errors and return an error response
        return jsonify({'error': str(e)}), 400


# Get a particular workout with workout id
@app.route('/getWorkout', methods=['GET'])
def get_workout():
    try:
        workout_id = request.args.get('workoutId', type=int)
        workout = Workouts.query.get(workout_id)
        if not workout:
            return jsonify({'error': 'Workout not found'}), 404
        coach_name = workout.coach.name
        workout_data = {
            'workout_name': workout.name,
            'coach_name': coach_name, 
            'blocks': []
        }

        blocks = Blocks.query.filter_by(workout_id=workout_id).all()

        for block in blocks:
            block_data = {
                'block_name': block.name,
                'exercises': []
            }

            exercises = Exercises.query.filter_by(block_id=block.block_id).all()

            for exercise in exercises:
                exercise_data = {
                    'exercise_name': exercise.name,
                    'loads': exercise.loads,
                    'reps': exercise.reps,
                    'sets': exercise.sets
                }
                block_data['exercises'].append(exercise_data)

            workout_data['blocks'].append(block_data)

        return jsonify(workout_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400





