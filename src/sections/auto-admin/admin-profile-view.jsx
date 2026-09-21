'use client';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { ROLE_LABELS } from 'src/auth/roles';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function AdminProfileView() {
  const { user } = useAuthContext();

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mb: 4 }}>
        Profile
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
            <Avatar src={user?.photoURL} alt={user?.displayName} sx={{ width: 112, height: 112, typography: 'h3' }}>
              {user?.displayName?.charAt(0).toUpperCase()}
            </Avatar>

            <Stack spacing={0.75} alignItems="center">
              <Typography variant="h5">{user?.displayName}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user?.email}
              </Typography>
              <Chip label={ROLE_LABELS[user?.role] ?? user?.role} color="primary" variant="soft" />
            </Stack>

            <Typography variant="body2" sx={{ maxWidth: 520, textAlign: 'center', color: 'text.secondary' }}>
              Auto Admin accounts are provisioned by the Owner. Passwords are managed by Supabase Auth; role and account access are controlled separately through the protected admin profile.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
