const API_CLIENTES = "http://127.0.0.1:5001/clientes";

const form = document.getElementById("formCliente");
const tabela = document.getElementById("tabelaClientes");

const clienteId = document.getElementById("clienteId");
const nomeCliente = document.getElementById("nomeCliente");
const telefoneCliente = document.getElementById("telefoneCliente");

async function listarClientes() {
  try {
    const resposta = await fetch(API_CLIENTES);
    const clientes = await resposta.json();

    tabela.innerHTML = "";

    if (clientes.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="4">Nenhum cliente cadastrado.</td>
        </tr>
      `;
      return;
    }

    clientes.forEach(cliente => {
      tabela.innerHTML += `
        <tr>
          <td>${cliente.id}</td>
          <td>${cliente.nome}</td>
          <td>${cliente.telefone}</td>
          <td class="acoes">
            <button onclick="editarCliente(${cliente.id}, \`${cliente.nome}\`, \`${cliente.telefone}\`)">
              Editar
            </button>

            <button onclick="excluirCliente(${cliente.id})">
              Excluir
            </button>
          </td>
        </tr>
      `;
    });

  } catch (erro) {
    tabela.innerHTML = `
      <tr>
        <td colspan="4">Erro ao carregar clientes.</td>
      </tr>
    `;
    console.error(erro);
  }
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const dados = {
    nome: nomeCliente.value,
    telefone: telefoneCliente.value
  };

  if (clienteId.value) {
    await fetch(`${API_CLIENTES}/${clienteId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
  } else {
    await fetch(API_CLIENTES, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
  }

  form.reset();
  clienteId.value = "";

  listarClientes();
});

function editarCliente(id, nome, telefone) {
  clienteId.value = id;
  nomeCliente.value = nome;
  telefoneCliente.value = telefone;
}

async function excluirCliente(id) {
  if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

  const resposta = await fetch(`${API_CLIENTES}/${id}`, {
    method: "DELETE"
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    alert(dados.erro);
    return;
  }

  alert(dados.msg);
  listarClientes();
}

listarClientes();