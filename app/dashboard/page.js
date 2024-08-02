import Sidebar from "@/components/Sidebar";
import { Box, Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        bgcolor: 'secondary.main',
      }}
      display={'flex'}
      flexDirection={{ xs: 'column-reverse', sm: 'column-reverse', md: 'row'}}
    >
      <Sidebar />
      <Box
        sx={{
          p: '1.5rem 3rem',
          overflow: 'scroll',
          flexGrow: 1,
        }}
      >
        <Typography
            sx={{
                color: 'primary.dark'
            }}
        >
            Dashboard
        </Typography>
        {/* to-do: total items */}
        {/* to-do: expiring soon list */}
        {/* to-do: visual data of item distribution between categories */}
      </Box>
    </Box>
  )
}
