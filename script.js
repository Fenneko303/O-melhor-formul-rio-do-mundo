// Elementos da interface
const telaInicio = document.getElementById('telaInicio');
const modalTermos = document.getElementById('modalTermos');
const modalAviso = document.getElementById('modalAviso');
const caixaTextoTermos = document.getElementById('caixaTextoTermos');
const controlesNome = document.getElementById('controlesNome');

// Botões
const btnComecar = document.getElementById('btnComecar');
const btnAceitarTermos = document.getElementById('btnAceitarTermos');
const btnVoltarCastigo = document.getElementById('btnVoltarCastigo');
const checkReceita = document.getElementById('checkReceita');
const checkAbelha = document.getElementById('checkAbelha');

// Estado do castigo
let modoLeituraLenta = false;

// Tenho que remover daqui
const btnPularDev = document.getElementById('btnPularDev');

btnPularDev.addEventListener('click', () => {
    // Destrói a tela de início
    telaInicio.classList.add('oculto-layout'); 
    
    // Garante que os termos não vão aparecer
    modalTermos.classList.add('escondido'); 
    
    // Mostra o formulário principal direto
    const formPrincipal = document.getElementById('formularioPrincipal');
    formPrincipal.classList.remove('oculto-layout');
    
    // Desliga qualquer punição de scroll
    modoLeituraLenta = false; 
});

//Até aqui depois

// 1. Botão da tela inicial abre os termos
btnComecar.addEventListener('click', () => {
    telaInicio.classList.add('escondido');
    modalTermos.classList.remove('escondido');
});

// Função para criar o texto flutuante na posição do mouse
function mostrarTextoArco(x, y, mensagem) {
    const texto = document.createElement('span');
    texto.classList.add('texto-arco');
    texto.textContent = mensagem;
    
    // Posiciona no eixo exato do clique
    texto.style.left = `${x}px`; 
    texto.style.top = `${y}px`;
    
    // Gera valores aleatórios para a física do pulo
    // moveX: Vai de -100px (esquerda) a +100px (direita)
    const direcaoX = (Math.random() - 0.5) * 200; 
    
    // jumpY: Altura do pulo (entre -50px e -120px para cima)
    const alturaPulo = -50 - (Math.random() * 70);
    
    // Injeta as variáveis aleatórias no CSS do elemento
    texto.style.setProperty('--move-x', `${direcaoX}px`);
    texto.style.setProperty('--jump-y', `${alturaPulo}px`);

    document.body.appendChild(texto);

    // Remove do DOM após 1 segundo (tempo da animação)
    setTimeout(() => {
        texto.remove();
    }, 1000);
}

// Lógica atualizada de Validação ao tentar aceitar os termos
btnAceitarTermos.addEventListener('click', (evento) => {
    // Procura TODAS as checkboxes que estão dentro da caixa de termos
    const checkboxesTermos = document.querySelectorAll('#caixaTextoTermos input[type="checkbox"]');
    let todasMarcadas = true;

    // Verifica se alguma ficou para trás
    checkboxesTermos.forEach(cb => {
        if (!cb.checked) {
            todasMarcadas = false;
        }
    });

    if (!todasMarcadas) {
        if (modoLeituraLenta) {
            // Se já está no castigo, o botão não faz nada, só solta o texto no mouse
            const mensagens = [
                "Achou todas? Tem certeza?",
                "Faltou caixinha aí...",
                "Tá com pressa?",
                "Leia com mais atenção!"
            ];
            // Sorteia uma mensagem irônica
            const msgAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
            
            // Dispara o texto nas coordenadas exatas do clique
            mostrarTextoArco(evento.pageX, evento.pageY, msgAleatoria);
            
        } else {
            // Primeira tentativa de burlar: Toma o esporro e ativa o modo lento
            modalTermos.classList.add('escondido');
            modalAviso.classList.remove('escondido');
        }
    } else {
        // O USUÁRIO ACHOU TODAS AS CHECKBOXES:
        modalTermos.classList.add('escondido');
        telaInicio.classList.add('oculto-layout'); 
        
        const formPrincipal = document.getElementById('formularioPrincipal');
        formPrincipal.classList.remove('oculto-layout');
        
        modoLeituraLenta = false; 
    }
});

// 3. Botão do castigo volta para os termos com punição ativada
btnVoltarCastigo.addEventListener('click', () => {
    modalAviso.classList.add('escondido');
    modalTermos.classList.remove('escondido');
    
    // Reseta o scroll para o topo
    caixaTextoTermos.scrollTop = 0; 
    modoLeituraLenta = true;
    
    // O GOLPE FINAL: Esconde a barra de rolagem
    caixaTextoTermos.classList.add('esconder-scrollbar'); 
});

