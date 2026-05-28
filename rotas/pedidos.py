from flask import jsonify, request
from db import db
from models import Pedido
from app import app 

# Criar
@app.route('/pedidos', methods=['POST'])
def criar_pedido():

    dados = request.json

    pedido = Pedido(
        cliente_id=dados['cliente_id'],
        forma_pagamento_id=dados['forma_pagamento_id']
    )

    db.session.add(pedido)
    db.session.commit()

    return jsonify(pedido.para_dic()), 201


# Buscar todos
@app.route('/pedidos', methods=['GET'])
def listar_pedidos():

    pedidos = Pedido.query.all()

    return jsonify([p.para_dic() for p in pedidos])


# Buscar por ID
@app.route('/pedidos/<int:id>', methods=['GET'])
def buscar_pedido(id):

    pedido = Pedido.query.get(id)

    if not pedido:
        return jsonify({
            "erro": "Pedido não encontrado"
        }), 404

    return jsonify(pedido.para_dic())


# Atualizar
@app.route('/pedidos/<int:id>', methods=['PUT'])
def atualizar_pedido(id):

    pedido = Pedido.query.get(id)

    if not pedido:
        return jsonify({
            "erro": "Pedido não encontrado"
        }), 404

    dados = request.json

    pedido.cliente_id = dados['cliente_id']
    pedido.forma_pagamento_id = dados['forma_pagamento_id']

    db.session.commit()

    return jsonify(pedido.para_dic())


# Excluir
@app.route('/pedidos/<int:id>', methods=['DELETE'])
def deletar_pedido(id):

    pedido = Pedido.query.get(id)

    if not pedido:
        return jsonify({
            "erro": "Pedido não encontrado"
        }), 404

    try:

        db.session.delete(pedido)
        db.session.commit()

        return jsonify({
            "msg": "Pedido deletado"
        })

    except Exception:

        db.session.rollback()

        return jsonify({
            "erro": "Não é possível excluir este pedido, pois ele possui itens vinculados."
        }), 400