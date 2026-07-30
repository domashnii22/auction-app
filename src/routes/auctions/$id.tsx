import { createRoute } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { Route as RootRoute } from '../__root';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/auctions/$id',
  component: () => {
    const { id } = Route.useParams();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (
      _event: React.SyntheticEvent,
      newValue: number,
    ) => {
      setTabValue(newValue);
      // Навигация по вкладкам
      if (newValue === 0) {
        navigate({ to: `/auctions/${id}` });
      } else {
        navigate({ to: `/auctions/${id}/bets` });
      }
    };

    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Аукцион #{id}
        </Typography>

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="auction tabs"
            >
              <Tab label="Информация" />
              <Tab label="Ставки" />
              <Tab label="Сделать ставку" />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            <Outlet />
          </Box>
        </Paper>
      </Box>
    );
  },
});
