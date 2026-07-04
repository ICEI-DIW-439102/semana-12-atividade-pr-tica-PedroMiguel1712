async function carregarFavoritos() {

    const usuario = JSON.parse(
        sessionStorage.getItem("usuarioLogado")
    );

    if (!usuario) {

        alert("Faça login.");

        window.location = "login.html";

        return;
    }

    const respostaFav = await fetch(`${API}/favoritos`);

    const favoritos = await respostaFav.json();

    const meusFavoritos = favoritos.filter(f =>

        f.usuario == usuario.id

    );

    const respostaPosts = await fetch(`${API}/posts`);

    const posts = await respostaPosts.json();

    const lista = posts.filter(post =>

        meusFavoritos.some(f =>

            f.post == post.id

        )

    );

    mostrarFavoritos(lista);

}

function mostrarFavoritos(lista){

    const container =
    document.getElementById("listaPosts");

    container.innerHTML="";

    lista.forEach(post=>{

        container.innerHTML+=`

        <div id="card" onclick="abrirDetalhes('${post.id}')" style="cursor:pointer;">

            <div id="l_card">

                <div id="div_nick">

                    <p id="nick_txt">

                    @${post.usuario}

                    </p>

                </div>

                <div id="div_img">

                    <img
                    src="${post.imagem}"

                    id="img_post"

                    class="img-fluid">

                </div>

                <div id="div_desc" class="text-center">

                    <p id="desc_txt">

                    ${post.descricao}

                    </p>

                    <button
                    class="btn-favoritar"
                    title="Remover dos favoritos"

                    onclick="event.stopPropagation(); favorito('${post.id}');">

                    ❤️

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}

async function favorito(idPost){

    const usuario = JSON.parse(
        sessionStorage.getItem("usuarioLogado")
    );

    if(!usuario){
        alert("Faça login para favoritar.");
        window.location = "login.html";
        return;
    }

    const resposta = await fetch(`${API}/favoritos`);
    const lista = await resposta.json();

    const existente = lista.find(f =>
        f.usuario == usuario.id &&
        f.post == idPost
    );

    if(existente){

        await fetch(`${API}/favoritos/${existente.id}`,{
            method:"DELETE"
        });

    }else{

        await fetch(`${API}/favoritos`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                usuario:usuario.id,
                post:idPost
            })
        });

    }

    if(typeof carregarPosts === "function"){

        await carregarPosts();

    }

    if(typeof carregarFavoritos === "function"){

        await carregarFavoritos();

    }

}