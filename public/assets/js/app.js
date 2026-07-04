let posts = [];
let favoritos = [];
let seguidores = [];

async function carregarInteracoes() {

    const usuario = usuarioLogado();

    if (!usuario) {
        favoritos = [];
        seguidores = [];
        return;
    }

    const [respostaFav, respostaSeg] = await Promise.all([
        fetch(`${API}/favoritos`),
        fetch(`${API}/seguidores`)
    ]);

    favoritos = await respostaFav.json();
    seguidores = await respostaSeg.json();

}

async function carregarPosts() {

    // Garante que já sabemos quem o usuário segue/favoritou
    // antes de desenhar os cards, senão o botão "Seguir"
    // aparece errado na primeira renderização.
    await carregarInteracoes();

    const resposta = await fetch(`${API}/posts`);
    posts = await resposta.json();

    mostrarPosts(posts);

}

function mostrarPosts(lista) {

    const container = document.getElementById("listaPosts");

    if (!container) return;

    container.innerHTML = "";

    lista.forEach(post => {

        const usuario = JSON.parse(
            sessionStorage.getItem("usuarioLogado")
        );

        let icone="🤍";

        if(usuario){

            const fav = favoritos.find(f=>

                f.usuario==usuario.id &&

                f.post==post.id

            );

            if(fav){

                icone="❤️";

            }

        }

        let textoSeguir = "Seguir";

        if(usuario){

            const segue = seguidores.find(s=>

                s.seguidor==usuario.login &&

                s.seguido==post.usuario

            );

            if(segue){

                textoSeguir = "Seguindo";

            }

        }

        container.innerHTML += `

        <div id="card" onclick="abrirDetalhes('${post.id}')" style="cursor:pointer;">

            <div id="l_card">

                <div id="div_nick" class="d-flex justify-content-between align-items-center">

                    <p id="nick_txt">
                        @${post.usuario}
                    </p>

                    <p id="seguir_txt">
                        <a href="#" onclick="event.stopPropagation(); event.preventDefault(); seguir('${post.usuario}');">${textoSeguir}</a>
                    </p>

                </div>

                <div id="div_img" class="text-center">

                    <img
                        src="${post.imagem}"
                        id="img_post"
                        class="img-fluid">

                </div>

                <div id="div_desc" class="text-center">

                    <p id="desc_txt">

                        ${post.usuario}: "${post.descricao}"

                    </p>

                    <button
                    class="btn-favoritar"
                    title="Favoritar"

                    onclick="event.stopPropagation(); favorito('${post.id}');">

                    ${icone}

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}

const pesquisa = document.getElementById("input_pesquisar");

if (pesquisa) {

    pesquisa.addEventListener("input", function () {

        const texto = this.value.toLowerCase();

        const filtrados = posts.filter(post =>

            post.usuario.toLowerCase().includes(texto) ||

            post.descricao.toLowerCase().includes(texto) ||

            post.album.toLowerCase().includes(texto)

        );

        mostrarPosts(filtrados);

    });

}

function abrirDetalhes(id){

    window.location =
        `detalhes.html?id=${id}`;

}

// ======================
// SEGUIR
// ======================

async function seguir(usuarioAlvo) {

    const usuario = usuarioLogado();

    if (!usuario) {
        alert("Faça login para seguir.");
        window.location = "login.html";
        return;
    }

    if (usuario.login === usuarioAlvo) {
        alert("Você não pode seguir a si mesmo.");
        return;
    }

    const resposta = await fetch(`${API}/seguidores`);
    const lista = await resposta.json();

    const existente = lista.find(s =>
        s.seguidor === usuario.login &&
        s.seguido === usuarioAlvo
    );

    if (existente) {

        await fetch(`${API}/seguidores/${existente.id}`, {
            method: "DELETE"
        });

    } else {

        await fetch(`${API}/seguidores`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                seguidor: usuario.login,
                seguido: usuarioAlvo
            })
        });

    }

    const respostaSeg = await fetch(`${API}/seguidores`);
    seguidores = await respostaSeg.json();

    if (document.getElementById("listaPosts")) {
        mostrarPosts(posts);
    }

}