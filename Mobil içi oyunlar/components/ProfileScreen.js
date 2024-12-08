import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Rect } from 'react-native-svg';

const ProfileScreen = () => {
  const [points, setPoints] = useState([]);
  const [showResult, setShowResult] = useState(false);

  // Koordinat sistemi özellikleri
  const GRID_SIZE = 300;
  const GRID_STEP = 30;
  const MARGIN = 50;

  const handlePress = (evt) => {
    const { locationX, locationY } = evt.nativeEvent;
    
    // Koordinat sistemine göre pozisyonu hesapla
    const x = Math.round((locationX - MARGIN - GRID_SIZE/2) / GRID_STEP) * GRID_STEP + GRID_SIZE/2 + MARGIN;
    const y = Math.round((locationY - MARGIN - GRID_SIZE/2) / GRID_STEP) * GRID_STEP + GRID_SIZE/2 + MARGIN;
    
    // Sınırlar içinde mi kontrol et
    if (locationX >= MARGIN && locationX <= GRID_SIZE + MARGIN &&
        locationY >= MARGIN && locationY <= GRID_SIZE + MARGIN) {
      setPoints([...points, { x, y }]);
    }
  };

  const resetPoints = () => {
    setPoints([]);
    setShowResult(false);
  };

  // Koordinat çizgileri oluşturma
  const createGridLines = () => {
    const lines = [];
    
    // Yatay çizgiler
    for (let i = 0; i <= GRID_SIZE; i += GRID_STEP) {
      lines.push(
        <Line
          key={`h${i}`}
          x1={MARGIN}
          y1={i + MARGIN}
          x2={GRID_SIZE + MARGIN}
          y2={i + MARGIN}
          stroke="#ddd"
          strokeWidth="1"
        />
      );
      // Y ekseni değerleri
      if (i !== GRID_SIZE/2) {
        lines.push(
          <SvgText
            key={`yt${i}`}
            x={MARGIN - 20}
            y={i + MARGIN + 5}
            fill="#666"
            fontSize="12"
          >
            {Math.round((GRID_SIZE/2 - i) / GRID_STEP)}
          </SvgText>
        );
      }
    }

    // Dikey çizgiler
    for (let i = 0; i <= GRID_SIZE; i += GRID_STEP) {
      lines.push(
        <Line
          key={`v${i}`}
          x1={i + MARGIN}
          y1={MARGIN}
          x2={i + MARGIN}
          y2={GRID_SIZE + MARGIN}
          stroke="#ddd"
          strokeWidth="1"
        />
      );
      // X ekseni değerleri
      if (i !== GRID_SIZE/2) {
        lines.push(
          <SvgText
            key={`xt${i}`}
            x={i + MARGIN - 5}
            y={GRID_SIZE + MARGIN + 20}
            fill="#666"
            fontSize="12"
          >
            {Math.round((i - GRID_SIZE/2) / GRID_STEP)}
          </SvgText>
        );
      }
    }

    // X ve Y eksenleri (kalın çizgiler)
    lines.push(
      <Line
        key="x-axis"
        x1={MARGIN}
        y1={GRID_SIZE/2 + MARGIN}
        x2={GRID_SIZE + MARGIN}
        y2={GRID_SIZE/2 + MARGIN}
        stroke="#000"
        strokeWidth="2"
      />,
      <Line
        key="y-axis"
        x1={GRID_SIZE/2 + MARGIN}
        y1={MARGIN}
        x2={GRID_SIZE/2 + MARGIN}
        y2={GRID_SIZE + MARGIN}
        stroke="#000"
        strokeWidth="2"
      />
    );

    return lines;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Koordinat Sistemi</Text>
        <Text style={styles.subtitle}>İşaretlemeniz gereken noktalar:</Text>
        
        <View style={styles.targetPoints}>
          <Text style={styles.pointText}>1. (0, 5)</Text>
          <Text style={styles.pointText}>2. (3, 2)</Text>
          <Text style={styles.pointText}>3. (5, 0)</Text>
          <Text style={styles.pointText}>4. (3, -2)</Text>
          <Text style={styles.pointText}>5. (2, -4)</Text>
          <Text style={styles.pointText}>6. (0, -3)</Text>
          <Text style={styles.pointText}>7. (-2, -4)</Text>
          <Text style={styles.pointText}>8. (-3, -2)</Text>
          <Text style={styles.pointText}>9. (-5, 0)</Text>
          <Text style={styles.pointText}>10. (-3, 2)</Text>
        </View>

        <View style={styles.gameContainer}>
          <Svg 
            height={GRID_SIZE + MARGIN * 2} 
            width={GRID_SIZE + MARGIN * 2}
            onPress={handlePress}
          >
            {/* Tıklanabilir alan için şeffaf dikdörtgen */}
            <Rect
              x={MARGIN}
              y={MARGIN}
              width={GRID_SIZE}
              height={GRID_SIZE}
              fill="transparent"
              onPress={handlePress}
            />
            
            {createGridLines()}

            {/* Noktalar arası çizgiler */}
            {points.map((point, index) => {
              if (index > 0) {
                const previousPoint = points[index - 1];
                return (
                  <Line
                    key={`line${index}`}
                    x1={previousPoint.x}
                    y1={previousPoint.y}
                    x2={point.x}
                    y2={point.y}
                    stroke="#4ECDC4"
                    strokeWidth="2"
                  />
                );
              }
            })}

            {/* Noktalar */}
            {points.map((point, index) => (
              <Circle
                key={`point${index}`}
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#FF6B6B"
              />
            ))}
          </Svg>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={resetPoints}>
            <Text style={styles.buttonText}>Temizle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pointsList}>
          <Text style={styles.pointsTitle}>İşaretlediğiniz Noktalar:</Text>
          {points.map((point, index) => (
            <Text key={index} style={styles.pointText}>
              Nokta {index + 1}: ({Math.round((point.x - GRID_SIZE/2 - MARGIN) / GRID_STEP)}, 
              {Math.round(-(point.y - GRID_SIZE/2 - MARGIN) / GRID_STEP)})
            </Text>
          ))}
        </View>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  targetPoints: {
    width: '100%',
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gameContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
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
  pointsList: {
    width: '100%',
    padding: 10,
  },
  pointsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pointText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default ProfileScreen;
