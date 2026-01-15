<template>
  <div class="page-layout">
    <aside class="articles-sidebar">
      <div class="articles-container">
        <h3 class="articles-title">Articles</h3>
        <nav class="articles-nav">
          <ul class="articles-list">
            <li 
              v-for="article in articles" 
              :key="article.path"
              :class="['article-item', { 'article-active': route.path === article.path }]"
            >
              <NuxtLink 
                :to="article.path" 
                class="article-link"
              >
                <div class="article-header">
                  <div class="article-title">{{ article.title}}</div>
                  <div class="article-icon">→</div>
                </div>
                <div v-if="article.description" class="article-description">
                  {{ article.description }}
                </div>
                <div v-if="article.date" class="article-date">
                  {{ formatDate(article.date) }}
                </div>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
    
  <div class="container">
      <article class="main-content">
          <header>
            <h1 class="page-main-title">{{ page.title }}</h1>
            <div class="date">{{ page.date }}</div>
          </header>
          
          <div class="content-body" ref="contentRef">
            <!-- If it's a data file, use custom rendering -->
            <div v-if="isDataFile(page)" class="data-content">
              <!-- YAML file rendering -->
              <div v-if="getFileType(route.path) === 'yaml'" class="yaml-content">
                <p v-if="page.description" class="description">{{ page.description }}</p>
                
                <div class="yaml-sections">
                  <div v-for="(value, key) in getDataContent(page)" :key="key" class="yaml-section">
                    <h2>{{ formatKey(key) }}</h2>
                    <div class="yaml-data">
                      <pre><code>{{ formatYamlValue(value) }}</code></pre>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- JSON file rendering -->
              <div v-else-if="getFileType(route.path) === 'json'" class="json-content">
                <p v-if="page.description" class="description">{{ page.description }}</p>
                
                <div class="json-data">
                  <pre><code>{{ JSON.stringify(getDataContent(page), null, 2) }}</code></pre>
                </div>
              </div>
              
              <!-- CSV file rendering -->
              <div v-else-if="getFileType(route.path) === 'csv'" class="csv-content">
                <p v-if="page.description" class="description">{{ page.description }}</p>
                
                <div class="csv-data">
                  <pre><code>{{ formatCsvData(page) }}</code></pre>
                </div>
              </div>
            </div>
            <!-- Otherwise use default ContentRenderer -->
            <ContentRenderer v-else :value="page" />
          </div>
          
          <footer class="article-footer">--- END ---</footer>
        </article>  
    </div>
    
    <aside class="toc-sidebar">
      <div class="toc-container">
        <h3 class="toc-title">On this page</h3>
        <nav class="toc-nav">
          <ul class="toc-list">
            <li 
              v-for="heading in headings" 
              :key="heading.id"
              :class="['toc-item', `toc-level-${heading.level}`, { 'toc-active': activeHeading === heading.id }]"
            >
              <a 
                :href="`#${heading.id}`" 
                class="toc-link"
                @click.prevent="scrollToHeading(heading.id)"
              >
                {{ heading.text }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  </div>
</template>

<script setup>
// Get current route
const route = useRoute()

// Dynamic page metadata with route-based key
const { data: page } = await useAsyncData(`page-${route.path}`, () => 
  queryCollection('content').path(route.path).first()
)

// Get all articles list
const { data: articles } = await useAsyncData('articles-list', () => 
  queryCollection('content').all()
)

// If page doesn't exist, throw 404 error
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found'
  })
}

// Set SEO metadata
useSeoMeta({
  title: () => `${page.value.title} - Nuxt Content Starter`,
  description: () => page.value.description
})

// TOC related logic
const contentRef = ref(null)
const headings = ref([])
const activeHeading = ref('')

// Date formatting function
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Extract headings
const extractHeadings = () => {
  if (!contentRef.value) return
  
  const headingElements = contentRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
  headings.value = Array.from(headingElements).map((el, index) => {
    const level = parseInt(el.tagName.charAt(1))
    const text = el.textContent || ''
    const id = el.id || `heading-${index}`
    
    // If element doesn't have id, add one
    if (!el.id) {
      el.id = id
    }
    
    return { id, text, level, element: el }
  })
}

// Scroll to specified heading
const scrollToHeading = (id) => {
  const element = document.getElementById(id)
  if (element) {
    const offsetTop = element.offsetTop - 80 // Leave space for navigation bar
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
  }
}

