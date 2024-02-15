// adquire o elemento canvas e o seu contexto
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// adquirindo outros elementos
const pontuacaoAtual = document.getElementById('pontuacao-atual');
const melhorPontuacaoInicial = document.getElementById('melhor-pontuacao');

const menu = document.querySelector('.menu');
const titulo = document.querySelector('.titulo');
const pontuacaoFinal = document.querySelector('.pontuacao-final');
const pontuacaoAtualFinal = document.getElementById('pontuacao-atual-final');
const melhorPontuacaoFinal = document.getElementById('melhor-pontuacao-final');

const container = document.querySelector('.container');

// valores iniciais
let direcao = undefined;
let loopId = undefined;
let menuAtivo = true;
pontuacao = 0;
if (localStorage.getItem('melhorPontuacao')) {
    melhorPontuacaoInicial.innerText = localStorage.getItem('melhorPontuacao');
}

// cria um objeto de áudio
const audio = new Audio('assets/audios/comer.mp3');

// cores do canvas
const corEscura = '#111111';
const corClara = '#151515';

// lista de cores da comida
const cores = ['red', 'orange', 'blue', 'aqua', 'lime', 'yellow', 'violet'];

// define um tamanho constante para o tamanho do pixel
const tamanhoPixel = 25;

// constrói a cobrinha com um array
let cobrinha = [
    {
        x: Math.round(Math.round(canvas.width / 2) / tamanhoPixel) * tamanhoPixel,
        y: Math.round(Math.round(canvas.height / 2) / tamanhoPixel) * tamanhoPixel
    },
    {
        x: (Math.round(Math.round(canvas.width / 2) / tamanhoPixel) * tamanhoPixel) + tamanhoPixel,
        y: Math.round(Math.round(canvas.height / 2) / tamanhoPixel) * tamanhoPixel
    }
];

const aumentarPontuacao = () => {
    pontuacao += 1;
    pontuacaoAtual.innerText = pontuacao;
};

// função para aleatoriezar o aparecimento da comida
const comidaAleatoria = () => {
    const comida = {};

    // define uma posição aleatória
    comida.x = Math.floor(Math.random() * (canvas.width / tamanhoPixel)) * tamanhoPixel;
    comida.y = Math.floor(Math.random() * (canvas.width / tamanhoPixel)) * tamanhoPixel;

    // define uma cor aleatória
    comida.color = cores[Math.floor(Math.random() * cores.length)];

    return comida;
};

// armazena os valores gerados dentro do objeto comida
comida = comidaAleatoria();

const desenharComida = () => {
    const { x, y, color } = comida;

    // desenha a comida conforme os dados adquiridos
    ctx.shadowColor = color;
    ctx.shadowBlur = 30;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, tamanhoPixel, tamanhoPixel);

    // zera o blur para que não passe para outros elementos
    ctx.shadowBlur = 0;
};

