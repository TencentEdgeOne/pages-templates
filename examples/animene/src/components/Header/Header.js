import * as React from "react"
import { Link } from "react-router-dom"

import styles from "./styles.module.scss"
import clsx from "clsx"

import Button from "../ui/Button"
import { PATHS } from "../../routes"

import NavBar from "../NavBar"
import Drawer from "../Drawer"

import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Badge from "@mui/material/Badge"
import MenuItem from "@mui/material/MenuItem"
import Menu from "@mui/material/Menu"

import MenuIcon from "@mui/icons-material/Menu"
import Logo from "../../assets/img/logo3x.png"
import NotificationsIcon from "@mui/icons-material/Notifications"
import ForumIcon from "@mui/icons-material/Forum"
import SettingsIcon from "@mui/icons-material/Settings"
import AutoStoriesIcon from "@mui/icons-material/AutoStories"
import AccountBoxIcon from "@mui/icons-material/AccountBox"
import PersonIcon from "@mui/icons-material/Person"
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded"
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined"
import LogoutIcon from "@mui/icons-material/Logout"

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileDrawerOpen = Boolean(mobileMoreAnchorEl)

  // fake user state
  const [user, setUser] = React.useState(false)

  const browseItems = [
    { Icon: PlayArrowRoundedIcon, label: "Anime", linkTo: PATHS.ANIME.SEARCH },
    { Icon: AutoStoriesIcon, label: "Manga", linkTo: PATHS.MANGA.SEARCH },
    { Icon: AccountBoxIcon, label: "Staff", linkTo: PATHS.STAFF.SEARCH },
    {
      Icon: AccountBoxOutlinedIcon,
      label: "Characters",
      linkTo: PATHS.CHARACTER.SEARCH
    }
    // { Icon: ForumIcon, label: "Forum", linkTo: PATHS.FORUM }
  ]

  const userItems = [
    { Icon: PersonIcon, label: "Profile", linkTo: PATHS.PROFILE },
    {
      Icon: NotificationsIcon,
      label: "Notifications",
      linkTo: PATHS.NOTIFICATIONS
    },
    { Icon: SettingsIcon, label: "Settings", linkTo: PATHS.SETTINGS },
    { Icon: LogoutIcon, label: "Logout", linkTo: PATHS.LOGOUT }
  ]

  const buttons = [
    // {
    //   className: clsx(styles.btnLogin, "btn-outline"),
    //   label: "Login",
    //   href: PATHS.LOGIN
    // },
    // {
    //   className: clsx(styles.btnSignUp),
    //   label: "Sign Up",
    //   href: PATHS.SIGNUP
    // }
  ]

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileDrawerClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileDrawerClose()
  }

  const handleMobileDrawerOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = "primary-search-account-menu"
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {userItems.map((item) => (
        <MenuItem component={Link} to={item.linkTo} key={item.label}>
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  )

  const mobileDrawerId = "mobile drawer"
  const renderMobileDrawer = (
    <Drawer
      browseItems={browseItems}
      buttons={buttons}
      user={user}
      userItems={userItems}
      open={isMobileDrawerOpen}
      onClose={handleMobileDrawerClose}
    />
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className={styles.header}>
        <Toolbar>
          <Link to="/">
            <img style={{ width: "112px" }} src={Logo} alt="Logo" />
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
              justifyContent: "space-between"
            }}
          >
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <NavBar items={browseItems} />
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {user ? (
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <PersonIcon />
                </IconButton>
              ) : (
                buttons.map((button) => (
                  <Button
                    href={button.href}
                    className={button.className}
                    key={button.label}
                  >
                    {button.label}
                  </Button>
                ))
              )}
            </Box>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileDrawerId}
              aria-haspopup="true"
              onClick={handleMobileDrawerOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileDrawer}
      {renderMenu}
    </Box>
  )
}
