const API_ITENS = "http://127.0.0.1:5001/itemPedido";
const API_PEDIDOS = "http://127.0.0.1:5001/pedidos";
const API_PRODUTOS = "http://127.0.0.1:5001/produtos";

const form = document.getElementById("formItemPedido");
const lista = document.getElementById("listaItensPedido");

const itemPedidoId = document.getElementById("itemPedidoId");
const pedidoItem = document.getElementById("pedidoItem");
const produtoItem = document.getElementById("produtoItem");
const quantidadeItem = document.getElementById("quantidadeItem");

let pedidos = [];
let produtos = [];

async function carregarSelects() {
  pedidos = await (await fetch(API_PEDIDOS)).json();
  produtos = await (await fetch(API_PRODUTOS)).json();

  pedidoItem.innerHTML = '<option value="">Selecione um pedido</option>';
  produtoItem.innerHTML = '<option value="">Selecione um produto</option>';

  pedidos.forEach(p => pedidoItem.innerHTML += `<option value="${p.id}">Pedido #${p.id}</option>`);
  produtos.forEach(p => produtoItem.innerHTML += `<option value="${p.id}">${p.nome}</option>`);
}

async function listarItens() {
  const itens = await (await fetch(API_ITENS)).json();

  if (!itens.length) {
    lista.innerHTML = "Nenhum item cadastrado.";
    return;
  }

  const agrupados = {};

  itens.forEach(i => {
    if (!agrupados[i.pedido_id]) agrupados[i.pedido_id] = [];
    agrupados[i.pedido_id].push(i);
  });

  lista.innerHTML = "";

  Object.keys(agrupados).forEach(pedidoId => {
    let html = `<div class="card"><h3>Pedido #${pedidoId}</h3>`;

    agrupados[pedidoId].forEach(i => {
      const produto = produtos.find(p => p.id === i.produto_id);

      html += `
        <div class="linha-item">
          <div>
            <strong>${produto ? produto.nome : i.produto_id}</strong>
            <p>Quantidade: ${i.quantidade}</p>
          </div>

          <div class="acoes">
            <button onclick="editarItem(${i.id}, ${i.pedido_id}, ${i.produto_id}, ${i.quantidade})">Editar</button>
            <button onclick="excluirItem(${i.id})">Excluir</button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    lista.innerHTML += html;
  });
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  const dados = {
    pedido_id: Number(pedidoItem.value),
    produto_id: Number(produtoItem.value),
    quantidade: Number(quantidadeItem.value)
  };

  await fetch(itemPedidoId.value ? `${API_ITENS}/${itemPedidoId.value}` : API_ITENS, {
    method: itemPedidoId.value ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  form.reset();
  itemPedidoId.value = "";
  listarItens();
});

function editarItem(id, pedidoId, produtoId, quantidade) {
  itemPedidoId.value = id;
  pedidoItem.value = pedidoId;
  produtoItem.value = produtoId;
  quantidadeItem.value = quantidade;
}

async function excluirItem(id) {
  if (!confirm("Deseja excluir este item?")) return;

  await fetch(`${API_ITENS}/${id}`, { method: "DELETE" });
  listarItens();
}

async function iniciar() {
  await carregarSelects();
  listarItens();
}

iniciar();