// 4. Lógica do Scroll Lento
caixaTextoTermos.addEventListener('wheel', (evento) => {
    if (modoLeituraLenta) {
        evento.preventDefault(); // Impede a rolagem padrão rápida do mouse
        
        // Define que cada girada na rodinha desce apenas 2 pixels (extremamente lento)
        const velocidade = 2; 
        
        if (evento.deltaY > 0) {
            caixaTextoTermos.scrollTop += velocidade; // Desce lento
        } else {
            caixaTextoTermos.scrollTop -= (velocidade * 100); // Sobe um pouco mais rápido, mas ainda chato
        }
    }
});

// Prevenir uso das setinhas do teclado no modo lento para evitar trapaças
window.addEventListener('keydown', (evento) => {
    // Só aplica a tortura se o castigo estiver ativo e o pop-up estiver visível
    if (modoLeituraLenta && !modalTermos.classList.contains('escondido')) {
        
        // Teclas que descem a página
        const teclasDescer = ["ArrowDown", "PageDown", " ", "Spacebar"]; 
        
        if (teclasDescer.includes(evento.key)) {
            evento.preventDefault(); // Impede a descida rápida
            caixaTextoTermos.scrollTop += 5; // Desce apenas míseros 5 pixels
        }
        
        // Teclas que sobem a página (opcional bloquear, mas bom para evitar fugas rápidas)
        const teclasSubir = ["ArrowUp", "PageUp"];
        
        if (teclasSubir.includes(evento.key)) {
            evento.preventDefault();
            caixaTextoTermos.scrollTop -= 200; // Sobe um pouco mais rápido, mas nem tanto
        }
    }
});

// --- VARIÁVEIS DE TEMPO CONFIGURÁVEIS (Em milissegundos) ---
const VELOCIDADE_ROLETA = 1000; // Tempo que a roleta gira sozinha
const ATRASO_POS_CLIQUE = 250;  // Tempo de "respiro" antes da próxima letra aparecer

// --- LÓGICA DO NOME EM ROLETA ---
const caixaNome = document.getElementById('caixaNome');
const controleNome = document.getElementById('controlesNome');
const btnFinalizarNome = document.getElementById('btnFinalizarNome');
const btnApagarNome = document.getElementById('btnApagarNome');
const modalErroNome = document.getElementById('modalErroNome');
const btnVoltarNome = document.getElementById('btnVoltarNome');
const nomeInvalidoDisplay = document.getElementById('nomeInvalidoDisplay');

const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ "; 
let nomeFixado = "";
let letraAtual = "";
let intervaloRoleta = null;
let roletaAtiva = false;
let cliqueBloqueado = false; // Trava contra cliques duplos muito rápidos

function girarLetra() {
    letraAtual = alfabeto[Math.floor(Math.random() * alfabeto.length)];
    let letraExibicao = letraAtual === " " ? "&nbsp;" : letraAtual;
    caixaNome.innerHTML = `${nomeFixado}<span class="letra-girando">${letraExibicao}</span>`;
}

function iniciarRoleta() {
    if (intervaloRoleta) clearInterval(intervaloRoleta);
    roletaAtiva = true;
    
    caixaNome.classList.remove('vazio');
    caixaNome.classList.add('roleta-ativa');
    controlesNome.classList.remove('oculto-layout');
    
    girarLetra();
    
    // Usa a sua variável de velocidade aqui
    intervaloRoleta = setInterval(girarLetra, VELOCIDADE_ROLETA); 
}

caixaNome.addEventListener('click', () => {
    // Se estiver no tempo de respiro, ignora qualquer clique desesperado do usuário
    if (cliqueBloqueado) return; 

    if (!roletaAtiva) {
        nomeFixado = "";
        iniciarRoleta();
    } else {
        nomeFixado += letraAtual;
        
        // Bloqueia a roleta e os cliques temporariamente
        cliqueBloqueado = true;
        clearInterval(intervaloRoleta);
        
        // Mostra um sublinhado piscando para o usuário saber que "deu certo"
        caixaNome.innerHTML = `${nomeFixado}<span class="letra-girando">_</span>`;
        
        // Espera o seu tempo customizável para voltar ao caos
        setTimeout(() => {
            cliqueBloqueado = false;
            iniciarRoleta(); 
        }, ATRASO_POS_CLIQUE);
    }
});

function limparNome() {
    nomeFixado = "";
    letraAtual = "";
    roletaAtiva = false;
    cliqueBloqueado = false;
    clearInterval(intervaloRoleta);
    
    caixaNome.innerHTML = ""; 
    caixaNome.classList.add('vazio'); 
    caixaNome.classList.remove('roleta-ativa'); 
    controlesNome.classList.add('oculto-layout'); 
}

btnApagarNome.addEventListener('click', limparNome);

