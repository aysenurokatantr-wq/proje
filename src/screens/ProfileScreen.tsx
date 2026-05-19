import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { makeStyles, useTheme, Radius, Spacing } from '../theme';
import type { ThemeMode } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  areNotificationsEnabled,
  cancelDailyAffirmation,
  requestPermissions,
  scheduleDailyAffirmation,
} from '../utils/notifications';

const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];
const TURKISH_DAYS = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];

function getWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function dateToStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const unique = [...new Set(dates)].sort().reverse();
  let streak = 0;
  let expected = dateToStr(new Date());
  for (const d of unique) {
    if (d === expected) {
      streak++;
      const prev = new Date(expected);
      prev.setDate(prev.getDate() - 1);
      expected = dateToStr(prev);
    } else if (d < expected) {
      break;
    }
  }
  return streak;
}

export default function ProfileScreen() {
  const styles = useStyles();
  const { colors, mode, setMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [hapticOn, setHapticOn] = useState(true);
  const [notifsOn, setNotifsOn] = useState(false);
  const [userName, setUserName] = useState('Sen');
  const [streak, setStreak] = useState(0);
  const [weekActivity, setWeekActivity] = useState<boolean[]>(Array(7).fill(false));
  const today = new Date();
  const weekDays = getWeekDays();
  const todayIndex = (today.getDay() + 6) % 7;

  useEffect(() => {
    areNotificationsEnabled().then(setNotifsOn);
    AsyncStorage.getItem('user_name').then((val) => {
      if (val) setUserName(val);
    });

    const setup = async () => {
      const raw = await AsyncStorage.getItem('activity_dates');
      const dates: string[] = raw ? JSON.parse(raw) : [];
      const todayKey = dateToStr(new Date());
      if (!dates.includes(todayKey)) {
        dates.push(todayKey);
        await AsyncStorage.setItem('activity_dates', JSON.stringify(dates));
      }
      setStreak(computeStreak(dates));
      const week = getWeekDays().map((d) => dates.includes(dateToStr(d)));
      setWeekActivity(week);
    };
    setup();
  }, []);

  const toggleNotifications = async () => {
    if (notifsOn) {
      await cancelDailyAffirmation();
      setNotifsOn(false);
      return;
    }
    const granted = await requestPermissions();
    if (!granted) {
      Alert.alert(
        'Bildirim izni gerekli',
        'Günlük olumlama hatırlatıcıları için bildirimlere izin vermelisin.'
      );
      return;
    }
    await scheduleDailyAffirmation(9, 0);
    setNotifsOn(true);
    Alert.alert('Bildirimler açıldı', "Her gün saat 09:00'da olumlama hatırlatıcısı alacaksın.");
  };

  const infoItems = [
    { icon: 'bulb-outline', label: 'Yeni Özellik Öner', chevron: false },
    { icon: 'star-outline', label: 'Uygulamayı Puanla', chevron: false },
    { icon: 'help-circle-outline', label: 'SSS', chevron: true },
    { icon: 'mail-outline', label: 'Destek ile İletişim', chevron: false },
  ];

  const themeModes: { id: ThemeMode; label: string }[] = [
    { id: 'system', label: 'Sistem' },
    { id: 'light', label: 'Açık' },
    { id: 'dark', label: 'Koyu' },
  ];

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Premium Banner */}
      <LinearGradient
        colors={['#D8CEF0', '#C4B5FD']}
        style={styles.premiumBanner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.bannerRight}>
          <Text style={styles.bannerCount}>200,000+</Text>
          <Text style={styles.bannerSubtext}>hayat değişti</Text>
          <Text style={styles.stars}>★★★★★</Text>
        </View>
        <TouchableOpacity>
          <LinearGradient
            colors={['#8B5CF6', '#A78BFA']}
            style={styles.unlockBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.unlockBtnText}>Premium Özelliklerin Kilidini Açın</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {/* Streak Calendar */}
      <View style={styles.card}>
        <View style={styles.calendarHeader}>
          <View>
            <Text style={styles.monthText}>
              {TURKISH_MONTHS[today.getMonth()]}
            </Text>
            <Text style={styles.yearStreakText}>
              {today.getFullYear()} • {streak} gün
            </Text>
          </View>
          <TouchableOpacity style={styles.showMonthBtn}>
            <Text style={styles.showMonthText}>Ayı Göster</Text>
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.purple }]} />
            <Text style={styles.legendText}>Olumlamalar</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.blue }]} />
            <Text style={styles.legendText}>Günlük</Text>
          </View>
        </View>

        {/* Weekly tracker */}
        <View style={styles.weekCard}>
          <Text style={styles.weekLabel}>Bu Hafta</Text>
          <View style={styles.weekRow}>
            {TURKISH_DAYS.map((day, i) => (
              <Text key={i} style={styles.dayInitial}>{day}</Text>
            ))}
          </View>
          {/* Affirmations row */}
          <View style={styles.weekRow}>
            {weekDays.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  weekActivity[i] && styles.dotFilledPurple,
                  i === todayIndex && !weekActivity[i] && styles.dotToday,
                ]}
              />
            ))}
          </View>
          {/* Journal row */}
          <View style={styles.weekRow}>
            {weekDays.map((_, i) => (
              <View key={i} style={styles.dot} />
            ))}
          </View>
        </View>
      </View>

      {/* Notifications */}
      <TouchableOpacity style={styles.card} onPress={toggleNotifications}>
        <View style={styles.notifRow}>
          <View style={styles.notifIconWrap}>
            <Ionicons name="notifications" size={24} color={colors.blue} />
          </View>
          <View style={styles.notifContent}>
            <Text style={styles.notifTitle}>Bildirimler</Text>
            <Text style={styles.notifSubtitle}>
              {notifsOn ? 'Olumlama hatırlatıcıları açık' : 'Hatırlatıcıları açmak için dokun'}
            </Text>
          </View>
          <View style={styles.notifRight}>
            <Ionicons
              name={notifsOn ? 'notifications' : 'notifications-off-outline'}
              size={18}
              color={notifsOn ? colors.green : colors.gray}
            />
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Update Focus */}
      <TouchableOpacity style={styles.card}>
        <View style={styles.updateFocusHeader}>
          <Ionicons name="sparkles" size={18} color={colors.purple} />
          <Text style={styles.updateFocusTitle}>Odağı Güncelle</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.gray} style={{ marginLeft: 'auto' }} />
        </View>
        <View style={styles.divider} />
        <Text style={styles.updateFocusDesc}>
          Hayatın değiştiğinde manifesto hedeflerini ve günlük sorunu yenile.
          Bir sonraki olumlamaların bunu yansıtacak.
        </Text>
      </TouchableOpacity>

      {/* Settings */}
      <View style={styles.card}>
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>Renk Şeması</Text>
        </View>
        <View style={styles.themeRow}>
          {themeModes.map((tm) => (
            <TouchableOpacity
              key={tm.id}
              style={[styles.themeBtn, mode === tm.id && styles.themeBtnActive]}
              onPress={() => setMode(tm.id)}
            >
              <Text style={[styles.themeBtnText, mode === tm.id && styles.themeBtnTextActive]}>
                {tm.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.divider} />
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>Dokunsal Geri Bildirim</Text>
          <Switch
            value={hapticOn}
            onValueChange={setHapticOn}
            trackColor={{ false: colors.grayMid, true: colors.green }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      {/* Bilgi section */}
      <Text style={styles.sectionHeader}>Bilgi</Text>
      <View style={styles.card}>
        {infoItems.map((item, i) => (
          <React.Fragment key={i}>
            <TouchableOpacity style={styles.infoRow}>
              <Ionicons name={item.icon as any} size={22} color={colors.black} />
              <Text style={styles.infoLabel}>{item.label}</Text>
              {item.chevron && (
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.gray}
                  style={{ marginLeft: 'auto' }}
                />
              )}
            </TouchableOpacity>
            {i < infoItems.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>

      {/* Profile footer */}
      <View style={styles.profileFooter}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={28} color={colors.purple} />
        </View>
        <View>
          <Text style={styles.profileFieldLabel}>İsim</Text>
          <Text style={styles.profileName}>{userName}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const useStyles = makeStyles((colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: 40,
  },
  premiumBanner: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    overflow: 'hidden',
  },
  bannerRight: {
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  bannerCount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  bannerSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  stars: {
    fontSize: 22,
    color: colors.gold,
    letterSpacing: 2,
  },
  unlockBtn: {
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  unlockBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  monthText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.black,
  },
  yearStreakText: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 2,
  },
  showMonthBtn: {
    backgroundColor: colors.grayLight,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  showMonthText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.black,
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
    color: colors.grayDark,
  },
  weekCard: {
    backgroundColor: colors.grayLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  weekLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.black,
    marginBottom: Spacing.sm,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  dayInitial: {
    width: 32,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: colors.grayDark,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.grayMid,
    alignSelf: 'center',
  },
  dotFilledPurple: {
    backgroundColor: colors.purple,
  },
  dotToday: {
    borderWidth: 2,
    borderColor: colors.purple,
    backgroundColor: colors.grayMid,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  notifIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
  },
  notifSubtitle: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 2,
  },
  notifRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  updateFocusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  updateFocusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.purple,
  },
  updateFocusDesc: {
    fontSize: 13,
    color: colors.grayDark,
    lineHeight: 20,
    marginTop: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayLight,
    marginVertical: Spacing.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  themeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: colors.grayLight,
    alignItems: 'center',
  },
  themeBtnActive: {
    backgroundColor: colors.primary,
  },
  themeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.grayDark,
  },
  themeBtnTextActive: {
    color: colors.white,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.grayDark,
    paddingHorizontal: 4,
    marginBottom: -4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
    flex: 1,
  },
  profileFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.purplePale,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.purpleLight,
  },
  profileFieldLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
  },
}));
