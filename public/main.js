const baseUrl = "http://localhost:3000"
getDados();

async function cadastrar() {

    const cadastro = document.querySelector("#cadastro")
    cadastro.addEventListener("click", async() =>{

        const inputNome = document.querySelector("#inputNome").value
        const inputDescricao = document.querySelector("#inputDescricao").value
        const selectCategoria = document.querySelector("#selectCategoria").value
        const inputDuracao = document.querySelector("#inputDuracao").value

        console.log("selectCategoria:", selectCategoria)
        console.log("nome:", inputNome)
        console.log("descricao:", inputDescricao)
        console.log("Duração:", inputDuracao)

        if (!inputNome) {
            console.error("Nome do vídeo não pode ser vazio");
            return; // Ou adote a lógica que fizer sentido para o seu aplicativo
        }
        const dados = {
            name: inputNome,
            description: inputDescricao,
            category: selectCategoria,
            duration: inputDuracao
        }
        console.log("dados:", dados); 

        try {
            const response = await fetch(`${baseUrl}/videos`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                mode: "cors",
                body: JSON.stringify(dados)
            });

            const responseBody = await response.text()
            console.log(responseBody)

            if(response.ok){
                document.querySelector("#inputNome").value = ""
                document.querySelector("#inputDescricao").value = ""
                document.querySelector("#selectCategoria").value = ""
                document.querySelector("#inputDuracao").value = ""

                const m = document.querySelector("#exampleModal")
                const modal = bootstrap.Modal.getInstance(m)
                modal.hide()
    
                exibirDados()
                getDados()
            }else{
                console.error("Erro ao cadastrar o vídeo:", response.status, response.statusText);
                alert("Ocorreu um erro ao cadastrar o vídeo. Por favor, tente novamente.");
            }
        } catch (error) {
            console.error("Erro inesperado:", error);
            alert("Ocorreu um erro inesperado. Por favor, tente novamente.");
        }
    })

}

document.addEventListener("DOMContentLoaded", async function () {
    const dadosCategorias = await obterDadosCategorias()
    //console.log("Dados de categorias", dadosCategorias)
    selecionarCategoria(dadosCategorias);
});

async function obterDadosCategorias() {
    try {
        const resposta = await fetch(`${baseUrl}/categories`);
        const dados = await resposta.json();
        //console.log("Dados obtidos:", dados)
        return dados;

    } catch (erro) {
        console.error("Erro ao obter dados de categorias:", erro)
    }

} 

async function selecionarCategoria(data){
    const select = document.querySelector("#selectCategoria")
    console.log(data)

    if(!Array.isArray(data) || data.length === 0){
        select.innerHTML = `<option> Não há Categorias </option>`

    }else {
        const options = data.map(dado => `<option value="${dado.id}">${dado.name}</option>`).join('');
        select.innerHTML = options
    }
}   

async function exibirDados(data) {
    const tbody = document.querySelector("#dadosProdutos");
    console.log(data)

    let linhas = "";

    if (!data || data.length === 0) {
        linhas = `
            <tr>
                <td colspan="5" style="text-align:center">Não há filmes cadastrados</td>
            </tr>
        `;
    } else {
        data.forEach((dado, index) => {
            linhas += `<tr>
                    <td>${index + 1}</td>
                    <td>${dado.name}</td>
                    <td>${dado.description}</td>
                    <td>${dado.category.name}</td>
                    <td>${dado.duration}</td>
                    <td><i  class="bi bi-pencil-square" style="cursor: pointer" onclick="editarDados('${dado.id}')"></i></td>
                    <td><i  class="bi bi-trash" style="cursor: pointer"  onclick="removerDados('${dado.id}')" ></i></td>
                    </tr>`;
        });
    }

    tbody.innerHTML = linhas;

}

async function getDados() {
    try {
        const response = await fetch(`${baseUrl}/videos`, {
            method: "GET"
        });
        const data = await response.json();
        exibirDados(data);
    } catch (error) {
        alert("Ocorreu um erro")
        console.log(error)
    }
}

async function buscarDados() {
    const filtro = document.querySelector("#search").value
    try {
        if (filtro == "")
            getDados()
        else {
            const response = await fetch(`${baseUrl}/videos/?name=${encodeURIComponent(filtro)}`, {
                method: "GET"
            });
            if(!response.ok){
                throw new Error(`Erro ao buscar dados: ${response.status} - ${response.statusText}`)
            }
            console.log("URL da requisição:", `${baseUrl}/videos/?name=${encodeURIComponent(filtro.value)}`);
            const data = await response.json();
            exibirDados(data);
        }
    } catch (error) {
        console.error("Erro ao buscar dados:", error)
        alert("Ocorreu um erro ao buscar os dados. Por favor, tente novamente")
    }
}


async function removerDados(id) {
    console.log(id)
    const modalRemover = new bootstrap.Modal('#modalRemover');
    modalRemover.show(); 

    const btnRemover = document.querySelector("#remover");
    btnRemover.addEventListener("click", async () => {
        const modalRemover = new bootstrap.Modal('#modalRemover');
        modalRemover.show();
        try {
            await fetch(`${baseUrl}/videos/${id}`, {
                method: "DELETE"
            });
            modalRemover.hide();
            exibirDados();
            getDados()
        } catch (error) {
            alert("Ocorreu um erro")
            console.log(error)
        }
    });
}

async function editarDados(id) {

    const modalEditar = new bootstrap.Modal('#editModal');
    modalEditar.show();

    const editar = document.querySelector("#editar");
    editar.addEventListener("click", async () => {
        const editNome = document.querySelector("#editNome").value
        const editCategoria = document.querySelector("#editCategoria").value
        const editDescricao = document.querySelector("#editDescricao").value
        const editDuracao = document.querySelector("#editDuracao").value
        try {
            const response = await fetch(`${baseUrl}/videos/${id}`);
            const data = await response.json();
            const dados = {
                editNome: data.name,
                editDescricao: data.description,
                editCategoria: data.category.name,
                editDuracao: data.duration
            }
            

        } catch (error) {
            alert("Ocorreu um erro")
            console.log(error)
        }
    
        /* const modalEditar = new bootstrap.Modal('#editModal');
        modalEditar.show(); */
    
        const dado = {
            nome: editNome.value,
            categoria: editCategoria.value,
            descricao: editDescricao.value,
        };
        try {
            await fetch(`${baseUrl}/videos/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dado)
            });

            exibirDados();
            modalEditar.hide();
        } catch (error) {
            alert("Ocorreu um erro")
            console.log(error)
        }
    })
}