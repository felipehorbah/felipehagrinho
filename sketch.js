// --- Variáveis Globais do Jogo ---
let gameState = 'campo'; // Estados: 'campo', 'galpao', 'menu', 'melhoriaColheitadeira', 'aumentoTerreno'

// Cenário
let solX, solY;
let nuvens = []; // Array para armazenar as nuvens
const numNuvens = 5;

// Colheitadeira
let colheitadeiraX, colheitadeiraY;
let colheitadeiraVelocidade = 4;
let colheitadeiraLargura = 120;
let colheitadeiraAltura = 70;
let milhosNaCarroceria = 0;
let capacidadeColheitadeira = 40; // Capacidade inicial em milhos
let milhoValor = 10; // Cada milho vale 10 moedas

// Milhos
let pesMilho = []; // Array para armazenar cada pé de milho
let milhosColetadosNosPes = []; // Para controlar se o milho foi coletado de cada pé
let numPesMilhoAtual = 20; // Número inicial de pés de milho no campo
let milhoStartX; // Posição X inicial para a geração de novos milhos

// Moedas
let moedas = 0; // Moedas iniciais do jogador

// Galpão
let galpaoX; // Posição X do galpão (para simular o movimento do cenário)
let galpaoAlvoX; // Posição X que o galpão deve estar na tela para interagir

// Menu
let menuBotaoX, menuBotaoY, menuBotaoLargura, menuBotaoAltura;

// --- Função setup() ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER); // Facilita o posicionamento de retângulos
  ellipseMode(CENTER); // Facilita o posicionamento de elipses

  // Posição inicial do sol e nuvens
  solX = width * 0.8;
  solY = height * 0.2;

  // Inicializa as nuvens
  for (let i = 0; i < numNuvens; i++) {
    nuvens.push({
      x: random(width),
      y: random(height * 0.05, height * 0.2),
      largura: random(80, 150),
      altura: random(40, 80),
      velocidade: random(0.2, 0.6)
    });
  }

  // Posição inicial da colheitadeira
  colheitadeiraX = width / 4;
  colheitadeiraY = height * 0.75;

  // Inicializa os pés de milho
  inicializarPesMilho(numPesMilhoAtual);

  // Posição do botão de menu
  menuBotaoX = width - 50;
  menuBotaoY = 30;
  menuBotaoLargura = 60;
  menuBotaoAltura = 40;

  // Posição inicial do galpão (fora da tela à direita)
  galpaoX = width * 1.5;
  galpaoAlvoX = width * 0.8; // Onde o galpão "para" para a interação
}

// --- Função draw() ---
function draw() {
  background(135, 206, 235); // Céu azul

  // Desenha o sol
  fill(255, 255, 0);
  noStroke();
  ellipse(solX, solY, 80, 80);

  // Desenha e movimenta as nuvens
  fill(255, 255, 255, 200); // Nuvem branca com transparência
  for (let i = 0; i < numNuvens; i++) {
    let nuvem = nuvens[i];
    ellipse(nuvem.x, nuvem.y, nuvem.largura, nuvem.altura);
    ellipse(nuvem.x + nuvem.largura / 3, nuvem.y, nuvem.largura * 0.8, nuvem.altura * 0.8);
    ellipse(nuvem.x - nuvem.largura / 4, nuvem.y + nuvem.altura / 4, nuvem.largura * 0.7, nuvem.altura * 0.7);

    nuvem.x += nuvem.velocidade;
    if (nuvem.x > width + nuvem.largura / 2) {
      nuvem.x = -nuvem.largura / 2;
      nuvem.y = random(height * 0.05, height * 0.2); // Reposiciona na altura também
    }
  }

  // Lógica principal do jogo baseada no estado
  if (gameState === 'campo') {
    desenhaCampo();
    atualizaColheitadeiraNoCampo();
    desenhaColheitadeira();
  } else if (gameState === 'galpao') {
    desenhaGalpao();
    atualizaColheitadeiraNoGalpao();
    desenhaColheitadeira(); // Desenha a colheitadeira no galpão
  } else if (gameState === 'menu') {
    desenhaMenu();
  } else if (gameState === 'melhoriaColheitadeira') {
    desenhaMelhoriaColheitadeira();
  } else if (gameState === 'aumentoTerreno') {
    desenhaAumentoTerreno();
  }

  // --- Desenha o botão de Menu (sempre visível) ---
  fill(100);
  rect(menuBotaoX, menuBotaoY, menuBotaoLargura, menuBotaoAltura, 5);
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("MENU", menuBotaoX, menuBotaoY);

  // --- Mostra as Moedas e Milhos na Carroceria ---
  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text(`Moedas: ${moedas}`, 10, 10);
  text(`Milhos: ${milhosNaCarroceria}/${capacidadeColheitadeira}`, 10, 35);
}

