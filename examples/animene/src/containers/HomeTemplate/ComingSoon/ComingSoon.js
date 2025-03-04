import styles from "./styles.module.scss"
import Button from "../../../components/ui/Button"

import Typewriter from "typewriter-effect"

const ComingSoon = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>COMING</h1>
      <h1 className={styles.title}>SOON</h1>
      <div className={styles.typewriterContainer}>
        <Typewriter
          options={{
            strings: [
              "We are currently working on this feature.",
              "Please comeback later :')"
            ],
            autoStart: true,
            delay: 100,
            loop: true,
            wrapperClassName: styles.typewriter
          }}
        />
      </div>
      <Button className={styles.btnGoHome} href="/">
        Back To Home
      </Button>
    </div>
  )
}
export default ComingSoon
