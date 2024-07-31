import { CameraAltRounded } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { forwardRef } from "react";
import { Camera } from "react-camera-pro";

const CameraComponent = forwardRef(function CameraComponent({ setOpenCamera, camera, ratio, handleCapture }, ref) {
  return (
    <Box
        ref={ref}
        sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            bgcolor: 'background.paper',
            p: 2,
            boxShadow: 24,
            '@media (max-width: 600px)': {
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                p: 1,
            },
        }}
        display='flex'
        flexDirection='column'
        tabIndex={-1}
    >
        <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            sx={{
                paddingBottom: '1rem',
            }}
        >
            <Typography id="camera-modal-title">
                Scan Item
            </Typography>
            <Button
                variant="outlined"
                color="secondary"
                sx={{
                    border: '1px solid',
                    borderColor: 'primary.main',
                    borderRadius: '18px',
                    color: 'primary.main',
                    '&:hover': {
                        color: 'secondary.main',
                        bgcolor: 'primary.main',
                        border: '1px solid',
                        borderColor: 'primary.main'
                    }
                }}
                onClick={() => setOpenCamera(false)}
            >
                Cancel
            </Button>
        </Box>
        <Box
            flex={1}
            sx={{
                overflow: 'hidden',
                borderRadius: '18px',
                bgcolor: 'secondary.main',
                position: 'relative',
            }}
            overflow={'hidden'}
        >
            <Camera ref={camera} aspectRatio={ratio} />
            <Box
                display="flex"
                justifyContent="space-between"
                alignSelf="flexEnd"
                mt={2}
                sx={{
                    zIndex: 2,
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
                gap={2}
            >
                <Box
                    sx={{
                        border: '3px solid',
                        borderColor: 'secondary.main',
                        borderRadius: '50%',
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCapture}
                        sx={{
                            borderRadius: '50%',
                            aspectRatio: 1,
                        }}
                    >
                        <CameraAltRounded />
                    </Button>
                </Box>
            </Box>
        </Box>
    </Box>
  )
})

export default CameraComponent;
