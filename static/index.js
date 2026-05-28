const API_CLIENTES = "http://127.0.0.1:5001/clientes";
const API_PRODUTOS = "http://127.0.0.1:5001/produtos";
const API_PEDIDOS = "http://127.0.0.1:5001/pedidos";
const API_PAGAMENTOS = "http://127.0.0.1:5001/formaPagamento";

async function carregarDashboard() {
    try {
        const [clientesRes, produtosRes, pedidosRes, pagamentosRes] =
            await Promise.all([
                fetch(API_CLIENTES),
                fetch(API_PRODUTOS),
                fetch(API_PEDIDOS),
                fetch(API_PAGAMENTOS)
            ]);

        const clientes = await clientesRes.json();
        const produtos = await produtosRes.json();
        const pedidos = await pedidosRes.json();
        const pagamentos = await pagamentosRes.json();

        document.getElementById("totalClientes").textContent = clientes.length;
        document.getElementById("totalProdutos").textContent = produtos.length;
        document.getElementById("totalPedidos").textContent = pedidos.length;
        document.getElementById("totalPagamentos").textContent = pagamentos.length;

    } catch (erro) {
        console.error("Erro ao carregar dashboard:", erro);
    }
}

carregarDashboard();