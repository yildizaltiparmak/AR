import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';

const SettingsScreen = () => {
  const [board, setBoard] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [usedNumbers, setUsedNumbers] = useState([]); // Kullanılmış sayılar
  const [hints, setHints] = useState(3);
  const [level, setLevel] = useState(1);
  const [animation] = useState(new Animated.Value(0));

  const animatedBackgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#81D4FA', '#FFCDD2'], // Mavi ve pembe arası geçiş
  });

  const rules = [
    "Her satırın toplamı 15 olmalı",
    "Her sütunun toplamı 15 olmalı",
    "Çapraz toplamlar 15 olmalı",
    "1-9 arası sayılar kullanılmalı",
    "Her sayı bir kez kullanılmalı"
  ];

  const handleCellPress = (row, col) => {
    setSelectedCell([row, col]);
  };

  const handleNumberInput = (number) => {
    if (!selectedCell) {
      Alert.alert('Hata', 'Bir hücre seçmelisiniz!');
      return;
    }

    const [row, col] = selectedCell;
    const newBoard = [...board];
    const currentNumber = newBoard[row][col];

    // Eğer hücrede zaten bir sayı varsa, eski sayıyı kullanılabilir hale getir
    if (currentNumber !== '') {
      setUsedNumbers(usedNumbers.filter((num) => num !== currentNumber));
    }

    // Eğer sayı daha önce kullanılmışsa uyar
    if (usedNumbers.includes(number)) {
      Alert.alert('Hata', 'Bu sayı zaten kullanıldı!');
      return;
    }

    // Sayıyı hücreye yerleştir ve kullanılanlara ekle
    newBoard[row][col] = number;
    setBoard(newBoard);
    setUsedNumbers([...usedNumbers, number]);

    // Kazanma durumunu kontrol et
    checkWin(newBoard);
  };

  const checkWin = (currentBoard) => {
    const rowSums = currentBoard.map((row) =>
      row.reduce((sum, cell) => sum + (parseInt(cell) || 0), 0)
    );

    const colSums = currentBoard[0].map((_, colIndex) =>
      currentBoard.reduce((sum, row) => sum + (parseInt(row[colIndex]) || 0), 0)
    );

    const diagonal1 =
      parseInt(currentBoard[0][0] || 0) +
      parseInt(currentBoard[1][1] || 0) +
      parseInt(currentBoard[2][2] || 0);

    const diagonal2 =
      parseInt(currentBoard[0][2] || 0) +
      parseInt(currentBoard[1][1] || 0) +
      parseInt(currentBoard[2][0] || 0);

    const usedNumbersCount = currentBoard.flat().filter((cell) => cell !== '').length;

    const isValid =
      rowSums.every((sum) => sum === 15) &&
      colSums.every((sum) => sum === 15) &&
      diagonal1 === 15 &&
      diagonal2 === 15 &&
      usedNumbersCount === 9;

    if (isValid) {
      completeLevel();
    }
  };

  const completeLevel = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
      Alert.alert('Tebrikler!', `Seviye ${level} tamamlandı! 🎉`, [
        {
          text: 'Sonraki Seviye',
          onPress: () => {
            const newLevel = level + 1;
            setLevel(newLevel);
            setBoard([['', '', ''], ['', '', ''], ['', '', '']]);
            setUsedNumbers([]);
            setHints(3);
          }
        }
      ]);
    });
  };

  const resetGame = () => {
    setBoard([['', '', ''], ['', '', ''], ['', '', '']]);
    setSelectedCell(null);
    setUsedNumbers([]);
    setHints(3);
    setLevel(1);
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: animatedBackgroundColor }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Sihirli Kare Bulmaca</Text>
        <Text style={styles.subtitle}>Seviye: {level}</Text>

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
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <TouchableOpacity
              key={number}
              style={[
                styles.numberButton,
                usedNumbers.includes(number) ? styles.usedNumber : null
              ]}
              onPress={() => handleNumberInput(number.toString())}
            >
              <Text style={styles.numberText}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>Yeniden Başla</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  rulesContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ruleText: {
    fontSize: 14,
    marginVertical: 2,
  },
  boardContainer: {
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
  },
  selectedCell: {
    backgroundColor: '#BBDEFB',
  },
  cellText: {
    fontSize: 24,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  numberButton: {
    width: 50,
    height: 50,
    margin: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usedNumber: {
    backgroundColor: '#9E9E9E',
  },
  numberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
