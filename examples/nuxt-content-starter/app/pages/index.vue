<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            The git-based<br>
            <span class="hero-highlight">CMS for Nuxt.</span>
          </h1>
          <p class="hero-description">
            Nuxt Content is a module for Nuxt that provides a simple way to manage content for your application. 
            It allows developers to write their content in Markdown, YAML or JSON files and then query and display it in their application.
          </p>
          <div class="hero-actions">
            <NuxtLink to="/about" class="btn btn-primary">
              Get Started
            </NuxtLink>
          </div>
        </div>
        
        <div class="hero-demo">
          <div class="demo-tabs">
            <div 
              :class="['demo-tab', { active: activeTab === 'markdown' }]" 
              @click="switchTab('markdown')"
            >
              content/index.md
            </div>
            <div 
              :class="['demo-tab', { active: activeTab === 'vue' }]" 
              @click="switchTab('vue')"
            >
              pages/index.vue
            </div>
          </div>
          <div class="demo-content">
            <div v-if="activeTab === 'markdown'" class="demo-pane">
              <pre><code>---
title: The Mountains Website
description: A website about the most iconic mountains in the world.
---

::my-vue-hero-component{orientation="horizontal"}
#title
Welcome to the Mountains Website.
#description
This is a description of the Mountains Website.
::

This is a paragraph with **bold** and _italic_ text.</code></pre>
            </div>
            <div v-if="activeTab === 'vue'" class="demo-pane">
              <pre><code>&lt;script setup lang="ts"&gt;
const { data } = await useAsyncData('home', () => {
  return queryCollection('content').path('/').first()
})

useSeoMeta({
  title: data.value?.title,
  description: data.value?.description
})
&lt;/script&gt;

&lt;template&gt;
  &lt;ContentRenderer :value="data" /&gt;
&lt;/template&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="features">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <h3 class="feature-title">File-based CMS</h3>
            <p class="feature-description">
              Write your content in Markdown, YAML, CSV or JSON and query it in your components.
            </p>
          </div>
          
          <div class="feature-card">
            <h3 class="feature-title">Query Builder</h3>
            <p class="feature-description">
              Query your content with a MongoDB-like API to fetch the right data at the right time.
            </p>
          </div>
          
          <div class="feature-card">
            <h3 class="feature-title">SQLite powered</h3>
            <p class="feature-description">
              Add custom fields to your content, making it suitable for various types of projects.
            </p>
          </div>
          
          <div class="feature-card">
            <h3 class="feature-title">Markdown with Vue</h3>
            <p class="feature-description">
              Use Vue components in Markdown files, with props, slots and nested components.
            </p>
          </div>
          
          <div class="feature-card">
            <h3 class="feature-title">Code highlighting</h3>
            <p class="feature-description">
              Display beautiful code blocks on your website with the Shiki integration supporting VS Code themes.
            </p>
          </div>
          
          <div class="feature-card">
            <h3 class="feature-title">Deploy EdgeOne Pages</h3>
            <p class="feature-description">
              Nuxt Content works on EdgeOne Pages.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Management Section -->
    <section class="content-management">
      <div class="container">
        <div class="section-content">
          <h2 class="section-title">Everything you need for content management</h2>
          <p class="section-description">
            Combine file-based simplicity with Vue component power. Build content-rich websites, 
            from documentation pages to complex applications.
          </p>
        </div>
      </div>
    </section>

    <!-- MDC Section -->
    <section class="mdc-section">
      <div class="container">
        <div class="mdc-content">
          <div class="mdc-text">
            <h2 class="section-title">Markdown meets Vue components</h2>
            <p class="section-description">
              We created the MDC syntax to let you use Vue components with props and slots inside your Markdown files.
            </p>
            <ul class="mdc-features">
              <li>Specify props with frontmatter syntax</li>
              <li>Use components slots with <code>#</code></li>
              <li>Add any other html attributes</li>
            </ul>
          </div>
          
          <div class="mdc-demo">
            <div class="demo-tabs">
              <div class="demo-tab active">content/index.md</div>
            </div>
            <div class="demo-content">
              <pre><code>---
title: The Mountains Website
description: A website about the most iconic mountains in the world.
---

::landing-hero
---
image: /mountains/everest.jpg
---
#title
The Everest.

#description
The Everest is the highest mountain in the world, standing at 8,848 meters above sea level.
::</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Reactive data for demo tabs
const activeTab = ref('markdown')

// Function to switch tabs
const switchTab = (tab) => {
  activeTab.value = tab
}

// Set page metadata
useSeoMeta({
  title: 'Nuxt Content Starter - The git-based CMS for Nuxt',
  description: 'Nuxt Content is a module for Nuxt that provides a simple way to manage content for your application. Write in Markdown, YAML or JSON files and query them in your components.'
})
</script>

<style scoped>
.homepage {
  min-height: 100vh;
  background: white;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero Section */
.hero {
  padding: 4rem 0 6rem 0;
  background: white;
}

.hero-content {
  text-align: center;
  margin-bottom: 4rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  color: #1f2937;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.hero-highlight {
  color: #10b981;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto 2rem auto;
}

.hero-actions {
  margin-bottom: 3rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  font-size: 0.875rem;
}

.btn-primary {
  background: #10b981;
  color: white;
  border: 1px solid #10b981;
}

.btn-primary:hover {
  background: #059669;
  border-color: #059669;
}

/* Hero Demo */
.hero-demo {
  max-width: 800px;
  margin: 0 auto;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.demo-tabs {
  display: flex;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.demo-tab {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #64748b;
  border-right: 1px solid #e2e8f0;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-tab:hover {
  background: #f8fafc;
  color: #475569;
}

.demo-tab.active {
  background: white;
  color: #1e293b;
  border-bottom: 1px solid white;
  margin-bottom: -1px;
}

.demo-content {
  background: white;
}

.demo-pane {
  padding: 1.5rem;
}

.demo-pane pre {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #334155;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  overflow-x: auto;
}

/* Features Section */
.features {
  padding: 4rem 0;
  background: #f9fafb;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.feature-description {
  color: #6b7280;
  line-height: 1.5;
  font-size: 0.875rem;
}

/* Content Management Section */
.content-management {
  padding: 4rem 0;
  background: white;
  text-align: center;
}

.section-content {
  max-width: 600px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.section-description {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.6;
}

/* MDC Section */
.mdc-section {
  padding: 4rem 0;
  background: #f9fafb;
}

.mdc-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.mdc-text {
  padding-right: 2rem;
}

.mdc-features {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.mdc-features li {
  padding: 0.5rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.mdc-features li::before {
  content: "•";
  color: #10b981;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

.mdc-features code {
  background: #f1f5f9;
  color: #e11d48;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.learn-more {
  color: #10b981;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
}

.learn-more:hover {
  color: #059669;
  text-decoration: underline;
}

.mdc-demo {
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.mdc-demo .demo-content pre {
  padding: 1.5rem;
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.5;
  color: #334155;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  overflow-x: auto;
  background: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .hero {
    padding: 3rem 0 4rem 0;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.875rem;
  }
  
  .features,
  .content-management,
  .mdc-section {
    padding: 3rem 0;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .mdc-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .mdc-text {
    padding-right: 0;
  }
  
  .demo-pane pre,
  .mdc-demo .demo-content pre {
    font-size: 0.75rem;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .demo-tab {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}
</style>
