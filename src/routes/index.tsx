import { createRoute } from '@tanstack/react-router';
import { Route as RootRoute } from './__root';
import { Box, Typography, Paper } from '@mui/material';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: () => (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Список аукционов
      </Typography>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Здесь будет реализован список аукционов с фильтрацией и пагинацией
        </Typography>
      </Paper>
    </Box>
  ),
});
