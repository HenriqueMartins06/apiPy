from flask import Flask
import models
from db import db


app = Flask(__name__)

#config proo banco
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/lanchonete'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#inicia banco-conecta
db.init_app(app)

@app.route("/")
def home():
    return {"msg": "ta funcionandoooo"}

# imoportar tds as rotas
from rotas.clientes import *
from rotas.produtos import *
from rotas.pedidos import *
from rotas.itemPedido import *
from rotas.formasPagamento import *

if __name__ == "__main__":
    #pra usar o banco fora
    with app.app_context():
        #cria todas as tabelas de acordo com o modelo
        db.create_all()  
    app.run(debug=True, port = 5001)