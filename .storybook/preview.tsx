import type { Preview, Decorator } from '@storybook/nextjs'
import { ThemeProvider } from 'next-themes'
import isChromatic from 'chromatic/isChromatic'
import React from 'react'

import '../app/globals.css'

/* ─── Animation kill-switch for Chromatic ──────────────────────────────────
   Chromatic captures a snapshot mid-render which causes blurry diffs when
   GSAP / Motion / CSS animations are running. We disable everything when
   running inside Chromatic's headless browser.
─────────────────────────────────────────────────────────────────────────── */
if (isChromatic()) {
  // Disable CSS animations and transitions globally
  const style = document.createElement('style')
  style.textContent = `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `
  document.head.appendChild(style)

  // Pause GSAP global timeline (loaded lazily — safe to do at module level)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const gsap = require('gsap').default
    gsap.globalTimeline.pause()
  } catch {
    // GSAP not loaded yet — no-op
  }

  // Disable Motion (Framer Motion) animations globally
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { MotionGlobalConfig } = require('motion/react')
    MotionGlobalConfig.skipAnimations = true
  } catch {
    // motion/react not loaded yet — no-op
  }
}

/* ─── Theme decorator ───────────────────────────────────────────────────────
   Wraps every story in next-themes ThemeProvider so stories render correctly
   in both light and dark. The `globals.theme` switcher controls the active theme.
─────────────────────────────────────────────────────────────────────────── */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'light'
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme}
      forcedTheme={theme}
      enableSystem={false}
    >
      <div className={`bg-background text-foreground min-h-screen`}>
        <Story />
      </div>
    </ThemeProvider>
  )
}

const preview: Preview = {
  decorators: [withTheme],

  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile (375px)',
          styles: { width: '375px', height: '812px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet (768px)',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop (1280px)',
          styles: { width: '1280px', height: '900px' },
          type: 'desktop',
        },
        wide: {
          name: 'Wide (1920px)',
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop',
        },
      },
      defaultViewport: 'desktop',
    },

    chromatic: {
      // Capture snapshots at all 4 breakpoints in every story
      viewports: [375, 768, 1280, 1920],
      // Delay snapshot to let fonts and images settle
      delay: 300,
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
