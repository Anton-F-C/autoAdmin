import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/global-config';
import { SvgColor } from 'src/components/svg-color';
import { ROLES } from 'src/auth/roles';

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  dashboard: icon('ic-dashboard'),
  analytics: icon('ic-analytics'),
  mechanics: icon('ic-user'),
  passengers: icon('ic-user'),
  requests: icon('ic-order'),
  finance: icon('ic-banking'),
  support: icon('ic-mail'),
  admin: icon('ic-file'),
  system: icon('ic-lock'),
};

const ALL = [ROLES.OWNER, ROLES.ADMIN, ROLES.MODERATOR];
const PRIVILEGED = [ROLES.OWNER, ROLES.ADMIN];
const OWNER_ONLY = [ROLES.OWNER];

export const navData = [
  {
    subheader: 'Overview',
    items: [
      { title: 'Home', path: paths.dashboard.overview.home, icon: ICONS.dashboard, allowedRoles: ALL },
      { title: 'Metrics', path: paths.dashboard.overview.metrics, icon: ICONS.analytics, allowedRoles: ALL },
    ],
  },
  {
    subheader: 'Operations',
    items: [
      {
        title: 'Mechanics', path: paths.dashboard.mechanics.root, icon: ICONS.mechanics, allowedRoles: ALL,
        children: [
          { title: 'Overview', path: paths.dashboard.mechanics.overview },
          { title: 'Live map', path: paths.dashboard.mechanics.map },
          { title: 'Roster', path: paths.dashboard.mechanics.roster },
          { title: 'Team chat', path: paths.dashboard.mechanics.chat },
        ],
      },
      {
        title: 'Passengers', path: paths.dashboard.passengers.root, icon: ICONS.passengers, allowedRoles: ALL,
        children: [
          { title: 'Overview', path: paths.dashboard.passengers.overview },
          { title: 'Roster', path: paths.dashboard.passengers.roster },
          { title: 'Chat', path: paths.dashboard.passengers.chat },
        ],
      },
      {
        title: 'Service requests', path: paths.dashboard.serviceRequests.root, icon: ICONS.requests, allowedRoles: ALL,
        children: [
          { title: 'Overview', path: paths.dashboard.serviceRequests.overview },
          { title: 'History', path: paths.dashboard.serviceRequests.history },
          { title: 'Services', path: paths.dashboard.serviceRequests.services },
        ],
      },
    ],
  },
  {
    subheader: 'Finance',
    items: [
      {
        title: 'Finance', path: paths.dashboard.finance.root, icon: ICONS.finance, allowedRoles: PRIVILEGED,
        children: [
          { title: 'Overview', path: paths.dashboard.finance.overview },
          { title: 'Transactions', path: paths.dashboard.finance.transactions },
          { title: 'Mechanic earnings', path: paths.dashboard.finance.mechanicEarnings },
          { title: 'Payouts', path: paths.dashboard.finance.payouts },
          { title: 'Refunds', path: paths.dashboard.finance.refunds },
          { title: 'Invoices', path: paths.dashboard.finance.invoices },
        ],
      },
    ],
  },
  {
    subheader: 'Support',
    items: [
      {
        title: 'Support', path: paths.dashboard.support.tickets, icon: ICONS.support, allowedRoles: ALL,
        children: [
          { title: 'Tickets', path: paths.dashboard.support.tickets },
          { title: 'Emails', path: paths.dashboard.support.emails },
        ],
      },
    ],
  },
  {
    subheader: 'Administration',
    items: [
      {
        title: 'Administration', path: paths.dashboard.administration.contracts, icon: ICONS.admin, allowedRoles: ALL,
        children: [
          { title: 'Contracts', path: paths.dashboard.administration.contracts },
          { title: 'Archive', path: paths.dashboard.administration.archive },
        ],
      },
      {
        title: 'System', path: paths.dashboard.system.integrations, icon: ICONS.system, allowedRoles: OWNER_ONLY,
        children: [
          { title: 'Integrations', path: paths.dashboard.system.integrations },
          { title: 'Users & roles', path: paths.dashboard.system.usersRoles },
          { title: 'Audit logs', path: paths.dashboard.system.auditLogs },
          { title: 'Security', path: paths.dashboard.system.security },
        ],
      },
    ],
  },
];
