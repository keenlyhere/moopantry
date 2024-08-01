import { Box, Typography } from "@mui/material";

export default function Dashboard() {
  return (
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
      }}
      flex={1}
      display="flex"
      flexDirection="column"
    >
        {/* to-do: dashboard content */}
      <Typography
          sx={{
              color: 'primary.dark'
          }}
      >
          Dashboard
      </Typography>
    </Box>
  )
}
