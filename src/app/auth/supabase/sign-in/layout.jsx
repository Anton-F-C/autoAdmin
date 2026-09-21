'use client';

import Box from '@mui/material/Box';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <GuestGuard>
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: { xs: 5, md: 8 },
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ width: 1, maxWidth: 560 }}>{children}</Box>
      </Box>
    </GuestGuard>
  );
}
