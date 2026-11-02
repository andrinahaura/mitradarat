import { StyleSheet, View } from 'react-native';

import { CorridorBadge } from '@/components/corridor-badge';
import { IconTile } from '@/components/icon-tile';
import { EmptyNote, ListCard, ListRow, SectionTitle } from '@/components/list';
import {
  getProgram,
  type Operator,
  type Route,
  routesAtStop,
  search,
  type Stop,
} from '@/data/transit';

type SearchResultsProps = {
  query: string;
  onPressStop: (stop: Stop) => void;
  onPressRoute: (route: Route) => void;
  onPressOperator: (operator: Operator) => void;
};

export function SearchResults({ query, onPressStop, onPressRoute, onPressOperator }: SearchResultsProps) {
  const results = search(query);

  if (results.stops.length === 0 && results.routes.length === 0 && results.operators.length === 0) {
    return (
      <View style={styles.spacer}>
        <EmptyNote
          title={`Tidak ada hasil untuk “${query.trim()}”`}
          body="Coba nama halte, nomor koridor, nama operator, atau kota. Contoh: Simpang Lima, 1A, Trans Jogja, Surabaya."
        />
      </View>
    );
  }

  return (
    <View>
      {results.operators.length > 0 && (
        <>
          <SectionTitle>Operator dan wilayah</SectionTitle>
          <ListCard>
            {results.operators.map((operator) => (
              <ListRow
                key={operator.id}
                leading={
                  <IconTile icon={{ ios: 'bus', android: 'directions_bus', web: 'directions_bus' }} />
                }
                title={operator.name}
                subtitle={`${getProgram(operator.programId)?.name ?? ''} · ${operator.area}`}
                onPress={() => onPressOperator(operator)}
              />
            ))}
          </ListCard>
        </>
      )}

      {results.stops.length > 0 && (
        <>
          <SectionTitle>Halte</SectionTitle>
          <ListCard>
            {results.stops.map((stop) => (
              <ListRow
                key={stop.id}
                leading={
                  <IconTile icon={{ ios: 'mappin', android: 'location_on', web: 'location_on' }} />
                }
                title={stop.name}
                subtitle={routesAtStop(stop.id)
                  .map((route) => `${route.operator} ${route.corridor}`)
                  .join(' · ')}
                onPress={() => onPressStop(stop)}
              />
            ))}
          </ListCard>
        </>
      )}

      {results.routes.length > 0 && (
        <>
          <SectionTitle>Rute</SectionTitle>
          <ListCard>
            {results.routes.map((route) => (
              <ListRow
                key={route.id}
                leading={<CorridorBadge code={route.corridor} color={route.color} />}
                title={`${route.from} – ${route.to}`}
                subtitle={`${route.operator} · ${route.city} · ${route.program}`}
                onPress={() => onPressRoute(route)}
              />
            ))}
          </ListCard>
        </>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  spacer: {
    marginTop: 16,
  },
});