// Listen to scroll, highlight current heading
const handleScroll = () => {
  if (!headings.value.length) return
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  
  // Find currently visible heading
  let currentHeading = ''
  
  for (let i = headings.value.length - 1; i >= 0; i--) {
    const heading = headings.value[i]
    const element = document.getElementById(heading.id)
    
    if (element) {
      const elementTop = element.offsetTop
      if (scrollTop >= elementTop - 100) {
        currentHeading = heading.id
        break
      }
    }
  }
  
  activeHeading.value = currentHeading
}

// Extract headings and listen to scroll after component mounted
onMounted(() => {
  nextTick(() => {
    extractHeadings()
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initialize current heading
  })
})

// Remove scroll listener when component unmounted
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Check if the current page is a data file
const isDataFile = (pageData) => {
  if (!pageData) return false
  const path = route.path
  return path.endsWith('.yaml') || path.endsWith('.json') || path.endsWith('.csv') || 
         path.includes('/config') || path.includes('/products') || path.includes('/statistics')
}

// Get file type from path
const getFileType = (path) => {
  if (path.includes('/config') || path.endsWith('.yaml')) return 'yaml'
  if (path.includes('/products') || path.endsWith('.json')) return 'json'
  if (path.includes('/statistics') || path.endsWith('.csv')) return 'csv'
  return 'unknown'
}

// Get data content excluding metadata
const getDataContent = (pageData) => {
  if (!pageData) return {}
  const { title, description, date, type, path, id, ...data } = pageData
  return data
}

// Format key for display
const formatKey = (key) => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Format YAML value for display
const formatYamlValue = (value) => {
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
      .replace(/"/g, '')
      .replace(/,/g, '')
      .replace(/[\{\}]/g, '')
      .replace(/^\s*\n/gm, '')
  }
  return String(value)
}

// Format CSV data for display
const formatCsvData = (pageData) => {
  const data = getDataContent(pageData)
  let csvOutput = ''
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      csvOutput += `${key},${value}\n`
    }
  }
  
  return csvOutput || 'No CSV data available'
}
</script>

<style scoped>
/* Page layout */
.page-layout {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  gap: 1.5rem;
  padding: 0 1rem;
}

/* Container styles - reference official documentation layout */
.container {
  flex: 1;
  min-width: 0; /* Prevent flex child overflow */
}

/* Article main content */
.main-content {
  padding: 2rem 0;
}

