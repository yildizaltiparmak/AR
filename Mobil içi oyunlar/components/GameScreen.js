import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";

const GameScreen = () => {
  const [people] = useState([
    { id: 1, name: "Ahmet", messages: "985242", calls: "125645", color: "#FF6B6B" },
    { id: 2, name: "Fatma", messages: "754123", calls: "236541", color: "#4ECDC4" },
    { id: 3, name: "Mehmet", messages: "632541", calls: "98542", color: "#45B7D1" },
    { id: 4, name: "Ayşe", messages: "845632", calls: "145236", color: "#96CEB4" },
    { id: 5, name: "Ali", messages: "456321", calls: "178945", color: "#FF8B94" },
  ]);

  const [messageRanking, setMessageRanking] = useState([...people]);
  const [callRanking, setCallRanking] = useState([...people]);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const backgroundColor = new Animated.Value(0);

  // Sayaç
  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setGameOver(true);
    }
  }, [timer, gameOver]);

  // Renk Geçişi
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundColor, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundColor, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const animatedBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#81D4FA", "#FFCDD2"], // Pepe mavisi ve açık pembe
  });

  const nextLevel = () => {
    setCurrentLevel(currentLevel + 1);
    setMessageRanking([...messageRanking.sort(() => Math.random() - 0.5)]);
    setCallRanking([...callRanking.sort(() => Math.random() - 0.5)]);
    setTimer(30);
  };

  const handleCardPress = (item, index, section) => {
    const correctRanking =
      section === "messages"
        ? [...people].sort((a, b) => parseInt(b.messages) - parseInt(a.messages))
        : [...people].sort((a, b) => parseInt(b.calls) - parseInt(a.calls));

    const newRanking = section === "messages" ? [...messageRanking] : [...callRanking];
    const currentIndex = newRanking.findIndex((p) => p.id === item.id);
    const targetIndex = (currentIndex + 1) % newRanking.length;
    [newRanking[currentIndex], newRanking[targetIndex]] = [newRanking[targetIndex], newRanking[currentIndex]];

    if (JSON.stringify(newRanking) === JSON.stringify(correctRanking)) {
      setScore(score + 10);
    }

    section === "messages" ? setMessageRanking(newRanking) : setCallRanking(newRanking);
  };

  return (
    <Animated.View style={[styles.mainContainer, { backgroundColor: animatedBackgroundColor }]}>
      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>⏰ Süre Bitti! Skorunuz: {score}</Text>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={() => {
              setGameOver(false);
              setScore(0);
              setCurrentLevel(1);
              setTimer(30);
            }}
          >
            <Text style={styles.buttonText}>Tekrar Başla</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>📱 Telefon ve Mesaj Yarışması 💬</Text>
            <Text style={styles.score}>Puan: {score}</Text>
            <Text style={styles.level}>Seviye: {currentLevel}</Text>
            <Text style={styles.timer}>⏳ Süre: {timer} saniye</Text>
          </View>

          <View style={styles.rankingsContainer}>
            <View style={styles.rankingSection}>
              <Text style={styles.sectionTitle}>💬 Mesaj Sıralaması</Text>
              {messageRanking.map((person, index) => (
                <TouchableOpacity
                  key={person.id}
                  style={[styles.personCard, { backgroundColor: person.color }]}
                  onPress={() => handleCardPress(person, index, "messages")}
                >
                  <Text style={styles.name}>{person.name}</Text>
                  <Text style={styles.statText}>Mesaj: {person.messages}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.rankingSection}>
              <Text style={styles.sectionTitle}>📞 Arama Sıralaması</Text>
              {callRanking.map((person, index) => (
                <TouchableOpacity
                  key={person.id}
                  style={[styles.personCard, { backgroundColor: person.color }]}
                  onPress={() => handleCardPress(person, index, "calls")}
                >
                  <Text style={styles.name}>{person.name}</Text>
                  <Text style={styles.statText}>Arama: {person.calls}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={nextLevel}>
              <Text style={styles.buttonText}>Sonraki Seviye 🚀</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  score: {
    fontSize: 18,
    marginTop: 5,
    color: "#FFFFFF",
  },
  level: {
    fontSize: 18,
    marginTop: 5,
    color: "#FFFFFF",
  },
  timer: {
    fontSize: 18,
    marginTop: 5,
    color: "red",
  },
  rankingsContainer: {
    width: "100%",
  },
  rankingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#FFFFFF",
  },
  personCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#4ECDC4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FFFFFF",
  },
  restartButton: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 10,
  },
});

export default GameScreen;
