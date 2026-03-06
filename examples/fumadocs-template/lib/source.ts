import { docs } from '@/.source/server';
import { loader } from 'fumadocs-core/source';

// Create a data loader for docs
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
