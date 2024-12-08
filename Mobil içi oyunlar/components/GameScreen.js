import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, PanResponder } from 'react-native';

const GameScreen = () => {
  const [people] = useState([
    { id: 1, name: 'Ahmet', messages: '985242', calls: '125645', color: '#FF6B6B' },
    { id: 2, name: 'Fatma', messages: '754123', calls: '236541', color: '#4ECDC4' },
    { id: 3, name: 'Mehmet', messages: '632541', calls: '98542', color: '#45B7D1' },
    { id: 4, name: 'Ayşe', messages: '845632', calls: '145236', color: '#96CEB4' },
    { id: 5, name: 'Ali', messages: '456321', calls: '178945', color: '#FF8B94' },
  ]);

  const [messageRanking, setMessageRanking] = useState([...people]);
  const [callRanking, setCallRanking] = useState([...people]);
  const [showCorrectRanking, setShowCorrectRanking] = useState(false);

  const getCorrectRankings = () => {
    const correctMessageRanking = [...people].sort((a, b) => 
      parseInt(b.messages) - parseInt(a.messages)
    );
    const correctCallRanking = [...people].sort((a, b) => 
      parseInt(b.calls) - parseInt(a.calls)
    );
    return { correctMessageRanking, correctCallRanking };
  };

  const renderPerson = (item, index, section) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.personCard, { backgroundColor: item.color }]}
        onPress={() => handleCardPress(item, index, section)}
      >
        <View style={styles.personInfo}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statText}>Mesaj: {item.messages}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statText}>Arama: {item.calls}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleCardPress = (item, index, section) => {
    // Kartın sırasını değiştir
    if (section === 'messages') {
      const newRanking = [...messageRanking];
      const currentIndex = newRanking.findIndex(p => p.id === item.id);
      const targetIndex = (currentIndex + 1) % newRanking.length;
      [newRanking[currentIndex], newRanking[targetIndex]] = [newRanking[targetIndex], newRanking[currentIndex]];
      setMessageRanking(newRanking);
    } else {
      const newRanking = [...callRanking];
      const currentIndex = newRanking.findIndex(p => p.id === item.id);
      const targetIndex = (currentIndex + 1) % newRanking.length;
      [newRanking[currentIndex], newRanking[targetIndex]] = [newRanking[targetIndex], newRanking[currentIndex]];
      setCallRanking(newRanking);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>📱 Telefon ve Mesaj Yarışması 💬</Text>
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.instruction}>
            Kartlara tıklayarak sıralamayı değiştirin!
          </Text>
        </View>

        <View style={styles.rankingsContainer}>
          <View style={styles.rankingSection}>
            <Text style={styles.sectionTitle}>
              💬 Mesaj Sıralaması
            </Text>
            <View style={styles.rankingContainer}>
              {messageRanking.map((person, index) => renderPerson(person, index, 'messages'))}
            </View>
          </View>

          <View style={styles.rankingSection}>
            <Text style={styles.sectionTitle}>
              📞 Arama Sıralaması
            </Text>
            <View style={styles.rankingContainer}>
              {callRanking.map((person, index) => renderPerson(person, index, 'calls'))}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => setShowCorrectRanking(!showCorrectRanking)}
          >
            <Text style={styles.buttonText}>
              {showCorrectRanking ? '❌ Sıralamaları Gizle' : '✅ Doğru Sıralamayı Göster'}
            </Text>
          </TouchableOpacity>

          {showCorrectRanking && (
            <View style={styles.correctRankings}>
              <Text style={styles.correctTitle}>🏆 Doğru Sıralama:</Text>
              <View style={styles.rankingSection}>
                <Text style={styles.rankingTitle}>💬 Mesaj Sıralaması:</Text>
                {getCorrectRankings().correctMessageRanking.map((person, index) => (
                  <Text key={person.id} style={styles.rankingText}>
                    {index + 1}. {person.name}: {person.messages}
                  </Text>
                ))}
              </View>
              <View style={styles.rankingSection}>
                <Text style={styles.rankingTitle}>📞 Arama Sıralaması:</Text>
                {getCorrectRankings().correctCallRanking.map((person, index) => (
                  <Text key={person.id} style={styles.rankingText}>
                    {index + 1}. {person.name}: {person.calls}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#4ECDC4',
    padding: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  instructionContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  rankingsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  rankingSection: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
    textAlign: 'center',
  },
  rankingContainer: {
    width: '100%',
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginVertical: 5,
    elevation: 3,
    width: '100%',
  },
  personInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    marginHorizontal: 5,
  },
  statText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  correctRankings: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  correctTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  rankingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  rankingText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default GameScreen;
