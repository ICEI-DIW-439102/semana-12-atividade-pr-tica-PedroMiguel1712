async function carregarDetalhes(){

    const parametros =
        new URLSearchParams(window.location.search);

    const id = parametros.get("id");

    const resposta =
        await fetch(`${API}/posts/${id}`);

    const post =
        await resposta.json();

        if(!post || !post.id){
            alert("Post não encontrado.");
            window.location = "index.html";
            return;}

    document.getElementById("imagemShow").src =
        post.imagem;

    document.getElementById("usuario").innerHTML =
        "@" + post.usuario;

    document.getElementById("descricao").innerHTML =
        post.descricao;

    document.getElementById("album").innerHTML =
        post.album;

    document.getElementById("data").innerHTML =
        post.data;

    await atualizarFavoritosDetalhes(post.id);

    document.getElementById("btnFavorito")
    btnFavorito.onclick = async function(){
        await favorito(post.id);
        await atualizarFavoritosDetalhes(post.id);
    };

}

async function atualizarFavoritosDetalhes(idPost){

    const resposta =
        await fetch(`${API}/favoritos`);

    const favoritos =
        await resposta.json();

    const favoritosDoPost =
        favoritos.filter(f => f.post == idPost);

    document.getElementById("qtdFavoritos").innerHTML =
        favoritosDoPost.length;

    const usuario = usuarioLogado();

    const btn = document.getElementById("btnFavorito");

    const jaFavoritou =
        usuario &&
        favoritosDoPost.some(f => f.usuario == usuario.id);

    if(jaFavoritou){

        btn.innerHTML = "💔 Desfavoritar";
        btn.classList.remove("btn-danger");
        btn.classList.add("btn-outline-danger");

    }else{

        btn.innerHTML = "⭐ Favoritar";
        btn.classList.remove("btn-outline-danger");
        btn.classList.add("btn-danger");

    }

}