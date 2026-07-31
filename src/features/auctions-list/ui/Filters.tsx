import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Grid,
  IconButton,
  Collapse,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Autocomplete,
  type SelectChangeEvent,
  Stack,
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { cities } from '@mocks/data/cities';
import type { SearchParams } from '../model/searchSchema';
import type { StatusValues, TypeValues } from '@/shared/types/api/auctions';

export type SearchFilters = Omit<SearchParams, 'page' | 'limit'>;

interface FiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
  onResetFilters: () => void;
  filters: SearchFilters;
}

const STATUS_OPTIONS: Array<{ value: StatusValues; label: string }> = [
  { value: 'Active', label: 'Активный' },
  { value: 'Completed', label: 'Завершён' },
  { value: 'Cancelled', label: 'Отменён' },
];

const AUCTION_TYPE_OPTIONS: Array<{ value: TypeValues; label: string }> = [
  { value: 'Request', label: 'Запрос' },
  { value: 'Up', label: 'Повышение' },
  { value: 'Down', label: 'Понижение' },
  { value: 'FixPrice', label: 'Фиксированная цена' },
];

export const Filters: React.FC<FiltersProps> = ({
  onFilterChange,
  onResetFilters,
  filters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTextChange =
    (field: keyof SearchFilters) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      onFilterChange({ ...filters, [field]: value || undefined });
    };

  const handleSelectChange =
    (field: keyof SearchFilters) => (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      onFilterChange({ ...filters, [field]: value || undefined });
    };

  const handleSwitchChange =
    (field: keyof SearchFilters) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.checked;
      onFilterChange({ ...filters, [field]: value });
    };

  const handleStatusesChange = (
    _event: React.SyntheticEvent,
    values: StatusValues[],
  ) => {
    onFilterChange({ ...filters, statuses: values });
  };

  const handleCityChange =
    (field: keyof SearchFilters) =>
    (_: React.SyntheticEvent, value: string | null) => {
      onFilterChange({ ...filters, [field]: value || undefined });
    };

  const activeFiltersCount = Object.values(filters).filter(
    (value) =>
      value !== undefined &&
      value !== '' &&
      value !== null &&
      !(Array.isArray(value) && value.length === 0),
  ).length;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack spacing={1}>
        <Stack spacing={1}>
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
          <Button variant="text" size="small" onClick={onResetFilters}>
            Очистить все
          </Button>
        )}
      </Stack>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Номер заявки"
              variant="outlined"
              size="small"
              value={filters.cargo_num || ''}
              onChange={handleTextChange('cargo_num')}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Статус</InputLabel>
              <Select
                value={filters.status || ''}
                onChange={handleSelectChange('status')}
                label="Статус"
              >
                <MenuItem value="">Все</MenuItem>
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Autocomplete
              multiple
              size="small"
              options={STATUS_OPTIONS.map((s) => s.value)}
              getOptionLabel={(option) =>
                STATUS_OPTIONS.find((s) => s.value === option)?.label || option
              }
              value={filters.statuses}
              onChange={handleStatusesChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Статусы (множественный)"
                  placeholder="Выберите статусы"
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Тип аукциона</InputLabel>
              <Select
                value={filters.auc_type || ''}
                onChange={handleSelectChange('auc_type')}
                label="Тип аукциона"
              >
                <MenuItem value="">Все</MenuItem>
                {AUCTION_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Autocomplete
              size="small"
              options={cities}
              value={filters.load_city || null}
              onChange={handleCityChange('load_city')}
              renderInput={(params) => (
                <TextField {...params} label="Город погрузки" />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Autocomplete
              size="small"
              options={cities}
              value={filters.unload_city || null}
              onChange={handleCityChange('unload_city')}
              renderInput={(params) => (
                <TextField {...params} label="Город выгрузки" />
              )}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <TextField
              fullWidth
              label="Дата от"
              type="date"
              variant="outlined"
              size="small"
              value={filters.date_from || ''}
              onChange={handleTextChange('date_from')}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <TextField
              fullWidth
              label="Дата до"
              type="date"
              variant="outlined"
              size="small"
              value={filters.date_to || ''}
              onChange={handleTextChange('date_to')}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <TextField
              fullWidth
              label="Цена от (₽)"
              variant="outlined"
              size="small"
              type="number"
              value={filters.price_from || ''}
              onChange={handleTextChange('price_from')}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <TextField
              fullWidth
              label="Цена до (₽)"
              variant="outlined"
              size="small"
              type="number"
              value={filters.price_to || ''}
              onChange={handleTextChange('price_to')}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.is_available || false}
                    onChange={handleSwitchChange('is_available')}
                  />
                }
                label="Только доступные"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.is_bidder || false}
                    onChange={handleSwitchChange('is_bidder')}
                  />
                }
                label="Где я участвую"
              />
            </Stack>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};