btnFinalizarNome.addEventListener('click', () => {
    if (roletaAtiva) clearInterval(intervaloRoleta);
    roletaAtiva = false;
    caixaNome.classList.remove('roleta-ativa');
    controlesNome.classList.add('oculto-layout');
    
    const temVogal = /[AEIOU]/.test(nomeFixado);
    const temConsoante = /[BCDFGHJKLMNPQRSTVWXYZ]/.test(nomeFixado);
    const minimoLetras = nomeFixado.length >= 3;
    const maximoLetras = nomeFixado.length <= 25;

    const limiteConsoantes = !/[BCDFGHJKLMNPQRSTVWXYZ]{3,}/.test(nomeFixado); 
    const limiteVogais = !/[AEIOU]{3,}/.test(nomeFixado);
    const semEspacosDuplos = !/ {2,}/.test(nomeFixado);
    const semEspacoNasPontas = !(nomeFixado.startsWith(" ") || nomeFixado.endsWith(" "));

    if (temVogal && temConsoante && minimoLetras && maximoLetras && limiteConsoantes && limiteVogais && semEspacosDuplos && semEspacoNasPontas) {
        caixaNome.innerHTML = nomeFixado; 
        alert("Nome aceito preliminarmente. Esperamos que seja seu nome real.");
    } else {
        let motivo = "Nome não parece humano.";
        if (!maximoLetras) motivo = "Nome longo demais.";
        else if (!limiteConsoantes) motivo = "Muitas consoantes seguidas.";
        else if (!limiteVogais) motivo = "Muitas vogais seguidas.";
        else if (!semEspacosDuplos) motivo = "Múltiplos espaços seguidos detectados.";
        else if (!semEspacoNasPontas) motivo = "O nome não pode começar nem terminar com um espaço.";
        else if (!minimoLetras) motivo = "Nome muito curto.";
        
        console.log(`Falha na validação: ${motivo}`); 
        
        nomeInvalidoDisplay.textContent = nomeFixado.replace(/ /g, "␣") || "(vazio)";
        modalErroNome.classList.remove('escondido');
        limparNome(); 
    }
});

btnVoltarNome.addEventListener('click', () => {
    modalErroNome.classList.add('escondido');
});

// --- LÓGICA DO TELEFONE EM BUSCA BINÁRIA ---
const caixaTelefone = document.getElementById('caixaTelefone');
const interfaceTelefone = document.getElementById('interfaceTelefone');
const perguntaTelefone = document.getElementById('perguntaTelefone');
const btnTelSim = document.getElementById('btnTelSim');
const btnTelNao = document.getElementById('btnTelNao');
const btnApagarTelefone = document.getElementById('btnApagarTelefone');
const numeroDetectado = document.getElementById('numeroDetectado');

let telFase = 0; 
let telMin = 0;
let telMax = 0;
let dddFinal = "__";
let prefixoFinal = "_____";
let sufixoFinal = "____";

function iniciarFaseTelefone() {
    if (telFase === 0) {
        telMin = 11; telMax = 99; 
    } else if (telFase === 1) {
        telMin = 90000; telMax = 99999; 
    } else if (telFase === 2) {
        telMin = 0; telMax = 9999; 
    }
    gerarPerguntaTelefone();
}

function atualizarDisplayTelefone() {
    const sufixoFormatado = sufixoFinal === "____" ? sufixoFinal : String(sufixoFinal).padStart(4, '0');
    numeroDetectado.textContent = `(${dddFinal}) ${prefixoFinal}-${sufixoFormatado}`;
}

function gerarPerguntaTelefone() {
    if (telMin === telMax) {
        if (telFase === 0) dddFinal = telMin;
        if (telFase === 1) prefixoFinal = telMin;
        if (telFase === 2) sufixoFinal = telMin;
        
        atualizarDisplayTelefone();
        telFase++;
        
        if (telFase < 3) {
            iniciarFaseTelefone();
        } else {
            // O JOGO ACABOU
            alert("Número de telefone finalizado. Verifique se está correto na caixa de texto.");
            
            interfaceTelefone.classList.add('oculto-layout');
            
            caixaTelefone.classList.remove('oculto-layout');
            caixaTelefone.classList.remove('vazio');
            
            // A ISCA: Cursor normal de texto para a pessoa achar que pode editar
            caixaTelefone.style.cursor = 'text'; 
            
            const sufixoFormatado = String(sufixoFinal).padStart(4, '0');
            caixaTelefone.innerHTML = `(${dddFinal}) ${prefixoFinal}-${sufixoFormatado}`;
        }
        return;
    }

    const meio = Math.floor((telMin + telMax) / 2);
    let parteNome = telFase === 0 ? "DDD" : (telFase === 1 ? "primeira parte do número" : "segunda parte do número");
    
    perguntaTelefone.textContent = `O seu ${parteNome} está entre ${telMin} e ${meio}?`;
}

