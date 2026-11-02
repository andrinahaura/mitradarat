import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, type TextInputInstance, View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet, type SheetSnap, useSheetHeights } from '@/components/lacak/bottom-sheet';
import { BrowsePanel } from '@/components/lacak/browse-panel';
import { OperatorPanel } from '@/components/lacak/operator-panel';
import { ProgramPanel } from '@/components/lacak/program-panel';
import { RoutePanel } from '@/components/lacak/route-panel';
import { SearchBar } from '@/components/lacak/search-bar';
import { SearchResults } from '@/components/lacak/search-results';
import { StopPanel } from '@/components/lacak/stop-panel';
import { TrackingMap, type TrackingMapHandle } from '@/components/lacak/tracking-map';
import { Motion } from '@/constants/motion';
import { Brand, Gutter, Radius, Shadow, Spacing } from '@/constants/theme';
import {
  type Direction,
  getOperator,
  getProgram,
  getRoute,
  getStop,
  type Operator,
  type Program,
  type Route,
  savedRouteIds as initialSavedRouteIds,
  type Stop,
  userLocation,
} from '@/data/transit';

type Panel =
  | { kind: 'browse' }
  | { kind: 'program'; programId: string }
  | { kind: 'operator'; operatorId: string }
  | { kind: 'stop'; stopId: string }
  | { kind: 'route'; routeId: string; direction: Direction };

const SEARCH_BAR_HEIGHT = 52;

