import styles from "./styles.module.scss"
import Grid from "@mui/material/Grid"
import GridContainer from "../ui/GridContainer"
import ReactMarkdown from "react-markdown"
import MediaCardList from "../MediaCardList"
const PersonDetailsPage = ({ data }) => {
  const { person, medias } = data
  return (
    <>
      <GridContainer spacing={3}>
        <Grid item xs={12}>
          <div className={styles.mainTitleContainer}>
            <div
              className={styles.coverImage}
              style={{
                backgroundImage: `url(${
                  person.image.large || person.image.medium
                })`
              }}
            ></div>
            <div className={styles.subContainer}>
              <div>
                <h2 className={styles.personName}>{person.name.full}</h2>
                <div className={styles.personInfo}>
                  Birthday:{" "}
                  <span className={styles.personInfoValue}>
                    {person.dateOfBirth}
                  </span>
                </div>
                <div className={styles.personInfo}>
                  Age:{" "}
                  <span className={styles.personInfoValue}>{person.age}</span>
                </div>
                <div className={styles.personInfo}>
                  Gender:{" "}
                  <span className={styles.personInfoValue}>
                    {person.gender}
                  </span>
                </div>
              </div>
              <div className={styles.descContainer}>
                <div className={styles.description}>
                  <ReactMarkdown>
                    {person.description || "No Description"}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </GridContainer>
      <div className="space-top-20"></div>
      <MediaCardList medias={medias} />
    </>
  )
}
export default PersonDetailsPage
