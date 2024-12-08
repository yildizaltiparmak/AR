let correctAnswers = 0;
let randomSquares = 0; // Rastgele boyanan karelerin sayısı
let level = 1; // Başlangıç seviyesi
let timer; // Zamanlayıcı referansı
let timeLeft; // Her seviyeye özel süre
let score = 0; // Kullanıcının puanı

// Ses dosyalarını yükleyelim
const correctSound = new Audio('sounds/correct_answer.mp3');
const wrongSound = new Audio('sounds/wrong_answer.mp3');
const timeUpSound = new Audio('sounds/time_up.mp3');

document.getElementById('submitAnswer').addEventListener('click', checkAnswer);

function drawCoordinateSystemWithGrid() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Tuvali temizle
    ctx.clearRect(0, 0, width, height);

    // Küçük kareleri çiz
    drawSmallSquares(ctx, width, height);

    // Eksenleri çiz
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;

    // X ekseni
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);

    // Y ekseni
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
}

function drawSmallSquares(ctx, width, height) {
    const squareSize = 10; // Her küçük karenin boyutu (10x10)
    const squaresPerRow = width / squareSize; // Satır başına kare sayısı
    const squaresPerColumn = height / squareSize; // Sütun başına kare sayısı

    ctx.fillStyle = "#e0f7fa"; // Karelerin arka plan rengi
    ctx.strokeStyle = "#ccc"; // Kare kenar çizgileri
    ctx.lineWidth = 0.5;

    for (let row = 0; row < squaresPerColumn; row++) {
        for (let col = 0; col < squaresPerRow; col++) {
            const x = col * squareSize;
            const y = row * squareSize;
            ctx.fillRect(x, y, squareSize, squareSize); // Kareyi doldur
            ctx.strokeRect(x, y, squareSize, squareSize); // Kenar çiz
        }
    }
}

// Rastgele kareleri başlangıçta boyama
function randomFillSquaresOnStart() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const squareSize = 10; // Her küçük karenin boyutu (10x10)
    const squaresPerRow = width / squareSize; // Satır başına kare sayısı
    const squaresPerColumn = height / squareSize; // Sütun başına kare sayısı

    const totalSquares = squaresPerRow * squaresPerColumn; // Toplam kare sayısı

    // Zorluk seviyesine göre kare sayısını belirle
    switch (level) {
        case 1: // Kolay
            randomSquares = Math.floor(Math.random() * 5) + 5; // 5-10 arası
            break;
        case 2: // Orta
            randomSquares = Math.floor(Math.random() * 10) + 10; // 10-20 arası
            break;
        case 3: // Zor
            randomSquares = Math.floor(Math.random() * 10) + 20; // 20-30 arası
            break;
        default:
            randomSquares = 5; // Varsayılan değer
    }

    const selectedSquares = new Set(); // Seçilen karelerin koordinatlarını tut

    while (selectedSquares.size < randomSquares) {
        const randomIndex = Math.floor(Math.random() * totalSquares);
        selectedSquares.add(randomIndex);
    }

    // Kareleri işaretle
    selectedSquares.forEach((index) => {
        const row = Math.floor(index / squaresPerRow);
        const col = index % squaresPerRow;
        const x = col * squareSize;
        const y = row * squareSize;

        const randomColor = `hsl(${Math.random() * 360}, 70%, 60%)`; // Rastgele renk
        ctx.fillStyle = randomColor;
        ctx.fillRect(x, y, squareSize, squareSize);
    });
}