const desenharCobra = () => {
    // define o cor da cobrinha
    ctx.fillStyle = 'darkgreen';

    // renderiza um pixel para cada um existente dentro do array cobrinha
    cobrinha.forEach((posicao, index) => {
        // define uma cor diferente pra cabeça da cobra
        ctx.fillRect(posicao.x, posicao.y, tamanhoPixel, tamanhoPixel);

        // desenha olhinhos na cabeça da cobrinha
        if (index == cobrinha.length - 1) {
            // calcular as coordenadas dos olhos
            const olhoEsquerdoX = posicao.x + tamanhoPixel / 6;
            const olhoEsquerdoY = posicao.y + tamanhoPixel / 4;
            const olhoDireitoX = posicao.x + tamanhoPixel / 1.7;
            const olhoDireitoY = posicao.y + tamanhoPixel / 4;

            // desenhar os olhos
            ctx.fillStyle = 'white';
            ctx.fillRect(olhoEsquerdoX, olhoEsquerdoY, tamanhoPixel / 4, tamanhoPixel / 4);
            ctx.fillRect(olhoDireitoX, olhoDireitoY, tamanhoPixel / 4, tamanhoPixel / 4);

            // declara posições das popilas
            let pupilaEsquerdaX = 0;
            let pupilaEsquerdaY = 0;
            let pupilaDireitaX = 0;
            let pupilaDireitaY = 0;

            // calcular coordenadas das pupilas
            switch (direcao) {
                case 'esquerda':
                    pupilaEsquerdaX = olhoEsquerdoX + tamanhoPixel / 256 + tamanhoPixel / 256;
                    pupilaEsquerdaY = olhoEsquerdoY + tamanhoPixel / 32 + tamanhoPixel / 32;
                    pupilaDireitaX = olhoDireitoX + tamanhoPixel / 256 + tamanhoPixel / 256;
                    pupilaDireitaY = olhoDireitoY + tamanhoPixel / 32 + tamanhoPixel / 32;
                    break;

                case 'cima':
                    pupilaEsquerdaX = olhoEsquerdoX + tamanhoPixel / 32 + tamanhoPixel / 32;
                    pupilaEsquerdaY = olhoEsquerdoY + tamanhoPixel / 128 + tamanhoPixel / 128;
                    pupilaDireitaX = olhoDireitoX + tamanhoPixel / 32 + tamanhoPixel / 32;
                    pupilaDireitaY = olhoDireitoY + tamanhoPixel / 128 + tamanhoPixel / 128;
                    break;

                case 'baixo':
                    pupilaEsquerdaX = olhoEsquerdoX + tamanhoPixel / 32 + tamanhoPixel / 32;
                    pupilaEsquerdaY = olhoEsquerdoY + tamanhoPixel / 8 + tamanhoPixel / 32;
                    pupilaDireitaX = olhoDireitoX + tamanhoPixel / 32 + tamanhoPixel / 32;
                    pupilaDireitaY = olhoDireitoY + tamanhoPixel / 8 + tamanhoPixel / 32;
                    break;

                default:
                    pupilaEsquerdaX = olhoEsquerdoX + tamanhoPixel / 8 + tamanhoPixel / 32;
                    pupilaEsquerdaY = olhoEsquerdoY + tamanhoPixel / 32 + tamanhoPixel / 32;
                    pupilaDireitaX = olhoDireitoX + tamanhoPixel / 8 + tamanhoPixel / 32;
                    pupilaDireitaY = olhoDireitoY + tamanhoPixel / 32 + tamanhoPixel / 32;
            }

            // desenhar as pupilas
            ctx.fillStyle = 'black';
            ctx.fillRect(pupilaEsquerdaX, pupilaEsquerdaY, tamanhoPixel / 8, tamanhoPixel / 8);
            ctx.fillRect(pupilaDireitaX, pupilaDireitaY, tamanhoPixel / 8, tamanhoPixel / 8);
        }
    });
};

const moverCobra = () => {
    // caso a direcao seja vazia, não faz a função
    if (!direcao) return;

    // recupera a cabeça da cobra
    const cabeca = cobrinha[cobrinha.length - 1];

    // movimento para a direita
    if (direcao == 'direita') {
        cobrinha.push({ x: cabeca.x + tamanhoPixel, y: cabeca.y })
    }

    // movimento para a esquerda
    if (direcao == 'esquerda') {
        cobrinha.push({ x: cabeca.x - tamanhoPixel, y: cabeca.y })
    }

    // movimento para baixo
    if (direcao == 'baixo') {
        cobrinha.push({ x: cabeca.x, y: cabeca.y + tamanhoPixel })
    }

    // movimento para baixo
    if (direcao == 'cima') {
        cobrinha.push({ x: cabeca.x, y: cabeca.y - tamanhoPixel })
    }

    // remove o último pixel da cobrinha
    cobrinha.shift()
};

const mudarDirecao = (key) => {
    // transforma a variável key recebida em letras minúsculas
    key = key.toLowerCase();

    // executa os comandos caso o menu não esteja ativo
    if (!menuAtivo) {
        // seta para a direita
        // não pode ser executado caso a direção esteja para a esqueda
        if ((key == 'arrowright' || key == 'd') && direcao != 'esquerda') {
            direcao = 'direita';
        }

        // seta para a esquerda
        // não pode ser executado caso a direção esteja para a direita
        if ((key == 'arrowleft' || key == 'a') && direcao != 'direita') {
            direcao = 'esquerda';
        }

        // seta para cima
        // não pode ser executado caso a direção esteja para baixo
        if ((key == 'arrowup' || key == 'w') && direcao != 'baixo') {
            direcao = 'cima';
        }

        // seta para baixo
        // não pode ser executado caso a direção esteja para cima
        if ((key == 'arrowdown' || key == 's') && direcao != 'cima') {
            direcao = 'baixo';
        }
    }
}

const desenharGrade = () => {
    // repete por todas as linhas
    for (var linha = 0; linha < Math.floor(canvas.width / tamanhoPixel); linha++) {
        // repete por todas as colunas
        for (var coluna = 0; coluna < Math.floor(canvas.width / tamanhoPixel); coluna++) {
            // define o valor de x e y
            var x = coluna * tamanhoPixel;
            var y = linha * tamanhoPixel;

            // alterna entre cor clara e escura
            if ((linha + coluna) % 2 === 0) {
                ctx.fillStyle = corClara;
            } else {
                ctx.fillStyle = corEscura;
            }

            ctx.fillRect(x, y, tamanhoPixel, tamanhoPixel);
        }
    }
};