// O GOLPE FINAL: O evento de clique na caixa falsa
caixaTelefone.addEventListener('click', () => {
    if (telFase === 0 && dddFinal === "__") { 
        // Primeiro clique para começar
        caixaTelefone.classList.remove('vazio');
        caixaTelefone.classList.add('oculto-layout'); 
        interfaceTelefone.classList.remove('oculto-layout'); 
        iniciarFaseTelefone();
    } else if (telFase >= 3) {
        // Se a pessoa clicou DEPOIS de terminar, zera tudo brutalmente
        alert("Ops! O sistema detectou uma tentativa de edição manual e apagou tudo por segurança. Comece de novo!");
        resetarTudoTelefone();
    }
});

btnTelSim.addEventListener('click', () => {
    telMax = Math.floor((telMin + telMax) / 2);
    gerarPerguntaTelefone();
});

btnTelNao.addEventListener('click', () => {
    telMin = Math.floor((telMin + telMax) / 2) + 1;
    gerarPerguntaTelefone();
});

function resetarTudoTelefone() {
    telFase = 0;
    dddFinal = "__";
    prefixoFinal = "_____";
    sufixoFinal = "____";
    
    interfaceTelefone.classList.add('oculto-layout');
    
    caixaTelefone.classList.remove('oculto-layout');
    caixaTelefone.classList.add('vazio');
    caixaTelefone.innerHTML = "";
    caixaTelefone.style.cursor = 'text'; 
    
    atualizarDisplayTelefone();
    alert('Por sua segurana, coloque novamente seu número de telefone.')
}

btnApagarTelefone.addEventListener('click', resetarTudoTelefone);

// --- LÓGICA DO ENDEREÇO POR COORDENADAS ---
const caixaEndereco = document.getElementById('caixaEndereco');
const interfaceEndereco = document.getElementById('interfaceEndereco');
const sliderLat = document.getElementById('sliderLat');
const sliderLon = document.getElementById('sliderLon');
const displayLat = document.getElementById('displayLat');
const displayLon = document.getElementById('displayLon');
const displayDistancia = document.getElementById('displayDistancia');
const btnConfirmarEndereco = document.getElementById('btnConfirmarEndereco');

// Coordenadas Alvo (Ji-Paraná, RO)
const ALVO_LAT = -10.8776; 
const ALVO_LON = -61.9515;
let enderecoResolvido = false;

// Fórmula de Haversine para calcular distância real
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
}

function atualizarRadar() {
    const latAtual = parseFloat(sliderLat.value);
    const lonAtual = parseFloat(sliderLon.value);
    
    displayLat.textContent = latAtual.toFixed(4);
    displayLon.textContent = lonAtual.toFixed(4);
    
    const distancia = calcularDistancia(latAtual, lonAtual, ALVO_LAT, ALVO_LON);
    
    if (distancia < 30) {
        displayDistancia.style.color = "#00ff00"; 
        displayDistancia.textContent = `Alvo detectado! Você está a menos de ${distancia.toFixed(1)} km do centro.`;
    } else if (distancia < 100) {
        displayDistancia.style.color = "#ffff00"; 
        displayDistancia.textContent = `Você está na região certa (a ${distancia.toFixed(0)} km). Ajuste fino necessário.`;
    } else if (distancia < 1000) {
        displayDistancia.style.color = "#ff9900"; 
        displayDistancia.textContent = `Ainda no mesmo país, pelo menos (a ${distancia.toFixed(0)} km).`;
    } else {
        displayDistancia.style.color = "#ff3333"; 
        displayDistancia.textContent = `Localização inválida. Você está a ${distancia.toLocaleString('pt-BR', {maximumFractionDigits: 0})} km de casa.`;
    }
}

sliderLat.addEventListener('input', atualizarRadar);
sliderLon.addEventListener('input', atualizarRadar);

// O Gatilho da Armadilha
caixaEndereco.addEventListener('click', () => {
    if (!enderecoResolvido) {
        // Primeiro clique: Oculta a caixa falsa e abre o radar
        caixaEndereco.classList.remove('vazio-endereco');
        caixaEndereco.classList.add('oculto-layout');
        interfaceEndereco.classList.remove('oculto-layout');
        atualizarRadar(); 
    } else {
        // Clicou DEPOIS de pronto: Punição!
        alert("Dectamos uma tentativa de alteração do seu endereço. Por sua segurança, recalibre o satélite");
        resetarEndereco();
    }
});

