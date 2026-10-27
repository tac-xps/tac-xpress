import type { Preview, Decorator } from '@storybook/nextjs'
import { ThemeProvider } from 'next-themes'
import isChromatic from 'chromatic/isChromatic'
import { MotionGlobalConfig } from 'motion/react'
import React from 'react'

import '../app/globals.css'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime.js'

// Next.js 16.4.3 compatibility patch: LayoutRouterContext.Provider in @storybook/nextjs
// lacks parentRenderTree, causing layout?.parentRenderTree.data.bfcacheId to throw TypeError in RedirectBoundary.
if (LayoutRouterContext) {
  const origUseContext = React.useContext
  // @ts-expect-error patching useContext for Storybook Next.js 16 compatibility
  React.useContext = function (context: any) {
    const val = origUseContext(context)
    if (context === LayoutRouterContext && val && typeof val === 'object' && !val.parentRenderTree) {
      val.parentRenderTree = { data: { bfcacheId: 0 } }
    }
    return val
  }

  const origCreateElement = React.createElement
  // @ts-expect-error patching createElement for Storybook Next.js 16 compatibility
  React.createElement = function (type: any, props: any, ...children: any[]) {
    if (type === LayoutRouterContext.Provider || type === LayoutRouterContext) {
      if (props && props.value && typeof props.value === 'object' && !props.value.parentRenderTree) {
        props.value.parentRenderTree = {
          data: {
            bfcacheId: 0,
          },
        }
      }
    }
    return origCreateElement.apply(this, [type, props, ...children])
  }
}

/* ─── Animation kill-switch for Chromatic ──────────────────────────────────
   Chromatic captures a snapshot mid-render which causes blurry diffs when
   GSAP / Motion / CSS animations are running. We disable everything when
   running inside Chromatic's headless browser.
─────────────────────────────────────────────────────────────────────────── */
if (typeof window !== 'undefined' && isChromatic()) {
  // Disable CSS animations and transitions globally
  if (typeof document !== 'undefined') {
    const style = document.createElement('style')
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
    document.head?.appendChild(style)
  }

  // Disable Motion (Framer Motion) animations globally
  try {
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
      // Default to desktop (1280px) for component primitives to preserve snapshot quota
      // Scoped responsive viewports ([375, 768, 1280]) are defined on page/layout stories
      viewports: [1280],
      // Delay snapshot to let fonts and images settle
      delay: 300,
    },

    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
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
