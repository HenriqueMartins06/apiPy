const API_PEDIDOS = "http://127.0.0.1:5001/pedidos";
const API_CLIENTES = "http://127.0.0.1:5001/clientes";
const API_FORMAS = "http://127.0.0.1:5001/formaPagamento";

const form = document.getElementById("formPedido");
const tabela = document.getElementById("tabelaPedidos");
const pedidoId = document.getElementById("pedidoId");
const clientePedido = document.getElementById("clientePedido");
const formaPedido = document.getElementById("formaPedido");

let clientes = [];
let formas = [];

async function carregarSelects() {
  clientes = await (await fetch(API_CLIENTES)).json();
  formas = await (await fetch(API_FORMAS)).json();

  clientePedido.innerHTML = '<option value="">Selecione um cliente</option>';
  formaPedido.innerHTML = '<option value="">Selecione uma forma</option>';

  clientes.forEach(c => clientePedido.innerHTML += `<option value="${c.id}">${c.nome}</option>`);
  formas.forEach(f => formaPedido.innerHTML += `<option value="${f.id}">${f.tipo}</option>`);
}

async function listarPedidos() {
  const pedidos = await (await fetch(API_PEDIDOS)).json();

  tabela.innerHTML = pedidos.length ? "" : `
    <tr><td colspan="4">Nenhum pedido cadastrado.</td></tr>
  `;

  pedidos.forEach(p => {
    const cliente = clientes.find(c => c.id === p.cliente_id);
    const forma = formas.find(f => f.id === p.forma_pagamento_id);

    tabela.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${cliente ? cliente.nome : p.cliente_id}</td>
        <td>${forma ? forma.tipo : p.forma_pagamento_id}</td>
        <td class="acoes">
          <button onclick="editarPedido(${p.id}, ${p.cliente_id}, ${p.forma_pagamento_id})">Editar</button>
          <button onclick="excluirPedido(${p.id})">Excluir</button>
        </td>
      </tr>
    `;
  });
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  const dados = {
    cliente_id: Number(clientePedido.value),
    forma_pagamento_id: Number(formaPedido.value)
  };

  await fetch(pedidoId.value ? `${API_PEDIDOS}/${pedidoId.value}` : API_PEDIDOS, {
    method: pedidoId.value ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  form.reset();
  pedidoId.value = "";
  listarPedidos();
});

function editarPedido(id, clienteId, formaId) {
  pedidoId.value = id;
  clientePedido.value = clienteId;
  formaPedido.value = formaId;
}

async function excluirPedido(id) {
  if (!confirm("Tem certeza que deseja excluir este pedido?")) return;

  const resposta = await fetch(`${API_PEDIDOS}/${id}`, {
    method: "DELETE"
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    alert(dados.erro);
    return;
  }

  alert(dados.msg);
  listarPedidos();
}

async function iniciar() {
  await carregarSelects();
  listarPedidos();
}

iniciar();