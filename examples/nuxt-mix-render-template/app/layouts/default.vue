<template>
  <div class="app-layout">
    <!-- Top Navigation Bar -->
    <header class="header">
      <div class="container">
        <nav class="navbar">
          <!-- Logo and Title -->
          <div class="navbar-brand">
            <NuxtLink to="/" class="brand-link">
              <div class="logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="brand-text gradient-text">Nuxt Hybrid Rendering</span>
            </NuxtLink>
          </div>
          
          <!-- Navigation Menu -->
          <div class="navbar-nav">
            <NuxtLink to="/" class="nav-link" :class="{ active: $route.path === '/' }">
              Home
            </NuxtLink>
            <NuxtLink to="/ssg" class="nav-link" :class="{ active: $route.path === '/ssg' }">
              SSG Example
            </NuxtLink>
            <NuxtLink to="/isr" class="nav-link" :class="{ active: $route.path === '/isr' }">
              ISR Example
            </NuxtLink>
            <NuxtLink to="/ssr" class="nav-link" :class="{ active: $route.path === '/ssr' }">
              SSR Example
            </NuxtLink>
            <NuxtLink to="/streaming" class="nav-link" :class="{ active: $route.path === '/streaming' }">
              Streaming
            </NuxtLink>
          </div>
          
          <!-- Mobile Menu Button -->
          <button 
            class="mobile-menu-btn"
            @click="toggleMobileMenu"
            :class="{ active: isMobileMenuOpen }"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
        
        <!-- Mobile Menu -->
        <div class="mobile-menu" :class="{ open: isMobileMenuOpen }">
          <NuxtLink 
            to="/" 
            class="mobile-nav-link" 
            @click="closeMobileMenu"
            :class="{ active: $route.path === '/' }"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/ssg" 
            class="mobile-nav-link" 
            @click="closeMobileMenu"
            :class="{ active: $route.path === '/ssg' }"
          >
            SSG Example
          </NuxtLink>
          <NuxtLink 
            to="/isr" 
            class="mobile-nav-link" 
            @click="closeMobileMenu"
            :class="{ active: $route.path === '/isr' }"
          >
            ISR Example
          </NuxtLink>
          <NuxtLink 
            to="/ssr" 
            class="mobile-nav-link" 
            @click="closeMobileMenu"
            :class="{ active: $route.path === '/ssr' }"
          >
            SSR Example
          </NuxtLink>
          <NuxtLink 
            to="/streaming" 
            class="mobile-nav-link" 
            @click="closeMobileMenu"
            :class="{ active: $route.path === '/streaming' }"
          >
            Streaming
          </NuxtLink>
        </div>
      </div>
    </header>
    
    <!-- Main Content Area -->
    <main class="main-content">
      <slot />
    </main>
    
    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Nuxt Hybrid Rendering Example</h3>
            <p>A complete example project showcasing SSG, ISR, and SSR rendering modes</p>
          </div>
          <div class="footer-section">
            <h4>Rendering Modes</h4>
            <ul class="footer-links">
              <li><NuxtLink to="/ssg">Static Site Generation (SSG)</NuxtLink></li>
              <li><NuxtLink to="/isr">Incremental Static Regeneration (ISR)</NuxtLink></li>
              <li><NuxtLink to="/ssr">Server-Side Rendering (SSR)</NuxtLink></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Tech Stack</h4>
            <ul class="footer-links">
              <li><a href="https://nuxt.com" target="_blank">Nuxt.js</a></li>
              <li><a href="https://vuejs.org" target="_blank">Vue.js</a></li>
              <li><a href="https://www.typescriptlang.org" target="_blank">TypeScript</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 Nuxt Hybrid Rendering Example Project. Built with Nuxt {{ nuxtVersion }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Mobile menu state
const isMobileMenuOpen = ref(false)

// Get Nuxt version info
const nuxtVersion = '4.1.3'

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Listen to route changes and auto-close mobile menu
const route = useRoute()
watch(() => route.path, () => {
  closeMobileMenu()
})

// Page metadata
useHead({
  titleTemplate: '%s - Nuxt Hybrid Rendering Example',
  meta: [
    { name: 'description', content: 'Nuxt.js hybrid rendering example project showcasing SSG, ISR, and SSR rendering modes' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>

<style scoped>
/* App Layout */
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Top Navigation Bar */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 220, 130, 0.1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  height: 60px;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 1.25rem;
  font-weight: 600;
  text-decoration: none;
  color: var(--color-text);
}

.brand-link:hover {
  text-decoration: none;
}

.logo {
  color: var(--color-primary);
  display: flex;
  align-items: center;
}

.brand-text {
  font-weight: 700;
}

.navbar-nav {
  display: flex;
  gap: var(--spacing-xl);
  align-items: center;
}

.nav-link {
  position: relative;
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--border-radius-md);
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: var(--color-primary);
  background-color: rgba(0, 220, 130, 0.08);
  text-decoration: none;
  transform: translateY(-1px);
}

.nav-link.active {
  color: var(--color-primary);
  font-weight: 600;
  background-color: rgba(0, 220, 130, 0.12);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: 1px;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
}

.mobile-menu-btn span {
  width: 20px;
  height: 2px;
  background: var(--color-text);
  transition: all 0.3s ease;
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--color-border);
  background: var(--color-background);
}

.mobile-menu.open {
  display: flex;
}

.mobile-nav-link {
  padding: var(--spacing-md) 0;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: var(--border-radius-sm);
}

.mobile-nav-link:hover {
  color: var(--color-primary);
  background-color: rgba(0, 220, 130, 0.08);
  padding-left: var(--spacing-sm);
}

.mobile-nav-link.active {
  color: var(--color-primary);
  font-weight: 600;
  background-color: rgba(0, 220, 130, 0.12);
  padding-left: var(--spacing-sm);
}

/* Main Content Area */
.main-content {
  flex: 1;
  padding: 0;
}

/* Footer */
.footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
  padding: var(--spacing-2xl) 0;
}

.footer-section h3,
.footer-section h4 {
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
  font-size: 1rem;
}

.footer-section h3 {
  font-size: 1.125rem;
  color: var(--color-primary);
}

.footer-section p {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: var(--spacing-xs);
}

.footer-links a {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-lg) 0;
  text-align: center;
}

.footer-bottom p {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar-nav {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .main-content {
    padding: 0;
  }
}
</style>