// ======================
// LISTAR POSTS
// ======================

async function listarPosts() {

    const resposta = await fetch(API_POSTS);
    const posts = await resposta.json();

    const tabela = document.getElementById("tabelaPosts");

    if (!tabela) return;

    tabela.innerHTML = "";

    posts.forEach(post => {

        tabela.innerHTML += `
            <tr>

                <td>${post.id}</td>

                <td>${post.usuario}</td>

                <td>${post.data}</td>

                <td>${post.album}</td>

                <td>

                    <button
                        class="btn btn-warning btn-sm"
                        onclick="editarPostAdmin('${post.id}')">

                        Editar

                    </button>

                </td>

                <td>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="excluirPostAdmin('${post.id}')">

                        Excluir

                    </button>

                </td>

            </tr>
        `;

    });

}

// ======================
// LIMPAR FORMULÁRIO
// ======================

function limparFormulario(){

    document.getElementById("id").value = "";
    document.getElementById("usuario").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("imagem").value = "";
    document.getElementById("data").value = "";
    document.getElementById("album").value = "";

}

// ======================
// SALVAR POST
// ======================

async function salvarPost(){

    const id = document.getElementById("id").value;

    const post = {

        usuario: document.getElementById("usuario").value.trim(),

        descricao: document.getElementById("descricao").value.trim(),

        imagem: document.getElementById("imagem").value.trim(),

        data: document.getElementById("data").value,

        album: document.getElementById("album").value.trim(),


    };

    if(

        post.usuario=="" ||

        post.descricao=="" ||

        post.imagem=="" ||

        post.data=="" ||

        post.album==""

    ){

        alert("Preencha todos os campos.");

        return;

    }

    if(id==""){

        await fetch(API_POSTS,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(post)

        });

        alert("Post cadastrado com sucesso!");

    }

    else{

        await fetch(`${API_POSTS}/${id}`,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                id:id,

                ...post

            })

        });

        alert("Post atualizado!");

    }

    limparFormulario();

    listarPosts();

}

// ======================
// EDITAR POST
// ======================

async function editarPostAdmin(id){

    if (!ehAdmin()) {

        alert("Apenas administradores podem editar posts por aqui.");

        return;

    }

    const resposta = await fetch(`${API_POSTS}/${id}`);

    const post = await resposta.json();

    document.getElementById("id").value = post.id;
    document.getElementById("usuario").value = post.usuario;
    document.getElementById("descricao").value = post.descricao;
    document.getElementById("imagem").value = post.imagem;
    document.getElementById("data").value = post.data;
    document.getElementById("album").value = post.album;

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

// ======================
// EXCLUIR POST
// ======================

async function excluirPostAdmin(id){

    if (!ehAdmin()) {

        alert("Apenas administradores podem excluir posts por aqui.");

        return;

    }

    const confirmar = confirm("Deseja realmente excluir este post?");

    if(!confirmar) return;

    await fetch(`${API_POSTS}/${id}`,{

        method:"DELETE"

    });

    listarPosts();

}