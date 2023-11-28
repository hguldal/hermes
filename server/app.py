import datetime
from flask import Flask
from flask import jsonify
from flask import request
from datetime import timedelta
from flask_jwt_extended import create_refresh_token
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from chatbot import chatbot_answer
import json


app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = "hermes2021"  
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

jwt = JWTManager(app)
accessCodes=['ef4d','2cfa','dc45','ffa3','e3ad']


@app.route("/",methods=["GET"])
def index():
	return 'Merhaba ben  Hermes'

@app.route("/login", methods=["POST"])
def login():
    
    accessCode = request.json.get("AccessCode", None)
    
    if accessCode not in accessCodes:
        return jsonify({"msg": "Incorrect code"}), 200

    access_token = create_access_token(identity=accessCode, fresh=datetime.timedelta(days=365))
    refresh_token = create_refresh_token(identity=accessCode)
    return jsonify(access_token=access_token, refresh_token=refresh_token)
    

@app.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity, fresh=True)
    return jsonify(access_token=access_token)


@app.route("/question", methods=["POST"])
@jwt_required()
def question():
    question = request.json.get("question", None)
    response =  chatbot_answer(question)
    
    return jsonify(answer=response)

if __name__ == '__main__':
    app.run()
