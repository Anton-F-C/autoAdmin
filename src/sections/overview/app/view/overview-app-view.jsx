'use client';

import useSWR from 'swr';

import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';

import { _appAuthors, _appInvoices } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AppTopAuthors } from '../app-top-authors';
import { AppNewInvoices } from '../app-new-invoices';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppCurrentDownload } from '../app-current-download';

// ----------------------------------------------------------------------

const fetcher = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const theme = useTheme();

  const currentYear = String(new Date().getFullYear());

  const { data, error } = useSWR('/api/analytics/app-overview', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 15 * 60 * 1000,
  });

  const appMetrics = data?.appMetrics;

  const activeUsers = appMetrics?.activeUsers ?? {
    total: 0,
    apple: 0,
    google: 0,
    available: false,
  };

  const installed = appMetrics?.installed ?? {
    total: 0,
    apple: 0,
    google: 0,
    available: false,
  };

  const downloads = appMetrics?.downloads ?? {
    total: 0,
    apple: 0,
    google: 0,
    available: false,
  };

  if (error) {
    console.error('Failed to load dashboard overview:', error);
  }

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="Active users"
            percent={0}
            total={activeUsers.total}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [0, 0, 0, 0, 0, 0, 0, 0],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="Installed audience"
            percent={0}
            total={installed.total}
            chart={{
              colors: [theme.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [0, 0, 0, 0, 0, 0, 0, 0],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="Total downloads"
            percent={0}
            total={downloads.total}
            chart={{
              colors: [theme.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [0, 0, 0, 0, 0, 0, 0, 0],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppCurrentDownload
            title="Installed audience"
            subheader="iOS vs Android"
            chart={{
              series: [
                {
                  label: 'iOS',
                  value: installed.apple,
                },
                {
                  label: 'Android',
                  value: installed.google,
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AppAreaInstalled
            title="Revenue overview"
            subheader="Gross revenue vs refunds"
            chart={{
              years: [currentYear],
              series: [
                {
                  year: currentYear,
                  granularity: 'month',
                  categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ],
                  revenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  refunds: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <AppNewInvoices
            title="New Invoices"
            tableData={_appInvoices}
            headCells={[
              {
                id: 'id',
                label: 'Invoice ID',
              },
              {
                id: 'category',
                label: 'Category',
              },
              {
                id: 'price',
                label: 'Price',
              },
              {
                id: 'status',
                label: 'Status',
              },
              {
                id: '',
              },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppTopAuthors title="Top authors" list={_appAuthors} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
