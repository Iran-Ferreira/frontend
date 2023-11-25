getDados();

async function cadastrar() {
    const inputNome = document.querySelector("#inputNome");
    const inputCategoria = document.querySelector("#inputCategoria");
    const inputDescricao = document.querySelector("#inputDescricao"); 

    const dados = {
        nome: inputNome.value,
        categoria: inputCategoria.value,
        descricao: inputDescricao.value,
    }
    try {
        await fetch("http://localhost:3000/videos", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    }catch (error) {
        alert("Ocorreu um erro")
        console.log(error)
    }

    //Limpar dados
    inputNome.value = "";
    inputCategoria.value = "";
    inputDescricao.value = "";
    //Fechar janela
    const m = document.querySelector("#exampleModal");
    const modal = bootstrap.Modal.getInstance(m);
    modal.hide();

    exibirDados();
}

async function exibirDados() {
    const tbody = document.querySelector("#dadosProdutos");

    try {
        const response = await fetch("http://localhost:3000/videos", {
            method: "GET"
        })
        const data = await response.json()
        let linhas = "";
        if (data.length === 0){
            linhas = `
            <tr>
                <td colspan="5" style="text-align:center">Não há dados cadastrados</td>
            </tr>
        `;
        } else {
            data.forEach((dado, index) => {
                linhas += `<tr>
                    <td>${index + 1}</td>
                    <td>${dado.nome}</td>
                    <td>${dado.categoria}</td>
                    <td>${dado.descricao}</td>
                    <td><i class="bi bi-pencil-square" style="cursor: pointer" onclick="editarDados(${dado.id})"></i></td>
                    <td><i class="bi bi-trash" style="cursor: pointer" onclick="removerDados(${dado.id})"></i></td>
                    </tr>`;
            });
        }
        
        tbody.innerHTML = linhas;
    }catch(error){
        alert("Ocorreu um erro")
        console.log(error)
    }
}

async function getDados() {
    try {
        const response = await fetch("http://localhost:3000/videos", {
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
    const filtro = document.querySelector("#search");
    try {
        if (filtro.value == "")
            getDados();
        else {
            const response = await fetch("http://localhost:3000/videos" + "/?nome=" + filtro.value);
            const data = await response.json();
            exibirDados(data);
    }} 
    catch (error) {
        alert("Ocorreu um erro")
        console.log(error)
    }
}


async function removerDados(index) {
    const modalRemover = new bootstrap.Modal('#modalRemover');
    modalRemover.show();

    const btnRemover = document.querySelector("#remover");
    btnRemover.addEventListener("click", async () => {
        try {
            await fetch("http://localhost:3000/videos/" + index, { method: "DELETE" });
            modalRemover.hide();
            exibirDados();
        } catch (error) {
            alert("Ocorreu um erro")
            console.log(error)
        }});
} 

async function editarDados(index) {
    const editNome = document.querySelector("#editNome");
    const editCategoria = document.querySelector("#editCategoria");
    const editDescricao = document.querySelector("#editDescricao")
    try {
        const response = await fetch("http://localhost:3000/videos/" + index);
        const data = await response.json();
        editNome.value = data.nome;
        editCategoria.value = data.categoria;
        editDescricao.value = data.descricao;
    } catch (error) {
        alert("Ocorreu um erro")
        console.log(error)
    }

    const modalEditar = new bootstrap.Modal('#editModal');
    modalEditar.show();
    
    const editar = document.querySelector("#editar");
    editar.addEventListener("click", async () => {
        const dado = {
            nome: editNome.value,
            categoria: editCategoria.value,
            descricao: editDescricao.value,
    };
    try {
        await fetch("http://localhost:3000/videos/" + index, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
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