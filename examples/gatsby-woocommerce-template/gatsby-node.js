const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
const { PagesQuery } = require('./src/queries/PagesQuery.js');


exports.createResolvers = ({
  actions,
  cache,
  createNodeId,
  createResolvers,
  store,
  reporter,
  getNode
}) => {
  const { createNode, touchNode } = actions
  createResolvers({
    WordPress_MediaItem: {
      localFile: {
        type: `File`,
        resolve: async (image) => {
          let fileNodeID;
          let fileNode;
          if (image.sourceUrl) {
            try {
              
              const validedId = image.id || image.sourceUrl.split(`/`).pop();
              const mediaDataCacheKey = `wordpress-media-${validedId}`;
              const cacheMediaData = await cache.get(mediaDataCacheKey);
              if (cacheMediaData) {
                fileNode = getNode(cacheMediaData.fileNodeID);

                if (fileNode) {
                  fileNodeID = cacheMediaData.fileNodeID;
                  touchNode(fileNode);
                  reporter.verbose(`Using cached image: ${image.sourceUrl}`);
                }
              }

              if (!fileNodeID) {
                reporter.info(`Downloading image: ${image.sourceUrl}`);
                fileNode = await createRemoteFileNode({
                  url: image.sourceUrl,
                  parentNodeId: validedId,
                  createNode,
                  createNodeId,
                  cache,
                  store,
                  reporter,
                });
                reporter.info(`Downloaded image: ${image.sourceUrl}`, fileNode);
                if (fileNode) {
                  fileNodeID = fileNode.id;

                  await cache.set(mediaDataCacheKey, {
                    fileNodeID,
                    // modified: n.modified,
                  });
                  reporter.verbose(`Successfully created file node for: ${image.sourceUrl}`);
                } else {
                  reporter.warn(`Failed to create file node for: ${image.sourceUrl}`);
                }
              }
              console.log('fileNodeID', image.sourceUrl, mediaDataCacheKey, fileNodeID);
              if (fileNodeID) {
                image.localFile___NODE = fileNodeID;
              }
            } catch (e) {
              reporter.warn(`Failed to download ${image.sourceUrl}`)
              console.error(e)
              return null
            }
            return fileNode;
          }
          return null;
        },
      },
    },
  })
}
// https://stackoverflow.com/questions/63124432/how-do-i-configure-mini-css-extract-plugin-in-gatsby
exports.onCreateWebpackConfig = (helper) => {
  const { stage, actions, getConfig } = helper;
  if (stage === 'develop' || stage === 'build-javascript') {
    const config = getConfig();
    const miniCssExtractPlugin = config.plugins.find(
      (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
    );
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true;
    }
    actions.replaceWebpackConfig(config);
  }
};


exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(PagesQuery);
  console.log('createPages result', result.data.wordpress.posts.nodes[0]);
  // category
  result.data.wordpress.productCategories.nodes.forEach((node) => {
    if (!node.parent) return;
    console.log('create page', `/category/${node.slug}`);
    createPage({
      path: `/category/${node.slug}`,
      component: require.resolve(`./src/templates/category.js`),
      context: {
        data: node
      }
    });
  });
  // shop
  createPage({
    path: `/shop`,
    component: require.resolve(`./src/templates/shop.js`),
    context: {
      data: result.data.wordpress.products
    }
  });
  // product
  result.data.wordpress.products.nodes.forEach((node) => {
    console.log('create product page', `/product/${node.slug}`);
    createPage({
      path: `/product/${node.slug}`,
      component: require.resolve(`./src/templates/product.js`),
      context: {
        data: node
      }
    });
  });
  // blog-index
  createPage({
    path: `/blog`,
    component: require.resolve(`./src/templates/blog-index.js`),
    context: {
      data: result.data.wordpress.posts.nodes
    }
  });
  // blog
  result.data.wordpress.posts.nodes.forEach((node) => {
    createPage({
      path: `/blog/${node.slug}`,
      component: require.resolve(`./src/templates/blog.js`),
      context: {
        data: node
      }
    });
  });
}
