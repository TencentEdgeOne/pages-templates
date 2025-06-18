#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { markedHighlight } = require('marked-highlight');
const hljs = require('highlight.js');

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

const renderer = new marked.Renderer();
renderer.link = function(token) {
  const href = token.href;
  const title = token.title;
  const text = token.text;
  const titleAttr = title ? ` title="${title}"` : '';
  
  if (text.includes('<img') || text.match(/^!\[.*\]\(.*\)$/)) {
    if (text.match(/^!\[(.*?)\]\((.*?)\)$/)) {
      const imgMatch = text.match(/^!\[(.*?)\]\((.*?)\)$/);
      const altText = imgMatch[1];
      const imgSrc = imgMatch[2];
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer"><img src="${imgSrc}" alt="${altText}" /></a>`;
    }
    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
  }
  
  return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

marked.setOptions({
  breaks: false,
  gfm: true,
  headerIds: true,
  mangle: false,
  pedantic: false,
  sanitize: false,
  silent: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
  renderer: renderer
});

const readmePath = path.join(__dirname, '../README.md');
const readmeContent = fs.readFileSync(readmePath, 'utf-8');

function parseReadme(content) {
  const titleMatch = content.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'EdgeOne Pages Hono Application';
  
  const descMatch = content.match(/This is a modern Web application[^\n]+/);
  const description = descMatch ? descMatch[0] : '';
  
  const liveDemoMatch = content.match(/Live demo: (.+)$/m);
  const liveDemo = liveDemoMatch ? liveDemoMatch[0] : '';
  
  const hasDeployButton = content.includes('Deploy with EdgeOne Pages');
  
  const htmlContent = marked(content);
  
  return {
    title,
    description,
    liveDemo,
    hasDeployButton,
    htmlContent
  };
}

function generateHTML(data) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.title}</title>
    <link rel="stylesheet" href="./style.css">
  </head>
  <body>
    <div class="container">
      ${data.htmlContent}
      
      <div class="highlight-box">
        <h3>📝 Development Notes</h3>
        <p>This is a complete example application demonstrating various features and best practices of the Hono framework on EdgeOne Functions.</p>
        <p>The project structure is clear, code is well organized, and suitable as a starting template for other projects.</p>
      </div>
    </div>
  </body>
</html>
`;
}

function main() {
  try {
    console.log('📖 Reading README.md...');
    const parsedData = parseReadme(readmeContent);
    
    console.log('🔄 Generating HTML with marked...');
    const htmlContent = generateHTML(parsedData);
    
    console.log('💾 Writing to public/index.html...');
    const outputPath = path.join(__dirname, '../public/index.html');
    fs.writeFileSync(outputPath, htmlContent, 'utf-8');
    
    console.log('✅ Successfully converted README.md to HTML using marked');
  } catch (error) {
    console.error('❌ Error converting docs:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { parseReadme, generateHTML }; 