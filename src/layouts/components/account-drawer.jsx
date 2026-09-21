'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AnimateBorder } from 'src/components/animate';

import { ROLES, ROLE_LABELS } from 'src/auth/roles';
import { useAuthContext } from 'src/auth/hooks';
import { useAdminTeam } from 'src/hooks/use-admin-team';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

export function AccountDrawer({ data = [], sx, ...other }) {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const { members } = useAdminTeam();

  const [open, setOpen] = React.useState(false);

  const renderAvatar = () => (
    <AnimateBorder
      sx={{ mb: 2, p: '6px', width: 96, height: 96, borderRadius: '50%' }}
      slotProps={{ primaryBorder: { size: 120, sx: { color: 'primary.main' } } }}
    >
      <Avatar src={user?.photoURL} alt={user?.displayName} sx={{ width: 1, height: 1 }}>
        {user?.displayName?.charAt(0).toUpperCase()}
      </Avatar>
    </AnimateBorder>
  );

  const visibleOptions = data.filter((option) => !option.ownerOnly || user?.role === ROLES.OWNER);

  return (
    <>
      <AccountButton
        onClick={() => setOpen(true)}
        photoURL={user?.photoURL}
        displayName={user?.displayName}
        sx={sx}
        {...other}
      />

      <Drawer
        aria-hidden={!open}
        open={open}
        onClose={() => setOpen(false)}
        anchor="right"
        slotProps={{ backdrop: { invisible: true }, paper: { sx: { width: 340 } } }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ top: 12, left: 12, zIndex: 9, position: 'absolute' }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Box sx={{ pt: 8, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            {renderAvatar()}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {user?.displayName}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>
              {user?.email}
            </Typography>

            <Typography variant="caption" sx={{ color: 'primary.main', mt: 0.75 }}>
              {ROLE_LABELS[user?.role] ?? user?.role}
            </Typography>
          </Box>

          <Box sx={{ px: 3, pt: 3 }}>
            <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">Admin team</Typography>
              <Link
                component={RouterLink}
                href={paths.dashboard.adminTeam}
                variant="caption"
                underline="hover"
                onClick={() => setOpen(false)}
              >
                View team
              </Link>
            </Box>

            <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
              {members.slice(0, 6).map((member) => (
                <Tooltip
                  key={member.user_id}
                  title={`${member.display_name} · ${member.online ? 'Online' : 'Offline'}`}
                >
                  <Badge
                    overlap="circular"
                    variant="dot"
                    color={member.online ? 'success' : 'default'}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <Avatar src={member.avatar_url} alt={member.display_name}>
                      {member.display_name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                </Tooltip>
              ))}
            </Box>
          </Box>

          <MenuList
            disablePadding
            sx={(theme) => ({
              mt: 3,
              py: 3,
              px: 2.5,
              borderTop: `dashed 1px ${theme.vars.palette.divider}`,
              borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
              '& li': { p: 0 },
            })}
          >
            {visibleOptions.map((option) => {
              const rootLabel = pathname.includes('/dashboard') ? 'Home' : 'Dashboard';
              const rootHref = paths.dashboard.root;

              return (
                <MenuItem key={option.label}>
                  <Link
                    component={RouterLink}
                    href={option.label === 'Home' ? rootHref : option.href}
                    color="inherit"
                    underline="none"
                    onClick={() => setOpen(false)}
                    sx={{
                      p: 1,
                      width: 1,
                      display: 'flex',
                      typography: 'body2',
                      alignItems: 'center',
                      color: 'text.secondary',
                      '& svg': { width: 24, height: 24 },
                      '&:hover': { color: 'text.primary' },
                    }}
                  >
                    {option.icon}
                    <Box component="span" sx={{ ml: 2 }}>
                      {option.label === 'Home' ? rootLabel : option.label}
                    </Box>
                  </Link>
                </MenuItem>
              );
            })}
          </MenuList>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={() => setOpen(false)} />
        </Box>
      </Drawer>
    </>
  );
}
