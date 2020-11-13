
//Modo de jogo selecionado
//0 = PvP, 1 = PvM, 2 = MvM

// O jogo se inicia PvM
gamemode = 1

//Botão PvP selecionao
var buttonPvP = document.getElementById('pvp');
buttonPvP?.addEventListener('click', () => {
    gamemode = 0;
    buttonPvP?.setAttribute("class", "black")
    buttonPvM?.setAttribute("class", "white")
    buttonMvM?.setAttribute("class", "white")
})

//Botão PvM selecionao
var buttonPvM = document.getElementById('pvm');
buttonPvM?.setAttribute("class", "black")
buttonPvM?.addEventListener('click', () => {
    buttonPvP?.setAttribute("class", "white")
    buttonPvM?.setAttribute("class", "black")
    buttonMvM?.setAttribute("class", "white")
    gamemode = 1;
})

//Botão MvM selecionao
var buttonMvM = document.getElementById('mvm');
buttonMvM?.addEventListener('click', () => {
    buttonPvP?.setAttribute("class", "white")
    buttonPvM?.setAttribute("class", "white")
    buttonMvM?.setAttribute("class", "black")
    gamemode = 2;
    randomPlay();
})

//Elements HTML
var body = document.getElementById('body');
var round = document.getElementById('round-now');
var roundText = document.getElementById('round-text')

//Tabuleiro
//Tabuleiro com valor 0 = posição vazia
//Tabuleiro com valor 1 = posição marcada com X
//Tabuleiro com valor 2 = posição marcada com O
var tabuleiro = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

//Armazena as pósições livres no tabuleiro, usado para a geração de números aleatórios
var vetRandomNumber = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//Número de posições livres no tabuleiro
var numFreePositions = tabuleiro.length;

//Define o turno de cada jogador - 0 = X / 1 = O
var turn = 0;

//Registra o número de jogadas de cada player
var counter = [0, 0];

//Identificação de cada player
const playerX = 0;
const playerO = 1;

//Identificação do status atual do jogo
var insufficientPlays = 0.
var gameInProgress = 1;
var victory = 2;
var tie = 3

var gameStatus = 0;

//Verifica o status do jogos
const checkVictory = (player, tabuleiro) => {

    //Returns: 0 = insufficient plays
    //         1 = game in progess
    //         2 = victory
    //         3 = tie (empate)

    minmax(tabuleiro, 0,2);

    moveAi(tabuleiro);

    if (counter[player] < 3)
        return 0;

    for (var i = 0; i < 3; i++) { //Verifica as linhas
        var count = 0;
        for (var j = 0; j < 3; j++) {
            if (tabuleiro[i][j] == player)
                count++;
            if (count == 3) {
                gameStatus = 2;
                return 2; //Retorna o status victory
            }

        }
        count = 0;
        for (var j = 0; j < 3; j++) { //Verifica as colunas
            if (tabuleiro[j][i] == player)
                count++;
            if (count == 3) {
                gameStatus = 2;
                return 2; //Retorna o status victory
            }
        }
    }
    count = 0;
    for (var i = 0; i < 3; i++) { //Verifica a diagonal principal
        var j = i;
        if (tabuleiro[i][j] == player)
            count++
        if (count == 3) {
            gameStatus = 2;
            return 2; //Retorna o status victory
        }
    }
    count = 0;
    for (var i = 0; i < 3; i++) { //Verifica a diagonal secundária
        var j = 2 - i;
        if (tabuleiro[i][j] == player)
            count++
        if (count == 3) {
            gameStatus = 2;
            return 2; //Retorna o status victory
        }
    }
    //Verifica se houve empate
    if (counter[0] + counter[1] == 9) {
        gameStatus = 3;
        return 3; //Retorna o status tie
    }
    //Retorna o status: jogo em andamento
    gameStatus = 1;
    return 1;
}

