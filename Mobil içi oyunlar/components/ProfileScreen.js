import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Animated } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';

const ProfileScreen = () => {
  const [points, setPoints] = useState([]);
  const [level, setLevel] = useState(1); // Başlangıç seviyesi
  const [progress, setProgress] = useState(0);
  const [animation] = useState(new Animated.Value(0));

  const GRID_SIZE = 300;
  const GRID_STEP = 30;
  const MARGIN = 50;

  // Seviyeye göre hedef noktalar oluştur
  const generateTargetPoints = (level) => {
    const targets = [];
    for (let i = 0; i < level * 5; i++) {
      const x = Math.floor(Math.random() * 11) - 5; // -5 ile 5 arasında rastgele x
      const y = Math.floor(Math.random() * 11) - 5; // -5 ile 5 arasında rastgele y
      if (!targets.some((point) => point.x === x && point.y === y)) {
        targets.push({ x, y });
      }
    }
    return targets;
  };

  const [targetPoints, setTargetPoints] = useState(generateTargetPoints(level));

  // Renk geçiş animasyonu
  const triggerAnimation = () => {
    Animated.sequence([
      Animated.timing(animation, { toValue: 1, duration: 300, useNativeDriver: false }),
      Animated.timing(animation, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  const animatedBackgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#81D4FA', '#FFCDD2'], // Pepe mavisi ve açık pembe
  });

  const handlePress = (evt) => {
    const { locationX, locationY } = evt.nativeEvent;

    // Hesaplanan koordinatlar
    const x = Math.round((locationX - MARGIN - GRID_SIZE / 2) / GRID_STEP);
    const y = Math.round((-(locationY - MARGIN - GRID_SIZE / 2)) / GRID_STEP);

    // Noktanın hedefte olup olmadığını kontrol et
    const isTargetPoint = targetPoints.some((point) => point.x === x && point.y === y);

    if (isTargetPoint) {
      if (!points.some((point) => point.x === x && point.y === y)) {
        setPoints([...points, { x, y }]);
        setProgress(progress + 1);
        triggerAnimation();

        if (points.length + 1 === targetPoints.length) {
          Alert.alert('Tebrikler!', `Seviye ${level} tamamlandı! 🎉`, [
            {
              text: 'Sonraki Seviye',
              onPress: () => {
                const newLevel = level + 1;
                setLevel(newLevel);
                setTargetPoints(generateTargetPoints(newLevel));
                setPoints([]);
                setProgress(0);
              },
            },
          ]);
        }
      }
    } else {
      Alert.alert('Yanlış Nokta!', 'Bu nokta hedef değil!');
    }
  };

  const resetPoints = () => {
    setPoints([]);
    setProgress(0);
  };

  const createGridLines = () => {
    const lines = [];

    // Yatay ve dikey çizgiler
    for (let i = 0; i <= GRID_SIZE; i += GRID_STEP) {
      lines.push(
        <Line
          key={`h${i}`}
          x1={MARGIN}
          y1={i + MARGIN}
          x2={GRID_SIZE + MARGIN}
          y2={i + MARGIN}
          stroke="#E0E0E0"
          strokeWidth="1"
        />,
        <Line
          key={`v${i}`}
          x1={i + MARGIN}
          y1={MARGIN}
          x2={i + MARGIN}
          y2={GRID_SIZE + MARGIN}
          stroke="#E0E0E0"
          strokeWidth="1"
        />
      );
    }

    // Ana eksenler
    lines.push(
      <Line
        key="x-axis"
        x1={MARGIN}
        y1={GRID_SIZE / 2 + MARGIN}
        x2={GRID_SIZE + MARGIN}
        y2={GRID_SIZE / 2 + MARGIN}
        stroke="#000"
        strokeWidth="2"
      />,
      <Line
        key="y-axis"
        x1={GRID_SIZE / 2 + MARGIN}
        y1={MARGIN}
        x2={GRID_SIZE / 2 + MARGIN}
        y2={GRID_SIZE + MARGIN}
        stroke="#000"
        strokeWidth="2"
      />
    );

    return lines;
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: animatedBackgroundColor }]}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>🎯 Koordinat Sistemi Oyunu</Text>
          <Text style={styles.subtitle}>Seviye: {level}</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              İlerleme: {progress}/{targetPoints.length}
            </Text>
          </View>

          <View style={styles.gameContainer}>
            <Svg height={GRID_SIZE + MARGIN * 2} width={GRID_SIZE + MARGIN * 2} onPress={handlePress}>
              <Rect
                x={MARGIN}
                y={MARGIN}
                width={GRID_SIZE}
                height={GRID_SIZE}
                fill="transparent"
                onPress={handlePress}
              />
              {createGridLines()}

              {/* Hedef noktalar */}
              {targetPoints.map((point, index) => (
                <Circle
                  key={`target-${index}`}
                  cx={point.x * GRID_STEP + GRID_SIZE / 2 + MARGIN}
                  cy={-point.y * GRID_STEP + GRID_SIZE / 2 + MARGIN}
                  r="5"
                  fill="#4CAF50"
                />
              ))}

              {/* Kullanıcı tarafından işaretlenen noktalar */}
              {points.map((point, index) => (
                <Circle
                  key={`point-${index}`}
                  cx={point.x * GRID_STEP + GRID_SIZE / 2 + MARGIN}
                  cy={-point.y * GRID_STEP + GRID_SIZE / 2 + MARGIN}
                  r="7"
                  fill="#FF6B6B"
                />
              ))}
            </Svg>
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={resetPoints}>
            <Text style={styles.buttonText}>Temizle</Text>
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
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  progressContainer: {
    marginBottom: 20,
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 10,
  },
  progressText: {
    fontSize: 16,
    color: '#333',
  },
  gameContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 3,
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
