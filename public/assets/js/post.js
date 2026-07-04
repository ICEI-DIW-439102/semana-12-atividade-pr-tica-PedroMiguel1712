// ======================
// VERIFICA LOGIN
// ======================

function verificarLoginPost() {

    const usuario = usuarioLogado();

    if (!usuario) {

        alert("Faça login para criar posts.");

        window.location = "login.html";

    }

}

// ======================
// LIMPAR FORMULÁRIO
// ======================

function limparFormularioPost() {

    document.getElementById("id").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("imagem").value = "";
    document.getElementById("album").value = "";

}

// ======================
// CRIAR / ATUALIZAR POST
// ======================

async function criarPost() {

    const usuario = usuarioLogado();

    if (!usuario) {

        alert("Faça login para criar posts.");

        window.location = "login.html";

        return;

    }

    const id = document.getElementById("id").value;

    const post = {

        usuario: usuario.login,

        descricao: document.getElementById("descricao").value.trim(),

        imagem: document.getElementById("imagem").value.trim(),

        album: document.getElementById("album").value.trim(),

        data: new Date().toISOString().slice(0, 10),

        likes: 0

    };

    if (post.descricao === "" || post.imagem === "") {

        alert("Preencha ao menos a descrição e a imagem.");

        return;

    }

    if (id === "") {

        await fetch(`${API}/posts`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(post)

        });

        alert("Post publicado com sucesso!");

    } else {

        await fetch(`${API}/posts/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: id,
                ...post
            })

        });

        alert("Post atualizado!");

    }

    limparFormularioPost();

    listarMeusPosts();

}

// ======================
// LISTAR MEUS POSTS
// ======================

async function listarMeusPosts() {

    const usuario = usuarioLogado();

    if (!usuario) return;

    const resposta = await fetch(`${API}/posts`);

    const posts = await resposta.json();

    const meusPosts = posts.filter(post =>

        post.usuario === usuario.login

    );

    const respostaFav = await fetch(`${API}/favoritos`);

    const favoritos = await respostaFav.json();

    const container = document.getElementById("listaMeusPosts");

    if (!container) return;

    container.innerHTML = "";

    if (meusPosts.length === 0) {

        container.innerHTML = `<p class="text-center">Você ainda não fez nenhum post.</p>`;

        return;

    }

    meusPosts.forEach(post => {

        const favoritado = favoritos.some(f =>
            f.usuario == usuario.id && f.post == post.id
        );

        const icone = favoritado ? "❤️" : "🤍";

        container.innerHTML += `

        <div id="card">

            <div id="l_card">

                <div id="div_nick" class="d-flex justify-content-between align-items-center">

                    <p id="nick_txt">@${post.usuario}</p>

                </div>

                <div id="div_img" class="text-center">

                    <img src="${post.imagem}" id="img_post" class="img-fluid">

                </div>

                <div id="div_desc" class="text-center">

                    <p id="desc_txt">${post.descricao}</p>

                    <div class="d-flex justify-content-center align-items-center gap-2">

                        <button class="btn-favoritar" onclick="favorito('${post.id}')" title="Favoritar">${icone}</button>

                        <button class="btn btn-warning btn-sm" onclick="editarPost('${post.id}')">Editar</button>

                        <button class="btn btn-danger btn-sm" onclick="excluirPost('${post.id}')">Excluir</button>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

}

// ======================
// EDITAR POST
// ======================

async function editarPost(id) {

    const resposta = await fetch(`${API}/posts/${id}`);

    const post = await resposta.json();

    if (!podeGerenciarPost(post)) {

        alert("Apenas o dono do post ou um administrador pode editá-lo.");

        return;

    }

    document.getElementById("id").value = post.id;
    document.getElementById("descricao").value = post.descricao;
    document.getElementById("imagem").value = post.imagem;
    document.getElementById("album").value = post.album;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// ======================
// EXCLUIR POST
// ======================

async function excluirPost(id) {

    const resposta = await fetch(`${API}/posts/${id}`);

    const post = await resposta.json();

    if (!podeGerenciarPost(post)) {

        alert("Apenas o dono do post ou um administrador pode excluí-lo.");

        return;

    }

    const confirmar = confirm("Deseja realmente excluir este post?");

    if (!confirmar) return;

    await fetch(`${API}/posts/${id}`, {

        method: "DELETE"

    });

    listarMeusPosts();

}