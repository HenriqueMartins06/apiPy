const API_PAGAMENTOS = "http://127.0.0.1:5001/formaPagamento";

const form = document.getElementById("formPagamento");
const tabela = document.getElementById("tabelaPagamentos");

const pagamentoId = document.getElementById("pagamentoId");
const tipoPagamento = document.getElementById("tipoPagamento");

async function listarPagamentos() {
    const resposta = await fetch(API_PAGAMENTOS);
    const pagamentos = await resposta.json();

    tabela.innerHTML = "";

    if (pagamentos.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="3">Nenhuma forma de pagamento cadastrada.</td>
            </tr>
        `;
        return;
    }

    pagamentos.forEach(pagamento => {
        tabela.innerHTML += `
            <tr>
                <td>${pagamento.id}</td>
                <td>${pagamento.tipo}</td>
                <td>
                    <button onclick="editarPagamento(${pagamento.id}, '${pagamento.tipo}')">
                        Editar
                    </button>

                    <button onclick="excluirPagamento(${pagamento.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const dados = {
        tipo: tipoPagamento.value
    };

    if (pagamentoId.value) {
        await fetch(`${API_PAGAMENTOS}/${pagamentoId.value}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });
    } else {
        await fetch(API_PAGAMENTOS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });
    }

    form.reset();
    pagamentoId.value = "";

    listarPagamentos();
});

function editarPagamento(id, tipo) {
    pagamentoId.value = id;
    tipoPagamento.value = tipo;
}

async function excluirPagamento(id) {
    const confirmar = confirm("Tem certeza que deseja excluir esta forma de pagamento?");
    if (!confirmar) return;

    await fetch(`${API_PAGAMENTOS}/${id}`, {
        method: "DELETE"
    });

    listarPagamentos();
}

listarPagamentos();