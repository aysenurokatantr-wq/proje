import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Radius, Spacing } from '../theme';
import { journalPrompts } from '../data/affirmations';
import PremiumModal from '../components/PremiumModal';

const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

function getTodayKey() {
  const d = new Date();
  return `journal_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDate(d: Date) {
  return `${d.getDate()} ${TURKISH_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const [showPremium, setShowPremium] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [activeChip, setActiveChip] = useState<'foryou' | 'shadow'>('foryou');
  const [reflection, setReflection] = useState('');
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const today = new Date();

  useEffect(() => {
    AsyncStorage.getItem(getTodayKey()).then((val) => {
      if (val) setReflection(val);
    });
  }, []);

  const saveReflection = (text: string) => {
    setReflection(text);
    AsyncStorage.setItem(getTodayKey(), text);
  };

  const spinRefresh = () => {
    rotateAnim.setValue(0);
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setPromptIndex((i) => (i + 1) % journalPrompts.length);
    });
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Premium prompt button */}
        <TouchableOpacity
          style={styles.premiumPill}
          onPress={() => setShowPremium(true)}
        >
          <Text style={styles.premiumPillText}>Get personalized prompts</Text>
        </TouchableOpacity>

        {/* Today's Reflection card */}
        <View style={styles.card}>
          {/* Date header */}
          <View style={styles.reflectionHeader}>
            <View style={styles.blueDot} />
            <Text style={styles.sectionLabel}>TODAY'S REFLECTION</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(today)}</Text>

          {/* Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chipsContent}
          >
            <TouchableOpacity
              style={[styles.chip, activeChip === 'foryou' && styles.chipActive]}
              onPress={() => setActiveChip('foryou')}
            >
              <Text style={[styles.chipText, activeChip === 'foryou' && styles.chipTextActive]}>
                ✦ For You
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, activeChip === 'shadow' && styles.chipActive]}
              onPress={() => setActiveChip('shadow')}
            >
              <Text style={[styles.chipText, activeChip === 'shadow' && styles.chipTextActive]}>
                🌙 Shadow Work
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={spinRefresh} style={styles.refreshBtn}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Ionicons name="sync-circle-outline" size={24} color={Colors.purple} />
              </Animated.View>
            </TouchableOpacity>
          </ScrollView>

          {/* Prompt */}
          <Text style={styles.promptText}>{journalPrompts[promptIndex]}</Text>
        </View>

        {/* Action row */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="volume-medium-outline" size={20} color={Colors.blue} />
            <Text style={styles.actionCardText}>Hear{'\n'}Today's</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="book-outline" size={20} color={Colors.teal} />
            <Text style={styles.actionCardText}>View Past{'\n'}Entries</Text>
          </TouchableOpacity>
        </View>

        {/* Reflection input */}
        <View style={styles.reflectionCard}>
          <View style={styles.reflectionCardHeader}>
            <View style={styles.reflectionDot} />
            <Text style={styles.sectionLabel}>YOUR REFLECTION</Text>
            <TouchableOpacity style={styles.micBtn}>
              <Ionicons name="mic-outline" size={22} color={Colors.gray} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.textInput}
            multiline
            value={reflection}
            onChangeText={saveReflection}
            placeholder="Begin writing..."
            placeholderTextColor={Colors.gray}
            textAlignVertical="top"
          />
          {!reflection && (
            <Text style={styles.hint}>Let your thoughts flow freely. This space is yours.</Text>
          )}
        </View>
      </ScrollView>

      <PremiumModal visible={showPremium} onClose={() => setShowPremium(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: Spacing.md,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  premiumPill: {
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: Colors.purple,
    borderRadius: Radius.full,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 4,
  },
  premiumPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.purple,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  reflectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.blue,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.grayDark,
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: Spacing.sm,
  },
  chipsScroll: {
    marginBottom: Spacing.md,
  },
  chipsContent: {
    gap: 8,
    paddingRight: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.grayLight,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: Colors.grayMid,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.grayDark,
  },
  chipTextActive: {
    color: Colors.black,
  },
  refreshBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  promptText: {
    fontFamily: 'Georgia',
    fontSize: 26,
    color: Colors.black,
    lineHeight: 36,
    marginTop: Spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionCardText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.black,
    lineHeight: 20,
  },
  reflectionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  reflectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  reflectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.purple,
  },
  micBtn: {
    marginLeft: 'auto',
  },
  textInput: {
    fontSize: 16,
    color: Colors.black,
    lineHeight: 24,
    minHeight: 100,
    fontFamily: 'Georgia',
  },
  hint: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
    lineHeight: 20,
  },
});
