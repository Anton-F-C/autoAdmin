import { paths } from 'src/routes/paths';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const _account = [
  { label: 'Home', href: paths.dashboard.root, icon: <Iconify icon="solar:home-angle-bold-duotone" /> },
  {
    label: 'Profile',
    href: paths.dashboard.adminProfile,
    icon: <Iconify icon="custom:profile-duotone" />,
  },
  {
    label: 'Admin team',
    href: paths.dashboard.adminTeam,
    icon: <Iconify icon="solar:users-group-rounded-bold-duotone" />,
  },
];
