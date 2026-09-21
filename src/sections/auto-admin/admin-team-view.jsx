'use client';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { ROLE_LABELS } from 'src/auth/roles';
import { useAdminTeam } from 'src/hooks/use-admin-team';

// ----------------------------------------------------------------------

function formatLastSeen(value) {
  if (!value) return 'No activity recorded yet';
  const date = new Date(value);
  return `Last active ${date.toLocaleString()}`;
}

export function AdminTeamView() {
  const { members, loading, error } = useAdminTeam();

  return (
    <Container maxWidth="xl">
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h4">Admin team</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          See who has access to Auto Admin and who is currently active in the dashboard.
        </Typography>
      </Stack>

      {error && <Alert severity="error">Unable to load the admin team: {error.message}</Alert>}

      {loading ? (
        <Stack alignItems="center" sx={{ py: 8 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <Grid container spacing={3}>
          {members.map((member) => (
            <Grid key={member.user_id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: 1 }}>
                <CardContent>
                  <Stack spacing={2.5} alignItems="center" sx={{ textAlign: 'center', py: 2 }}>
                    <Avatar
                      src={member.avatar_url}
                      alt={member.display_name}
                      sx={{ width: 88, height: 88, typography: 'h4' }}
                    >
                      {member.display_name?.charAt(0).toUpperCase()}
                    </Avatar>

                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h6">{member.display_name}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {member.email}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                      <Chip label={ROLE_LABELS[member.role] ?? member.role} color="primary" variant="soft" />
                      <Chip
                        label={member.online ? 'Online' : 'Offline'}
                        color={member.online ? 'success' : 'default'}
                        variant="soft"
                      />
                    </Stack>

                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {member.online ? 'Active now' : formatLastSeen(member.last_seen_at)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
