'use client'
import { Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PrivateRoute({ children }) {

  const { data: session, status } = useSession();
  const router = useRouter();
  console.log('session:', session, status);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) router.push('/login');
  }, [ session, status, router])

  if (status === 'loading') {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: 'primary.main',
        }}
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <span className="loader"></span>
      </Box>
    )
  }

//   if (!session) {
//     router.push('/login');
//   }

  return (
      session && (
        children
      )
  )
}
