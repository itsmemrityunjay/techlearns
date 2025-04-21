import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // For profile icon
import { Outlet, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import logo from "../../assets/Logo.png";
import useMediaQuery from "@mui/material/useMediaQuery";
import place_white from "../../assets/Logo-w.png";
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from "../../database/AuthContext"; // Import Auth context
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModel";
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'; // Trophy for competitions
import NoteOutlinedIcon from '@mui/icons-material/NoteOutlined'; // Note for notebook
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'; // Graduation cap for courses
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'; // Forum icon for discussions
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
import BarChartIcon from '@mui/icons-material/BarChart';

// Base navigation items
const BASE_NAVIGATION = [
    {
        title: "Home",
        segment: "/",
        icon: <HomeOutlinedIcon />,
        roles: ["user", "admin", "sub-admin", "mentor", ""]
    },
    {
        title: "Competitions",
        segment: "/competition",
        icon: <EmojiEventsOutlinedIcon />, // Changed to trophy icon
        roles: ["user", "admin", "sub-admin", "mentor", ""]
    },
    {
        title: "Notebook",
        segment: "/notebook",
        icon: <NoteOutlinedIcon />, // Changed to notebook icon
        roles: ["user", "admin", "sub-admin", "mentor", ""]
    },
    {
        title: "Courses",
        segment: "/course",
        icon: <SchoolOutlinedIcon />, // Changed to education/school icon
        roles: ["user", "admin", "sub-admin", "mentor", ""]
    },
    {
        title: "Discussions",
        segment: "/discussion",
        icon: <ForumOutlinedIcon />, // Changed to forum/discussion icon
        roles: ["user", "admin", "sub-admin", "mentor", ""]
    },
    {
        title: "User",
        segment: "/user",
        icon: <PersonOutlineIcon />,
        roles: ["user", "admin", "sub-admin", "mentor", ""]
    },
    {
        title: "Dashboard",
        segment: "/admin",
        icon: <DashboardIcon />,
        roles: ["admin", "sub-admin"] // Restricted to admin and sub-admin only
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
    const location = useLocation(); // Get current location
    const { currentUser, userData } = useAuth(); // Get user data and role

    const userRole = userData?.role || ""; // Get user role or empty string if not available

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

    // Filter navigation items based on user role
    const COLLEGE_NAVIGATION = BASE_NAVIGATION.filter(item =>
        item.roles.includes(userRole)
    );

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    // Use pathname to determine active item
    const currentPath = location.pathname;

    // Find the matching navigation item based on the current path
    const findActiveNavItem = (path) => {
        // For exact match first
        const exactMatch = COLLEGE_NAVIGATION.find(item => item.segment === path);
        if (exactMatch) return exactMatch.title;

        // For partial match (like /courses/123)
        if (path !== '/') {
            const partialMatch = COLLEGE_NAVIGATION.find(item =>
                item.segment !== '/' && path.startsWith(item.segment)
            );
            if (partialMatch) return partialMatch.title;
        }

        return "";
    };

    // Set active item based on current URL
    const [activeItem, setActiveItem] = React.useState(findActiveNavItem(currentPath));

    // Update active item when location changes
    React.useEffect(() => {
        const newActiveItem = findActiveNavItem(currentPath);
        setActiveItem(newActiveItem);
        localStorage.setItem("activeItem", newActiveItem);
    }, [currentPath]);

    const handleNavigation = (path, itemTitle) => {
        setActiveItem(itemTitle);
        localStorage.setItem("activeItem", itemTitle);
        navigate(path);
        if (isMobile) setDrawerOpen(false);
    };

    const toggleDrawer = () => {
        setDrawerOpen((prev) => !prev);
    };

    return (
        <>
            {/* Drawer */}
            <div>
                <ConfirmationModal isOpen={isOpen} onClose={onClose} onConfirm={onConfirm} message={'You sure You wanna LogOut?'} />
                <Drawer
                    variant={isMobile ? "temporary" : "permanent"}
                    open={drawerOpen}
                    onClose={toggleDrawer}
                    sx={{
                        width: isMobile ? "auto" : drawerOpen ? 240 : 75,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: isMobile ? "auto" : drawerOpen ? 240 : 75,
                            height: isMobile ? "100vh" : "96vh",
                            marginLeft: isMobile ? 0 : "16px",
                            marginTop: "16px",
                            backgroundColor: "#000000",
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
            </div>
            {/* Rest of your component remains the same */}
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "transparent",
                    height: 56,
                    zIndex: 1201,
                    boxShadow: "none",
                    left: isMobile ? 0 : drawerOpen ? 256 : 91,
                    width: isMobile
                        ? "100%"
                        : `calc(100% - ${drawerOpen ? 256 : 91}px)`,
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
        </>
    );
}

DashboardLayoutAppBar.propTypes = {
    window: PropTypes.func,
};

export default DashboardLayoutAppBar;
