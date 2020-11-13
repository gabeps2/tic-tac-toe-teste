
function moveAi(){
    
}

function minmax(newTabuleiro, profundidade, player) {
    const gameState = checkVictory(player, newTabuleiro)

    if (gameState == 0) {
        const values = [];

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {

                const copiaTabuleiro = [...newTabuleiro];
                if (copiaTabuleiro[i][j] !== 0) continue;
                copiaTabuleiro[i][j] = 2;
                var value;
                value = minmax(copiaTabuleiro, profundidade + 1, (player == 2) ? 1 : 2)
                var cel;
                values.push({
                    cost: value,
                    cell: {
                        i: i,
                        j: j,
                    }
                });
            }
        }

        if (player == 1) {
            var max;
            max = maxBy(values, (v) => {
                return v.cost;
            });

            if (profundidade == 0) {

                return max?.cell;
            } else
                return max?.cost;
        } else {
            var min;
            min = minBy(values, (v) => {
                return v.cost;
            });

            if (profundidade == 0) {
                return min?.cell;
            } else
                return min?.cost;
        }

    }
    else if (gameState == 3) {
        return 0
    } else if (turn == 0) {
        return profundidade - 10;
    } else if (turn == 1) {
        return 10 - profundidade;
    }

    return 0;
}

export const moveAi = () => {

    return minmax(tabuleiro, 0, 2);
}




