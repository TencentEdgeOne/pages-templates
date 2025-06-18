import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <div><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 361 70" height="20" className="hover:transition-all hover:duration-1000 motion-reduce:hover:transition-none [mask-image:linear-gradient(60deg,#000_25%,rgba(0,0,0,.2)_50%,#000_75%)] [mask-position:0] [mask-size:400%] hover:[mask-position:100%]"><path d="M114.913 33.276V62.04h-11.57V12.95h11.059v8.341h.575q1.694-4.122 5.401-6.552 3.74-2.429 9.237-2.429 5.082 0 8.853 2.174 3.803 2.173 5.88 6.296 2.11 4.123 2.078 10.003v31.258h-11.57V32.573q0-4.922-2.557-7.702-2.524-2.78-6.999-2.78-3.036 0-5.401 1.342-2.334 1.309-3.676 3.803-1.31 2.493-1.31 6.04M176.32 63q-7.382 0-12.752-3.068-5.337-3.1-8.214-8.757-2.876-5.689-2.876-13.391 0-7.575 2.876-13.296 2.909-5.752 8.118-8.949 5.21-3.228 12.241-3.228 4.539 0 8.565 1.47a19.35 19.35 0 0 1 7.159 4.475q3.132 3.036 4.922 7.734 1.79 4.667 1.79 11.122v3.548h-40.238v-7.798h29.148q-.032-3.324-1.438-5.913a10.46 10.46 0 0 0-3.931-4.123q-2.493-1.502-5.817-1.502-3.548 0-6.232 1.726a11.9 11.9 0 0 0-4.187 4.475q-1.47 2.748-1.502 6.04v6.808q0 4.283 1.566 7.35 1.566 3.037 4.378 4.667 2.813 1.598 6.584 1.598 2.525 0 4.57-.704 2.046-.735 3.548-2.14 1.502-1.407 2.269-3.485l10.803 1.215q-1.023 4.282-3.9 7.479-2.844 3.164-7.286 4.922-4.443 1.725-10.164 1.725m34.777-50.05 9.908 18.122 10.067-18.121h12.241l-14.798 24.545 15.054 24.545h-12.177l-10.387-17.674-10.291 17.674h-12.273l14.957-24.545-14.574-24.545zm63.878 0v8.95h-28.221v-8.95zM253.722 1.19h11.569v46.086q0 2.333.704 3.58.735 1.215 1.917 1.661c1.182.446 1.662.448 2.621.448q1.087 0 1.981-.16a17 17 0 0 0 1.407-.288l1.949 9.045q-.927.32-2.652.703-1.695.384-4.155.448-4.347.127-7.831-1.31-3.483-1.47-5.529-4.539-2.014-3.068-1.981-7.67zm29.129 60.852V12.95h11.218v8.181h.512q1.342-4.25 4.602-6.551 3.26-2.334 7.511-2.333 1.981 0 3.643.479 1.662.48 2.94 1.31l-3.579 9.588q-.927-.447-2.046-.735-1.118-.287-2.524-.287-3.004 0-5.434 1.342a10.2 10.2 0 0 0-3.867 3.74q-1.406 2.364-1.406 5.496v28.86zm51.222.862q-5.784 0-10.355-2.972-4.57-2.972-7.223-8.63-2.652-5.655-2.652-13.742 0-8.182 2.684-13.807 2.717-5.657 7.319-8.533 4.602-2.91 10.259-2.909 4.316 0 7.095 1.47 2.78 1.439 4.411 3.484 1.63 2.014 2.525 3.803h.479V12.95h11.602v49.09h-11.378v-7.734h-.703q-.895 1.79-2.589 3.803-1.694 1.981-4.474 3.388t-7 1.406m3.228-9.492q3.676 0 6.265-1.981 2.588-2.014 3.931-5.593c1.343-3.58 1.342-5.167 1.342-8.342q0-4.762-1.342-8.278-1.311-3.515-3.9-5.465-2.556-1.95-6.296-1.95-3.867 0-6.456 2.014c-2.589 2.014-3.025 3.196-3.899 5.561q-1.31 3.548-1.31 8.118 0 4.602 1.31 8.214 1.342 3.58 3.931 5.657 2.621 2.045 6.424 2.045"></path><path stroke="currentColor" strokeWidth="2" d="M64.883 1.813 62.037 4.66c-14.91 14.91-39.083 14.91-53.992 0L5.198 1.813a2.394 2.394 0 0 0-3.385 3.385L4.66 8.045c14.91 14.91 14.91 39.083 0 53.992l-2.847 2.846a2.394 2.394 0 0 0 3.385 3.386l2.847-2.847c14.91-14.91 39.082-14.91 53.992 0l2.846 2.847a2.394 2.394 0 1 0 3.386-3.386l-2.847-2.846c-14.91-14.91-14.91-39.083 0-53.992l2.847-2.846a2.394 2.394 0 0 0-3.386-3.386Z"></path></svg>Nextra Template</div>,
  project: {
    link: 'https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/nextra-docs-template',
  },
  chat: {
    link: 'https://discord.com/channels/1289135101308829758/1310963802610733066',
  },
  docsRepositoryBase: 'https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/nextra-docs-template',
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Nextra Template" />
      <meta property="og:description" content="The Nextra Documentation Template" />
      <style>{`
        /* Custom table of contents styles */
        .nextra-toc [data-level="1"] {
          color: #000 !important;
          font-weight: 600 !important;
        }
        .nextra-toc [data-level="1"]:hover {
          color: #2563eb !important;
        }
        .dark .nextra-toc [data-level="1"] {
          color: #fff !important;
        }
        .dark .nextra-toc [data-level="1"]:hover {
          color: #60a5fa !important;
        }
        
        /* Sidebar navigation styles - only first level */
        /* Reset all sidebar items to normal weight first */
        .nextra-sidebar-container *,
        .nextra-sidebar * {
          font-weight: normal;
        }
        
        /* Only make first level items bold */
        .nextra-sidebar-container [data-level="1"],
        .nextra-sidebar [data-level="1"] {
          font-weight: 700 !important;
        }
        
        /* Ensure second level and below remain normal weight */
        .nextra-sidebar-container [data-level="2"],
        .nextra-sidebar-container [data-level="3"],
        .nextra-sidebar-container [data-level="4"],
        .nextra-sidebar [data-level="2"],
        .nextra-sidebar [data-level="3"],
        .nextra-sidebar [data-level="4"] {
          font-weight: normal !important;
        }
        
        /* Divider line between left sidebar and main content */
        /* Target the main content area to add left border */
        .nextra-main {
          border-left: 1px solid #e5e7eb !important;
          margin-left: 1rem !important;
        }
        
        /* Dark mode support for divider */
        .dark .nextra-main {
          border-left-color: #374151 !important;
        }
        
        /* Alternative approach - target the content area more specifically */
        .nextra-container > div:first-child {
          border-left: 1px solid #e5e7eb;
        }
        
        .dark .nextra-container > div:first-child {
          border-left-color: #374151;
        }
        
        /* Ensure proper spacing for sidebar */
        .nextra-sidebar-container {
          border-right: 1px solid #e5e7eb !important;
          margin-right: 1rem !important;
        }
        
        .dark .nextra-sidebar-container {
          border-right-color: #374151 !important;
        }
        
        /* Remove the previous TOC border styles */
        .nextra-toc {
          position: relative;
          padding-left: 1rem !important;
        }
        
        /* Remove the pseudo-element from TOC */
        .nextra-toc::before {
          display: none;
        }
        
        /* Ensure proper spacing */
        .nextra-toc {
          margin-left: 1rem !important;
        }
      `}</style>
    </>
  ),
  navigation: {
    prev: true,
    next: true
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  toc: {
    float: true,
    title: "On This Page"
  },
  editLink: {
    content: 'Edit this page on GitHub'
  },
  feedback: {
    content: 'Questions? Give us feedback →',
    labels: 'feedback'
  },
  footer: {
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>MIT 2024 ©</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Built with Nextra - The Next.js Static Site Generator
        </div>
      </div>
    )
  }
}

export default config
