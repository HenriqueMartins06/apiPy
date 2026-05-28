from flask import jsonify, request
from db import db
from models import Produto
from app import app  
#cria
@app.route('/produtos', methods=['POST'])
def criar_produto():
    dados = request.json

    produto = Produto(
        nome=dados['nome'],
        preco=dados['preco']
    )

    db.session.add(produto)
    db.session.commit()

    return jsonify(produto.para_dic()), 201

#listar todos

@app.route('/produtos', methods=['GET'])
def listar_produtos():
    produtos = Produto.query.all()
    return jsonify([p.para_dic() for p in produtos])

#buscar por id
@app.route('/produtos/<int:id>', methods=['GET'])
def buscar_produto(id):
    produto = Produto.query.get(id)

    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404

    return jsonify(produto.para_dic())

#atualiza
@app.route('/produtos/<int:id>', methods=['PUT'])
def atualizar_produto(id):
    produto = Produto.query.get(id)

    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404

    dados = request.json
    produto.nome = dados['nome']
    produto.preco = dados['preco']

    db.session.commit()

    return jsonify(produto.para_dic())

#exclui
@app.route('/produtos/<int:id>', methods=['DELETE'])
def deletar_produto(id):
    produto = Produto.query.get(id)

    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404

    db.session.delete(produto)
    db.session.commit()

    return jsonify({"msg": "Produto deletado"})