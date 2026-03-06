import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Shared layout options for Fumadocs
 * Following official best practices
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Fumadocs Template',
      // Enable transparent mode for modern look
      transparentMode: 'top',
    },
    links: [
      {
        text: 'Documentation',
        url: '/docs',
        active: 'nested-url',
      },
      {
        text: 'GitHub',
        url: 'https://github.com/TencentEdgeOne/pages-templates',
        external: true,
      },
    ],
  };
}
