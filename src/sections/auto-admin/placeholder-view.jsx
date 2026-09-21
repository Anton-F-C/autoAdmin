'use client';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

export function AutoAdminPlaceholderView({ title, description, note }) {
  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4">{title}</Typography>
          <Typography color="text.secondary">{description}</Typography>
        </Stack>
        <Alert severity="info" variant="outlined">
          {note ?? 'UI scaffold ready. Live data integration will be connected in the next milestone.'}
        </Alert>
      </Stack>
    </DashboardContent>
  );
}
