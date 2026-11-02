import { View } from 'react-native';

import { CorridorBadge } from '@/components/corridor-badge';
import { EmptyNote, ListCard, ListRow, SectionTitle } from '@/components/list';
import { PanelHeader } from '@/components/lacak/panel-header';
import { getProgram, getRoute, type Operator, type Route } from '@/data/transit';

type OperatorPanelProps = {
  operator: Operator;
  onBack?: () => void;
  onPressRoute: (route: Route) => void;
};

export function OperatorPanel({ operator, onBack, onPressRoute }: OperatorPanelProps) {
  const program = getProgram(operator.programId);
  const routes = operator.routeIds.map(getRoute).filter((route): route is Route => route !== undefined);

  return (
    <View>
      <PanelHeader
        title={operator.name}
        subtitle={[program?.name, operator.unit, operator.area].filter(Boolean).join(' · ')}
        onBack={onBack}
      />

      <SectionTitle>
        {operator.routeCount ? `${operator.routeCount} rute` : 'Rute'}
      </SectionTitle>
      {routes.length === 0 ? (
        <EmptyNote
          title="Data rute belum ada di prototipe"
          body="Di aplikasi asli, daftar rute operator ini diambil dari data rute Ditjen Hubdat. Coba Trans Semarang, Trans Jogja, atau Suroboyo Bus untuk melihat contohnya."
        />
      ) : (
        <ListCard>
          {routes.map((route) => (
            <ListRow
              key={route.id}
              leading={<CorridorBadge code={route.corridor} color={route.color} />}
              title={`${route.from} – ${route.to}`}
              subtitle={`Beroperasi ${route.hours}`}
              onPress={() => onPressRoute(route)}
            />
          ))}
        </ListCard>
      )}
    </View>
  );
}
