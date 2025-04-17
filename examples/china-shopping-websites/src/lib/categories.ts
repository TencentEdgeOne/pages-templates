// Define shop item interface
interface ShopItem {
  name: string;
  description: string;
  url: string;
  image?: string;
}


// Define category interface
interface Category {
  id: string;
  title: string;
  items: ShopItem[];
}

export const categories: Category[] = [
  {
    id: 'overseas',
    title: 'Global Cross-border E-commerce',
    items: [
      {
        name: 'DHgate',
        description:
          'B2B and B2C cross-border e-commerce platform connecting Chinese sellers with global buyers',
        url: 'https://www.dhgate.com/',
        image: '/icons/dhgate.jpg',
      },
      {
        name: 'Temu',
        description:
          'E-commerce platform offering affordable products directly from manufacturers with global shipping',
        url: 'https://www.temu.com/',
        image: '/icons/temu.png',
      },
      {
        name: 'LightInTheBox',
        description:
          'Global online retail store offering a wide range of products from apparel to electronics and home goods',
        url: 'https://www.lightinthebox.com/',
        image: '/icons/lightinthebox.png',
      },
      {
        name: 'Banggood',
        description:
          'Global e-commerce platform specializing in electronics, gadgets, clothing, and home products',
        url: 'https://www.banggood.com/',
        image: '/icons/banggood.png',
      },
      {
        name: 'Made-in-China',
        description:
          "Made-in-China.com is China's leading B2B cross-border e-commerce platform, dedicated to connecting global buyers with high-quality domestic suppliers.",
        url: 'https://www.made-in-china.com/',
        image: '/icons/madeinchina.png',
      },
      {
        name: 'Alibaba',
        description:
          "World's largest B2B e-commerce platform connecting manufacturers with buyers around the globe",
        url: 'https://www.alibaba.com/',
        image: '/icons/alibaba.png',
      },
      {
        name: 'AliExpress',
        description:
          'Popular global retail marketplace offering products at factory prices with worldwide shipping',
        url: 'https://www.aliexpress.com/',
        image: '/icons/aliexpress.jpeg',
      },
    ],
  },
  {
    id: 'comprehensive',
    title: 'Comprehensive E-commerce',
    items: [
      {
        name: 'Taobao',
        description:
          'Well-known C2C e-commerce platform with a wide range of products from daily necessities to high-end electronics',
        url: 'https://www.taobao.com/',
        image: '/icons/taobao.png',
      },
      {
        name: 'JD.com',
        description:
          'B2C platform excelling in digital and home appliance sectors, known for reliable product quality and efficient logistics',
        url: 'https://www.jd.com/',
        image: '/icons/jd.png',
      },
      {
        name: 'Pinduoduo',
        description:
          'Famous for its group-buying model enabling consumers to purchase products at lower prices through collective buying power',
        url: 'https://www.pinduoduo.com/',
        image: '/icons/pdd.png',
      },
      {
        name: '1688',
        description:
          "Alibaba's wholesale trading platform offering a large variety of wholesale products",
        url: 'https://www.1688.com/',
        image: '/icons/1688.jpg',
      },
      {
        name: 'Tmall',
        description:
          "Alibaba's B2C platform hosting numerous well-known brands, focusing on high-quality products and brand building",
        url: 'https://www.tmall.com/',
        image: '/icons/tmall.png',
      },
      {
        name: 'Suning.com',
        description:
          'Integrated online-to-offline e-commerce platform with strong performance in home appliances and 3C products',
        url: 'https://www.suning.com/',
        image: '/icons/suning.png',
      },
      {
        name: 'NetEase Yanxuan',
        description:
          'High-quality lifestyle e-commerce platform under NetEase, offering selected home, digital, and food products',
        url: 'https://www.youpin.mi.com/',
        image: '/icons/163.png',
      },
    ],
  },
  {
    id: 'fashion',
    title: 'Fashion & Accessories',
    items: [
      {
        name: 'Shein',
        description:
          'Fast-fashion retailer specializing in trendy clothing and accessories at competitive prices',
        url: 'https://www.shein.com/',
        image: '/icons/shein.webp',
      },
      {
        name: 'Zaful',
        description:
          'Zaful is a leading global online fashion retailer offering a wide range of trendy and fashionable clothing for women',
        url: 'https://www.zaful.com/',
        image: '/icons/zaful.jpg',
      },
      {
        name: 'Dewu',
        description:
          'Trendy e-commerce platform popular among young consumers, specializing in trendy shoes, clothing, and beauty products',
        url: 'https://www.dewu.com/',
        image: '/icons/dewu.png',
      },
      {
        name: 'Mogujie',
        description:
          'Focused on the female fashion market, offering vast selections of clothing, shoes, bags, and accessories',
        url: 'https://www.mogujie.com/',
        image: '/icons/mogujie.jpg',
      },
      {
        name: 'VIP.com',
        description:
          'VIP.com is a leading online fashion retailer offering a wide range of trendy and fashionable clothing for women',
        url: 'https://www.vip.com/',
        image: '/icons/vip.png',
      },
    ],
  },

  {
    id: 'trend',
    title: 'Trend & Toys',
    items: [
      {
        name: 'Popmart',
        description:
          "Popmart is China's leading trendy toy brand that sells original IP pop toys in blind box format, leading youth consumer trends through omni-channel operations both online and offline.",
        url: 'https://www.popmart.com/',
        image: '/icons/popmart.jpg',
      },
      {
        name: '52Toys',
        description:
          '52Toys is a leading online toy retailer offering a wide range of toys for children and adults',
        url: 'https://www.52toys.com/',
        image: '/icons/52toys.png',
      },
      {
        name: 'Top Toy',
        description:
          'Top Toy is a leading online toy retailer offering a wide range of toys for children and adults',
        url: 'https://gotoptoy.com/',
        image: '/icons/toptoy.webp',
      },
    ],
  },

  {
    id: 'digital',
    title: 'Digital & Home Appliances',
    items: [
      {
        name: 'Suning Digital & Appliances',
        description:
          'Major player in the digital and home appliance market offering products from large appliances to small gadgets',
        url: 'https://dianqi.suning.com/',
        image: '/icons/suning.png',
      },
      {
        name: 'Xiaomi Mall',
        description:
          'Official e-commerce platform for Xiaomi branded products including smartphones, smart home devices and accessories',
        url: 'https://www.mi.com/',
        image: '/icons/mi.png',
      },
      {
        name: 'Honor Mall',
        description:
          'Official platform for Honor products featuring smartphones, tablets, and smart wearables with latest technology',
        url: 'https://www.hihonor.com/',
        image: '/icons/honor.png',
      },
      {
        name: 'Vivo Mall',
        description:
          'Official e-commerce platform for Vivo branded products including smartphones, smart home devices and accessories',
        url: 'https://www.vivo.com.cn/',
        image: '/icons/vivo.svg',
      },
      {
        name: 'OPPO Mall',
        description:
          'Official e-commerce platform for OPPO branded products including smartphones, smart home devices and accessories',
        url: 'https://www.oppo.com/',
        image: '/icons/oppo.png',
      },
      {
        name: 'DJI',
        description:
          'Official e-commerce platform for DJI branded products including drones, cameras, and accessories',
        url: 'https://www.dji.com/',
        image: '/icons/dji.jpg',
      },
    ],
  },
  {
    id: 'book',
    title: 'Books & Magazines',
    items: [
      {
        name: 'Dangdang',
        description:
          'Dangdang is a leading online bookstore offering a wide range of books, magazines, and other media products',
        url: 'https://www.dangdang.com/',
        image: '/icons/dangdang.png',
      },
      {
        name: 'BooksChina',
        description:
          'BooksChina is a leading online bookstore offering a wide range of books, magazines, and other media products',
        url: 'https://www.bookschina.com/',
        image: '/icons/bookschina.png',
      },
    ],
  },
  {
    id: 'maternal',
    title: 'Maternal & Infant Care',
    items: [
      {
        name: 'Kisdwant',
        description:
          "Leading platform in China's maternal and infant industry, integrating online and offline services",
        url: 'https://www.haiziwang.com/',
        image: '/icons/kidswant.png',
      },
    ],
  },
  {
    id: 'second-hand',
    title: 'Second-hand Marketplace',
    items: [
      {
        name: 'Xianyu',
        description:
          'Popular second-hand transaction platform under Alibaba where users can buy and sell various second-hand items',
        url: 'https://www.xianyu.com/',
        image: '/icons/xianyu.png',
      },
      {
        name: 'Zhuanzhuan',
        description:
          'Specializing in second-hand digital product transactions with a professional quality inspection team',
        url: 'https://www.zhuanzhuan.com/',
        image: '/icons/zhuanzhuan.png',
      },
      {
        name: 'Kongfz',
        description:
          'Well-known platform for second-hand book trading with a vast collection including ancient books and rare editions',
        url: 'https://www.kongfz.com/',
        image: '/icons/kongfz.jpg',
      },
    ],
  },
];
