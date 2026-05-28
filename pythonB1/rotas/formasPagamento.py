from flask import jsonify, request
from db import db
from models import FormaPagamento
from app import app 

# CRia
@app.route('/formaPagamento', methods=['POST'])
def criar_forma():
    dados = request.json

    forma = FormaPagamento(tipo=dados['tipo'])

    db.session.add(forma)
    db.session.commit()

    return jsonify(forma.para_dic()), 201


# busca tudo
@app.route('/formaPagamento', methods=['GET'])
def listar_formas():
    formas = FormaPagamento.query.all()
    return jsonify([f.para_dic() for f in formas])


# so id
@app.route('/formaPagamento/<int:id>', methods=['GET'])
def buscar_forma(id):
    forma = FormaPagamento.query.get(id)

    if not forma:
        return jsonify({"erro": "Forma não encontrada"}), 404

    return jsonify(forma.para_dic())


# atualiza
@app.route('/formaPagamento/<int:id>', methods=['PUT'])
def atualizar_forma(id):
    forma = FormaPagamento.query.get(id)

    if not forma:
        return jsonify({"erro": "Forma não encontrada"}), 404

    dados = request.json
    forma.tipo = dados['tipo']

    db.session.commit()

    return jsonify(forma.para_dic())


# apaga
@app.route('/formaPagamento/<int:id>', methods=['DELETE'])
def deletar_forma(id):
    forma = FormaPagamento.query.get(id)

    if not forma:
        return jsonify({"erro": "Forma não encontrada"}), 404

    db.session.delete(forma)
    db.session.commit()

    return jsonify({"msg": "Forma deletada"})