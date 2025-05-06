from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import logging
from models import db, User, TranslationHistory
from auth import generate_token, token_required
import requests
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

app = Flask(__name__)

# Configurar CORS para aceitar requisições do frontend
allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
CORS(app, origins=allowed_origins)

# Configuração do banco de dados
db_path = os.environ.get('DATABASE_URI', 'sqlite:///app.db')
if db_path.startswith('sqlite:///'):
    # Garantir que o caminho do SQLite seja absoluto para o PythonAnywhere
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_path = f'sqlite:///{os.path.join(basedir, db_path.replace("sqlite:///", ""))}'

app.config['SQLALCHEMY_DATABASE_URI'] = db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'chave-secreta-desenvolvimento')

# URL da API de tradução (pode ser configurada via variável de ambiente)
TRANSLATE_API_URL = os.environ.get('TRANSLATE_API_URL', 'http://localhost:5002')

# Inicialização do banco de dados
db.init_app(app)

# Configuração do logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Criar todas as tabelas
with app.app_context():
    db.create_all()

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email já cadastrado'}), 400
            
        user = User(
            name=data['name'],
            email=data['email']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        token = generate_token(user)
        
        return jsonify({
            'message': 'Usuário registrado com sucesso',
            'token': token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        logger.error(f'Erro no registro: {str(e)}')
        return jsonify({'message': 'Erro ao registrar usuário'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'message': 'Email ou senha inválidos'}), 401
            
        token = generate_token(user)
        
        return jsonify({
            'message': 'Login realizado com sucesso',
            'token': token,
            'user': user.to_dict()
        })
        
    except Exception as e:
        logger.error(f'Erro no login: {str(e)}')
        return jsonify({'message': 'Erro ao fazer login'}), 500

@app.route('/api/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    try:
        return jsonify({
            'user': current_user.to_dict()
        })
    except Exception as e:
        logger.error(f'Erro ao buscar perfil: {str(e)}')
        return jsonify({'message': 'Erro ao buscar perfil'}), 500

@app.route('/api/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    try:
        data = request.get_json()
        
        if 'name' in data:
            current_user.name = data['name']
        if 'email' in data:
            current_user.email = data['email']
        if 'preferred_language' in data:
            current_user.preferred_language = data['preferred_language']
        if 'theme' in data:
            current_user.theme = data['theme']
        if 'auto_detect_language' in data:
            current_user.auto_detect_language = data['auto_detect_language']
            
        db.session.commit()
        
        return jsonify({
            'message': 'Perfil atualizado com sucesso',
            'user': current_user.to_dict()
        })
        
    except Exception as e:
        logger.error(f'Erro ao atualizar perfil: {str(e)}')
        return jsonify({'message': 'Erro ao atualizar perfil'}), 500

@app.route('/api/translate', methods=['POST'])
@token_required
def translate(current_user):
    try:
        data = request.get_json()
        
        payload = {
            'q': data['text'],
            'source': data.get('source', 'auto'),
            'target': data.get('target', current_user.preferred_language),
            'format': 'text'
        }
        
        response = requests.post(f'{TRANSLATE_API_URL}/translate', json=payload)
        response.raise_for_status()
        
        result = response.json()
        
        # Salvar a tradução no histórico
        translation = TranslationHistory(
            user_id=current_user.id,
            source_text=data['text'],
            translated_text=result['translatedText'],
            source_language=result.get('detectedLanguage', {}).get('language', payload['source']),
            target_language=payload['target']
        )
        
        db.session.add(translation)
        db.session.commit()
        
        return jsonify({
            'translated_text': result['translatedText'],
            'detected_language': result.get('detectedLanguage', {}).get('language', 'unknown')
        })
        
    except requests.exceptions.RequestException as e:
        logger.error(f'Erro na tradução: {str(e)}')
        return jsonify({'message': 'Erro ao traduzir texto'}), 500
    except Exception as e:
        logger.error(f'Erro inesperado: {str(e)}')
        return jsonify({'message': 'Erro inesperado'}), 500

@app.route('/api/detect', methods=['POST'])
@token_required
def detect_language(current_user):
    try:
        data = request.get_json()
        
        payload = {
            'q': data['text']
        }
        
        response = requests.post(f'{TRANSLATE_API_URL}/detect', json=payload)
        response.raise_for_status()
        
        result = response.json()
        
        return jsonify({
            'detected_language': result[0]['language'],
            'confidence': result[0]['confidence']
        })
        
    except requests.exceptions.RequestException as e:
        logger.error(f'Erro na detecção de idioma: {str(e)}')
        return jsonify({'message': 'Erro ao detectar idioma'}), 500
    except Exception as e:
        logger.error(f'Erro inesperado: {str(e)}')
        return jsonify({'message': 'Erro inesperado'}), 500

@app.route('/api/translations', methods=['GET'])
@token_required
def get_translation_history(current_user):
    try:
        translations = TranslationHistory.query.filter_by(user_id=current_user.id).order_by(TranslationHistory.created_at.desc()).all()
        return jsonify({
            'translations': [translation.to_dict() for translation in translations]
        })
    except Exception as e:
        logger.error(f'Erro ao buscar histórico de traduções: {str(e)}')
        return jsonify({'message': 'Erro ao buscar histórico de traduções'}), 500

@app.route('/api/translations/<int:translation_id>', methods=['DELETE'])
@token_required
def delete_translation(current_user, translation_id):
    try:
        translation = TranslationHistory.query.filter_by(id=translation_id, user_id=current_user.id).first()
        
        if not translation:
            return jsonify({'message': 'Tradução não encontrada'}), 404
            
        db.session.delete(translation)
        db.session.commit()
        
        return jsonify({'message': 'Tradução removida com sucesso'})
    except Exception as e:
        logger.error(f'Erro ao remover tradução: {str(e)}')
        return jsonify({'message': 'Erro ao remover tradução'}), 500

@app.route('/api/translations', methods=['DELETE'])
@token_required
def clear_translation_history(current_user):
    try:
        translations = TranslationHistory.query.filter_by(user_id=current_user.id).all()
        
        for translation in translations:
            db.session.delete(translation)
            
        db.session.commit()
        
        return jsonify({'message': 'Histórico de traduções limpo com sucesso'})
    except Exception as e:
        logger.error(f'Erro ao limpar histórico de traduções: {str(e)}')
        return jsonify({'message': 'Erro ao limpar histórico de traduções'}), 500

# Rota de verificação de saúde da API (útil para monitoramento)
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'API funcionando corretamente'})

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))