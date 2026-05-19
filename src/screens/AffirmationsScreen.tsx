import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  Dimensions,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeStyles, useTheme, Radius, Spacing } from '../theme';
import { categories, Category } from '../data/affirmations';
import CategorySheet from '../components/CategorySheet';
import { toggle as toggleSpeech, stop as stopSpeech } from '../utils/speech';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.52;
const SWIPE_THRESHOLD = 120;

export default function AffirmationsScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [cardIndex, setCardIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCategory, setShowCategory] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('user_focus').then((focusId) => {
      if (focusId) {
        const found = categories.find((c) => c.id === focusId && !c.premium);
        if (found) setSelectedCategory(found);
      }
    });
  }, []);

  const pan = useRef(new Animated.ValueXY()).current;
  const nextCardScale = useRef(new Animated.Value(0.95)).current;
  const nextCardRotate = useRef(new Animated.Value(-6)).current;

  const affirmations = selectedCategory.affirmations;
  const currentAffirmation = affirmations[cardIndex % affirmations.length];
  const nextAffirmation = affirmations[(cardIndex + 1) % affirmations.length];

  useEffect(() => {
    AsyncStorage.getItem('favorites').then((val) => {
      if (val) setFavorites(JSON.parse(val));
    });
  }, []);

  const saveFavorites = useCallback((favs: string[]) => {
    setFavorites(favs);
    AsyncStorage.setItem('favorites', JSON.stringify(favs));
  }, []);

  const toggleFavorite = () => {
    const isFav = favorites.includes(currentAffirmation);
    const next = isFav
      ? favorites.filter((f) => f !== currentAffirmation)
      : [...favorites, currentAffirmation];
    saveFavorites(next);
  };

  const advanceCard = (direction: 'left' | 'right') => {
    const toX = direction === 'left' ? -SCREEN_WIDTH * 1.3 : SCREEN_WIDTH * 1.3;
    Animated.parallel([
      Animated.timing(pan.x, { toValue: toX, duration: 260, useNativeDriver: true }),
      Animated.timing(nextCardScale, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.timing(nextCardRotate, { toValue: 0, duration: 260, useNativeDriver: true }),
    ]).start(() => {
      pan.setValue({ x: 0, y: 0 });
      nextCardScale.setValue(0.95);
      nextCardRotate.setValue(-6);
      stopSpeech();
      setCardIndex((i) => i + 1);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 5,
      onPanResponderMove: (evt, gs) => {
        pan.setValue({ x: gs.dx, y: gs.dy });
        const progress = Math.min(Math.abs(gs.dx) / SWIPE_THRESHOLD, 1);
        nextCardScale.setValue(0.95 + 0.05 * progress);
        nextCardRotate.setValue(-6 + 6 * progress);
      },
      onPanResponderRelease: (_, gs) => {
        if (Math.abs(gs.dx) > SWIPE_THRESHOLD) {
          advanceCard(gs.dx < 0 ? 'left' : 'right');
        } else {
          Animated.parallel([
            Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }),
            Animated.spring(nextCardScale, { toValue: 0.95, useNativeDriver: true }),
            Animated.spring(nextCardRotate, { toValue: -6, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  const cardRotation = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD * 2, 0, SWIPE_THRESHOLD * 2],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  const nextRotateDeg = nextCardRotate.interpolate({
    inputRange: [-6, 0],
    outputRange: ['-6deg', '0deg'],
  });

  const isFav = favorites.includes(currentAffirmation);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Category header */}
      <View style={styles.categoryHeader}>
        <View style={styles.categoryHeaderPill}>
          <View style={styles.heartCircle}>
            <Ionicons name="heart" size={14} color={colors.primary} />
          </View>
          <Text style={styles.categoryHeaderText}>{selectedCategory.name}</Text>
        </View>
      </View>

      {/* Card stack */}
      <View style={styles.cardArea}>
        {/* Back card */}
        <Animated.View
          style={[
            styles.card,
            styles.backCard,
            {
              transform: [
                { scale: nextCardScale },
                { rotate: nextRotateDeg },
              ],
            },
          ]}
        >
          <Text style={styles.cardText}>{nextAffirmation}</Text>
        </Animated.View>

        {/* Front card */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { rotate: cardRotation },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Text style={styles.cardText}>{currentAffirmation}</Text>
        </Animated.View>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={toggleFavorite}>
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={24}
            color={isFav ? colors.primary : colors.grayDark}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => toggleSpeech(currentAffirmation)}
        >
          <Ionicons name="volume-medium-outline" size={24} color={colors.grayDark} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Share.share({ message: currentAffirmation })}
        >
          <Ionicons name="share-outline" size={24} color={colors.grayDark} />
        </TouchableOpacity>
      </View>

      {/* Bottom filter row */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterPill}
          onPress={() => setShowCategory(true)}
        >
          <Text style={styles.filterPillText}>Kategori</Text>
          <Ionicons name="chevron-expand" size={14} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterPill}>
          <Text style={styles.filterPillText}>✦ Senin İçin</Text>
        </TouchableOpacity>
      </View>

      <CategorySheet
        visible={showCategory}
        selectedId={selectedCategory.id}
        onSelect={(cat) => {
          setSelectedCategory(cat);
          setCardIndex(0);
          setShowCategory(false);
        }}
        onClose={() => setShowCategory(false)}
      />
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  categoryHeader: {
    paddingVertical: Spacing.sm,
  },
  categoryHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heartCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  cardArea: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginTop: Spacing.md,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: Radius.xl,
    backgroundColor: colors.cardPink,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    position: 'absolute',
    shadowColor: colors.cardPinkDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  backCard: {
    shadowOpacity: 0.15,
  },
  cardText: {
    fontFamily: 'Georgia',
    fontSize: 34,
    color: colors.black,
    textAlign: 'center',
    lineHeight: 46,
  },
  actions: {
    flexDirection: 'row',
    gap: 20,
    marginTop: Spacing.lg,
  },
  actionBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.lg,
    marginTop: 'auto',
    paddingBottom: Spacing.md,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
}));