// Botão de Confirmar com a Punição Correta
btnConfirmarEndereco.addEventListener('click', () => {
    const latAtual = parseFloat(sliderLat.value);
    const lonAtual = parseFloat(sliderLon.value);
    const distancia = calcularDistancia(latAtual, lonAtual, ALVO_LAT, ALVO_LON);
    
    if (distancia <= 30) {
        alert("Endereço confirmado e registrado via satélite!");
        enderecoResolvido = true;
        
        interfaceEndereco.classList.add('oculto-layout');
        
        caixaEndereco.classList.remove('oculto-layout');
        caixaEndereco.style.cursor = 'text'; 
        caixaEndereco.innerHTML = `Lat: ${latAtual.toFixed(4)} | Lon: ${lonAtual.toFixed(4)} (Residência Confirmada)`;
    } else {
        alert(`Acreditamos que em ${distancia.toFixed(0)} km de onde deveria estar. Recalibre o satélite`);
        
        // A punição: Zera tudo e manda ele de volta pro mar
        sliderLat.value = 0;
        sliderLon.value = 0;
        atualizarRadar();
    }
});

function resetarEndereco() {
    enderecoResolvido = false;
    sliderLat.value = 0;
    sliderLon.value = 0;
    
    interfaceEndereco.classList.add('oculto-layout');
    
    caixaEndereco.classList.remove('oculto-layout');
    caixaEndereco.classList.add('vazio-endereco');
    caixaEndereco.innerHTML = "";
    caixaEndereco.style.cursor = 'text';
}

// --- LÓGICA DA DATA DE NASCIMENTO ASTROLÓGICA E IDADE ---
const caixaNascimento = document.getElementById('caixaNascimento');
const interfaceNascimento = document.getElementById('interfaceNascimento');
const selectSigno = document.getElementById('selectSigno');
const sliderLua = document.getElementById('sliderLua');
const displayLua = document.getElementById('displayLua');
const displayAno = document.getElementById('displayAno');
const btnRoletaAno = document.getElementById('btnRoletaAno');
const dataDetectada = document.getElementById('dataDetectada');
const btnConfirmarNascimento = document.getElementById('btnConfirmarNascimento');

const caixaIdade = document.getElementById('caixaIdade');
const interfaceIdade = document.getElementById('interfaceIdade');
const selectEventoNostalgia = document.getElementById('selectEventoNostalgia');
const btnConfirmarIdade = document.getElementById('btnConfirmarIdade');

let nascimentoResolvido = false;
let idadeResolvida = false;
let roletaAnoAtiva = false;
let intervaloAno = null;
let mesAtual = "__";
let diaAtual = "15";
let anoAtual = "____";

const fasesDaLua = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];

// O "Gabarito" imutável dos Emojis (O mês real está atrelado ao desenho)
const signosVerdadeiros = [
    { emoji: "♑", mes: "01" }, { emoji: "♒", mes: "02" }, { emoji: "♓", mes: "03" },
    { emoji: "♈", mes: "04" }, { emoji: "♉", mes: "05" }, { emoji: "♊", mes: "06" },
    { emoji: "♋", mes: "07" }, { emoji: "♌", mes: "08" }, { emoji: "♍", mes: "09" },
    { emoji: "♎", mes: "10" }, { emoji: "♏", mes: "11" }, { emoji: "♐", mes: "12" }
];

// As palavras que vão apenas servir para enganar
const nomesFalsos = [
    "Capricórnio", "Aquário", "Peixes", "Áries", "Touro", "Gêmeos",
    "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário"
];

// 1. O Embaralhador de Signos Mentirosos
function embaralharSignos() {
    const emojisMisturados = [...signosVerdadeiros].sort(() => Math.random() - 0.5);
    const nomesMisturados = [...nomesFalsos].sort(() => Math.random() - 0.5);

    selectSigno.innerHTML = '<option value="00">Selecione sua casa zodiacal...</option>';

    for (let i = 0; i < 12; i++) {
        let opt = document.createElement('option');
        opt.value = emojisMisturados[i].mes; 
        opt.textContent = `${nomesMisturados[i]} ${emojisMisturados[i].emoji}`;
        selectSigno.appendChild(opt);
    }
}

// Variável secreta que vai girar o calendário por trás do slider
let offsetLunar = 0; 

// 2. A Nova Função: Calendário Lunar Deslocado
function atualizarFaseLua() {
    const sliderVal = parseInt(sliderLua.value);
    
    // A Mágica: Soma a posição do slider com o offset secreto e faz dar a volta em 31 dias
    diaAtual = ((sliderVal - 1 + offsetLunar) % 31) + 1;
    
    // Calcula o emoji com base no dia real que está sendo sorteado
    const indexLua = Math.floor((diaAtual - 1) / (31 / 8));
    displayLua.textContent = fasesDaLua[Math.min(indexLua, 7)];
}