// --- Funções de Desenho e Lógica de Jogo ---

function desenhaCampo() {
  // Chão
  fill(100, 150, 50);
  rect(width / 2, height * 0.8, width, height * 0.4);

  // Desenha os pés de milho
  for (let i = 0; i < pesMilho.length; i++) {
    let milho = pesMilho[i];

    // Se o milho saiu da tela para a esquerda, reposiciona ele na direita
    if (milho.x < -milho.largura / 2) {
      milho.x = width + random(milho.largura, width / numPesMilhoAtual); // Reaparece na direita
      milhosColetadosNosPes[i] = false; // "Nasce" com milhos novamente
    }

    fill(100, 180, 0); // Cor do pé de milho
    rect(milho.x, milho.y, milho.largura, milho.altura);

    // Desenha as espigas (se não foram coletadas)
    if (!milhosColetadosNosPes[i]) {
      fill(255, 230, 0); // Cor da espiga
      ellipse(milho.x + milho.largura / 2, milho.y - milho.altura / 4, 15, 30);
      ellipse(milho.x - milho.largura / 2, milho.y - milho.altura / 8, 15, 30);
    }
  }
}

function atualizaColheitadeiraNoCampo() {
  // Movimento da colheitadeira com as setas
  if (keyIsDown(LEFT_ARROW)) {
    colheitadeiraX -= colheitadeiraVelocidade;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    colheitadeiraX += colheitadeiraVelocidade;
  }
  if (keyIsDown(UP_ARROW)) {
    colheitadeiraY -= colheitadeiraVelocidade;
  }
  if (keyIsDown(DOWN_ARROW)) {
    colheitadeiraY += colheitadeiraVelocidade;
  }

  // Limites da tela para a colheitadeira
  colheitadeiraX = constrain(colheitadeiraX, colheitadeiraLargura / 2, width - colheitadeiraLargura / 2);
  colheitadeiraY = constrain(colheitadeiraY, height * 0.6, height * 0.9); // Limita ao chão

  // Colisão com os pés de milho para coletar
  for (let i = 0; i < pesMilho.length; i++) {
    let milho = pesMilho[i];

    // Verifica se o milho ainda não foi coletado do pé e se está visível na tela
    if (!milhosColetadosNosPes[i] && milho.x > -milho.largura / 2 && milho.x < width + milho.largura / 2) {
      // Colisão retangular simplificada
      let colisaoX = abs(colheitadeiraX - milho.x) < (colheitadeiraLargura / 2 + milho.largura / 2);
      let colisaoY = abs(colheitadeiraY - milho.y) < (colheitadeiraAltura / 2 + milho.altura / 2);

      if (colisaoX && colisaoY) {
        if (milhosNaCarroceria < capacidadeColheitadeira) {
          milhosNaCarroceria += milho.espigas; // Cada pé de milho tem 2 espigas
          milhosColetadosNosPes[i] = true; // Marca como coletado
          console.log(`Milhos na carroceria: ${milhosNaCarroceria}/${capacidadeColheitadeira}`);
        } else {
          console.log("Carroceria cheia! Vá para o galpão.");
          // Opcional: Adicionar um som ou mensagem na tela
        }
      }
    }
    // Move o milho para a esquerda (simulando o avanço da colheitadeira)
    milho.x -= colheitadeiraVelocidade * 0.5;
  }

  // Lógica para ir para o galpão quando a carroceria está cheia
  if (milhosNaCarroceria >= capacidadeColheitadeira) {
    gameState = 'galpao';
    galpaoX = width + 200; // Começa o galpão fora da tela à direita
    colheitadeiraX = width / 4; // Volta a colheitadeira para a posição inicial no campo
  }
}

