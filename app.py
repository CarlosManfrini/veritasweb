from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['JWT_SECRET_KEY'] = 'jwt_secret_key'

db = SQLAlchemy(app)
jwt = JWTManager(app)

# Definir el modelo de usuario
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Definir el modelo de votos
class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    party = db.Column(db.String(50), nullable=False)
    list_number = db.Column(db.Integer, nullable=False)
    votes = db.Column(db.Integer, nullable=False)
    observations = db.Column(db.String(200))

# Inicializa la base de datos
@app.before_first_request
def create_tables():
    db.create_all()

# Ruta para registrar un nuevo usuario (solo para fines de prueba)
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Usuario registrado exitosamente'}), 201

# Ruta para iniciar sesión y obtener el token JWT
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Credenciales inválidas'}), 401

    # Crear un token de acceso
    access_token = create_access_token(identity=user.username)
    return jsonify({'token': access_token}), 200

# Ruta protegida para almacenar votos
@app.route('/vote', methods=['POST'])
@jwt_required()
def vote():
    data = request.get_json()

    username = data['username']  # Esto puede venir del token JWT
    party = data['party']
    list_number = data['list_number']
    votes = data['votes']
    observations = data.get('observations', '')

    new_vote = Vote(username=username, party=party, list_number=list_number, votes=votes, observations=observations)
    db.session.add(new_vote)
    db.session.commit()

    return jsonify({'message': 'Voto registrado exitosamente'}), 201

# Ruta para ver los votos almacenados (protegida)
@app.route('/votes', methods=['GET'])
@jwt_required()
def get_votes():
    votes = Vote.query.all()
    output = []
    for vote in votes:
        vote_data = {
            'username': vote.username,
            'party': vote.party,
            'list_number': vote.list_number,
            'votes': vote.votes,
            'observations': vote.observations
        }
        output.append(vote_data)

    return jsonify({'votes': output}), 200

if __name__ == '__main__':
    app.run(debug=True)
