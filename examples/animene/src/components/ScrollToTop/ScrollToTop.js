import ScrollToTop from "react-scroll-to-top"

import styles from "./styles.module.scss"

const Image = () => {
  return (
    <img
      className={styles.scrollToTopIcon}
      src="https://img.icons8.com/material/48/18c1f0/circled-up-2--v1.png"
      alt="scroll to top"
    />
  )
}

const Component = () => {
  return (
    <ScrollToTop
      style={{ borderRadius: "50%", width: "48px", height: "48px" }}
      smooth
      component={<Image />}
    ></ScrollToTop>
  )
}

export default Component
