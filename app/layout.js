import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/styles/theme';
import { Box } from '@mui/material';
import Sidebar from '@/components/Sidebar';
import "./globals.css";
import { firebaseConfig } from '@/firebase';

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Box
              sx={{
                width: '100vw',
                height: '100vh',
                bgcolor: 'secondary.main',
              }}
              display={'flex'}
            >
              <Sidebar />
              <Box
                sx={{
                  p: 3,
                  overflow: 'auto'
                }}
              >
                { children }
              </Box>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
