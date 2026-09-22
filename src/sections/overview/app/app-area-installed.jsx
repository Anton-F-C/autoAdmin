'use client';

import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import ToggleButton from '@mui/material/ToggleButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { fCurrency } from 'src/utils/format-number';

import { Chart, useChart, ChartSelect } from 'src/components/chart';

// ----------------------------------------------------------------------

const GRANULARITIES = ['Hour', 'Day', 'Week', 'Month', 'Year'];

const HOURS = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`);

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ----------------------------------------------------------------------

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
}

// ----------------------------------------------------------------------

function getWeekRanges(year) {
  const today = new Date();
  const selectedYear = Number(year);

  const start =
    selectedYear === today.getFullYear()
      ? new Date(today.getFullYear(), today.getMonth(), today.getDate())
      : new Date(selectedYear, 0, 1);

  const endOfYear = new Date(selectedYear, 11, 31);

  const ranges = [];

  let current = new Date(start);

  while (current <= endOfYear) {
    const rangeStart = new Date(current);

    const rangeEnd = new Date(current);
    rangeEnd.setDate(rangeEnd.getDate() + 6);

    if (rangeEnd > endOfYear) {
      rangeEnd.setTime(endOfYear.getTime());
    }

    ranges.push(`${formatDate(rangeStart)} – ${formatDate(rangeEnd)}`);

    current.setDate(current.getDate() + 7);
  }

  return ranges;
}

// ----------------------------------------------------------------------

function getDefaultCategories(granularity, selectedYear) {
  const currentYear = new Date().getFullYear();

  switch (granularity) {
    case 'Hour':
      return HOURS;

    case 'Day':
      return DAYS;

    case 'Week':
      return getWeekRanges(selectedYear);

    case 'Month':
      return MONTHS;

    case 'Year':
      return Array.from(
        {
          length: Math.max(currentYear - 2026 + 1, 1),
        },
        (_, index) => String(2026 + index)
      );

    default:
      return MONTHS;
  }
}

// ----------------------------------------------------------------------

export function AppAreaInstalled({ title, subheader, chart, sx, ...other }) {
  const currentYear = String(new Date().getFullYear());

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [granularity, setGranularity] = useState('Month');

  const [showRevenue, setShowRevenue] = useState(true);
  const [showRefunds, setShowRefunds] = useState(true);

  const timeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', []);

  const handleChangeYear = useCallback((newValue) => {
    setSelectedYear(newValue);
  }, []);

  const handleGranularity = useCallback((event, newValue) => {
    if (newValue) {
      setGranularity(newValue);
    }
  }, []);

  const selectedData = useMemo(
    () =>
      chart.series.find(
        (item) =>
          String(item.year) === String(selectedYear) &&
          item.granularity === granularity.toLowerCase()
      ) ?? null,
    [chart.series, selectedYear, granularity]
  );

  const categories = useMemo(() => {
    if (selectedData?.categories?.length) {
      return selectedData.categories;
    }

    return getDefaultCategories(granularity, selectedYear);
  }, [selectedData, granularity, selectedYear]);

  const revenueData = useMemo(() => {
    if (selectedData?.revenue?.length === categories.length) {
      return selectedData.revenue;
    }

    return categories.map(() => 0);
  }, [selectedData, categories]);

  const refundData = useMemo(() => {
    if (selectedData?.refunds?.length === categories.length) {
      return selectedData.refunds;
    }

    return categories.map(() => 0);
  }, [selectedData, categories]);

  const visibleSeries = useMemo(() => {
    const series = [];

    if (showRevenue) {
      series.push({
        name: 'Gross revenue',
        data: revenueData,
      });
    }

    if (showRefunds) {
      series.push({
        name: 'Refunds',
        data: refundData,
      });
    }

    return series;
  }, [showRevenue, showRefunds, revenueData, refundData]);

  const totalRevenue = revenueData.reduce((sum, value) => sum + value, 0);

  const totalRefunds = refundData.reduce((sum, value) => sum + value, 0);

  const chartOptions = useChart({
    ...chart.options,

    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },

    stroke: {
      width: 3,
      curve: 'smooth',
    },

    markers: {
      size: 4,
    },

    xaxis: {
      categories,
      labels: {
        rotate: granularity === 'Hour' || granularity === 'Week' ? -45 : 0,
        hideOverlappingLabels: true,
      },
    },

    yaxis: {
      labels: {
        formatter: (value) => fCurrency(value),
      },
    },

    tooltip: {
      x: {
        formatter: (_, options) => {
          const index = options?.dataPointIndex;

          return categories[index] ?? '';
        },
      },
      y: {
        formatter: (value) => fCurrency(value),
      },
    },

    legend: {
      show: false,
    },

    grid: {
      borderColor: 'divider',
    },
  });

  const years = chart.years ?? ['2026'];

  return (
    <Card sx={sx} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          granularity !== 'Year' ? (
            <ChartSelect options={years} value={selectedYear} onChange={handleChangeYear} />
          ) : null
        }
        sx={{ mb: 2 }}
      />

      <Stack spacing={2} sx={{ px: 3 }}>
        <ToggleButtonGroup exclusive size="small" value={granularity} onChange={handleGranularity}>
          {GRANULARITIES.map((item) => (
            <ToggleButton key={item} value={item}>
              {item}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={4}>
            <Stack>
              <Typography variant="subtitle1">Gross revenue</Typography>

              <Typography variant="h5">{fCurrency(totalRevenue)}</Typography>
            </Stack>

            <Stack>
              <Typography variant="subtitle1">Refunds</Typography>

              <Typography variant="h5">{fCurrency(totalRefunds)}</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={showRevenue}
                  onChange={(event) => setShowRevenue(event.target.checked)}
                />
              }
              label="Revenue"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={showRefunds}
                  onChange={(event) => setShowRefunds(event.target.checked)}
                />
              }
              label="Refunds"
            />
          </Stack>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          Times shown in {timeZone}
        </Typography>
      </Stack>

      <Chart
        key={`${selectedYear}-${granularity}`}
        type="line"
        series={visibleSeries}
        options={chartOptions}
        slotProps={{
          loading: {
            p: 2.5,
          },
        }}
        sx={{
          pl: 1,
          py: 2.5,
          pr: 2.5,
          height: 320,
        }}
      />
    </Card>
  );
}
