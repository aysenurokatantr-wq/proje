import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '../data/affirmations';

const NOTIFICATION_ID_KEY = 'daily_affirmation_notification_id';
const NOTIFICATIONS_ENABLED_KEY = 'notifications_enabled';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyAffirmation(hour = 9, minute = 0) {
  await cancelDailyAffirmation();
  const all = categories.flatMap((c) => c.affirmations);
  const pick = all[Math.floor(Math.random() * all.length)];

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-affirmation', {
      name: 'Günlük Olumlama',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Günlük olumlaman',
      body: pick,
      sound: true,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    } as Notifications.DailyTriggerInput,
  });
  await AsyncStorage.setItem(NOTIFICATION_ID_KEY, id);
  await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'true');
}

export async function cancelDailyAffirmation() {
  const id = await AsyncStorage.getItem(NOTIFICATION_ID_KEY);
  if (id) {
    await Notifications.cancelScheduledNotificationAsync(id);
    await AsyncStorage.removeItem(NOTIFICATION_ID_KEY);
  }
  await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'false');
}

export async function areNotificationsEnabled(): Promise<boolean> {
  const val = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
  return val === 'true';
}