// Essa função é chamada quando a caixa abre ou quando sofre punição
function iniciarCicloLunar() {
    // O slider SEMPRE volta fisicamente para o meio
    sliderLua.value = 16;
    
    // O sistema sorteia um novo "Ponto Zero" aleatório para o calendário (0 a 30)
    offsetLunar = Math.floor(Math.random() * 31);
    
    // Atualiza a tela com a lua correspondente à nova realidade
    atualizarFaseLua();
}

// Quando o coitado arrastar a barra, a lua muda baseada no calendário oculto
sliderLua.addEventListener('input', atualizarFaseLua);

function atualizarDataOculta() {
    dataDetectada.textContent = `??/??/${anoAtual}`;
}

selectSigno.addEventListener('change', (e) => {
    mesAtual = e.target.value === "00" ? "__" : e.target.value;
});

// A Roleta Consertada
btnRoletaAno.addEventListener('click', () => {
    if (!roletaAnoAtiva) {
        roletaAnoAtiva = true;
        btnRoletaAno.textContent = "PARAR!";
        btnRoletaAno.style.backgroundColor = "#dc3545"; 
        
        intervaloAno = setInterval(() => {
            anoAtual = Math.floor(Math.random() * (2026 - 1980 + 1)) + 1980;
            displayAno.textContent = anoAtual;
            atualizarDataOculta(); 
        }, 120); 
    } else {
        roletaAnoAtiva = false;
        btnRoletaAno.textContent = "Pegar outro ano?";
        btnRoletaAno.style.backgroundColor = "#ff9900"; 
        clearInterval(intervaloAno);
    }
});

// Abrindo a Caixa Astrológica
caixaNascimento.addEventListener('click', () => {
    if (!nascimentoResolvido) {
        caixaNascimento.classList.remove('vazio-nascimento');
        caixaNascimento.classList.add('oculto-layout');
        interfaceNascimento.classList.remove('oculto-layout');
        
        embaralharSignos(); 
        iniciarCicloLunar();
    } else {
        alert("Detectamos uma tentativa de fraldar a idade, por sua segurança, coloque novamente sua data de nascimento e idade.");
        resetarNascimentoEIdade();
    }
});

btnConfirmarNascimento.addEventListener('click', () => {
    if (mesAtual === "__" || anoAtual === "____" || roletaAnoAtiva) {
        alert("Coloque sua data de nascimento primeiro");
        return;
    }
    
    nascimentoResolvido = true;
    interfaceNascimento.classList.add('oculto-layout');
    caixaNascimento.classList.remove('oculto-layout');
    caixaNascimento.style.cursor = 'text'; 
    
    const diaF = String(diaAtual).padStart(2, '0');
    caixaNascimento.innerHTML = `${diaF}/${mesAtual}/${anoAtual}`;
    alert(`Registramos sua data de nascimento como: ${diaF}/${mesAtual}/${anoAtual}.`);
});


// --- LÓGICA DA PROVA DE IDADE E EVENTOS HISTÓRICOS ---

const eventosHistoricos = {
    1980: "Lançamento do jogo Pac-Man", 1981: "Estreia do canal MTV", 1982: "Lançamento do álbum Thriller do Michael Jackson",
    1983: "Lançamento do primeiro Mario Bros (Arcade)", 1984: "Lançamento do jogo Tetris original", 1985: "Lançamento de Super Mario Bros no NES",
    1986: "Lançamento de The Legend of Zelda", 1987: "Lançamento do primeiro Final Fantasy", 1988: "Lançamento do console Mega Drive",
    1989: "Queda do Muro de Berlim e Lançamento do Game Boy", 1990: "Lançamento de Super Mario World", 1991: "Lançamento de Sonic the Hedgehog",
    1992: "Lançamento do primeiro Mortal Kombat", 1993: "Estreia de Jurassic Park nos cinemas", 1994: "Lançamento do PlayStation 1 e Tetra do Brasil",
    1995: "Lançamento do Windows 95", 1996: "Lançamento de Pokémon Red & Blue", 1997: "Lançamento do primeiro livro de Harry Potter",
    1998: "Fundação do Google e Lançamento de Half-Life", 1999: "Estreia do filme Matrix nos cinemas", 2000: "Lançamento do PS2 e Bug do Milênio",
    2001: "Lançamento do primeiro iPod e estreia de Shrek", 2002: "Brasil Pentacampeão da Copa do Mundo", 2003: "Lançamento do comunicador Skype",
    2004: "Criação do Orkut e Lançamento de GTA San Andreas", 2005: "Primeiro vídeo postado na história do YouTube", 2006: "Lançamento do Nintendo Wii",
    2007: "Lançamento do primeiro iPhone", 2008: "Lançamento de Homem de Ferro (MCU)", 2009: "Lançamento de Minecraft e League of Legends",
    2010: "Lançamento do Instagram e do primeiro iPad", 2011: "Lançamento de Skyrim", 2012: "O Mundo não acabou (Fim do Calendário Maia)",
    2013: "Lançamento do fenômeno GTA V", 2014: "7x1 para a Alemanha na Copa do Mundo", 2015: "Lançamento de The Witcher 3 e do Discord",
    2016: "Febre mundial do aplicativo Pokémon GO", 2017: "Lançamento do Nintendo Switch", 2018: "Lançamento de Red Dead Redemption 2",
    2019: "Estreia do filme Vingadores: Ultimato", 2020: "Pandemia Global e Lançamento do PS5", 2021: "A série Round 6 (Squid Game) vira febre global",
    2022: "Argentina campeã da Copa e Lançamento de Elden Ring", 2023: "Explosão popular da Inteligência Artificial", 2024: "O ano em que o X foi bloqueado no Brasil",
    2025: "Lançamento histórico de GTA VI", 2026: "Copa do Mundo na América do Norte (EUA/Canadá/México)"
};