const comer = () => {
    const cabeca = cobrinha[cobrinha.length - 1];

    if (cabeca.x == comida.x && cabeca.y == comida.y) {
        // aumenta a pontuação sempre a cobrinha comer
        aumentarPontuacao();

        // checa se a melhor pontuação foi superada
        pontuarMelhor();

        // mostrar melhor pontuação na tela
        melhorPontuacaoInicial.innerText = localStorage.getItem('melhorPontuacao');

        // adiciona um novo pixel ao corpo da cobrinha com as mesmas características da cobeça
        cobrinha.push(cabeca);

        // toca o áudio de comer
        audio.play();

        do {
            comida = comidaAleatoria();
        } while (cobrinha.find((posicao) => posicao.x == comida.x && posicao.y == comida.y));
    }
};

const colisao = () => {
    cabeca = cobrinha[cobrinha.length - 1];
    pescoco = cobrinha.length - 2;

    // verifica se a cobrinha bateu na borda do canvas
    if (cabeca.x < 0 ||
        cabeca.x > canvas.width - tamanhoPixel
        || cabeca.y < 0
        || cabeca.y > canvas.height - tamanhoPixel
        || cobrinha.find((posicao, index) => {
            return index < pescoco && posicao.x == cabeca.x && posicao.y == cabeca.y
        })) {
        finalizarJogo();
    }
}

const mostrarMenu = () => {
    // retira a direção de movimento da cobrinha
    direcao = null;

    // mostra a tela de menu
    menu.style.display = 'flex';

    // define o blur
    container.style.filter = 'blur(5px)';

    // define que o menu está ativo
    menuAtivo = true;
};

const finalizarJogo = () => {
    // mostra o menu
    mostrarMenu();

    titulo.innerText = 'Fim de Jogo';

    // mostra a pontuação final
    pontuacaoFinal.style.display = 'flex';

    // mostra a pontuação obtida ao final da partida
    pontuacaoAtualFinal.innerText = pontuacao;

    // mostra a melhor pontuação ao final da partida
    melhorPontuacaoFinal.innerText = localStorage.getItem('melhorPontuacao');
};

function btnPlay() {
    // reseta tudo

    pontuacao = 0;
    pontuacaoAtual.innerText = '0';
    menu.style.display = 'none';
    container.style.filter = 'none';
    menuAtivo = false;

    cobrinha = [
        {
            x: Math.round(Math.round(canvas.width / 2) / tamanhoPixel) * tamanhoPixel,
            y: Math.round(Math.round(canvas.height / 2) / tamanhoPixel) * tamanhoPixel
        },
        {
            x: (Math.round(Math.round(canvas.width / 2) / tamanhoPixel) * tamanhoPixel) + tamanhoPixel,
            y: Math.round(Math.round(canvas.height / 2) / tamanhoPixel) * tamanhoPixel
        }
    ];

    comida = comidaAleatoria();
};

const pontuarMelhor = () => {
    // melhor pontuação armazenada no navegador
    let melhorPontuacao = parseInt(localStorage.getItem('melhorPontuacao')) || 0;

    // verifica se a pontuação atual é maior que a maior pontuação armazenada
    if (!melhorPontuacao || pontuacao > melhorPontuacao) {
        // armazena a melhor pontuação no navegador
        localStorage.setItem('melhorPontuacao', pontuacao);
    }
};

const gameLoop = () => {
    // limpa o intervalo antes de iniciar um novo
    clearInterval(loopId);

    // limpa a tela antes de renderizar de novo
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // chama a função para desenhar a grade
    desenharGrade();

    // desenha a comida
    desenharComida();

    // move a cobrinha
    moverCobra();

    // desenha a cobrinha
    desenharCobra();

    // checa se a cobrinha comeu a comida
    comer();

    // checa se a cobrinha se colidiu
    colisao();

    // gera o loop
    loopId = setTimeout(() => {
        gameLoop();
    }, 100);
};

// chama a função para começar o loop
gameLoop();

// adiciona os controles pelo teclado
document.addEventListener('keydown', ({ key }) => {
    mudarDirecao(key)

    if (menuAtivo) {
        if (key == 'enter') {
            btnPlay();
        }
    }
});

// inicia o jogo caso clique fora do menu
document.addEventListener('click', (event) => {
    if (menuAtivo) {
        if (event.target !== menu) {
            btnPlay();
        }
    }
});

// adiciona os controles para o mobile
const controles = document.querySelectorAll('.controles i');

controles.forEach(botao => {
    botao.addEventListener('click', event => {
        // checa a botão pressionado pelo seu dataset
        const key = event.target.dataset.key;

        // muda a direção
        mudarDirecao(key);
    });
});
