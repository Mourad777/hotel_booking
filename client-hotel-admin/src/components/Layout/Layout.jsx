import React, { useState } from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import CalendarMonthIcon from '@material-ui/icons/CalendarTodayTwoTone';
import { useHistory } from 'react-router';
import { Fragment } from 'react';
import { StyledListItem } from '../styles/layout';
import { useStyles } from './LayoutStyles';

export default function Layout({ children, isLoggedIn }) {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [location, setLocation] = useState('');

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [nestedReservationsOpen, setNestedReservationsOpen] = useState(false);
    const [nestedRoomsOpen, setNestedRoomsOpen] = useState(false);

    const handleReservationsExpansion = () => {
        setNestedReservationsOpen(!nestedReservationsOpen);
    };

    const handleRoomsExpansion = () => {
        setNestedRoomsOpen(!nestedRoomsOpen);
    };


    history.listen((location, action) => {
        setLocation(location.pathname)
    });

    return (
        <div className={classes.root}>
            <CssBaseline />

            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Hotel admin panel
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                {
                    <Fragment>
                        <List>
                            <ListItem button onClick={handleRoomsExpansion}>
                                <ListItemIcon>
                                    <ChromeReaderModeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Accommodations" />
                                {nestedRoomsOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={nestedRoomsOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {[
                                        { text: 'New accommodation', icon: PostAddIcon, url: '/create-accommodation' },
                                        { text: 'View accommodations', icon: DynamicFeedIcon, url: '/accommodations', altUrl: '/' },
                                    ].map((item) => (
                                        <StyledListItem
                                            isDark={item.url === location || item.altUrl === location}
                                            onClick={() => history.push(item.url)}
                                            button key={item.text}
                                            className={classes.nested}>
                                            <ListItemIcon><item.icon /></ListItemIcon>
                                            <ListItemText primary={item.text} />
                                        </StyledListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </List>
                        <List>
                            <ListItem button onClick={handleReservationsExpansion}>
                                <ListItemIcon>
                                    <CalendarMonthIcon />
                                </ListItemIcon>
                                <ListItemText primary="Reservations" />
                                {nestedReservationsOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={nestedReservationsOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {[
                                        { text: 'New reservation', icon: PostAddIcon, url: '/create-reservation' },
                                        { text: 'View reservations', icon: DynamicFeedIcon, url: '/bookings' },
                                    ].map((item) => (
                                        <StyledListItem
                                            isDark={item.url === location || item.altUrl === location}
                                            onClick={() => history.push(item.url)}
                                            button key={item.text}
                                            className={classes.nested}>
                                            <ListItemIcon><item.icon /></ListItemIcon>
                                            <ListItemText primary={item.text} />
                                        </StyledListItem>
                                    ))}
                                </List>
                            </Collapse>

                        </List>
                    </Fragment>
                }
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                {children}
            </main>
        </div >
    );
}