function gerarOpcoesIdade() {
    selectEventoNostalgia.innerHTML = '<option value="0">Qual evento aconteceu no seu ano?</option>';
    
    const todosOsAnos = Object.keys(eventosHistoricos).map(Number);
    const anosErrados = todosOsAnos.filter(ano => ano !== parseInt(anoAtual));
    
    anosErrados.sort(() => Math.random() - 0.5);
    const anosFalsos = anosErrados.slice(0, 4);
    
    let todasOpcoes = [...anosFalsos, parseInt(anoAtual)];
    todasOpcoes.sort(() => Math.random() - 0.5); 
    
    todasOpcoes.forEach(ano => {
        let textoEvento = eventosHistoricos[ano];
        let opt = document.createElement('option');
        opt.value = ano;
        opt.textContent = textoEvento;
        selectEventoNostalgia.appendChild(opt);
    });
}

caixaIdade.addEventListener('click', () => {
    if (!nascimentoResolvido) {
        alert("Preencha e confirme sua Data de Nascimento primeiro!");
        return;
    }
    if (!idadeResolvida) {
        caixaIdade.classList.remove('vazio-idade');
        caixaIdade.classList.add('oculto-layout');
        interfaceIdade.classList.remove('oculto-layout');
        gerarOpcoesIdade(); 
    }
});


selectEventoNostalgia.addEventListener('change', () => {
    const anoEscolhido = selectEventoNostalgia.value;
    
    if (anoEscolhido !== "0") {
        // Pega o texto exato do evento que a pessoa escolheu
        const textoEvento = selectEventoNostalgia.options[selectEventoNostalgia.selectedIndex].text;
        
        // Fecha a interface
        interfaceIdade.classList.add('oculto-layout');
        
        // Mostra a caixa bloqueada com o texto que ele escolheu
        caixaIdade.classList.remove('oculto-layout');
        caixaIdade.style.cursor = 'not-allowed'; 
        caixaIdade.style.backgroundColor = "#e9ecef"; 
        caixaIdade.innerHTML = `${textoEvento}`;
    }
});

function resetarNascimentoEIdade() {
    nascimentoResolvido = false;
    mesAtual = "__";
    anoAtual = "____";
    
    iniciarCicloLunar();
    embaralharSignos();
    displayAno.textContent = "____";
    
    if (intervaloAno) clearInterval(intervaloAno);
    roletaAnoAtiva = false;
    btnRoletaAno.textContent = "Girar Roda do Tempo";
    btnRoletaAno.style.backgroundColor = "#ff9900";
    
    atualizarDataOculta();
    
    interfaceNascimento.classList.add('oculto-layout');
    caixaNascimento.classList.remove('oculto-layout');
    caixaNascimento.classList.add('vazio-nascimento');
    caixaNascimento.innerHTML = "";
    caixaNascimento.style.cursor = 'text';

    idadeResolvida = false;
    interfaceIdade.classList.add('oculto-layout');
    caixaIdade.classList.remove('oculto-layout');
    caixaIdade.classList.add('vazio-idade');
    caixaIdade.innerHTML = "";
    caixaIdade.style.cursor = 'text';
}

// --- LÓGICA DO E-MAIL (TECLADO CAÓTICO E REVERSO) ---
const caixaEmail = document.getElementById('caixaEmail');
const interfaceEmail = document.getElementById('interfaceEmail');
const displayEmail = document.getElementById('displayEmail');
const tecladoVirtual = document.getElementById('tecladoVirtual');
const btnApagarEmail = document.getElementById('btnApagarEmail');
const inputConfirmaEmail = document.getElementById('inputConfirmaEmail');

const teclasEmail = "abcdefghijklmnopqrstuvwxyz0123456789@.-_".split("");
let emailDigitado = "";
let emailResolvido = false;

