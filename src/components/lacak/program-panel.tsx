import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { EmptyNote, ListCard, ListRow } from '@/components/list';
import { PanelHeader } from '@/components/lacak/panel-header';
import { Brand, Gutter, PillInput, Spacing } from '@/constants/theme';
import { type Operator, operatorsInProgram, type Program } from '@/data/transit';

type ProgramPanelProps = {
  program: Program;
  onBack?: () => void;
  onPressOperator: (operator: Operator) => void;
};

function operatorSubtitle(operator: Operator) {
  const parts = [operator.unit ?? operator.area];
  if (operator.routeCount) parts.push(`${operator.routeCount} rute`);
  return parts.join(' · ');
}

/** v1 lists per program (23–34), kept as a menu with one readable list and a filter. */
export function ProgramPanel({ program, onBack, onPressOperator }: ProgramPanelProps) {
  const [filter, setFilter] = useState('');
  const all = operatorsInProgram(program.id);
  const q = filter.trim().toLowerCase();
  const shown = q
    ? all.filter((operator) => `${operator.name} ${operator.area}`.toLowerCase().includes(q))
    : all;

  return (
    <View>
      <PanelHeader title={program.name} subtitle={program.description} onBack={onBack} />

      {all.length > 6 && (
        <View style={styles.filter}>
          <SymbolView
            name={{ ios: 'line.3.horizontal.decrease', android: 'filter_list', web: 'filter_list' }}
            size={16}
            tintColor={Brand.textSecondary}
          />
          <TextInput
            value={filter}
            onChangeText={setFilter}
            placeholder={`Saring ${all.length} pilihan di ${program.name}`}
            placeholderTextColor={Brand.textSecondary}
            style={styles.filterInput}
            autoCorrect={false}
            accessibilityLabel={`Saring daftar ${program.name}`}
          />
        </View>
      )}

      {shown.length === 0 ? (
        <EmptyNote
          title={`Tidak ada yang cocok dengan “${filter.trim()}”`}
          body="Coba nama kota, provinsi, atau operator."
        />
      ) : (
        <ListCard>
          {shown.map((operator) => (
            <ListRow
              key={operator.id}
              title={operator.name}
              subtitle={operatorSubtitle(operator)}
              onPress={() => onPressOperator(operator)}
            />
          ))}
        </ListCard>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filter: {
    ...PillInput,
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    marginHorizontal: Gutter,
    marginBottom: Spacing.two + Spacing.one,
  },
  filterInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    fontWeight: '500',
    color: Brand.text,
  },
});
