'use client'
import { BottomNavigation, BottomNavigationAction, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from "@mui/material";
import Link from "next/link";
import DashboardIcon from '@mui/icons-material/Dashboard';
import KitchenIcon from '@mui/icons-material/Kitchen';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import { usePathname } from "next/navigation";
import { Logout } from "@mui/icons-material";
import { signOut } from "next-auth/react";

export default function Sidebar() {
    const pathname = usePathname();
    const isMobile = useMediaQuery('(max-width:900px)');

    const SidebarContent = () => (
        <Box
            sx={{
                width: 250,
                height: '100vh',
                bgcolor: '#ffffff',
                p: '1rem',
            }}
            display={"flex"}
            flexDirection={"column"}
        >
            {/* to-do: logo */}
            <Typography
                sx={{
                    color: 'primary.main',
                    fontSize: '32px',
                    fontWeight: '600',
                    paddingBottom: '1rem',
                }}
                alignSelf={"center"}
            >
                moopantry
            </Typography>

            <List>
                <ListItem disablePadding>
                    <Link href={'/'} style={{ textDecoration: 'none', width: '100%' }}>
                        <ListItemButton
                            sx={{
                                borderRadius: '8px',
                                '&& .Mui-selected, && .MuiListItemButton-root:hover': {
                                    bgcolor: 'secondary.main',
                                }
                            }}
                            selected={ pathname === '/' }
                        >
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Dashboard"
                                sx={{
                                    color: 'primary.dark',
                                }}
                            />
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem disablePadding>
                    <Link href={'/pantry'} style={{ textDecoration: 'none', width: '100%' }}>
                        <ListItemButton
                            sx={{
                                borderRadius: '8px',
                                '&& .Mui-selected, && .MuiListItemButton-root:hover': {
                                    bgcolor: 'palette.secondary',
                                }
                            }}
                            selected={ pathname === '/pantry'}
                        >
                            <ListItemIcon>
                                <KitchenIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Pantry"
                                sx={{
                                    color: 'primary.dark',
                                }}
                            />
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem disablePadding>
                    <Link href={'/recipes'} style={{ textDecoration: 'none', width: '100%' }}>
                        <ListItemButton
                            sx={{
                                borderRadius: '8px',
                                '&& .Mui-selected, && .MuiListItemButton-root:hover': {
                                    bgcolor: 'palette.secondary',
                                }
                            }}
                            selected={ pathname === '/recipes'}
                        >
                            <ListItemIcon>
                                <MenuBookIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="AI Recipes"
                                sx={{
                                    color: 'primary.dark',
                                }}
                            />
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem disablePadding>
                    <Link href={'/account'} style={{ textDecoration: 'none', width: '100%' }}>
                        <ListItemButton
                            sx={{
                                borderRadius: '8px',
                                '&& .Mui-selected': {
                                    bgcolor: '#f0f0f0',
                                },
                            }}
                            selected={ pathname === '/account'}
                        >
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="My Account"
                                sx={{
                                    color: 'primary.dark',
                                }}
                                selected
                            />
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        sx={{
                            borderRadius: '8px',
                            '&& .Mui-selected': {
                                bgcolor: '#f0f0f0',
                            },
                        }}
                        onClick={() => signOut({ callbackUrl: '/login' })}
                    >
                        <ListItemIcon>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText
                            primary="Logout"
                            sx={{
                                color: 'primary.dark',
                            }}
                            selected
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    )

    const BottomNav = () => (
        <BottomNavigation
            showLabels
            sx={{
                width: '100%',
                height: 64,
                bgcolor: '#ffffff',
                boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
                p: '1rem',
            }}
            value={pathname}
        >
            <BottomNavigationAction
                component={Link}
                href='/'
                label='Dashboard'
                value='/'
                icon={<DashboardIcon />}
                sx={{
                    '&.Mui-selected': {
                        color: 'primary.main'
                    }
                }}
            />
            <BottomNavigationAction
                component={Link}
                href='/pantry'
                label='Pantry'
                value='/pantry'
                icon={<KitchenIcon />}
                sx={{
                    '&.Mui-selected': {
                        color: 'primary.main'
                    }
                }}
            />
            <BottomNavigationAction
                component={Link}
                href='/recipes'
                label='Recipes'
                value='/recipes'
                icon={<MenuBookIcon />}
                sx={{
                    '&.Mui-selected': {
                        color: 'primary.main'
                    }
                }}
            />
            <BottomNavigationAction
                component={Link}
                href='/account'
                label='Account'
                value='/account'
                icon={<PersonIcon />}
                sx={{
                    '&.Mui-selected': {
                        color: 'primary.main'
                    }
                }}
            />
        </BottomNavigation>
    )
  return (
    isMobile ? (
        <BottomNav />
    ) : (
        <SidebarContent />
    )
  )
}
