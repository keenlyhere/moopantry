'use client';
import { Poppins } from "next/font/google";
import { createTheme } from '@mui/material/styles';

export const poppins = Poppins({
	weight: ["400", "600"],
	subsets: ["latin"],
});

const theme = createTheme({
  typography: {
    fontFamily: poppins.style.fontFamily,
  },
  palette: {
    primary: {
        main: '#008080',
        dark: '#2F4F4F',
    },
    secondary: {
        main: '#F0F0F0',
    },
    accent: {
        main: '#FF6F61',
    },
  }
});

export default theme;
