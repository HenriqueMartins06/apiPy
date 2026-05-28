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
    let total = 0;

    agrupados[pedidoId].forEach(i => {
      const produto = produtos.find(p => p.id === i.produto_id);

      if (produto) {
        total += Number(produto.preco) * Number(i.quantidade);
      }
    });

    let html = `
      <div class="card shadow-sm border-0">
        <div class="card-body">

          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="h5 mb-0">Pedido #${pedidoId}</h3>
            <span class="badge bg-success fs-6">
              Total: R$ ${total.toFixed(2)}
            </span>
          </div>
    `;

    agrupados[pedidoId].forEach(i => {
      const produto = produtos.find(p => p.id === i.produto_id);

      html += `
        <div class="linha-item">
          <div>
            <strong>${produto ? produto.nome : i.produto_id}</strong>
            <p class="mb-0 text-muted">
              Quantidade: ${i.quantidade}
              ${produto ? ` | Unitário: R$ ${Number(produto.preco).toFixed(2)}` : ""}
            </p>
          </div>

          <div class="acoes">
            <button class="btn btn-sm btn-primary" onclick="editarItem(${i.id}, ${i.pedido_id}, ${i.produto_id}, ${i.quantidade})">
              Editar
            </button>

            <button class="btn btn-sm btn-danger" onclick="excluirItem(${i.id})">
              Excluir
            </button>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

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

  const resposta = await fetch(`${API_ITENS}/${id}`, {
    method: "DELETE"
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    alert(dados.erro);
    return;
  }

  alert(dados.msg);
  listarItens();
}

async function iniciar() {
  await carregarSelects();
  listarItens();
}

iniciar();