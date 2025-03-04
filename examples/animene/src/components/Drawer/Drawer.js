import * as React from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import Button from "../ui/Button"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { Link } from "react-router-dom"
import styles from "./styles.module.scss"

export default function Component({
  browseItems,
  buttons,
  userItems,
  open,
  onClose,
  user
}) {
  const [isOpen, setOpen] = React.useState(open)

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return
    }

    setOpen(open)
  }

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {browseItems.map((item, index) => (
          <ListItem
            className={styles.listItem}
            component={Link}
            to={item.linkTo}
            button
            key={item.label}
          >
            <ListItemIcon>
              <item.Icon />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {user
          ? userItems.map((item, index) => (
              <ListItem
                className={styles.listItem}
                component={Link}
                to={item.linkTo}
                button
                key={item.label}
              >
                <ListItemIcon>
                  <item.Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))
          : buttons.map((button, index) => (
              <ListItem button key={button.label}>
                <Button
                  className={button.className}
                  style={{ width: "100%" }}
                  href={button.href}
                >
                  {button.label}
                </Button>
              </ListItem>
            ))}
      </List>
    </Box>
  )

  return (
    <div>
      <React.Fragment>
        <Drawer anchor="right" open={open} onClose={onClose}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  )
}