export default function TrackingScreen() {
  const insets = useSafeAreaInsets();
  const { half } = useSheetHeights();
  const params = useLocalSearchParams<{
    rute?: string;
    program?: string;
    operator?: string;
    cari?: string;
    t?: string;
  }>();

  const map = useRef<TrackingMapHandle>(null);
  const searchInput = useRef<TextInputInstance>(null);

  const [history, setHistory] = useState<Panel[]>([{ kind: 'browse' }]);
  const [query, setQuery] = useState('');
  const [snap, setSnap] = useState<SheetSnap>('half');
  const [savedRoutes, setSavedRoutes] = useState(initialSavedRouteIds);
  const [savedStops, setSavedStops] = useState<string[]>([]);

  const panel = history.at(-1) ?? { kind: 'browse' };
  const route = panel.kind === 'route' ? getRoute(panel.routeId) : undefined;
  const stop = panel.kind === 'stop' ? getStop(panel.stopId) : undefined;
  const program = panel.kind === 'program' ? getProgram(panel.programId) : undefined;
  const operator = panel.kind === 'operator' ? getOperator(panel.operatorId) : undefined;

  // Beranda and Layanan link here with ?rute=<id>, ?program=<id>, ?operator=<id> or ?cari=1;
  // `t` makes each tap a new request.
  const request = [params.rute, params.program, params.operator, params.cari, params.t].join('|');
  const [handledRequest, setHandledRequest] = useState('||||');
  if (request !== handledRequest) {
    setHandledRequest(request);
    if (params.rute && getRoute(params.rute)) {
      setHistory([{ kind: 'browse' }, { kind: 'route', routeId: params.rute, direction: 'forward' }]);
      setQuery('');
      setSnap('half');
    } else if (params.program && getProgram(params.program)) {
      setHistory([{ kind: 'browse' }, { kind: 'program', programId: params.program }]);
      setQuery('');
      setSnap('full');
    } else if (params.operator && getOperator(params.operator)) {
      setHistory([{ kind: 'browse' }, { kind: 'operator', operatorId: params.operator }]);
      setQuery('');
      setSnap('half');
    }
  }

  useEffect(() => {
    if (params.cari) searchInput.current?.focus();
  }, [params.cari, params.t]);

  // Move the camera to whatever the sheet is showing.
  useEffect(() => {
    if (route) map.current?.focusRoute(route);
    else if (stop) map.current?.focusStop(stop);
    else map.current?.focusLocation(userLocation);
  }, [route, stop]);

  const open = (next: Panel) => {
    Keyboard.dismiss();
    setQuery('');
    setSnap('half');
    setHistory((current) => [...current, next]);
  };
  const openStop = (target: Stop) => open({ kind: 'stop', stopId: target.id });
  const openRoute = (target: Route, direction: Direction = 'forward') =>
    open({ kind: 'route', routeId: target.id, direction });
  const openProgram = (target: Program) => {
    open({ kind: 'program', programId: target.id });
    setSnap('full');
  };
  const openOperator = (target: Operator) => open({ kind: 'operator', operatorId: target.id });
  const back = () => setHistory((current) => (current.length > 1 ? current.slice(0, -1) : current));

  const toggle = (list: string[], id: string) =>
    list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

  const onSnapChange = useCallback((next: SheetSnap) => {
    setSnap(next);
    if (next === 'half') Keyboard.dismiss();
  }, []);

  let content;
  if (query.trim()) {
    content = (
      <SearchResults
        query={query}
        onPressStop={openStop}
        onPressRoute={openRoute}
        onPressOperator={openOperator}
      />
    );
  } else if (panel.kind === 'stop' && stop) {
    content = (
      <StopPanel
        stop={stop}
        saved={savedStops.includes(stop.id)}
        onToggleSave={() => setSavedStops((current) => toggle(current, stop.id))}
        onPressRoute={openRoute}
      />
    );
  } else if (panel.kind === 'route' && route) {
    content = (
      <RoutePanel
        route={route}
        direction={panel.direction}
        saved={savedRoutes.includes(route.id)}
        onBack={back}
        onToggleSave={() => setSavedRoutes((current) => toggle(current, route.id))}
        onToggleDirection={() =>
          setHistory((current) => [
            ...current.slice(0, -1),
            { ...panel, direction: panel.direction === 'forward' ? 'backward' : 'forward' },
          ])
        }
        onPressStop={openStop}
      />
    );
  } else if (panel.kind === 'program' && program) {
    content = <ProgramPanel program={program} onPressOperator={openOperator} />;
  } else if (panel.kind === 'operator' && operator) {
    content = <OperatorPanel operator={operator} onPressRoute={openRoute} />;
  } else {
    content = (
      <BrowsePanel
        savedRouteIds={savedRoutes}
        onPressStop={openStop}
        onPressRoute={openRoute}
        onPressProgram={openProgram}
        onPressOperator={openOperator}
        onPressTouristBus={() =>
          router.navigate({ pathname: '/layanan/cek-laik', params: { jenis: 'pariwisata' } })
        }
      />
    );
  }

  const searchTop = insets.top + Spacing.two;
  // Past the first list the search gives way to a back button (reference: tracking screen).
  const inPanel = panel.kind !== 'browse' && !query.trim();

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <TrackingMap
        ref={map}
        selectedRoute={route}
        selectedStopId={stop?.id}
        padding={{ top: searchTop + SEARCH_BAR_HEIGHT, bottom: half }}
        onPressStop={openStop}
        onPressBus={(bus) => {
          const busRoute = getRoute(bus.routeId);
          if (busRoute) openRoute(busRoute, bus.direction);
        }}
      />

      {inPanel ? (
        <Reanimated.View
          key="back"
          entering={Motion.enter}
          exiting={Motion.exit}
          style={[styles.mapBackWrap, { top: searchTop }]}>
          <Pressable
            onPress={back}
            hitSlop={8}
            style={({ pressed }) => [styles.mapBack, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Kembali">
            <SymbolView
              name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
              size={20}
              weight="semibold"
              tintColor={Brand.textOnPrimary}
            />
          </Pressable>
        </Reanimated.View>
      ) : (
        <Reanimated.View
          key="search"
          entering={Motion.enter}
          exiting={Motion.exit}
          style={[styles.searchWrap, { top: searchTop }]}>
          <SearchBar
            ref={searchInput}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setSnap('full')}
          />
        </Reanimated.View>
      )}

      <BottomSheet
        snap={snap}
        onSnapChange={onSnapChange}
        contentKey={query.trim() ? 'search' : JSON.stringify(panel)}>
        {content}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  searchWrap: {
    position: 'absolute',
    left: Gutter,
    right: Gutter,
  },
  mapBackWrap: {
    position: 'absolute',
    left: Gutter,
  },
  mapBack: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Brand.surfaceContrast,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: Shadow.softCard,
  },
  pressed: {
    opacity: 0.7,
  },
});