function desenhaColheitadeira() {
  fill(0, 128, 0); // Verde para a colheitadeira
  noStroke();

  // Corpo principal
  rect(colheitadeiraX, colheitadeiraY, colheitadeiraLargura, colheitadeiraAltura, 10);

  // Cabine
  fill(0, 80, 0);
  rect(colheitadeiraX + colheitadeiraLargura / 2 - 20, colheitadeiraY - colheitadeiraAltura / 4, 30, 25, 5);

  // Parte da frente (coletor)
  fill(180, 180, 0); // Amarelo para o coletor
  rect(colheitadeiraX - colheitadeiraLargura / 2 - 20, colheitadeiraY + 10, 40, colheitadeiraAltura / 2, 5);

  // Rodas
  fill(50);
  ellipse(colheitadeiraX - colheitadeiraLargura / 4, colheitadeiraY + colheitadeiraAltura / 2 - 10, 35, 35);
  ellipse(colheitadeiraX + colheitadeiraLargura / 4, colheitadeiraY + colheitadeiraAltura / 2 - 10, 35, 35);
}

function desenhaGalpao() {
  // Fundo do galpão
  fill(150, 100, 50); // Marrom
  rect(width / 2, height / 2, width, height);

  // Desenha o galpão
  fill(180, 180, 180); // Cinza
  rect(galpaoX, height * 0.6, 300, 200); // Corpo do galpão
  triangle(galpaoX - 150, height * 0.5, galpaoX + 150, height * 0.5, galpaoX, height * 0.3); // Telhado

  fill(100, 100, 100);
  rect(galpaoX, height * 0.75, 100, 100); // Entrada do galpão

  // Área de descarga
  fill(200, 200, 0);
  rect(galpaoX - 100, height * 0.75, 80, 40); // Local de descarga

  fill(0);
  textSize(24);
  textAlign(CENTER, TOP);
  text("Galpão de Armazenamento", galpaoX, height * 0.2);
  text("Aproxime para descarregar", galpaoX, height * 0.85);
}

function atualizaColheitadeiraNoGalpao() {
  // Movimenta o galpão para a esquerda até a posição alvo
  if (galpaoX > galpaoAlvoX) {
    galpaoX -= colheitadeiraVelocidade; // Movimento do galpão
    colheitadeiraX += colheitadeiraVelocidade; // Colheitadeira também avança com o galpão
  } else {
    // Quando o galpão está na posição, descarrega milhos
    if (milhosNaCarroceria > 0) {
      moedas += milhosNaCarroceria * milhoValor;
      milhosNaCarroceria = 0;
      console.log(`Milhos descarregados! Moedas: ${moedas}`);
      // Opcional: adicionar um som de "dinheiro"
    }
    // Após descarregar, prepara para voltar ao campo
    if (milhosNaCarroceria === 0) {
      // Move o galpão para fora da tela à esquerda
      galpaoX -= colheitadeiraVelocidade * 2;
      colheitadeiraX -= colheitadeiraVelocidade * 2; // Move a colheitadeira junto

      // Se o galpão e a colheitadeira saíram da tela, retorna para o campo
      if (galpaoX < -width / 2) {
        gameState = 'campo';
        colheitadeiraX = width / 4; // Volta para a posição inicial no campo
        inicializarPesMilho(numPesMilhoAtual); // Re-inicializa os milhos para o campo
      }
    }
  }

  // Limite Y no galpão para a colheitadeira
  colheitadeiraY = constrain(colheitadeiraY, height * 0.65, height * 0.85);
}

function inicializarPesMilho(numMilhos) {
  pesMilho = [];
  milhosColetadosNosPes = [];
  milhoStartX = width * 0.1; // Começa a gerar milhos um pouco da esquerda
  for (let i = 0; i < numMilhos; i++) {
    pesMilho.push({
      x: milhoStartX + i * (width * 0.8 / (numMilhos - 1)), // Distribui os milhos pela tela
      y: height * 0.6,
      largura: 30,
      altura: 100,
      espigas: 2 // Cada pé de milho tem 2 espigas
    });
    milhosColetadosNosPes.push(false);
  }
}

