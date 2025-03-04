import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

import { Link } from "react-router-dom"

import Logo from "../../assets/img/logo3x.png"
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled"
import EmailIcon from "@mui/icons-material/Email"
import HomeWorkIcon from "@mui/icons-material/HomeWork"

import styles from "./styles.module.scss"

const Footer = () => {
  const footers = [
    // [
    //   { label: "Linkedin", link: "https://www.linkedin.com/in/hoangtien1005" },
    //   { label: "Facebook", link: "https://www.facebook.com/hoangtien1005" },
    //   {
    //     label: "HackerRank",
    //     link: "https://hackerrank.com/profile/HoangTien1005"
    //   },
    //   { label: "Github", link: "https://github.com/hoangtien1005" }
    // ],
    // [
    //   { label: "Donate", link: "https://anilist.co/forum/thread/2340" },
    //   { label: "AniList.co", link: "https://anilist.co" },
    //   { label: "AniChart.net", link: "http://anichart.net" },
    //   { label: "AniAPI", link: "https://aniapi.com" }
    // ],
    // [
    //   { label: "Apps", link: "https://anilist.co/apps" },
    //   { label: "Site Stats", link: "https://anilist.co/site-stats" },
    //   { label: "Recommendations", link: "https://anilist.co/recommendations" },
    //   { label: "API", link: "https://github.com/AniList/ApiV2-GraphQL-Docs" }
    // ],
    // [
    //   { label: "Add Data", link: "https://submission-manual.anilist.co" },
    //   { label: "Moderators", link: "https://anilist.co/moderators" },
    //   { label: "Terms & Privacy", link: "https://anilist.co/terms" },
    //   { label: "Site Map", link: "https://anilist.co/sitemap/index.xml" }
    // ]
  ]

  return (
    <footer className={styles.footer}>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3} style={{ paddingTop: "20px" }}>
            <Grid item xs={12} lg={4} style={{ marginBottom: "8px" }}>
              <Stack spacing={2}>
                <Link to="/">
                  <img style={{ width: "100px" }} src={Logo} alt="Logo" />
                </Link>
                {/* <a className={styles.personalLink} href="tel:+84776775284">
                  <PhoneEnabledIcon className={styles.personalIcon} />
                  <span>0776775284</span>
                </a>
                <a
                  className={styles.personalLink}
                  href="mailto:nguyenhoangtien100501@gmail.com"
                >
                  <EmailIcon className={styles.personalIcon} />
                  <span>nguyenhoangtien100501@gmail.com</span>
                </a>
                <a
                  className={styles.personalLink}
                  href="https://goo.gl/maps/LDZn2GkJv6dcbuYg6"
                  target="_blank"
                  rel="noreferrer"
                >
                  <HomeWorkIcon className={styles.personalIcon} />
                  <span>Thu Duc District, Ho Chi Minh city</span>
                </a> */}
              </Stack>
            </Grid>
            {footers.map((row, idx) => (
              <Grid
                item
                xs={12}
                md={6}
                lg={2}
                key={idx}
                style={{ marginBottom: "8px" }}
              >
                <Stack spacing={2}>
                  {row.map((item) => (
                    <a
                      key={item.label}
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.label}
                    </a>
                  ))}
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </footer>
  )
}
export default Footer
