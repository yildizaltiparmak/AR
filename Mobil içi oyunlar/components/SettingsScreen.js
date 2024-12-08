import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

const SettingsScreen = () => {
  // 3x3'lük oyun tahtası
  const [board, setBoard] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);

  const [selectedCell, setSelectedCell] = useState(null);
  const [hints, setHints] = useState(3);

  // Oyun kuralları ve ipuçları
  const rules = [
    "Her satırın toplamı 15 olmalı",
    "Her sütunun toplamı 15 olmalı",
    "Çapraz toplamlar 15 olmalı",
    "1-9 arası sayılar kullanılmalı",
    "Her sayı bir kez kullanılmalı"
  ];

  // Rastgele renk üretme fonksiyonu
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getHint = () => {
    if (hints > 0) {
      // Boş hücreleri bul
      const emptyCells = [];
      board.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell === '') {
            emptyCells.push([i, j]);
          }
        });
      });

      if (emptyCells.length > 0) {
        // Rastgele bir boş hücre seç
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const correctNumbers = {
          '0,0': '8', '0,1': '1', '0,2': '6',
          '1,0': '3', '1,1': '5', '1,2': '7',
          '2,0': '4', '2,1': '9', '2,2': '2'
        };
        
        const newBoard = [...board];
        newBoard[randomCell[0]][randomCell[1]] = correctNumbers[`${randomCell[0]},${randomCell[1]}`];
        setBoard(newBoard);
        setHints(hints - 1);
      }
    } else {
      Alert.alert('İpucu Hakkı Bitti', 'Tüm ipucu haklarınızı kullandınız!');
    }
  };

  const handleCellPress = (row, col) => {
    setSelectedCell([row, col]);
  };

  const handleNumberInput = (number) => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      const newBoard = [...board];
      newBoard[row][col] = number;
      setBoard(newBoard);
    }
  };

  const checkWin = () => {
    // Satır toplamları kontrolü
    const rowSums = board.map(row => 
      row.reduce((sum, cell) => sum + (parseInt(cell) || 0), 0)
    );

    // Sütun toplamları kontrolü
    const colSums = board[0].map((_, col) => 
      board.reduce((sum, row) => sum + (parseInt(row[col]) || 0), 0)
    );

    // Çapraz toplamlar kontrolü
    const diagonal1 = board[0][0] + board[1][1] + board[2][2];
    const diagonal2 = board[0][2] + board[1][1] + board[2][0];

    // Tüm sayıların kullanılıp kullanılmadığı kontrolü
    const usedNumbers = board.flat().filter(cell => cell !== '');
    const uniqueNumbers = new Set(usedNumbers);

    const isValid = 
      rowSums.every(sum => sum === 15) &&
      colSums.every(sum => sum === 15) &&
      parseInt(diagonal1) === 15 &&
      parseInt(diagonal2) === 15 &&
      uniqueNumbers.size === 9;

    if (isValid) {
      Alert.alert('Tebrikler!', 'Bulmacayı başarıyla çözdünüz!');
    } else {
      Alert.alert('Tekrar Deneyin', 'Çözüm henüz doğru değil.');
    }
  };

  const resetGame = () => {
    setBoard([['', '', ''], ['', '', ''], ['', '', '']]);
    setSelectedCell(null);
    setHints(3);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sihirli Kare Bulmaca</Text>
      
      <View style={styles.rulesContainer}>
        <Text style={styles.rulesTitle}>Oyun Kuralları:</Text>
        {rules.map((rule, index) => (
          <Text key={index} style={styles.ruleText}>• {rule}</Text>
        ))}
      </View>

      <View style={styles.boardContainer}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.cell,
                  { backgroundColor: getRandomColor() }, // Hücrenin rengini rastgele yap
                  selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
                    ? styles.selectedCell
                    : null
                ]}
                onPress={() => handleCellPress(rowIndex, colIndex)}
              >
                <Text style={styles.cellText}>{cell}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.numberPad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
          <TouchableOpacity
            key={number}
            style={styles.numberButton}
            onPress={() => handleNumberInput(number.toString())}
          >
            <Text style={styles.numberText}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={getHint}>
          <Text style={styles.buttonText}>İpucu ({hints})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={checkWin}>
          <Text style={styles.buttonText}>Kontrol Et</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetGame}>
          <Text style={styles.buttonText}>Yeniden Başla</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  rulesContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ruleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  boardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
  },
  selectedCell: {
    backgroundColor: '#e3f2fd',
  },
  cellText: {
    fontSize: 24,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  numberButton: {
    width: 50,
    height: 50,
    margin: 5,
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4ECDC4',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
