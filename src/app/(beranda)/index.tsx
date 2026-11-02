import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CityBusCard } from '@/components/home/city-bus-card';
import { HelpCard } from '@/components/home/help-card';
import { HomeHeader } from '@/components/home/home-header';
import { InfoList } from '@/components/home/info-list';
import { LiveTrackingCard } from '@/components/home/live-tracking-card';
import { NewsList } from '@/components/home/news-list';
import { SavedRoutes } from '@/components/home/saved-routes';
import { SearchCard } from '@/components/home/search-card';
import { Section } from '@/components/home/section';
import { ServiceGrid } from '@/components/home/service-grid';
import { Brand, Radius, Spacing } from '@/constants/theme';
import { profile } from '@/data/account';
import { cityOperators, useSelectedCity } from '@/data/cities';
import { announcements, liveTrip, savedRoutes, services } from '@/data/home';
import { unreadCount, useInbox } from '@/data/inbox';
import { news } from '@/data/news';
import { useSignedIn } from '@/data/session';
import { getBus, getRoute, getStop } from '@/data/transit';

const LATEST_NEWS_COUNT = 3;
/** Gap between the header and the first card. */
const CARD_TOP = Spacing.two;
/** How far the blue continues behind the first card (reference 4): down to its search field. */
const BLUE_UNDER_CARD = 136;
/**
 * Where the gray sheet starts. It starts one corner radius above the end of the blue,
 * so its rounded corners show against blue.
 */
const SHEET_TOP = CARD_TOP + BLUE_UNDER_CARD - Radius.sheet;

const serviceRoutes = {
  'cek-laik': '/layanan/cek-laik',
  prasarana: '/layanan/peta-prasarana',
  mudik: '/layanan/peta-tematik',
  'lalu-lintas': '/layanan/lalu-lintas',
  etiket: '/layanan/etiket',
  lapor: '/akun/lapor',
  survei: '/layanan/survei',
} as const;

export default function HomeScreen() {
  // `t` makes every tap a new request, so Lacak reacts even when the params repeat.
  const openTracking = () => router.navigate('/lacak');
  const openRoute = (id: string) =>
    router.navigate({ pathname: '/lacak', params: { rute: id, t: String(Date.now()) } });
  const openSearch = () =>
    router.navigate({ pathname: '/lacak', params: { cari: '1', t: String(Date.now()) } });
  const openOperator = (id: string) =>
    router.navigate({ pathname: '/lacak', params: { operator: id, t: String(Date.now()) } });
  const openServices = () => router.navigate('/layanan');
  const openNews = () => router.navigate('/berita');
  const openArticle = (id: string) => router.navigate({ pathname: '/berita/[id]', params: { id } });

  const signedIn = useSignedIn();
  const inbox = useInbox();
  const city = useSelectedCity();
  const operators = cityOperators(city);
  const liveRoute = getRoute(liveTrip.routeId);
  const liveBus = getBus(liveTrip.busId);
  const liveStop = getStop(liveTrip.stopId);
  // The sample live bus runs in Semarang; other cities show their operators instead.
  const liveInCity = operators.some((operator) => operator.name === liveRoute?.operator);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <HomeHeader
        name={signedIn ? profile.name : null}
        city={city.name}
        unreadCount={unreadCount(inbox)}
        onPressCity={() => router.push('/pilih-kota')}
        onPressInbox={() => router.push('/kotak-masuk')}
        onPressAvatar={() => router.navigate(signedIn ? '/akun' : '/akun/masuk')}
      />

      <View style={styles.body}>
        {/* Blue behind the rounded corners of the scroll area. */}
        <View style={styles.cornerFill} />
        {/* Content scrolls under the header and is clipped by these rounded corners (like Livin'). */}
        <View style={styles.clip}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            {/* Blue behind the first card and the top overscroll bounce. */}
            <View style={styles.blue} />
            <View style={styles.sheet} />
            <View style={styles.content}>
              <SearchCard onPress={openSearch} />

              {liveInCity && liveRoute && liveBus && liveStop ? (
                <Section
                  title="Bus live"
                  icon={{ ios: 'bus', android: 'directions_bus', web: 'directions_bus' }}
                  actionLabel="Lacak semua"
                  onAction={openTracking}>
                  <LiveTrackingCard
                    route={liveRoute}
                    bus={liveBus}
                    stop={liveStop}
                    onPress={() => openRoute(liveRoute.id)}
                  />
                </Section>
              ) : (
                <CityBusCard
                  city={city}
                  operators={operators}
                  onPressOperator={(operator) => openOperator(operator.id)}
                />
              )}

              <Section title="Layanan" icon={{ ios: 'square.grid.2x2', android: 'apps', web: 'apps' }}>
                <ServiceGrid
                  services={services}
                  onPressAll={openServices}
                  onPressService={(service) => {
                    if (service.id === 'lacak') openTracking();
                    else if (service.id in serviceRoutes)
                      router.navigate(serviceRoutes[service.id as keyof typeof serviceRoutes]);
                    else openServices();
                  }}
                />
              </Section>

              <Section
                title="Rute tersimpan"
                icon={{ ios: 'bookmark', android: 'bookmark', web: 'bookmark' }}
                actionLabel="Atur"
                onAction={openTracking}>
                <SavedRoutes routes={savedRoutes} onPressRoute={(route) => openRoute(route.id)} />
              </Section>

              <Section title="Pengumuman" icon={{ ios: 'megaphone', android: 'campaign', web: 'campaign' }}>
                <InfoList
                  items={announcements}
                  onPressItem={(item) =>
                    router.push({ pathname: '/pengumuman/[id]', params: { id: item.id } })
                  }
                />
              </Section>

              <Section
                title="Berita terbaru"
                icon={{ ios: 'newspaper', android: 'newspaper', web: 'newspaper' }}
                actionLabel="Semua"
                onAction={openNews}>
                <NewsList
                  items={news.slice(0, LATEST_NEWS_COUNT)}
                  onPressItem={(item) => openArticle(item.id)}
                />
              </Section>

              <Section title="Bantuan" icon={{ ios: 'questionmark.circle', android: 'help', web: 'help' }}>
                <HelpCard
                  onPressItem={(id) => {
                    if (id === 'faq') router.push('/layanan/bantuan');
                    else if (id === 'cs') router.push('/layanan/hubungi-cs');
                    else router.push('/layanan/media-sosial');
                  }}
                />
              </Section>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Gray, not blue: the area behind the tab bar and the bottom bounce must match the sheet.
  screen: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  body: {
    flex: 1,
  },
  cornerFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Radius.sheet * 2,
    backgroundColor: Brand.primary,
  },
  clip: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: Radius.sheet,
    borderTopRightRadius: Radius.sheet,
    backgroundColor: Brand.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: CARD_TOP,
  },
  blue: {
    position: 'absolute',
    top: -1000,
    left: 0,
    right: 0,
    height: 1000 + CARD_TOP + BLUE_UNDER_CARD,
    backgroundColor: Brand.primary,
  },
  sheet: {
    position: 'absolute',
    top: SHEET_TOP,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Brand.background,
    borderTopLeftRadius: Radius.sheet,
    borderTopRightRadius: Radius.sheet,
  },
  content: {
    gap: Spacing.three - 4,
    paddingBottom: Spacing.six + Spacing.five,
  },
});
