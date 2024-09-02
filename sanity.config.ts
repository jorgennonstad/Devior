// sanity.config.js or sanity.config.ts

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure'; // Use the correct tool import
import schemas from './sanity/schemas'

export const config = defineConfig({
    projectId: '373dv2xv',
    dataset: 'production',
    title: 'Devior website',
    apiVersion: '2024-08-28',
    basePath: '/admin',
    plugins: [structureTool()], // Make sure to use the correct tool
    schema: {types: schemas}
});