// --- Funções do Menu ---
function desenhaMenu() {
  fill(50, 50, 50, 200); // Fundo escuro semi-transparente
  rect(width / 2, height / 2, width * 0.6, height * 0.7, 20);

  fill(255);
  textSize(32);
  textAlign(CENTER, TOP);
  text("MENU", width / 2, height / 2 - height * 0.3 + 20);

  // Opção 1: Melhoria da Colheitadeira
  fill(100, 150, 255);
  rect(width / 2, height / 2 - 50, 300, 60, 10);
  fill(255);
  textSize(20);
  text("Melhoria da Colheitadeira", width / 2, height / 2 - 50);

  // Opção 2: Aumento do Terreno
  fill(100, 150, 255);
  rect(width / 2, height / 2 + 50, 300, 60, 10);
  fill(255);
  textSize(20);
  text("Aumento do Terreno", width / 2, height / 2 + 50);

  // Botão Voltar (dentro do menu)
  fill(255, 100, 100);
  rect(width / 2, height / 2 + height * 0.3 - 40, 150, 50, 10);
  fill(255);
  textSize(18);
  text("Voltar", width / 2, height / 2 + height * 0.3 - 40);
}

function desenhaMelhoriaColheitadeira() {
  fill(50, 50, 50, 200);
  rect(width / 2, height / 2, width * 0.6, height * 0.7, 20);

  fill(255);
  textSize(28);
  textAlign(CENTER, TOP);
  text("Melhoria da Colheitadeira", width / 2, height / 2 - height * 0.3 + 20);

  // Melhoria 1: Carga 1 (40 -> 65 milhos)
  fill(100, 200, 100);
  rect(width / 2, height / 2 - 100, 350, 60, 10);
  fill(255);
  textSize(18);
  text(`Carga 1 (40 -> 65 milhos) - 60 Moedas`, width / 2, height / 2 - 100);

  // Melhoria 2: Carroceria 2 (65 -> 100 milhos)
  fill(100, 200, 100);
  rect(width / 2, height / 2, 350, 60, 10);
  fill(255);
  textSize(18);
  text(`Carroceria 2 (65 -> 100 milhos) - 100 Moedas`, width / 2, height / 2);

  // Melhoria 3: Carroceria 3 (100 -> 120 milhos)
  fill(100, 200, 100);
  rect(width / 2, height / 2 + 100, 350, 60, 10);
  fill(255);
  textSize(18);
  text(`Carroceria 3 (100 -> 120 milhos) - 150 Moedas`, width / 2, height / 2 + 100);

  // Botão Voltar (dentro do submenu)
  fill(255, 100, 100);
  rect(width / 2, height / 2 + height * 0.3 - 40, 150, 50, 10);
  fill(255);
  textSize(18);
  text("Voltar", width / 2, height / 2 + height * 0.3 - 40);
}

function desenhaAumentoTerreno() {
  fill(50, 50, 50, 200);
  rect(width / 2, height / 2, width * 0.6, height * 0.7, 20);

  fill(255);
  textSize(28);
  textAlign(CENTER, TOP);
  text("Aumento do Terreno", width / 2, height / 2 - height * 0.3 + 20);

  fill(100, 200, 100);
  rect(width / 2, height / 2 - 50, 350, 60, 10);
  fill(255);
  textSize(18);
  text(`Adicionar 80 Pés de Milho - 500 Moedas`, width / 2, height / 2 - 50);

  // Botão Voltar (dentro do submenu)
  fill(255, 100, 100);
  rect(width / 2, height / 2 + height * 0.3 - 40, 150, 50, 10);
  fill(255);
  textSize(18);
  text("Voltar", width / 2, height / 2 + height * 0.3 - 40);
}

