require("dotenv").config({
  path: `.env`,
})
// console.log process.env)
module.exports = {
  siteMetadata: {
    title: `Gatsby Sydney Ecommerce Theme`,
    siteUrl: `https://jamm.matter.design`,
  },
  plugins: [
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: 'WordPress',
        fieldName: 'wordpress',
        // Url to query from
        url: `${process.env.WP_URL}/graphql`,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/static`,
      },
    },
  ],
  
};
