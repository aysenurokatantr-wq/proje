import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing } from '../theme';
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

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [hapticOn, setHapticOn] = useState(true);
  const [notifsOn, setNotifsOn] = useState(false);
  const today = new Date();
  const weekDays = getWeekDays();
  const todayIndex = (today.getDay() + 6) % 7;

  useEffect(() => {
    areNotificationsEnabled().then(setNotifsOn);
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
    Alert.alert('Bildirimler açıldı', 'Her gün saat 09:00\'da olumlama hatırlatıcısı alacaksın.');
  };

  const infoItems = [
    { icon: 'bulb-outline', label: 'Yeni Özellik Öner', chevron: false },
    { icon: 'star-outline', label: 'Uygulamayı Puanla', chevron: false },
    { icon: 'help-circle-outline', label: 'SSS', chevron: true },
    { icon: 'mail-outline', label: 'Destek ile İletişim', chevron: false },
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
              {today.getFullYear()} • 1 gün
            </Text>
          </View>
          <TouchableOpacity style={styles.showMonthBtn}>
            <Text style={styles.showMonthText}>Ayı Göster</Text>
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.purple }]} />
            <Text style={styles.legendText}>Olumlamalar</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.blue }]} />
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
                  i === todayIndex && styles.dotFilledPurple,
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
            <Ionicons name="notifications" size={24} color={Colors.blue} />
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
              color={notifsOn ? Colors.green : Colors.gray}
            />
            <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Update Focus */}
      <TouchableOpacity style={styles.card}>
        <View style={styles.updateFocusHeader}>
          <Ionicons name="sparkles" size={18} color={Colors.purple} />
          <Text style={styles.updateFocusTitle}>Odağı Güncelle</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.gray} style={{ marginLeft: 'auto' }} />
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
          <View style={styles.settingsRight}>
            <Ionicons name="phone-portrait-outline" size={16} color={Colors.gray} />
            <Text style={styles.settingsValue}>Sistem</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>Dokunsal Geri Bildirim</Text>
          <Switch
            value={hapticOn}
            onValueChange={setHapticOn}
            trackColor={{ false: Colors.grayMid, true: Colors.green }}
            thumbColor={Colors.white}
          />
        </View>
      </View>

      {/* Bilgi section */}
      <Text style={styles.sectionHeader}>Bilgi</Text>
      <View style={styles.card}>
        {infoItems.map((item, i) => (
          <React.Fragment key={i}>
            <TouchableOpacity style={styles.infoRow}>
              <Ionicons name={item.icon as any} size={22} color={Colors.black} />
              <Text style={styles.infoLabel}>{item.label}</Text>
              {item.chevron && (
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.gray}
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
          <Ionicons name="person" size={28} color={Colors.purple} />
        </View>
        <View>
          <Text style={styles.profileFieldLabel}>İsim</Text>
          <Text style={styles.profileName}>Ayşenur</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.black,
  },
  bannerSubtext: {
    fontSize: 14,
    color: Colors.grayDark,
  },
  stars: {
    fontSize: 22,
    color: Colors.gold,
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
    color: Colors.white,
  },
  card: {
    backgroundColor: Colors.white,
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
    color: Colors.black,
  },
  yearStreakText: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 2,
  },
  showMonthBtn: {
    backgroundColor: Colors.grayLight,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  showMonthText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
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
    color: Colors.grayDark,
  },
  weekCard: {
    backgroundColor: Colors.grayLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  weekLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.black,
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
    color: Colors.grayDark,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.grayMid,
    alignSelf: 'center',
  },
  dotFilledPurple: {
    backgroundColor: Colors.purple,
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
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
  },
  notifSubtitle: {
    fontSize: 13,
    color: Colors.gray,
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
    color: Colors.purple,
  },
  updateFocusDesc: {
    fontSize: 13,
    color: Colors.grayDark,
    lineHeight: 20,
    marginTop: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grayLight,
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
    color: Colors.black,
  },
  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingsValue: {
    fontSize: 14,
    color: Colors.gray,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.grayDark,
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
    color: Colors.black,
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
    backgroundColor: Colors.purplePale,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.purpleLight,
  },
  profileFieldLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
  },
});
