import React, { useState } from 'react';
import {
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  IconButton,
  Collapse,
  Chip,
  Stack,
} from '@mui/material';
import { FilterList } from '@mui/icons-material';

interface FiltersProps {
  onFilterChange: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>;
}

export const Filters: React.FC<FiltersProps> = ({
  onFilterChange,
  initialFilters = {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    cargo_num: initialFilters.cargo_num || '',
    load_city: initialFilters.load_city || '',
    unload_city: initialFilters.unload_city || '',
    price_from: initialFilters.price_from || '',
    price_to: initialFilters.price_to || '',
  });

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const newFilters = { ...filters, [field]: value };
      setFilters(newFilters);
      onFilterChange(newFilters);
    };

  const handleClear = () => {
    const emptyFilters = {
      cargo_num: '',
      load_city: '',
      unload_city: '',
      price_from: '',
      price_to: '',
    };
    setFilters(emptyFilters);
    onFilterChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack>
        <Stack>
          <IconButton onClick={() => setIsExpanded(!isExpanded)} size="small">
            <FilterList />
          </IconButton>
          <Button
            variant="text"
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Скрыть фильтры' : 'Показать фильтры'}
          </Button>
          {!isExpanded && activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} активных`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>
        {activeFiltersCount > 0 && (
          <Button variant="text" size="small" onClick={handleClear}>
            Очистить все
          </Button>
        )}
      </Stack>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Номер заявки"
              variant="outlined"
              size="small"
              value={filters.cargo_num}
              onChange={handleChange('cargo_num')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Город погрузки"
              variant="outlined"
              size="small"
              value={filters.load_city}
              onChange={handleChange('load_city')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Город выгрузки"
              variant="outlined"
              size="small"
              value={filters.unload_city}
              onChange={handleChange('unload_city')}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField
              fullWidth
              label="Цена от (₽)"
              variant="outlined"
              size="small"
              type="number"
              value={filters.price_from}
              onChange={handleChange('price_from')}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField
              fullWidth
              label="Цена до (₽)"
              variant="outlined"
              size="small"
              type="number"
              value={filters.price_to}
              onChange={handleChange('price_to')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => onFilterChange(filters)}
              sx={{ height: '100%' }}
            >
              Применить
            </Button>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};
