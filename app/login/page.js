'use client'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Divider, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import GoogleIcon from '@mui/icons-material/Google';
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ showPassword, setShowPassword ] = useState(false);
    const router = useRouter();

    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result.error) {
            console.error(result.error);
        } else {
            router.push('/dashboard');
        }
    }

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
                bgcolor: '#ffffff',
                p: '1.5rem 3rem',
            }}
            flex={1}
            display="flex"
            flexDirection="column"
            gap={5}
        >
            <Typography
                sx={{
                    color: 'primary.dark',
                    fontWeight: '600',
                    fontSize: '1.5rem'
                }}
                textAlign='center'
            >
                Login
            </Typography>
            <Box
                sx={{
                    width: '100%',
                }}
                display='flex'
                flexDirection='column'
                gap={3}
                onSubmit={handleSubmit}
                component='form'
            >
                <TextField
                    id='outlined-required'
                    label='Email'
                    type='email'
                    placeholder='moo@gmail.com'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{
                        width: '100%',
                        input: {
                            color: 'primary.dark',
                        },
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    id='outlined-required'
                    label='Password'
                    type={showPassword ? 'text' : 'password'}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                <Box
                                    sx={{
                                        '&:hover': {
                                            cursor: 'pointer',
                                            backgroundColor: 'secondary.main',
                                            borderRadius: '50%',
                                        },
                                        aspectRatio: 1,
                                        width: 40,
                                    }}
                                    display='flex'
                                    justifyContent='center'
                                    alignItems='center'
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </Box>
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        width: '100%',
                        input: {
                            color: 'primary.dark',
                        },
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    sx={{
                        borderRadius: '18px',
                        bgcolor: 'primary.main',
                        paddingLeft: '1.5rem',
                        paddingRight: '1.5rem',
                        color: 'secondary.main',
                        '&:hover': {
                            bgcolor: 'primary.dark'
                        },
                    }}
                >
                    Login
                </Button>

                <Grid
                    container
                    alignItems='center'
                    spacing={2}
                >
                    <Grid item xs>
                        <Divider />
                    </Grid>
                    <Grid item>
                        <Typography
                            sx={{
                                fontSize: 14,
                                color: 'primary.dark',
                            }}
                        >or sign in with</Typography>
                    </Grid>
                    <Grid item xs>
                        <Divider />
                    </Grid>
                </Grid>

                <Button
                    sx={{
                        borderRadius: '18px',
                        bgcolor: '#ffffff',
                        paddingLeft: '1.5rem',
                        paddingRight: '1.5rem',
                        border: '1px solid',
                        '&:hover': {
                            bgcolor: 'secondary.main',
                        }
                    }}
                    startIcon={<GoogleIcon />}
                    onClick={() => signIn('google')}
                >
                    Google
                </Button>
            </Box>

            <Box
                display='flex'
                gap={1}
            >
                <Typography
                    sx={{
                        color: 'primary.dark',
                    }}
                >
                    Don&apos;t have an account?
                </Typography>
                <Link
                    href={'/signup'}
                    style={{
                        textDecoration: 'none',
                    }}
                >
                    <Typography
                        sx={{
                            color: 'accent.main',
                            '&:hover': {
                                // color: 'primary.dark',
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        Sign up
                    </Typography>
                </Link>
            </Box>


        </Box>
  )
}
