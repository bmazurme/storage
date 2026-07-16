import { Magnifier, Moon, Sun } from '@gravity-ui/icons';
import { Button, Icon, Text, TextInput } from '@gravity-ui/uikit';
import type { Theme } from '../store/themeSlice';
import { useSearch } from '../hooks/useSearch';

type HeaderProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const { query, setQuery } = useSearch();

  return (
    <header className="app__header">
      <Text variant="header-1" className="app__title">
        📦 Складской учёт
      </Text>
      <TextInput
        className="app__search"
        size="l"
        placeholder="Поиск по названию, описанию или коду…"
        value={query}
        onUpdate={setQuery}
        hasClear
        startContent={<Icon data={Magnifier} className="app__search-icon" />}
      />
      <Button
        view="outlined"
        size="l"
        onClick={onToggleTheme}
        title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
      >
        <Icon data={theme === 'light' ? Moon : Sun} />
      </Button>
    </header>
  );
}
