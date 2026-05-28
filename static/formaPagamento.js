const API_PAGAMENTOS = "http://127.0.0.1:5001/formaPagamento";

const form = document.getElementById("formPagamento");
const tabela = document.getElementById("tabelaPagamentos");

const pagamentoId = document.getElementById("pagamentoId");
const tipoPagamento = document.getElementById("tipoPagamento");

// busca as formas de pagamento e mostra na tabela
async function listarPagamentos() {
  const resposta = await fetch(API_PAGAMENTOS);
  const pagamentos = await resposta.json();

  tabela.innerHTML = "";

  if (pagamentos.length === 0) {
    tabela.innerHTML = `
      <tr>
        <td colspan="3" class="text-center">
          Nenhuma forma de pagamento cadastrada.
        </td>
      </tr>
    `;
    return;
  }

  pagamentos.forEach(pagamento => {
    tabela.innerHTML += `
      <tr>
        <td>${pagamento.id}</td>
        <td>${pagamento.tipo}</td>

        <td class="acoes">

          <button
            class="btn btn-sm btn-primary"
            onclick="editarPagamento(${pagamento.id}, '${pagamento.tipo}')"
          >
            Editar
          </button>

          <button
            class="btn btn-sm btn-danger"
            onclick="excluirPagamento(${pagamento.id})"
          >
            Excluir
          </button>

        </td>
      </tr>
    `;
  });
}

// salva uma nova forma de pagamento ou edita uma existente
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const dados = {
    tipo: tipoPagamento.value
  };

  if (pagamentoId.value) {

    await fetch(`${API_PAGAMENTOS}/${pagamentoId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

  } else {

    await fetch(API_PAGAMENTOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

  }

  form.reset();
  pagamentoId.value = "";

  listarPagamentos();
});

// coloca os dados no formulário pra editar
function editarPagamento(id, tipo) {
  pagamentoId.value = id;
  tipoPagamento.value = tipo;
}

// tenta excluir, mas se estiver vinculada a pedido a api bloqueia
async function excluirPagamento(id) {

  if (!confirm("Tem certeza que deseja excluir esta forma de pagamento?")) return;

  const resposta = await fetch(`${API_PAGAMENTOS}/${id}`, {
    method: "DELETE"
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    alert(dados.erro);
    return;
  }

  alert(dados.msg);

  listarPagamentos();
}

listarPagamentos();