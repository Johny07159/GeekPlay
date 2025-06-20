// Carrega dados do perfil
document.addEventListener('DOMContentLoaded', async () => {
    addDebugLog('Iniciando carregamento do perfil...');
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
        addDebugLog('Token JWT não encontrado, redirecionando para login...');
        window.location.href = '/login.html';
        return;
    }

    try {
        addDebugLog('Fazendo requisição para /perfil...');
        const response = await fetch('http://localhost:7070/perfil', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        addDebugLog(`Resposta recebida: ${response.status}`);
        const data = await response.json();
        addDebugLog('Dados do perfil recebidos:', JSON.stringify(data));

        if (data.success) {
            document.getElementById('nome').textContent = data.usuario.nome;
            document.getElementById('email').textContent = data.usuario.email;
            addDebugLog('Perfil carregado com sucesso');
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        addDebugLog('Erro ao carregar perfil:', error.message);
        alert('Erro ao carregar perfil: ' + error.message);
        window.location.href = '/login.html';
    }
});

// Função para mostrar/esconder senha
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.nextElementSibling;
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
        addDebugLog(`Mostrando senha do campo ${fieldId}`);
    } else {
        field.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
        addDebugLog(`Ocultando senha do campo ${fieldId}`);
    }
}

// Função para adicionar logs de debug
function addDebugLog(message, data) {
    const debugDiv = document.getElementById('debugLogs');
    if (!debugDiv) return;
    
    const logEntry = document.createElement('div');
    logEntry.textContent = `[DEBUG] ${new Date().toLocaleTimeString()}: ${message}`;
    
    if (data) {
        const dataPre = document.createElement('pre');
        dataPre.textContent = JSON.stringify(data, null, 2);
        dataPre.style.marginLeft = '20px';
        dataPre.style.fontSize = '0.8em';
        logEntry.appendChild(dataPre);
    }
    
    debugDiv.appendChild(logEntry);
    debugDiv.scrollTop = debugDiv.scrollHeight;
}

// Função para alterar senha
async function alterarSenha() {
    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const mensagem = document.getElementById('mensagem');

    // Resetar mensagem
    mensagem.textContent = '';
    mensagem.className = '';
    addDebugLog('Iniciando processo de alteração de senha...');

    // Validações client-side
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
        mensagem.textContent = "Por favor, preencha todos os campos";
        mensagem.className = "alert alert-danger";
        addDebugLog('Validação falhou: Campos não preenchidos');
        return;
    }

    if (novaSenha !== confirmarSenha) {
        mensagem.textContent = "As novas senhas não coincidem";
        mensagem.className = "alert alert-danger";
        addDebugLog('Validação falhou: Senhas não coincidem');
        return;
    }

    // if (novaSenha.length < 6) {
    //     mensagem.textContent = "A senha deve ter pelo menos 6 caracteres";
    //     mensagem.className = "alert alert-danger";
    //     addDebugLog('Validação falhou: Senha muito curta');
    //     return;
    // }

    try {
        addDebugLog('Preparando requisição para alterar senha...');
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('http://localhost:7070/alterar-senha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                senhaAtual: senhaAtual,
                novaSenha: novaSenha
            })
        });

        const data = await response.json();
        addDebugLog('Resposta do servidor:', data);

        if (data.success) {
            // Limpa os campos após sucesso
            document.getElementById('senhaAtual').value = '';
            document.getElementById('novaSenha').value = '';
            document.getElementById('confirmarSenha').value = '';
            
            // Mostra mensagem de sucesso
            mensagem.textContent = "Senha alterada com sucesso!";
            mensagem.className = "alert alert-success";
            addDebugLog('Senha alterada com sucesso, campos resetados');
            
            // Esconde a mensagem após 5 segundos
            setTimeout(() => {
                mensagem.textContent = '';
                mensagem.className = '';
            }, 5000);
        } else {
            mensagem.textContent = data.message || "Erro ao alterar senha";
            mensagem.className = "alert alert-danger";
            addDebugLog('Erro ao alterar senha:', data.message);
        }
    } catch (error) {
        mensagem.textContent = "Erro na comunicação com o servidor";
        mensagem.className = "alert alert-danger";
        addDebugLog('Erro na requisição:', error.message);
    }
}

// Logout
function logout() {
    addDebugLog('Iniciando logout...');
    localStorage.removeItem('jwtToken');
    window.location.href = '/src/main/resources/public/pages/Login.html';
}