const API_PRODUTOS = "http://127.0.0.1:5001/produtos";

const form = document.getElementById("formProduto");
const tabela = document.getElementById("tabelaProdutos");

const produtoId = document.getElementById("produtoId");
const nomeProduto = document.getElementById("nomeProduto");
const precoProduto = document.getElementById("precoProduto");

// busca todos os produtos e mostra na tabela
async function listarProdutos() {
  const resposta = await fetch(API_PRODUTOS);
  const produtos = await resposta.json();

  tabela.innerHTML = "";

  if (produtos.length === 0) {
    tabela.innerHTML = `
      <tr>
        <td colspan="4" class="text-center">
          Nenhum produto cadastrado.
        </td>
      </tr>
    `;
    return;
  }

  produtos.forEach(produto => {
    tabela.innerHTML += `
      <tr>
        <td>${produto.id}</td>
        <td>${produto.nome}</td>
        <td>R$ ${Number(produto.preco).toFixed(2)}</td>

        <td class="acoes">

          <button
            class="btn btn-sm btn-primary"
            onclick="editarProduto(${produto.id}, '${produto.nome}', ${produto.preco})"
          >
            Editar
          </button>

          <button
            class="btn btn-sm btn-danger"
            onclick="excluirProduto(${produto.id})"
          >
            Excluir
          </button>

        </td>
      </tr>
    `;
  });
}

// salva ou atualiza o produto
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const dados = {
    nome: nomeProduto.value,
    preco: Number(precoProduto.value)
  };

  if (produtoId.value) {
    await fetch(`${API_PRODUTOS}/${produtoId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

  } else {

    await fetch(API_PRODUTOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

  }

  form.reset();
  produtoId.value = "";

  listarProdutos();
});

// coloca os dados do produto no formulário
function editarProduto(id, nome, preco) {
  produtoId.value = id;
  nomeProduto.value = nome;
  precoProduto.value = preco;
}

// tenta excluir o produto
async function excluirProduto(id) {

  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  const resposta = await fetch(`${API_PRODUTOS}/${id}`, {
    method: "DELETE"
  });

  const dados = await resposta.json();

  // se tiver item vinculado a api bloqueia
  if (!resposta.ok) {
    alert(dados.erro);
    return;
  }

  alert(dados.msg);

  listarProdutos();
}

listarProdutos();