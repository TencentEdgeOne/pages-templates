import styles from "./styles.module.scss"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
import { Scrollbar, Autoplay } from "swiper"
import Wallpaper1 from "../../assets/img/wallpaper/wallpaper1.jpg"
import Wallpaper2 from "../../assets/img/wallpaper/wallpaper2.jpeg"
import Wallpaper3 from "../../assets/img/wallpaper/wallpaper3.jpg"

// Import Swiper styles
// import "swiper/css"
import "swiper/swiper-bundle.min.css"
import "swiper/swiper.min.css"

const Component = () => {
  return (
    <Swiper
      modules={[Scrollbar, Autoplay]}
      className={styles.swiper}
      spaceBetween={50}
      slidesPerView={1}
      autoplay={{ delay: 3000 }}
      scrollbar={{ draggable: true }}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <SwiperSlide className={styles.slider}>
        <img
          className={styles.landingWallpaper}
          src={Wallpaper1}
          alt="landing wallpaper"
        />
      </SwiperSlide>
      <SwiperSlide className={styles.slider}>
        <img
          className={styles.landingWallpaper}
          src={Wallpaper2}
          alt="landing wallpaper"
        />
      </SwiperSlide>
      <SwiperSlide className={styles.slider}>
        <img
          className={styles.landingWallpaper}
          src={Wallpaper3}
          alt="landing wallpaper"
        />
      </SwiperSlide>
    </Swiper>
  )
}
export default Component
