import { createRequire } from 'module';
import type { StorybookConfig } from '@storybook/nextjs';

const require = createRequire(import.meta.url);

const webpack = require(require.resolve('webpack', { paths: [require.resolve('@storybook/nextjs')] }));

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/nextjs',
  staticDirs: [
    '../public',
  ],
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/dist/client/components/navigation-dynamic-rendering.js': require.resolve(
        'next/dist/client/components/navigation-dynamic-rendering.browser.js'
      ),
      'next/dist/client/components/navigation-dynamic-rendering': require.resolve(
        'next/dist/client/components/navigation-dynamic-rendering.browser.js'
      ),
      'next/dist/client/components/server-async-storage.js': require.resolve(
        'next/dist/client/components/server-async-storage.browser.js'
      ),
      'next/dist/client/components/server-async-storage': require.resolve(
        'next/dist/client/components/server-async-storage.browser.js'
      ),
      'next/dist/client/components/instant-samples.js': require.resolve(
        'next/dist/client/components/instant-samples.browser.js'
      ),
      'next/dist/client/components/instant-samples': require.resolve(
        'next/dist/client/components/instant-samples.browser.js'
      ),
      'next/dist/client/components/client-boundary-params.js': require.resolve(
        'next/dist/client/components/client-boundary-params.browser.js'
      ),
      'next/dist/client/components/client-boundary-params': require.resolve(
        'next/dist/client/components/client-boundary-params.browser.js'
      ),
      'next/dist/client/components/unstable-rethrow.js': require.resolve(
        'next/dist/client/components/unstable-rethrow.browser.js'
      ),
      'next/dist/client/components/unstable-rethrow': require.resolve(
        'next/dist/client/components/unstable-rethrow.browser.js'
      ),
      // Server action mocks are also enforced by NormalModuleReplacementPlugin below,
      // because the Next.js tsconfig-paths resolver can rewrite `@/` before alias runs.
      '@/app/actions/tracking': require.resolve('./mocks/tracking.ts'),
      '@/app/dashboard/invoices/actions': require.resolve('./mocks/invoices-actions.ts'),
      '@sparticuz/chromium': false,
      'puppeteer-core': false,
      '@connectrpc/connect-node': false,
    };

    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      'stream/promises': false,
      'stream': false,
      'path': false,
      'os': false,
      'fs': false,
      'crypto': false,
      'child_process': false,
      'zlib': false,
      'http': false,
      'https': false,
      'http2': false,
      'net': false,
      'tls': false,
      'perf_hooks': false,
      'events': false,
      'url': false,
      'util': false,
      'assert': false,
      'tty': false,
      'domain': false,
      'querystring': false,
      'punycode': false,
      'string_decoder': false,
      'sys': false,
      'timers': false,
      'constants': false,
      'vm': false,
      'process': false,
    };

    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /navigation-dynamic-rendering(\.js)?$/,
        require.resolve('next/dist/client/components/navigation-dynamic-rendering.browser.js')
      ),
      new webpack.NormalModuleReplacementPlugin(
        /server-async-storage(\.js)?$/,
        require.resolve('next/dist/client/components/server-async-storage.browser.js')
      ),
      new webpack.NormalModuleReplacementPlugin(
        /instant-samples(\.js)?$/,
        require.resolve('next/dist/client/components/instant-samples.browser.js')
      ),
      new webpack.NormalModuleReplacementPlugin(
        /client-boundary-params(\.js)?$/,
        require.resolve('next/dist/client/components/client-boundary-params.browser.js')
      ),
      new webpack.NormalModuleReplacementPlugin(
        /unstable-rethrow(\.js)?$/,
        require.resolve('next/dist/client/components/unstable-rethrow.browser.js')
      ),
      // Never bundle "use server" modules (they pull in lib/db and server-only).
      new webpack.NormalModuleReplacementPlugin(
        /[\\/]app[\\/]dashboard[\\/]invoices[\\/]actions(\.ts)?$/,
        require.resolve('./mocks/invoices-actions.ts')
      ),
      new webpack.NormalModuleReplacementPlugin(
        /[\\/]app[\\/]actions[\\/]tracking(\.ts)?$/,
        require.resolve('./mocks/tracking.ts')
      )
    );

    return config;
  },
};

export default config;