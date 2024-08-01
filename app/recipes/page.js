import Sidebar from "@/components/Sidebar";
import { Box, Typography } from "@mui/material";

export default function Recipes() {
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
                height: { xs: '100%', sm: '100%'},
                width: '100%',
                '& .actions': {
                color: 'text.secondary',
                },
                '& .textPrimary': {
                color: 'text.primary',
                },
                overflow: 'auto',
                p: '1.5rem 3rem',
            }}
            flex={1}
            display="flex"
            flexDirection="column"
        >
          <Typography
              sx={{
                  color: 'primary.dark'
              }}
          >
              AI Recipes
          </Typography>
        </Box>
    </Box>
  )
}
