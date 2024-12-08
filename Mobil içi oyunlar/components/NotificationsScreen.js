import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const NotificationsScreen = () => {
  // Sorular ve cevaplar
  const questions = [
    { 
      question: 'Kadıköy\'de trene kaç kişi bindi, kaç kişi indi?',
      answer: 8 - 3 + 15 // 8 bindi, 3 indi, başlangıçta 15 kişi vardı
    },
    {
      question: 'Kartal\'da trene kaç kişi bindi, kaç kişi indi?',
      answer: 12 - 5 + 15 // 12 bindi, 5 indi, başlangıçta 15 kişi vardı
    },
    {
      question: 'Pendik\'te trene kaç kişi bindi, kaç kişi indi?',
      answer: 6 - 10 + 15 // 6 bindi, 10 indi, başlangıçta 15 kişi vardı
    },
    {
      question: 'Tuzla\'da trene kaç kişi bindi, kaç kişi indi?',
      answer: 4 - 7 + 15 // 4 bindi, 7 indi, başlangıçta 15 kişi vardı
    },
    {
      question: 'Trende toplam kaç kişi kaldı?',
      answer: 15 + 8 - 3 + 12 - 5 + 6 - 10 + 4 - 7 // Toplam kişi sayısını hesaplıyoruz
    }
  ];

  // State
  const [userAnswer, setUserAnswer] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Mevcut soruyu takip et
  const [showResult, setShowResult] = useState(false); // Cevap kontrolü
  const [feedbackColor, setFeedbackColor] = useState(''); // Cevaba göre renk
  const [showNextButton, setShowNextButton] = useState(false); // Sonraki soruya geçiş
  const [correctAnswers, setCorrectAnswers] = useState(0); // Doğru cevap sayısı

  // Soruyu kontrol et
  const checkAnswer = () => {
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (parseInt(userAnswer) === correctAnswer) {
      setShowResult(true);
      setFeedbackColor('green');
      setShowNextButton(true);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setShowResult(true);
      setFeedbackColor('red');
      setShowNextButton(false);
    }
  };

  // Sonraki soruya geç
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResult(false);
      setUserAnswer('');
      setShowNextButton(false);
    } else {
      setShowResult(true);
      setFeedbackColor('blue');
      setUserAnswer('Tüm soruları tamamladınız!');
    }
  };

  // Oyunu sıfırlamak
  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setShowResult(false);
    setShowNextButton(false);
    setCorrectAnswers(0);
    setFeedbackColor('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tren Yolculuğu</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            • Trene başlangıçta 15 kişi bindi{'\n'}
            • Kadıköy'de 8 kişi bindi, 3 kişi indi{'\n'}
            • Kartal'da 12 kişi bindi, 5 kişi indi{'\n'}
            • Pendik'te 6 kişi bindi, 10 kişi indi{'\n'}
            • Tuzla'da 4 kişi bindi, 7 kişi indi
          </Text>
        </View>

        <View style={styles.answerContainer}>
          <Text style={styles.question}>
            {questions[currentQuestionIndex].question}
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Cevabınızı yazın"
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={checkAnswer}
          >
            <Text style={styles.buttonText}>Kontrol Et</Text>
          </TouchableOpacity>
        </View>

        {showResult && (
          <View style={styles.resultContainer}>
            <Text style={[styles.resultText, { color: feedbackColor }]}>
              {parseInt(userAnswer) === questions[currentQuestionIndex].answer 
                ? "Doğru cevap! ✅" 
                : "Yanlış cevap! ❌\nDoğru cevap: " + questions[currentQuestionIndex].answer}
            </Text>

            {showNextButton && (
              <TouchableOpacity 
                style={styles.nextButton}
                onPress={nextQuestion}
              >
                <Text style={styles.buttonText}>Sonraki Soru</Text>
              </TouchableOpacity>
            )}

            {!showNextButton && currentQuestionIndex < questions.length - 1 && (
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={resetGame}
              >
                <Text style={styles.buttonText}>Tekrar Dene</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00796b', // Başlık yeşil
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
  answerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    backgroundColor: '#e0f7fa', // Açık yeşil
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4ECDC4', // Yeşil
    padding: 15,
    borderRadius: 10,
    width: '80%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#4ECDC4', // Yeşil
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#FF6B6B', // Kırmızı
    padding: 15,
    borderRadius: 10,
    width: '80%',
  },
});

export default NotificationsScreen;
