import { Loader, Text } from '@gravity-ui/uikit';
import { useSearchQuery } from '../api';
import { UnitRow } from './UnitRow';

export function SearchResults({ query }: { query: string }) {
  const { data, isFetching, isError } = useSearchQuery(query);

  if (isFetching && !data) {
    return (
      <div className="centered">
        <Loader size="l" />
      </div>
    );
  }

  if (isError) {
    return <Text color="danger">Ошибка поиска</Text>;
  }

  if (!data?.length) {
    return <Text color="secondary">Ничего не найдено по запросу «{query}»</Text>;
  }

  return (
    <div>
      <Text variant="subheader-2">Найдено: {data.length}</Text>
      <div className="search-results__list">
        {data.map((unit) => (
          <UnitRow key={unit.id} unit={unit} showCode />
        ))}
      </div>
    </div>
  );
}
