from db import db

#primeira class, cliente
class Cliente(db.Model):
    
    #como vai ficar o nome da tabela no banco
    __tablename__ = 'clientes'
    
    #criando as colunas agr ak
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(100), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    
    #aqui agente transfoma o item da tablea em json 
    def para_dic(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "telefone": self.telefone
        }
        
        
        #criar class de produtos agr

class Produto(db.Model):
    __tablename__ = "produtos"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  
    nome = db.Column(db.String(100), nullable=False)
    preco = db.Column(db.Float, nullable=False)

#transforma em json
    def para_dic(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "preco": self.preco
        }
        
        
        # tabela pedido
class Pedido(db.Model):
    __tablename__ = "pedidos"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    #chave estrangeira ligando  cm cliente/ um pedido pertence a um cliente
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    #chave para o pagamento tbm
    forma_pagamento_id = db.Column(db.Integer, db.ForeignKey('formas_pagamento.id'), nullable=False)
    #relacao python para puxar nome do cliente
    cliente = db.relationship("Cliente")

#json
    def para_dic(self):
        return {
            "id": self.id,
            "cliente_id": self.cliente_id,
            "forma_pagamento_id": self.forma_pagamento_id
        }


# tabela do pedido pra poder ter mais de um produto no pedido
class ItemPedido(db.Model):
    __tablename__ = "itens_pedido"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # liga com pedido
    pedido_id = db.Column(db.Integer, db.ForeignKey('pedidos.id'), nullable=False)

    # liga com produto
    produto_id = db.Column(db.Integer, db.ForeignKey('produtos.id'), nullable=False)

    # quantidade do produto no pedido
    quantidade = db.Column(db.Integer, nullable=False)

    def para_dic(self):
        return {
            "id": self.id,
            "pedido_id": self.pedido_id,
            "produto_id": self.produto_id,
            "quantidade": self.quantidade
        }
        
        #pagamentos

class FormaPagamento(db.Model):
    __tablename__ = "formas_pagamento"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipo = db.Column(db.String(50), nullable=False)  

    def para_dic(self):
        return {
            "id": self.id,
            "tipo": self.tipo
        }