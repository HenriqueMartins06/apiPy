from flask import jsonify, request
from db import db
from models import ItemPedido
from app import app 

# cria
@app.route('/itemPedido', methods=['POST'])
def criar_item():
    dados = request.json

    item = ItemPedido(
        pedido_id=dados['pedido_id'],
        produto_id=dados['produto_id'],
        quantidade=dados['quantidade']
    )

    db.session.add(item)
    db.session.commit()

    return jsonify(item.para_dic()), 201


# lista tudo
@app.route('/itemPedido', methods=['GET'])
def listar_itens():
    itens = ItemPedido.query.all()
    return jsonify([i.para_dic() for i in itens])


# procura por id
@app.route('/itemPedido/<int:id>', methods=['GET'])
def buscar_item(id):
    item = ItemPedido.query.get(id)

    if not item:
        return jsonify({"erro": "Item não encontrado"}), 404

    return jsonify(item.para_dic())


# atualiza
@app.route('/itemPedido/<int:id>', methods=['PUT'])
def atualizar_item(id):
    item = ItemPedido.query.get(id)

    if not item:
        return jsonify({"erro": "Item não encontrado"}), 404

    dados = request.json
    item.pedido_id = dados['pedido_id']
    item.produto_id = dados['produto_id']
    item.quantidade = dados['quantidade']

    db.session.commit()

    return jsonify(item.para_dic())


# exxclui
@app.route('/itemPedido/<int:id>', methods=['DELETE'])
def deletar_item(id):
    item = ItemPedido.query.get(id)

    if not item:
        return jsonify({"erro": "Item não encontrado"}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({"msg": "Item deletado"})