// Gera o teclado embaralhando tudo a cada chamada
function renderizarTeclado() {
    tecladoVirtual.innerHTML = "";
    // Embaralha o array de teclas
    const teclasEmbaralhadas = [...teclasEmail].sort(() => Math.random() - 0.5);

    teclasEmbaralhadas.forEach(tecla => {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.textContent = tecla;
        // Estilo do botão do teclado
        btn.style.width = "35px";
        btn.style.height = "35px";
        btn.style.padding = "0";
        btn.style.fontSize = "16px";
        btn.style.cursor = "pointer";
        btn.style.backgroundColor = "#f8f9fa";
        btn.style.border = "1px solid #ccc";
        btn.style.borderRadius = "4px";

        btn.addEventListener('click', () => {
            emailDigitado += tecla;
            displayEmail.textContent = emailDigitado;
            // A TORTURA: Renderiza e embaralha tudo de novo após CADA clique
            renderizarTeclado(); 
        });
        
        tecladoVirtual.appendChild(btn);
    });
}

const btnFinalizarEmail = document.getElementById('btnFinalizarEmail');

// Ação de fechar e fixar o e-mail digitado
// Ação de apenas recolher o teclado caótico e mostrar o e-mail coletado
btnFinalizarEmail.addEventListener('click', () => {
    if (emailDigitado.length < 5 || !emailDigitado.includes('@')) {
        alert("E-mail incompleto ou inválido. Digite um e-mail real usando o teclado.");
        return;
    }

    // Apenas oculta a interface do teclado, mas NÃO marca como totalmente "resolvido" 
    // para permitir que o Juízo Final valide o e-mail reverso depois.
    interfaceEmail.classList.add('oculto-layout');
    
    // Devolve a caixa de texto para a tela com o e-mail visível
    caixaEmail.classList.remove('oculto-layout');
    caixaEmail.style.cursor = 'text';
    caixaEmail.innerHTML = `✉️ ${emailDigitado} (Teclado concluído. Preencha a confirmação abaixo!)`;
    
    alert("Teclado recolhido com sucesso! Agora vá até o campo de confirmação (ou direto para o Enviar) para concluir.");
});

caixaEmail.addEventListener('click', () => {
    caixaEmail.classList.add('oculto-layout');
    interfaceEmail.classList.remove('oculto-layout');
    renderizarTeclado();
});

btnApagarEmail.addEventListener('click', () => {
    emailDigitado = "";
    displayEmail.textContent = "";
    inputConfirmaEmail.value = "";
    renderizarTeclado();
});

function resetarEmail() {
    emailDigitado = "";
    displayEmail.textContent = "";
    inputConfirmaEmail.value = "";
    emailResolvido = false;
    
    interfaceEmail.classList.add('oculto-layout');
    caixaEmail.classList.remove('oculto-layout');
    caixaEmail.classList.add('vazio-email');
}


// --- O BOTÃO DO JUÍZO FINAL (VALIDAÇÃO GLOBAL) ---
const btnEnviarFormulario = document.getElementById('btnEnviarFormulario');

btnEnviarFormulario.addEventListener('click', () => {
    
    // 1. Coleta a Auditoria de Idade
    const anoEscolhido = selectEventoNostalgia.value;
    
    // 2. Coleta as strings de E-mail
    const confirmacaoDigitada = inputConfirmaEmail.value;
    // Pega o e-mail do teclado virtual e inverte ele por código para comparar
    const emailReversoCorreto = emailDigitado.split("").reverse().join(""); 
    
    let errosFatais = [];

    // Checa a Idade
    if (anoEscolhido === "0" || anoEscolhido !== String(anoAtual)) {
        errosFatais.push(a);
    }

    // Checa o E-mail Reverso
    if (emailDigitado === "" || confirmacaoDigitada !== emailReversoCorreto) {
        errosFatais.push(b);
    }

    // SE TIVER QUALQUER ERRO: O APOCALIPSE
    if (errosFatais.length > 0) {
        alert(`Detectamos que algum campo do formulario falha com as informações concedidas. Por sua seguraça, refaça o formulario`);
        
        // Ativa TODAS as punições que criamos no projeto de uma vez só!
        limparNome();
        resetarTudoTelefone();
        resetarEndereco();
        resetarNascimentoEIdade();
        resetarEmail();
        
        // Rola a página de volta para o topo para esfregar na cara dele que ele perdeu tudo
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } else {
        // O MILAGRE: Ele conseguiu.
        alert("🎉 INACREDITÁVEL! O sistema aceitou todos os seus dados. O formulário foi enviado com sucesso! Você venceu o Anti-Design!");
        
        // (Opcional) Recarrega a página para reiniciar a brincadeira
        // location.reload();
    }
});