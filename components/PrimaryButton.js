import { AddRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function PrimaryButton({ buttonText, onClick }) {
  return (
    <Button
        sx={{
            bgcolor: 'primary.main',
            color: 'secondary.main',
            borderRadius: '28px',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            '&:hover': {
                bgcolor: 'primary.dark'
            }
        }}
        startIcon={<AddRounded />}
        onClick={onClick}
    >
        {buttonText}
    </Button>
  )
}
