let sudokuBoard = [];
let userBoard = [];
let currentLevel = 1;  // Başlangıç seviyesi
let N = 3;  // Başlangıç boyutu (3x3)

const gridSizes = [3, 5, 7];  // 3x3, 5x5, 7x7 boyutları
const levelMax = 3;  // 3 seviye

// Sudoku grid'ini oluşturur
function generateBoard() {
    let board = [];
    for (let i = 0; i < N; i++) {
        let row = [];
        for (let j = 0; j < N; j++) {
            row.push(0);  // 0 başlangıç değeri
        }
        board.push(row);
    }
    return board;
}

// Sudoku çözümünü rastgele oluşturur
function fillSudoku(board) {
    let numbers = [];
    for (let i = 1; i <= N; i++) {
        numbers.push(i);
    }

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            let randomIndex = Math.floor(Math.random() * numbers.length);
            board[i][j] = numbers[randomIndex];
        }
    }
}

// Sudoku kutularını ekranda göster
function displayBoard(board) {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";  // Her seferinde board'u temizle

    // Dinamik grid boyutları
    boardElement.style.gridTemplateColumns = `repeat(${N}, 50px)`;
    boardElement.style.gridTemplateRows = `repeat(${N}, 50px)`;

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const input = document.createElement("input");
            input.type = "number";
            input.value = board[i][j] === 0 ? "" : board[i][j];
            input.disabled = board[i][j] !== 0;  // Kullanıcının girmesine izin verme
            input.dataset.row = i;
            input.dataset.col = j;
            input.addEventListener("input", handleInput);
            boardElement.appendChild(input);
        }
    }
}

// Kullanıcı girdisini işleyin
function handleInput(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    const value = event.target.value;

    userBoard[row][col] = value ? parseInt(value) : 0;
}

// Yeni oyun başlat
function newGame() {
    sudokuBoard = generateBoard();
    userBoard = generateBoard();
    fillSudoku(sudokuBoard);
    displayBoard(userBoard);
}

// "Nasıl Oynanır?" modalını göster
function howToPlay() {
    document.getElementById("instructions").style.display = "flex";
}

// Modalı kapat
function closeModal() {
    document.getElementById("instructions").style.display = "none";
}

// "Tebrikler" mesajını göster ve konfeti efekti ekle
function showCongratulations() {
    document.getElementById("congratulations").style.display = "flex"; // Tebrikler mesajını göster
    confettiEffect(); // Konfeti patlatma
}

// Modalı kapat
function closeCongratulations() {
    document.getElementById("congratulations").style.display = "none";
}

// Konfeti patlatma efekti
function confettiEffect() {
    confetti({
        particleCount: 200,   // Konfeti sayısı
        spread: 160,          // Yayılma açısı
        origin: { x: 0.5, y: 0.5 }  // Konfeti kaynağının ekran ortasında olması
    });
}

// Sudoku çözümünü kontrol et
function checkSolution() {
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (userBoard[i][j] !== sudokuBoard[i][j]) {
                resetToLevel(1); // Yanlış yapıldıysa 1. seviyeye dön
                return;
            }
        }
    }
    showCongratulations();
}

// Seviyeyi artır
function nextLevel() {
    if (currentLevel < levelMax) {
        currentLevel++; // Seviyeyi bir artır
    } else {
        // Eğer 3. seviyeye ulaşıldıysa, bir sonraki seviyeye geçmeyecek ve 3. seviyede kalacak
        currentLevel = 3;  // 3. seviyede kal
    }

    // 3x3 -> 5x5 -> 7x7
    if (currentLevel === 1) {
        N = 3;
    } else if (currentLevel === 2) {
        N = 5;
    } else if (currentLevel === 3) {
        N = 7;
    }
    
    confettiEffect();  // Seviyeyi artırmadan önce konfeti patlatma
    newGame(); // Yeni seviyeyi başlat
}

// Seviye 1'e dön
function resetToLevel(level) {
    currentLevel = level;
    N = 3;  // 3x3
    newGame();
}

// Başlangıçta yeni bir oyun başlat
newGame();
