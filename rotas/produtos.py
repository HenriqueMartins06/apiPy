from flask import jsonify, request
from db import db
from models import Produto
from app import app  
# Criar
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

# Listar todos
@app.route('/produtos', methods=['GET'])
def listar_produtos():

    produtos = Produto.query.all()

    return jsonify([p.para_dic() for p in produtos])

# Buscar por ID
@app.route('/produtos/<int:id>', methods=['GET'])
def buscar_produto(id):

    produto = Produto.query.get(id)

    if not produto:
        return jsonify({
            "erro": "Produto não encontrado"
        }), 404

    return jsonify(produto.para_dic())

# Atualizar
@app.route('/produtos/<int:id>', methods=['PUT'])
def atualizar_produto(id):

    produto = Produto.query.get(id)

    if not produto:
        return jsonify({
            "erro": "Produto não encontrado"
        }), 404

    dados = request.json

    produto.nome = dados['nome']
    produto.preco = dados['preco']

    db.session.commit()

    return jsonify(produto.para_dic())

# Excluir
@app.route('/produtos/<int:id>', methods=['DELETE'])
def deletar_produto(id):

    produto = Produto.query.get(id)

    if not produto:
        return jsonify({
            "erro": "Produto não encontrado"
        }), 404

    try:

        db.session.delete(produto)
        db.session.commit()

        return jsonify({
            "msg": "Produto deletado"
        })

    except Exception:

        db.session.rollback()

        return jsonify({
            "erro": "Não é possível excluir este produto, pois ele está vinculado a um pedido."
        }), 400