window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
        document.getElementById("token").value = token;
    }
});



const registroBotao = document.getElementById('registrar');
const container = document.getElementById('container');
const loginBotao = document.getElementById('login');

// Funções para alternar entre login e registro
registroBotao.addEventListener('click', () => {
    container.classList.add("active");
});

loginBotao.addEventListener('click', () => {
    container.classList.remove("active");
});

// Função de login melhorada
async function fazerLogin() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value.trim();

    // Validação de campos vazios
    if (!email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    try {
        const response = await fetch("http://localhost:7070/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: document.getElementById("email").value,
                senha: document.getElementById("password").value
            })
        });
        const data = await response.json(); 
        if (data.success) {
        
        localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            alert("Login bem-sucedido! Bem-vindo, " + data.usuario.nome);
            window.location.href = "/src/main/resources/public/index.html";
        } else {
            alert("Erro: " + data.message);
        }
    } catch (error) {
        alert("Erro na conexão com o servidor");
        console.error("Erro:", error);
    }
}

async function fazerRegistro() {
    const nome  = document.getElementById("registerNome").value.trim();
    const email = document.getElementById("email1").value.trim();
    const senha = document.getElementById("password1").value.trim();

    if (!nome || !email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch("http://localhost:7070/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // mesmo padrão do fazerLogin:
            body: JSON.stringify({
                nome: document.getElementById("registerNome").value,
                email: document.getElementById("email1").value,
                senha: document.getElementById("password1").value
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert("Registro bem-sucedido! Bem-vindo, " + data.usuario.nome);
            window.location.href = "/src/main/resources/public/index.html";
        } else {
            alert("Erro: " + (data.message || "Erro desconhecido ao registrar."));
        }

    } catch (error) {
        console.error("Erro durante o registro:", error);
        alert("Erro na conexão com o servidor");
    }
}

async function solicitarRecuperacao() {
    const email = document.getElementById("emailRecuperacao").value.trim();
    const mensagem = document.getElementById("mensagemRecuperacao");

    if (!email) {
        mensagem.textContent = "Por favor, insira seu email.";
        mensagem.className = "text-danger mt-2";
        return;
    }

    try {
        const response = await fetch("http://localhost:7070/solicitar-recuperacao", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
            mensagem.textContent = "Instruções enviadas para o e-mail: " + data.email;
            mensagem.className = "text-success mt-2";

            console.log("Token:", data.token); // Apenas para depuração local
        } else {
            mensagem.textContent = data.message || "Falha ao solicitar recuperação.";
            mensagem.className = "text-danger mt-2";
        }

    } catch (error) {
        mensagem.textContent = "Erro de conexão com o servidor.";
        mensagem.className = "text-danger mt-2";
        console.error("Erro:", error);
    }
}


async function redefinirSenha() {
    const novaSenha = document.getElementById("novaSenha").value.trim();
    const token = document.getElementById("token").value.trim();

    if (!novaSenha || !token) {
        alert("Por favor, forneça a nova senha e o token.");
        return;
    }

    try {
        const response = await fetch("http://localhost:7070/redefinir-senha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: token,
                novaSenha: novaSenha
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert("Senha redefinida com sucesso!");
            window.location.href = "/src/main/resources/public/pages/Login.html";
        } else {
            alert("Erro: " + (data.message || "Não foi possível redefinir a senha."));
        }

    } catch (error) {
        console.error("Erro durante a redefinição:", error);
        alert("Erro na conexão com o servidor.");
    }
}






// Função para adicionar token às requisições
async function apiRequest(url, method = 'GET', body = null) {
    const token = localStorage.getItem('jwtToken');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    const config = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    };
    
    const response = await fetch(url, config);
    return response.json();
}

function logout() {
    localStorage.removeItem('jwtToken');
    window.location.href = "/src/main/resources/public/pages/Login.html";
}





// async function post(url, body){
//   return await fetch(`${url}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });
// }