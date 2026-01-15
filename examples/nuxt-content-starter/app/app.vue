<template>
  <div id="app">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-container">
        <NuxtLink to="/" class="nav-brand">
          <img src="/icon.svg" alt="Nuxt Content Starter" class="nav-icon" />
          Nuxt Content Starter
        </NuxtLink>
        <div class="nav-links">
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/about" class="nav-link">About</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="main-content">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <p>&copy; 2025 Nuxt Content Starter. Built with ❤️ and Nuxt.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Set global page configuration
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>

<style>
/* Global Style Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Disable scroll bounce effect */
html, body {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

body {
  overflow-x: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fff;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navigation Bar Styles */
.navbar {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: 600;
  text-decoration: none;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #111827;
}

/* Main Content Area */
.main-content {
  flex: 1;
  padding: 2rem 0;
}

/* Footer Styles */
.footer {
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Content Styles */
.prose {
  max-width: none;
}

.prose h1 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #111827;
}

.prose h2 {
  font-size: 1.875rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #111827;
}

.prose h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #111827;
}

.prose p {
  margin-bottom: 1rem;
  color: #374151;
}

.prose ul, .prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
  color: #374151;
}

.prose code {
  background: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #dc2626;
}

.prose pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.prose pre code {
  background: none;
  color: inherit;
  padding: 0;
}

.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #6b7280;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
}

.prose a:hover {
  color: #1d4ed8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .nav-links {
    gap: 1rem;
  }
  
  .main-content {
    padding: 1rem 0;
  }
  
  .prose h1 {
    font-size: 1.875rem;
  }
  
  .prose h2 {
    font-size: 1.5rem;
  }
}
</style>
