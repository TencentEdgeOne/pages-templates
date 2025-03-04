import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined"
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral"

const RatingIcon = ({ score, className, ...props }) => {
  let Icon

  if (!score) return <></>

  if (score >= 75) {
    Icon = { Component: SentimentSatisfiedAltOutlinedIcon, color: "#7FD65B" }
  } else {
    Icon = { Component: SentimentNeutralIcon, color: "#F6B791" }
  }

  return <Icon.Component className={className} style={{ color: Icon.color }} />
}

export default RatingIcon
