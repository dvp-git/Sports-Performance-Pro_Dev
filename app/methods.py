def username_is_valid(email, password):
    coach = Coaches.query.filter_by(email=email).first()
    if coach and bcrypt.checkpw(password.encode('utf-8'), coach.password_hash.encode('utf-8')):
        return coach  
    else:
        return None 