// Kullanıcının cevabını kontrol etme
function checkAnswer() {
    const userAnswer = Number(document.getElementById('answer').value);

    if (userAnswer === randomSquares) {
        clearInterval(timer); // Zamanlayıcıyı durdur
        correctAnswers++;
        updateScore(); // Puanı artır
        document.getElementById('feedback').innerText = `Doğru! Taranan kare sayısı: ${randomSquares}. 🎉 Puanınız: ${score}`;
        playCorrectSound(); // Doğru cevap sesini çal
        playConfettiAnimation(); // Doğru cevap animasyonu
        setTimeout(nextLevel, 2000); // Animasyon sonrası bir üst seviyeye geç
    } else {
        clearInterval(timer); // Zamanlayıcıyı durdur
        document.getElementById('feedback').innerText = `Yanlış! Doğru cevap: ${randomSquares}. 😞 Oyun 1. seviyeye dönüyor!`;
        playWrongSound(); // Yanlış cevap sesini çal
        playWrongAnswerAnimation(); // Yanlış cevap animasyonu
        setTimeout(restartGame, 2000); // Animasyon sonrası 1. seviyeye geç
    }
}

// Puanı seviyeye göre artırma
function updateScore() {
    switch (level) {
        case 1: // Kolay
            score += 10;
            break;
        case 2: // Orta
            score += 20;
            break;
        case 3: // Zor
            score += 30;
            break;
        default:
            score += 0;
    }
}

// Ses efektlerini çalma
function playCorrectSound() {
    correctSound.play(); // Doğru cevap sesini çalar
}

function playWrongSound() {
    wrongSound.play(); // Yanlış cevap sesini çalar
}

function playTimeUpSound() {
    timeUpSound.play(); // Süre doldu sesini çalar
}

// Animasyonlar
function playConfettiAnimation() {
    const confettiContainer = document.createElement('div');
    confettiContainer.classList.add('confetti-animation');
    document.body.appendChild(confettiContainer);

    setTimeout(() => {
        confettiContainer.remove();
    }, 2000);
}

function playWrongAnswerAnimation() {
    const canvas = document.getElementById('canvas');
    canvas.classList.add('shake');
    setTimeout(() => {
        canvas.classList.remove('shake');
    }, 2000);
}

// Bir sonraki seviyeye geçiş
function nextLevel() {
    level = Math.min(level + 1, 3); // Maksimum seviye 3
    resetGame();
}

// Oyunu sıfırlama ve yeni kareler oluşturma
function resetGame() {
    document.getElementById('answer').value = '';
    setTimeForLevel(); // Seviyeye uygun süreyi ayarla
    drawCoordinateSystemWithGrid();
    randomFillSquaresOnStart();
    startTimer(); // Yeni zamanlayıcı başlat
}

// Oyunu tamamen baştan başlatma (1. seviyeye dönme)
function restartGame() {
    level = 1; // Seviye 1'e dön
    resetGame();
}

// Zamanlayıcıyı başlatma
function startTimer() {
    clearInterval(timer); // Önceki zamanlayıcıyı durdur
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('feedback').innerText = `Kalan Süre: ${timeLeft} saniye | Puanınız: ${score}`;

        if (timeLeft <= 0) {
            clearInterval(timer); // Zamanlayıcıyı durdur
            document.getElementById('feedback').innerText = `Süre doldu! Oyun 1. seviyeye dönüyor! Puanınız: ${score}`;
            playTimeUpSound(); // Süre doldu sesini çal
            restartGame(); // Oyunu yeniden başlat
        }
    }, 1000);
}

// Seviyeye uygun süreyi ayarla
function setTimeForLevel() {
    switch (level) {
        case 1:
            timeLeft = 30; // Seviye 1: 30 saniye
            break;
        case 2:
            timeLeft = 20; // Seviye 2: 20 saniye
            break;
        case 3:
            timeLeft = 10; // Seviye 3: 10 saniye
            break;
        default:
            timeLeft = 30; // Varsayılan
    }
}

// Oyun başlangıcında koordinat sistemi ve rastgele kareleri çiz
setTimeForLevel(); // İlk seviyeye uygun süreyi ayarla
drawCoordinateSystemWithGrid();
randomFillSquaresOnStart();
startTimer(); // Zamanlayıcıyı başlat
