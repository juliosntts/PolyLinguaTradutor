import sys
import os

# Adicionar o diretório do projeto ao caminho do sistema
path = '/home/SEUUSUARIO/polylingua/backend'  # Substitua SEUUSUARIO pelo seu nome de usuário do PythonAnywhere
if path not in sys.path:
    sys.path.append(path)

# Importar a aplicação Flask
from app import app as application

# Configurar variáveis de ambiente
os.environ['SECRET_KEY'] = 'chave-secreta-producao'  # Use uma chave segura em produção
os.environ['FLASK_ENV'] = 'production' 