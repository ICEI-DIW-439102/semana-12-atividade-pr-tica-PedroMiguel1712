const API = "http://localhost:3000";
const API_POSTS = `${API}/posts`;

// ======================
// LOGIN
// ======================

async function login() {

    const login = document.getElementById("login").value.trim();
    const senha = document.getElementById("senha").value;

    if (login === "" || senha === "") {
        alert("Preencha todos os campos.");
        return;
    }

    const resposta = await fetch(`${API}/usuarios`);
    const usuarios = await resposta.json();

    const usuario = usuarios.find(u =>
        u.login === login &&
        u.senha === senha
    );

    if (!usuario) {
        alert("Usuário ou senha inválidos.");
        return;
    }

    sessionStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuario)
    );

    window.location = "index.html";

}

// ======================
// CADASTRO
// ======================

async function cadastrar() {

    const nome = document.getElementById("nome").value.trim();
    const login = document.getElementById("login").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirmarSenha").value;

    if (
        nome === "" ||
        login === "" ||
        email === "" ||
        senha === "" ||
        confirmar === ""
    ) {
        alert("Preencha todos os campos.");
        return;
    }

    if (senha !== confirmar) {
        alert("As senhas não coincidem.");
        return;
    }

    const resposta = await fetch(`${API}/usuarios`);
    const usuarios = await resposta.json();

    const existe = usuarios.find(u =>
        u.login === login ||
        u.email === email
    );

    if (existe) {
        alert("Login ou e-mail já cadastrado.");
        return;
    }

    const usuario = {

        nome,
        login,
        email,
        senha,
        admin: false

    };

    await fetch(`${API}/usuarios`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(usuario)

    });

    alert("Cadastro realizado com sucesso!");

    window.location = "login.html";

}

// ======================
// LOGOUT
// ======================

function logout() {

    sessionStorage.removeItem("usuarioLogado");

    window.location = "index.html";

}

// ======================
// USUÁRIO LOGADO
// ======================

function usuarioLogado() {

    return JSON.parse(
        sessionStorage.getItem("usuarioLogado")
    );

}

// ======================
// ADMIN
// ======================

function ehAdmin() {

    const usuario = usuarioLogado();

    return usuario && usuario.admin;

}

// ======================
// PERMISSÃO SOBRE O POST
// (dono do post OU admin)
// ======================

function podeGerenciarPost(post) {

    const usuario = usuarioLogado();

    if (!usuario || !post) return false;

    return usuario.admin === true || usuario.login === post.usuario;

}

// ======================
// MENU
// ======================

function atualizarMenu() {

    const usuario = usuarioLogado();

    const menuLogin = document.getElementById("menuLogin");
    const menuLogout = document.getElementById("menuLogout");
    const menuFavoritos = document.getElementById("menuFavoritos");
    const menuCadastro = document.getElementById("menuCadastro");

    if (!menuLogin) return;

    if (usuario) {

        if (menuLogin) menuLogin.style.display = "none";
        if (menuLogout) menuLogout.style.display = "inline";
        if (menuFavoritos) menuFavoritos.style.display = "inline";

        if (menuCadastro)
            menuCadastro.style.display = usuario.admin ? "inline" : "none";

    } else {

        if (menuLogin) menuLogin.style.display = "inline";
        if (menuLogout) menuLogout.style.display = "none";
        if (menuFavoritos) menuFavoritos.style.display = "none";
        if (menuCadastro) menuCadastro.style.display = "none";

    }

}