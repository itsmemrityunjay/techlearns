import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import BarChartIcon from "@mui/icons-material/BarChart"; // Updated Analytics Icon
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import useMediaQuery from "@mui/material/useMediaQuery";
import place_white from "../../assets/Logo-w.png";
import { getAuth, signOut } from 'firebase/auth';
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModel";

// Navigation items for college dashboard
const COLLEGE_NAVIGATION = [
    {
        title: "Home",
        segment: "/",
        icon: <HomeOutlinedIcon />,
    },
    {
        title: "Competitions",
        segment: "/competition",
        icon: <AutoStoriesOutlinedIcon />,
    },
    {
        title: "Notebook",
        segment: "/notebook",
        icon: <ChatOutlinedIcon />,
    },
    {
        title: "Courses",
        segment: "/course",
        icon: <AccountCircleIcon />,
    },
    {
        title: "Discussions",
        segment: "/discussion",
        icon: <GroupIcon />,
    },

    {
        title: "Dashboard",
        segment: "/admin",
        icon: <DashboardIcon />,
    },
];

function Branding() {
    return (
        <Box
            component="img"
            src={logo}
            alt="Placera Logo"
            sx={{ width: 120, mr: 2 }}
        />
    );
}

function DashboardLayoutAppBar() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:600px)");
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const auth = getAuth();
    const onConfirm = () => {

        signOut(auth)
            .then(() => {
                navigate('/signin');
                console.log('User signed out successfully');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });

        setIsOpen(false);
    };

    // Retrieve the saved active item from localStorage on mount
    const savedActiveItem = localStorage.getItem("activeItem") || "";
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState(savedActiveItem);

    const handleNavigation = (path, itemTitle) => {
        setActiveItem(itemTitle);
        localStorage.setItem("activeItem", itemTitle); // Save active item to localStorage
        navigate(path);
        if (isMobile) setDrawerOpen(false); // Close drawer on navigation in mobile view
    };

    const toggleDrawer = () => {
        setDrawerOpen((prev) => !prev);
    };

    return (
        <>
            {/* Drawer */}
            <ConfirmationModal isOpen={isOpen} onClose={onClose} onConfirm={onConfirm} message={'You sure You wanna LogOut?'} />
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={drawerOpen}
                onClose={toggleDrawer} // Close drawer on mobile when clicking outside
                sx={{
                    width: isMobile ? "auto" : drawerOpen ? 240 : 75,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: isMobile ? "auto" : drawerOpen ? 240 : 75,
                        height: isMobile ? "100vh" : "96vh",
                        marginLeft: isMobile ? 0 : "16px",
                        marginTop: "16px",
                        backgroundColor: "#000000", // Static color
                        borderRadius: "8px",
                        overflowX: "hidden",
                        transition: "width 0.3s",
                        boxSizing: "border-box",
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {drawerOpen && !isMobile && (
                        <Box sx={{ width: 150 }}>
                            <img src={place_white} alt="College Logo" />
                        </Box>
                    )}
                    {/* Toggle button inside Drawer */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: drawerOpen ? "flex-end" : "center",
                            p: 1,
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <MenuIcon sx={{ color: "#fff" }} />
                        </IconButton>
                    </Box>
                </Box>

                <List sx={{ padding: 2 }}>
                    {COLLEGE_NAVIGATION.map((item) => {
                        const isActive = activeItem === item.title;

                        return (
                            <ListItem
                                button
                                key={item.title}
                                onClick={() => handleNavigation(item.segment, item.title)}
                                sx={{
                                    backgroundColor: isActive ? "#f0f0f0" : "inherit",
                                    color: isActive ? "#000" : "#fff",
                                    "&:hover": {
                                        backgroundColor: "#f0f0f0",
                                        color: "#000",
                                    },
                                    padding: "10px",
                                    borderRadius: "8px",
                                    marginY: "4px",
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? "#000" : "inherit",
                                        minWidth: "40px",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                {drawerOpen && (
                                    <ListItemText
                                        primary={item.title}
                                        sx={{
                                            color: isActive ? "#000" : "inherit",
                                        }}
                                    />
                                )}
                            </ListItem>
                        );
                    })}
                </List>

                <List sx={{ padding: 2, marginTop: "auto" }}>
                    <ListItem
                        button
                        key={"Logout"}
                        onClick={() => setIsOpen(true)}
                        sx={{
                            backgroundColor: "inherit",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#f0f0f0",
                                color: "#000",
                            },
                            padding: "10px",
                            borderRadius: "8px",
                            marginY: "4px",
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: "inherit",
                                minWidth: "40px",
                            }}
                        >
                            <LogoutIcon />
                        </ListItemIcon>
                        {drawerOpen && (
                            <ListItemText
                                primary={"Logout"}
                                sx={{
                                    color: "inherit",
                                }}
                            />
                        )}
                    </ListItem>
                </List>
            </Drawer>

            {/* AppBar that starts from the side of the drawer */}
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "#fff",
                    height: 56,
                    zIndex: 1201,
                    boxShadow: "none",
                    left: isMobile ? 0 : drawerOpen ? 256 : 91,
                    width: isMobile
                        ? "100%"
                        : `calc(100% - ${drawerOpen ? 256 : 91}px)`, // Fixed calc syntax for JSX
                    transition: "left 0.3s, width 0.3s",
                }}
            >
                <Toolbar sx={{ minHeight: "56px" }}>
                    {isMobile && (
                        <IconButton
                            edge="start"
                            aria-label="menu"
                            onClick={toggleDrawer}
                            sx={{ ml: 1 }}
                        >
                            <MenuIcon sx={{ color: "#333" }} />
                        </IconButton>
                    )}
                    {(!drawerOpen || isMobile) && <Branding />}
                </Toolbar>
            </AppBar>

            {/* Main content */}
            {/* <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                    ml: isMobile ? 0 : drawerOpen ? "256px" : "91px",
                    transition: "margin-left 0.3s",
                }}
            > */}
            {/* <Outlet /> */}
            {/* </Box> */}
        </>
    );
}

DashboardLayoutAppBar.propTypes = {
    window: PropTypes.func,
};

export default DashboardLayoutAppBar;
