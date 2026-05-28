from flask import Flask, render_template
import models
from db import db

app = Flask(__name__)

# config pro banco
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/lanchonete'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# inicia banco/conecta
db.init_app(app)

# páginas do front
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/clientes-page")
def clientes_page():
    return render_template("clientes.html")

@app.route("/produtos-page")
def produtos_page():
    return render_template("produtos.html")

@app.route("/pedidos-page")
def pedidos_page():
    return render_template("pedidos.html")

@app.route("/item-pedido-page")
def item_pedido_page():
    return render_template("itemPedido.html")

@app.route("/forma-pagamento-page")
def forma_pagamento_page():
    return render_template("formaPagamento.html")

# importar todas as rotas da API
from rotas.clientes import *
from rotas.produtos import *
from rotas.pedidos import *
from rotas.itemPedido import *
from rotas.formasPagamento import *

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True, port=5001)