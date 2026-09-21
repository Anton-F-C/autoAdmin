'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { signInWithPassword } from '../../context/supabase';

// ----------------------------------------------------------------------

export const SignInSchema = z.object({
  email: schemaUtils.email(),
  password: z
    .string()
    .min(1, { error: 'Password is required!' })
    .min(6, { error: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function SupabaseSignInView() {
  const router = useRouter();
  const showPassword = useBoolean();
  const { checkUserSession } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState(null);

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage(null);

      await signInWithPassword({
        email: data.email.trim(),
        password: data.password,
      });

      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage(getErrorMessage(error));
    }
  });

  return (
    <Box
      sx={{
        width: 1,
        mx: 'auto',
        p: { xs: 0, sm: 2 },
      }}
    >
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box
          aria-label="FitaFaal"
          sx={{
            mb: 2.5,
            display: 'inline-flex',
            alignItems: 'center',
            fontWeight: 800,
            fontSize: { xs: 36, sm: 42 },
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          <Box component="span" sx={{ color: '#0B4A84' }}>
            FITA
          </Box>

          <Box component="span" sx={{ color: '#F04444' }}>
            FAAL
          </Box>
        </Box>

        <Typography variant="h4" sx={{ mb: 1 }}>
          Sign in
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Auto Admin · Faal Autos
        </Typography>
      </Box>

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ gap: 2.5, display: 'flex', flexDirection: 'column' }}>
          <Field.Text
            name="email"
            label="Email"
            placeholder="Enter email"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { borderRadius: 999 },
              },
            }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Field.Text
              name="password"
              label="Password"
              placeholder="Enter password"
              type={showPassword.value ? 'text' : 'password'}
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  sx: { borderRadius: 999 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={showPassword.onToggle}
                        edge="end"
                        aria-label="Show password"
                      >
                        <Iconify
                          icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Link
              component={RouterLink}
              href={paths.auth.supabase.resetPassword}
              variant="body2"
              color="primary"
              sx={{ alignSelf: 'flex-end', fontWeight: 600 }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Sign in..."
            sx={{
              mt: 0.5,
              py: 1.45,
              borderRadius: 999,
              bgcolor: '#062E57',
              '&:hover': { bgcolor: '#042547' },
            }}
          >
            Sign in
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
