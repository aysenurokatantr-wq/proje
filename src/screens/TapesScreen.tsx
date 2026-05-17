import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Radius, Spacing } from '../theme';
import { categories } from '../data/affirmations';
import AmbientAudioModal from '../components/AmbientAudioModal';

const selfLoveAffirmations = categories[0].affirmations;

export default function TapesScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'pack' | 'favorites'>('pack');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAmbient, setShowAmbient] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('favorites').then((val) => {
      if (val) setFavorites(JSON.parse(val));
    });
  }, []);

  const displayList =
    activeTab === 'favorites'
      ? selfLoveAffirmations.filter((a) => favorites.includes(a))
      : selfLoveAffirmations;

  const favCount = selfLoveAffirmations.filter((a) => favorites.includes(a)).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Öz Sevgi Kasedin</Text>
        <Text style={styles.subtitle}>Olumlamalarına göz at ve dinle</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pack' && styles.tabActive]}
          onPress={() => setActiveTab('pack')}
        >
          <Ionicons
            name="musical-notes"
            size={16}
            color={activeTab === 'pack' ? Colors.white : Colors.black}
          />
          <Text style={[styles.tabText, activeTab === 'pack' && styles.tabTextActive]}>
            Paket
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.tabActive]}
          onPress={() => setActiveTab('favorites')}
        >
          <Ionicons
            name="heart"
            size={16}
            color={activeTab === 'favorites' ? Colors.white : Colors.black}
          />
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>
            Favoriler
          </Text>
          {favCount > 0 && (
            <View style={[styles.badge, activeTab === 'favorites' && styles.badgeActive]}>
              <Text style={[styles.badgeText, activeTab === 'favorites' && styles.badgeTextActive]}>
                {favCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Play All */}
      <TouchableOpacity
        style={styles.playAllBtn}
        onPress={() => setIsPlaying(!isPlaying)}
      >
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color={Colors.white} />
        <Text style={styles.playAllText}>{isPlaying ? 'Duraklat' : 'Hepsini Çal'}</Text>
      </TouchableOpacity>

      {/* Affirmation list */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {displayList.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={40} color={Colors.grayMid} />
            <Text style={styles.emptyText}>Henüz favori yok</Text>
            <Text style={styles.emptyHint}>
              Burada saklamak için olumlama kartlarındaki kalp simgesine dokun.
            </Text>
          </View>
        ) : (
          displayList.map((affirmation, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.affirmationCard,
                isPlaying && currentIndex === index && styles.affirmationCardActive,
              ]}
              onPress={() => {
                setCurrentIndex(index);
                setIsPlaying(true);
              }}
            >
              <Text style={styles.affirmationText}>{affirmation}</Text>
              {isPlaying && currentIndex === index && (
                <Ionicons
                  name="volume-high"
                  size={18}
                  color={Colors.primary}
                  style={styles.playingIcon}
                />
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Mini player bar */}
      {isPlaying && (
        <View style={styles.miniPlayer}>
          <Text style={styles.miniPlayerText} numberOfLines={1}>
            {displayList[currentIndex] || selfLoveAffirmations[0]}
          </Text>
          <TouchableOpacity onPress={() => setIsPlaying(false)}>
            <Ionicons name="pause-circle" size={28} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Floating FAB */}
      <TouchableOpacity
        style={[styles.fab, isPlaying && styles.fabUp]}
        onPress={() => setShowAmbient(true)}
      >
        <Ionicons name="volume-high" size={22} color={Colors.primary} />
      </TouchableOpacity>

      <AmbientAudioModal visible={showAmbient} onClose={() => setShowAmbient(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.black,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.grayDark,
    marginTop: 4,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
  },
  tabTextActive: {
    color: Colors.white,
  },
  badge: {
    backgroundColor: Colors.grayMid,
    borderRadius: Radius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.grayDark,
  },
  badgeTextActive: {
    color: Colors.white,
  },
  playAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.full,
    paddingVertical: 14,
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  playAllText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 120,
    gap: Spacing.md,
  },
  affirmationCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  affirmationCardActive: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  affirmationText: {
    fontFamily: 'Georgia',
    fontSize: 22,
    color: Colors.black,
    textAlign: 'center',
    lineHeight: 32,
  },
  playingIcon: {
    alignSelf: 'center',
    marginTop: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.grayDark,
  },
  emptyHint: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.xl,
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 90,
    left: Spacing.lg,
    right: 80,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    gap: Spacing.sm,
  },
  miniPlayerText: {
    flex: 1,
    fontSize: 13,
    color: Colors.black,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: Spacing.lg,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  fabUp: {
    bottom: 100,
  },
});