// --- Funções de Interação (mouse e teclado) ---
function mousePressed() {
  // Variáveis para facilitar a verificação de clique nos botões
  let clickX = mouseX;
  let clickY = mouseY;

  // Função auxiliar para verificar clique em um botão
  function checkButtonClick(btnX, btnY, btnLargura, btnAltura) {
    return clickX > btnX - btnLargura / 2 &&
           clickX < btnX + btnLargura / 2 &&
           clickY > btnY - btnAltura / 2 &&
           clickY < btnY + btnAltura / 2;
  }

  // --- Lógica para o botão global "MENU" (canto superior direito) ---
  if (checkButtonClick(menuBotaoX, menuBotaoY, menuBotaoLargura, menuBotaoAltura)) {
    if (gameState === 'campo' || gameState === 'galpao') {
      gameState = 'menu'; // Abre o menu
    } else {
      // Se já estamos em algum menu, clicando no botão "MENU" superior, volta para o campo
      gameState = 'campo';
    }
    return; // Sai da função para evitar outros processamentos de clique
  }

  // --- Lógica para os botões "Voltar" dentro dos menus ---
  let voltarBtnX = width / 2;
  let voltarBtnY = height / 2 + height * 0.3 - 40;
  let voltarBtnLargura = 150;
  let voltarBtnAltura = 50;

  if (checkButtonClick(voltarBtnX, voltarBtnY, voltarBtnLargura, voltarBtnAltura)) {
    if (gameState === 'menu') {
      gameState = 'campo'; // Do menu principal, volta para o campo
    } else if (gameState === 'melhoriaColheitadeira' || gameState === 'aumentoTerreno') {
      gameState = 'menu'; // Dos submenus, volta para o menu principal
    }
    return; // Sai da função
  }

  // --- Lógica de cliques dentro do menu principal ---
  if (gameState === 'menu') {
    // Clicou em "Melhoria da Colheitadeira"
    if (checkButtonClick(width / 2, height / 2 - 50, 300, 60)) {
      gameState = 'melhoriaColheitadeira';
    }
    // Clicou em "Aumento do Terreno"
    if (checkButtonClick(width / 2, height / 2 + 50, 300, 60)) {
      gameState = 'aumentoTerreno';
    }
  }
  // --- Lógica de cliques dentro do menu de melhoria da Colheitadeira ---
  else if (gameState === 'melhoriaColheitadeira') {
    // Melhoria 1: Carga 1 (40 -> 65 milhos)
    if (checkButtonClick(width / 2, height / 2 - 100, 350, 60)) {
      if (moedas >= 150 && capacidadeColheitadeira < 200) {
        moedas -= 150;
        capacidadeColheitadeira = 280;
        console.log("Capacidade da colheitadeira aumentada para 65 milhos!");
      } else if (capacidadeColheitadeira >= 280) {
        console.log("Carga 1 já aplicada.");
      } else {
        console.log("Moedas insuficientes para Carga 1!");
      }
    }
    // Melhoria 2: Carroceria 2 (65 -> 100 milhos)
    if (checkButtonClick(width / 2, height / 2, 350, 60)) {
      if (moedas >= 250 && capacidadeColheitadeira < 300) {
        moedas -= 250;
        capacidadeColheitadeira = 300;
        console.log("Capacidade da colheitadeira aumentada para 100 milhos!");
      } else if (capacidadeColheitadeira >= 300) {
        console.log("Carroceria 2 já aplicada.");
      } else {
        console.log("Moedas insuficientes para Carroceria 2!");
      }
    }
    // Melhoria 3: Carroceria 3 (100 -> 120 milhos)
    if (checkButtonClick(width / 2, height / 2 + 100, 350, 60)) {
      if (moedas >= 300 && capacidadeColheitadeira < 1000) {
        moedas -= 300;
        capacidadeColheitadeira = 10000;
        console.log("Capacidade da colheitadeira aumentada para 120 milhos!");
      } else if (capacidadeColheitadeira >= 120) {
        console.log("Carroceria 3 já aplicada.");
      } else {
        console.log("Moedas insuficientes para Carroceria 3!");
      }
    }
  }
  // --- Lógica de cliques dentro do menu de Aumento de Terreno ---
  else if (gameState === 'aumentoTerreno') {
    // Aumento do Terreno
    if (checkButtonClick(width / 2, height / 2 - 50, 350, 60)) {
      if (moedas >= 500) {
        moedas -= 500;
        numPesMilhoAtual += 50; // Aumenta o número total de pés de milho
        inicializarPesMilho(numPesMilhoAtual); // Re-inicializa para incluir os novos
        console.log(`Terreno expandido! Agora com ${numPesMilhoAtual} pés de milho.`);
      } else {
        console.log("Moedas insuficientes para Aumento do Terreno!");
      }
    }
  }
}

// Para redimensionar a tela se a janela for alterada
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Reajustar posições de elementos se necessário
  solX = width * 0.8;
  solY = height * 0.2;
  menuBotaoX = width - 50;
  menuBotaoY = 30;
  galpaoX = width * 1.5; // Reposiciona o galpão para fora da tela
  galpaoAlvoX = width * 0.8; // Reajusta a posição alvo do galpão

  // Reinicia os milhos para que se adaptem à nova largura da tela
  inicializarPesMilho(numPesMilhoAtual);
}