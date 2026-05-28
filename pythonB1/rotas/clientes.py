from flask import jsonify, request
from db import db
from models import Cliente
from app import app 

# Criar
@app.route('/clientes', methods=['POST'])
def criar_cliente():
    dados = request.json

    cliente = Cliente(
        nome=dados['nome'],
        telefone=dados['telefone']
    )
    db.session.add(cliente)
    db.session.commit()

    return jsonify(cliente.para_dic()), 201

# lista tudo
@app.route('/clientes', methods=['GET'])
def listar_clientes():
    clientes = Cliente.query.all()
    return jsonify([c.para_dic() for c in clientes])


# procura por ids
@app.route('/clientes/<int:id>', methods=['GET'])
def buscar_cliente(id):
    cliente = Cliente.query.get(id)

    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    return jsonify(cliente.para_dic())

# atualiza
@app.route('/clientes/<int:id>', methods=['PUT'])
def atualizar_cliente(id):
    cliente = Cliente.query.get(id)

    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    dados = request.json
    cliente.nome = dados['nome']
    cliente.telefone = dados['telefone']

    db.session.commit()

    return jsonify(cliente.para_dic())

# exluir
@app.route('/clientes/<int:id>', methods=['DELETE'])
def deletar_cliente(id):
    cliente = Cliente.query.get(id)

    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    db.session.delete(cliente)
    db.session.commit()

    return jsonify({"msg": "Cliente deletado"})
