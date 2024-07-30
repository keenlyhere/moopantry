'use client'
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import Link from "next/link";
import DashboardIcon from '@mui/icons-material/Dashboard';
import KitchenIcon from '@mui/icons-material/Kitchen';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    console.log("current pathname:", pathname);
  return (
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

        {/* to-do: menu items */}
        <List>
            <ListItem disablePadding>
                <Link href={'/dashboard'} style={{ textDecoration: 'none', width: '100%' }}>
                    <ListItemButton
                        sx={{
                            borderRadius: '8px',
                            '&& .Mui-selected, && .MuiListItemButton-root:hover': {
                                bgcolor: 'secondary.main',
                            }
                        }}
                        selected={ pathname === '/dashboard'}
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
                            primary="My Pantry"
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
        </List>
    </Box>
  )
}
