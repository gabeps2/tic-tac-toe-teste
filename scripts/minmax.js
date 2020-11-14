
import { minBy, maxBy, cloneDeep } from 'lodash'

const computerToken = 1;
const playerToken = 2;

function checkGameState(tabuleiro) {

    //Verificar linhas
    for (let i = 0; i < 3; i++) {
        if (tabuleiro[i][0] !== 0 &&
            tabuleiro[i][0] == tabuleiro[i][1] &&
            tabuleiro[i][0] == tabuleiro[i][2]) {
            return tabuleiro[i][0]
        }
    }

    //Verificar colunas
    for (let j = 0; j < 3; j++) {
        if (tabuleiro[0][j] !== 0 &&
            tabuleiro[0][j] == tabuleiro[1][j] &&
            tabuleiro[0][j] == tabuleiro[2][j]) {
            return tabuleiro[0][j]
        }
    }
    //Verificar diagonal principal
    if (tabuleiro[0][0] !== 0 &&
        tabuleiro[0][0] == tabuleiro[1][1] &&
        tabuleiro[0][0] == tabuleiro[2][2]) {
        return tabuleiro[0][0]
    }

    //Verificar diagonal secundária
    if (tabuleiro[2][0] !== 0 &&
        tabuleiro[2][0] == tabuleiro[1][1] &&
        tabuleiro[2][0] == tabuleiro[0][2]) {
        return tabuleiro[2][0]
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (tabuleiro[i][j] === 0) {
                return false;
            }
        }
    }
    return null;
}

function minmax(novoTabuleiro, profundidade, player) {
    const gameState = checkGameState(novoTabuleiro);

    if (gameState === false) {
        const values = [];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                const copiaTabuleiro = cloneDeep(novoTabuleiro);
                
                //Faz uma jogada
                if (novoTabuleiro[i][j] !== 0) continue;

                //A partir da jogada realizada, faz uma cópia do tabuleiro e chama novamente a função
                copiaTabuleiro[i][j] = player;
                const value = minmax(copiaTabuleiro, profundidade - 1, (player === playerToken) ? computerToken : playerToken)

                //O resultado desta chamada é armazenado no vetor
                //Value: Resultado de cada jogo previsto
                //Cell: As posições que deram ínicio a esse estado
                values.push({
                    cost: value,
                    cell: {
                        i: i,
                        j: j,
                    }
                })
            }
        }

        if (player === computerToken) {
            const max = maxBy(values, (v) => {
                return v.cost;
            })

            if (profundidade === 0) {
                return max.cell;
            } else {
                return max.cost;
            }

        } else {
            const min = minBy(values, (v) => {
                return v.cost;
            })

            if (profundidade === 0) {
                return min.cell;
            } else {
                return min.cost;
            }
        }

    } else if (gameState === null) {
        return 0;
    } else if (gameState === playerToken) {
        return profundidade - 1;
    } else if (gameState === computerToken) {
        return 1 - profundidade;
    }
}

export default function moveIA(tabuleiro, profundidade, player) {
    return minmax(tabuleiro, profundidade, player)
}