/* Article header */
header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.page-main-title {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.date {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Content area */
.content-body {
  line-height: 1.7;
  color: #374151;
}

/* Heading styles */
.content-body :deep(h1) {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 2rem 0 1rem 0;
  line-height: 1.3;
}

.content-body :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 1.75rem 0 0.75rem 0;
  line-height: 1.4;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.content-body :deep(h2:first-child) {
  border-top: none;
  padding-top: 0;
}

.content-body :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 1.5rem 0 0.5rem 0;
  line-height: 1.4;
}

.content-body :deep(h4) {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 1.25rem 0 0.5rem 0;
}

/* Paragraph styles */
.content-body :deep(p) {
  margin-bottom: 1rem;
}

/* List styles */
.content-body :deep(ul),
.content-body :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.content-body :deep(li) {
  margin-bottom: 0.25rem;
}

.content-body :deep(ul li) {
  list-style-type: disc;
}

.content-body :deep(ol li) {
  list-style-type: decimal;
}

/* Link styles */
.content-body :deep(a) {
  color: #059669;
  text-decoration: underline;
  font-weight: 500;
}

.content-body :deep(a:hover) {
  color: #047857;
}

/* Remove link styling from headings */
.content-body :deep(h1 a),
.content-body :deep(h2 a),
.content-body :deep(h3 a),
.content-body :deep(h4 a),
.content-body :deep(h5 a),
.content-body :deep(h6 a) {
  color: inherit;
  text-decoration: none;
  font-weight: inherit;
}

.content-body :deep(h1 a:hover),
.content-body :deep(h2 a:hover),
.content-body :deep(h3 a:hover),
.content-body :deep(h4 a:hover),
.content-body :deep(h5 a:hover),
.content-body :deep(h6 a:hover) {
  color: inherit;
  text-decoration: none;
}

/* Emphasis text */
.content-body :deep(strong) {
  font-weight: 600;
  color: #111827;
}

.content-body :deep(em) {
  font-style: italic;
}

/* Inline code */
.content-body :deep(code) {
  background-color: #f3f4f6;
  color: #e11d48;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

/* Code blocks */
.content-body :deep(pre) {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.content-body :deep(pre code) {
  background: none;
  color: inherit;
  padding: 0;
  font-size: inherit;
}

/* Blockquotes */
.content-body :deep(blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: #6b7280;
  font-style: italic;
}

/* Horizontal rules */
.content-body :deep(hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 2rem 0;
}

/* Tables */
.content-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.content-body :deep(th),
.content-body :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.content-body :deep(th) {
  background-color: #f9fafb;
  font-weight: 600;
}

/* Images */
.content-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

/* Footer */
.article-footer {
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Data content styles */
.data-content {
  line-height: 1.7;
  color: #374151;
}

.data-content .description {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  font-style: italic;
}

.yaml-sections {
  margin-top: 2rem;
}

.yaml-section {
  margin-bottom: 2rem;
}

.yaml-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.yaml-data pre,
.json-data pre,
.csv-data pre {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #1e293b;
}

.yaml-data code,
.json-data code,
.csv-data code {
  background: none;
  padding: 0;
  color: inherit;
  font-size: inherit;
}

.json-content h1,
.yaml-content h1,
.csv-content h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  line-height: 1.2;
}

/* Left sidebar articles list styles */
.articles-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.articles-container {
  position: sticky;
  top: 2rem;
  padding: 1rem 0;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.articles-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.articles-nav {
  font-size: 0.875rem;
}

.articles-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.article-item {
  margin: 0 0 1rem 0;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 1rem;
}

.article-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.article-link {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border-left: 3px solid transparent;
  cursor: pointer;
  position: relative;
}

.article-link:hover {
  background-color: #f9fafb;
  border-left-color: #d1d5db;
  transform: translateX(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.article-link:active {
  transform: translateX(1px);
  transition: transform 0.1s ease;
}

.article-active .article-link {
  background-color: #f0f9ff;
  border-left-color: #059669;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.article-active .article-link:hover {
  background-color: #e0f2fe;
  transform: translateX(2px);
}

.article-title {
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  transition: color 0.2s ease;
  flex: 1;
  min-width: 0;
}

.article-link:hover .article-title {
  color: #059669;
}

.article-active .article-title {
  color: #047857;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.25rem;
}

.article-icon {
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0;
  transition: all 0.2s ease;
  transform: translateX(-4px);
  flex-shrink: 0;
  margin-left: 0.5rem;
}

.article-link:hover .article-icon {
  opacity: 1;
  transform: translateX(0);
  color: #059669;
}

.article-active .article-icon {
  opacity: 1;
  color: #047857;
}

.article-description {
  color: #6b7280;
  font-size: 0.8rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-date {
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 500;
}

/* TOC sidebar styles */
.toc-sidebar {
  width: 240px;
  flex-shrink: 0;
  border-left: 1px solid #e5e7eb;
  padding-left: 1.5rem;
}

.toc-container {
  position: sticky;
  top: 2rem;
  padding: 1rem 0;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.toc-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.toc-nav {
  font-size: 0.875rem;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-item {
  margin: 0.5rem 0;
}

.toc-link {
  display: block;
  padding: 0.375rem 0;
  color: #6b7280;
  text-decoration: none;
  line-height: 1.4;
  transition: color 0.2s ease;
  border-left: 2px solid transparent;
  padding-left: 0.5rem;
}

.toc-link:hover {
  color: #374151;
}

.toc-active .toc-link {
  color: #059669;
  border-left-color: #059669;
  font-weight: 500;
}

/* Indentation for different heading levels */
.toc-level-1 .toc-link {
  padding-left: 0.5rem;
  font-weight: 500;
}

.toc-level-2 .toc-link {
  padding-left: 1rem;
}

.toc-level-3 .toc-link {
  padding-left: 1.5rem;
  font-size: 0.8rem;
}

.toc-level-4 .toc-link {
  padding-left: 2rem;
  font-size: 0.8rem;
}

.toc-level-5 .toc-link {
  padding-left: 2.5rem;
  font-size: 0.75rem;
}

.toc-level-6 .toc-link {
  padding-left: 3rem;
  font-size: 0.75rem;
}

/* Responsive design */
@media (max-width: 1200px) {
  .articles-sidebar {
    display: none; /* Hide articles list on medium screens */
  }
  
  .page-layout {
    max-width: 900px;
  }
}

@media (max-width: 1024px) {
  .page-layout {
    max-width: 768px;
  }
  
  .toc-sidebar {
    display: none; /* Hide TOC on smaller screens */
  }
}

@media (max-width: 640px) {
  .page-layout {
    padding: 0 0.75rem;
  }
  
  .main-content {
    padding: 1rem 0;
  }
  
  .page-main-title {
    font-size: 1.875rem;
  }
  
  .content-body :deep(h1) {
    font-size: 1.5rem;
  }
  
  .content-body :deep(h2) {
    font-size: 1.25rem;
  }
  
  .content-body :deep(h3) {
    font-size: 1.125rem;
  }
  
  .content-body :deep(pre) {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
