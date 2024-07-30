'use client'
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null;
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        bgcolor: 'secondary.main',
      }}

    >
      {/* to-do: sidebar */}
      {/* <Sidebar /> */}
      {/* to-do: main content */}
    </Box>
  );
}
