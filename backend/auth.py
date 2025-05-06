from functools import wraps
from flask import request, jsonify, current_app
import jwt
from datetime import datetime, timedelta
from models import User

def generate_token(user):
    """Gera um token JWT para o usuário"""
    payload = {
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=1)  # Token expira em 1 dia
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    """Decorator para proteger rotas que requerem autenticação"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Verifica se o token foi enviado no header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Formato: "Bearer <token>"
            except IndexError:
                return jsonify({'message': 'Token inválido'}), 401

        if not token:
            return jsonify({'message': 'Token não fornecido'}), 401

        try:
            # Decodifica o token
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(payload['user_id'])
            
            if not current_user:
                return jsonify({'message': 'Usuário não encontrado'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401

        return f(current_user, *args, **kwargs)

    return decorated 