//Faz uma jogada e muda as propriedades style dos componentes
const changeStyle = (line, column, id) => {
    var xColor = '#292C31'
    var oColor = '#ff4655'
    if (gameStatus != 2 && gameStatus != 3) { //Se o jogo não estiver em empate ou vitória

        var pos = "pos" + id; //Identifica o ID do elemento para modificações no DOM

        if (tabuleiro[line][column] == 0) { //Verifica se a posição selecionada está vazia
            if (turn == 0) {
                tabuleiro[line][column] = 2;//Marca a posição com um X
                counter[playerX] += 1; //Adiciona +1 ao contador de jogadas

                document.getElementById(pos)?.setAttribute("style",
                    `background-image: url("./assets/images/xicon-red.png"); 
                background-color: ${xColor}`);

                //Define essa posição no vetor de posções como ocupada
                vetRandomNumber[id] = 1;

                if (checkVictory(2, tabuleiro) == victory) {
                    round?.setAttribute("style", 'background-color: #42f563; background-image: url("./assets/images/victory-x-icon.png")')
                    roundText?.setAttribute("data-content", "Victory!");
                    return true;
                }
                else if (checkVictory(2, tabuleiro) == tie) {
                    round?.setAttribute("style", 'background-color: #ffea00; background-image: url("./assets/images/tie-icon.png")')
                    roundText?.setAttribute("data-content", "Empate!");
                    return true;
                }

                //Altera o DOM para a jogada do adversário
                body?.setAttribute("style", '--selected-area-img: url("../images/circleicon.png")')

                round?.setAttribute("style", 'background-image: url("./assets/images/circleicon.png"); background-color: #ff4655');

                //Alterna o turno 
                turn = 1;

                //Se o modo de jogo for PvM ou MvM faz uma jogada aleatória com um delay de 1s
                if (gamemode == 1 || gamemode == 2) {
                    setTimeout(() => {
                        randomPlay();
                    }, 1000);
                }


            } else {
                tabuleiro[line][column] = 1;//Marca a posição com um O
                counter[playerO] += 1;

                document.getElementById(pos)?.setAttribute("style",
                    `background-image: url("./assets/images/circleicon-dark.png"); 
                background-color: ${oColor}`);

                //Define essa posição no vetor de posções como ocupada
                vetRandomNumber[id] = 1;

                if (checkVictory(1, tabuleiro) == victory) {
                    round?.setAttribute("style", 'background-color: #42f563; background-image: url("./assets/images/victory-circle-icon.png")')
                    roundText?.setAttribute("data-content", "Victory!");
                    return true;
                }
                else if (checkVictory(1, tabuleiro) == tie) {
                    round?.setAttribute("style", 'background-color: #ffea00; background-image: url("./assets/images/r2d2.png")')
                    roundText?.setAttribute("data-content", "Empate!");
                    return true;
                }

                //Altera o DOM para a jogada do adversário
                body?.setAttribute("style", '--selected-area-img: url("../images/xicon.png")')

                round?.setAttribute("style", 'background-image: url("./assets/images/xicon.png"); background-color: #292C31');

                //Alterna o turno 
                turn = 0;

                //Se o modo de jogo for MvM faz uma jogada aleatória com um delay de 3s
                if (gamemode == 2) {
                    setTimeout(() => {
                        randomPlay();
                    }, 1000);

                }
            }
        }
    }

}

//Retorna um número aleatório de 1 a 9
const getNumRandom = () => {
    const numRandom = Math.random() * (10 - 1) + 1;
    return (Math.floor(numRandom));
}

//Faz uma jogada aleatória
const randomPlay = () => {

    var contains = true;

    //Se o número da posição sorteada ja estiver ocupado, sorteia outro
    do {
        var numRandom = getNumRandom();
        if (vetRandomNumber[numRandom] == 0)
            contains = false;
    } while (contains && gameStatus != 3)

    //Diminui o número de posições livres
    numFreePositions--;

    const positions = new Array(10);
    positions[1] = { line: 0, column: 0 }
    positions[2] = { line: 0, column: 1 }
    positions[3] = { line: 0, column: 2 }
    positions[4] = { line: 1, column: 0 }
    positions[5] = { line: 1, column: 1 }
    positions[6] = { line: 1, column: 2 }
    positions[7] = { line: 2, column: 0 }
    positions[8] = { line: 2, column: 1 }
    positions[9] = { line: 2, column: 2 }

    //Chama a função que faz a jogada e altera o style
    changeStyle(positions[numRandom].line, positions[numRandom].column, numRandom);
}

//Verifica os eventos no tabuleiro
var pos1 = document.getElementById('pos1')
pos1?.addEventListener('click', () => changeStyle(0, 0, 1))
var pos2 = document.getElementById('pos2')
pos2?.addEventListener('click', () => changeStyle(0, 1, 2))
var pos3 = document.getElementById('pos3')
pos3?.addEventListener('click', () => changeStyle(0, 2, 3))
var pos4 = document.getElementById('pos4')
pos4?.addEventListener('click', () => changeStyle(1, 0, 4))
var pos5 = document.getElementById('pos5')
pos5?.addEventListener('click', () => changeStyle(1, 1, 5))
var pos6 = document.getElementById('pos6')
pos6?.addEventListener('click', () => changeStyle(1, 2, 6))
var pos7 = document.getElementById('pos7')
pos7?.addEventListener('click', () => changeStyle(2, 0, 7))
var pos8 = document.getElementById('pos8')
pos8?.addEventListener('click', () => changeStyle(2, 1, 8))
var pos9 = document.getElementById('pos9')
pos9?.addEventListener('click', () => changeStyle(2, 2, 9))

