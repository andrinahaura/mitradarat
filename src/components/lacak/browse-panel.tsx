import { View } from 'react-native';

import { CorridorBadge } from '@/components/corridor-badge';
import { IconTile } from '@/components/icon-tile';
import { ListCard, ListRow, SectionTitle } from '@/components/list';
import { type GridItem, ProgramGrid } from '@/components/program-grid';
import {
  formatDistance,
  getOperator,
  getProgram,
  getRoute,
  nearbyStops,
  type Operator,
  type Program,
  programs,
  recentOperatorIds,
  type Route,
  routesAtStop,
  type Stop,
  userLocation,
} from '@/data/transit';

/** Not a program: v1 listed the tourist-bus check next to the bus programs, so it stays here. */
export const TOURIST_BUS_ITEM = 'bus-pariwisata';

const gridItems: GridItem[] = [
  ...programs.map((program) => ({ id: program.id, label: program.name, icon: program.icon })),
  {
    id: TOURIST_BUS_ITEM,
    label: 'Bus Pariwisata',
    icon: { ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' },
  },
];

type BrowsePanelProps = {
  savedRouteIds: string[];
  onPressStop: (stop: Stop) => void;
  onPressRoute: (route: Route) => void;
  onPressProgram: (program: Program) => void;
  onPressOperator: (operator: Operator) => void;
  onPressTouristBus: () => void;
};

export function BrowsePanel({
  savedRouteIds,
  onPressStop,
  onPressRoute,
  onPressProgram,
  onPressOperator,
  onPressTouristBus,
}: BrowsePanelProps) {
  const nearby = nearbyStops(userLocation, 4);
  const saved = savedRouteIds.map(getRoute).filter((route): route is Route => route !== undefined);
  const recent = recentOperatorIds
    .map(getOperator)
    .filter((operator): operator is Operator => operator !== undefined);

  const onPressGridItem = (id: string) => {
    if (id === TOURIST_BUS_ITEM) return onPressTouristBus();
    const program = getProgram(id);
    if (program) onPressProgram(program);
  };

  return (
    <View>
      <SectionTitle>Layanan bus</SectionTitle>
      <ProgramGrid items={gridItems} onPressItem={onPressGridItem} />

      <SectionTitle>Halte terdekat</SectionTitle>
      <ListCard>
        {nearby.map(({ stop, meters }) => {
          const corridors = routesAtStop(stop.id);
          return (
            <ListRow
              key={stop.id}
              leading={
                <IconTile icon={{ ios: 'mappin', android: 'location_on', web: 'location_on' }} />
              }
              title={stop.name}
              subtitle={`${formatDistance(meters)} · Koridor ${corridors.map((r) => r.corridor).join(', ')}`}
              onPress={() => onPressStop(stop)}
              accessibilityLabel={`Halte ${stop.name}, ${formatDistance(meters)}`}
            />
          );
        })}
      </ListCard>

      {saved.length > 0 && (
        <>
          <SectionTitle>Rute tersimpan</SectionTitle>
          <ListCard>
            {saved.map((route) => (
              <ListRow
                key={route.id}
                leading={<CorridorBadge code={route.corridor} color={route.color} />}
                title={`${route.from} – ${route.to}`}
                subtitle={`${route.operator} · ${route.city}`}
                onPress={() => onPressRoute(route)}
              />
            ))}
          </ListCard>
        </>
      )}

      {recent.length > 0 && (
        <>
          <SectionTitle>Terakhir dilacak</SectionTitle>
          <ListCard>
            {recent.map((operator) => (
              <ListRow
                key={operator.id}
                leading={
                  <IconTile icon={{ ios: 'clock.arrow.circlepath', android: 'history', web: 'history' }} />
                }
                title={operator.name}
                subtitle={`${getProgram(operator.programId)?.name ?? ''} · ${operator.area}`}
                onPress={() => onPressOperator(operator)}
              />
            ))}
          </ListCard>
        </>
      )}
    </View>
  );
}

