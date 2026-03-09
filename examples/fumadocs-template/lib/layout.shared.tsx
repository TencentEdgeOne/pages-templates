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
    // 不设置 links，只展示分组标题
    links: [],
  };
}
