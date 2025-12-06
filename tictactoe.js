document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del DOM y Variables de Estado
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusMessage = document.getElementById('status-message');
    const restartButton = document.getElementById('restart-button');
    
    // El estado del tablero se guarda en un array: 0-8
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;

    // Posibilidades de victoria
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    // 2. Funciones de Juego
    
    // Muestra el símbolo (X u O) en la celda
    const handleCellPlayed = (clickedCell, clickedCellIndex) => {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase()); // Añade clase 'x' o 'o' para estilos
    }

    // Cambia el turno al otro jugador
    const handlePlayerChange = () => {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusMessage.innerHTML = `Turno del Jugador ${currentPlayer}`;
    }

    // Determina si hay un ganador o un empate
    const handleResultValidation = () => {
        let roundWon = false;
        let winningCombination = null; // Para guardar la combinación ganadora

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue; // Saltar si la combinación no está llena
            }
            if (a === b && b === c) {
                roundWon = true;
                winningCombination = winCondition;
                break;
            }
        }

        if (roundWon) {
            gameActive = false;
            statusMessage.innerHTML = `¡El Jugador ${currentPlayer} ha Ganado! 🎉`;
            
            // Aplica el estilo de celda ganadora
            winningCombination.forEach(index => {
                cells[index].classList.add('winning');
            });
            return;
        }

        // Si no hay ganador y el tablero está lleno, es empate
        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            gameActive = false;
            statusMessage.innerHTML = '¡Es un Empate! 🤝';
            return;
        }

        // Si el juego sigue activo, cambiar de jugador
        handlePlayerChange();
    }

    // 3. Manejador de Clics
    const handleCellClick = (event) => {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        // Salir si la celda ya está marcada o el juego terminó
        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    // 4. Reiniciar Juego
    const handleRestartGame = () => {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        statusMessage.innerHTML = `Turno del Jugador ${currentPlayer}`;
        
        cells.forEach(cell => {
            cell.innerHTML = "";
            cell.classList.remove('x', 'o', 'winning'); // Limpia clases de estilo
        });
    }

    // 5. Oyentes de Eventos
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', handleRestartGame);
});