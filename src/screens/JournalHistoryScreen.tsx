import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeStyles, useTheme, Radius, Spacing } from '../theme';

const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

type Entry = { date: string; text: string };

function parseDateKey(key: string): Date | null {
  const m = key.match(/^journal_(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function formatTurkishDate(d: Date) {
  return `${d.getDate()} ${TURKISH_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

type Props = NativeStackScreenProps<any>;

export default function JournalHistoryScreen({ navigation }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    const keys = await AsyncStorage.getAllKeys();
    const journalKeys = keys.filter((k) => k.startsWith('journal_'));
    const pairs = await AsyncStorage.multiGet(journalKeys);
    const parsed: Entry[] = pairs
      .filter(([, v]) => v && v.trim().length > 0)
      .map(([k, v]) => ({ date: k, text: v as string }))
      .sort((a, b) => b.date.localeCompare(a.date));
    setEntries(parsed);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  const deleteEntry = (date: string) => {
    Alert.alert('Sil', 'Bu günlük girişini silmek istiyor musun?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem(date);
          loadEntries();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Geçmiş Kayıtlar</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.empty}>Yükleniyor...</Text>
        ) : entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color={colors.grayMid} />
            <Text style={styles.emptyTitle}>Henüz günlük girişi yok</Text>
            <Text style={styles.emptyHint}>
              Günlük sekmesinden ilk yansımanı yaz; burada görüneceğim.
            </Text>
          </View>
        ) : (
          entries.map((entry) => {
            const date = parseDateKey(entry.date);
            return (
              <View key={entry.date} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardDate}>
                    {date ? formatTurkishDate(date) : entry.date}
                  </Text>
                  <TouchableOpacity onPress={() => deleteEntry(entry.date)}>
                    <Ionicons name="trash-outline" size={20} color={colors.gray} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.cardText}>{entry.text}</Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
  },
  scroll: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: 40,
  },
  empty: {
    textAlign: 'center',
    color: colors.gray,
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.grayDark,
  },
  emptyHint: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardDate: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.purple,
    letterSpacing: 0.5,
  },
  cardText: {
    fontFamily: 'Georgia',
    fontSize: 16,
    color: colors.black,
    lineHeight: 24,
  },
}));
