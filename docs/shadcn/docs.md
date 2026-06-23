---
title: Introduction
description: shadcn/ui is a set of beautifully-designed, accessible components and a code distribution platform. Works with your favorite frameworks and AI models. Open Source. Open Code.
---

**This is not a component library. It is how you build your component library.**

You know how most traditional component libraries work: you install a package
from NPM, import the components, and use them in your app.

This approach works well until you need to customize a component to fit your
design system or require one that isn’t included in the library. **Often, you
end up wrapping library components, writing workarounds to override styles, or
mixing components from different libraries with incompatible APIs.**

This is what shadcn/ui aims to solve. It is built around the following
principles:

- **Open Code:** The top layer of your component code is open for modification.
- **Composition:** Every component uses a common, composable interface, making
  them predictable.
- **Distribution:** A flat-file schema and command-line tool make it easy to
  distribute components.
- **Beautiful Defaults:** Carefully chosen default styles, so you get great
  design out-of-the-box.
- **AI-Ready:** Open code for LLMs to read, understand, and improve.

## Open Code

shadcn/ui hands you the actual component code. You have full control to
customize and extend the components to your needs. This means:

- **Full Transparency:** You see exactly how each component is built.
- **Easy Customization:** Modify any part of a component to fit your design and
  functionality requirements.
- **AI Integration:** Access to the code makes it straightforward for LLMs to
  read, understand, and even improve your components.

_In a typical library, if you need to change a button’s behavior, you have to
override styles or wrap the component. With shadcn/ui, you simply edit the
button code directly._

<Accordion type="single" collapsible>
  <AccordionItem value="faq-1" className="border-none">
    <AccordionTrigger>
      How do I pull upstream updates in an Open Code approach?
    </AccordionTrigger>
    <AccordionContent>
      <p>
        shadcn/ui follows a headless component architecture. This means the core
        of your app can receive fixes by updating your dependencies, for
        instance, radix-ui or input-otp.
      </p>
      <p className="mt-4">
        The topmost layer, i.e., the one closest to your design system, is not
        coupled with the implementation of the library. It stays open for
        modification.
      </p>
    </AccordionContent>
  </AccordionItem>
</Accordion>

## Composition

Every component in shadcn/ui shares a common, composable interface. **If a
component does not exist, we bring it in, make it composable, and adjust its
style to match and work with the rest of the design system.**

_A shared, composable interface means it's predictable for both your team and
LLMs. You are not learning different APIs for every new component. Even for
third-party ones._

## Distribution

shadcn/ui is also a code distribution system. It defines a schema for components
and a CLI to distribute them.

- **Schema:** A flat-file structure that defines the components, their
  dependencies, and properties.
- **CLI:** A command-line tool to distribute and install components across
  projects with cross-framework support.

_You can use the schema to distribute your components to other projects or have
AI generate completely new components based on existing schema._

## Beautiful Defaults

shadcn/ui comes with a large collection of components that have carefully chosen
default styles. They are designed to look good on their own and to work well
together as a consistent system:

- **Good Out-of-the-Box:** Your UI has a clean and minimal look without extra
  work.
- **Unified Design:** Components naturally fit with one another. Each component
  is built to match the others, keeping your UI consistent.
- **Easily Customizable:** If you want to change something, it's simple to
  override and extend the defaults.

## AI-Ready

The design of shadcn/ui makes it easy for AI tools to work with your code. Its
open code and consistent API allow AI models to read, understand, and even
generate new components.

_An AI model can learn how your components work and suggest improvements or even
create new components that integrate with your existing design._

---
title: Components
description: Here you can find all the components available in the library. We are working on adding more components.
---

- [Accordion](https://ui.shadcn.com/docs/components/accordion): A vertically
  stacked set of interactive headings that each reveal a section of content.
- [Alert](https://ui.shadcn.com/docs/components/alert): Displays a callout for
  user attention.
- [Alert Dialog](https://ui.shadcn.com/docs/components/alert-dialog): A modal
  dialog that interrupts the user with important content and expects a response.
- [Aspect Ratio](https://ui.shadcn.com/docs/components/aspect-ratio): Displays
  content within a desired ratio.
- [Avatar](https://ui.shadcn.com/docs/components/avatar): An image element with
  a fallback for representing the user.
- [Badge](https://ui.shadcn.com/docs/components/badge): Displays a badge or a
  component that looks like a badge.
- [Breadcrumb](https://ui.shadcn.com/docs/components/breadcrumb): Displays the
  path to the current resource using a hierarchy of links.
- [Button](https://ui.shadcn.com/docs/components/button): Displays a button or a
  component that looks like a button.
- [Button Group](https://ui.shadcn.com/docs/components/button-group): A
  container that groups related buttons together with consistent styling.
- [Calendar](https://ui.shadcn.com/docs/components/calendar): A calendar
  component that allows users to select a date or a range of dates.
- [Card](https://ui.shadcn.com/docs/components/card): Displays a card with
  header, content, and footer.
- [Carousel](https://ui.shadcn.com/docs/components/carousel): A carousel with
  motion and swipe built using Embla.
- [Chart](https://ui.shadcn.com/docs/components/chart): Beautiful charts. Built
  using Recharts. Copy and paste into your apps.
- [Checkbox](https://ui.shadcn.com/docs/components/checkbox): A control that
  allows the user to toggle between checked and not checked.
- [Collapsible](https://ui.shadcn.com/docs/components/collapsible): An
  interactive component which expands/collapses a panel.
- [Combobox](https://ui.shadcn.com/docs/components/combobox): Autocomplete input
  with a list of suggestions.
- [Command](https://ui.shadcn.com/docs/components/command): Command menu for
  search and quick actions.
- [Context Menu](https://ui.shadcn.com/docs/components/context-menu): Displays a
  menu of actions triggered by a right click.
- [Data Table](https://ui.shadcn.com/docs/components/data-table): Powerful table
  and datagrids built using TanStack Table.
- [Date Picker](https://ui.shadcn.com/docs/components/date-picker): A date
  picker component with range and presets.
- [Dialog](https://ui.shadcn.com/docs/components/dialog): A window overlaid on
  either the primary window or another dialog window, rendering the content
  underneath inert.
- [Direction](https://ui.shadcn.com/docs/components/direction): A provider
  component that sets the text direction for your application.
- [Drawer](https://ui.shadcn.com/docs/components/drawer): A drawer component for
  React.
- [Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu): Displays
  a menu to the user — such as a set of actions or functions — triggered by a
  button.
- [Empty](https://ui.shadcn.com/docs/components/empty): Use the Empty component
  to display an empty state.
- [Field](https://ui.shadcn.com/docs/components/field): Combine labels,
  controls, and help text to compose accessible form fields and grouped inputs.
- [Hover Card](https://ui.shadcn.com/docs/components/hover-card): For sighted
  users to preview content available behind a link.
- [Input](https://ui.shadcn.com/docs/components/input): A text input component
  for forms and user data entry with built-in styling and accessibility
  features.
- [Input Group](https://ui.shadcn.com/docs/components/input-group): Add addons,
  buttons, and helper content to inputs.
- [Input OTP](https://ui.shadcn.com/docs/components/input-otp): Accessible
  one-time password component with copy-paste functionality.
- [Item](https://ui.shadcn.com/docs/components/item): A versatile component for
  displaying content with media, title, description, and actions.
- [Kbd](https://ui.shadcn.com/docs/components/kbd): Used to display textual user
  input from keyboard.
- [Label](https://ui.shadcn.com/docs/components/label): Renders an accessible
  label associated with controls.
- [Menubar](https://ui.shadcn.com/docs/components/menubar): A visually
  persistent menu common in desktop applications that provides quick access to a
  consistent set of commands.
- [Native Select](https://ui.shadcn.com/docs/components/native-select): A styled
  native HTML select element with consistent design system integration.
- [Navigation Menu](https://ui.shadcn.com/docs/components/navigation-menu): A
  collection of links for navigating websites.
- [Pagination](https://ui.shadcn.com/docs/components/pagination): Pagination
  with page navigation, next and previous links.
- [Popover](https://ui.shadcn.com/docs/components/popover): Displays rich
  content in a portal, triggered by a button.
- [Progress](https://ui.shadcn.com/docs/components/progress): Displays an
  indicator showing the completion progress of a task, typically displayed as a
  progress bar.
- [Radio Group](https://ui.shadcn.com/docs/components/radio-group): A set of
  checkable buttons—known as radio buttons—where no more than one of the buttons
  can be checked at a time.
- [Resizable](https://ui.shadcn.com/docs/components/resizable): Accessible
  resizable panel groups and layouts with keyboard support.
- [Scroll Area](https://ui.shadcn.com/docs/components/scroll-area): Augments
  native scroll functionality for custom, cross-browser styling.
- [Select](https://ui.shadcn.com/docs/components/select): Displays a list of
  options for the user to pick from—triggered by a button.
- [Separator](https://ui.shadcn.com/docs/components/separator): Visually or
  semantically separates content.
- [Sheet](https://ui.shadcn.com/docs/components/sheet): Extends the Dialog
  component to display content that complements the main content of the screen.
- [Sidebar](https://ui.shadcn.com/docs/components/sidebar): A composable,
  themeable and customizable sidebar component.
- [Skeleton](https://ui.shadcn.com/docs/components/skeleton): Use to show a
  placeholder while content is loading.
- [Slider](https://ui.shadcn.com/docs/components/slider): An input where the
  user selects a value from within a given range.
- [Sonner](https://ui.shadcn.com/docs/components/sonner): An opinionated toast
  component for React.
- [Spinner](https://ui.shadcn.com/docs/components/spinner): An indicator that
  can be used to show a loading state.
- [Switch](https://ui.shadcn.com/docs/components/switch): A control that allows
  the user to toggle between checked and not checked.
- [Table](https://ui.shadcn.com/docs/components/table): A responsive table
  component.
- [Tabs](https://ui.shadcn.com/docs/components/tabs): A set of layered sections
  of content—known as tab panels—that are displayed one at a time.
- [Textarea](https://ui.shadcn.com/docs/components/textarea): Displays a form
  textarea or a component that looks like a textarea.
- [Toast](https://ui.shadcn.com/docs/components/toast): A succinct message that
  is displayed temporarily.
- [Toggle](https://ui.shadcn.com/docs/components/toggle): A two-state button
  that can be either on or off.
- [Toggle Group](https://ui.shadcn.com/docs/components/toggle-group): A set of
  two-state buttons that can be toggled on or off.
- [Tooltip](https://ui.shadcn.com/docs/components/tooltip): A popup that
  displays information related to an element when the element receives keyboard
  focus or the mouse hovers over it.
- [Typography](https://ui.shadcn.com/docs/components/typography): Styles for
  headings, paragraphs, lists, etc.

---

Can't find what you need? Try the [registry directory](/docs/directory) for
community-maintained components.

---
title: Installation
description: How to install dependencies and structure your app.
---

<Callout className="mb-6 border-emerald-600 bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-900">

**Recommended for new projects:** Use [shadcn/create](/create) to build your
preset visually and generate the right setup command for your framework.

</Callout>

Choose the setup that matches your starting point.

<div className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-6">
  <LinkedCard
    href="#use-create"
    className="items-start gap-1 p-6 text-sm md:p-6"
  >
    <div className="font-medium">Use shadcn/create</div>
    <div className="leading-relaxed text-muted-foreground">
      Build your preset visually and generate a setup command.
    </div>
  </LinkedCard>
  <LinkedCard href="#use-cli" className="items-start gap-1 p-6 text-sm md:p-6">
    <div className="font-medium">Use the CLI</div>
    <div className="leading-relaxed text-muted-foreground">
      Scaffold a supported template directly from the terminal.
    </div>
  </LinkedCard>
  <LinkedCard
    href="#existing-project"
    className="items-start gap-1 p-6 text-sm md:p-6"
  >
    <div className="font-medium">Existing Project</div>
    <div className="leading-relaxed text-muted-foreground">
      Add shadcn/ui to an app you already created.
    </div>
  </LinkedCard>
</div>

<div id="use-create" className="scroll-mt-24" />
## Use shadcn/create

Build your preset visually, preview your choices, and generate a
framework-specific setup command.

<Button asChild size="sm">
  <Link
    href="/create"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-6 no-underline!"
  >
    Open shadcn/create
  </Link>
</Button>

Available for Next.js, Vite, Laravel, React Router, Astro, and TanStack Start.

<div id="use-cli" className="scroll-mt-24" />
## Use the CLI

Use the CLI to scaffold a new project directly from the terminal:

```bash
npx shadcn@latest init -t [framework]
```

Supported templates: `next`, `vite`, `start`, `react-router`, and `astro`.

For Laravel, create the app first with `laravel new`, then run
`npx shadcn@latest init`.

<div id="existing-project" className="scroll-mt-24" />
## Existing Project

Each framework guide includes an `Existing Project` section with the manual
setup steps for that framework.

Pick your framework below and follow that path.

## Choose Your Framework

For Laravel, start with `laravel new` before using `shadcn/create` or
`shadcn init`.

<div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
  <LinkedCard href="/docs/installation/next">
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10"
      fill="currentColor"
    >
      <title>Next.js</title>
      <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.096-.0633c.8518-.5536 1.7525-1.3418 2.4657-2.1627 1.5179-1.7429 2.4963-3.868 2.8247-6.134.0961-.6591.1078-.854.1078-1.7475 0-.8937-.012-1.0884-.1078-1.7476-.6522-4.506-3.8592-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.42-2.4985-.5232-.169-.0176-1.0835-.0366-1.6123-.037zm4.0685 7.217c.3473 0 .4082.0053.4857.047.1127.0562.204.1642.237.2767.0186.061.0234 1.3653.0186 4.3044l-.0067 4.2175-.7436-1.14-.7461-1.14v-3.066c0-1.982.0093-3.0963.0234-3.1502.0375-.1313.1196-.2346.2323-.2955.0961-.0494.1313-.054.4997-.054z" />
    </svg>
    <p className="mt-2 font-medium">Next.js</p>
  </LinkedCard>
  <LinkedCard href="/docs/installation/vite">
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10"
      fill="currentColor"
    >
      <title>Vite</title>
      <path d="m8.286 10.578.512-8.657a.306.306 0 0 1 .247-.282L17.377.006a.306.306 0 0 1 .353.385l-1.558 5.403a.306.306 0 0 0 .352.385l2.388-.46a.306.306 0 0 1 .332.438l-6.79 13.55-.123.19a.294.294 0 0 1-.252.14c-.177 0-.35-.152-.305-.369l1.095-5.301a.306.306 0 0 0-.388-.355l-1.433.435a.306.306 0 0 1-.389-.354l.69-3.375a.306.306 0 0 0-.37-.36l-2.32.536a.306.306 0 0 1-.374-.316zm14.976-7.926L17.284 3.74l-.544 1.887 2.077-.4a.8.8 0 0 1 .84.369.8.8 0 0 1 .034.783L12.9 19.93l-.013.025-.015.023-.122.19a.801.801 0 0 1-.672.37.826.826 0 0 1-.634-.302.8.8 0 0 1-.16-.67l1.029-4.981-1.12.34a.81.81 0 0 1-.86-.262.802.802 0 0 1-.165-.67l.63-3.08-2.027.468a.808.808 0 0 1-.768-.233.81.81 0 0 1-.217-.6l.389-6.57-7.44-1.33a.612.612 0 0 0-.64.906L11.58 23.691a.612.612 0 0 0 1.066-.004l11.26-20.135a.612.612 0 0 0-.644-.9z" />
    </svg>
    <p className="mt-2 font-medium">Vite</p>
  </LinkedCard>

<LinkedCard href="/docs/installation/tanstack">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-10 w-10"
    fill="currentColor"
  >
    <path d="M6.93 13.688a.343.343 0 0 1 .468.132l.063.106c.48.851.98 1.66 1.5 2.426a35.65 35.65 0 0 0 2.074 2.742.345.345 0 0 1-.039.484l-.074.066c-2.543 2.223-4.191 2.665-4.953 1.333-.746-1.305-.477-3.672.808-7.11a.344.344 0 0 1 .153-.18ZM17.75 16.3a.34.34 0 0 1 .395.27l.02.1c.628 3.286.187 4.93-1.325 4.93-1.48 0-3.36-1.402-5.649-4.203a.327.327 0 0 1-.074-.222c0-.188.156-.34.344-.34h.121a32.984 32.984 0 0 0 2.809-.098c1.07-.086 2.191-.23 3.359-.437zm.871-6.977a.353.353 0 0 1 .445-.21l.102.034c3.262 1.11 4.504 2.332 3.719 3.664-.766 1.305-2.993 2.254-6.684 2.848a.362.362 0 0 1-.238-.047.343.343 0 0 1-.125-.476l.062-.106a34.07 34.07 0 0 0 1.367-2.523c.477-.989.93-2.051 1.352-3.184zM7.797 8.34a.362.362 0 0 1 .238.047.343.343 0 0 1 .125.476l-.062.106a34.088 34.088 0 0 0-1.367 2.523c-.477.988-.93 2.051-1.352 3.184a.353.353 0 0 1-.445.21l-.102-.034C1.57 13.742.328 12.52 1.113 11.188 1.88 9.883 4.106 8.934 7.797 8.34Zm5.281-3.984c2.543-2.223 4.192-2.664 4.953-1.332.746 1.304.477 3.671-.808 7.109a.344.344 0 0 1-.153.18.343.343 0 0 1-.468-.133l-.063-.106a34.64 34.64 0 0 0-1.5-2.426 35.65 35.65 0 0 0-2.074-2.742.345.345 0 0 1 .039-.484ZM7.285 2.274c1.48 0 3.364 1.402 5.649 4.203a.349.349 0 0 1 .078.218.348.348 0 0 1-.348.344l-.117-.004a34.584 34.584 0 0 0-2.809.102 35.54 35.54 0 0 0-3.363.437.343.343 0 0 1-.394-.273l-.02-.098c-.629-3.285-.188-4.93 1.324-4.93Zm2.871 5.812h3.688a.638.638 0 0 1 .55.316l1.848 3.22a.644.644 0 0 1 0 .628l-1.847 3.223a.638.638 0 0 1-.551.316h-3.688a.627.627 0 0 1-.547-.316L7.758 12.25a.644.644 0 0 1 0-.629L9.61 8.402a.627.627 0 0 1 .546-.316Zm3.23.793a.638.638 0 0 1 .552.316l1.39 2.426a.644.644 0 0 1 0 .629l-1.39 2.43a.638.638 0 0 1-.551.316h-2.774a.627.627 0 0 1-.546-.316l-1.395-2.43a.644.644 0 0 1 0-.629l1.395-2.426a.627.627 0 0 1 .546-.316Zm-.491.867h-1.79a.624.624 0 0 0-.546.316l-.899 1.56a.644.644 0 0 0 0 .628l.899 1.563a.632.632 0 0 0 .547.316h1.789a.632.632 0 0 0 .547-.316l.898-1.563a.644.644 0 0 0 0-.629l-.898-1.558a.624.624 0 0 0-.547-.317Zm-.477.828c.227 0 .438.121.547.317l.422.73a.625.625 0 0 1 0 .629l-.422.734a.627.627 0 0 1-.547.317h-.836a.632.632 0 0 1-.547-.317l-.422-.734a.625.625 0 0 1 0-.629l.422-.73a.632.632 0 0 1 .547-.317zm-.418.817a.548.548 0 0 0-.473.273.547.547 0 0 0 0 .547.544.544 0 0 0 .473.27.544.544 0 0 0 .473-.27.547.547 0 0 0 0-.547.548.548 0 0 0-.473-.273Zm-4.422.546h.98M18.98 7.75c.391-1.895.477-3.344.223-4.398-.148-.63-.422-1.137-.84-1.508-.441-.39-1-.582-1.625-.582-1.035 0-2.12.472-3.281 1.367a14.9 14.9 0 0 0-1.473 1.316 1.206 1.206 0 0 0-.136-.144c-1.446-1.285-2.66-2.082-3.7-2.39-.617-.184-1.195-.2-1.722-.024-.559.187-1.004.574-1.317 1.117-.515.894-.652 2.074-.46 3.527.078.59.214 1.235.402 1.934a1.119 1.119 0 0 0-.215.047C3.008 8.62 1.71 9.269.926 10.015c-.465.442-.77.938-.883 1.481-.113.578 0 1.156.312 1.7.516.894 1.465 1.597 2.817 2.155.543.223 1.156.426 1.844.61a1.023 1.023 0 0 0-.07.226c-.391 1.891-.477 3.344-.223 4.395.148.629.425 1.14.84 1.508.44.39 1 .582 1.625.582 1.035 0 2.12-.473 3.28-1.364.477-.37.973-.816 1.489-1.336a1.2 1.2 0 0 0 .195.227c1.446 1.285 2.66 2.082 3.7 2.39.617.184 1.195.2 1.722.024.559-.187 1.004-.574 1.317-1.117.515-.894.652-2.074.46-3.527a14.941 14.941 0 0 0-.425-2.012 1.225 1.225 0 0 0 .238-.047c1.828-.61 3.125-1.258 3.91-2.004.465-.441.77-.937.883-1.48.113-.578 0-1.157-.313-1.7-.515-.894-1.464-1.597-2.816-2.156a14.576 14.576 0 0 0-1.906-.625.865.865 0 0 0 .059-.195z" />
  </svg>
  <p className="mt-2 font-medium">TanStack Start</p>
</LinkedCard>
<LinkedCard href="/docs/installation/laravel">
  <svg
    role="img"
    viewBox="0 0 62 65"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
  >
    <path d="M61.8548 14.6253C61.8778 14.7102 61.8895 14.7978 61.8897 14.8858V28.5615C61.8898 28.737 61.8434 28.9095 61.7554 29.0614C61.6675 29.2132 61.5409 29.3392 61.3887 29.4265L49.9104 36.0351V49.1337C49.9104 49.4902 49.7209 49.8192 49.4118 49.9987L25.4519 63.7916C25.3971 63.8227 25.3372 63.8427 25.2774 63.8639C25.255 63.8714 25.2338 63.8851 25.2101 63.8913C25.0426 63.9354 24.8666 63.9354 24.6991 63.8913C24.6716 63.8838 24.6467 63.8689 24.6205 63.8589C24.5657 63.8389 24.5084 63.8215 24.456 63.7916L0.501061 49.9987C0.348882 49.9113 0.222437 49.7853 0.134469 49.6334C0.0465019 49.4816 0.000120578 49.3092 0 49.1337L0 8.10652C0 8.01678 0.0124642 7.92953 0.0348998 7.84477C0.0423783 7.8161 0.0598282 7.78993 0.0697995 7.76126C0.0884958 7.70891 0.105946 7.65531 0.133367 7.6067C0.152063 7.5743 0.179485 7.54812 0.20192 7.51821C0.230588 7.47832 0.256763 7.43719 0.290416 7.40229C0.319084 7.37362 0.356476 7.35243 0.388883 7.32751C0.425029 7.29759 0.457436 7.26518 0.498568 7.2415L12.4779 0.345059C12.6296 0.257786 12.8015 0.211853 12.9765 0.211853C13.1515 0.211853 13.3234 0.257786 13.475 0.345059L25.4531 7.2415H25.4556C25.4955 7.26643 25.5292 7.29759 25.5653 7.32626C25.5977 7.35119 25.6339 7.37362 25.6625 7.40104C25.6974 7.43719 25.7224 7.47832 25.7523 7.51821C25.7735 7.54812 25.8021 7.5743 25.8196 7.6067C25.8483 7.65656 25.8645 7.70891 25.8844 7.76126C25.8944 7.78993 25.9118 7.8161 25.9193 7.84602C25.9423 7.93096 25.954 8.01853 25.9542 8.10652V33.7317L35.9355 27.9844V14.8846C35.9355 14.7973 35.948 14.7088 35.9704 14.6253C35.9792 14.5954 35.9954 14.5692 36.0053 14.5405C36.0253 14.4882 36.0427 14.4346 36.0702 14.386C36.0888 14.3536 36.1163 14.3274 36.1375 14.2975C36.1674 14.2576 36.1923 14.2165 36.2272 14.1816C36.2559 14.1529 36.292 14.1317 36.3244 14.1068C36.3618 14.0769 36.3942 14.0445 36.4341 14.0208L48.4147 7.12434C48.5663 7.03694 48.7383 6.99094 48.9133 6.99094C49.0883 6.99094 49.2602 7.03694 49.4118 7.12434L61.3899 14.0208C61.4323 14.0457 61.4647 14.0769 61.5021 14.1055C61.5333 14.1305 61.5694 14.1529 61.5981 14.1803C61.633 14.2165 61.6579 14.2576 61.6878 14.2975C61.7103 14.3274 61.7377 14.3536 61.7551 14.386C61.7838 14.4346 61.8 14.4882 61.8199 14.5405C61.8312 14.5692 61.8474 14.5954 61.8548 14.6253ZM59.893 27.9844V16.6121L55.7013 19.0252L49.9104 22.3593V33.7317L59.8942 27.9844H59.893ZM47.9149 48.5566V37.1768L42.2187 40.4299L25.953 49.7133V61.2003L47.9149 48.5566ZM1.99677 9.83281V48.5566L23.9562 61.199V49.7145L12.4841 43.2219L12.4804 43.2194L12.4754 43.2169C12.4368 43.1945 12.4044 43.1621 12.3682 43.1347C12.3371 43.1097 12.3009 43.0898 12.2735 43.0624L12.271 43.0586C12.2386 43.0275 12.2162 42.9888 12.1887 42.9539C12.1638 42.9203 12.1339 42.8916 12.114 42.8567L12.1127 42.853C12.0903 42.8156 12.0766 42.7707 12.0604 42.7283C12.0442 42.6909 12.023 42.656 12.013 42.6161C12.0005 42.5688 11.998 42.5177 11.9931 42.4691C11.9881 42.4317 11.9781 42.3943 11.9781 42.3569V15.5801L6.18848 12.2446L1.99677 9.83281ZM12.9777 2.36177L2.99764 8.10652L12.9752 13.8513L22.9541 8.10527L12.9752 2.36177H12.9777ZM18.1678 38.2138L23.9574 34.8809V9.83281L19.7657 12.2459L13.9749 15.5801V40.6281L18.1678 38.2138ZM48.9133 9.14105L38.9344 14.8858L48.9133 20.6305L58.8909 14.8846L48.9133 9.14105ZM47.9149 22.3593L42.124 19.0252L37.9323 16.6121V27.9844L43.7219 31.3174L47.9149 33.7317V22.3593ZM24.9533 47.987L39.59 39.631L46.9065 35.4555L36.9352 29.7145L25.4544 36.3242L14.9907 42.3482L24.9533 47.987Z" />
  </svg>
  <p className="mt-2 font-medium">Laravel</p>
</LinkedCard>
<LinkedCard href="/docs/installation/react-router">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-10 w-10"
    fill="currentColor"
  >
    <path d="M12.118 5.466a2.306 2.306 0 0 0-.623.08c-.278.067-.702.332-.953.583-.41.423-.49.609-.662 1.469-.08.423.41 1.43.847 1.734.45.317 1.085.502 2.065.608 1.429.16 1.84.636 1.84 2.197 0 1.377-.385 1.747-1.96 1.906-1.707.172-2.58.834-2.765 2.117-.106.781.41 1.76 1.125 2.091 1.627.768 3.15-.198 3.467-2.196.211-1.284.622-1.642 1.998-1.747 1.588-.133 2.409-.675 2.713-1.787.278-1.02-.304-2.157-1.297-2.554-.264-.106-.873-.238-1.35-.291-1.495-.16-1.879-.424-2.038-1.39-.225-1.337-.317-1.562-.794-2.09a2.174 2.174 0 0 0-1.613-.73zm-4.785 4.36a2.145 2.145 0 0 0-.497.048c-1.469.318-2.17 2.051-1.35 3.295 1.178 1.774 3.944.953 3.97-1.177.012-1.193-.98-2.143-2.123-2.166zM2.089 14.19a2.22 2.22 0 0 0-.427.052c-2.158.476-2.237 3.626-.106 4.182.53.145.582.145 1.111.013 1.191-.318 1.866-1.456 1.549-2.607-.278-1.02-1.144-1.664-2.127-1.64zm19.824.008c-.233.002-.477.058-.784.162-1.39.477-1.866 2.092-.98 3.336.557.794 1.96 1.058 2.82.516 1.416-.874 1.363-3.057-.093-3.746-.38-.186-.663-.271-.963-.268z" />
  </svg>
  <p className="mt-2 font-medium">React Router</p>
</LinkedCard>
<LinkedCard href="/docs/installation/astro">
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
    fill="currentColor"
  >
    <title>Astro</title>
    <path
      d="M16.074 16.86C15.354 17.476 13.917 17.895 12.262 17.895C10.23 17.895 8.527 17.263 8.075 16.412C7.914 16.9 7.877 17.458 7.877 17.814C7.877 17.814 7.771 19.564 8.988 20.782C8.988 20.15 9.501 19.637 10.133 19.637C11.216 19.637 11.215 20.582 11.214 21.349V21.418C11.214 22.582 11.925 23.579 12.937 24C12.7812 23.6794 12.7005 23.3275 12.701 22.971C12.701 21.861 13.353 21.448 14.111 20.968C14.713 20.585 15.383 20.161 15.844 19.308C16.0926 18.8493 16.2225 18.3357 16.222 17.814C16.2221 17.4903 16.1722 17.1685 16.074 16.86ZM15.551 0.6C15.747 0.844 15.847 1.172 16.047 1.829L20.415 16.176C18.7743 15.3246 17.0134 14.7284 15.193 14.408L12.35 4.8C12.3273 4.72337 12.2803 4.65616 12.2162 4.60844C12.152 4.56072 12.0742 4.53505 11.9943 4.53528C11.9143 4.5355 11.8366 4.56161 11.7727 4.60969C11.7089 4.65777 11.6623 4.72524 11.64 4.802L8.83 14.405C7.00149 14.724 5.23264 15.3213 3.585 16.176L7.974 1.827C8.174 1.171 8.274 0.843 8.471 0.6C8.64406 0.385433 8.86922 0.218799 9.125 0.116C9.415 0 9.757 0 10.443 0H13.578C14.264 0 14.608 0 14.898 0.117C15.1529 0.219851 15.3783 0.386105 15.551 0.6Z"
      fill="currentColor"
    />
  </svg>
  <p className="mt-2 font-medium">Astro</p>
</LinkedCard>
  <LinkedCard href="/docs/installation/manual">
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10"
      fill="currentColor"
    >
      <title>React</title>
      <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
    </svg>
    <p className="mt-2 font-medium">Manual</p>
  </LinkedCard>
</div>

---
title: Theming
description: Using CSS variables and theme tokens.
---

<Callout>

Want to build your theme visually? Use [shadcn/create](/create) to preview
colors, radius, fonts, and icons, then generate a preset for your project.

</Callout>

We use and recommend CSS variables for theming.

This gives you semantic theme tokens like `background`, `foreground`, and
`primary` that components use by default. Override those tokens in your CSS to
change the look of your app without rewriting component classes.

```tsx /bg-background/ /text-foreground/
<div className="bg-background text-foreground" />;
```

To use CSS variables for theming, set `tailwind.cssVariables` to `true` in your
`components.json` file. This is the default.

```json {8} title="components.json" showLineNumbers
{
    "style": "base-nova",
    "rsc": true,
    "tailwind": {
        "config": "",
        "css": "app/globals.css",
        "baseColor": "neutral",
        "cssVariables": true
    }
}
```

Tailwind maps these tokens into utilities like `bg-background`,
`text-foreground`, `border-border`, and `ring-ring`.

Dark mode works by overriding the same tokens inside a `.dark` selector. See the
[dark mode docs](/docs/dark-mode/next) for adding a theme provider and toggling
the `.dark` class.

## Token Convention

We use semantic background and foreground pairs. The base token controls the
surface color and the `-foreground` token controls the text and icon color that
sits on that surface.

<Callout className="mt-4">

The background suffix is omitted for the surface token. For example, `primary`
pairs with `primary-foreground`.

</Callout>

Given the following CSS variables:

```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

The `background` color of the following component will be `var(--primary)` and
the `foreground` color will be `var(--primary-foreground)`.

```tsx
<div className="bg-primary text-primary-foreground">Hello</div>;
```

## Theme Tokens

These tokens live in your CSS file under `:root` and `.dark`.

| Token                                            | What it controls                                       | Used by                                                                      |
| ------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `background` / `foreground`                      | The default app background and text color.             | The page shell, page sections, and default text.                             |
| `card` / `card-foreground`                       | Elevated surfaces and the content inside them.         | `Card`, dashboard panels, settings panels.                                   |
| `popover` / `popover-foreground`                 | Floating surfaces and the content inside them.         | `Popover`, `DropdownMenu`, `ContextMenu`, and other overlays.                |
| `primary` / `primary-foreground`                 | High-emphasis actions and brand surfaces.              | Default `Button`, selected states, badges, and active accents.               |
| `secondary` / `secondary-foreground`             | Lower-emphasis filled actions and supporting surfaces. | Secondary buttons, secondary badges, and supporting UI.                      |
| `muted` / `muted-foreground`                     | Subtle surfaces and lower-emphasis content.            | Descriptions, placeholders, empty states, helper text, and subdued surfaces. |
| `accent` / `accent-foreground`                   | Interactive hover, focus, and active surfaces.         | Ghost buttons, menu highlight states, hovered rows, and selected items.      |
| `destructive`                                    | Destructive actions and error emphasis.                | Destructive buttons, invalid states, and destructive menu items.             |
| `border`                                         | Default borders and separators.                        | Cards, menus, tables, separators, and layout dividers.                       |
| `input`                                          | Form control borders and input surface treatment.      | `Input`, `Textarea`, `Select`, and outline-style controls.                   |
| `ring`                                           | Focus rings and outlines.                              | Buttons, inputs, checkboxes, menus, and other focusable controls.            |
| `chart-1` ... `chart-5`                          | The default chart palette.                             | Charts and chart-driven dashboard blocks.                                    |
| `sidebar` / `sidebar-foreground`                 | The base sidebar surface and default sidebar text.     | The `Sidebar` container and its default content.                             |
| `sidebar-primary` / `sidebar-primary-foreground` | High-emphasis actions inside the sidebar.              | Active items, icon tiles, badges, and sidebar CTAs.                          |
| `sidebar-accent` / `sidebar-accent-foreground`   | Hover and selected states inside the sidebar.          | Sidebar menu hover states, open items, and interactive rows.                 |
| `sidebar-border`                                 | Sidebar-specific borders and separators.               | Sidebar headers, groups, and internal dividers.                              |
| `sidebar-ring`                                   | Sidebar-specific focus rings.                          | Focused controls inside the sidebar.                                         |
| `radius`                                         | The base corner radius scale.                          | Cards, inputs, buttons, popovers, and the derived `radius-*` tokens.         |

<Callout className="mt-4">

The chart tokens are covered in more detail in the
[Chart theming docs](/docs/components/chart#theming).

</Callout>

## Radius Scale

`--radius` is the base radius token for your theme.

We derive a small radius scale from it so components can use consistent corner
sizes while still sharing a single source of truth.

```css title="app/globals.css" showLineNumbers
@theme inline {
    --radius-sm: calc(var(--radius) * 0.6);
    --radius-md: calc(var(--radius) * 0.8);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) * 1.4);
    --radius-2xl: calc(var(--radius) * 1.8);
    --radius-3xl: calc(var(--radius) * 2.2);
    --radius-4xl: calc(var(--radius) * 2.6);
}
```

This means:

- `radius-lg` is the base value.
- Smaller radii scale down from `--radius`.
- Larger radii scale up from `--radius`.
- Changing `--radius` updates the entire radius scale.

## Adding New Tokens

To add a new token, define it under `:root` and `.dark`, then expose it to
Tailwind with `@theme inline`.

```css title="app/globals.css" showLineNumbers
:root {
    --warning: oklch(0.84 0.16 84);
    --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
    --warning: oklch(0.41 0.11 46);
    --warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
    --color-warning: var(--warning);
    --color-warning-foreground: var(--warning-foreground);
}
```

You can now use `bg-warning` and `text-warning-foreground` in your components.

```tsx /bg-warning/ /text-warning-foreground/
<div className="bg-warning text-warning-foreground" />;
```

## Base Colors

`tailwind.baseColor` controls the default token values generated for your
project when you run `init` or use a preset.

The available base colors are: **Neutral**, **Stone**, **Zinc**, **Mauve**,
**Olive**, **Mist**, and **Taupe**.

## Default Theme CSS

The following is the full default `neutral` theme scaffold. Copy it into your
global CSS file and adjust the tokens as needed.

<CodeCollapsibleWrapper>

```css showLineNumbers title="app/globals.css"
@import "tailwindcss";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-popover: var(--popover);
    --color-popover-foreground: var(--popover-foreground);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-accent: var(--accent);
    --color-accent-foreground: var(--accent-foreground);
    --color-destructive: var(--destructive);
    --color-border: var(--border);
    --color-input: var(--input);
    --color-ring: var(--ring);
    --color-chart-1: var(--chart-1);
    --color-chart-2: var(--chart-2);
    --color-chart-3: var(--chart-3);
    --color-chart-4: var(--chart-4);
    --color-chart-5: var(--chart-5);
    --color-sidebar: var(--sidebar);
    --color-sidebar-foreground: var(--sidebar-foreground);
    --color-sidebar-primary: var(--sidebar-primary);
    --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
    --color-sidebar-accent: var(--sidebar-accent);
    --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
    --color-sidebar-border: var(--sidebar-border);
    --color-sidebar-ring: var(--sidebar-ring);
    --radius-sm: calc(var(--radius) * 0.6);
    --radius-md: calc(var(--radius) * 0.8);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) * 1.4);
    --radius-2xl: calc(var(--radius) * 1.8);
    --radius-3xl: calc(var(--radius) * 2.2);
    --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
    --radius: 0.625rem;
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0 0);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
    --chart-3: oklch(0.398 0.07 227.392);
    --chart-4: oklch(0.828 0.189 84.429);
    --chart-5: oklch(0.769 0.188 70.08);
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.205 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);
}

.dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.205 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.556 0 0);
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
    --sidebar: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.488 0.243 264.376);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
    * {
        @apply border-border outline-ring/50;
    }

    body {
        @apply bg-background text-foreground;
    }
}
```

</CodeCollapsibleWrapper>

## Without CSS Variables

If you do not want to use CSS variables, the CLI can generate components with
inline Tailwind color utilities instead.

```bash
npx shadcn@latest init --no-css-variables
```

This sets `tailwind.cssVariables` to `false` in your `components.json` file.

```tsx /bg-zinc-950/ /text-zinc-50/ /dark:bg-white/ /dark:text-zinc-950/
<div className="bg-zinc-950 text-zinc-50 dark:bg-white dark:text-zinc-950" />;
```

<Callout className="mt-4">

This is an installation-time choice. To switch an existing project, delete and
re-install your components.

</Callout>

---
title: shadcn
description: Use the shadcn CLI to add components to your project.
---

import { TriangleAlertIcon } from "lucide-react"

## init

Use the `init` command to initialize configuration and dependencies for an
existing project, or create a new project with `--name`.

The `init` command installs dependencies, adds the `cn` util and configures CSS
variables for the project.

```bash
npx shadcn@latest init
```

**Options**

```bash
Usage: shadcn init [options] [components...]

initialize your project and install dependencies

Arguments:
  components                 names, url or local path to component

Options:
  -t, --template <template>  the template to use. (next, vite, start, react-router, laravel, astro)
  -b, --base <base>          the component library to use. (radix, base)
  -p, --preset [name]        use a preset configuration
  -y, --yes                  skip confirmation prompt. (default: true)
  -d, --defaults             use default configuration: --template=next --preset=nova (default: false)
  -f, --force                force overwrite of existing configuration. (default: false)
  -c, --cwd <cwd>            the working directory. defaults to the current directory.
  -n, --name <name>          the name for the new project.
  -s, --silent               mute output. (default: false)
  --css-variables            use css variables for theming. (default: true)
  --no-css-variables         do not use css variables for theming.
  --monorepo                 scaffold a monorepo project.
  --no-monorepo              skip the monorepo prompt.
  --rtl                      enable RTL support.
  --no-rtl                   disable RTL support.
  --pointer                  enable pointer cursor for buttons.
  --no-pointer               disable pointer cursor for buttons.
  --reinstall                re-install existing UI components.
  --no-reinstall             do not re-install existing UI components.
  -h, --help                 display help for command
```

The `create` command is an alias for `init`:

```bash
npx shadcn@latest create
```

---

## add

Use the `add` command to add components and dependencies to your project.

```bash
npx shadcn@latest add [component]
```

**Options**

```bash
Usage: shadcn add [options] [components...]

add a component to your project

Arguments:
  components           name, url or local path to component

Options:
  -y, --yes            skip confirmation prompt. (default: false)
  -o, --overwrite      overwrite existing files. (default: false)
  -c, --cwd <cwd>      the working directory. defaults to the current directory.
  -a, --all            add all available components (default: false)
  -p, --path <path>    the path to add the component to.
  -s, --silent         mute output. (default: false)
  --dry-run            preview changes without writing files. (default: false)
  --diff [path]        show diff for a file.
  --view [path]        show file contents.
  -h, --help           display help for command
```

---

## apply

Use the `apply` command to apply a preset to an existing project.

```bash
npx shadcn@latest apply a2r6bw
```

You can apply only the theme or fonts from a preset without reinstalling UI
components:

```bash
npx shadcn@latest apply a2r6bw --only theme
```

Supported values for `--only` are `theme` and `font`.

**Options**

```bash
Usage: shadcn apply [options] [preset]

apply a preset to an existing project

Arguments:
  preset             the preset to apply

Options:
  --preset <preset>  preset configuration to apply
  --only [parts]     apply only parts of a preset: theme, font
  -y, --yes          skip confirmation prompt. (default: false)
  -c, --cwd <cwd>    the working directory. defaults to the current directory.
  -s, --silent       mute output. (default: false)
  -h, --help         display help for command
```

---

## preset

Use the `preset` command to inspect preset codes and resolve the preset for an
existing project.

```bash
npx shadcn@latest preset decode a2r6bw
```

### preset decode

Use `preset decode` to decode a preset code.

```bash
npx shadcn@latest preset decode a2r6bw
```

**Options**

```bash
Usage: shadcn preset decode [options] <code>

decode a preset code

Arguments:
  code        the preset code to decode

Options:
  --json      output as JSON. (default: false)
  -h, --help  display help for command
```

### preset resolve

Use `preset resolve` to resolve the preset from the current project.

```bash
npx shadcn@latest preset resolve
```

The `preset info` command is an alias for `preset resolve`:

```bash
npx shadcn@latest preset info
```

**Options**

```bash
Usage: shadcn preset resolve|info [options]

resolve a preset from your project

Options:
  -c, --cwd <cwd>  the working directory. defaults to the current directory.
  --json            output as JSON. (default: false)
  -h, --help        display help for command
```

### preset url

Use `preset url` to print the create URL for a preset code.

```bash
npx shadcn@latest preset url a2r6bw
```

**Options**

```bash
Usage: shadcn preset url [options] <code>

get the create URL for a preset code

Arguments:
  code        the preset code

Options:
  -h, --help  display help for command
```

### preset open

Use `preset open` to open a preset code in the browser.

```bash
npx shadcn@latest preset open a2r6bw
```

**Options**

```bash
Usage: shadcn preset open [options] <code>

open a preset code in the browser

Arguments:
  code        the preset code

Options:
  -h, --help  display help for command
```

---

## view

Use the `view` command to view items from the registry before installing them.

```bash
npx shadcn@latest view [item]
```

You can view multiple items at once:

```bash
npx shadcn@latest view button card dialog
```

Or view items from namespaced registries:

```bash
npx shadcn@latest view @acme/auth @v0/dashboard
```

**Options**

```bash
Usage: shadcn view [options] <items...>

view items from the registry

Arguments:
  items            the item names or URLs to view

Options:
  -c, --cwd <cwd>  the working directory. defaults to the current directory.
  -h, --help       display help for command
```

---

## search

Use the `search` command to search for items from registries.

```bash
npx shadcn@latest search [registry]
```

You can search with a query:

```bash
npx shadcn@latest search @shadcn -q "button"
```

Or search multiple registries at once:

```bash
npx shadcn@latest search @shadcn @v0 @acme
```

The `list` command is an alias for `search`:

```bash
npx shadcn@latest list @acme
```

**Options**

```bash
Usage: shadcn search|list [options] <registries...>

search items from registries

Arguments:
  registries             the registry names or urls to search items from. Names
                         must be prefixed with @.

Options:
  -c, --cwd <cwd>        the working directory. defaults to the current directory.
  -q, --query <query>    query string
  -l, --limit <number>   maximum number of items to display per registry (default: "100")
  -o, --offset <number>  number of items to skip (default: "0")
  -h, --help             display help for command
```

---

## build

Use the `build` command to generate the registry JSON files.

```bash
npx shadcn@latest build
```

This command reads the `registry.json` file and generates the registry JSON
files in the `public/r` directory.

**Options**

```bash
Usage: shadcn build [options] [registry]

build components for a shadcn registry

Arguments:
  registry             path to registry.json file (default: "./registry.json")

Options:
  -o, --output <path>  destination directory for json files (default: "./public/r")
  -c, --cwd <cwd>      the working directory. defaults to the current directory.
  -h, --help           display help for command
```

To customize the output directory, use the `--output` option.

```bash
npx shadcn@latest build --output ./public/registry
```

---

## docs

Use the `docs` command to fetch documentation and API references for components.

```bash
npx shadcn@latest docs [component]
```

**Options**

```bash
Usage: shadcn docs [options] [component]

fetch documentation and API references for components

Arguments:
  component          the component to get docs for

Options:
  -c, --cwd <cwd>    the working directory. defaults to the current directory.
  -b, --base <base>  the base to use either 'base' or 'radix'. defaults to project base.
  --json             output as JSON. (default: false)
  -h, --help         display help for command
```

---

## info

Use the `info` command to get information about your project.

```bash
npx shadcn@latest info
```

**Options**

```bash
Usage: shadcn info [options]

get information about your project

Options:
  -c, --cwd <cwd>  the working directory. defaults to the current directory.
  --json            output as JSON. (default: false)
  -h, --help        display help for command
```

---

## migrate

Use the `migrate` command to run migrations on your project.

```bash
npx shadcn@latest migrate [migration]
```

**Available Migrations**

| Migration | Description                                             |
| --------- | ------------------------------------------------------- |
| `icons`   | Migrate your UI components to a different icon library. |
| `radix`   | Migrate to radix-ui.                                    |
| `rtl`     | Migrate your components to support RTL (right-to-left). |

**Options**

```bash
Usage: shadcn migrate [options] [migration] [path]

run a migration.

Arguments:
  migration        the migration to run.
  path             optional path or glob pattern to migrate.

Options:
  -c, --cwd <cwd>  the working directory. defaults to the current directory.
  -l, --list       list all migrations. (default: false)
  -y, --yes        skip confirmation prompt. (default: false)
  -h, --help       display help for command
```

---

### migrate rtl

The `rtl` migration transforms your components to support RTL (right-to-left)
languages.

```bash
npx shadcn@latest migrate rtl
```

This will:

1. Update `components.json` to set `rtl: true`
2. Transform physical CSS properties to logical equivalents (e.g., `ml-4` →
   `ms-4`, `text-left` → `text-start`)
3. Add `rtl:` variants where needed (e.g., `space-x-4` →
   `space-x-4 rtl:space-x-reverse`)

**Migrate specific files**

You can migrate specific files or use glob patterns:

```bash
# Migrate a specific file
npx shadcn@latest migrate rtl src/components/ui/button.tsx

# Migrate files matching a glob pattern
npx shadcn@latest migrate rtl "src/components/ui/**"
```

If no path is provided, the migration will transform all files in your `ui`
directory (from `components.json`).

---

### migrate radix

The `radix` migration updates your imports from individual `@radix-ui/react-*`
packages to the unified `radix-ui` package.

```bash
npx shadcn@latest migrate radix
```

This will:

1. Transform imports from `@radix-ui/react-*` to `radix-ui`
2. Add the `radix-ui` package to your `package.json`

**Before**

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as SelectPrimitive from "@radix-ui/react-select";
```

**After**

```tsx
import { Dialog as DialogPrimitive, Select as SelectPrimitive } from "radix-ui";
```

**Migrate specific files**

You can migrate specific files or use glob patterns:

```bash
# Migrate a specific file.
npx shadcn@latest migrate radix src/components/ui/dialog.tsx

# Migrate files matching a glob pattern.
npx shadcn@latest migrate radix "src/components/ui/**"
```

If no path is provided, the migration will transform all files in your `ui`
directory (from `components.json`).

Once complete, you can remove any unused `@radix-ui/react-*` packages from your
`package.json`.

---

## eject

When you run `init`, shadcn adds `@import "shadcn/tailwind.css"` to your global
CSS file. This import provides shared Tailwind v4 utilities such as custom
variants (`data-open:`, `data-closed:`, etc.) and accordion animations.

Use the `eject` command to inline `shadcn/tailwind.css` into your global CSS
file and remove the `shadcn` dependency from your project.

<Callout icon={<TriangleAlertIcon />}> **Note: This action is irreversible.**
After ejecting, future shadcn CLI updates to `shadcn/tailwind.css` will not
apply automatically.
</Callout>

```bash
npx shadcn@latest eject
```

**Before**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```

**After**

```css
@import "tailwindcss";
@import "tw-animate-css";
/* ejected from shadcn@4.8.3 */
@theme inline {
    @keyframes accordion-down {
        from {
            height: 0;
        }
        to {
            height: var(
                --radix-accordion-content-height,
                var(--accordion-panel-height, auto)
            );
        }
    }
}

@custom-variant data-open {
    &:where([data-state="open"]),
    &:where([data-open]:not([data-open="false"])) {
        @slot;
    }
}

@utility no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
}
```

**Monorepo**

In a monorepo, run the command from the workspace that contains your
`components.json` and global CSS file:

```bash
npx shadcn@latest eject -c packages/ui
```

**Options**

```bash
Usage: shadcn eject [options]

inline shadcn/tailwind.css and remove the shadcn dependency

Options:
  -c, --cwd <cwd>  the working directory. defaults to the current directory.
  -y, --yes        skip confirmation prompt. (default: false)
  -s, --silent     mute output. (default: false)
  -h, --help       display help for command
```

---
title: Skills
description: Give your AI assistant deep knowledge of shadcn/ui components, patterns, and best practices.
---

Skills give AI assistants like Claude Code project-aware context about
shadcn/ui. When installed, your AI assistant knows how to find, install,
compose, and customize components using the correct APIs and patterns for your
project.

For example, you can ask your AI assistant to:

- _"Add a login form with email and password fields."_
- _"Create a settings page with a form for updating profile information."_
- _"Build a dashboard with a sidebar, stats cards, and a data table."_
- _"Switch to --preset [CODE]"_
- _"Can you add a hero from @tailark?"_

The skill reads your project's `components.json` and provides the assistant with
your framework, aliases, installed components, icon library, and base library so
it can generate correct code on the first try.

---

## Install

```bash
npx skills add shadcn/ui
```

This installs the shadcn skill into your project. Once installed, your AI
assistant automatically loads it when working with shadcn/ui components.

Learn more about skills at [skills.sh](https://skills.sh).

---

## What's Included

The skill provides your AI assistant with the following knowledge:

### Project Context

On every interaction, the skill runs `shadcn info --json` to get your project's
configuration: framework, Tailwind version, aliases, base library (`radix` or
`base`), icon library, installed components, and resolved file paths.

### CLI Commands

Full reference for all CLI commands: `init`, `add`, `search`, `view`, `docs`,
`diff`, `info`, and `build`. Includes flags, dry-run mode, smart merge
workflows, presets, and templates.

### Theming and Customization

How CSS variables, OKLCH colors, dark mode, custom colors, border radius, and
component variants work. Includes guidance for both Tailwind v3 and v4.

### Registry Authoring

How to build and publish custom component registries: `registry.json` format,
item types, file objects, dependencies, CSS variables, building, hosting, and
user configuration.

### MCP Server

Setup and tools for the shadcn MCP server, which lets AI assistants search,
browse, and install components from registries.

---

## How It Works

1. **Project detection** — The skill activates when it finds a `components.json`
   file in your project.
2. **Context injection** — It runs `shadcn info --json` to read your project
   configuration and injects the result into the assistant's context.
3. **Pattern enforcement** — The assistant follows shadcn/ui composition rules:
   using `FieldGroup` for forms, `ToggleGroup` for option sets, semantic colors,
   and correct base-specific APIs.
4. **Component discovery** — The assistant uses `shadcn docs`, `shadcn search`,
   or MCP tools to find components and their documentation before generating
   code.

## Learn More

- [CLI](/docs/cli) — Full CLI command reference
- [MCP Server](/docs/mcp) — Connect the MCP server for registry access
- [Theming](/docs/theming) — CSS variables and customization
- [Registry](/docs/registry) — Building and publishing custom registries
- [skills.sh](https://skills.sh) — Learn more about AI skills

---
title: MCP Server
description: Use the shadcn MCP server to browse, search, and install components from registries.
---

The shadcn MCP Server allows AI assistants to interact with items from
registries. You can browse available components, search for specific ones, and
install them directly into your project using natural language.

For example, you can ask an AI assistant to "Build a landing page using
components from the acme registry" or "Find me a login form from the shadcn
registry".

Registries are configured in your project's `components.json` file.

```json title="components.json" showLineNumbers
{
    "registries": {
        "@acme": "https://acme.com/r/{name}.json"
    }
}
```

---

## Quick Start

Select your MCP client and follow the instructions to configure the shadcn MCP
server. If you'd like to do it manually, see the [Configuration](#configuration)
section.

<Tabs defaultValue="claude">
  <TabsList>
    <TabsTrigger value="claude">Claude Code</TabsTrigger>
    <TabsTrigger value="cursor">Cursor</TabsTrigger>
    <TabsTrigger value="vscode">VS Code</TabsTrigger>
    <TabsTrigger value="codex">Codex</TabsTrigger>
    <TabsTrigger value="opencode">OpenCode</TabsTrigger>
  </TabsList>
  <TabsContent value="claude" className="mt-4">
    **Run the following command** in your project:
       ```bash
       npx shadcn@latest mcp init --client claude
       ```

    **Restart Claude Code** and try the following prompts:
       - Show me all available components in the shadcn registry
       - Add the button, dialog and card components to my project
       - Create a contact form using components from the shadcn registry

    **Note:** You can use `/mcp` command in Claude Code to debug the MCP server.

</TabsContent>

<TabsContent value="cursor" className="mt-4">
    **Run the following command** in your project:
       ```bash
       npx shadcn@latest mcp init --client cursor
       ```

    Open **Cursor Settings** and **Enable the MCP server** for shadcn. Then try the following prompts:
       - Show me all available components in the shadcn registry
       - Add the button, dialog and card components to my project
       - Create a contact form using components from the shadcn registry

</TabsContent>

<TabsContent value="vscode" className="mt-4">
    **Run the following command** in your project:
       ```bash
       npx shadcn@latest mcp init --client vscode
       ```

    Open `.vscode/mcp.json` and click **Start** next to the shadcn server. Then try the following prompts with GitHub Copilot:
       - Show me all available components in the shadcn registry
       - Add the button, dialog and card components to my project
       - Create a contact form using components from the shadcn registry

</TabsContent>

<TabsContent value="codex" className="mt-4">
    <Callout className="mt-0">
      **Note:** The `shadcn` CLI cannot automatically update `~/.codex/config.toml`.
      You'll need to add the configuration manually for Codex.
    </Callout>

    **Run the following command** in your project:
       ```bash
       npx shadcn@latest mcp init --client codex
       ```

    **Then, add the following configuration** to `~/.codex/config.toml`:
       ```toml
       [mcp_servers.shadcn]
       command = "npx"
       args = ["shadcn@latest", "mcp"]
       ```

    **Restart Codex** and try the following prompts:
       - Show me all available components in the shadcn registry
       - Add the button, dialog and card components to my project
       - Create a contact form using components from the shadcn registry

</TabsContent>

<TabsContent value="opencode" className="mt-4">
    **Run the following command** in your project:
       ```bash
       npx shadcn@latest mcp init --client opencode
       ```

    **Restart OpenCode** and try the following prompts:
       - Show me all available components in the shadcn registry
       - Add the button, dialog and card components to my project
       - Create a contact form using components from the shadcn registry

</TabsContent>
</Tabs>

---

## What is MCP?

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) is an open
protocol that enables AI assistants to securely connect to external data sources
and tools. With the shadcn MCP server, your AI assistant gains direct access to:

- **Browse Components** - List all available components, blocks, and templates
  from any configured registry
- **Search Across Registries** - Find specific components by name or
  functionality across multiple sources
- **Install with Natural Language** - Add components using simple conversational
  prompts like "add a login form"
- **Support for Multiple Registries** - Access public registries, private
  company libraries, and third-party sources

---

## How It Works

The MCP server acts as a bridge between your AI assistant, component registries
and the shadcn CLI.

1. **Registry Connection** - MCP connects to configured registries (shadcn/ui,
   private registries, third-party sources)
2. **Natural Language** - You describe what you need in plain English
3. **AI Processing** - The assistant translates your request into registry
   commands
4. **Component Delivery** - Resources are fetched and installed in your project

---

## Supported Registries

The shadcn MCP server works out of the box with any shadcn-compatible registry.

- **shadcn/ui Registry** - The default registry with all shadcn/ui components
- **Third-Party Registries** - Any registry following the shadcn registry
  specification
- **Private Registries** - Your company's internal component libraries
- **Namespaced Registries** - Multiple registries configured with `@namespace`
  syntax

---

## Configuration

You can use any MCP client to interact with the shadcn MCP server. Here are the
instructions for the most popular ones.

### Claude Code

To use the shadcn MCP server with Claude Code, add the following configuration
to your project's `.mcp.json` file:

```json title=".mcp.json" showLineNumbers
{
    "mcpServers": {
        "shadcn": {
            "command": "npx",
            "args": ["shadcn@latest", "mcp"]
        }
    }
}
```

After adding the configuration, restart Claude Code and run `/mcp` to see the
shadcn MCP server in the list. If you see `Connected`, you're good to go.

See the [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp) for
more details.

### Cursor

To configure MCP in Cursor, add the shadcn server to your project's
`.cursor/mcp.json` configuration file:

```json title=".cursor/mcp.json" showLineNumbers
{
    "mcpServers": {
        "shadcn": {
            "command": "npx",
            "args": ["shadcn@latest", "mcp"]
        }
    }
}
```

After adding the configuration, enable the shadcn MCP server in Cursor Settings.

Once enabled, you should see a green dot next to the shadcn server in the MCP
server list and a list of available tools.

See the
[Cursor MCP documentation](https://docs.cursor.com/en/context/mcp#using-mcp-json)
for more details.

### VS Code

To configure MCP in VS Code with GitHub Copilot, add the shadcn server to your
project's `.vscode/mcp.json` configuration file:

```json title=".vscode/mcp.json" showLineNumbers
{
    "servers": {
        "shadcn": {
            "command": "npx",
            "args": ["shadcn@latest", "mcp"]
        }
    }
}
```

After adding the configuration, open `.vscode/mcp.json` and click **Start** next
to the shadcn server.

See the
[VS Code MCP documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
for more details.

### Codex

<Callout>
  **Note:** The `shadcn` CLI cannot automatically update `~/.codex/config.toml`.
  You'll need to add the configuration manually.
</Callout>

To configure MCP in Codex, add the shadcn server to `~/.codex/config.toml`:

```toml title="~/.codex/config.toml" showLineNumbers
[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]
```

After adding the configuration, restart Codex to load the MCP server.

---

## Configuring Registries

The MCP server supports multiple registries through your project's
`components.json` configuration. This allows you to access components from
various sources including private registries and third-party providers.

Configure additional registries in your `components.json`:

```json title="components.json" showLineNumbers
{
    "registries": {
        "@acme": "https://registry.acme.com/{name}.json",
        "@internal": {
            "url": "https://internal.company.com/{name}.json",
            "headers": {
                "Authorization": "Bearer ${REGISTRY_TOKEN}"
            }
        }
    }
}
```

<Callout>
  **Note:** No configuration is needed to access the standard shadcn/ui
  registry.
</Callout>

---

## Authentication

For private registries requiring authentication, set environment variables in
your `.env.local`:

```bash title=".env.local"
REGISTRY_TOKEN=your_token_here
API_KEY=your_api_key_here
```

For more details on registry authentication, see the
[Authentication documentation](/docs/registry/authentication).

---

## Example Prompts

Once the MCP server is configured, you can use natural language to interact with
registries. Try one of the following prompts:

### Browse & Search

- Show me all available components in the shadcn registry
- Find me a login form from the shadcn registry

### Install Items

- Add the button component to my project
- Create a login form using shadcn components
- Install the Cursor rules from the acme registry

### Work with Namespaces

- Show me components from acme registry
- Install @internal/auth-form
- Build me a landing page using hero, features and testimonials sections from
  the acme registry

---

## Troubleshooting

### MCP Not Responding

If the MCP server isn't responding to prompts:

1. **Check Configuration** - Verify the MCP server is properly configured and
   enabled in your MCP client
2. **Restart MCP Client** - Restart your MCP client after configuration changes
3. **Verify Installation** - Ensure `shadcn` is installed in your project
4. **Check Network** - Confirm you can access the configured registries

### Registry Access Issues

If components aren't loading from registries:

1. **Check components.json** - Verify registry URLs are correct
2. **Test Authentication** - Ensure environment variables are set for private
   registries
3. **Verify Registry** - Confirm the registry is online and accessible
4. **Check Namespace** - Ensure namespace syntax is correct
   (`@namespace/component`)

### Installation Failures

If components fail to install:

1. **Check Project Setup** - Ensure you have a valid `components.json` file
2. **Verify Paths** - Confirm the target directories exist
3. **Check Permissions** - Ensure write permissions for component directories
4. **Review Dependencies** - Check that required dependencies are installed

### No Tools or Prompts

If you see the `No tools or prompts` message, try the following:

1. **Clear the npx cache** - Run `npx clear-npx-cache`
2. **Re-enable the MCP server** - Try to re-enable the MCP server in your MCP
   client
3. **Check Logs** - In Cursor, you can see the logs under View -> Output and
   select `MCP: project-*` in the dropdown.

---

## Learn More

- [Registry Documentation](/docs/registry) - Complete guide to shadcn registries
- [Namespaces](/docs/registry/namespace) - Configure multiple registry sources
- [Authentication](/docs/registry/authentication) - Secure your private
  registries
- [MCP Specification](https://modelcontextprotocol.io) - Learn about Model
  Context Protocol

---
title: Introduction
description: Run your own code registry.
---

You can use the `shadcn` CLI to run your own code registry. Running your own
registry allows you to distribute your custom components, hooks, pages, config,
rules and other files to any project.

<Callout>
  **Note:** The registry works with any project type and any framework, and is
  not limited to React.
</Callout>

<figure className="flex flex-col gap-4">
  <Image
    src="/images/registry-light.png"
    width="1432"
    height="960"
    alt="Registry"
    className="mt-6 w-full overflow-hidden rounded-lg border dark:hidden"
  />
  <Image
    src="/images/registry-dark.png"
    width="1432"
    height="960"
    alt="Registry"
    className="mt-6 hidden w-full overflow-hidden rounded-lg border shadow-sm dark:block"
  />
  <figcaption className="text-center text-sm text-gray-500">
    A distribution system for code
  </figcaption>
</figure>

Ready to create your own registry? In the next section, we'll walk you through
setting up your own custom registry step-by-step, from creating your first
component to publishing it for others to use.

<div className="mt-6 grid gap-4 sm:grid-cols-2">
<LinkedCard
  href="/docs/registry/getting-started"
  className="items-start text-sm md:p-6"
>
  <div className="font-medium">Getting Started</div>
  <div className="text-muted-foreground">
    Set up and build your own registry
  </div>
</LinkedCard>

<LinkedCard href="/docs/registry/github" className="items-start text-sm md:p-6">
  <div className="font-medium">GitHub</div>
  <div className="text-muted-foreground">
    Turn a GitHub repository into a registry
  </div>
</LinkedCard>

<LinkedCard href="/docs/registry/namespace" className="items-start text-sm
md:p-6"



<div className="font-medium">Namespaces</div>
  <div className="text-muted-foreground">
    Configure registries with namespaces
  </div>
</LinkedCard>

<LinkedCard href="/docs/registry/authentication" className="items-start text-sm
md:p-6"



<div className="font-medium">Authentication</div>
  <div className="text-muted-foreground">
    Secure your registry with authentication
  </div>
</LinkedCard>

<LinkedCard href="/docs/registry/examples" className="items-start text-sm
md:p-6"



<div className="font-medium">Examples</div>
  <div className="text-muted-foreground">Browse example registry items</div>
</LinkedCard>

<LinkedCard href="/docs/registry/registry-json" className="items-start text-sm
md:p-6"



<div className="font-medium">Schema</div>
  <div className="text-muted-foreground">
    Schema specification for registry.json
  </div>
</LinkedCard>
</div>

---
title: React Hook Form
description: Build forms in React using React Hook Form and Zod.
links:
    doc: https://react-hook-form.com
---

import { InfoIcon } from "lucide-react"

In this guide, we will take a look at building forms with React Hook Form. We'll
cover building forms with the `<Field />` component, adding schema validation
using Zod, error handling, accessibility, and more.

## Demo

We are going to build the following form. It has a simple text input and a
textarea. On submit, we'll validate the form data and display any errors.

<Callout icon={<InfoIcon />}> **Note:** For the purpose of this demo, we have
intentionally disabled browser validation to show how schema validation and form
errors work in React Hook Form. It is recommended to add basic browser
validation in your production code.
</Callout>

<ComponentPreview
  name="form-rhf-demo"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

## Approach

This form leverages React Hook Form for performant, flexible form handling.
We'll build our form using the `<Field />` component, which gives you **complete
flexibility over the markup and styling**.

- Uses React Hook Form's `useForm` hook for form state management.
- `<Controller />` component for controlled inputs.
- `<Field />` components for building accessible forms.
- Client-side validation using Zod with `zodResolver`.

## Anatomy

Here's a basic example of a form using the `<Controller />` component from React
Hook Form and the `<Field />` component.

```tsx showLineNumbers {5-18}
<Controller
    name="title"
    control={form.control}
    render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
            <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Login button not working on mobile"
                autoComplete="off"
            />
            <FieldDescription>
                Provide a concise title for your bug report.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    )}
/>;
```

## Form

### Create a form schema

We'll start by defining the shape of our form using a Zod schema.

<Callout icon={<InfoIcon />}> **Note:** This example uses `zod v3` for schema
validation, but you can replace it with any other Standard Schema validation
library supported by React Hook Form.
</Callout>

```tsx showLineNumbers title="form.tsx"
import * as z from "zod";

const formSchema = z.object({
    title: z
        .string()
        .min(5, "Bug title must be at least 5 characters.")
        .max(32, "Bug title must be at most 32 characters."),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters.")
        .max(100, "Description must be at most 100 characters."),
});
```

### Set up the form

Next, we'll use the `useForm` hook from React Hook Form to create our form
instance. We'll also add the Zod resolver to validate the form data.

```tsx showLineNumbers title="form.tsx" {17-23}
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
    title: z
        .string()
        .min(5, "Bug title must be at least 5 characters.")
        .max(32, "Bug title must be at most 32 characters."),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters.")
        .max(100, "Description must be at most 100 characters."),
});

export function BugReportForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        // Do something with the form values.
        console.log(data);
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* ... */}
            {/* Build the form here */}
            {/* ... */}
        </form>
    );
}
```

### Build the form

We can now build the form using the `<Controller />` component from React Hook
Form and the `<Field />` component.

<ComponentSource
  src="/registry/new-york-v4/examples/form-rhf-demo.tsx"
  title="form.tsx"
/>

### Done

That's it. You now have a fully accessible form with client-side validation.

When you submit the form, the `onSubmit` function will be called with the
validated form data. If the form data is invalid, React Hook Form will display
the errors next to each field.

## Validation

### Client-side Validation

React Hook Form validates your form data using the Zod schema. Define a schema
and pass it to the `resolver` option of the `useForm` hook.

```tsx showLineNumbers title="example-form.tsx" {5-8,12}
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
});

export function ExampleForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });
}
```

### Validation Modes

React Hook Form supports different validation modes.

```tsx showLineNumbers title="form.tsx" {3}
const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
});
```

| Mode          | Description                                              |
| ------------- | -------------------------------------------------------- |
| `"onChange"`  | Validation triggers on every change.                     |
| `"onBlur"`    | Validation triggers on blur.                             |
| `"onSubmit"`  | Validation triggers on submit (default).                 |
| `"onTouched"` | Validation triggers on first blur, then on every change. |
| `"all"`       | Validation triggers on blur and change.                  |

## Displaying Errors

Display errors next to the field using `<FieldError />`. For styling and
accessibility:

- Add the `data-invalid` prop to the `<Field />` component.
- Add the `aria-invalid` prop to the form control such as `<Input />`,
  `<SelectTrigger />`, `<Checkbox />`, etc.

```tsx showLineNumbers title="form.tsx" {5,11,13}
<Controller
    name="email"
    control={form.control}
    render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
                {...field}
                id={field.name}
                type="email"
                aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    )}
/>;
```

## Working with Different Field Types

### Input

- For input fields, spread the `field` object onto the `<Input />` component.
- To show errors, add the `aria-invalid` prop to the `<Input />` component and
  the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-rhf-input"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

For simple text inputs, spread the `field` object onto the input.

```tsx showLineNumbers title="form.tsx" {5,7,8}
<Controller
    name="name"
    control={form.control}
    render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
            <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    )}
/>;
```

### Textarea

- For textarea fields, spread the `field` object onto the `<Textarea />`
  component.
- To show errors, add the `aria-invalid` prop to the `<Textarea />` component
  and the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-rhf-textarea"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

For textarea fields, spread the `field` object onto the textarea.

```tsx showLineNumbers title="form.tsx" {5,10,18}
<Controller
    name="about"
    control={form.control}
    render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-rhf-textarea-about">
                More about you
            </FieldLabel>
            <Textarea
                {...field}
                id="form-rhf-textarea-about"
                aria-invalid={fieldState.invalid}
                placeholder="I'm a software engineer..."
                className="min-h-[120px]"
            />
            <FieldDescription>
                Tell us more about yourself. This will be used to help us
                personalize your experience.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    )}
/>;
```

### Select

- For select components, use `field.value` and `field.onChange` on the
  `<Select />` component.
- To show errors, add the `aria-invalid` prop to the `<SelectTrigger />`
  component and the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-rhf-select"
  className="sm:[&_.preview]:h-[500px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {5,13,22}
<Controller
    name="language"
    control={form.control}
    render={({ field, fieldState }) => (
        <Field orientation="responsive" data-invalid={fieldState.invalid}>
            <FieldContent>
                <FieldLabel htmlFor="form-rhf-select-language">
                    Spoken Language
                </FieldLabel>
                <FieldDescription>
                    For best results, select the language you speak.
                </FieldDescription>
                {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                )}
            </FieldContent>
            <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
            >
                <SelectTrigger
                    id="form-rhf-select-language"
                    aria-invalid={fieldState.invalid}
                    className="min-w-[120px]"
                >
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                </SelectContent>
            </Select>
        </Field>
    )}
/>;
```

### Checkbox

- For checkbox arrays, use `field.value` and `field.onChange` with array
  manipulation.
- To show errors, add the `aria-invalid` prop to the `<Checkbox />` component
  and the `data-invalid` prop to the `<Field />` component.
- Remember to add `data-slot="checkbox-group"` to the `<FieldGroup />` component
  for proper styling and spacing.

<ComponentPreview
  name="form-rhf-checkbox"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {10,15,20-22,38}
<Controller
    name="tasks"
    control={form.control}
    render={({ field, fieldState }) => (
        <FieldSet>
            <FieldLegend variant="label">Tasks</FieldLegend>
            <FieldDescription>
                Get notified when tasks you&apos;ve created have updates.
            </FieldDescription>
            <FieldGroup data-slot="checkbox-group">
                {tasks.map((task) => (
                    <Field
                        key={task.id}
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                    >
                        <Checkbox
                            id={`form-rhf-checkbox-${task.id}`}
                            name={field.name}
                            aria-invalid={fieldState.invalid}
                            checked={field.value.includes(task.id)}
                            onCheckedChange={(checked) => {
                                const newValue = checked
                                    ? [...field.value, task.id]
                                    : field.value.filter((value) =>
                                        value !== task.id
                                    );
                                field.onChange(newValue);
                            }}
                        />
                        <FieldLabel
                            htmlFor={`form-rhf-checkbox-${task.id}`}
                            className="font-normal"
                        >
                            {task.label}
                        </FieldLabel>
                    </Field>
                ))}
            </FieldGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
    )}
/>;
```

### Radio Group

- For radio groups, use `field.value` and `field.onChange` on the
  `<RadioGroup />` component.
- To show errors, add the `aria-invalid` prop to the `<RadioGroupItem />`
  component and the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-rhf-radiogroup"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {12-13,17,25,31}
<Controller
    name="plan"
    control={form.control}
    render={({ field, fieldState }) => (
        <FieldSet>
            <FieldLegend>Plan</FieldLegend>
            <FieldDescription>
                You can upgrade or downgrade your plan at any time.
            </FieldDescription>
            <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
            >
                {plans.map((plan) => (
                    <FieldLabel
                        key={plan.id}
                        htmlFor={`form-rhf-radiogroup-${plan.id}`}
                    >
                        <Field
                            orientation="horizontal"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldContent>
                                <FieldTitle>{plan.title}</FieldTitle>
                                <FieldDescription>
                                    {plan.description}
                                </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem
                                value={plan.id}
                                id={`form-rhf-radiogroup-${plan.id}`}
                                aria-invalid={fieldState.invalid}
                            />
                        </Field>
                    </FieldLabel>
                ))}
            </RadioGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
    )}
/>;
```

### Switch

- For switches, use `field.value` and `field.onChange` on the `<Switch />`
  component.
- To show errors, add the `aria-invalid` prop to the `<Switch />` component and
  the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-rhf-switch"
  className="sm:[&_.preview]:h-[500px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {5,13,18-19}
<Controller
    name="twoFactor"
    control={form.control}
    render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <FieldContent>
                <FieldLabel htmlFor="form-rhf-switch-twoFactor">
                    Multi-factor authentication
                </FieldLabel>
                <FieldDescription>
                    Enable multi-factor authentication to secure your account.
                </FieldDescription>
                {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                )}
            </FieldContent>
            <Switch
                id="form-rhf-switch-twoFactor"
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
            />
        </Field>
    )}
/>;
```

### Complex Forms

Here is an example of a more complex form with multiple fields and validation.

<ComponentPreview
  name="form-rhf-complex"
  className="sm:[&_.preview]:h-[1300px]"
  chromeLessOnMobile
/>

## Resetting the Form

Use `form.reset()` to reset the form to its default values.

```tsx showLineNumbers
<Button type="button" variant="outline" onClick={() => form.reset()}>
    Reset
</Button>;
```

## Array Fields

React Hook Form provides a `useFieldArray` hook for managing dynamic array
fields. This is useful when you need to add or remove fields dynamically.

<ComponentPreview
  name="form-rhf-array"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

### Using useFieldArray

Use the `useFieldArray` hook to manage array fields. It provides `fields`,
`append`, and `remove` methods.

```tsx showLineNumbers title="form.tsx" {8-11}
import { useFieldArray, useForm } from "react-hook-form";

export function ExampleForm() {
    const form = useForm({
        // ... form config
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "emails",
    });
}
```

### Array Field Structure

Wrap your array fields in a `<FieldSet />` with a `<FieldLegend />` and
`<FieldDescription />`.

```tsx showLineNumbers title="form.tsx"
<FieldSet className="gap-4">
    <FieldLegend variant="label">Email Addresses</FieldLegend>
    <FieldDescription>
        Add up to 5 email addresses where we can contact you.
    </FieldDescription>
    <FieldGroup className="gap-4">{/* Array items go here */}</FieldGroup>
</FieldSet>;
```

### Controller Pattern for Array Items

Map over the `fields` array and use `<Controller />` for each item. **Make sure
to use `field.id` as the key**.

```tsx showLineNumbers title="form.tsx"
{
    fields.map((field, index) => (
        <Controller
            key={field.id}
            name={`emails.${index}.address`}
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
                <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                >
                    <FieldContent>
                        <InputGroup>
                            <InputGroupInput
                                {...controllerField}
                                id={`form-rhf-array-email-${index}`}
                                aria-invalid={fieldState.invalid}
                                placeholder="name@example.com"
                                type="email"
                                autoComplete="email"
                            />
                            {/* Remove button */}
                        </InputGroup>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </FieldContent>
                </Field>
            )}
        />
    ));
}
```

### Adding Items

Use the `append` method to add new items to the array.

```tsx showLineNumbers title="form.tsx"
<Button
    type="button"
    variant="outline"
    size="sm"
    onClick={() => append({ address: "" })}
    disabled={fields.length >= 5}
>
    Add Email Address
</Button>;
```

### Removing Items

Use the `remove` method to remove items from the array. Add the remove button
conditionally.

```tsx showLineNumbers title="form.tsx"
{
    fields.length > 1 && (
        <InputGroupAddon align="inline-end">
            <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => remove(index)}
                aria-label={`Remove email ${index + 1}`}
            >
                <XIcon />
            </InputGroupButton>
        </InputGroupAddon>
    );
}
```

### Array Validation

Use Zod's `array` method to validate array fields.

```tsx showLineNumbers title="form.tsx"
const formSchema = z.object({
    emails: z
        .array(
            z.object({
                address: z.string().email("Enter a valid email address."),
            }),
        )
        .min(1, "Add at least one email address.")
        .max(5, "You can add up to 5 email addresses."),
});
```

---
title: TanStack Form
description: Build forms in React using TanStack Form and Zod.
links:
    doc: https://tanstack.com/form
---

import { InfoIcon } from "lucide-react"

This guide explores how to build forms using TanStack Form. You'll learn to
create forms with the `<Field />` component, implement schema validation with
Zod, handle errors, and ensure accessibility.

## Demo

We'll start by building the following form. It has a simple text input and a
textarea. On submit, we'll validate the form data and display any errors.

<Callout icon={<InfoIcon />}> **Note:** For the purpose of this demo, we have
intentionally disabled browser validation to show how schema validation and form
errors work in TanStack Form. It is recommended to add basic browser validation
in your production code.
</Callout>

<ComponentPreview
  name="form-tanstack-demo"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

## Approach

This form leverages TanStack Form for powerful, headless form handling. We'll
build our form using the `<Field />` component, which gives you **complete
flexibility over the markup and styling**.

- Uses TanStack Form's `useForm` hook for form state management.
- `form.Field` component with render prop pattern for controlled inputs.
- `<Field />` components for building accessible forms.
- Client-side validation using Zod.
- Real-time validation feedback.

## Anatomy

Here's a basic example of a form using TanStack Form with the `<Field />`
component.

```tsx showLineNumbers {15-31}
<form
    onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
    }}
>
    <FieldGroup>
        <form.Field
            name="title"
            children={(field) => {
                const isInvalid = field.state.meta.isTouched &&
                    !field.state.meta.isValid;
                return (
                    <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
                        <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Login button not working on mobile"
                            autoComplete="off"
                        />
                        <FieldDescription>
                            Provide a concise title for your bug report.
                        </FieldDescription>
                        {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                        )}
                    </Field>
                );
            }}
        />
    </FieldGroup>
    <Button type="submit">Submit</Button>
</form>;
```

## Form

### Create a schema

We'll start by defining the shape of our form using a Zod schema.

<Callout icon={<InfoIcon />}> **Note:** This example uses `zod v3` for schema
validation. TanStack Form integrates seamlessly with Zod and other Standard
Schema validation libraries through its validators API.
</Callout>

```tsx showLineNumbers title="form.tsx"
import * as z from "zod";

const formSchema = z.object({
    title: z
        .string()
        .min(5, "Bug title must be at least 5 characters.")
        .max(32, "Bug title must be at most 32 characters."),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters.")
        .max(100, "Description must be at most 100 characters."),
});
```

### Set up the form

Use the `useForm` hook from TanStack Form to create your form instance with Zod
validation.

```tsx showLineNumbers title="form.tsx" {10-21}
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
    // ...
});

export function BugReportForm() {
    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            toast.success("Form submitted successfully");
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            {/* ... */}
        </form>
    );
}
```

We are using `onSubmit` to validate the form data here. TanStack Form supports
other validation modes, which you can read about in the
[documentation](https://tanstack.com/form/latest/docs/framework/react/guides/dynamic-validation).

### Build the form

We can now build the form using the `form.Field` component from TanStack Form
and the `<Field />` component.

<ComponentSource
  src="/registry/new-york-v4/examples/form-tanstack-demo.tsx"
  title="form.tsx"
/>

### Done

That's it. You now have a fully accessible form with client-side validation.

When you submit the form, the `onSubmit` function will be called with the
validated form data. If the form data is invalid, TanStack Form will display the
errors next to each field.

## Validation

### Client-side Validation

TanStack Form validates your form data using the Zod schema. Validation happens
in real-time as the user types.

```tsx showLineNumbers title="form.tsx" {13-15}
import { useForm } from "@tanstack/react-form"

const formSchema = z.object({
  // ...
})

export function BugReportForm() {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return <form onSubmit={/* ... */}>{/* ... */}</form>
}
```

### Validation Modes

TanStack Form supports different validation strategies through the `validators`
option:

| Mode         | Description                          |
| ------------ | ------------------------------------ |
| `"onChange"` | Validation triggers on every change. |
| `"onBlur"`   | Validation triggers on blur.         |
| `"onSubmit"` | Validation triggers on submit.       |

```tsx showLineNumbers title="form.tsx" {6-9}
const form = useForm({
    defaultValues: {
        title: "",
        description: "",
    },
    validators: {
        onSubmit: formSchema,
        onChange: formSchema,
        onBlur: formSchema,
    },
});
```

## Displaying Errors

Display errors next to the field using `<FieldError />`. For styling and
accessibility:

- Add the `data-invalid` prop to the `<Field />` component.
- Add the `aria-invalid` prop to the form control such as `<Input />`,
  `<SelectTrigger />`, `<Checkbox />`, etc.

```tsx showLineNumbers title="form.tsx" {4,18}
<form.Field
    name="email"
    children={(field) => {
        const isInvalid = field.state.meta.isTouched &&
            !field.state.meta.isValid;

        return (
            <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="email"
                    aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
        );
    }}
/>;
```

## Working with Different Field Types

### Input

- For input fields, use `field.state.value` and `field.handleChange` on the
  `<Input />` component.
- To show errors, add the `aria-invalid` prop to the `<Input />` component and
  the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-tanstack-input"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {6,11-14,22}
<form.Field
    name="username"
    children={(field) => {
        const isInvalid = field.state.meta.isTouched &&
            !field.state.meta.isValid;
        return (
            <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="form-tanstack-input-username">
                    Username
                </FieldLabel>
                <Input
                    id="form-tanstack-input-username"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="shadcn"
                    autoComplete="username"
                />
                <FieldDescription>
                    This is your public display name. Must be between 3 and 10
                    characters. Must only contain letters, numbers, and
                    underscores.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
        );
    }}
/>;
```

### Textarea

- For textarea fields, use `field.state.value` and `field.handleChange` on the
  `<Textarea />` component.
- To show errors, add the `aria-invalid` prop to the `<Textarea />` component
  and the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-tanstack-textarea"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {6,13-16,24}
<form.Field
    name="about"
    children={(field) => {
        const isInvalid = field.state.meta.isTouched &&
            !field.state.meta.isValid;
        return (
            <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="form-tanstack-textarea-about">
                    More about you
                </FieldLabel>
                <Textarea
                    id="form-tanstack-textarea-about"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="I'm a software engineer..."
                    className="min-h-[120px]"
                />
                <FieldDescription>
                    Tell us more about yourself. This will be used to help us
                    personalize your experience.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
        );
    }}
/>;
```

### Select

- For select components, use `field.state.value` and `field.handleChange` on the
  `<Select />` component.
- To show errors, add the `aria-invalid` prop to the `<SelectTrigger />`
  component and the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-tanstack-select"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {6,18-19,23}
<form.Field
    name="language"
    children={(field) => {
        const isInvalid = field.state.meta.isTouched &&
            !field.state.meta.isValid;
        return (
            <Field orientation="responsive" data-invalid={isInvalid}>
                <FieldContent>
                    <FieldLabel htmlFor="form-tanstack-select-language">
                        Spoken Language
                    </FieldLabel>
                    <FieldDescription>
                        For best results, select the language you speak.
                    </FieldDescription>
                    {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                    )}
                </FieldContent>
                <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                >
                    <SelectTrigger
                        id="form-tanstack-select-language"
                        aria-invalid={isInvalid}
                        className="min-w-[120px]"
                    >
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                </Select>
            </Field>
        );
    }}
/>;
```

### Checkbox

- For checkbox, use `field.state.value` and `field.handleChange` on the
  `<Checkbox />` component.
- To show errors, add the `aria-invalid` prop to the `<Checkbox />` component
  and the `data-invalid` prop to the `<Field />` component.
- For checkbox arrays, use `mode="array"` on the `<form.Field />` component and
  TanStack Form's array helpers.
- Remember to add `data-slot="checkbox-group"` to the `<FieldGroup />` component
  for proper styling and spacing.

<ComponentPreview
  name="form-tanstack-checkbox"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {12,17,22-24,44}
<form.Field
    name="tasks"
    mode="array"
    children={(field) => {
        const isInvalid = field.state.meta.isTouched &&
            !field.state.meta.isValid;
        return (
            <FieldSet>
                <FieldLegend variant="label">Tasks</FieldLegend>
                <FieldDescription>
                    Get notified when tasks you&apos;ve created have updates.
                </FieldDescription>
                <FieldGroup data-slot="checkbox-group">
                    {tasks.map((task) => (
                        <Field
                            key={task.id}
                            orientation="horizontal"
                            data-invalid={isInvalid}
                        >
                            <Checkbox
                                id={`form-tanstack-checkbox-${task.id}`}
                                name={field.name}
                                aria-invalid={isInvalid}
                                checked={field.state.value.includes(task.id)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        field.pushValue(task.id);
                                    } else {
                                        const index = field.state.value.indexOf(
                                            task.id,
                                        );
                                        if (index > -1) {
                                            field.removeValue(index);
                                        }
                                    }
                                }}
                            />
                            <FieldLabel
                                htmlFor={`form-tanstack-checkbox-${task.id}`}
                                className="font-normal"
                            >
                                {task.label}
                            </FieldLabel>
                        </Field>
                    ))}
                </FieldGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldSet>
        );
    }}
/>;
```

### Radio Group

- For radio groups, use `field.state.value` and `field.handleChange` on the
  `<RadioGroup />` component.
- To show errors, add the `aria-invalid` prop to the `<RadioGroupItem />`
  component and the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-tanstack-radiogroup"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {21,29,35}
<form.Field
    name="plan"
    children={(field) => {
        const isInvalid = field.state.meta.isTouched &&
            !field.state.meta.isValid;
        return (
            <FieldSet>
                <FieldLegend>Plan</FieldLegend>
                <FieldDescription>
                    You can upgrade or downgrade your plan at any time.
                </FieldDescription>
                <RadioGroup
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                >
                    {plans.map((plan) => (
                        <FieldLabel
                            key={plan.id}
                            htmlFor={`form-tanstack-radiogroup-${plan.id}`}
                        >
                            <Field
                                orientation="horizontal"
                                data-invalid={isInvalid}
                            >
                                <FieldContent>
                                    <FieldTitle>{plan.title}</FieldTitle>
                                    <FieldDescription>
                                        {plan.description}
                                    </FieldDescription>
                                </FieldContent>
                                <RadioGroupItem
                                    value={plan.id}
                                    id={`form-tanstack-radiogroup-${plan.id}`}
                                    aria-invalid={isInvalid}
                                />
                            </Field>
                        </FieldLabel>
                    ))}
                </RadioGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldSet>
        );
    }}
/>;
```

### Switch

- For switches, use `field.state.value` and `field.handleChange` on the
  `<Switch />` component.
- To show errors, add the `aria-invalid` prop to the `<Switch />` component and
  the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-tanstack-switch"
  className="sm:[&_.preview]:h-[500px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {6,14,19-21}
<form.Field
    name="twoFactor"
    children={(field) => {
        const isInvalid = field.state.meta.isTouched &&
            !field.state.meta.isValid;
        return (
            <Field orientation="horizontal" data-invalid={isInvalid}>
                <FieldContent>
                    <FieldLabel htmlFor="form-tanstack-switch-twoFactor">
                        Multi-factor authentication
                    </FieldLabel>
                    <FieldDescription>
                        Enable multi-factor authentication to secure your
                        account.
                    </FieldDescription>
                    {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                    )}
                </FieldContent>
                <Switch
                    id="form-tanstack-switch-twoFactor"
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                    aria-invalid={isInvalid}
                />
            </Field>
        );
    }}
/>;
```

### Complex Forms

Here is an example of a more complex form with multiple fields and validation.

<ComponentPreview
  name="form-tanstack-complex"
  className="sm:[&_.preview]:h-[1100px]"
  chromeLessOnMobile
/>

## Resetting the Form

Use `form.reset()` to reset the form to its default values.

```tsx showLineNumbers
<Button type="button" variant="outline" onClick={() => form.reset()}>
    Reset
</Button>;
```

## Array Fields

TanStack Form provides powerful array field management with `mode="array"`. This
allows you to dynamically add, remove, and update array items with full
validation support.

<ComponentPreview
  name="form-tanstack-array"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

This example demonstrates managing multiple email addresses with array fields.
Users can add up to 5 email addresses, remove individual addresses, and each
address is validated independently.

### Array Field Structure

Use `mode="array"` on the parent field to enable array field management.

```tsx showLineNumbers title="form.tsx" {3,12-14}
<form.Field
  name="emails"
  mode="array"
  children={(field) => {
    return (
      <FieldSet>
        <FieldLegend variant="label">Email Addresses</FieldLegend>
        <FieldDescription>
          Add up to 5 email addresses where we can contact you.
        </FieldDescription>
        <FieldGroup>
          {field.state.value.map((_, index) => (
            // Nested field for each array item
          ))}
        </FieldGroup>
      </FieldSet>
    )
  }}
/>
```

### Nested Fields

Access individual array items using bracket notation:
`fieldName[index].propertyName`. This example uses `InputGroup` to display the
remove button inline with the input.

```tsx showLineNumbers title="form.tsx"
<form.Field
    name={`emails[${index}].address`}
    children={(subField) => {
        const isSubFieldInvalid = subField.state.meta.isTouched &&
            !subField.state.meta.isValid;
        return (
            <Field orientation="horizontal" data-invalid={isSubFieldInvalid}>
                <FieldContent>
                    <InputGroup>
                        <InputGroupInput
                            id={`form-tanstack-array-email-${index}`}
                            name={subField.name}
                            value={subField.state.value}
                            onBlur={subField.handleBlur}
                            onChange={(e) =>
                                subField.handleChange(e.target.value)}
                            aria-invalid={isSubFieldInvalid}
                            placeholder="name@example.com"
                            type="email"
                        />
                        {field.state.value.length > 1 && (
                            <InputGroupAddon align="inline-end">
                                <InputGroupButton
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => field.removeValue(index)}
                                    aria-label={`Remove email ${index + 1}`}
                                >
                                    <XIcon />
                                </InputGroupButton>
                            </InputGroupAddon>
                        )}
                    </InputGroup>
                    {isSubFieldInvalid && (
                        <FieldError errors={subField.state.meta.errors} />
                    )}
                </FieldContent>
            </Field>
        );
    }}
/>;
```

### Adding Items

Use `field.pushValue(item)` to add items to an array field. You can disable the
button when the array reaches its maximum length.

```tsx showLineNumbers title="form.tsx"
<Button
    type="button"
    variant="outline"
    size="sm"
    onClick={() => field.pushValue({ address: "" })}
    disabled={field.state.value.length >= 5}
>
    Add Email Address
</Button>;
```

### Removing Items

Use `field.removeValue(index)` to remove items from an array field. You can
conditionally show the remove button only when there's more than one item.

```tsx showLineNumbers title="form.tsx"
{
    field.state.value.length > 1 && (
        <InputGroupButton
            onClick={() => field.removeValue(index)}
            aria-label={`Remove email ${index + 1}`}
        >
            <XIcon />
        </InputGroupButton>
    );
}
```

### Array Validation

Validate array fields using Zod's array methods.

```tsx showLineNumbers title="form.tsx"
const formSchema = z.object({
    emails: z
        .array(
            z.object({
                address: z.string().email("Enter a valid email address."),
            }),
        )
        .min(1, "Add at least one email address.")
        .max(5, "You can add up to 5 email addresses."),
});
```

---
title: Formisch
description: Build forms in React using Formisch and Valibot.
links:
    doc: https://formisch.dev
---

import { InfoIcon } from "lucide-react"

This guide covers building forms with [Formisch](https://formisch.dev), the
lightweight, schema-first, and fully type-safe form library for React. We'll
create forms with the `<Field />` component, validate them with Valibot schemas,
handle errors, and ensure accessibility.

## Demo

We'll build the following form. It has a simple text input and a textarea. On
submit, we'll validate the form data and display any errors.

<Callout icon={<InfoIcon />}> **Note:** For the purpose of this demo, we have
intentionally disabled browser validation to show how schema validation and form
errors work in Formisch. It is recommended to add basic browser validation in
your production code.
</Callout>

<ComponentPreview
  name="form-formisch-demo"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

## Approach

This form leverages Formisch for headless, schema-first form handling. We'll
build our form using the `<Field />` component, which gives you **complete
flexibility over the markup and styling**.

- Uses Formisch's `useForm` hook for form state management.
- `<Form />` component to wrap the native `<form>` element with submit handling.
- `<Field />` render-prop component for controlled inputs.
- Schema validation using [Valibot](https://valibot.dev).
- Type-safe field paths inferred from the schema.

## Form Methods

Formisch exposes form operations as **top-level functions** rather than methods
on a form object. Import only what you need:

```ts
import { getInput, insert, reset, submit } from "@formisch/react";
```

Every method follows the same signature: the **first parameter is always the
form store**, and the **second parameter (if necessary) is always a config
object**.

```ts
// Read a field value
const email = getInput(form, { path: ["email"] });

// Reset the form with new initial values
reset(form, { initialInput: { email: "", password: "" } });

// Move an item in a field array
move(form, { path: ["items"], from: 0, to: 3 });
```

This design keeps the API flexible and consistent across all methods. You'll see
the same `(form, config)` shape used throughout this guide for reading state
(`getInput`, `getErrors`), writing state (`setInput`, `setErrors`), form control
(`submit`, `validate`, `focus`), and array operations (`insert`, `remove`,
`move`, `swap`, `replace`). See the
[full methods reference](https://formisch.dev/react/guides/form-methods) for
details.

## Anatomy

Here's a basic example of a form using the `<Field />` component from Formisch
and the shadcn `<Field />` component.

```tsx showLineNumbers {3-21}
<Form of={form} onSubmit={handleSubmit}>
    <FieldGroup>
        <FormischField of={form} path={["title"]}>
            {(field) => (
                <Field data-invalid={field.errors !== null}>
                    <FieldLabel htmlFor="form-title">Bug Title</FieldLabel>
                    <Input
                        {...field.props}
                        id="form-title"
                        value={field.input}
                        aria-invalid={field.errors !== null}
                        placeholder="Login button not working on mobile"
                        autoComplete="off"
                    />
                    <FieldDescription>
                        Provide a concise title for your bug report.
                    </FieldDescription>
                    {field.errors && (
                        <FieldError
                            errors={field.errors.map((message) => ({
                                message,
                            }))}
                        />
                    )}
                </Field>
            )}
        </FormischField>
    </FieldGroup>
</Form>;
```

<Callout icon={<InfoIcon />}> **Note:** Formisch ships its own `Field`
component. To avoid a name clash with the shadcn `Field`, the examples below
import the Formisch one as `FormischField` and keep the shadcn `Field` under its
original name. In your own code you can alias either side — just be consistent.
</Callout>

## Form

### Create a form schema

We'll start by defining the shape of our form using a Valibot schema. Formisch
infers all input and output types directly from this schema.

```tsx showLineNumbers title="form.tsx"
import * as v from "valibot";

const FormSchema = v.object({
    title: v.pipe(
        v.string(),
        v.minLength(5, "Bug title must be at least 5 characters."),
        v.maxLength(32, "Bug title must be at most 32 characters."),
    ),
    description: v.pipe(
        v.string(),
        v.minLength(20, "Description must be at least 20 characters."),
        v.maxLength(100, "Description must be at most 100 characters."),
    ),
});
```

### Set up the form

Next, we'll use the `useForm` hook from Formisch to create our form instance.
The schema is passed directly to `useForm` — there is no resolver step.

```tsx showLineNumbers title="form.tsx" {1-2,21-25}
import { Field as FormischField, Form, useForm } from "@formisch/react";
import type { SubmitHandler } from "@formisch/react";
import * as v from "valibot";

const FormSchema = v.object({
    title: v.pipe(
        v.string(),
        v.minLength(5, "Bug title must be at least 5 characters."),
        v.maxLength(32, "Bug title must be at most 32 characters."),
    ),
    description: v.pipe(
        v.string(),
        v.minLength(20, "Description must be at least 20 characters."),
        v.maxLength(100, "Description must be at most 100 characters."),
    ),
});

export function BugReportForm() {
    const form = useForm({
        schema: FormSchema,
        initialInput: {
            title: "",
            description: "",
        },
    });

    const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
        // Do something with the validated form values.
        console.log(output);
    };

    return (
        <Form of={form} onSubmit={handleSubmit}>
            {/* ... */}
            {/* Build the form here */}
            {/* ... */}
        </Form>
    );
}
```

The `<Form />` component wraps a native `<form>` element. It calls
`event.preventDefault()`, runs validation, and only invokes `onSubmit` when the
data is valid. The `output` you receive is fully typed from the schema.

### Build the form

We can now build the form using the `<Field />` component from Formisch and the
shadcn `<Field />` component.

<ComponentSource
  src="/registry/new-york-v4/examples/form-formisch-demo.tsx"
  title="form.tsx"
/>

### Done

That's it. You now have a fully accessible form with client-side validation.

When you submit the form, the `handleSubmit` function will be called with the
validated form data. If the form data is invalid, Formisch will populate
`field.errors` for each invalid field and the UI will display them.

## Validation

### Client-side Validation

Formisch validates your form data using the Valibot schema you pass to
`useForm`. There is no resolver — the schema is the single source of truth for
both runtime validation and static types.

```tsx showLineNumbers title="form.tsx" {1,3-6,11}
import { useForm } from "@formisch/react";

const FormSchema = v.object({
    title: v.string(),
    description: v.optional(v.string()),
});

export function ExampleForm() {
    const form = useForm({
        schema: FormSchema,
        initialInput: {
            title: "",
            description: "",
        },
    });
}
```

### Validation Modes

Formisch separates the **first** validation from **subsequent** validations. You
configure them with the `validate` and `revalidate` options on `useForm`.

```tsx showLineNumbers title="form.tsx" {3-4}
const form = useForm({
    schema: FormSchema,
    validate: "blur",
    revalidate: "input",
});
```

| Option       | Value       | Description                                                     |
| ------------ | ----------- | --------------------------------------------------------------- |
| `validate`   | `"submit"`  | Validate on form submission (default).                          |
| `validate`   | `"blur"`    | Validate when a field loses focus.                              |
| `validate`   | `"input"`   | Validate on every input change.                                 |
| `validate`   | `"initial"` | Validate immediately on form creation.                          |
| `revalidate` | `"input"`   | Revalidate on every input change after the first run (default). |
| `revalidate` | `"blur"`    | Revalidate on blur after the first run.                         |
| `revalidate` | `"submit"`  | Revalidate only on form submission.                             |

## Displaying Errors

Display errors next to the field using `<FieldError />`. Formisch returns errors
as an array of strings, so map them to the shape `<FieldError />` expects. For
styling and accessibility:

- Add the `data-invalid` prop to the `<Field />` component.
- Add the `aria-invalid` prop to the form control such as `<Input />`,
  `<SelectTrigger />`, `<Checkbox />`, etc.

```tsx showLineNumbers title="form.tsx" {3,10,12-14}
<FormischField of={form} path={["email"]}>
    {(field) => (
        <Field data-invalid={field.errors !== null}>
            <FieldLabel htmlFor="form-email">Email</FieldLabel>
            <Input
                {...field.props}
                id="form-email"
                value={field.input}
                type="email"
                aria-invalid={field.errors !== null}
            />
            {field.errors && (
                <FieldError
                    errors={field.errors.map((message) => ({ message }))}
                />
            )}
        </Field>
    )}
</FormischField>;
```

## Working with Different Field Types

Formisch exposes two ways to bind a field to an element:

- **Native HTML elements** (like `<Input />` and `<Textarea />`) — spread
  `field.props` and provide `value={field.input}`. Formisch wires up `name`,
  `ref`, `onChange`, `onBlur`, and `onFocus` for you.
- **Component-library inputs** (like Radix-based `<Select />`, `<Checkbox />`,
  `<RadioGroup />`, `<Switch />`) — read the value from `field.input` and call
  `field.onChange(value)` to update it.

### Input

- For input fields, spread `field.props` and provide `value={field.input}`.
- To show errors, add the `aria-invalid` prop to the `<Input />` component and
  the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-formisch-input"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {5-8}
<FormischField of={form} path={["username"]}>
    {(field) => (
        <Field data-invalid={field.errors !== null}>
            <FieldLabel htmlFor="form-username">Username</FieldLabel>
            <Input
                {...field.props}
                id="form-username"
                value={field.input}
                aria-invalid={field.errors !== null}
            />
            {field.errors && (
                <FieldError
                    errors={field.errors.map((message) => ({ message }))}
                />
            )}
        </Field>
    )}
</FormischField>;
```

### Textarea

- For textarea fields, spread `field.props` and provide `value={field.input}`.
- To show errors, add the `aria-invalid` prop to the `<Textarea />` component
  and the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-formisch-textarea"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {7-10}
<FormischField of={form} path={["about"]}>
    {(field) => (
        <Field data-invalid={field.errors !== null}>
            <FieldLabel htmlFor="form-about">More about you</FieldLabel>
            <Textarea
                {...field.props}
                id="form-about"
                value={field.input}
                aria-invalid={field.errors !== null}
                placeholder="I'm a software engineer..."
                className="min-h-[120px]"
            />
            <FieldDescription>
                Tell us more about yourself. This will be used to help us
                personalize your experience.
            </FieldDescription>
            {field.errors && (
                <FieldError
                    errors={field.errors.map((message) => ({ message }))}
                />
            )}
        </Field>
    )}
</FormischField>;
```

### Select

- For select components, read `field.input` and call `field.onChange` from
  `<Select />`'s `onValueChange`.
- To show errors, add the `aria-invalid` prop to the `<SelectTrigger />`
  component and the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-formisch-select"
  className="sm:[&_.preview]:h-[500px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {15-19}
<FormischField of={form} path={["language"]}>
    {(field) => (
        <Field orientation="responsive" data-invalid={field.errors !== null}>
            <FieldContent>
                <FieldLabel htmlFor="form-language">Spoken Language</FieldLabel>
                <FieldDescription>
                    For best results, select the language you speak.
                </FieldDescription>
                {field.errors && (
                    <FieldError
                        errors={field.errors.map((message) => ({ message }))}
                    />
                )}
            </FieldContent>
            <Select value={field.input} onValueChange={field.onChange}>
                <SelectTrigger
                    id="form-language"
                    aria-invalid={field.errors !== null}
                    className="min-w-[120px]"
                >
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                </SelectContent>
            </Select>
        </Field>
    )}
</FormischField>;
```

### Checkbox

- For checkbox arrays, read `field.input` and update it from `onCheckedChange`
  using `field.onChange`.
- To show errors, add the `aria-invalid` prop to the `<Checkbox />` component
  and the `data-invalid` prop to the `<Field />` component.
- Remember to add `data-slot="checkbox-group"` to the `<FieldGroup />` component
  for proper styling and spacing.

<ComponentPreview
  name="form-formisch-checkbox"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {16,19-25}
<FormischField of={form} path={["tasks"]}>
    {(field) => (
        <FieldSet>
            <FieldLegend variant="label">Tasks</FieldLegend>
            <FieldDescription>
                Get notified when tasks you&apos;ve created have updates.
            </FieldDescription>
            <FieldGroup data-slot="checkbox-group">
                {tasks.map((task) => (
                    <Field
                        key={task.id}
                        orientation="horizontal"
                        data-invalid={field.errors !== null}
                    >
                        <Checkbox
                            id={`form-checkbox-${task.id}`}
                            aria-invalid={field.errors !== null}
                            checked={field.input?.includes(task.id) ?? false}
                            onCheckedChange={(checked) => {
                                const current = field.input ?? [];
                                field.onChange(
                                    checked === true
                                        ? [...current, task.id]
                                        : current.filter((value) =>
                                            value !== task.id
                                        ),
                                );
                            }}
                        />
                        <FieldLabel
                            htmlFor={`form-checkbox-${task.id}`}
                            className="font-normal"
                        >
                            {task.label}
                        </FieldLabel>
                    </Field>
                ))}
            </FieldGroup>
            {field.errors && (
                <FieldError
                    errors={field.errors.map((message) => ({ message }))}
                />
            )}
        </FieldSet>
    )}
</FormischField>;
```

### Radio Group

- For radio groups, read `field.input` and call `field.onChange` from
  `onValueChange`.
- To show errors, add the `aria-invalid` prop to the `<RadioGroupItem />`
  component and the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-formisch-radiogroup"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {9-13,21}
<FormischField of={form} path={["plan"]}>
    {(field) => (
        <FieldSet>
            <FieldLegend>Plan</FieldLegend>
            <FieldDescription>
                You can upgrade or downgrade your plan at any time.
            </FieldDescription>
            <RadioGroup value={field.input} onValueChange={field.onChange}>
                {plans.map((plan) => (
                    <FieldLabel
                        key={plan.id}
                        htmlFor={`form-radiogroup-${plan.id}`}
                    >
                        <Field
                            orientation="horizontal"
                            data-invalid={field.errors !== null}
                        >
                            <FieldContent>
                                <FieldTitle>{plan.title}</FieldTitle>
                                <FieldDescription>
                                    {plan.description}
                                </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem
                                value={plan.id}
                                id={`form-radiogroup-${plan.id}`}
                                aria-invalid={field.errors !== null}
                            />
                        </Field>
                    </FieldLabel>
                ))}
            </RadioGroup>
            {field.errors && (
                <FieldError
                    errors={field.errors.map((message) => ({ message }))}
                />
            )}
        </FieldSet>
    )}
</FormischField>;
```

### Switch

- For switches, read `field.input` and call `field.onChange` from
  `onCheckedChange`.
- To show errors, add the `aria-invalid` prop to the `<Switch />` component and
  the `data-invalid` prop to the `<Field />` component.

<ComponentPreview
  name="form-formisch-switch"
  className="sm:[&_.preview]:h-[500px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {15-19}
<FormischField of={form} path={["twoFactor"]}>
    {(field) => (
        <Field orientation="horizontal" data-invalid={field.errors !== null}>
            <FieldContent>
                <FieldLabel htmlFor="form-twoFactor">
                    Multi-factor authentication
                </FieldLabel>
                <FieldDescription>
                    Enable multi-factor authentication to secure your account.
                </FieldDescription>
                {field.errors && (
                    <FieldError
                        errors={field.errors.map((message) => ({ message }))}
                    />
                )}
            </FieldContent>
            <Switch
                id="form-twoFactor"
                checked={field.input ?? false}
                onCheckedChange={field.onChange}
                aria-invalid={field.errors !== null}
            />
        </Field>
    )}
</FormischField>;
```

### Complex Forms

Here is an example of a more complex form with multiple fields and validation.

<ComponentPreview
  name="form-formisch-complex"
  className="sm:[&_.preview]:h-[1300px]"
  chromeLessOnMobile
/>

## Resetting the Form

Formisch exposes a top-level `reset` function. Pass the form store to reset it
to its initial input.

```tsx showLineNumbers
<Button type="button" variant="outline" onClick={() => reset(form)}>
    Reset
</Button>;
```

You can also reset to new initial values, or reset while keeping the user's
current input:

```tsx showLineNumbers
// Reset to a fresh set of initial values
reset(form, { initialInput: { title: "", description: "" } });

// Sync the baseline to new server data, but keep the user's edits
reset(form, { initialInput: serverData, keepInput: true });
```

## Array Fields

Formisch provides a `<FieldArray />` component and a set of helper functions for
managing dynamic array fields. Use it whenever you need to add, remove, or
reorder items.

<ComponentPreview
  name="form-formisch-array"
  className="sm:[&_.preview]:h-[700px]"
  chromeLessOnMobile
/>

### Using FieldArray

`<FieldArray />` follows the same render-prop pattern as `<Field />`. Its
`items` array contains a stable key per item that you should use as the React
`key`.

```tsx showLineNumbers title="form.tsx" {1,7-22}
import {
  Field as FormischField,
  FieldArray,
  insert,
  remove,
} from "@formisch/react"

export function ExampleForm() {
  // ... form config

  return (
    <FieldArray of={form} path={["emails"]}>
      {(fieldArray) => (
        <FieldGroup className="gap-4">
          {fieldArray.items.map((item, index) => (
            <FormischField
              key={item}
              of={form}
              path={["emails", index, "address"]}
            >
              {(field) => /* ... */}
            </FormischField>
          ))}
        </FieldGroup>
      )}
    </FieldArray>
  )
}
```

### Array Field Structure

Wrap your array fields in a `<FieldSet />` with a `<FieldLegend />` and
`<FieldDescription />`.

```tsx showLineNumbers title="form.tsx"
<FieldSet className="gap-4">
    <FieldLegend variant="label">Email Addresses</FieldLegend>
    <FieldDescription>
        Add up to 5 email addresses where we can contact you.
    </FieldDescription>
    <FieldGroup className="gap-4">{/* Array items go here */}</FieldGroup>
</FieldSet>;
```

### Adding Items

Use the `insert` function to add new items to the array. By default new items
are appended to the end. You can also pass an `at` index to insert at a specific
position.

```tsx showLineNumbers title="form.tsx"
<Button
    type="button"
    variant="outline"
    size="sm"
    onClick={() =>
        insert(form, { path: ["emails"], initialInput: { address: "" } })}
    disabled={fieldArray.items.length >= 5}
>
    Add Email Address
</Button>;
```

### Removing Items

Use the `remove` function with an `at` index to remove items from the array.

```tsx showLineNumbers title="form.tsx"
import { remove } from "@formisch/react";

{
    fieldArray.items.length > 1 && (
        <InputGroupAddon align="inline-end">
            <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => remove(form, { path: ["emails"], at: index })}
                aria-label={`Remove email ${index + 1}`}
            >
                <XIcon />
            </InputGroupButton>
        </InputGroupAddon>
    );
}
```

Formisch also exposes `move`, `swap`, and `replace` for reordering and replacing
items. They follow the same `(form, config)` signature.

### Array Validation

Use Valibot's `array` and pipeline validators to constrain array fields.

```tsx showLineNumbers title="form.tsx"
const FormSchema = v.object({
    emails: v.pipe(
        v.array(
            v.object({
                address: v.pipe(
                    v.string(),
                    v.nonEmpty("Enter an email address."),
                    v.email("Enter a valid email address."),
                ),
            }),
        ),
        v.minLength(1, "Add at least one email address."),
        v.maxLength(5, "You can add up to 5 email addresses."),
    ),
});
```

Changelog

Latest updates and announcements. June 2026 - GitHub Registries

You can now turn any public GitHub repository into a registry.

Add a registry.json file at the root of the repository, define the items you
want to distribute, and users can install them directly from GitHub with the
shadcn CLI.

pnpm dlx shadcn@latest add <username>/<repo>/<item>

For example, to install the project-conventions item from the acme/toolkit
repository:

pnpm dlx shadcn@latest add acme/toolkit/project-conventions

GitHub registries are source registries. You do not need to run shadcn build,
publish generated item JSON files or set up a registry server. The CLI reads the
root registry.json, resolves include entries, finds the requested item and
installs the files declared by that item. Distribute anything#

Registry items are not limited to components. A GitHub registry can distribute
components, hooks, utilities, design tokens, feature kits, project conventions,
agent instructions, testing setup, CI workflows, release workflows, templates,
codemods, migration kits and other project files.

For example, a repository can expose a project-conventions item that installs
shared docs, editor settings and agent instructions: registry.json

{ "$schema": "https://ui.shadcn.com/schema/registry.json", "name":
"acme-toolkit", "homepage": "https://github.com/acme/toolkit", "items": [ {
"name": "project-conventions", "type": "registry:item", "files": [ { "path":
"AGENTS.md", "type": "registry:file", "target": "~~/AGENTS.md" }, { "path":
".editorconfig", "type": "registry:file", "target": "~~/.editorconfig" }, {
"path": "docs/conventions.md", "type": "registry:file", "target":
"~/docs/conventions.md" } ] } ] }

Commands#

GitHub registry addresses work with the same commands as other registry
addresses.

List items from a GitHub registry:

pnpm dlx shadcn@latest list acme/toolkit

Search items:

pnpm dlx shadcn@latest search acme/toolkit --query conventions

View an item:

pnpm dlx shadcn@latest view acme/toolkit/project-conventions

Install an item:

pnpm dlx shadcn@latest add acme/toolkit/project-conventions

See the GitHub Registries docs for the full guide. May 2026 - shadcn eject

When we added support for both Radix and Base UI, we needed a place for shared
Tailwind utilities that both libraries depend on, e.g. custom variants like
data-open: and data-closed: and utilities like no-scrollbar.

We also ran into a few bugs while working on RTL support that were easier to fix
in one shared place rather than duplicating across every component.

So we created shadcn/tailwind.css. When you run init, it adds @import
"shadcn/tailwind.css" to your global CSS file. It works just like other CSS
imports such as tw-animate-css: a small dependency that is tree-shaken in
production and resolved at build time.

If you prefer not to depend on the shadcn package for that CSS, we've added the
shadcn eject command. It inlines shadcn/tailwind.css into your global CSS file
and removes the shadcn dependency from your project.

pnpm dlx shadcn@latest eject

Before

@import "tailwindcss"; @import "tw-animate-css"; @import "shadcn/tailwind.css";

After

@import "tailwindcss"; @import "tw-animate-css"; /* ejected from shadcn@4.8.3 */
@theme inline { @keyframes accordion-down { from { height: 0; } to { height:
var( --radix-accordion-content-height, var(--accordion-panel-height, auto) ); }
} }

@custom-variant data-open { &:where([data-state="open"]),
&:where([data-open]:not([data-open="false"])) { @slot; } }

In a monorepo, run the command from the workspace that contains your
components.json and global CSS file:

pnpm dlx shadcn@latest eject -c packages/ui

See the CLI documentation for more details. May 2026 - Introducing Rhea

Introducing Rhea, a new shadcn/ui style. A more compact Luma. Smaller spacing.
Denser surfaces. Built for focused product interfaces. Rhea style previewTry
Rhea in shadcn/create

Rhea started from a simple request we've heard a lot: Luma, but more compact. We
looked at how people were using the new styles and what they were asking for,
and the pattern was clear. A lot of teams wanted the softness and shape of Luma
with tighter spacing, smaller controls, and more information density.

Rhea keeps the same rounded foundation, but makes it more compact for product
interfaces where space matters. Buttons, inputs, menus, cards, and lists all sit
a little tighter so the UI can carry more without feeling crowded. Why a new
style?#

We considered making this a spacing tweak for Luma, but --spacing is a
multiplier. Changing it would change what familiar utilities mean across your
app. p-2, w-4, and m-16 would no longer mean the same size.

That tradeoff felt wrong. Compactness should not force you to relearn Tailwind's
spacing scale or wonder whether a utility means something different in one style
than another.

So Rhea is a new style instead. It lets us adjust component sizes, gaps, and
density directly while keeping the underlying utility scale predictable.

Available now in shadcn/create for both Radix and Base UI.

Try Rhea May 2026 - Registry Include and Validate

This release adds two updates for registry authors:

    include for composing large source registries from multiple registry.json files.
    shadcn registry validate for checking source registries before publishing.

This makes it easier to maintain source and dynamic registries without keeping
one large registry.json file by hand.

Registry authors can now organize a large source registry across multiple
registry.json files and compose them with shadcn build.

registry.json components └── ui ├── button.tsx ├── input.tsx └── registry.json
hooks ├── registry.json ├── use-media-query.ts └── use-toggle.ts

registry.json

{ "$schema": "https://ui.shadcn.com/schema/registry.json", "name": "acme",
"homepage": "https://acme.com", "include": [ "components/ui/registry.json",
"hooks/registry.json" ] }

Included registry.json files are valid registry files for composition and may
omit name and homepage. Only the root registry.json must define the registry
metadata. components/ui/registry.json

{ "$schema": "https://ui.shadcn.com/schema/registry.json", "items": [ { "name":
"button", "type": "registry:ui", "files": [ { "path": "button.tsx", "type":
"registry:ui" } ] } ] }

Build output#

shadcn build resolves included registries and writes a flattened registry.json
without include. Item file paths are preserved from the root registry, so a file
declared in components/ui/registry.json is written as components/ui/button.tsx
in the built registry item. Validate your registry#

You can now validate a source registry before publishing or serving it.

pnpm dlx shadcn registry validate

Validation runs against the source registry files directly. You do not need to
run shadcn build first.

The command checks the root registry.json, included registry files, item schema
errors, duplicate item names, include rules, and local item file paths.
Validation reports all actionable errors it can find in one run. Registry
loaders#

The shadcn/registry package also exports loadRegistry and loadRegistryItem for
dynamic registry routes. app/r/registry.json/route.ts

import { loadRegistry } from "shadcn/registry"

export async function GET() { const registry = await loadRegistry()

return Response.json(registry) }

app/r/[name].json/route.ts

import { loadRegistryItem } from "shadcn/registry"

export async function GET( _: Request, { params }: { params: Promise<{ name:
string }> } ) { const { name } = await params const item = await
loadRegistryItem(name)

return Response.json(item) }

See the registry.json documentation and getting started guide for more details.
May 2026 - Package Imports and Target Aliases

We've added support for package imports and aliases in files.target in
shadcn@4.7.0. Package imports#

The shadcn CLI now supports package.json#imports for installing components,
rewriting imports, and resolving third-party registries. You can use private
#... import aliases from your package.json instead of relying only on
compilerOptions.paths in tsconfig.json. package.json

{ "imports": { "#components/_": "./src/components/_.tsx", "#lib/_":
"./src/lib/_.ts", "#hooks/_": "./src/hooks/_.ts" } }

Then use the same roots in components.json: components.json

{ "aliases": { "components": "#components", "ui": "#components/ui", "lib":
"#lib", "hooks": "#hooks", "utils": "#lib/utils" } }

This also works in monorepos where app-local files use package imports and
shared UI files are imported from workspace package exports.

See the package imports guide for setup details. Target aliases#

Registry items can now use target aliases in files[].target to install files
under the user's configured shadcn directories. For example, the following
registry item will install the prompt-input.tsx file under the ui/ai directory.
example.json

{ "files": [ { "path": "registry/default/ai/prompt-input.tsx", "type":
"registry:ui", "target": "@ui/ai/prompt-input.tsx" } ] }

See the registry examples for more details. More Updates April 2026shadcn preset
April 2026Pointer Cursor April 2026Partial Preset Apply April 2026Introducing
Sera April 2026shadcn apply April 2026Component Composition March
2026Introducing Luma March 2026shadcn/cli v4 February 2026Blocks for Radix and
Base UI February 2026Unified Radix UI Package January 2026RTL Support January
2026Inline Start and End Styles January 2026Base UI Documentation December
2025npx shadcn create October 2025Registry Directory October 2025New Components
September 2025Registry Index August 2025shadcn CLI 3.0 and MCP Server July
2025Universal Registry Items July 2025Local File Support June 2025radix-ui
Migration June 2025Calendar Component May 2025New Site April 2025MCP April
2025shadcn 2.5.0 April 2025Cross-framework Route Support February 2025Tailwind
v4 February 2025Updated Registry Schema January 2025Blocks Community December
2024Monorepo Support November 2024Icons October 2024React 19 October 2024Sidebar
August 2024npx shadcn init April 2024Lift Mode March 2024Introducing Blocks
March 2024Breadcrumb and Input OTP December 2023New Components July
2023JavaScript June 2023New CLI, Styles and more

---
title: Accordion
description: A vertically stacked set of interactive headings that each reveal a section of content.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/primitives/docs/components/accordion
    api: https://www.radix-ui.com/primitives/docs/components/accordion#api-reference
---

<ComponentPreview
  name="accordion-demo"
  styleName="radix-nova"
  align="start"
  previewClassName="*:data-[slot=accordion]:max-w-sm h-[300px]"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
npx shadcn@latest add accordion
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="accordion"
  title="components/ui/accordion.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
```

```tsx showLineNumbers
<Accordion type="single" collapsible defaultValue="item-1">
    <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
    </AccordionItem>
</Accordion>;
```

## Composition

Use the following composition to build an `Accordion`:

```text
Accordion
├── AccordionItem
│   ├── AccordionTrigger
│   └── AccordionContent
└── AccordionItem
    ├── AccordionTrigger
    └── AccordionContent
```

## Examples

### Basic

A basic accordion that shows one item at a time. The first item is open by
default.

<ComponentPreview
  name="accordion-basic"
  styleName="radix-nova"
  align="start"
  previewClassName="*:data-[slot=accordion]:max-w-sm h-[300px]"
/>

### Multiple

Use `type="multiple"` to allow multiple items to be open at the same time.

<ComponentPreview
  name="accordion-multiple"
  styleName="radix-nova"
  align="start"
  previewClassName="*:data-[slot=accordion]:max-w-sm h-[36rem] md:h-[30rem]"
/>

### Disabled

Use the `disabled` prop on `AccordionItem` to disable individual items.

<ComponentPreview
  name="accordion-disabled"
  styleName="radix-nova"
  align="start"
  previewClassName="*:data-[slot=accordion]:max-w-sm h-[300px]"
/>

### Borders

Add `border` to the `Accordion` and `border-b last:border-b-0` to the
`AccordionItem` to add borders to the items.

<ComponentPreview
  name="accordion-borders"
  styleName="radix-nova"
  align="start"
  previewClassName="*:data-[slot=accordion]:max-w-sm h-96 md:h-80"
/>

### Card

Wrap the `Accordion` in a `Card` component.

<ComponentPreview
  name="accordion-card"
  styleName="radix-nova"
  align="start"
  previewClassName="*:data-[slot=accordion]:max-w-sm h-[32rem] md:h-[28rem]"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="accordion-rtl"
  align="start"
  direction="rtl"
/>

## API Reference

See the
[Radix UI](https://www.radix-ui.com/primitives/docs/components/accordion#api-reference)
documentation for more information.

---
title: Alert
description: Displays a callout for user attention.
base: radix
component: true
---

<ComponentPreview
  name="alert-demo"
  styleName="radix-nova"
  previewClassName="h-auto sm:h-72 p-6"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add alert
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="alert"
  title="components/ui/alert.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Alert,
    AlertAction,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
```

```tsx showLineNumbers
<Alert>
    <InfoIcon />
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription>
        You can add components and dependencies to your app using the cli.
    </AlertDescription>
    <AlertAction>
        <Button variant="outline">Enable</Button>
    </AlertAction>
</Alert>;
```

## Composition

Use the following composition to build an `Alert`:

```text
Alert
├── Icon
├── AlertTitle
├── AlertDescription
└── AlertAction
```

## Examples

### Basic

A basic alert with an icon, title and description.

<ComponentPreview
  name="alert-basic"
  styleName="radix-nova"
  previewClassName="h-auto sm:h-72 p-6"
/>

### Destructive

Use `variant="destructive"` to create a destructive alert.

<ComponentPreview
  name="alert-destructive"
  styleName="radix-nova"
  previewClassName="h-auto sm:h-72 p-6"
/>

### Action

Use `AlertAction` to add a button or other action element to the alert.

<ComponentPreview
  name="alert-action"
  styleName="radix-nova"
  previewClassName="h-auto sm:h-72 p-6"
/>

### Custom Colors

You can customize the alert colors by adding custom classes such as
`bg-amber-50 dark:bg-amber-950` to the `Alert` component.

<ComponentPreview
  name="alert-colors"
  styleName="radix-nova"
  previewClassName="h-auto sm:h-72 p-6"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="alert-rtl"
  direction="rtl"
  previewClassName="h-auto sm:h-72 p-6"
/>

## API Reference

### Alert

The `Alert` component displays a callout for user attention.

| Prop      | Type                         | Default     |
| --------- | ---------------------------- | ----------- |
| `variant` | `"default" \| "destructive"` | `"default"` |

### AlertTitle

The `AlertTitle` component displays the title of the alert.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### AlertDescription

The `AlertDescription` component displays the description or content of the
alert.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### AlertAction

The `AlertAction` component displays an action element (like a button)
positioned absolutely in the top-right corner of the alert.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

---
title: Alert Dialog
description: A modal dialog that interrupts the user with important content and expects a response.
featured: true
base: radix
component: true
links:
    doc: https://www.radix-ui.com/primitives/docs/components/alert-dialog
    api: https://www.radix-ui.com/primitives/docs/components/alert-dialog#api-reference
---

<ComponentPreview
  name="alert-dialog-demo"
  styleName="radix-nova"
  previewClassName="h-56"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add alert-dialog
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="alert-dialog"
  title="components/ui/alert-dialog.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
```

```tsx showLineNumbers
<AlertDialog>
    <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account from our servers.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>;
```

## Composition

Use the following composition to build an `AlertDialog`:

```text
AlertDialog
├── AlertDialogTrigger
└── AlertDialogContent
    ├── AlertDialogHeader
    │   ├── AlertDialogMedia
    │   ├── AlertDialogTitle
    │   └── AlertDialogDescription
    └── AlertDialogFooter
        ├── AlertDialogCancel
        └── AlertDialogAction
```

## Examples

### Basic

A basic alert dialog with a title, description, and cancel and continue buttons.

<ComponentPreview
  name="alert-dialog-basic"
  styleName="radix-nova"
  previewClassName="h-56"
/>

### Small

Use the `size="sm"` prop to make the alert dialog smaller.

<ComponentPreview
  name="alert-dialog-small"
  styleName="radix-nova"
  previewClassName="h-56"
/>

### Media

Use the `AlertDialogMedia` component to add a media element such as an icon or
image to the alert dialog.

<ComponentPreview
  name="alert-dialog-media"
  styleName="radix-nova"
  previewClassName="h-56"
/>

### Small with Media

Use the `size="sm"` prop to make the alert dialog smaller and the
`AlertDialogMedia` component to add a media element such as an icon or image to
the alert dialog.

<ComponentPreview
  name="alert-dialog-small-media"
  styleName="radix-nova"
  previewClassName="h-56"
/>

### Destructive

Use the `AlertDialogAction` component to add a destructive action button to the
alert dialog.

<ComponentPreview
  name="alert-dialog-destructive"
  styleName="radix-nova"
  previewClassName="h-56"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="alert-dialog-rtl"
  direction="rtl"
  previewClassName="h-56"
/>

## API Reference

### size

Use the `size` prop on the `AlertDialogContent` component to control the size of
the alert dialog. It accepts the following values:

| Prop   | Type                | Default     |
| ------ | ------------------- | ----------- |
| `size` | `"default" \| "sm"` | `"default"` |

For more information about the other components and their props, see the
[Radix UI documentation](https://www.radix-ui.com/primitives/docs/components/alert-dialog#api-reference).

---
title: Aspect Ratio
description: Displays content within a desired ratio.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/primitives/docs/components/aspect-ratio
    api: https://www.radix-ui.com/primitives/docs/components/aspect-ratio#api-reference
---

<ComponentPreview name="aspect-ratio-demo" styleName="radix-nova" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add aspect-ratio
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="aspect-ratio"
  title="components/ui/aspect-ratio.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { AspectRatio } from "@/components/ui/aspect-ratio";
```

```tsx showLineNumbers
<AspectRatio ratio={16 / 9}>
    <Image src="..." alt="Image" className="rounded-md object-cover" />
</AspectRatio>;
```

## Examples

### Square

A square aspect ratio component using the `ratio={1 / 1}` prop. This is useful
for displaying images in a square format.

<ComponentPreview name="aspect-ratio-square" styleName="radix-nova" />

### Portrait

A portrait aspect ratio component using the `ratio={9 / 16}` prop. This is
useful for displaying images in a portrait format.

<ComponentPreview
  name="aspect-ratio-portrait"
  styleName="radix-nova"
  previewClassName="h-96"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="aspect-ratio-rtl"
  direction="rtl"
  previewClassName="h-96"
/>

## API Reference

### AspectRatio

The `AspectRatio` component displays content within a desired ratio.

| Prop        | Type     | Default | Required |
| ----------- | -------- | ------- | -------- |
| `ratio`     | `number` | -       | Yes      |
| `className` | `string` | -       | No       |

For more information, see the
[Radix UI documentation](https://www.radix-ui.com/primitives/docs/components/aspect-ratio#api-reference).

---
title: Avatar
description: An image element with a fallback for representing the user.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/primitives/docs/components/avatar
    api: https://www.radix-ui.com/primitives/docs/components/avatar#api-reference
---

<ComponentPreview styleName="radix-nova" name="avatar-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add avatar
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="avatar" title="components/ui/avatar.tsx"

/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
```

```tsx showLineNumbers
<Avatar>
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
</Avatar>;
```

## Composition

Use the following composition to build an `Avatar`:

```text
Avatar
├── AvatarImage
├── AvatarFallback
└── AvatarBadge
```

Use the following composition to build an `AvatarGroup`:

```text
AvatarGroup
├── Avatar
│   ├── AvatarImage
│   ├── AvatarFallback
│   └── AvatarBadge
├── Avatar
│   ├── AvatarImage
│   ├── AvatarFallback
│   └── AvatarBadge
└── AvatarGroupCount
```

## Examples

### Basic

A basic avatar component with an image and a fallback.

<ComponentPreview styleName="radix-nova" name="avatar-basic" />

### Badge

Use the `AvatarBadge` component to add a badge to the avatar. The badge is
positioned at the bottom right of the avatar.

<ComponentPreview styleName="radix-nova" name="avatar-badge" />

Use the `className` prop to add custom styles to the badge such as custom
colors, sizes, etc.

```tsx showLineNumbers
<Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
    <AvatarBadge className="bg-green-600 dark:bg-green-800" />
</Avatar>;
```

### Badge with Icon

You can also use an icon inside `<AvatarBadge>`.

<ComponentPreview name="avatar-badge-icon" styleName="radix-nova"

/>

### Avatar Group

Use the `AvatarGroup` component to add a group of avatars.

<ComponentPreview name="avatar-group" styleName="radix-nova"

/>

### Avatar Group Count

Use `<AvatarGroupCount>` to add a count to the group.

<ComponentPreview name="avatar-group-count" styleName="radix-nova"

/>

### Avatar Group with Icon

You can also use an icon inside `<AvatarGroupCount>`.

<ComponentPreview name="avatar-group-count-icon" styleName="radix-nova"

/>

### Sizes

Use the `size` prop to change the size of the avatar.

<ComponentPreview name="avatar-size" styleName="radix-nova"

/>

### Dropdown

You can use the `Avatar` component as a trigger for a dropdown menu.

<ComponentPreview styleName="radix-nova" name="avatar-dropdown" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="avatar-rtl"
  direction="rtl"
  previewClassName="h-72"
/>

## API Reference

### Avatar

The `Avatar` component is the root component that wraps the avatar image and
fallback.

| Prop        | Type                        | Default     |
| ----------- | --------------------------- | ----------- |
| `size`      | `"default" \| "sm" \| "lg"` | `"default"` |
| `className` | `string`                    | -           |

### AvatarImage

The `AvatarImage` component displays the avatar image. It accepts all Radix UI
Avatar Image props.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `src`       | `string` | -       |
| `alt`       | `string` | -       |
| `className` | `string` | -       |

### AvatarFallback

The `AvatarFallback` component displays a fallback when the image fails to load.
It accepts all Radix UI Avatar Fallback props.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### AvatarBadge

The `AvatarBadge` component displays a badge indicator on the avatar, typically
positioned at the bottom right.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### AvatarGroup

The `AvatarGroup` component displays a group of avatars with overlapping
styling.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### AvatarGroupCount

The `AvatarGroupCount` component displays a count indicator in an avatar group,
typically showing the number of additional avatars.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

For more information about Radix UI Avatar props, see the
[Radix UI documentation](https://www.radix-ui.com/primitives/docs/components/avatar#api-reference).

---
title: Badge
description: Displays a badge or a component that looks like a badge.
base: radix
component: true
---

<ComponentPreview styleName="radix-nova" name="badge-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add badge
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="badge" title="components/ui/badge.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Badge } from "@/components/ui/badge";
```

```tsx
<Badge variant="default | outline | secondary | destructive">Badge</Badge>;
```

## Examples

### Variants

Use the `variant` prop to change the variant of the badge.

<ComponentPreview styleName="radix-nova" name="badge-variants" />

### With Icon

You can render an icon inside the badge. Use `data-icon="inline-start"` to
render the icon on the left and `data-icon="inline-end"` to render the icon on
the right.

<ComponentPreview styleName="radix-nova" name="badge-icon" />

### With Spinner

You can render a spinner inside the badge. Remember to add the
`data-icon="inline-start"` or `data-icon="inline-end"` prop to the spinner.

<ComponentPreview styleName="radix-nova" name="badge-spinner" />

### Link

Use the `asChild` prop to render a link as a badge.

<ComponentPreview styleName="radix-nova" name="badge-link" />

### Custom Colors

You can customize the colors of a badge by adding custom classes such as
`bg-green-50 dark:bg-green-800` to the `Badge` component.

<ComponentPreview styleName="radix-nova" name="badge-colors" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="badge-rtl" direction="rtl" />

## API Reference

### Badge

The `Badge` component displays a badge or a component that looks like a badge.

| Prop        | Type                                                                          | Default     |
| ----------- | ----------------------------------------------------------------------------- | ----------- |
| `variant`   | `"default" \| "secondary" \| "destructive" \| "outline" \| "ghost" \| "link"` | `"default"` |
| `className` | `string`                                                                      | -           |

---
title: Breadcrumb
description: Displays the path to the current resource using a hierarchy of links.
base: radix
component: true
---

<ComponentPreview
  styleName="radix-nova"
  name="breadcrumb-demo"
  previewClassName="p-2"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add breadcrumb
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="breadcrumb" title="components/ui/breadcrumb.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
```

```tsx showLineNumbers
<Breadcrumb>
    <BreadcrumbList>
        <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
    </BreadcrumbList>
</Breadcrumb>;
```

## Composition

Use the following composition to build a `Breadcrumb`:

```text
Breadcrumb
└── BreadcrumbList
    ├── BreadcrumbItem
    │   └── BreadcrumbLink
    ├── BreadcrumbSeparator
    ├── BreadcrumbItem
    │   └── BreadcrumbLink
    ├── BreadcrumbSeparator
    └── BreadcrumbItem
        └── BreadcrumbPage
```

## Examples

### Basic

A basic breadcrumb with a home link and a components link.

<ComponentPreview styleName="radix-nova" name="breadcrumb-basic" />

### Custom separator

Use a custom component as `children` for `<BreadcrumbSeparator />` to create a
custom separator.

<ComponentPreview styleName="radix-nova" name="breadcrumb-separator" />

### Dropdown

You can compose `<BreadcrumbItem />` with a `<DropdownMenu />` to create a
dropdown in the breadcrumb.

<ComponentPreview styleName="radix-nova" name="breadcrumb-dropdown" />

### Collapsed

We provide a `<BreadcrumbEllipsis />` component to show a collapsed state when
the breadcrumb is too long.

<ComponentPreview
  styleName="radix-nova"
  name="breadcrumb-ellipsis"
  previewClassName="p-2"
/>

### Link component

To use a custom link component from your routing library, you can use the
`asChild` prop on `<BreadcrumbLink />`.

<ComponentPreview styleName="radix-nova" name="breadcrumb-link" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="breadcrumb-rtl"
  direction="rtl"
  previewClassName="p-2"
/>

## API Reference

### Breadcrumb

The `Breadcrumb` component is the root navigation element that wraps all
breadcrumb components.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### BreadcrumbList

The `BreadcrumbList` component displays the ordered list of breadcrumb items.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### BreadcrumbItem

The `BreadcrumbItem` component wraps individual breadcrumb items.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### BreadcrumbLink

The `BreadcrumbLink` component displays a clickable link in the breadcrumb.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### BreadcrumbPage

The `BreadcrumbPage` component displays the current page in the breadcrumb
(non-clickable).

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### BreadcrumbSeparator

The `BreadcrumbSeparator` component displays a separator between breadcrumb
items. You can pass custom children to override the default separator icon.

| Prop        | Type              | Default |
| ----------- | ----------------- | ------- |
| `children`  | `React.ReactNode` | -       |
| `className` | `string`          | -       |

### BreadcrumbEllipsis

The `BreadcrumbEllipsis` component displays an ellipsis indicator for collapsed
breadcrumb items.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

---
title: Button
description: Displays a button or a component that looks like a button.
featured: true
base: radix
component: true
---

<ComponentPreview styleName="radix-nova" name="button-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add button
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="button"
  title="components/ui/button.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Button } from "@/components/ui/button";
```

```tsx
<Button variant="outline">Button</Button>;
```

## Cursor

Tailwind v4
[switched](https://tailwindcss.com/docs/upgrade-guide#buttons-use-the-default-cursor)
from `cursor: pointer` to `cursor: default` for the button component.

If you want to keep the `cursor: pointer` behavior, add the following code to
your CSS file:

You can also enable this during project setup with
`npx shadcn@latest init --pointer`.

```css showLineNumbers title="globals.css"
@layer base {
    button:not(:disabled),
    [role="button"]:not(:disabled) {
        cursor: pointer;
    }
}
```

## Examples

### Size

Use the `size` prop to change the size of the button.

<ComponentPreview styleName="radix-nova" name="button-size" />

### Default

<ComponentPreview styleName="radix-nova" name="button-default" />

### Outline

<ComponentPreview styleName="radix-nova" name="button-outline" />

### Secondary

<ComponentPreview styleName="radix-nova" name="button-secondary" />

### Ghost

<ComponentPreview styleName="radix-nova" name="button-ghost" />

### Destructive

<ComponentPreview styleName="radix-nova" name="button-destructive" />

### Link

<ComponentPreview styleName="radix-nova" name="button-link" />

### Icon

<ComponentPreview styleName="radix-nova" name="button-icon" />

### With Icon

Remember to add the `data-icon="inline-start"` or `data-icon="inline-end"`
attribute to the icon for the correct spacing.

<ComponentPreview styleName="radix-nova" name="button-with-icon" />

### Rounded

Use the `rounded-full` class to make the button rounded.

<ComponentPreview styleName="radix-nova" name="button-rounded" />

### Spinner

Render a `<Spinner />` component inside the button to show a loading state.
Remember to add the `data-icon="inline-start"` or `data-icon="inline-end"`
attribute to the spinner for the correct spacing.

<ComponentPreview styleName="radix-nova" name="button-spinner" />

### Button Group

To create a button group, use the `ButtonGroup` component. See the
[Button Group](/docs/components/radix/button-group) documentation for more
details.

<ComponentPreview styleName="radix-nova" name="button-group-demo" />

### As Child

You can use the `asChild` prop on `<Button />` to make another component look
like a button. Here's an example of a link that looks like a button.

<ComponentPreview styleName="radix-nova" name="button-aschild" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="button-rtl" direction="rtl" />

## API Reference

### Button

The `Button` component is a wrapper around the `button` element that adds a
variety of styles and functionality.

| Prop      | Type                                                                                 | Default     |
| --------- | ------------------------------------------------------------------------------------ | ----------- |
| `variant` | `"default" \| "outline" \| "ghost" \| "destructive" \| "secondary" \| "link"`        | `"default"` |
| `size`    | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` | `"default"` |
| `asChild` | `boolean`                                                                            | `false`     |

---
title: Button Group
description: A container that groups related buttons together with consistent styling.
base: radix
component: true
---

<ComponentPreview styleName="radix-nova" name="button-group-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add button-group
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="button-group"
  title="components/ui/button-group.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import {
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
} from "@/components/ui/button-group";
```

```tsx
<ButtonGroup>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
</ButtonGroup>;
```

## Composition

Use the following composition to build a `ButtonGroup`:

```text
ButtonGroup
├── Button or Input
├── ButtonGroupSeparator
└── ButtonGroupText
```

## Accessibility

- The `ButtonGroup` component has the `role` attribute set to `group`.
- Use <Kbd>Tab</Kbd> to navigate between the buttons in the group.
- Use `aria-label` or `aria-labelledby` to label the button group.

```tsx showLineNumbers
<ButtonGroup aria-label="Button group">
    <Button>Button 1</Button>
    <Button>Button 2</Button>
</ButtonGroup>;
```

## ButtonGroup vs ToggleGroup

- Use the `ButtonGroup` component when you want to group buttons that perform an
  action.
- Use the `ToggleGroup` component when you want to group buttons that toggle a
  state.

## Examples

### Orientation

Set the `orientation` prop to change the button group layout.

<ComponentPreview styleName="radix-nova" name="button-group-orientation" />

### Size

Control the size of buttons using the `size` prop on individual buttons.

<ComponentPreview styleName="radix-nova" name="button-group-size" />

### Nested

Nest `<ButtonGroup>` components to create button groups with spacing.

<ComponentPreview styleName="radix-nova" name="button-group-nested" />

### Separator

The `ButtonGroupSeparator` component visually divides buttons within a group.

Buttons with variant `outline` do not need a separator since they have a border.
For other variants, a separator is recommended to improve the visual hierarchy.

<ComponentPreview styleName="radix-nova" name="button-group-separator" />

### Split

Create a split button group by adding two buttons separated by a
`ButtonGroupSeparator`.

<ComponentPreview styleName="radix-nova" name="button-group-split" />

### Input

Wrap an `Input` component with buttons.

<ComponentPreview styleName="radix-nova" name="button-group-input" />

### Input Group

Wrap an `InputGroup` component to create complex input layouts.

<ComponentPreview styleName="radix-nova" name="button-group-input-group" />

### Dropdown Menu

Create a split button group with a `DropdownMenu` component.

<ComponentPreview styleName="radix-nova" name="button-group-dropdown" />

### Select

Pair with a `Select` component.

<ComponentPreview styleName="radix-nova" name="button-group-select" />

### Popover

Use with a `Popover` component.

<ComponentPreview styleName="radix-nova" name="button-group-popover" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="button-group-rtl"
  direction="rtl"
/>

## API Reference

### ButtonGroup

The `ButtonGroup` component is a container that groups related buttons together
with consistent styling.

| Prop          | Type                         | Default        |
| ------------- | ---------------------------- | -------------- |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |

```tsx
<ButtonGroup>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
</ButtonGroup>;
```

Nest multiple button groups to create complex layouts with spacing. See the
[nested](#nested) example for more details.

```tsx
<ButtonGroup>
    <ButtonGroup />
    <ButtonGroup />
</ButtonGroup>;
```

### ButtonGroupSeparator

The `ButtonGroupSeparator` component visually divides buttons within a group.

| Prop          | Type                         | Default      |
| ------------- | ---------------------------- | ------------ |
| `orientation` | `"horizontal" \| "vertical"` | `"vertical"` |

```tsx
<ButtonGroup>
    <Button>Button 1</Button>
    <ButtonGroupSeparator />
    <Button>Button 2</Button>
</ButtonGroup>;
```

### ButtonGroupText

Use this component to display text within a button group.

| Prop      | Type      | Default |
| --------- | --------- | ------- |
| `asChild` | `boolean` | `false` |

```tsx
<ButtonGroup>
    <ButtonGroupText>Text</ButtonGroupText>
    <Button>Button</Button>
</ButtonGroup>;
```

Use the `asChild` prop to render a custom component as the text, for example a
label.

```tsx showLineNumbers
import { ButtonGroupText } from "@/components/ui/button-group";
import { Label } from "@/components/ui/label";

export function ButtonGroupTextDemo() {
    return (
        <ButtonGroup>
            <ButtonGroupText asChild>
                <Label htmlFor="name">Text</Label>
            </ButtonGroupText>
            <Input placeholder="Type something here..." id="name" />
        </ButtonGroup>
    );
}
```

---
title: Calendar
description: A calendar component that allows users to select a date or a range of dates.
base: radix
component: true
links:
    doc: https://react-day-picker.js.org
---

<ComponentPreview
  styleName="radix-nova"
  name="calendar-demo"
  previewClassName="h-96"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add calendar
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install react-day-picker date-fns
```

<Step>Add the `Button` component to your project.</Step>

The `Calendar` component uses the `Button` component. Make sure you have it
installed in your project.

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="calendar"
  title="components/ui/calendar.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Calendar } from "@/components/ui/calendar";
```

```tsx showLineNumbers
const [date, setDate] = React.useState<Date | undefined>(new Date());

return (
    <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border"
    />
);
```

See the [React DayPicker](https://react-day-picker.js.org) documentation for
more information.

## About

The `Calendar` component is built on top of
[React DayPicker](https://react-day-picker.js.org).

## Date Picker

You can use the `<Calendar>` component to build a date picker. See the
[Date Picker](/docs/components/radix/date-picker) page for more information.

## Persian / Hijri / Jalali Calendar

To use the Persian calendar, edit `components/ui/calendar.tsx` and replace
`react-day-picker` with `react-day-picker/persian`.

```diff
- import { DayPicker } from "react-day-picker"
+ import { DayPicker } from "react-day-picker/persian"
```

<ComponentPreview
  styleName="radix-nova"
  name="calendar-hijri"
  title="Persian / Hijri / Jalali Calendar"
  description="A Persian calendar."
  previewClassName="h-[400px]"
/>

## Selected Date (With TimeZone)

The Calendar component accepts a `timeZone` prop to ensure dates are displayed
and selected in the user's local timezone.

```tsx showLineNumbers
export function CalendarWithTimezone() {
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [timeZone, setTimeZone] = React.useState<string | undefined>(
        undefined,
    );

    React.useEffect(() => {
        setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            timeZone={timeZone}
        />
    );
}
```

**Note:** If you notice a selected date offset (for example, selecting the 20th
highlights the 19th), make sure the `timeZone` prop is set to the user's local
timezone.

**Why client-side?** The timezone is detected using
`Intl.DateTimeFormat().resolvedOptions().timeZone` inside a `useEffect` to
ensure compatibility with server-side rendering. Detecting the timezone during
render would cause hydration mismatches, as the server and client may be in
different timezones.

## Examples

### Basic

A basic calendar component. We used `className="rounded-lg border"` to style the
calendar.

<ComponentPreview
  styleName="radix-nova"
  name="calendar-basic"
  previewClassName="h-96"
/>

### Range Calendar

Use the `mode="range"` prop to enable range selection.

<ComponentPreview
  styleName="radix-nova"
  name="calendar-range"
  previewClassName="h-[36rem] md:h-96"
/>

### Month and Year Selector

Use `captionLayout="dropdown"` to show month and year dropdowns.

<ComponentPreview
  styleName="radix-nova"
  name="calendar-caption"
  previewClassName="h-96"
/>

### Presets

<ComponentPreview
  styleName="radix-nova"
  name="calendar-presets"
  previewClassName="h-[650px]"
/>

### Date and Time Picker

<ComponentPreview
  styleName="radix-nova"
  name="calendar-time"
  previewClassName="h-[600px]"
/>

### Booked dates

<ComponentPreview
  styleName="radix-nova"
  name="calendar-booked-dates"
  previewClassName="h-96"
/>

### Custom Cell Size

<ComponentPreview
  styleName="radix-nova"
  name="calendar-custom-days"
  title="Custom Cell Size"
  description="A calendar with custom cell size that's responsive."
  className="**:[.preview]:h-[560px]"
/>

You can customize the size of calendar cells using the `--cell-size` CSS
variable. You can also make it responsive by using breakpoint-specific values:

```tsx showLineNumbers
<Calendar
    mode="single"
    selected={date}
    onSelect={setDate}
    className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
/>;
```

Or use fixed values:

```tsx showLineNumbers
<Calendar
    mode="single"
    selected={date}
    onSelect={setDate}
    className="rounded-lg border [--cell-size:2.75rem] md:[--cell-size:3rem]"
/>;
```

### Week Numbers

Use `showWeekNumber` to show week numbers.

<ComponentPreview
  styleName="radix-nova"
  name="calendar-week-numbers"
  previewClassName="h-96"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

See also the [Hijri Guide](#persian--hijri--jalali-calendar) for enabling the
Persian / Hijri / Jalali calendar.

<ComponentPreview
  styleName="radix-nova"
  name="calendar-rtl"
  direction="rtl"
  previewClassName="h-96"
/>

When using RTL, import the locale from `react-day-picker/locale` and pass both
the `locale` and `dir` props to the Calendar component:

```tsx showLineNumbers
import { arSA } from "react-day-picker/locale";
<Calendar
    mode="single"
    selected={date}
    onSelect={setDate}
    locale={arSA}
    dir="rtl"
/>;
```

## API Reference

See the [React DayPicker](https://react-day-picker.js.org) documentation for
more information on the `Calendar` component.

## Changelog

### RTL Support

If you're upgrading from a previous version of the `Calendar` component, you'll
need to apply the following updates to add locale support:

<Steps>

<Step>Import the `Locale` type.</Step>

Add `Locale` to your imports from `react-day-picker`:

```diff
  import {
    DayPicker,
    getDefaultClassNames,
    type DayButton,
+   type Locale,
  } from "react-day-picker"
```

<Step>Add `locale` prop to the Calendar component.</Step>

Add the `locale` prop to the component's props:

```diff
  function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    captionLayout = "label",
    buttonVariant = "ghost",
+   locale,
    formatters,
    components,
    ...props
  }: React.ComponentProps<typeof DayPicker> & {
    buttonVariant?: React.ComponentProps<typeof Button>["variant"]
  }) {
```

<Step>Pass `locale` to DayPicker.</Step>

Pass the `locale` prop to the `DayPicker` component:

```diff
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(...)}
      captionLayout={captionLayout}
+     locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
-         date.toLocaleString("default", { month: "short" }),
+         date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
```

<Step>Update CalendarDayButton to accept locale.</Step>

Update the `CalendarDayButton` component signature and pass `locale`:

```diff
  function CalendarDayButton({
    className,
    day,
    modifiers,
+   locale,
    ...props
- }: React.ComponentProps<typeof DayButton>) {
+ }: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
```

<Step>Update date formatting in CalendarDayButton.</Step>

Use `locale?.code` in the date formatting:

```diff
    <Button
      variant="ghost"
      size="icon"
-     data-day={day.date.toLocaleDateString()}
+     data-day={day.date.toLocaleDateString(locale?.code)}
      ...
    />
```

<Step>Pass locale to DayButton component.</Step>

Update the `DayButton` component usage to pass the `locale` prop:

```diff
      components={{
        ...
-       DayButton: CalendarDayButton,
+       DayButton: ({ ...props }) => (
+         <CalendarDayButton locale={locale} {...props} />
+       ),
        ...
      }}
```

<Step>Update RTL-aware CSS classes.</Step>

Replace directional classes with logical properties for better RTL support:

```diff
  // In the day classNames:
- [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)
+ [&:last-child[data-selected=true]_button]:rounded-e-(--cell-radius)
- [&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)
+ [&:nth-child(2)[data-selected=true]_button]:rounded-s-(--cell-radius)
- [&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)
+ [&:first-child[data-selected=true]_button]:rounded-s-(--cell-radius)

  // In range_start classNames:
- rounded-l-(--cell-radius) ... after:right-0
+ rounded-s-(--cell-radius) ... after:end-0

  // In range_end classNames:
- rounded-r-(--cell-radius) ... after:left-0
+ rounded-e-(--cell-radius) ... after:start-0

  // In CalendarDayButton className:
- data-[range-end=true]:rounded-r-(--cell-radius)
+ data-[range-end=true]:rounded-e-(--cell-radius)
- data-[range-start=true]:rounded-l-(--cell-radius)
+ data-[range-start=true]:rounded-s-(--cell-radius)
```

</Steps>

After applying these changes, you can use the `locale` prop to provide
locale-specific formatting:

```tsx
import { enUS } from "react-day-picker/locale";
<Calendar mode="single" selected={date} onSelect={setDate} locale={enUS} />;
```

---
title: Card
description: Displays a card with header, content, and footer.
base: radix
component: true
---

<ComponentPreview
  name="card-demo"
  styleName="radix-nova"
  previewClassName="h-[30rem]"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add card
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="card"
  title="components/ui/card.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
```

```tsx showLineNumbers
<Card>
    <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
        <CardAction>Card Action</CardAction>
    </CardHeader>
    <CardContent>
        <p>Card Content</p>
    </CardContent>
    <CardFooter>
        <p>Card Footer</p>
    </CardFooter>
</Card>;
```

## Composition

Use the following composition to build a `Card`:

```text
Card
├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   └── CardAction
├── CardContent
└── CardFooter
```

## Examples

### Size

Use the `size="sm"` prop to set the size of the card to small. The small size
variant uses smaller spacing.

<ComponentPreview
  styleName="radix-nova"
  name="card-small"
  previewClassName="h-96"
/>

### Spacing

In addition to the `size` prop, you can use the `--card-spacing` CSS variable to
control the spacing between sections and the inset of card parts.

<ComponentPreview
  styleName="radix-nova"
  name="card-spacing"
  previewClassName="h-[34rem]"
/>

Use negative margins with `-mx-(--card-spacing)` to make content go edge to edge
while keeping it aligned with the card inset. When the edge-to-edge content sits
above a footer, use `-mb-(--card-spacing)` on `CardContent` to remove the
section gap.

<ComponentPreview
  styleName="radix-nova"
  name="card-edge-to-edge"
  previewClassName="h-[24rem]"
/>

### Image

Add an image before the card header to create a card with an image.

<ComponentPreview
  styleName="radix-nova"
  name="card-image"
  previewClassName="h-[32rem]"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="card-rtl"
  direction="rtl"
  previewClassName="h-[30rem]"
/>

## API Reference

### Card

The `Card` component is the root container for card content.

| Prop        | Type                | Default     |
| ----------- | ------------------- | ----------- |
| `size`      | `"default" \| "sm"` | `"default"` |
| `className` | `string`            | -           |

### CardHeader

The `CardHeader` component is used for a title, description, and optional
action.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### CardTitle

The `CardTitle` component is used for the card title.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### CardDescription

The `CardDescription` component is used for helper text under the title.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### CardAction

The `CardAction` component places content in the top-right of the header (for
example, a button or a badge).

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### CardContent

The `CardContent` component is used for the main card body.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### CardFooter

The `CardFooter` component is used for actions and secondary content at the
bottom of the card.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

## Changelog

### Spacing Variable

If you're upgrading from a previous version of the `Card` component, you'll need
to apply the following updates to use the `--card-spacing` variable:

<Steps>

<Step>Update the Card root spacing classes.</Step>

Replace the hard-coded gap and vertical padding with `--card-spacing`, and set
the default and small size values on the root:

```diff
  className={cn(
-   "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
+   "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
    className
  )}
```

<Step>Update CardHeader spacing classes.</Step>

Replace the horizontal padding and border spacing with the shared variable:

```diff
  className={cn(
-   "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
+   "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
    className
  )}
```

<Step>Update CardContent and CardFooter spacing classes.</Step>

Use `--card-spacing` for the content inset and footer padding:

```diff
  function CardContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
      <div
        data-slot="card-content"
-       className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
+       className={cn("px-(--card-spacing)", className)}
        {...props}
      />
    )
  }
```

```diff
  className={cn(
-   "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
+   "flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)",
    className
  )}
```

</Steps>

After applying these changes, you can customize card spacing by setting
`--card-spacing` on the `Card` with an arbitrary property class:

```tsx
function Example() {
    return <Card className="[--card-spacing:--spacing(6)]">...</Card>;
}
```

---
title: Carousel
description: A carousel with motion and swipe built using Embla.
base: radix
component: true
links:
    doc: https://www.embla-carousel.com/get-started/react
    api: https://www.embla-carousel.com/api
---

<ComponentPreview
  styleName="radix-nova"
  name="carousel-demo"
  previewClassName="h-80 sm:h-[32rem]"
/>

## About

The carousel component is built using the
[Embla Carousel](https://www.embla-carousel.com/) library.

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
npx shadcn@latest add carousel
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install embla-carousel-react
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="carousel"
  title="components/ui/carousel.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
```

```tsx showLineNumbers
<Carousel>
    <CarouselContent>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
</Carousel>;
```

## Composition

Use the following composition to build a `Carousel`:

```text
Carousel
├── CarouselContent
│   ├── CarouselItem
│   └── CarouselItem
├── CarouselPrevious
└── CarouselNext
```

## Examples

### Sizes

To set the size of the items, you can use the `basis` utility class on the
`<CarouselItem />`.

<ComponentPreview styleName="radix-nova" name="carousel-size" />

```tsx showLineNumbers {4-6}
// 33% of the carousel width.
<Carousel>
    <CarouselContent>
        <CarouselItem className="basis-1/3">...</CarouselItem>
        <CarouselItem className="basis-1/3">...</CarouselItem>
        <CarouselItem className="basis-1/3">...</CarouselItem>
    </CarouselContent>
</Carousel>;
```

```tsx showLineNumbers {4-6}
// 50% on small screens and 33% on larger screens.
<Carousel>
    <CarouselContent>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">...</CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">...</CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">...</CarouselItem>
    </CarouselContent>
</Carousel>;
```

### Spacing

To set the spacing between the items, we use a `pl-[VALUE]` utility on the
`<CarouselItem />` and a negative `-ml-[VALUE]` on the `<CarouselContent />`.

<ComponentPreview styleName="radix-nova" name="carousel-spacing" />

```tsx showLineNumbers /-ml-4/ /pl-4/
<Carousel>
    <CarouselContent className="-ml-4">
        <CarouselItem className="pl-4">...</CarouselItem>
        <CarouselItem className="pl-4">...</CarouselItem>
        <CarouselItem className="pl-4">...</CarouselItem>
    </CarouselContent>
</Carousel>;
```

```tsx showLineNumbers /-ml-2/ /pl-2/ /md:-ml-4/ /md:pl-4/
<Carousel>
    <CarouselContent className="-ml-2 md:-ml-4">
        <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
        <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
        <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
    </CarouselContent>
</Carousel>;
```

### Orientation

Use the `orientation` prop to set the orientation of the carousel.

<ComponentPreview
  styleName="radix-nova"
  name="carousel-orientation"
  previewClassName="h-[32rem]"
/>

```tsx showLineNumbers /vertical | horizontal/
<Carousel orientation="vertical | horizontal">
    <CarouselContent>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
    </CarouselContent>
</Carousel>;
```

## Options

You can pass options to the carousel using the `opts` prop. See the
[Embla Carousel docs](https://www.embla-carousel.com/api/options/) for more
information.

```tsx showLineNumbers {2-5}
<Carousel
    opts={{
        align: "start",
        loop: true,
    }}
>
    <CarouselContent>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
    </CarouselContent>
</Carousel>;
```

## API

Use a state and the `setApi` props to get an instance of the carousel API.

<ComponentPreview
  styleName="radix-nova"
  name="carousel-api"
  previewClassName="sm:h-[32rem]"
/>

```tsx showLineNumbers {1,4,22}
import { type CarouselApi } from "@/components/ui/carousel";

export function Example() {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <Carousel setApi={setApi}>
            <CarouselContent>
                <CarouselItem>...</CarouselItem>
                <CarouselItem>...</CarouselItem>
                <CarouselItem>...</CarouselItem>
            </CarouselContent>
        </Carousel>
    );
}
```

## Events

You can listen to events using the api instance from `setApi`.

```tsx showLineNumbers {1,4-14,16}
import { type CarouselApi } from "@/components/ui/carousel";

export function Example() {
    const [api, setApi] = React.useState<CarouselApi>();

    React.useEffect(() => {
        if (!api) {
            return;
        }

        api.on("select", () => {
            // Do something on select.
        });
    }, [api]);

    return (
        <Carousel setApi={setApi}>
            <CarouselContent>
                <CarouselItem>...</CarouselItem>
                <CarouselItem>...</CarouselItem>
                <CarouselItem>...</CarouselItem>
            </CarouselContent>
        </Carousel>
    );
}
```

See the [Embla Carousel docs](https://www.embla-carousel.com/api/events/) for
more information on using events.

## Plugins

You can use the `plugins` prop to add plugins to the carousel.

```ts showLineNumbers {1,6-10}
import Autoplay from "embla-carousel-autoplay";

export function Example() {
    return (
        <Carousel
            plugins={[
                Autoplay({
                    delay: 2000,
                }),
            ]}
        >
            // ...
        </Carousel>
    );
}
```

<ComponentPreview
  styleName="radix-nova"
  name="carousel-plugin"
  previewClassName="sm:h-[32rem]"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="carousel-rtl"
  direction="rtl"
  previewClassName="h-80 sm:h-[32rem]"
/>

When localizing the carousel for RTL languages, you need to set the `direction`
option in the `opts` prop to match the text direction. This ensures the carousel
scrolls in the correct direction.

```tsx showLineNumbers {2-5}
<Carousel
    dir={dir}
    opts={{
        direction: dir,
    }}
>
    <CarouselContent>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
    </CarouselContent>
    <CarouselPrevious className="rtl:rotate-180" />
    <CarouselNext className="rtl:rotate-180" />
</Carousel>;
```

The `direction` option accepts `"ltr"` or `"rtl"` and should match the `dir`
prop value. You may also want to rotate the navigation buttons using the
`rtl:rotate-180` class to ensure they point in the correct direction.

## API Reference

See the [Embla Carousel docs](https://www.embla-carousel.com/api/) for more
information on props and plugins.

---
title: Chart
description: Beautiful charts. Built using Recharts. Copy and paste into your apps.
base: radix
component: true
---

<Callout className="mt-4">

**Updated:** The `chart` component now uses Recharts v3. If you're upgrading
existing chart code, see [Updating to Recharts v3](#updating-to-recharts-v3).

</Callout>

<ComponentPreview
  styleName="radix-nova"
  name="chart-demo"
  className="theme-blue [&_.preview]:h-auto [&_.preview]:p-0 [&_.preview]:lg:min-h-[404px] [&_.preview>div]:w-full [&_.preview>div]:border-none [&_.preview>div]:shadow-none"
  hideCode
/>

Introducing **Charts**. A collection of chart components that you can copy and
paste into your apps.

Charts are designed to look great out of the box. They work well with the other
components and are fully customizable to fit your project.

[Browse the Charts Library](/charts).

## Component

We use [Recharts](https://recharts.org/) under the hood.

We designed the `chart` component with composition in mind. **You build your
charts using Recharts components and only bring in custom components, such as
`ChartTooltip`, when and where you need it**.

```tsx showLineNumbers /ChartContainer/ /ChartTooltipContent/
import { Bar, BarChart } from "recharts";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export function MyChart() {
    return (
        <ChartContainer>
            <BarChart data={data}>
                <Bar dataKey="value" />
                <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
        </ChartContainer>
    );
}
```

We do not wrap Recharts. This means you're not locked into an abstraction. When
a new Recharts version is released, you can follow the official upgrade path to
upgrade your charts.

**The components are yours**.

## Updating to Recharts v3

If you're updating older chart code to Recharts v3:

- Use `var(--chart-1)` instead of `hsl(var(--chart-1))` when you reference chart
  tokens from your CSS variables.
- Use `ChartTooltip.defaultIndex` for initial tooltip state only. Keep
  persistent active shapes in your own chart state.
- Remove `layout` from `<Bar>` when the parent `<BarChart>` already defines it.
- Keep a height, `min-h-*`, or `aspect-*` on `ChartContainer` so
  `ResponsiveContainer` can measure on first render.

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add chart
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install recharts
```

<Step>Copy and paste the following code into `components/ui/chart.tsx`.</Step>

<ComponentSource
  name="chart"
  title="components/ui/chart.tsx"
  styleName="radix-nova"
/>

<Step>Add the following colors to your CSS file</Step>

```css title="app/globals.css" showLineNumbers
@layer base {
    :root {
        --chart-1: oklch(0.646 0.222 41.116);
        --chart-2: oklch(0.6 0.118 184.704);
        --chart-3: oklch(0.398 0.07 227.392);
        --chart-4: oklch(0.828 0.189 84.429);
        --chart-5: oklch(0.769 0.188 70.08);
    }

    .dark {
        --chart-1: oklch(0.488 0.243 264.376);
        --chart-2: oklch(0.696 0.17 162.48);
        --chart-3: oklch(0.769 0.188 70.08);
        --chart-4: oklch(0.627 0.265 303.9);
        --chart-5: oklch(0.645 0.246 16.439);
    }
}
```

</Steps>

</TabsContent>

</CodeTabs>

## Your First Chart

Let's build your first chart. We'll build a bar chart, add a grid, axis, tooltip
and legend.

<Steps>

<Step>Start by defining your data</Step>

The following data represents the number of desktop and mobile users for each
month.

<Callout className="mt-4">

**Note:** Your data can be in any shape. You are not limited to the shape of the
data below. Use the `dataKey` prop to map your data to the chart.

</Callout>

```tsx title="components/example-chart.tsx" showLineNumbers
const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
];
```

<Step>Define your chart config</Step>

The chart config holds configuration for the chart. This is where you place
human-readable strings, such as labels, icons and color tokens for theming.

```tsx title="components/example-chart.tsx" showLineNumbers
import { type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig;
```

<Step>Build your chart</Step>

You can now build your chart using Recharts components.

<Callout className="mt-4 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-950">

**Important:** Remember to set a `min-h-[VALUE]` on the `ChartContainer`
component. This is required for the chart to be responsive.

</Callout>

<ComponentPreview
  styleName="radix-nova"
  name="chart-example"
  previewClassName="h-80"
/>

</Steps>

### Add a Grid

Let's add a grid to the chart.

<Steps className="mb-0 pt-2">

<Step>Import the `CartesianGrid` component.</Step>

```tsx /CartesianGrid/
import { Bar, BarChart, CartesianGrid } from "recharts";
```

<Step>Add the `CartesianGrid` component to your chart.</Step>

```tsx showLineNumbers {3}
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
    <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
    </BarChart>
</ChartContainer>;
```

<ComponentPreview
  styleName="radix-nova"
  name="chart-example-grid"
  previewClassName="h-80"
/>

</Steps>

### Add an Axis

To add an x-axis to the chart, we'll use the `XAxis` component.

<Steps className="mb-0 pt-2">

<Step>Import the `XAxis` component.</Step>

```tsx /XAxis/
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
```

<Step>Add the `XAxis` component to your chart.</Step>

```tsx showLineNumbers {4-10}
<ChartContainer config={chartConfig} className="h-[200px] w-full">
    <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
        />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
    </BarChart>
</ChartContainer>;
```

<ComponentPreview
  styleName="radix-nova"
  name="chart-example-axis"
  previewClassName="h-80"
/>

</Steps>

### Add Tooltip

So far we've only used components from Recharts. They look great out of the box
thanks to some customization in the `chart` component.

To add a tooltip, we'll use the custom `ChartTooltip` and `ChartTooltipContent`
components from `chart`.

<Steps className="mb-0 pt-2">

<Step>Import the `ChartTooltip` and `ChartTooltipContent` components.</Step>

```tsx
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
```

<Step>Add the components to your chart.</Step>

```tsx showLineNumbers {11}
<ChartContainer config={chartConfig} className="h-[200px] w-full">
    <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
    </BarChart>
</ChartContainer>;
```

<ComponentPreview
  styleName="radix-nova"
  name="chart-example-tooltip"
  previewClassName="h-80"
/>

Hover to see the tooltips. Easy, right? Two components, and we've got a
beautiful tooltip.

</Steps>

### Add Legend

We'll do the same for the legend. We'll use the `ChartLegend` and
`ChartLegendContent` components from `chart`.

<Steps className="mb-0 pt-2">

<Step>Import the `ChartLegend` and `ChartLegendContent` components.</Step>

```tsx
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
```

<Step>Add the components to your chart.</Step>

```tsx showLineNumbers {12}
<ChartContainer config={chartConfig} className="h-[200px] w-full">
    <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
    </BarChart>
</ChartContainer>;
```

<ComponentPreview
  styleName="radix-nova"
  name="chart-example-legend"
  previewClassName="h-80"
/>

</Steps>

Done. You've built your first chart! What's next?

- [Themes and Colors](/docs/components/chart#theming)
- [Tooltip](/docs/components/chart#tooltip)
- [Legend](/docs/components/chart#legend)

## Chart Config

The chart config is where you define the labels, icons and colors for a chart.

It is intentionally decoupled from chart data.

This allows you to share config and color tokens between charts. It can also
work independently for cases where your data or color tokens live remotely or in
a different format.

```tsx showLineNumbers /ChartConfig/
import { Monitor } from "lucide-react";

import { type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
    desktop: {
        label: "Desktop",
        icon: Monitor,
        // A color like 'hsl(220, 98%, 61%)' or 'var(--color-name)'
        color: "#2563eb",
        // OR a theme object with 'light' and 'dark' keys
        theme: {
            light: "#2563eb",
            dark: "#dc2626",
        },
    },
} satisfies ChartConfig;
```

## Theming

Charts have built-in support for theming. You can use css variables
(recommended) or color values in any color format, such as hex, hsl or oklch.

### CSS Variables

<Steps className="mb-0 pt-2">

<Step>Define your colors in your css file</Step>

```css title="app/globals.css" showLineNumbers
@layer base {
    :root {
        --chart-1: oklch(0.646 0.222 41.116);
        --chart-2: oklch(0.6 0.118 184.704);
    }

    .dark {
        --chart-1: oklch(0.488 0.243 264.376);
        --chart-2: oklch(0.696 0.17 162.48);
    }
}
```

<Step>Add the color to your `chartConfig`</Step>

```tsx title="components/example-chart.tsx" showLineNumbers
const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;
```

</Steps>

### hex, hsl or oklch

You can also define your colors directly in the chart config. Use the color
format you prefer.

```tsx title="components/example-chart.tsx" showLineNumbers
const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(220, 98%, 61%)",
    },
    tablet: {
        label: "Tablet",
        color: "oklch(0.5 0.2 240)",
    },
    laptop: {
        label: "Laptop",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;
```

### Using Colors

To use the theme colors in your chart, reference the colors using the format
`var(--color-KEY)`.

#### Components

```tsx
<Bar dataKey="desktop" fill="var(--color-desktop)" />;
```

#### Chart Data

```tsx title="components/example-chart.tsx" showLineNumbers
const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
];
```

#### Tailwind

```tsx title="components/example-chart.tsx"
<LabelList className="fill-(--color-desktop)" />;
```

## Tooltip

A chart tooltip contains a label, name, indicator and value. You can use a
combination of these to customize your tooltip.

<ComponentPreview styleName="radix-nova" name="chart-tooltip" hideCode />

You can turn on/off any of these using the `hideLabel`, `hideIndicator` props
and customize the indicator style using the `indicator` prop.

Use `labelKey` and `nameKey` to use a custom key for the tooltip label and name.

Chart comes with the `<ChartTooltip>` and `<ChartTooltipContent>` components.
You can use these two components to add custom tooltips to your chart.

```tsx title="components/example-chart.tsx"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
```

```tsx title="components/example-chart.tsx"
<ChartTooltip content={<ChartTooltipContent />} />;
```

### Props

Use the following props to customize the tooltip.

| Prop            | Type                     | Description                                  |
| :-------------- | :----------------------- | :------------------------------------------- |
| `labelKey`      | string                   | The config or data key to use for the label. |
| `nameKey`       | string                   | The config or data key to use for the name.  |
| `indicator`     | `dot` `line` or `dashed` | The indicator style for the tooltip.         |
| `hideLabel`     | boolean                  | Whether to hide the label.                   |
| `hideIndicator` | boolean                  | Whether to hide the indicator.               |

### Colors

Colors are automatically referenced from the chart config.

### Custom

To use a custom key for tooltip label and names, use the `labelKey` and
`nameKey` props.

```tsx showLineNumbers /browser/
const chartData = [
    { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
];

const chartConfig = {
    visitors: {
        label: "Total Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "var(--chart-1)",
    },
    safari: {
        label: "Safari",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;
```

```tsx title="components/example-chart.tsx"
<ChartTooltip
    content={<ChartTooltipContent labelKey="visitors" nameKey="browser" />}
/>;
```

This will use `Total Visitors` for label and `Chrome` and `Safari` for the
tooltip names.

## Legend

You can use the custom `<ChartLegend>` and `<ChartLegendContent>` components to
add a legend to your chart.

```tsx title="components/example-chart.tsx"
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
```

```tsx title="components/example-chart.tsx"
<ChartLegend content={<ChartLegendContent />} />;
```

### Colors

Colors are automatically referenced from the chart config.

### Custom

To use a custom key for legend names, use the `nameKey` prop.

```tsx showLineNumbers /browser/
const chartData = [
    { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
];

const chartConfig = {
    chrome: {
        label: "Chrome",
        color: "var(--chart-1)",
    },
    safari: {
        label: "Safari",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;
```

```tsx title="components/example-chart.tsx"
<ChartLegend content={<ChartLegendContent nameKey="browser" />} />;
```

This will use `Chrome` and `Safari` for the legend names.

## Accessibility

You can turn on the `accessibilityLayer` prop to add an accessible layer to your
chart.

This prop adds keyboard access and screen reader support to your charts.

```tsx title="components/example-chart.tsx"
<LineChart accessibilityLayer />;
```

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="base-nova"
  name="chart-rtl"
  direction="rtl"
  previewClassName="h-92"
/>

---
title: Checkbox
description: A control that allows the user to toggle between checked and not checked.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/checkbox
    api: https://www.radix-ui.com/docs/primitives/components/checkbox#api-reference
---

<ComponentPreview
  styleName="radix-nova"
  name="checkbox-demo"
  previewClassName="h-80"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add checkbox
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="checkbox"
  title="components/ui/checkbox.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Checkbox } from "@/components/ui/checkbox";
```

```tsx
<Checkbox />;
```

## Checked State

Use `defaultChecked` for uncontrolled checkboxes, or `checked` and
`onCheckedChange` to control the state.

```tsx showLineNumbers
import * as React from "react";

export function Example() {
    const [checked, setChecked] = React.useState(false);

    return <Checkbox checked={checked} onCheckedChange={setChecked} />;
}
```

## Invalid State

Set `aria-invalid` on the checkbox and `data-invalid` on the field wrapper to
show the invalid styles.

<ComponentPreview styleName="radix-nova" name="checkbox-invalid" />

## Examples

### Basic

Pair the checkbox with `Field` and `FieldLabel` for proper layout and labeling.

<ComponentPreview styleName="radix-nova" name="checkbox-basic" />

### Description

Use `FieldContent` and `FieldDescription` for helper text.

<ComponentPreview styleName="radix-nova" name="checkbox-description" />

### Disabled

Use the `disabled` prop to prevent interaction and add the `data-disabled`
attribute to the `<Field>` component for disabled styles.

<ComponentPreview styleName="radix-nova" name="checkbox-disabled" />

### Group

Use multiple fields to create a checkbox list.

<ComponentPreview styleName="radix-nova" name="checkbox-group" />

### Table

<ComponentPreview
  styleName="radix-nova"
  name="checkbox-table"
  previewClassName="p-4 md:p-8"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="checkbox-rtl"
  direction="rtl"
  previewClassName="h-80"
/>

## API Reference

See the
[Radix UI](https://www.radix-ui.com/docs/primitives/components/checkbox#api-reference)
documentation for more information.

---
title: Collapsible
description: An interactive component which expands/collapses a panel.
base: radix
component: true
featured: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/collapsible
    api: https://www.radix-ui.com/docs/primitives/components/collapsible#api-reference
---

<ComponentPreview
  styleName="radix-nova"
  name="collapsible-demo"
  align="start"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add collapsible
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="collapsible"
  title="components/ui/collapsible.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
```

```tsx showLineNumbers
<Collapsible>
    <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
    <CollapsibleContent>
        Yes. Free to use for personal and commercial projects. No attribution
        required.
    </CollapsibleContent>
</Collapsible>;
```

## Composition

Use the following composition to build a `Collapsible`:

```text
Collapsible
├── CollapsibleTrigger
└── CollapsibleContent
```

## Controlled State

Use the `open` and `onOpenChange` props to control the state.

```tsx showLineNumbers
import * as React from "react";

export function Example() {
    const [open, setOpen] = React.useState(false);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger>Toggle</CollapsibleTrigger>
            <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
    );
}
```

## Examples

### Basic

<ComponentPreview
  styleName="radix-nova"
  name="collapsible-basic"
  align="start"
/>

### Settings Panel

Use a trigger button to reveal additional settings.

<ComponentPreview styleName="radix-nova" name="collapsible-settings" />

### File Tree

Use nested collapsibles to build a file tree.

<ComponentPreview
  styleName="radix-nova"
  name="collapsible-file-tree"
  previewClassName="h-[36rem]"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="collapsible-rtl"
  direction="rtl"
  align="start"
/>

## API Reference

See the
[Radix UI](https://www.radix-ui.com/docs/primitives/components/collapsible#api-reference)
documentation for more information.

---
title: Combobox
description: Autocomplete input with a list of suggestions.
base: radix
component: true
links:
    doc: https://base-ui.com/react/components/combobox
    api: https://base-ui.com/react/components/combobox#api-reference
---

<ComponentPreview
  styleName="base-nova"
  name="combobox-demo"
  description="A combobox with a list of frameworks."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add combobox
```

</TabsContent>
<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install @base-ui/react
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="combobox"
  title="components/ui/combobox.tsx"
  styleName="base-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
```

```tsx showLineNumbers
const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

export function ExampleCombobox() {
    return (
        <Combobox items={frameworks}>
            <ComboboxInput placeholder="Select a framework" />
            <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                    {(item) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
```

## Composition

### Simple

A single-line input and a flat list (see [Basic](#basic)).

```text
Combobox
├── ComboboxInput
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        ├── ComboboxItem
        └── ComboboxItem
```

### With chips

Multi-select with `multiple`, chips, and a chips input (see
[Multiple](#multiple)).

```text
Combobox
├── ComboboxChips
│   ├── ComboboxValue
│   │   └── ComboboxChip
│   └── ComboboxChipsInput
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        ├── ComboboxItem
        └── ComboboxItem
```

### With groups and collection

Nested items per group using `ComboboxCollection` inside each `ComboboxGroup`,
with a separator between groups (see [Groups](#groups)).

```text
Combobox
├── ComboboxInput
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        ├── ComboboxGroup
        │   ├── ComboboxLabel
        │   └── ComboboxCollection
        │       ├── ComboboxItem
        │       └── ComboboxItem
        ├── ComboboxSeparator
        └── ComboboxGroup
            ├── ComboboxLabel
            └── ComboboxCollection
                ├── ComboboxItem
                └── ComboboxItem
```

## Custom Items

Use `itemToStringValue` when your items are objects.

```tsx showLineNumbers
import * as React from "react";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";

type Framework = {
    label: string;
    value: string;
};

const frameworks: Framework[] = [
    { label: "Next.js", value: "next" },
    { label: "SvelteKit", value: "sveltekit" },
    { label: "Nuxt", value: "nuxt" },
];

export function ExampleComboboxCustomItems() {
    return (
        <Combobox
            items={frameworks}
            itemToStringValue={(framework) => framework.label}
        >
            <ComboboxInput placeholder="Select a framework" />
            <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                    {(framework) => (
                        <ComboboxItem key={framework.value} value={framework}>
                            {framework.label}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
```

## Multiple Selection

Use `multiple` with chips for multi-select behavior.

```tsx showLineNumbers
import * as React from "react";

import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
} from "@/components/ui/combobox";

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

export function ExampleComboboxMultiple() {
    const [value, setValue] = React.useState<string[]>([]);

    return (
        <Combobox
            items={frameworks}
            multiple
            value={value}
            onValueChange={setValue}
        >
            <ComboboxChips>
                <ComboboxValue>
                    {value.map((item) => (
                        <ComboboxChip key={item}>{item}</ComboboxChip>
                    ))}
                </ComboboxValue>
                <ComboboxChipsInput placeholder="Add framework" />
            </ComboboxChips>
            <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                    {(item) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
```

## Examples

### Basic

A simple combobox with a list of frameworks.

<ComponentPreview styleName="base-nova" name="combobox-basic" />

### Multiple

A combobox with multiple selection using `multiple` and `ComboboxChips`.

<ComponentPreview styleName="base-nova" name="combobox-multiple" />

### Clear Button

Use the `showClear` prop to show a clear button.

<ComponentPreview styleName="base-nova" name="combobox-clear" />

### Groups

Use `ComboboxGroup` and `ComboboxSeparator` to group items.

<ComponentPreview styleName="base-nova" name="combobox-groups" />

### Custom Items

You can render a custom component inside `ComboboxItem`.

<ComponentPreview styleName="base-nova" name="combobox-custom" />

### Invalid

Use the `aria-invalid` prop to make the combobox invalid.

<ComponentPreview styleName="base-nova" name="combobox-invalid" />

### Disabled

Use the `disabled` prop to disable the combobox.

<ComponentPreview styleName="base-nova" name="combobox-disabled" />

### Auto Highlight

Use the `autoHighlight` prop to automatically highlight the first item on
filter.

<ComponentPreview styleName="base-nova" name="combobox-auto-highlight" />

### Popup

You can trigger the combobox from a button or any other component by using the
`render` prop. Move the `ComboboxInput` inside the `ComboboxContent`.

<ComponentPreview styleName="base-nova" name="combobox-popup" />

### Input Group

You can add an addon to the combobox by using the `InputGroupAddon` component
inside the `ComboboxInput`.

<ComponentPreview styleName="radix-nova" name="combobox-input-group" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="combobox-rtl"
  direction="rtl"
  align="start"
/>

## API Reference

See the [Base UI](https://base-ui.com/react/components/combobox#api-reference)
documentation for more information.

---
title: Command
description: Command menu for search and quick actions.
base: radix
component: true
links:
    doc: https://github.com/dip/cmdk
---

<ComponentPreview
  styleName="radix-nova"
  name="command-demo"
  align="start"
  previewClassName="h-[24.5rem]"
/>

## About

The `<Command />` component uses the [`cmdk`](https://github.com/dip/cmdk)
component by [Dip](https://www.dip.org/).

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add command
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install cmdk
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="command"
  title="components/ui/command.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
```

```tsx showLineNumbers
<Command className="max-w-sm rounded-lg border">
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
            <CommandItem>Profile</CommandItem>
            <CommandItem>Billing</CommandItem>
            <CommandItem>Settings</CommandItem>
        </CommandGroup>
    </CommandList>
</Command>;
```

## Composition

Use the following composition to build a `Command`:

```text
Command
├── CommandInput
└── CommandList
    ├── CommandEmpty
    ├── CommandGroup
    │   ├── CommandItem
    │   └── CommandItem
    ├── CommandSeparator
    └── CommandGroup
        ├── CommandItem
        └── CommandItem
```

## Examples

### Basic

A simple command menu in a dialog.

<ComponentPreview styleName="radix-nova" name="command-basic" />

### Shortcuts

<ComponentPreview styleName="radix-nova" name="command-shortcuts" />

### Groups

A command menu with groups, icons and separators.

<ComponentPreview styleName="radix-nova" name="command-groups" />

### Scrollable

Scrollable command menu with multiple items.

<ComponentPreview styleName="radix-nova" name="command-scrollable" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="command-rtl"
  direction="rtl"
  align="start"
  previewClassName="h-[24.5rem]"
/>

## API Reference

See the [cmdk](https://github.com/dip/cmdk) documentation for more information.

---
title: Context Menu
description: Displays a menu of actions triggered by a right click.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/context-menu
    api: https://www.radix-ui.com/docs/primitives/components/context-menu#api-reference
---

<ComponentPreview
  styleName="radix-nova"
  name="context-menu-demo"
  description="A context menu with sub menu items."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add context-menu
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="context-menu"
  title="components/ui/context-menu.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
```

```tsx showLineNumbers
<ContextMenu>
    <ContextMenuTrigger>Right click here</ContextMenuTrigger>
    <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem>Subscription</ContextMenuItem>
    </ContextMenuContent>
</ContextMenu>;
```

## Composition

Use the following composition to build a `ContextMenu`:

```text
ContextMenu
├── ContextMenuTrigger
└── ContextMenuContent
    ├── ContextMenuGroup
    │   ├── ContextMenuLabel
    │   ├── ContextMenuItem
    │   └── ContextMenuItem
    ├── ContextMenuSeparator
    ├── ContextMenuGroup
    │   ├── ContextMenuLabel
    │   ├── ContextMenuCheckboxItem
    │   └── ContextMenuCheckboxItem
    ├── ContextMenuSeparator
    ├── ContextMenuGroup
    │   ├── ContextMenuLabel
    │   └── ContextMenuRadioGroup
    │       ├── ContextMenuRadioItem
    │       └── ContextMenuRadioItem
    └── ContextMenuSub
        ├── ContextMenuSubTrigger
        └── ContextMenuSubContent
            └── ContextMenuGroup
                ├── ContextMenuItem
                └── ContextMenuItem
```

## Examples

### Basic

A simple context menu with a few actions.

<ComponentPreview styleName="radix-nova" name="context-menu-basic" />

### Submenu

Use `ContextMenuSub` to nest secondary actions.

<ComponentPreview styleName="radix-nova" name="context-menu-submenu" />

### Shortcuts

Add `ContextMenuShortcut` to show keyboard hints.

<ComponentPreview styleName="radix-nova" name="context-menu-shortcuts" />

### Groups

Group related actions and separate them with dividers.

<ComponentPreview styleName="radix-nova" name="context-menu-groups" />

### Icons

Combine icons with labels for quick scanning.

<ComponentPreview styleName="radix-nova" name="context-menu-icons" />

### Checkboxes

Use `ContextMenuCheckboxItem` for toggles.

<ComponentPreview styleName="radix-nova" name="context-menu-checkboxes" />

### Radio

Use `ContextMenuRadioItem` for exclusive choices.

<ComponentPreview styleName="radix-nova" name="context-menu-radio" />

### Destructive

Use `variant="destructive"` to style the menu item as destructive.

<ComponentPreview styleName="radix-nova" name="context-menu-destructive" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="context-menu-rtl"
  direction="rtl"
/>

## API Reference

See the
[Radix UI](https://www.radix-ui.com/docs/primitives/components/context-menu#api-reference)
documentation for more information.

---
title: Data Table
description: Powerful table and datagrids built using TanStack Table.
base: base
component: true
links:
    doc: https://tanstack.com/table/v8/docs/introduction
---

<ComponentPreview
  styleName="radix-nova"
  name="data-table-demo"
  align="start"
  previewClassName="items-start h-auto px-4 md:px-8"
  hideCode
/>

## Introduction

Every data table or datagrid I've created has been unique. They all behave
differently, have specific sorting and filtering requirements, and work with
different data sources.

It doesn't make sense to combine all of these variations into a single
component. If we do that, we'll lose the flexibility that
[headless UI](https://tanstack.com/table/v8/docs/introduction#what-is-headless-ui)
provides.

So instead of a data-table component, I thought it would be more helpful to
provide a guide on how to build your own.

We'll start with the basic `<Table />` component and build a complex data table
from scratch.

<Callout className="mt-4">

**Tip:** If you find yourself using the same table in multiple places in your
app, you can always extract it into a reusable component.

</Callout>

## Table of Contents

This guide will show you how to use [TanStack Table](https://tanstack.com/table)
and the `<Table />` component to build your own custom data table. We'll cover
the following topics:

- [Basic Table](#basic-table)
- [Row Actions](#row-actions)
- [Pagination](#pagination)
- [Sorting](#sorting)
- [Filtering](#filtering)
- [Visibility](#visibility)
- [Row Selection](#row-selection)
- [Reusable Components](#reusable-components)

## Installation

1. Add the `<Table />` component to your project:

```bash
npx shadcn@latest add table
```

2. Add `tanstack/react-table` dependency:

```bash
npm install @tanstack/react-table
```

## Prerequisites

We are going to build a table to show recent payments. Here's what our data
looks like:

```tsx showLineNumbers
type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

export const payments: Payment[] = [
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
    },
    {
        id: "489e1d42",
        amount: 125,
        status: "processing",
        email: "example@gmail.com",
    },
    // ...
];
```

## Project Structure

Start by creating the following file structure:

```txt
app
└── payments
    ├── columns.tsx
    ├── data-table.tsx
    └── page.tsx
```

I'm using a Next.js example here but this works for any other React framework.

- `columns.tsx` (client component) will contain our column definitions.
- `data-table.tsx` (client component) will contain our `<DataTable />`
  component.
- `page.tsx` (server component) is where we'll fetch data and render our table.

## Basic Table

Let's start by building a basic table.

<Steps className="mb-0 pt-2">

### Column Definitions

First, we'll define our columns.

```tsx showLineNumbers title="app/payments/columns.tsx" {3,14-27}
"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
];
```

<Callout className="mt-4">

**Note:** Columns are where you define the core of what your table will look
like. They define the data that will be displayed, how it will be formatted,
sorted and filtered.

</Callout>

### `<DataTable />` component

Next, we'll create a `<DataTable />` component to render our table.

```tsx showLineNumbers title="app/payments/data-table.tsx"
"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="overflow-hidden rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length
                        ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() &&
                                        "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )
                        : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>
        </div>
    );
}
```

<Callout>

**Tip**: If you find yourself using `<DataTable />` in multiple places, this is
the component you could make reusable by extracting it to
`components/ui/data-table.tsx`.

`<DataTable columns={columns} data={data} />`

</Callout>

### Render the table

Finally, we'll render our table in our page component.

```tsx showLineNumbers title="app/payments/page.tsx" {22}
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        // ...
    ];
}

export default async function DemoPage() {
    const data = await getData();

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
```

</Steps>

## Cell Formatting

Let's format the amount cell to display the dollar amount. We'll also align the
cell to the right.

<Steps className="mb-0 pt-2">

### Update columns definition

Update the `header` and `cell` definitions for amount as follows:

```tsx showLineNumbers title="app/payments/columns.tsx" {4-15}
export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);

            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
];
```

You can use the same approach to format other cells and headers.

</Steps>

## Row Actions

Let's add row actions to our table. We'll use a `<DropdownMenu />` component for
this.

<Steps className="mb-0 pt-2">

### Update columns definition

Update our columns definition to add a new `actions` column. The `actions` cell
returns a `<DropdownMenu />` component.

```tsx showLineNumbers title="app/payments/columns.tsx" {4,6-14,18-45}
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Payment>[] = [
    // ...
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(payment.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>
                            View payment details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
    // ...
];
```

You can access the row data using `row.original` in the `cell` function. Use
this to handle actions for your row eg. use the `id` to make a DELETE call to
your API.

</Steps>

## Pagination

Next, we'll add pagination to our table.

<Steps className="mb-0 pt-2">

### Update `<DataTable>`

```tsx showLineNumbers title="app/payments/data-table.tsx" {5,17}
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // ...
}
```

This will automatically paginate your rows into pages of 10. See the
[pagination docs](https://tanstack.com/table/v8/docs/api/features/pagination)
for more information on customizing page size and implementing manual
pagination.

### Add pagination controls

We can add pagination controls to our table using the `<Button />` component and
the `table.previousPage()`, `table.nextPage()` API methods.

```tsx showLineNumbers title="app/payments/data-table.tsx" {1,15,21-39}
import { Button } from "@/components/ui/button"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          { // .... }
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
```

See [Reusable Components](#reusable-components) section for a more advanced
pagination component.

</Steps>

## Sorting

Let's make the email column sortable.

<Steps className="mb-0 pt-2">

### Update `<DataTable>`

```tsx showLineNumbers title="app/payments/data-table.tsx" {3,6,10,18,25-28}
"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>{ ... }</Table>
      </div>
    </div>
  )
}
```

### Make header cell sortable

We can now update the `email` header cell to add sorting controls.

```tsx showLineNumbers title="app/payments/columns.tsx" {4,9-19}
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
];
```

This will automatically sort the table (asc and desc) when the user toggles on
the header cell.

</Steps>

## Filtering

Let's add a search input to filter emails in our table.

<Steps className="mb-0 pt-2">

### Update `<DataTable>`

```tsx showLineNumbers title="app/payments/data-table.tsx" {6,10,17,24-26,35-36,39,45-54}
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>{ ... }</Table>
      </div>
    </div>
  )
}
```

Filtering is now enabled for the `email` column. You can add filters to other
columns as well. See the
[filtering docs](https://tanstack.com/table/v8/docs/guide/filters) for more
information on customizing filters.

</Steps>

## Visibility

Adding column visibility is fairly simple using `@tanstack/react-table`
visibility API.

<Steps className="mb-0 pt-2">

### Update `<DataTable>`

```tsx showLineNumbers title="app/payments/data-table.tsx" {8,18-23,33-34,45,49,64-91}
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>{ ... }</Table>
      </div>
    </div>
  )
}
```

This adds a dropdown menu that you can use to toggle column visibility.

</Steps>

## Row Selection

Next, we're going to add row selection to our table.

<Steps className="mb-0 pt-2">

### Update column definitions

```tsx showLineNumbers title="app/payments/columns.tsx" {6,9-27}
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
];
```

### Update `<DataTable>`

```tsx showLineNumbers title="app/payments/data-table.tsx" {11,23,28}
export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<
        ColumnFiltersState
    >(
        [],
    );
    const [columnVisibility, setColumnVisibility] = React.useState<
        VisibilityState
    >({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div>
            <div className="overflow-hidden rounded-md border">
                <Table />
            </div>
        </div>
    );
}
```

This adds a checkbox to each row and a checkbox in the header to select all
rows.

### Show selected rows

You can show the number of selected rows using the
`table.getFilteredSelectedRowModel()` API.

```tsx
<div className="flex-1 text-sm text-muted-foreground">
    {table.getFilteredSelectedRowModel().rows.length} of{" "}
    {table.getFilteredRowModel().rows.length} row(s) selected.
</div>;
```

</Steps>

## Reusable Components

Here are some components you can use to build your data tables. This is from the
[Tasks](/examples/tasks) demo.

### Column header

Make any column header sortable and hideable.

<ComponentSource
  src="/app/(app)/examples/tasks/components/data-table-column-header.tsx"
  title="components/data-table-column-header.tsx"
/>

```tsx showLineNumbers {5}
export const columns = [
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
];
```

### Pagination

Add pagination controls to your table including page size and selection count.

<ComponentSource
  src="/app/(app)/examples/tasks/components/data-table-pagination.tsx"
  styleName="radix-nova"
/>

```tsx
<DataTablePagination table={table} />;
```

### Column toggle

A component to toggle column visibility.

<ComponentSource
  src="/app/(app)/examples/tasks/components/data-table-view-options.tsx"
  styleName="radix-nova"
/>

```tsx
<DataTableViewOptions table={table} />;
```

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="data-table-rtl"
  direction="rtl"
  previewClassName="items-start h-auto px-4 md:px-8"
  hideCode
/>

---
title: Date Picker
description: A date picker component with range and presets.
base: radix
component: true
---

<ComponentPreview styleName="radix-nova" name="date-picker-demo" />

## Installation

The Date Picker is built using a composition of the `<Popover />` and the
`<Calendar />` components.

See installation instructions for the
[Popover](/docs/components/radix/popover#installation) and the
[Calendar](/docs/components/radix/calendar#installation) components.

## Usage

```tsx showLineNumbers title="components/example-date-picker.tsx"
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerDemo() {
    const [date, setDate] = React.useState<Date>();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!date}
                    className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
        </Popover>
    );
}
```

See the [React DayPicker](https://react-day-picker.js.org) documentation for
more information.

## Composition

A date picker is built from `Popover` and `Calendar` (there is no `DatePicker`
root component):

```text
Popover
├── PopoverTrigger
└── PopoverContent
    └── Calendar
```

## Examples

### Basic

A basic date picker component.

<ComponentPreview styleName="radix-nova" name="date-picker-basic" />

### Range Picker

A date picker component for selecting a range of dates.

<ComponentPreview styleName="radix-nova" name="date-picker-range" />

### Date of Birth

A date picker component for selecting a date of birth. This component includes a
dropdown caption layout for date and month selection.

<ComponentPreview styleName="radix-nova" name="date-picker-dob" />

### Input

A date picker component with an input field for selecting a date.

<ComponentPreview styleName="radix-nova" name="date-picker-input" />

### Time Picker

A date picker component with a time input field for selecting a time.

<ComponentPreview styleName="radix-nova" name="date-picker-time" />

### Natural Language Picker

This component uses the `chrono-node` library to parse natural language dates.

<ComponentPreview styleName="radix-nova" name="date-picker-natural-language" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="date-picker-rtl"
  direction="rtl"
/>

---
title: Dialog
description: A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.
featured: true
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/dialog
    api: https://www.radix-ui.com/docs/primitives/components/dialog#api-reference
---

<ComponentPreview
  styleName="radix-nova"
  name="dialog-demo"
  description="A dialog for editing profile details."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add dialog
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="dialog"
  title="components/ui/dialog.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
```

```tsx showLineNumbers
<Dialog>
    <DialogTrigger>Open</DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
            </DialogDescription>
        </DialogHeader>
    </DialogContent>
</Dialog>;
```

## Composition

Use the following composition to build a `Dialog`:

```text
Dialog
├── DialogTrigger
└── DialogContent
    ├── DialogHeader
    │   ├── DialogTitle
    │   └── DialogDescription
    └── DialogFooter
```

## Examples

### Custom Close Button

Replace the default close control with your own button.

<ComponentPreview styleName="radix-nova" name="dialog-close-button" />

### No Close Button

Use `showCloseButton={false}` to hide the close button.

<ComponentPreview styleName="radix-nova" name="dialog-no-close-button" />

### Sticky Footer

Keep actions visible while the content scrolls.

<ComponentPreview styleName="radix-nova" name="dialog-sticky-footer" />

### Scrollable Content

Long content can scroll while the header stays in view.

<ComponentPreview styleName="radix-nova" name="dialog-scrollable-content" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="dialog-rtl" direction="rtl" />

## API Reference

See the
[Radix UI](https://www.radix-ui.com/docs/primitives/components/dialog#api-reference)
documentation for more information.

---
title: Drawer
description: A drawer component for React.
base: radix
component: true
links:
    doc: https://vaul.emilkowal.ski/getting-started
---

<ComponentPreview styleName="radix-nova" name="drawer-demo" />

## About

Drawer is built on top of [Vaul](https://github.com/emilkowalski/vaul) by
[emilkowalski](https://twitter.com/emilkowalski).

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add drawer
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install vaul
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="drawer"
  title="components/ui/drawer.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
```

```tsx showLineNumbers
<Drawer>
    <DrawerTrigger>Open</DrawerTrigger>
    <DrawerContent>
        <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
                <Button variant="outline">Cancel</Button>
            </DrawerClose>
        </DrawerFooter>
    </DrawerContent>
</Drawer>;
```

## Composition

Use the following composition to build a `Drawer`:

```text
Drawer
├── DrawerTrigger
└── DrawerContent
    ├── DrawerHeader
    │   ├── DrawerTitle
    │   └── DrawerDescription
    └── DrawerFooter
```

## Examples

### Scrollable Content

Keep actions visible while the content scrolls.

<ComponentPreview styleName="radix-nova" name="drawer-scrollable-content" />

### Sides

Use the `direction` prop to set the side of the drawer. Available options are
`top`, `right`, `bottom`, and `left`.

<ComponentPreview styleName="radix-nova" name="drawer-sides" />

### Responsive Dialog

You can combine the `Dialog` and `Drawer` components to create a responsive
dialog. This renders a `Dialog` component on desktop and a `Drawer` on mobile.

<ComponentPreview styleName="radix-nova" name="drawer-dialog" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="drawer-rtl" direction="rtl" />

## API Reference

See the [Vaul documentation](https://vaul.emilkowal.ski/getting-started) for the
full API reference.

---
title: Dropdown Menu
description: Displays a menu to the user — such as a set of actions or functions — triggered by a button.
featured: true
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/dropdown-menu
    api: https://www.radix-ui.com/docs/primitives/components/dropdown-menu#api-reference
---

<ComponentPreview
  styleName="radix-nova"
  name="dropdown-menu-demo"
  description="A dropdown menu with icons, shortcuts and sub menu items."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add dropdown-menu
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="dropdown-menu"
  title="components/ui/dropdown-menu.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
```

```tsx showLineNumbers
<DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
        <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuGroup>
    </DropdownMenuContent>
</DropdownMenu>;
```

## Composition

Use the following composition to build a `DropdownMenu`:

```text
DropdownMenu
├── DropdownMenuTrigger
└── DropdownMenuContent
    ├── DropdownMenuGroup
    │   ├── DropdownMenuLabel
    │   ├── DropdownMenuItem
    │   └── DropdownMenuItem
    ├── DropdownMenuSeparator
    ├── DropdownMenuGroup
    │   ├── DropdownMenuLabel
    │   ├── DropdownMenuCheckboxItem
    │   └── DropdownMenuCheckboxItem
    ├── DropdownMenuSeparator
    ├── DropdownMenuGroup
    │   ├── DropdownMenuLabel
    │   └── DropdownMenuRadioGroup
    │       ├── DropdownMenuRadioItem
    │       └── DropdownMenuRadioItem
    └── DropdownMenuSub
        ├── DropdownMenuSubTrigger
        └── DropdownMenuSubContent
            └── DropdownMenuGroup
                ├── DropdownMenuLabel
                ├── DropdownMenuItem
                └── DropdownMenuItem
```

## Examples

### Basic

A basic dropdown menu with labels and separators.

<ComponentPreview styleName="radix-nova" name="dropdown-menu-basic" />

### Submenu

Use `DropdownMenuSub` to nest secondary actions.

<ComponentPreview styleName="radix-nova" name="dropdown-menu-submenu" />

### Shortcuts

Add `DropdownMenuShortcut` to show keyboard hints.

<ComponentPreview styleName="radix-nova" name="dropdown-menu-shortcuts" />

### Icons

Combine icons with labels for quick scanning.

<ComponentPreview styleName="radix-nova" name="dropdown-menu-icons" />

### Checkboxes

Use `DropdownMenuCheckboxItem` for toggles.

<ComponentPreview styleName="radix-nova" name="dropdown-menu-checkboxes" />

### Checkboxes Icons

Add icons to checkbox items.

<ComponentPreview
  styleName="radix-nova"
  name="dropdown-menu-checkboxes-icons"
/>

### Radio Group

Use `DropdownMenuRadioGroup` for exclusive choices.

<ComponentPreview styleName="radix-nova" name="dropdown-menu-radio-group" />

### Radio Icons

Show radio options with icons.

<ComponentPreview styleName="radix-nova" name="dropdown-menu-radio-icons" />

### Destructive

Use `variant="destructive"` for irreversible actions.

<ComponentPreview styleName="radix-nova" name="dropdown-menu-destructive" />

### Avatar

An account switcher dropdown triggered by an avatar.

<ComponentPreview styleName="radix-nova" name="dropdown-menu-avatar" />

### Complex

A richer example combining groups, icons, and submenus.

<ComponentPreview styleName="radix-nova" name="dropdown-menu-complex" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="dropdown-menu-rtl"
  direction="rtl"
/>

## API Reference

See the
[Radix UI documentation](https://www.radix-ui.com/docs/primitives/components/dropdown-menu)
for the full API reference.

---
title: Empty
description: Use the Empty component to display an empty state.
base: radix
component: true
---

<ComponentPreview
  styleName="radix-nova"
  name="empty-demo"
  previewClassName="h-96 p-0"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add empty
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="empty"
  title="components/ui/empty.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
```

```tsx
<Empty>
    <EmptyHeader>
        <EmptyMedia variant="icon">
            <Icon />
        </EmptyMedia>
        <EmptyTitle>No data</EmptyTitle>
        <EmptyDescription>No data found</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
        <Button>Add data</Button>
    </EmptyContent>
</Empty>;
```

## Composition

Use the following composition to build an `Empty` state:

```text
Empty
├── EmptyHeader
│   ├── EmptyMedia
│   ├── EmptyTitle
│   └── EmptyDescription
└── EmptyContent
```

## Examples

### Outline

Use the `border` utility class to create an outline empty state.

<ComponentPreview
  styleName="radix-nova"
  name="empty-outline"
  previewClassName="h-96 p-6 md:p-10"
/>

### Background

Use the `bg-*` and `bg-gradient-*` utilities to add a background to the empty
state.

<ComponentPreview
  styleName="radix-nova"
  name="empty-background"
  previewClassName="h-96 p-0"
/>

### Avatar

Use the `EmptyMedia` component to display an avatar in the empty state.

<ComponentPreview
  styleName="radix-nova"
  name="empty-avatar"
  previewClassName="h-96 p-0"
/>

### Avatar Group

Use the `EmptyMedia` component to display an avatar group in the empty state.

<ComponentPreview
  styleName="radix-nova"
  name="empty-avatar-group"
  previewClassName="h-96 p-0"
/>

### InputGroup

You can add an `InputGroup` component to the `EmptyContent` component.

<ComponentPreview
  styleName="radix-nova"
  name="empty-input-group"
  previewClassName="h-96 p-0"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="empty-rtl" direction="rtl" />

## API Reference

### Empty

The main component of the empty state. Wraps the `EmptyHeader` and
`EmptyContent` components.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<Empty>
    <EmptyHeader />
    <EmptyContent />
</Empty>;
```

### EmptyHeader

The `EmptyHeader` component wraps the empty media, title, and description.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<EmptyHeader>
    <EmptyMedia />
    <EmptyTitle />
    <EmptyDescription />
</EmptyHeader>;
```

### EmptyMedia

Use the `EmptyMedia` component to display the media of the empty state such as
an icon or an image. You can also use it to display other components such as an
avatar.

| Prop        | Type                  | Default   |
| ----------- | --------------------- | --------- |
| `variant`   | `"default" \| "icon"` | `default` |
| `className` | `string`              |           |

```tsx
<EmptyMedia variant="icon">
    <Icon />
</EmptyMedia>;
```

```tsx
<EmptyMedia>
    <Avatar>
        <AvatarImage src="..." />
        <AvatarFallback>CN</AvatarFallback>
    </Avatar>
</EmptyMedia>;
```

### EmptyTitle

Use the `EmptyTitle` component to display the title of the empty state.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<EmptyTitle>No data</EmptyTitle>;
```

### EmptyDescription

Use the `EmptyDescription` component to display the description of the empty
state.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<EmptyDescription>You do not have any notifications.</EmptyDescription>;
```

### EmptyContent

Use the `EmptyContent` component to display the content of the empty state such
as a button, input or a link.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<EmptyContent>
    <Button>Add Project</Button>
</EmptyContent>;
```

---
title: Field
description: Combine labels, controls, and help text to compose accessible form fields and grouped inputs.
base: radix
component: true
---

<ComponentPreview
  styleName="radix-nova"
  name="field-demo"
  previewClassName="h-[800px] p-6 md:h-[850px]"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add field
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="field"
  title="components/ui/field.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field";
```

```tsx showLineNumbers
<FieldSet>
    <FieldLegend>Profile</FieldLegend>
    <FieldDescription>This appears on invoices and emails.</FieldDescription>
    <FieldGroup>
        <Field>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input id="name" autoComplete="off" placeholder="Evil Rabbit" />
            <FieldDescription>
                This appears on invoices and emails.
            </FieldDescription>
        </Field>
        <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input id="username" autoComplete="off" aria-invalid />
            <FieldError>Choose another username.</FieldError>
        </Field>
        <Field orientation="horizontal">
            <Switch id="newsletter" />
            <FieldLabel htmlFor="newsletter">
                Subscribe to the newsletter
            </FieldLabel>
        </Field>
    </FieldGroup>
</FieldSet>;
```

## Composition

### Field

A single control with label, helper text, and validation.

```text
Field
├── FieldLabel
├── Input / Textarea / Switch / Select
├── FieldDescription
└── FieldError
```

### FieldGroup

Related fields in one group. Use `FieldSeparator` between sections when needed.

```text
FieldGroup
├── Field
│   ├── FieldLabel
│   ├── Input / Textarea / Switch / Select
│   ├── FieldDescription
│   └── FieldError
├── FieldSeparator
└── Field
    ├── FieldLabel
    └── Input / Textarea / Switch / Select
```

### FieldSet

Semantic grouping with a legend and description, usually containing a
`FieldGroup`.

```text
FieldSet
├── FieldLegend
├── FieldDescription
└── FieldGroup
    ├── Field
    │   ├── FieldLabel
    │   ├── Input / Textarea / Switch / Select
    │   ├── FieldDescription
    │   └── FieldError
    └── Field
        ├── FieldLabel
        └── Input / Textarea / Switch / Select
```

## Anatomy

The `Field` family is designed for composing accessible forms. A typical field
is structured as follows:

```tsx showLineNumbers
<Field>
    <FieldLabel htmlFor="input-id">Label</FieldLabel>
    {/* Input, Select, Switch, etc. */}
    <FieldDescription>Optional helper text.</FieldDescription>
    <FieldError>Validation message.</FieldError>
</Field>;
```

- `Field` is the core wrapper for a single field.
- `FieldContent` is a flex column that groups label and description. Not
  required if you have no description.
- Wrap related fields with `FieldGroup`, and use `FieldSet` with `FieldLegend`
  for semantic grouping.

## Form

See the [Form](/docs/forms) documentation for building forms with the `Field`
component and [React Hook Form](/docs/forms/react-hook-form),
[Tanstack Form](/docs/forms/tanstack-form), or [Formisch](/docs/forms/formisch).

## Examples

### Input

<ComponentPreview styleName="radix-nova" name="field-input" />

### Textarea

<ComponentPreview styleName="radix-nova" name="field-textarea" />

### Select

<ComponentPreview styleName="radix-nova" name="field-select" />

### Slider

<ComponentPreview styleName="radix-nova" name="field-slider" />

### Fieldset

<ComponentPreview styleName="radix-nova" name="field-fieldset" />

### Checkbox

<ComponentPreview
  styleName="radix-nova"
  name="field-checkbox"
  previewClassName="h-[32rem]"
/>

### Radio

<ComponentPreview styleName="radix-nova" name="field-radio" />

### Switch

<ComponentPreview styleName="radix-nova" name="field-switch" />

### Choice Card

Wrap `Field` components inside `FieldLabel` to create selectable field groups.
This works with `RadioItem`, `Checkbox` and `Switch` components.

<ComponentPreview styleName="radix-nova" name="field-choice-card" />

### Field Group

Stack `Field` components with `FieldGroup`. Add `FieldSeparator` to divide them.

<ComponentPreview
  styleName="radix-nova"
  name="field-group"
  previewClassName="h-96"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="field-rtl"
  direction="rtl"
  previewClassName="h-auto p-6"
/>

## Responsive Layout

- **Vertical fields:** Default orientation stacks label, control, and helper
  text—ideal for mobile-first layouts.
- **Horizontal fields:** Set `orientation="horizontal"` on `Field` to align the
  label and control side-by-side. Pair with `FieldContent` to keep descriptions
  aligned.
- **Responsive fields:** Set `orientation="responsive"` for automatic column
  layouts inside container-aware parents. Apply `@container/field-group` classes
  on `FieldGroup` to switch orientations at specific breakpoints.

<ComponentPreview
  styleName="radix-nova"
  name="field-responsive"
  previewClassName="h-[650px] p-6 md:h-[500px] md:p-10"
/>

## Validation and Errors

- Add `data-invalid` to `Field` to switch the entire block into an error state.
- Add `aria-invalid` on the input itself for assistive technologies.
- Render `FieldError` immediately after the control or inside `FieldContent` to
  keep error messages aligned with the field.

```tsx showLineNumbers /data-invalid/ /aria-invalid/
<Field data-invalid>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" type="email" aria-invalid />
    <FieldError>Enter a valid email address.</FieldError>
</Field>;
```

## Accessibility

- `FieldSet` and `FieldLegend` keep related controls grouped for keyboard and
  assistive tech users.
- `Field` outputs `role="group"` so nested controls inherit labeling from
  `FieldLabel` and `FieldLegend` when combined.
- Apply `FieldSeparator` sparingly to ensure screen readers encounter clear
  section boundaries.

## API Reference

### FieldSet

Container that renders a semantic `fieldset` with spacing presets.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<FieldSet>
    <FieldLegend>Delivery</FieldLegend>
    <FieldGroup>{/* Fields */}</FieldGroup>
</FieldSet>;
```

### FieldLegend

Legend element for a `FieldSet`. Switch to the `label` variant to align with
label sizing.

| Prop        | Type                  | Default    |
| ----------- | --------------------- | ---------- |
| `variant`   | `"legend" \| "label"` | `"legend"` |
| `className` | `string`              |            |

```tsx
<FieldLegend variant="label">Notification Preferences</FieldLegend>;
```

The `FieldLegend` has two variants: `legend` and `label`. The `label` variant
applies label sizing and alignment. Handy if you have nested `FieldSet`.

### FieldGroup

Layout wrapper that stacks `Field` components and enables container queries for
responsive orientations.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<FieldGroup className="@container/field-group flex flex-col gap-6">
    <Field>{/* ... */}</Field>
    <Field>{/* ... */}</Field>
</FieldGroup>;
```

### Field

The core wrapper for a single field. Provides orientation control, invalid state
styling, and spacing.

| Prop           | Type                                         | Default      |
| -------------- | -------------------------------------------- | ------------ |
| `orientation`  | `"vertical" \| "horizontal" \| "responsive"` | `"vertical"` |
| `className`    | `string`                                     |              |
| `data-invalid` | `boolean`                                    |              |

```tsx
<Field orientation="horizontal">
    <FieldLabel htmlFor="remember">Remember me</FieldLabel>
    <Switch id="remember" />
</Field>;
```

### FieldContent

Flex column that groups control and descriptions when the label sits beside the
control. Not required if you have no description.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<Field>
    <Checkbox id="notifications" />
    <FieldContent>
        <FieldLabel htmlFor="notifications">Notifications</FieldLabel>
        <FieldDescription>Email, SMS, and push options.</FieldDescription>
    </FieldContent>
</Field>;
```

### FieldLabel

Label styled for both direct inputs and nested `Field` children.

| Prop        | Type      | Default |
| ----------- | --------- | ------- |
| `className` | `string`  |         |
| `asChild`   | `boolean` | `false` |

```tsx
<FieldLabel htmlFor="email">Email</FieldLabel>;
```

### FieldTitle

Renders a title with label styling inside `FieldContent`.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<FieldContent>
    <FieldTitle>Enable Touch ID</FieldTitle>
    <FieldDescription>Unlock your device faster.</FieldDescription>
</FieldContent>;
```

### FieldDescription

Helper text slot that automatically balances long lines in horizontal layouts.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<FieldDescription>We never share your email with anyone.</FieldDescription>;
```

### FieldSeparator

Visual divider to separate sections inside a `FieldGroup`. Accepts optional
inline content.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<FieldSeparator>Or continue with</FieldSeparator>;
```

### FieldError

Accessible error container that accepts children or an `errors` array (e.g.,
from `react-hook-form`).

| Prop        | Type                                       | Default |
| ----------- | ------------------------------------------ | ------- |
| `errors`    | `Array<{ message?: string } \| undefined>` |         |
| `className` | `string`                                   |         |

```tsx
<FieldError errors={errors.username} />;
```

When the `errors` array contains multiple messages, the component renders a list
automatically.

`FieldError` also accepts issues produced by any validator that implements
[Standard Schema](https://standardschema.dev/), including Zod, Valibot, and
ArkType. Pass the `issues` array from the schema result directly to render a
unified error list across libraries.

---
title: Hover Card
description: For sighted users to preview content available behind a link.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/hover-card
    api: https://www.radix-ui.com/docs/primitives/components/hover-card#api-reference
---

<ComponentPreview
  styleName="radix-nova"
  name="hover-card-demo"
  previewClassName="h-80"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add hover-card
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="hover-card"
  title="components/ui/hover-card.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
```

```tsx showLineNumbers
<HoverCard>
    <HoverCardTrigger>Hover</HoverCardTrigger>
    <HoverCardContent>
        The React Framework – created and maintained by @vercel.
    </HoverCardContent>
</HoverCard>;
```

## Composition

Use the following composition to build a `HoverCard`:

```text
HoverCard
├── HoverCardTrigger
└── HoverCardContent
```

## Trigger Delays

Use `openDelay` and `closeDelay` on the `HoverCard` to control when the card
opens and closes.

```tsx showLineNumbers
<HoverCard openDelay={100} closeDelay={200}>
    <HoverCardTrigger>Hover</HoverCardTrigger>
    <HoverCardContent>Content</HoverCardContent>
</HoverCard>;
```

## Positioning

Use the `side` and `align` props on `HoverCardContent` to control placement.

```tsx showLineNumbers
<HoverCard>
    <HoverCardTrigger>Hover</HoverCardTrigger>
    <HoverCardContent side="top" align="start">
        Content
    </HoverCardContent>
</HoverCard>;
```

## Examples

### Basic

<ComponentPreview
  styleName="radix-nova"
  name="hover-card-demo"
  previewClassName="h-80"
/>

### Sides

<ComponentPreview
  styleName="radix-nova"
  name="hover-card-sides"
  previewClassName="h-[22rem]"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="hover-card-rtl"
  direction="rtl"
  previewClassName="h-80"
/>

## API Reference

See the
[Radix UI](https://www.radix-ui.com/docs/primitives/components/hover-card#api-reference)
documentation for more information.

---
title: Input
description: A text input component for forms and user data entry with built-in styling and accessibility features.
base: radix
component: true
---

<ComponentPreview
  styleName="radix-nova"
  name="input-demo"
  previewClassName="*:max-w-xs"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add input
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="input"
  title="components/ui/input.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Input } from "@/components/ui/input";
```

```tsx
<Input />;
```

## Examples

### Basic

<ComponentPreview
  styleName="radix-nova"
  name="input-basic"
  previewClassName="*:max-w-xs"
/>

### Field

Use `Field`, `FieldLabel`, and `FieldDescription` to create an input with a
label and description.

<ComponentPreview
  styleName="radix-nova"
  name="input-field"
  previewClassName="*:max-w-xs"
/>

### Field Group

Use `FieldGroup` to show multiple `Field` blocks and to build forms.

<ComponentPreview
  styleName="radix-nova"
  name="input-fieldgroup"
  previewClassName="*:max-w-xs"
/>

### Disabled

Use the `disabled` prop to disable the input. To style the disabled state, add
the `data-disabled` attribute to the `Field` component.

<ComponentPreview
  styleName="radix-nova"
  name="input-disabled"
  previewClassName="*:max-w-xs"
/>

### Invalid

Use the `aria-invalid` prop to mark the input as invalid. To style the invalid
state, add the `data-invalid` attribute to the `Field` component.

<ComponentPreview
  styleName="radix-nova"
  name="input-invalid"
  previewClassName="*:max-w-xs"
/>

### File

Use the `type="file"` prop to create a file input.

<ComponentPreview
  styleName="radix-nova"
  name="input-file"
  previewClassName="*:max-w-xs"
/>

### Inline

Use `Field` with `orientation="horizontal"` to create an inline input. Pair with
`Button` to create a search input with a button.

<ComponentPreview
  styleName="radix-nova"
  name="input-inline"
  previewClassName="*:max-w-xs"
/>

### Grid

Use a grid layout to place multiple inputs side by side.

<ComponentPreview
  styleName="radix-nova"
  name="input-grid"
  previewClassName="p-6"
/>

### Required

Use the `required` attribute to indicate required inputs.

<ComponentPreview
  styleName="radix-nova"
  name="input-required"
  previewClassName="*:max-w-xs"
/>

### Badge

Use `Badge` in the label to highlight a recommended field.

<ComponentPreview
  styleName="radix-nova"
  name="input-badge"
  previewClassName="*:max-w-xs"
/>

### Input Group

To add icons, text, or buttons inside an input, use the `InputGroup` component.
See the [Input Group](/docs/components/input-group) component for more examples.

<ComponentPreview
  styleName="radix-nova"
  name="input-input-group"
  previewClassName="*:max-w-xs"
/>

### Button Group

To add buttons to an input, use the `ButtonGroup` component. See the
[Button Group](/docs/components/button-group) component for more examples.

<ComponentPreview
  styleName="radix-nova"
  name="input-button-group"
  previewClassName="*:max-w-xs"
/>

### Form

A full form example with multiple inputs, a select, and a button.

<ComponentPreview
  styleName="radix-nova"
  name="input-form"
  previewClassName="h-[32rem]"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="input-rtl"
  direction="rtl"
  previewClassName="*:max-w-xs"
/>

---
title: Input Group
description: Add addons, buttons, and helper content to inputs.
base: radix
component: true
---

import { IconInfoCircle } from "@tabler/icons-react"

<ComponentPreview
  styleName="radix-nova"
  name="input-group-demo"
  previewClassName="h-[26rem]"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add input-group
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="input-group"
  title="components/ui/input-group.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group";
```

```tsx showLineNumbers
<InputGroup>
    <InputGroupInput placeholder="Search..." />
    <InputGroupAddon>
        <SearchIcon />
    </InputGroupAddon>
</InputGroup>;
```

## Composition

Use the following composition to build an `InputGroup`:

```text
InputGroup
├── InputGroupInput or InputGroupTextarea
├── InputGroupAddon
├── InputGroupButton
└── InputGroupText
```

## Align

Use the `align` prop on `InputGroupAddon` to position the addon relative to the
input.

<Callout>
  For proper focus management, `InputGroupAddon` should always be placed after
  `InputGroupInput` or `InputGroupTextarea` in the DOM. Use the `align` prop to
  visually position the addon.
</Callout>

### inline-start

Use `align="inline-start"` to position the addon at the start of the input. This
is the default.

<ComponentPreview
  styleName="radix-nova"
  name="input-group-inline-start"
  previewClassName="h-48"
/>

### inline-end

Use `align="inline-end"` to position the addon at the end of the input.

<ComponentPreview
  styleName="radix-nova"
  name="input-group-inline-end"
  previewClassName="h-48"
/>

### block-start

Use `align="block-start"` to position the addon above the input.

<ComponentPreview
  styleName="radix-nova"
  name="input-group-block-start"
  previewClassName="h-96"
/>

### block-end

Use `align="block-end"` to position the addon below the input.

<ComponentPreview
  styleName="radix-nova"
  name="input-group-block-end"
  previewClassName="h-[26rem]"
/>

## Examples

### Icon

<ComponentPreview
  styleName="radix-nova"
  name="input-group-icon"
  previewClassName="h-80"
/>

### Text

<ComponentPreview
  styleName="radix-nova"
  name="input-group-text"
  previewClassName="h-80"
/>

### Button

<ComponentPreview
  styleName="radix-nova"
  name="input-group-button"
  previewClassName="h-72"
/>

### Kbd

<ComponentPreview
  styleName="radix-nova"
  name="input-group-kbd"
  previewClassName="h-40"
/>

### Dropdown

<ComponentPreview
  styleName="radix-nova"
  name="input-group-dropdown"
  previewClassName="h-56"
/>

### Spinner

<ComponentPreview
  styleName="radix-nova"
  name="input-group-spinner"
  previewClassName="h-80"
/>

### Textarea

<ComponentPreview
  styleName="radix-nova"
  name="input-group-textarea"
  previewClassName="h-96"
/>

### Custom Input

Add the `data-slot="input-group-control"` attribute to your custom input for
automatic focus state handling.

Here's an example of a custom resizable textarea from a third-party library.

<ComponentPreview
  styleName="radix-nova"
  name="input-group-custom"
  previewClassName="h-56"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="input-group-rtl"
  direction="rtl"
  previewClassName="h-[30rem]"
/>

## API Reference

### InputGroup

The main component that wraps inputs and addons.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

```tsx
<InputGroup>
    <InputGroupInput />
    <InputGroupAddon />
</InputGroup>;
```

### InputGroupAddon

Displays icons, text, buttons, or other content alongside inputs.

<Callout icon={<IconInfoCircle />} title="Focus Navigation"> For proper focus
navigation, the `InputGroupAddon` component should be placed after the input.
Set the `align` prop to position the addon.
</Callout>

| Prop        | Type                                                             | Default          |
| ----------- | ---------------------------------------------------------------- | ---------------- |
| `align`     | `"inline-start" \| "inline-end" \| "block-start" \| "block-end"` | `"inline-start"` |
| `className` | `string`                                                         |                  |

```tsx
<InputGroupAddon align="inline-end">
    <SearchIcon />
</InputGroupAddon>;
```

**For `<InputGroupInput />`, use the `inline-start` or `inline-end` alignment.
For `<InputGroupTextarea />`, use the `block-start` or `block-end` alignment.**

The `InputGroupAddon` component can have multiple `InputGroupButton` components
and icons.

```tsx
<InputGroupAddon>
    <InputGroupButton>Button</InputGroupButton>
    <InputGroupButton>Button</InputGroupButton>
</InputGroupAddon>;
```

### InputGroupButton

Displays buttons within input groups.

| Prop        | Type                                                                          | Default   |
| ----------- | ----------------------------------------------------------------------------- | --------- |
| `size`      | `"xs" \| "icon-xs" \| "sm" \| "icon-sm"`                                      | `"xs"`    |
| `variant`   | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"ghost"` |
| `className` | `string`                                                                      |           |

```tsx
<InputGroupButton>Button</InputGroupButton>
<InputGroupButton size="icon-xs" aria-label="Copy">
  <CopyIcon />
</InputGroupButton>
```

### InputGroupInput

Replacement for `<Input />` when building input groups. This component has the
input group styles pre-applied and uses the unified
`data-slot="input-group-control"` for focus state handling.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

All other props are passed through to the underlying `<Input />` component.

```tsx
<InputGroup>
    <InputGroupInput placeholder="Enter text..." />
    <InputGroupAddon>
        <SearchIcon />
    </InputGroupAddon>
</InputGroup>;
```

### InputGroupTextarea

Replacement for `<Textarea />` when building input groups. This component has
the textarea group styles pre-applied and uses the unified
`data-slot="input-group-control"` for focus state handling.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` |         |

All other props are passed through to the underlying `<Textarea />` component.

```tsx
<InputGroup>
    <InputGroupTextarea placeholder="Enter message..." />
    <InputGroupAddon align="block-end">
        <InputGroupButton>Send</InputGroupButton>
    </InputGroupAddon>
</InputGroup>;
```

## Changelog

### 2025-10-06 `InputGroup`

Add the `min-w-0` class to the `InputGroup` component. See
[diff](https://github.com/shadcn-ui/ui/pull/8341/files#diff-0e2ee95d0050ca4c5d82339df86c54e14a6739dc4638fdda0eec8f73aebc2da9).

---
title: Input OTP
description: Accessible one-time password component with copy-paste functionality.
base: radix
component: true
links:
    doc: https://input-otp.rodz.dev
---

<ComponentPreview styleName="radix-nova" name="input-otp-demo" />

## About

Input OTP is built on top of
[input-otp](https://github.com/guilhermerodz/input-otp) by
[@guilherme_rodz](https://twitter.com/guilherme_rodz).

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add input-otp
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install input-otp
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="input-otp"
  title="components/ui/input-otp.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
```

```tsx showLineNumbers
<InputOTP maxLength={6}>
    <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
    </InputOTPGroup>
</InputOTP>;
```

## Composition

Use the following composition to build an `InputOTP`:

```text
InputOTP
├── InputOTPGroup
│   ├── InputOTPSlot
│   ├── InputOTPSlot
│   └── InputOTPSlot
├── InputOTPSeparator
├── InputOTPGroup
│   ├── InputOTPSlot
│   ├── InputOTPSlot
│   └── InputOTPSlot
├── InputOTPSeparator
└── InputOTPGroup
    ├── InputOTPSlot
    └── InputOTPSlot
```

## Pattern

Use the `pattern` prop to define a custom pattern for the OTP input.

```tsx showLineNumbers {1,5}
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
    ...
</InputOTP>;
```

<ComponentPreview styleName="radix-nova" name="input-otp-pattern" />

## Examples

### Separator

Use the `<InputOTPSeparator />` component to add a separator between input
groups.

<ComponentPreview styleName="radix-nova" name="input-otp-separator" />

### Disabled

Use the `disabled` prop to disable the input.

<ComponentPreview styleName="radix-nova" name="input-otp-disabled" />

### Controlled

Use the `value` and `onChange` props to control the input value.

<ComponentPreview styleName="radix-nova" name="input-otp-controlled" />

### Invalid

Use `aria-invalid` on the slots to show an error state.

<ComponentPreview styleName="radix-nova" name="input-otp-invalid" />

### Four Digits

A common pattern for PIN codes. This uses the `pattern={REGEXP_ONLY_DIGITS}`
prop.

<ComponentPreview styleName="radix-nova" name="input-otp-four-digits" />

### Alphanumeric

Use `REGEXP_ONLY_DIGITS_AND_CHARS` to accept both letters and numbers.

<ComponentPreview styleName="radix-nova" name="input-otp-alphanumeric" />

### Form

<ComponentPreview
  styleName="radix-nova"
  name="input-otp-form"
  previewClassName="h-[30rem]"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="input-otp-rtl" direction="rtl" />

## API Reference

See the [input-otp](https://input-otp.rodz.dev) documentation for more
information.

---
title: Item
description: A versatile component for displaying content with media, title, description, and actions.
base: radix
component: true
---

<ComponentPreview styleName="radix-nova" name="item-demo" />

The `Item` component is a straightforward flex container that can house nearly
any type of content. Use it to display a title, description, and actions. Group
it with the `ItemGroup` component to create a list of items.

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add item
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="item"
  title="components/ui/item.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
```

```tsx showLineNumbers
<Item>
    <ItemMedia variant="icon">
        <Icon />
    </ItemMedia>
    <ItemContent>
        <ItemTitle>Title</ItemTitle>
        <ItemDescription>Description</ItemDescription>
    </ItemContent>
    <ItemActions>
        <Button>Action</Button>
    </ItemActions>
</Item>;
```

## Composition

Use the following composition to build an `Item`:

```text
ItemGroup
└── Item
    ├── ItemHeader
    ├── ItemMedia
    ├── ItemContent
    │   ├── ItemTitle
    │   └── ItemDescription
    ├── ItemActions
    └── ItemFooter
```

## Item vs Field

Use `Field` if you need to display a form input such as a checkbox, input,
radio, or select.

If you only need to display content such as a title, description, and actions,
use `Item`.

## Variant

Use the `variant` prop to change the visual style of the item.

<ComponentPreview
  styleName="radix-nova"
  name="item-variant"
  previewClassName="h-96"
/>

## Size

Use the `size` prop to change the size of the item. Available sizes are
`default`, `sm`, and `xs`.

<ComponentPreview
  styleName="radix-nova"
  name="item-size"
  previewClassName="h-96"
/>

## Examples

### Icon

Use `ItemMedia` with `variant="icon"` to display an icon.

<ComponentPreview styleName="radix-nova" name="item-icon" />

### Avatar

You can use `ItemMedia` with `variant="avatar"` to display an avatar.

<ComponentPreview styleName="radix-nova" name="item-avatar" />

### Image

Use `ItemMedia` with `variant="image"` to display an image.

<ComponentPreview styleName="radix-nova" name="item-image" />

### Group

Use `ItemGroup` to group related items together.

<ComponentPreview
  styleName="radix-nova"
  name="item-group"
  previewClassName="h-96"
/>

### Header

Use `ItemHeader` to add a header above the item content.

<ComponentPreview
  styleName="radix-nova"
  name="item-header"
  previewClassName="h-96"
/>

### Link

Use the `asChild` prop to render the item as a link. The hover and focus states
will be applied to the anchor element.

<ComponentPreview styleName="radix-nova" name="item-link" />

```tsx showLineNumbers
<Item asChild>
    <a href="/dashboard">
        <ItemMedia variant="icon">
            <HomeIcon />
        </ItemMedia>
        <ItemContent>
            <ItemTitle>Dashboard</ItemTitle>
            <ItemDescription>
                Overview of your account and activity.
            </ItemDescription>
        </ItemContent>
    </a>
</Item>;
```

### Dropdown

<ComponentPreview styleName="radix-nova" name="item-dropdown" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="item-rtl" direction="rtl" />

## API Reference

### Item

The main component for displaying content with media, title, description, and
actions.

| Prop      | Type                                | Default     |
| --------- | ----------------------------------- | ----------- |
| `variant` | `"default" \| "outline" \| "muted"` | `"default"` |
| `size`    | `"default" \| "sm" \| "xs"`         | `"default"` |
| `asChild` | `boolean`                           | `false`     |

### ItemGroup

A container that groups related items together with consistent styling.

```tsx
<ItemGroup>
    <Item />
    <Item />
</ItemGroup>;
```

### ItemSeparator

A separator between items in a group.

```tsx
<ItemGroup>
    <Item />
    <ItemSeparator />
    <Item />
</ItemGroup>;
```

### ItemMedia

Use `ItemMedia` to display media content such as icons, images, or avatars.

| Prop      | Type                             | Default     |
| --------- | -------------------------------- | ----------- |
| `variant` | `"default" \| "icon" \| "image"` | `"default"` |

```tsx
<ItemMedia variant="icon">
    <Icon />
</ItemMedia>;
```

```tsx
<ItemMedia variant="image">
    <img src="..." alt="..." />
</ItemMedia>;
```

### ItemContent

Wraps the title and description of the item.

```tsx
<ItemContent>
    <ItemTitle>Title</ItemTitle>
    <ItemDescription>Description</ItemDescription>
</ItemContent>;
```

### ItemTitle

Displays the title of the item.

```tsx
<ItemTitle>Item Title</ItemTitle>;
```

### ItemDescription

Displays the description of the item.

```tsx
<ItemDescription>Item description</ItemDescription>;
```

### ItemActions

Container for action buttons or other interactive elements.

```tsx
<ItemActions>
    <Button>Action</Button>
</ItemActions>;
```

### ItemHeader

Displays a header above the item content.

```tsx
<Item>
    <ItemHeader>Header</ItemHeader>
    <ItemContent>...</ItemContent>
</Item>;
```

### ItemFooter

Displays a footer below the item content.

```tsx
<Item>
    <ItemContent>...</ItemContent>
    <ItemFooter>Footer</ItemFooter>
</Item>;
```

---
title: Kbd
description: Used to display textual user input from keyboard.
base: radix
component: true
---

<ComponentPreview styleName="radix-nova" name="kbd-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add kbd
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="kbd"
  title="components/ui/kbd.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Kbd } from "@/components/ui/kbd";
```

```tsx
<Kbd>Ctrl</Kbd>;
```

## Composition

Use the following composition to build `Kbd` and `KbdGroup`:

```text
Kbd
KbdGroup
├── Kbd
└── Kbd
```

## Examples

### Group

Use the `KbdGroup` component to group keyboard keys together.

<ComponentPreview styleName="radix-nova" name="kbd-group" />

### Button

Use the `Kbd` component inside a `Button` component to display a keyboard key
inside a button.

<ComponentPreview styleName="radix-nova" name="kbd-button" />

### Tooltip

You can use the `Kbd` component inside a `Tooltip` component to display a
tooltip with a keyboard key.

<ComponentPreview styleName="radix-nova" name="kbd-tooltip" />

### Input Group

You can use the `Kbd` component inside a `InputGroupAddon` component to display
a keyboard key inside an input group.

<ComponentPreview styleName="radix-nova" name="kbd-input-group" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="kbd-rtl" direction="rtl" />

## API Reference

### Kbd

Use the `Kbd` component to display a keyboard key.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | ``      |

```tsx
<Kbd>Ctrl</Kbd>;
```

### KbdGroup

Use the `KbdGroup` component to group `Kbd` components together.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | ``      |

```tsx
<KbdGroup>
    <Kbd>Ctrl</Kbd>
    <Kbd>B</Kbd>
</KbdGroup>;
```

---
title: Label
description: Renders an accessible label associated with controls.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/label
    api: https://www.radix-ui.com/docs/primitives/components/label#api-reference
---

<ComponentPreview styleName="radix-nova" name="label-demo" />

<Callout>
  For form fields, use the [Field](/docs/components/radix/field) component which
  includes built-in label, description, and error handling.
</Callout>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add label
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="label"
  title="components/ui/label.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Label } from "@/components/ui/label";
```

```tsx
<Label htmlFor="email">Your email address</Label>;
```

## Label in Field

For form fields, use the [Field](/docs/components/radix/field) component which
includes built-in `FieldLabel`, `FieldDescription`, and `FieldError` components.

```tsx
<Field>
    <FieldLabel htmlFor="email">Your email address</FieldLabel>
    <Input id="email" />
</Field>;
```

<ComponentPreview
  styleName="radix-nova"
  name="field-demo"
  previewClassName="h-[44rem]"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="label-rtl" direction="rtl" />

## API Reference

See the
[Radix UI Label](https://www.radix-ui.com/docs/primitives/components/label#api-reference)
documentation for more information.

---
title: Menubar
description: A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/menubar
    api: https://www.radix-ui.com/docs/primitives/components/menubar#api-reference
---

<ComponentPreview styleName="radix-nova" name="menubar-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add menubar
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="menubar"
  title="components/ui/menubar.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Menubar,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar";
```

```tsx showLineNumbers
<Menubar>
    <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
            <MenubarGroup>
                <MenubarItem>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>New Window</MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
                <MenubarItem>Share</MenubarItem>
                <MenubarItem>Print</MenubarItem>
            </MenubarGroup>
        </MenubarContent>
    </MenubarMenu>
</Menubar>;
```

## Composition

Use the following composition to build a `Menubar`:

```text
Menubar
├── MenubarMenu
│   ├── MenubarTrigger
│   └── MenubarContent
│       ├── MenubarGroup
│       │   ├── MenubarLabel
│       │   ├── MenubarItem
│       │   └── MenubarItem
│       ├── MenubarSeparator
│       ├── MenubarGroup
│       │   ├── MenubarLabel
│       │   ├── MenubarCheckboxItem
│       │   └── MenubarCheckboxItem
│       ├── MenubarSeparator
│       ├── MenubarGroup
│       │   ├── MenubarLabel
│       │   └── MenubarRadioGroup
│       │       ├── MenubarRadioItem
│       │       └── MenubarRadioItem
│       └── MenubarSub
│           ├── MenubarSubTrigger
│           └── MenubarSubContent
│               └── MenubarGroup
│                   ├── MenubarLabel
│                   ├── MenubarItem
│                   └── MenubarItem
└── MenubarMenu
    ├── MenubarTrigger
    └── MenubarContent
        └── MenubarGroup
            ├── MenubarLabel
            ├── MenubarItem
            └── MenubarItem
```

## Examples

### Checkbox

Use `MenubarCheckboxItem` for toggleable options.

<ComponentPreview styleName="radix-nova" name="menubar-checkbox" />

### Radio

Use `MenubarRadioGroup` and `MenubarRadioItem` for single-select options.

<ComponentPreview styleName="radix-nova" name="menubar-radio" />

### Submenu

Use `MenubarSub`, `MenubarSubTrigger`, and `MenubarSubContent` for nested menus.

<ComponentPreview styleName="radix-nova" name="menubar-submenu" />

### With Icons

<ComponentPreview styleName="radix-nova" name="menubar-icons" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="menubar-rtl" direction="rtl" />

## API Reference

See the
[Radix UI Menubar](https://www.radix-ui.com/docs/primitives/components/menubar#api-reference)
documentation.

---
title: Native Select
description: A styled native HTML select element with consistent design system integration.
base: radix
component: true
---

import { InfoIcon } from "lucide-react"

<Callout variant="info" icon={<InfoIcon className="translate-y-[3px]!" />}> For
a styled select component, see the [Select](/docs/components/select) component.
</Callout>

<ComponentPreview styleName="radix-nova" name="native-select-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add native-select
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="native-select"
  title="components/ui/native-select.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    NativeSelect,
    NativeSelectOptGroup,
    NativeSelectOption,
} from "@/components/ui/native-select";
```

```tsx showLineNumbers
<NativeSelect>
    <NativeSelectOption value="">Select a fruit</NativeSelectOption>
    <NativeSelectOption value="apple">Apple</NativeSelectOption>
    <NativeSelectOption value="banana">Banana</NativeSelectOption>
    <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
    <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
</NativeSelect>;
```

## Composition

### Simple

Options placed directly under `NativeSelect` (no `NativeSelectOptGroup`).

```text
NativeSelect
├── NativeSelectOption
├── NativeSelectOption
├── NativeSelectOption
└── NativeSelectOption
```

### With groups

Use `NativeSelectOptGroup` to organize options into categories.

```text
NativeSelect
├── NativeSelectOptGroup
│   ├── NativeSelectOption
│   └── NativeSelectOption
└── NativeSelectOptGroup
    ├── NativeSelectOption
    └── NativeSelectOption
```

## Examples

### Groups

Use `NativeSelectOptGroup` to organize options into categories.

<ComponentPreview styleName="radix-nova" name="native-select-groups" />

### Disabled

Add the `disabled` prop to the `NativeSelect` component to disable the select.

<ComponentPreview styleName="radix-nova" name="native-select-disabled" />

### Invalid

Use `aria-invalid` to show validation errors and the `data-invalid` attribute to
the `Field` component for styling.

<ComponentPreview styleName="radix-nova" name="native-select-invalid" />

## Native Select vs Select

- Use `NativeSelect` for native browser behavior, better performance, or
  mobile-optimized dropdowns.
- Use `Select` for custom styling, animations, or complex interactions.

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="native-select-rtl"
  direction="rtl"
/>

## API Reference

### NativeSelect

The main select component that wraps the native HTML select element.

```tsx
<NativeSelect>
    <NativeSelectOption value="option1">Option 1</NativeSelectOption>
    <NativeSelectOption value="option2">Option 2</NativeSelectOption>
</NativeSelect>;
```

### NativeSelectOption

Represents an individual option within the select.

| Prop       | Type      | Default |
| ---------- | --------- | ------- |
| `value`    | `string`  |         |
| `disabled` | `boolean` | `false` |

### NativeSelectOptGroup

Groups related options together for better organization.

| Prop       | Type      | Default |
| ---------- | --------- | ------- |
| `label`    | `string`  |         |
| `disabled` | `boolean` | `false` |

```tsx
<NativeSelectOptGroup label="Fruits">
    <NativeSelectOption value="apple">Apple</NativeSelectOption>
    <NativeSelectOption value="banana">Banana</NativeSelectOption>
</NativeSelectOptGroup>;
```

---
title: Navigation Menu
description: A collection of links for navigating websites.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/navigation-menu
    api: https://www.radix-ui.com/docs/primitives/components/navigation-menu#api-reference
---

<ComponentPreview
  styleName="radix-nova"
  name="navigation-menu-demo"
  previewClassName="h-96"
  className="overflow-visible"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add navigation-menu
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="navigation-menu"
  title="components/ui/navigation-menu.tsx"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
```

```tsx showLineNumbers
<NavigationMenu>
    <NavigationMenuList>
        <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
        </NavigationMenuItem>
    </NavigationMenuList>
</NavigationMenu>;
```

## Composition

Use the following composition to build a `NavigationMenu`:

```text
NavigationMenu
├── NavigationMenuList
│   ├── NavigationMenuItem
│   │   ├── NavigationMenuTrigger
│   │   └── NavigationMenuContent
│   │       ├── NavigationMenuLink
│   │       └── NavigationMenuLink
│   └── NavigationMenuItem
│       └── NavigationMenuLink
└── NavigationMenuIndicator
```

## Link Component

Use the `asChild` prop to compose a custom link component such as Next.js
`Link`.

```tsx showLineNumbers
import Link from "next/link";

import {
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function NavigationMenuDemo() {
    return (
        <NavigationMenuItem>
            <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
            >
                <Link href="/docs">Documentation</Link>
            </NavigationMenuLink>
        </NavigationMenuItem>
    );
}
```

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="navigation-menu-rtl"
  direction="rtl"
  previewClassName="h-96"
  className="overflow-visible"
/>

## API Reference

See the
[Radix UI Navigation Menu](https://www.radix-ui.com/docs/primitives/components/navigation-menu#api-reference)
documentation for more information.

---
title: Pagination
description: Pagination with page navigation, next and previous links.
base: radix
component: true
---

<ComponentPreview styleName="radix-nova" name="pagination-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add pagination
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="pagination"
  title="components/ui/pagination.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
```

```tsx showLineNumbers
<Pagination>
    <PaginationContent>
        <PaginationItem>
            <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
            <PaginationLink href="#" isActive>
                2
            </PaginationLink>
        </PaginationItem>
        <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
            <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
            <PaginationNext href="#" />
        </PaginationItem>
    </PaginationContent>
</Pagination>;
```

## Composition

Use the following composition to build a `Pagination`:

```text
Pagination
└── PaginationContent
    ├── PaginationItem
    │   └── PaginationPrevious
    ├── PaginationItem
    │   └── PaginationLink
    ├── PaginationItem
    │   └── PaginationEllipsis
    └── PaginationItem
        └── PaginationNext
```

## Examples

### Simple

A simple pagination with only page numbers.

<ComponentPreview styleName="radix-nova" name="pagination-simple" />

### Icons Only

Use just the previous and next buttons without page numbers. This is useful for
data tables with a rows per page selector.

<ComponentPreview styleName="radix-nova" name="pagination-icons-only" />

## Next.js

By default the `<PaginationLink />` component will render an `<a />` tag.

To use the Next.js `<Link />` component, make the following updates to
`pagination.tsx`.

```diff showLineNumbers /typeof Link/ {1}
+ import Link from "next/link"

- type PaginationLinkProps = ... & React.ComponentProps<"a">
+ type PaginationLinkProps = ... & React.ComponentProps<typeof Link>

const PaginationLink = ({...props }: ) => (
  <PaginationItem>
-   <a>
+   <Link>
      // ...
-   </a>
+   </Link>
  </PaginationItem>
)
```

<Callout className="mt-6">

**Note:** We are making updates to the cli to automatically do this for you.

</Callout>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="pagination-rtl"
  direction="rtl"
/>

## Changelog

### RTL Support

If you're upgrading from a previous version of the `Pagination` component,
you'll need to apply the following updates to add the `text` prop:

<Steps>

<Step>Update `PaginationPrevious`.</Step>

```diff
  function PaginationPrevious({
    className,
+   text = "Previous",
    ...props
- }: React.ComponentProps<typeof PaginationLink>) {
+ }: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
    return (
      <PaginationLink
        aria-label="Go to previous page"
        size="default"
        className={cn("cn-pagination-previous", className)}
        {...props}
      >
        <ChevronLeftIcon />
        <span className="cn-pagination-previous-text hidden sm:block">
-         Previous
+         {text}
        </span>
      </PaginationLink>
    )
  }
```

<Step>Update `PaginationNext`.</Step>

```diff
  function PaginationNext({
    className,
+   text = "Next",
    ...props
- }: React.ComponentProps<typeof PaginationLink>) {
+ }: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
    return (
      <PaginationLink
        aria-label="Go to next page"
        size="default"
        className={cn("cn-pagination-next", className)}
        {...props}
      >
-       <span className="cn-pagination-next-text hidden sm:block">Next</span>
+       <span className="cn-pagination-next-text hidden sm:block">{text}</span>
        <ChevronRightIcon />
      </PaginationLink>
    )
  }
```

</Steps>

---
title: Popover
description: Displays rich content in a portal, triggered by a button.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/popover
    api: https://www.radix-ui.com/docs/primitives/components/popover#api-reference
---

<ComponentPreview styleName="radix-nova" name="popover-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add popover
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="popover"
  title="components/ui/popover.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";
```

```tsx showLineNumbers
<Popover>
    <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
    </PopoverTrigger>
    <PopoverContent>
        <PopoverHeader>
            <PopoverTitle>Title</PopoverTitle>
            <PopoverDescription>Description text here.</PopoverDescription>
        </PopoverHeader>
    </PopoverContent>
</Popover>;
```

## Composition

Use the following composition to build a `Popover`:

```text
Popover
├── PopoverTrigger
└── PopoverContent
```

## Examples

### Basic

A simple popover with a header, title, and description.

<ComponentPreview styleName="radix-nova" name="popover-basic" />

### Align

Use the `align` prop on `PopoverContent` to control the horizontal alignment.

<ComponentPreview styleName="radix-nova" name="popover-alignments" />

### With Form

A popover with form fields inside.

<ComponentPreview styleName="radix-nova" name="popover-form" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="popover-rtl" direction="rtl" />

## API Reference

See the
[Radix UI Popover](https://www.radix-ui.com/docs/primitives/components/popover#api-reference)
documentation.

---
title: Progress
description: Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/progress
    api: https://www.radix-ui.com/docs/primitives/components/progress#api-reference
---

<ComponentPreview styleName="radix-nova" name="progress-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add progress
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="progress"
  title="components/ui/progress.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Progress } from "@/components/ui/progress";
```

```tsx showLineNumbers
<Progress value={33} />;
```

## Examples

### Label

Use a `Field` component to add a label to the progress bar.

<ComponentPreview styleName="radix-nova" name="progress-label" />

### Controlled

A progress bar that can be controlled by a slider.

<ComponentPreview styleName="radix-nova" name="progress-controlled" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="progress-rtl" direction="rtl" />

## API Reference

See the
[Radix UI Progress](https://www.radix-ui.com/docs/primitives/components/progress#api-reference)
documentation.

---
title: Radio Group
description: A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/radio-group
    api: https://www.radix-ui.com/docs/primitives/components/radio-group#api-reference
---

<ComponentPreview styleName="radix-nova" name="radio-group-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add radio-group
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="radio-group"
  title="components/ui/radio-group.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
```

```tsx showLineNumbers
<RadioGroup defaultValue="option-one">
    <div className="flex items-center gap-3">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
    </div>
    <div className="flex items-center gap-3">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Option Two</Label>
    </div>
</RadioGroup>;
```

## Composition

Use the following composition to build a `RadioGroup`:

```text
RadioGroup
├── RadioGroupItem
└── RadioGroupItem
```

## Examples

### Description

Radio group items with a description using the `Field` component.

<ComponentPreview styleName="radix-nova" name="radio-group-description" />

### Choice Card

Use `FieldLabel` to wrap the entire `Field` for a clickable card-style
selection.

<ComponentPreview styleName="radix-nova" name="radio-group-choice-card" />

### Fieldset

Use `FieldSet` and `FieldLegend` to group radio items with a label and
description.

<ComponentPreview styleName="radix-nova" name="radio-group-fieldset" />

### Disabled

Use the `disabled` prop on `RadioGroupItem` to disable individual items.

<ComponentPreview styleName="radix-nova" name="radio-group-disabled" />

### Invalid

Use `aria-invalid` on `RadioGroupItem` and `data-invalid` on `Field` to show
validation errors.

<ComponentPreview styleName="radix-nova" name="radio-group-invalid" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="radio-group-rtl"
  direction="rtl"
/>

## API Reference

See the
[Radix UI Radio Group](https://www.radix-ui.com/docs/primitives/components/radio-group#api-reference)
documentation.

---
title: Resizable
description: Accessible resizable panel groups and layouts with keyboard support.
base: radix
component: true
links:
    doc: https://github.com/bvaughn/react-resizable-panels
    api: https://github.com/bvaughn/react-resizable-panels/tree/main/packages/react-resizable-panels
---

<ComponentPreview
  styleName="radix-nova"
  name="resizable-demo"
  previewClassName="h-80"
/>

## About

The `Resizable` component is built on top of
[react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) by
[bvaughn](https://github.com/bvaughn).

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add resizable
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install react-resizable-panels
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="resizable"
  title="components/ui/resizable.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
```

```tsx showLineNumbers
<ResizablePanelGroup orientation="horizontal">
    <ResizablePanel>One</ResizablePanel>
    <ResizableHandle />
    <ResizablePanel>Two</ResizablePanel>
</ResizablePanelGroup>;
```

## Composition

Use the following composition to build a `ResizablePanelGroup`:

```text
ResizablePanelGroup
├── ResizablePanel
├── ResizableHandle
└── ResizablePanel
```

## Examples

### Vertical

Use `orientation="vertical"` for vertical resizing.

<ComponentPreview styleName="radix-nova" name="resizable-vertical" />

### Handle

Use the `withHandle` prop on `ResizableHandle` to show a visible handle.

<ComponentPreview styleName="radix-nova" name="resizable-handle" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="resizable-rtl" direction="rtl" />

## API Reference

See the
[react-resizable-panels](https://github.com/bvaughn/react-resizable-panels/tree/main/packages/react-resizable-panels)
documentation.

## Changelog

### 2025-02-02 `react-resizable-panels` v4

Updated to `react-resizable-panels` v4. See the
[v4.0.0 release notes](https://github.com/bvaughn/react-resizable-panels/releases/tag/4.0.0)
for full details.

If you're using `react-resizable-panels` primitives directly, note the following
changes:

| v3                           | v4                      |
| ---------------------------- | ----------------------- |
| `PanelGroup`                 | `Group`                 |
| `PanelResizeHandle`          | `Separator`             |
| `direction` prop             | `orientation` prop      |
| `defaultSize={50}`           | `defaultSize="50%"`     |
| `onLayout`                   | `onLayoutChange`        |
| `ImperativePanelHandle`      | `PanelImperativeHandle` |
| `ref` prop on Panel          | `panelRef` prop         |
| `data-panel-group-direction` | `aria-orientation`      |

<Callout>
  The shadcn/ui wrapper components (`ResizablePanelGroup`, `ResizablePanel`,
  `ResizableHandle`) remain unchanged.
</Callout>

---
title: Scroll Area
description: Augments native scroll functionality for custom, cross-browser styling.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/scroll-area
    api: https://www.radix-ui.com/docs/primitives/components/scroll-area#api-reference
---

<ComponentPreview
  styleName="radix-nova"
  name="scroll-area-demo"
  previewClassName="h-96"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add scroll-area
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="scroll-area"
  title="components/ui/scroll-area.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
```

```tsx showLineNumbers
<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
    Your scrollable content here.
</ScrollArea>;
```

## Composition

Use the following composition to build a `ScrollArea`:

```text
ScrollArea
└── ScrollBar
```

## Examples

### Horizontal

Use `ScrollBar` with `orientation="horizontal"` for horizontal scrolling.

<ComponentPreview styleName="radix-nova" name="scroll-area-horizontal-demo" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="scroll-area-rtl"
  direction="rtl"
  previewClassName="h-auto"
/>

## API Reference

See the
[Radix UI Scroll Area](https://www.radix-ui.com/docs/primitives/components/scroll-area#api-reference)
documentation.

---
title: Select
description: Displays a list of options for the user to pick from—triggered by a button.
base: radix
component: true
featured: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/select
    api: https://www.radix-ui.com/docs/primitives/components/select#api-reference
---

<ComponentPreview styleName="radix-nova" name="select-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add select
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="select"
  title="components/ui/select.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
```

```tsx showLineNumbers
<Select>
    <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
    </SelectTrigger>
    <SelectContent>
        <SelectGroup>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
        </SelectGroup>
    </SelectContent>
</Select>;
```

## Composition

Use the following composition to build a `Select`:

```text
Select
├── SelectTrigger
│   └── SelectValue
└── SelectContent
    ├── SelectGroup
    │   ├── SelectLabel
    │   ├── SelectItem
    │   └── SelectItem
    ├── SelectSeparator
    └── SelectGroup
        ├── SelectLabel
        ├── SelectItem
        └── SelectItem
```

## Examples

### Align Item With Trigger

Use the `position` prop on `SelectContent` to control alignment. When
`position="item-aligned"` (default), the popup positions so the selected item
appears over the trigger. When `position="popper"`, the popup aligns to the
trigger edge.

<ComponentPreview styleName="radix-nova" name="select-align-item" />

### Groups

Use `SelectGroup`, `SelectLabel`, and `SelectSeparator` to organize items.

<ComponentPreview styleName="radix-nova" name="select-groups" />

### Scrollable

A select with many items that scrolls.

<ComponentPreview styleName="radix-nova" name="select-scrollable" />

### Disabled

<ComponentPreview styleName="radix-nova" name="select-disabled" />

### Invalid

Add the `data-invalid` attribute to the `Field` component and the `aria-invalid`
attribute to the `SelectTrigger` component to show an error state.

```tsx showLineNumbers /data-invalid/ /aria-invalid/
<Field data-invalid>
    <FieldLabel>Fruit</FieldLabel>
    <SelectTrigger aria-invalid>
        <SelectValue />
    </SelectTrigger>
</Field>;
```

<ComponentPreview styleName="radix-nova" name="select-invalid" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="select-rtl" direction="rtl" />

## API Reference

See the
[Radix UI Select](https://www.radix-ui.com/docs/primitives/components/select#api-reference)
documentation.

---
title: Separator
description: Visually or semantically separates content.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/separator
    api: https://www.radix-ui.com/docs/primitives/components/separator#api-reference
---

<ComponentPreview styleName="radix-nova" name="separator-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add separator
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="separator"
  title="components/ui/separator.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Separator } from "@/components/ui/separator";
```

```tsx showLineNumbers
<Separator />;
```

## Examples

### Vertical

Use `orientation="vertical"` for a vertical separator.

<ComponentPreview styleName="radix-nova" name="separator-vertical" />

### Menu

Vertical separators between menu items with descriptions.

<ComponentPreview styleName="radix-nova" name="separator-menu" />

### List

Horizontal separators between list items.

<ComponentPreview styleName="radix-nova" name="separator-list" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="separator-rtl" direction="rtl" />

## API Reference

See the
[Radix UI Separator](https://www.radix-ui.com/docs/primitives/components/separator#api-reference)
documentation.

---
title: Sheet
description: Extends the Dialog component to display content that complements the main content of the screen.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/dialog
    api: https://www.radix-ui.com/docs/primitives/components/dialog#api-reference
---

<ComponentPreview styleName="radix-nova" name="sheet-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add sheet
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="sheet"
  title="components/ui/sheet.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
```

```tsx showLineNumbers
<Sheet>
    <SheetTrigger>Open</SheetTrigger>
    <SheetContent>
        <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>This action cannot be undone.</SheetDescription>
        </SheetHeader>
    </SheetContent>
</Sheet>;
```

## Composition

Use the following composition to build a `Sheet`:

```text
Sheet
├── SheetTrigger
└── SheetContent
    ├── SheetHeader
    │   ├── SheetTitle
    │   └── SheetDescription
    └── SheetFooter
```

## Examples

### Side

Use the `side` prop on `SheetContent` to set the edge of the screen where the
sheet appears. Values are `top`, `right`, `bottom`, or `left`.

<ComponentPreview styleName="radix-nova" name="sheet-side" />

### No Close Button

Use `showCloseButton={false}` on `SheetContent` to hide the close button.

<ComponentPreview styleName="radix-nova" name="sheet-no-close-button" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="sheet-rtl" direction="rtl" />

## API Reference

See the
[Radix UI Dialog](https://www.radix-ui.com/docs/primitives/components/dialog#api-reference)
documentation.

---
title: Sidebar
description: A composable, themeable and customizable sidebar component.
base: radix
component: true
---

import { ExternalLinkIcon } from "lucide-react"

<figure className="flex flex-col gap-4">
  <ComponentPreview
    styleName="radix-nova"
    name="sidebar-demo"
    type="block"
    className="w-full"
  />
  <figcaption className="text-center text-sm text-gray-500">
    A sidebar that collapses to icons.
  </figcaption>
</figure>

Sidebars are one of the most complex components to build. They are central to
any application and often contain a lot of moving parts.

We now have a solid foundation to build on top of. Composable. Themeable.
Customizable.

[Browse the Blocks Library](/blocks).

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add sidebar
```

</TabsContent>

<TabsContent value="manual">

<ComponentSource
  name="sidebar"
  title="components/ui/sidebar.tsx"
  styleName="radix-nova"
/>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers title="app/layout.tsx"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}
```

```tsx showLineNumbers title="components/app-sidebar.tsx"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}
```

## Composition

Use the following composition to build a `Sidebar` layout:

```text
SidebarProvider
├── Sidebar
│   ├── SidebarHeader
│   ├── SidebarContent
│   │   ├── SidebarGroup
│   │   │   ├── SidebarGroupLabel
│   │   │   ├── SidebarGroupAction
│   │   │   ├── SidebarGroupContent
│   │   │   └── SidebarMenu
│   │   │       ├── SidebarMenuItem
│   │   │       │   ├── SidebarMenuButton
│   │   │       │   ├── SidebarMenuAction
│   │   │       │   └── SidebarMenuBadge
│   │   │       └── SidebarMenuItem
│   │   │           ├── SidebarMenuButton
│   │   │           └── SidebarMenuSub
│   │   │               ├── SidebarMenuSubItem
│   │   │               └── SidebarMenuSubItem
│   │   └── SidebarGroup
│   │       └── SidebarMenu
│   │           ├── SidebarMenuItem
│   │           └── SidebarMenuItem
│   ├── SidebarFooter
│   └── SidebarRail
├── SidebarInset
└── SidebarTrigger
```

## Structure

- **SidebarProvider** — Handles collapsible state and provides sidebar context
  to child components.
- **Sidebar** — The main collapsible sidebar panel.
- **SidebarHeader** — Sticky at the top; use for branding, titles, or workspace
  switchers.
- **SidebarFooter** — Sticky at the bottom; use for user menus, settings, or
  actions.
- **SidebarContent** — Scrollable region between the header and footer.
- **SidebarGroup** — Groups related navigation with optional label, action, and
  content areas.
- **SidebarMenu** / **SidebarMenuItem** — Menu structure for links, badges,
  actions, and nested submenus.
- **SidebarRail** — Resize handle for adjusting sidebar width when applicable.
- **SidebarInset** — Wraps main content when using the `inset` variant.
- **SidebarTrigger** — Control that toggles the sidebar open or collapsed.

<Image
  src="/images/sidebar-structure.png"
  width="716"
  height="420"
  alt="Sidebar Structure"
  className="mt-6 w-full overflow-hidden rounded-lg border dark:hidden"
/>
<Image
  src="/images/sidebar-structure-dark.png"
  width="716"
  height="420"
  alt="Sidebar Structure"
  className="mt-6 hidden w-full overflow-hidden rounded-lg border dark:block"
/>

## SidebarProvider

The `SidebarProvider` component is used to provide the sidebar context to the
`Sidebar` component. You should always wrap your application in a
`SidebarProvider` component.

### Props

| Name           | Type                      | Description                                  |
| -------------- | ------------------------- | -------------------------------------------- |
| `defaultOpen`  | `boolean`                 | Default open state of the sidebar.           |
| `open`         | `boolean`                 | Open state of the sidebar (controlled).      |
| `onOpenChange` | `(open: boolean) => void` | Sets open state of the sidebar (controlled). |

### Width

If you have a single sidebar in your application, you can use the
`SIDEBAR_WIDTH` and `SIDEBAR_WIDTH_MOBILE` variables in `sidebar.tsx` to set the
width of the sidebar.

```tsx showLineNumbers title="components/ui/sidebar.tsx"
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
```

For multiple sidebars in your application, you can use the `--sidebar-width` and
`--sidebar-width-mobile` CSS variables in the `style` prop.

```tsx showLineNumbers
<SidebarProvider
    style={{
        "--sidebar-width": "20rem",
        "--sidebar-width-mobile": "20rem",
    } as React.CSSProperties}
>
    <Sidebar />
</SidebarProvider>;
```

### Keyboard Shortcut

To trigger the sidebar, you use the `cmd+b` keyboard shortcut on Mac and
`ctrl+b` on Windows.

```tsx showLineNumbers title="components/ui/sidebar.tsx"
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
```

## Sidebar

The main `Sidebar` component used to render a collapsible sidebar.

### Props

| Property      | Type                              | Description                       |
| ------------- | --------------------------------- | --------------------------------- |
| `side`        | `left` or `right`                 | The side of the sidebar.          |
| `variant`     | `sidebar`, `floating`, or `inset` | The variant of the sidebar.       |
| `collapsible` | `offcanvas`, `icon`, or `none`    | Collapsible state of the sidebar. |

| Prop        | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `offcanvas` | A collapsible sidebar that slides in from the left or right. |
| `icon`      | A sidebar that collapses to icons.                           |
| `none`      | A non-collapsible sidebar.                                   |

<Callout>
  **Note:** If you use the `inset` variant, remember to wrap your main content
  in a `SidebarInset` component.
</Callout>

```tsx showLineNumbers
<SidebarProvider>
    <Sidebar variant="inset" />
    <SidebarInset>
        <main>{children}</main>
    </SidebarInset>
</SidebarProvider>;
```

## useSidebar

The `useSidebar` hook is used to control the sidebar.

```tsx showLineNumbers
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar() {
    const {
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
    } = useSidebar();
}
```

| Property        | Type                      | Description                                   |
| --------------- | ------------------------- | --------------------------------------------- |
| `state`         | `expanded` or `collapsed` | The current state of the sidebar.             |
| `open`          | `boolean`                 | Whether the sidebar is open.                  |
| `setOpen`       | `(open: boolean) => void` | Sets the open state of the sidebar.           |
| `openMobile`    | `boolean`                 | Whether the sidebar is open on mobile.        |
| `setOpenMobile` | `(open: boolean) => void` | Sets the open state of the sidebar on mobile. |
| `isMobile`      | `boolean`                 | Whether the sidebar is on mobile.             |
| `toggleSidebar` | `() => void`              | Toggles the sidebar. Desktop and mobile.      |

## SidebarHeader

Use the `SidebarHeader` component to add a sticky header to the sidebar.

```tsx showLineNumbers title="components/app-sidebar.tsx"
<Sidebar>
    <SidebarHeader>
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton>
                            Select Workspace
                            <ChevronDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                        <DropdownMenuItem>
                            <span>Acme Inc</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarHeader>
</Sidebar>;
```

## SidebarFooter

Use the `SidebarFooter` component to add a sticky footer to the sidebar.

```tsx showLineNumbers
<Sidebar>
    <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton>
                    <User2 /> Username
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarFooter>
</Sidebar>;
```

## SidebarContent

The `SidebarContent` component is used to wrap the content of the sidebar. This
is where you add your `SidebarGroup` components. It is scrollable.

```tsx showLineNumbers
<Sidebar>
    <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
    </SidebarContent>
</Sidebar>;
```

## SidebarGroup

Use the `SidebarGroup` component to create a section within the sidebar.

A `SidebarGroup` has a `SidebarGroupLabel`, a `SidebarGroupContent` and an
optional `SidebarGroupAction`.

```tsx showLineNumbers
<SidebarGroup>
    <SidebarGroupLabel>Application</SidebarGroupLabel>
    <SidebarGroupAction>
        <Plus /> <span className="sr-only">Add Project</span>
    </SidebarGroupAction>
    <SidebarGroupContent></SidebarGroupContent>
</SidebarGroup>;
```

To make a `SidebarGroup` collapsible, wrap it in a `Collapsible`.

```tsx showLineNumbers
<Collapsible defaultOpen className="group/collapsible">
    <SidebarGroup>
        <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
                Help
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
            <SidebarGroupContent />
        </CollapsibleContent>
    </SidebarGroup>
</Collapsible>;
```

## SidebarMenu

The `SidebarMenu` component is used for building a menu within a `SidebarGroup`.

<Image
  src="/images/sidebar-menu.png"
  width="716"
  height="420"
  alt="Sidebar Menu"
  className="mt-6 w-full overflow-hidden rounded-lg border dark:hidden"
/>
<Image
  src="/images/sidebar-menu-dark.png"
  width="716"
  height="420"
  alt="Sidebar Menu"
  className="mt-6 hidden w-full overflow-hidden rounded-lg border dark:block"
/>

```tsx showLineNumbers
<SidebarMenu>
    {projects.map((project) => (
        <SidebarMenuItem key={project.name}>
            <SidebarMenuButton asChild>
                <a href={project.url}>
                    <project.icon />
                    <span>{project.name}</span>
                </a>
            </SidebarMenuButton>
        </SidebarMenuItem>
    ))}
</SidebarMenu>;
```

## SidebarMenuButton

The `SidebarMenuButton` component is used to render a menu button within a
`SidebarMenuItem`.

By default, the `SidebarMenuButton` renders a button but you can use the
`asChild` prop to render a different component such as a `Link` or an `a` tag.

Use the `isActive` prop to mark a menu item as active.

```tsx showLineNumbers
<SidebarMenuButton asChild isActive>
    <a href="#">Home</a>
</SidebarMenuButton>;
```

## SidebarMenuAction

The `SidebarMenuAction` component is used to render a menu action within a
`SidebarMenuItem`.

```tsx showLineNumbers
<SidebarMenuItem>
    <SidebarMenuButton asChild>
        <a href="#">
            <Home />
            <span>Home</span>
        </a>
    </SidebarMenuButton>
    <SidebarMenuAction>
        <Plus /> <span className="sr-only">Add Project</span>
    </SidebarMenuAction>
</SidebarMenuItem>;
```

## SidebarMenuSub

The `SidebarMenuSub` component is used to render a submenu within a
`SidebarMenu`.

```tsx showLineNumbers
<SidebarMenuItem>
    <SidebarMenuButton />
    <SidebarMenuSub>
        <SidebarMenuSubItem>
            <SidebarMenuSubButton />
        </SidebarMenuSubItem>
    </SidebarMenuSub>
</SidebarMenuItem>;
```

## SidebarMenuBadge

The `SidebarMenuBadge` component is used to render a badge within a
`SidebarMenuItem`.

```tsx showLineNumbers
<SidebarMenuItem>
    <SidebarMenuButton />
    <SidebarMenuBadge>24</SidebarMenuBadge>
</SidebarMenuItem>;
```

## SidebarMenuSkeleton

The `SidebarMenuSkeleton` component is used to render a skeleton for a
`SidebarMenu`.

```tsx showLineNumbers
<SidebarMenu>
    {Array.from({ length: 5 }).map((_, index) => (
        <SidebarMenuItem key={index}>
            <SidebarMenuSkeleton />
        </SidebarMenuItem>
    ))}
</SidebarMenu>;
```

## SidebarTrigger

Use the `SidebarTrigger` component to render a button that toggles the sidebar.

```tsx showLineNumbers
import { useSidebar } from "@/components/ui/sidebar";

export function CustomTrigger() {
    const { toggleSidebar } = useSidebar();

    return <button onClick={toggleSidebar}>Toggle Sidebar</button>;
}
```

## SidebarRail

The `SidebarRail` component is used to render a rail within a `Sidebar`. This
rail can be used to toggle the sidebar.

```tsx showLineNumbers
<Sidebar>
    <SidebarHeader />
    <SidebarContent>
        <SidebarGroup />
    </SidebarContent>
    <SidebarFooter />
    <SidebarRail />
</Sidebar>;
```

## Controlled Sidebar

Use the `open` and `onOpenChange` props to control the sidebar.

```tsx showLineNumbers
export function AppSidebar() {
    const [open, setOpen] = React.useState(false);

    return (
        <SidebarProvider open={open} onOpenChange={setOpen}>
            <Sidebar />
        </SidebarProvider>
    );
}
```

## Theming

We use the following CSS variables to theme the sidebar.

```css
@layer base {
    :root {
        --sidebar-background: 0 0% 98%;
        --sidebar-foreground: 240 5.3% 26.1%;
        --sidebar-primary: 240 5.9% 10%;
        --sidebar-primary-foreground: 0 0% 98%;
        --sidebar-accent: 240 4.8% 95.9%;
        --sidebar-accent-foreground: 240 5.9% 10%;
        --sidebar-border: 220 13% 91%;
        --sidebar-ring: 217.2 91.2% 59.8%;
    }

    .dark {
        --sidebar-background: 240 5.9% 10%;
        --sidebar-foreground: 240 4.8% 95.9%;
        --sidebar-primary: 0 0% 98%;
        --sidebar-primary-foreground: 240 5.9% 10%;
        --sidebar-accent: 240 3.7% 15.9%;
        --sidebar-accent-foreground: 240 4.8% 95.9%;
        --sidebar-border: 240 3.7% 15.9%;
        --sidebar-ring: 217.2 91.2% 59.8%;
    }
}
```

## Styling

Here are some tips for styling the sidebar based on different states.

```tsx
<Sidebar collapsible="icon">
    <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden" />
    </SidebarContent>
</Sidebar>;
```

```tsx
<SidebarMenuItem>
    <SidebarMenuButton />
    <SidebarMenuAction className="peer-data-[active=true]/menu-button:opacity-100" />
</SidebarMenuItem>;
```

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

{/* prettier-ignore */}
<Button asChild size="sm" className="mt-6">
<a href="/view/radix-nova/sidebar-rtl" target="_blank">View RTL Sidebar
<ExternalLinkIcon /></a>
</Button>

## Changelog

### RTL Support

If you're upgrading from a previous version of the `Sidebar` component, you'll
need to apply the following updates to add RTL support:

<Steps>

<Step>Add `dir` prop to Sidebar component.</Step>

Add `dir` to the destructured props and pass it to `SheetContent` for mobile:

```diff
  function Sidebar({
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
+   dir,
    ...props
  }: React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }) {
```

Then pass it to `SheetContent` in the mobile view:

```diff
  <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
    <SheetContent
+     dir={dir}
      data-sidebar="sidebar"
      data-slot="sidebar"
      data-mobile="true"
```

<Step>Add `data-side` attribute to sidebar container.</Step>

Add `data-side={side}` to the sidebar container element:

```diff
  <div
    data-slot="sidebar-container"
+   data-side={side}
    className={cn(
```

<Step>Update sidebar container positioning classes.</Step>

Replace JavaScript ternary conditional classes with CSS data attribute
selectors:

```diff
  className={cn(
-   "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
-   side === "left"
-     ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
-     : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
+   "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex data-[side=left]:left-0 data-[side=right]:right-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
```

<Step>Update SidebarRail positioning classes.</Step>

Update the `SidebarRail` component to use physical positioning for the rail:

```diff
  className={cn(
-   "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-end-4 group-data-[side=right]:start-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex",
+   "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 ltr:-translate-x-1/2 rtl:-translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex",
```

<Step>Add RTL flip to SidebarTrigger icon.</Step>

Add `className="rtl:rotate-180"` to the icon in `SidebarTrigger` to flip it in
RTL mode:

```diff
  <Button ...>
-   <PanelLeftIcon />
+   <PanelLeftIcon className="rtl:rotate-180" />
    <span className="sr-only">Toggle Sidebar</span>
  </Button>
```

</Steps>

After applying these changes, you can use the `dir` prop to set the direction:

```tsx
<Sidebar dir="rtl" side="right">
    {/* ... */}
</Sidebar>;
```

The sidebar will correctly position itself and handle interactions in both LTR
and RTL layouts.

---
title: Skeleton
description: Use to show a placeholder while content is loading.
base: radix
component: true
---

<ComponentPreview styleName="radix-nova" name="skeleton-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add skeleton
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="skeleton"
  title="components/ui/skeleton.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Skeleton } from "@/components/ui/skeleton";
```

```tsx
<Skeleton className="h-[20px] w-[100px] rounded-full" />;
```

## Examples

### Avatar

<ComponentPreview styleName="radix-nova" name="skeleton-avatar" />

### Card

<ComponentPreview
  styleName="radix-nova"
  name="skeleton-card"
  previewClassName="h-80"
/>

### Text

<ComponentPreview styleName="radix-nova" name="skeleton-text" />

### Form

<ComponentPreview styleName="radix-nova" name="skeleton-form" />

### Table

<ComponentPreview styleName="radix-nova" name="skeleton-table" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="skeleton-rtl" direction="rtl" />

---
title: Slider
description: An input where the user selects a value from within a given range.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/slider
    api: https://www.radix-ui.com/docs/primitives/components/slider#api-reference
---

<ComponentPreview styleName="radix-nova" name="slider-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add slider
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="slider"
  title="components/ui/slider.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Slider } from "@/components/ui/slider";
```

```tsx
<Slider defaultValue={[33]} max={100} step={1} />;
```

## Examples

### Range

Use an array with two values for a range slider.

<ComponentPreview styleName="radix-nova" name="slider-range" />

### Multiple Thumbs

Use an array with multiple values for multiple thumbs.

<ComponentPreview styleName="radix-nova" name="slider-multiple" />

### Vertical

Use `orientation="vertical"` for a vertical slider.

<ComponentPreview styleName="radix-nova" name="slider-vertical" />

### Controlled

<ComponentPreview styleName="radix-nova" name="slider-controlled" />

### Disabled

Use the `disabled` prop to disable the slider.

<ComponentPreview styleName="radix-nova" name="slider-disabled" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="slider-rtl" direction="rtl" />

## API Reference

See the
[Radix UI Slider](https://www.radix-ui.com/docs/primitives/components/slider#api-reference)
documentation.

---
title: Sonner
description: An opinionated toast component for React.
base: radix
component: true
links:
    doc: https://sonner.emilkowal.ski
---

<ComponentPreview styleName="radix-nova" name="sonner-demo" />

## About

Sonner is built and maintained by
[emilkowalski](https://twitter.com/emilkowalski).

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

<Steps className="mb-0 pt-2">

<Step>Run the following command:</Step>

```bash
npx shadcn@latest add sonner
```

<Step>Add the Toaster component</Step>

```tsx title="app/layout.tsx" {1,9} showLineNumbers
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head />
            <body>
                <main>{children}</main>
                <Toaster />
            </body>
        </html>
    );
}
```

</Steps>

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install sonner next-themes
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="sonner"
  title="components/ui/sonner.tsx"
  styleName="radix-nova"
/>

<Step>Add the Toaster component</Step>

```tsx showLineNumbers title="app/layout.tsx" {1,8}
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head />
            <body>
                <Toaster />
                <main>{children}</main>
            </body>
        </html>
    );
}
```

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { toast } from "sonner";
```

```tsx
toast("Event has been created.");
```

## Examples

### Types

<ComponentPreview styleName="radix-nova" name="sonner-types" />

### Description

<ComponentPreview styleName="radix-nova" name="sonner-description" />

### Position

Use the `position` prop to change the position of the toast.

<ComponentPreview styleName="radix-nova" name="sonner-position" />

## API Reference

See the [Sonner API Reference](https://sonner.emilkowal.ski/getting-started) for
more information.

---
title: Spinner
description: An indicator that can be used to show a loading state.
base: radix
component: true
---

<ComponentPreview styleName="radix-nova" name="spinner-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add spinner
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="spinner"
  title="components/ui/spinner.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Spinner } from "@/components/ui/spinner";
```

```tsx
<Spinner />;
```

## Customization

You can replace the default spinner icon with any other icon by editing the
`Spinner` component.

<ComponentPreview styleName="radix-nova" name="spinner-custom" />

```tsx showLineNumbers title="components/ui/spinner.tsx"
import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
    return (
        <LoaderIcon
            role="status"
            aria-label="Loading"
            className={cn("size-4 animate-spin", className)}
            {...props}
        />
    );
}

export { Spinner };
```

## Examples

### Size

Use the `size-*` utility class to change the size of the spinner.

<ComponentPreview styleName="radix-nova" name="spinner-size" />

### Button

Add a spinner to a button to indicate a loading state. Place the `<Spinner />`
before the label with `data-icon="inline-start"` for a start position, or after
the label with `data-icon="inline-end"` for an end position.

<ComponentPreview styleName="radix-nova" name="spinner-button" />

### Badge

Add a spinner to a badge to indicate a loading state. Place the `<Spinner />`
before the label with `data-icon="inline-start"` for a start position, or after
the label with `data-icon="inline-end"` for an end position.

<ComponentPreview styleName="radix-nova" name="spinner-badge" />

### Input Group

<ComponentPreview styleName="radix-nova" name="spinner-input-group" />

### Empty

<ComponentPreview styleName="radix-nova" name="spinner-empty" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="spinner-rtl" direction="rtl" />

---
title: Switch
description: A control that allows the user to toggle between checked and not checked.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/switch
    api: https://www.radix-ui.com/docs/primitives/components/switch#api-reference
---

<ComponentPreview styleName="radix-nova" name="switch-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add switch
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="switch"
  title="components/ui/switch.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Switch } from "@/components/ui/switch";
```

```tsx
<Switch />;
```

## Examples

### Description

<ComponentPreview styleName="radix-nova" name="switch-description" />

### Choice Card

Card-style selection where `FieldLabel` wraps the entire `Field` for a clickable
card pattern.

<ComponentPreview styleName="radix-nova" name="switch-choice-card" />

### Disabled

Add the `disabled` prop to the `Switch` component to disable the switch. Add the
`data-disabled` prop to the `Field` component for styling.

<ComponentPreview styleName="radix-nova" name="switch-disabled" />

### Invalid

Add the `aria-invalid` prop to the `Switch` component to indicate an invalid
state. Add the `data-invalid` prop to the `Field` component for styling.

<ComponentPreview styleName="radix-nova" name="switch-invalid" />

### Size

Use the `size` prop to change the size of the switch.

<ComponentPreview styleName="radix-nova" name="switch-sizes" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="switch-rtl" direction="rtl" />

## API Reference

See the
[Radix Switch](https://www.radix-ui.com/docs/primitives/components/switch#api-reference)
documentation.

---
title: Table
description: A responsive table component.
base: radix
component: true
---

<ComponentPreview
  styleName="radix-nova"
  name="table-demo"
  previewClassName="h-[30rem]"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add table
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="table"
  title="components/ui/table.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
```

```tsx showLineNumbers
<Table>
    <TableCaption>A list of your recent invoices.</TableCaption>
    <TableHeader>
        <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
    </TableBody>
</Table>;
```

## Composition

Use the following composition to build a `Table`:

```text
Table
├── TableCaption
├── TableHeader
│   └── TableRow
│       ├── TableHead
│       ├── TableHead
│       ├── TableHead
│       └── TableHead
├── TableBody
│   ├── TableRow
│   │   ├── TableCell
│   │   ├── TableCell
│   │   ├── TableCell
│   │   └── TableCell
│   └── TableRow
│       ├── TableCell
│       ├── TableCell
│       ├── TableCell
│       └── TableCell
└── TableFooter
```

## Examples

### Footer

Use the `<TableFooter />` component to add a footer to the table.

<ComponentPreview styleName="radix-nova" name="table-footer" />

### Actions

A table showing actions for each row using a `<DropdownMenu />` component.

<ComponentPreview styleName="radix-nova" name="table-actions" />

## Data Table

You can use the `<Table />` component to build more complex data tables. Combine
it with [@tanstack/react-table](https://tanstack.com/table/v8) to create tables
with sorting, filtering and pagination.

See the [Data Table](/docs/components/data-table) documentation for more
information.

You can also see an example of a data table in the [Tasks](/examples/tasks)
demo.

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="table-rtl"
  direction="rtl"
  previewClassName="h-auto"
/>

---
title: Tabs
description: A set of layered sections of content—known as tab panels—that are displayed one at a time.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/tabs
    api: https://www.radix-ui.com/docs/primitives/components/tabs#api-reference
---

<ComponentPreview
  styleName="radix-nova"
  name="tabs-demo"
  previewClassName="h-96"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add tabs
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="tabs"
  title="components/ui/tabs.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
```

```tsx showLineNumbers
<Tabs defaultValue="account" className="w-[400px]">
    <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
        Make changes to your account here.
    </TabsContent>
    <TabsContent value="password">Change your password here.</TabsContent>
</Tabs>;
```

## Composition

Use the following composition to build `Tabs`:

```text
Tabs
├── TabsList
│   ├── TabsTrigger
│   └── TabsTrigger
├── TabsContent
└── TabsContent
```

## Examples

### Line

Use the `variant="line"` prop on `TabsList` for a line style.

<ComponentPreview styleName="radix-nova" name="tabs-line" />

### Vertical

Use `orientation="vertical"` for vertical tabs.

<ComponentPreview styleName="radix-nova" name="tabs-vertical" />

### Disabled

<ComponentPreview styleName="radix-nova" name="tabs-disabled" />

### Icons

<ComponentPreview styleName="radix-nova" name="tabs-icons" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="tabs-rtl" direction="rtl" />

## API Reference

See the
[Radix Tabs](https://www.radix-ui.com/docs/primitives/components/tabs#api-reference)
documentation.

---
title: Textarea
description: Displays a form textarea or a component that looks like a textarea.
base: radix
component: true
---

<ComponentPreview
  styleName="radix-nova"
  name="textarea-demo"
  previewClassName="*:max-w-xs"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add textarea
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="textarea"
  title="components/ui/textarea.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Textarea } from "@/components/ui/textarea";
```

```tsx
<Textarea />;
```

## Examples

### Field

Use `Field`, `FieldLabel`, and `FieldDescription` to create a textarea with a
label and description.

<ComponentPreview
  styleName="radix-nova"
  name="textarea-field"
  previewClassName="*:max-w-xs"
/>

### Disabled

Use the `disabled` prop to disable the textarea. To style the disabled state,
add the `data-disabled` attribute to the `Field` component.

<ComponentPreview
  styleName="radix-nova"
  name="textarea-disabled"
  previewClassName="*:max-w-xs"
/>

### Invalid

Use the `aria-invalid` prop to mark the textarea as invalid. To style the
invalid state, add the `data-invalid` attribute to the `Field` component.

<ComponentPreview
  styleName="radix-nova"
  name="textarea-invalid"
  previewClassName="*:max-w-xs"
/>

### Button

Pair with `Button` to create a textarea with a submit button.

<ComponentPreview
  styleName="radix-nova"
  name="textarea-button"
  previewClassName="*:max-w-xs"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="textarea-rtl" direction="rtl" />

---
title: Toggle
description: A two-state button that can be either on or off.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/toggle
    api: https://www.radix-ui.com/docs/primitives/components/toggle#api-reference
---

<ComponentPreview styleName="radix-nova" name="toggle-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add toggle
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="toggle"
  title="components/ui/toggle.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Toggle } from "@/components/ui/toggle";
```

```tsx
<Toggle>Toggle</Toggle>;
```

## Examples

### Outline

Use `variant="outline"` for an outline style.

<ComponentPreview styleName="radix-nova" name="toggle-outline" />

### With Text

<ComponentPreview styleName="radix-nova" name="toggle-text" />

### Size

Use the `size` prop to change the size of the toggle.

<ComponentPreview styleName="radix-nova" name="toggle-sizes" />

### Disabled

<ComponentPreview styleName="radix-nova" name="toggle-disabled" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="toggle-rtl" direction="rtl" />

## API Reference

See the
[Radix Toggle](https://www.radix-ui.com/docs/primitives/components/toggle#api-reference)
documentation.

---
title: Toggle Group
description: A set of two-state buttons that can be toggled on or off.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/toggle-group
    api: https://www.radix-ui.com/docs/primitives/components/toggle-group#api-reference
---

<ComponentPreview styleName="radix-nova" name="toggle-group-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add toggle-group
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="toggle-group"
  title="components/ui/toggle-group.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
```

```tsx
<ToggleGroup type="single">
    <ToggleGroupItem value="a">A</ToggleGroupItem>
    <ToggleGroupItem value="b">B</ToggleGroupItem>
    <ToggleGroupItem value="c">C</ToggleGroupItem>
</ToggleGroup>;
```

## Composition

Use the following composition to build a `ToggleGroup`:

```text
ToggleGroup
├── ToggleGroupItem
└── ToggleGroupItem
```

## Examples

### Outline

Use `variant="outline"` for an outline style.

<ComponentPreview styleName="radix-nova" name="toggle-group-outline" />

### Size

Use the `size` prop to change the size of the toggle group.

<ComponentPreview styleName="radix-nova" name="toggle-group-sizes" />

### Spacing

Use `spacing` to add spacing between toggle group items.

<ComponentPreview styleName="radix-nova" name="toggle-group-spacing" />

### Vertical

Use `orientation="vertical"` for vertical toggle groups.

<ComponentPreview styleName="radix-nova" name="toggle-group-vertical" />

### Disabled

<ComponentPreview styleName="radix-nova" name="toggle-group-disabled" />

### Custom

A custom toggle group example.

<ComponentPreview
  styleName="radix-nova"
  name="toggle-group-font-weight-selector"
  previewClassName="*:data-[slot=field]:max-w-xs"
/>

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="toggle-group-rtl"
  direction="rtl"
/>

## API Reference

See the
[Radix Toggle Group](https://www.radix-ui.com/docs/primitives/components/toggle-group#api-reference)
documentation.

## Changelog

### 2026-05-17 Default Spacing

Changed the default `spacing` from `0` to `2` so toggle groups render with space
between items by default. Use `spacing={0}` for connected items.

---
title: Tooltip
description: A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
base: radix
component: true
links:
    doc: https://www.radix-ui.com/docs/primitives/components/tooltip
    api: https://www.radix-ui.com/docs/primitives/components/tooltip#api-reference
---

<ComponentPreview styleName="radix-nova" name="tooltip-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

<Steps className="mb-0 pt-2">

<Step>Run the following command:</Step>

```bash
npx shadcn@latest add tooltip
```

<Step>Add the `TooltipProvider` to the root of your app.</Step>

```tsx title="app/layout.tsx" showLineNumbers {1,7}
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <TooltipProvider>{children}</TooltipProvider>
            </body>
        </html>
    );
}
```

</Steps>

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install radix-ui
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="tooltip"
  title="components/ui/tooltip.tsx"
  styleName="radix-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

<Step>Add the `TooltipProvider` to the root of your app.</Step>

```tsx title="app/layout.tsx" showLineNumbers {1,7}
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <TooltipProvider>{children}</TooltipProvider>
            </body>
        </html>
    );
}
```

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
```

```tsx showLineNumbers
<Tooltip>
    <TooltipTrigger>Hover</TooltipTrigger>
    <TooltipContent>
        <p>Add to library</p>
    </TooltipContent>
</Tooltip>;
```

## Composition

Use the following composition to build a `Tooltip`:

```text
Tooltip
├── TooltipTrigger
└── TooltipContent
```

## Examples

### Side

Use the `side` prop to change the position of the tooltip.

<ComponentPreview styleName="radix-nova" name="tooltip-sides" />

### With Keyboard Shortcut

<ComponentPreview styleName="radix-nova" name="tooltip-keyboard" />

### Disabled Button

Show a tooltip on a disabled button by wrapping it with a span.

<ComponentPreview styleName="radix-nova" name="tooltip-disabled" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview styleName="radix-nova" name="tooltip-rtl" direction="rtl" />

## API Reference

See the
[Radix Tooltip](https://www.radix-ui.com/docs/primitives/components/tooltip#api-reference)
documentation.

---
title: Typography
description: Styles for headings, paragraphs, lists, etc.
base: radix
component: true
---

We do not ship any typography styles by default. This page is an example of how
you can use utility classes to style your text.

<ComponentPreview
  styleName="radix-nova"
  name="typography-demo"
  className="[&_.preview]:h-auto!"
  hideCode
/>

## h1

<ComponentPreview styleName="radix-nova" name="typography-h1" />

## h2

<ComponentPreview styleName="radix-nova" name="typography-h2" />

## h3

<ComponentPreview styleName="radix-nova" name="typography-h3" />

## h4

<ComponentPreview styleName="radix-nova" name="typography-h4" />

## p

<ComponentPreview styleName="radix-nova" name="typography-p" />

## blockquote

<ComponentPreview styleName="radix-nova" name="typography-blockquote" />

## table

<ComponentPreview styleName="radix-nova" name="typography-table" />

## list

<ComponentPreview styleName="radix-nova" name="typography-list" />

## Inline code

<ComponentPreview styleName="radix-nova" name="typography-inline-code" />

## Lead

<ComponentPreview styleName="radix-nova" name="typography-lead" />

## Large

<ComponentPreview styleName="radix-nova" name="typography-large" />

## Small

<ComponentPreview styleName="radix-nova" name="typography-small" />

## Muted

<ComponentPreview styleName="radix-nova" name="typography-muted" />

## RTL

To enable RTL support in shadcn/ui, see the
[RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="radix-nova"
  name="typography-rtl"
  direction="rtl"
  className="[&_.preview]:h-auto!"
/>

---
title: Installation
description: How to install dependencies and structure your app.
---

<Callout className="mb-6 border-emerald-600 bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-900">

**Recommended for new projects:** Use [shadcn/create](/create) to build your
preset visually and generate the right setup command for your framework.

</Callout>

Choose the setup that matches your starting point.

<div className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-6">
  <LinkedCard
    href="#use-create"
    className="items-start gap-1 p-6 text-sm md:p-6"
  >
    <div className="font-medium">Use shadcn/create</div>
    <div className="leading-relaxed text-muted-foreground">
      Build your preset visually and generate a setup command.
    </div>
  </LinkedCard>
  <LinkedCard href="#use-cli" className="items-start gap-1 p-6 text-sm md:p-6">
    <div className="font-medium">Use the CLI</div>
    <div className="leading-relaxed text-muted-foreground">
      Scaffold a supported template directly from the terminal.
    </div>
  </LinkedCard>
  <LinkedCard
    href="#existing-project"
    className="items-start gap-1 p-6 text-sm md:p-6"
  >
    <div className="font-medium">Existing Project</div>
    <div className="leading-relaxed text-muted-foreground">
      Add shadcn/ui to an app you already created.
    </div>
  </LinkedCard>
</div>

<div id="use-create" className="scroll-mt-24" />
## Use shadcn/create

Build your preset visually, preview your choices, and generate a
framework-specific setup command.

<Button asChild size="sm">
  <Link
    href="/create"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-6 no-underline!"
  >
    Open shadcn/create
  </Link>
</Button>

Available for Next.js, Vite, Laravel, React Router, Astro, and TanStack Start.

<div id="use-cli" className="scroll-mt-24" />
## Use the CLI

Use the CLI to scaffold a new project directly from the terminal:

```bash
npx shadcn@latest init -t [framework]
```

Supported templates: `next`, `vite`, `start`, `react-router`, and `astro`.

For Laravel, create the app first with `laravel new`, then run
`npx shadcn@latest init`.

<div id="existing-project" className="scroll-mt-24" />
## Existing Project

Each framework guide includes an `Existing Project` section with the manual
setup steps for that framework.

Pick your framework below and follow that path.

## Choose Your Framework

For Laravel, start with `laravel new` before using `shadcn/create` or
`shadcn init`.

<div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
  <LinkedCard href="/docs/installation/next">
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10"
      fill="currentColor"
    >
      <title>Next.js</title>
      <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.096-.0633c.8518-.5536 1.7525-1.3418 2.4657-2.1627 1.5179-1.7429 2.4963-3.868 2.8247-6.134.0961-.6591.1078-.854.1078-1.7475 0-.8937-.012-1.0884-.1078-1.7476-.6522-4.506-3.8592-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.42-2.4985-.5232-.169-.0176-1.0835-.0366-1.6123-.037zm4.0685 7.217c.3473 0 .4082.0053.4857.047.1127.0562.204.1642.237.2767.0186.061.0234 1.3653.0186 4.3044l-.0067 4.2175-.7436-1.14-.7461-1.14v-3.066c0-1.982.0093-3.0963.0234-3.1502.0375-.1313.1196-.2346.2323-.2955.0961-.0494.1313-.054.4997-.054z" />
    </svg>
    <p className="mt-2 font-medium">Next.js</p>
  </LinkedCard>
  <LinkedCard href="/docs/installation/vite">
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10"
      fill="currentColor"
    >
      <title>Vite</title>
      <path d="m8.286 10.578.512-8.657a.306.306 0 0 1 .247-.282L17.377.006a.306.306 0 0 1 .353.385l-1.558 5.403a.306.306 0 0 0 .352.385l2.388-.46a.306.306 0 0 1 .332.438l-6.79 13.55-.123.19a.294.294 0 0 1-.252.14c-.177 0-.35-.152-.305-.369l1.095-5.301a.306.306 0 0 0-.388-.355l-1.433.435a.306.306 0 0 1-.389-.354l.69-3.375a.306.306 0 0 0-.37-.36l-2.32.536a.306.306 0 0 1-.374-.316zm14.976-7.926L17.284 3.74l-.544 1.887 2.077-.4a.8.8 0 0 1 .84.369.8.8 0 0 1 .034.783L12.9 19.93l-.013.025-.015.023-.122.19a.801.801 0 0 1-.672.37.826.826 0 0 1-.634-.302.8.8 0 0 1-.16-.67l1.029-4.981-1.12.34a.81.81 0 0 1-.86-.262.802.802 0 0 1-.165-.67l.63-3.08-2.027.468a.808.808 0 0 1-.768-.233.81.81 0 0 1-.217-.6l.389-6.57-7.44-1.33a.612.612 0 0 0-.64.906L11.58 23.691a.612.612 0 0 0 1.066-.004l11.26-20.135a.612.612 0 0 0-.644-.9z" />
    </svg>
    <p className="mt-2 font-medium">Vite</p>
  </LinkedCard>

<LinkedCard href="/docs/installation/tanstack">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-10 w-10"
    fill="currentColor"
  >
    <path d="M6.93 13.688a.343.343 0 0 1 .468.132l.063.106c.48.851.98 1.66 1.5 2.426a35.65 35.65 0 0 0 2.074 2.742.345.345 0 0 1-.039.484l-.074.066c-2.543 2.223-4.191 2.665-4.953 1.333-.746-1.305-.477-3.672.808-7.11a.344.344 0 0 1 .153-.18ZM17.75 16.3a.34.34 0 0 1 .395.27l.02.1c.628 3.286.187 4.93-1.325 4.93-1.48 0-3.36-1.402-5.649-4.203a.327.327 0 0 1-.074-.222c0-.188.156-.34.344-.34h.121a32.984 32.984 0 0 0 2.809-.098c1.07-.086 2.191-.23 3.359-.437zm.871-6.977a.353.353 0 0 1 .445-.21l.102.034c3.262 1.11 4.504 2.332 3.719 3.664-.766 1.305-2.993 2.254-6.684 2.848a.362.362 0 0 1-.238-.047.343.343 0 0 1-.125-.476l.062-.106a34.07 34.07 0 0 0 1.367-2.523c.477-.989.93-2.051 1.352-3.184zM7.797 8.34a.362.362 0 0 1 .238.047.343.343 0 0 1 .125.476l-.062.106a34.088 34.088 0 0 0-1.367 2.523c-.477.988-.93 2.051-1.352 3.184a.353.353 0 0 1-.445.21l-.102-.034C1.57 13.742.328 12.52 1.113 11.188 1.88 9.883 4.106 8.934 7.797 8.34Zm5.281-3.984c2.543-2.223 4.192-2.664 4.953-1.332.746 1.304.477 3.671-.808 7.109a.344.344 0 0 1-.153.18.343.343 0 0 1-.468-.133l-.063-.106a34.64 34.64 0 0 0-1.5-2.426 35.65 35.65 0 0 0-2.074-2.742.345.345 0 0 1 .039-.484ZM7.285 2.274c1.48 0 3.364 1.402 5.649 4.203a.349.349 0 0 1 .078.218.348.348 0 0 1-.348.344l-.117-.004a34.584 34.584 0 0 0-2.809.102 35.54 35.54 0 0 0-3.363.437.343.343 0 0 1-.394-.273l-.02-.098c-.629-3.285-.188-4.93 1.324-4.93Zm2.871 5.812h3.688a.638.638 0 0 1 .55.316l1.848 3.22a.644.644 0 0 1 0 .628l-1.847 3.223a.638.638 0 0 1-.551.316h-3.688a.627.627 0 0 1-.547-.316L7.758 12.25a.644.644 0 0 1 0-.629L9.61 8.402a.627.627 0 0 1 .546-.316Zm3.23.793a.638.638 0 0 1 .552.316l1.39 2.426a.644.644 0 0 1 0 .629l-1.39 2.43a.638.638 0 0 1-.551.316h-2.774a.627.627 0 0 1-.546-.316l-1.395-2.43a.644.644 0 0 1 0-.629l1.395-2.426a.627.627 0 0 1 .546-.316Zm-.491.867h-1.79a.624.624 0 0 0-.546.316l-.899 1.56a.644.644 0 0 0 0 .628l.899 1.563a.632.632 0 0 0 .547.316h1.789a.632.632 0 0 0 .547-.316l.898-1.563a.644.644 0 0 0 0-.629l-.898-1.558a.624.624 0 0 0-.547-.317Zm-.477.828c.227 0 .438.121.547.317l.422.73a.625.625 0 0 1 0 .629l-.422.734a.627.627 0 0 1-.547.317h-.836a.632.632 0 0 1-.547-.317l-.422-.734a.625.625 0 0 1 0-.629l.422-.73a.632.632 0 0 1 .547-.317zm-.418.817a.548.548 0 0 0-.473.273.547.547 0 0 0 0 .547.544.544 0 0 0 .473.27.544.544 0 0 0 .473-.27.547.547 0 0 0 0-.547.548.548 0 0 0-.473-.273Zm-4.422.546h.98M18.98 7.75c.391-1.895.477-3.344.223-4.398-.148-.63-.422-1.137-.84-1.508-.441-.39-1-.582-1.625-.582-1.035 0-2.12.472-3.281 1.367a14.9 14.9 0 0 0-1.473 1.316 1.206 1.206 0 0 0-.136-.144c-1.446-1.285-2.66-2.082-3.7-2.39-.617-.184-1.195-.2-1.722-.024-.559.187-1.004.574-1.317 1.117-.515.894-.652 2.074-.46 3.527.078.59.214 1.235.402 1.934a1.119 1.119 0 0 0-.215.047C3.008 8.62 1.71 9.269.926 10.015c-.465.442-.77.938-.883 1.481-.113.578 0 1.156.312 1.7.516.894 1.465 1.597 2.817 2.155.543.223 1.156.426 1.844.61a1.023 1.023 0 0 0-.07.226c-.391 1.891-.477 3.344-.223 4.395.148.629.425 1.14.84 1.508.44.39 1 .582 1.625.582 1.035 0 2.12-.473 3.28-1.364.477-.37.973-.816 1.489-1.336a1.2 1.2 0 0 0 .195.227c1.446 1.285 2.66 2.082 3.7 2.39.617.184 1.195.2 1.722.024.559-.187 1.004-.574 1.317-1.117.515-.894.652-2.074.46-3.527a14.941 14.941 0 0 0-.425-2.012 1.225 1.225 0 0 0 .238-.047c1.828-.61 3.125-1.258 3.91-2.004.465-.441.77-.937.883-1.48.113-.578 0-1.157-.313-1.7-.515-.894-1.464-1.597-2.816-2.156a14.576 14.576 0 0 0-1.906-.625.865.865 0 0 0 .059-.195z" />
  </svg>
  <p className="mt-2 font-medium">TanStack Start</p>
</LinkedCard>
<LinkedCard href="/docs/installation/laravel">
  <svg
    role="img"
    viewBox="0 0 62 65"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
  >
    <path d="M61.8548 14.6253C61.8778 14.7102 61.8895 14.7978 61.8897 14.8858V28.5615C61.8898 28.737 61.8434 28.9095 61.7554 29.0614C61.6675 29.2132 61.5409 29.3392 61.3887 29.4265L49.9104 36.0351V49.1337C49.9104 49.4902 49.7209 49.8192 49.4118 49.9987L25.4519 63.7916C25.3971 63.8227 25.3372 63.8427 25.2774 63.8639C25.255 63.8714 25.2338 63.8851 25.2101 63.8913C25.0426 63.9354 24.8666 63.9354 24.6991 63.8913C24.6716 63.8838 24.6467 63.8689 24.6205 63.8589C24.5657 63.8389 24.5084 63.8215 24.456 63.7916L0.501061 49.9987C0.348882 49.9113 0.222437 49.7853 0.134469 49.6334C0.0465019 49.4816 0.000120578 49.3092 0 49.1337L0 8.10652C0 8.01678 0.0124642 7.92953 0.0348998 7.84477C0.0423783 7.8161 0.0598282 7.78993 0.0697995 7.76126C0.0884958 7.70891 0.105946 7.65531 0.133367 7.6067C0.152063 7.5743 0.179485 7.54812 0.20192 7.51821C0.230588 7.47832 0.256763 7.43719 0.290416 7.40229C0.319084 7.37362 0.356476 7.35243 0.388883 7.32751C0.425029 7.29759 0.457436 7.26518 0.498568 7.2415L12.4779 0.345059C12.6296 0.257786 12.8015 0.211853 12.9765 0.211853C13.1515 0.211853 13.3234 0.257786 13.475 0.345059L25.4531 7.2415H25.4556C25.4955 7.26643 25.5292 7.29759 25.5653 7.32626C25.5977 7.35119 25.6339 7.37362 25.6625 7.40104C25.6974 7.43719 25.7224 7.47832 25.7523 7.51821C25.7735 7.54812 25.8021 7.5743 25.8196 7.6067C25.8483 7.65656 25.8645 7.70891 25.8844 7.76126C25.8944 7.78993 25.9118 7.8161 25.9193 7.84602C25.9423 7.93096 25.954 8.01853 25.9542 8.10652V33.7317L35.9355 27.9844V14.8846C35.9355 14.7973 35.948 14.7088 35.9704 14.6253C35.9792 14.5954 35.9954 14.5692 36.0053 14.5405C36.0253 14.4882 36.0427 14.4346 36.0702 14.386C36.0888 14.3536 36.1163 14.3274 36.1375 14.2975C36.1674 14.2576 36.1923 14.2165 36.2272 14.1816C36.2559 14.1529 36.292 14.1317 36.3244 14.1068C36.3618 14.0769 36.3942 14.0445 36.4341 14.0208L48.4147 7.12434C48.5663 7.03694 48.7383 6.99094 48.9133 6.99094C49.0883 6.99094 49.2602 7.03694 49.4118 7.12434L61.3899 14.0208C61.4323 14.0457 61.4647 14.0769 61.5021 14.1055C61.5333 14.1305 61.5694 14.1529 61.5981 14.1803C61.633 14.2165 61.6579 14.2576 61.6878 14.2975C61.7103 14.3274 61.7377 14.3536 61.7551 14.386C61.7838 14.4346 61.8 14.4882 61.8199 14.5405C61.8312 14.5692 61.8474 14.5954 61.8548 14.6253ZM59.893 27.9844V16.6121L55.7013 19.0252L49.9104 22.3593V33.7317L59.8942 27.9844H59.893ZM47.9149 48.5566V37.1768L42.2187 40.4299L25.953 49.7133V61.2003L47.9149 48.5566ZM1.99677 9.83281V48.5566L23.9562 61.199V49.7145L12.4841 43.2219L12.4804 43.2194L12.4754 43.2169C12.4368 43.1945 12.4044 43.1621 12.3682 43.1347C12.3371 43.1097 12.3009 43.0898 12.2735 43.0624L12.271 43.0586C12.2386 43.0275 12.2162 42.9888 12.1887 42.9539C12.1638 42.9203 12.1339 42.8916 12.114 42.8567L12.1127 42.853C12.0903 42.8156 12.0766 42.7707 12.0604 42.7283C12.0442 42.6909 12.023 42.656 12.013 42.6161C12.0005 42.5688 11.998 42.5177 11.9931 42.4691C11.9881 42.4317 11.9781 42.3943 11.9781 42.3569V15.5801L6.18848 12.2446L1.99677 9.83281ZM12.9777 2.36177L2.99764 8.10652L12.9752 13.8513L22.9541 8.10527L12.9752 2.36177H12.9777ZM18.1678 38.2138L23.9574 34.8809V9.83281L19.7657 12.2459L13.9749 15.5801V40.6281L18.1678 38.2138ZM48.9133 9.14105L38.9344 14.8858L48.9133 20.6305L58.8909 14.8846L48.9133 9.14105ZM47.9149 22.3593L42.124 19.0252L37.9323 16.6121V27.9844L43.7219 31.3174L47.9149 33.7317V22.3593ZM24.9533 47.987L39.59 39.631L46.9065 35.4555L36.9352 29.7145L25.4544 36.3242L14.9907 42.3482L24.9533 47.987Z" />
  </svg>
  <p className="mt-2 font-medium">Laravel</p>
</LinkedCard>
<LinkedCard href="/docs/installation/react-router">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-10 w-10"
    fill="currentColor"
  >
    <path d="M12.118 5.466a2.306 2.306 0 0 0-.623.08c-.278.067-.702.332-.953.583-.41.423-.49.609-.662 1.469-.08.423.41 1.43.847 1.734.45.317 1.085.502 2.065.608 1.429.16 1.84.636 1.84 2.197 0 1.377-.385 1.747-1.96 1.906-1.707.172-2.58.834-2.765 2.117-.106.781.41 1.76 1.125 2.091 1.627.768 3.15-.198 3.467-2.196.211-1.284.622-1.642 1.998-1.747 1.588-.133 2.409-.675 2.713-1.787.278-1.02-.304-2.157-1.297-2.554-.264-.106-.873-.238-1.35-.291-1.495-.16-1.879-.424-2.038-1.39-.225-1.337-.317-1.562-.794-2.09a2.174 2.174 0 0 0-1.613-.73zm-4.785 4.36a2.145 2.145 0 0 0-.497.048c-1.469.318-2.17 2.051-1.35 3.295 1.178 1.774 3.944.953 3.97-1.177.012-1.193-.98-2.143-2.123-2.166zM2.089 14.19a2.22 2.22 0 0 0-.427.052c-2.158.476-2.237 3.626-.106 4.182.53.145.582.145 1.111.013 1.191-.318 1.866-1.456 1.549-2.607-.278-1.02-1.144-1.664-2.127-1.64zm19.824.008c-.233.002-.477.058-.784.162-1.39.477-1.866 2.092-.98 3.336.557.794 1.96 1.058 2.82.516 1.416-.874 1.363-3.057-.093-3.746-.38-.186-.663-.271-.963-.268z" />
  </svg>
  <p className="mt-2 font-medium">React Router</p>
</LinkedCard>
<LinkedCard href="/docs/installation/astro">
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
    fill="currentColor"
  >
    <title>Astro</title>
    <path
      d="M16.074 16.86C15.354 17.476 13.917 17.895 12.262 17.895C10.23 17.895 8.527 17.263 8.075 16.412C7.914 16.9 7.877 17.458 7.877 17.814C7.877 17.814 7.771 19.564 8.988 20.782C8.988 20.15 9.501 19.637 10.133 19.637C11.216 19.637 11.215 20.582 11.214 21.349V21.418C11.214 22.582 11.925 23.579 12.937 24C12.7812 23.6794 12.7005 23.3275 12.701 22.971C12.701 21.861 13.353 21.448 14.111 20.968C14.713 20.585 15.383 20.161 15.844 19.308C16.0926 18.8493 16.2225 18.3357 16.222 17.814C16.2221 17.4903 16.1722 17.1685 16.074 16.86ZM15.551 0.6C15.747 0.844 15.847 1.172 16.047 1.829L20.415 16.176C18.7743 15.3246 17.0134 14.7284 15.193 14.408L12.35 4.8C12.3273 4.72337 12.2803 4.65616 12.2162 4.60844C12.152 4.56072 12.0742 4.53505 11.9943 4.53528C11.9143 4.5355 11.8366 4.56161 11.7727 4.60969C11.7089 4.65777 11.6623 4.72524 11.64 4.802L8.83 14.405C7.00149 14.724 5.23264 15.3213 3.585 16.176L7.974 1.827C8.174 1.171 8.274 0.843 8.471 0.6C8.64406 0.385433 8.86922 0.218799 9.125 0.116C9.415 0 9.757 0 10.443 0H13.578C14.264 0 14.608 0 14.898 0.117C15.1529 0.219851 15.3783 0.386105 15.551 0.6Z"
      fill="currentColor"
    />
  </svg>
  <p className="mt-2 font-medium">Astro</p>
</LinkedCard>
  <LinkedCard href="/docs/installation/manual">
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10"
      fill="currentColor"
    >
      <title>React</title>
      <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
    </svg>
    <p className="mt-2 font-medium">Manual</p>
  </LinkedCard>
</div>

---
title: components.json
description: Configuration for your project.
---

The `components.json` file holds configuration for your project.

We use it to understand how your project is set up and how to generate
components customized for your project.

<Callout className="mt-6" title="Note: The `components.json` file is optional">
  It is **only required if you're using the CLI** to add components to your
  project. If you're using the copy and paste method, you don't need this file.
</Callout>

You can create a `components.json` file in your project by running the following
command:

```bash
npx shadcn@latest init
```

See the <Link href="/docs/cli">CLI section</Link> for more information.

## $schema

You can see the JSON Schema for `components.json`
[here](https://ui.shadcn.com/schema.json).

```json title="components.json"
{
    "$schema": "https://ui.shadcn.com/schema.json"
}
```

## style

The style for your components. **This cannot be changed after initialization.**

```json title="components.json"
{
    "style": "new-york"
}
```

The `default` style has been deprecated. Use the `new-york` style instead.

## tailwind

Configuration to help the CLI understand how Tailwind CSS is set up in your
project.

See the <Link href="/docs/installation">installation section</Link> for how to
set up Tailwind CSS.

### tailwind.config

Path to where your `tailwind.config.js` file is located. **For Tailwind CSS v4,
leave this blank.**

```json title="components.json"
{
  "tailwind": {
    "config": "tailwind.config.js" | "tailwind.config.ts"
  }
}
```

### tailwind.css

Path to the CSS file that imports Tailwind CSS into your project.

```json title="components.json"
{
    "tailwind": {
        "css": "styles/global.css"
    }
}
```

### tailwind.baseColor

This is used to generate the default theme tokens for your components. **This
cannot be changed after initialization.**

```json title="components.json"
{
  "tailwind": {
    "baseColor": "neutral" | "stone" | "zinc" | "mauve" | "olive" | "mist" | "taupe"
  }
}
```

### tailwind.cssVariables

We use and recommend CSS variables for theming.

Set `tailwind.cssVariables` to `true` to generate semantic theme tokens like
`background`, `foreground`, and `primary`. Set it to `false` to generate inline
Tailwind color utilities instead.

```json title="components.json"
{
  "tailwind": {
    "cssVariables": `true` | `false`
  }
}
```

For more information, see the <Link href="/docs/theming">theming docs</Link>.

**This cannot be changed after initialization.** To switch between CSS variables
and utility classes, you'll have to delete and re-install your components.

### tailwind.prefix

The prefix to use for your Tailwind CSS utility classes. Components will be
added with this prefix.

```json title="components.json"
{
    "tailwind": {
        "prefix": "tw-"
    }
}
```

## rsc

Whether or not to enable support for React Server Components.

The CLI automatically adds a `use client` directive to client components when
set to `true`.

```json title="components.json"
{
  "rsc": `true` | `false`
}
```

## tsx

Choose between TypeScript or JavaScript components.

Setting this option to `false` allows components to be added as JavaScript with
the `.jsx` file extension.

```json title="components.json"
{
  "tsx": `true` | `false`
}
```

## aliases

The CLI uses these values to place generated components in the correct location
and rewrite imports.

You can back these aliases with either:

1. `compilerOptions.paths` in your `tsconfig.json` or `jsconfig.json`
2. `package.json#imports` with TypeScript package import resolution enabled

The aliases in `components.json` are still required when using the CLI. They
tell the CLI which import roots map to `components`, `ui`, `lib`, `hooks`, and
`utils`.

<Callout className="mt-6">
  **Important:** If you're using package imports, enable
  `resolvePackageJsonImports` and use `moduleResolution: "bundler"` in your
  `tsconfig.json`. If you're using `paths`, make sure your aliases include the
  `src` directory when applicable.
</Callout>

### Using `tsconfig` or `jsconfig` paths

```json title="tsconfig.json"
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}
```

### Using `package.json#imports`

Recommended setup for a single-package app:

```json title="package.json"
{
    "imports": {
        "#components/*": "./src/components/*.tsx",
        "#lib/*": "./src/lib/*.ts",
        "#hooks/*": "./src/hooks/*.ts"
    }
}
```

```json title="tsconfig.json"
{
    "compilerOptions": {
        "moduleResolution": "bundler",
        "resolvePackageJsonImports": true
    }
}
```

```json title="components.json"
{
    "aliases": {
        "components": "#components",
        "ui": "#components/ui",
        "lib": "#lib",
        "hooks": "#hooks",
        "utils": "#lib/utils"
    }
}
```

The aliases in `components.json` still tell the CLI where to place `components`,
`ui`, `lib`, `hooks`, and `utils`. `package.json#imports` provides the runtime
and TypeScript resolution for those `#...` specifiers.

The matched `imports` target also controls whether generated `#...` imports keep
file extensions:

- `"#components/*": "./src/components/*"` preserves source extensions and can
  generate imports like `#components/button.tsx`
- `"#components/*": "./src/components/*.tsx"` strips source extensions and
  generates imports like `#components/button`

For monorepos, see the <Link href="/docs/monorepo">monorepo docs</Link>. Local
workspace aliases can use `package.json#imports`, while shared workspace imports
such as `@workspace/ui/components` are resolved from the target package's
`exports`.

For framework-specific setup, see the
[package imports guide](/docs/package-imports).

### aliases.utils

Import alias for your utility functions.

```json title="components.json"
{
    "aliases": {
        "utils": "@/lib/utils"
    }
}
```

### aliases.components

Import alias for your components.

```json title="components.json"
{
    "aliases": {
        "components": "@/components"
    }
}
```

### aliases.ui

Import alias for `ui` components.

The CLI will use the `aliases.ui` value to determine where to place your `ui`
components. Use this config if you want to customize the installation directory
for your `ui` components.

```json title="components.json"
{
    "aliases": {
        "ui": "@/app/ui"
    }
}
```

### aliases.lib

Import alias for `lib` functions such as `format-date` or `generate-id`.

```json title="components.json"
{
    "aliases": {
        "lib": "@/lib"
    }
}
```

### aliases.hooks

Import alias for `hooks` such as `use-media-query` or `use-toast`.

```json title="components.json"
{
    "aliases": {
        "hooks": "@/hooks"
    }
}
```

## registries

Configure multiple resource registries for your project. This allows you to
install components, libraries, utilities, and other resources from various
sources including private registries.

See the <Link href="/docs/registry/namespace">Namespaced Registries</Link>
documentation for detailed information.

### Basic Configuration

Configure registries with URL templates:

```json title="components.json"
{
    "registries": {
        "@v0": "https://v0.dev/chat/b/{name}",
        "@acme": "https://registry.acme.com/{name}.json",
        "@internal": "https://internal.company.com/{name}.json"
    }
}
```

The `{name}` placeholder is replaced with the resource name when installing.

### Advanced Configuration with Authentication

For private registries that require authentication:

```json title="components.json"
{
    "registries": {
        "@private": {
            "url": "https://api.company.com/registry/{name}.json",
            "headers": {
                "Authorization": "Bearer ${REGISTRY_TOKEN}",
                "X-API-Key": "${API_KEY}"
            },
            "params": {
                "version": "latest"
            }
        }
    }
}
```

Environment variables in the format `${VAR_NAME}` are automatically expanded
from your environment.

### Using Namespaced Registries

Once configured, install resources using the namespace syntax:

```bash
# Install from a configured registry
npx shadcn@latest add @v0/dashboard

# Install from private registry
npx shadcn@latest add @private/button

# Install multiple resources
npx shadcn@latest add @acme/header @internal/auth-utils
```

### Example: Multiple Registry Setup

```json title="components.json"
{
    "registries": {
        "@shadcn": "https://ui.shadcn.com/r/{name}.json",
        "@company-ui": {
            "url": "https://registry.company.com/ui/{name}.json",
            "headers": {
                "Authorization": "Bearer ${COMPANY_TOKEN}"
            }
        },
        "@team": {
            "url": "https://team.company.com/{name}.json",
            "params": {
                "team": "frontend",
                "version": "${REGISTRY_VERSION}"
            }
        }
    }
}
```

This configuration allows you to:

- Install public components from shadcn/ui
- Access private company UI components with authentication
- Use team-specific resources with versioning

For more information about authentication, see the
<Link href="/docs/registry/authentication">Authentication</Link> documentation.

---
title: Package Imports
description: Configure shadcn/ui with package.json imports.
---

The `shadcn` CLI supports
[package imports](https://nodejs.org/api/packages.html#imports) for installing
components, rewriting imports, and resolving third-party registries.

Package imports let you use private `#...` import aliases from your
`package.json` instead of `compilerOptions.paths` in `tsconfig.json`.

## Example

You configure `imports` in your `package.json`:

```json title="package.json" showLineNumbers
{
    "imports": {
        "#components/*": "./src/components/*.tsx",
        "#lib/*": "./src/lib/*.ts",
        "#hooks/*": "./src/hooks/*.ts"
    }
}
```

Then import generated components using `#...` specifiers:

```tsx
import { Button } from "#components/ui/button";
import { cn } from "#lib/utils";
```

<Callout className="mt-6">
  Package import specifiers must start with `#`. Use TypeScript 5 or later with
  `moduleResolution: "bundler"` and `resolvePackageJsonImports: true`.
</Callout>

## App

For Next.js, Vite, and TanStack Start apps that install components into the same
workspace.

<Steps>

### Configure `package.json`

Add imports for the shadcn/ui install targets.

```json title="package.json" showLineNumbers
{
    "imports": {
        "#components/*": "./src/components/*.tsx",
        "#lib/*": "./src/lib/*.ts",
        "#hooks/*": "./src/hooks/*.ts"
    }
}
```

If your app does not use a `src` directory, remove `src/` from the targets. For
example:

```json title="package.json" showLineNumbers
{
    "imports": {
        "#components/*": "./components/*.tsx",
        "#lib/*": "./lib/*.ts",
        "#hooks/*": "./hooks/*.ts"
    }
}
```

### Configure TypeScript

Enable package import resolution.

```json title="tsconfig.json" showLineNumbers
{
    "compilerOptions": {
        "moduleResolution": "bundler",
        "resolvePackageJsonImports": true
    }
}
```

You do not need `compilerOptions.paths` for these aliases.

### Configure `components.json`

Use the same `#...` roots in `components.json`.

```json title="components.json" showLineNumbers
{
    "aliases": {
        "components": "#components",
        "ui": "#components/ui",
        "lib": "#lib",
        "hooks": "#hooks",
        "utils": "#lib/utils"
    }
}
```

The `ui` alias uses `#components/ui`. It is still covered by the `#components/*`
import in `package.json`.

The `utils` alias uses `#lib/utils`. It is covered by `#lib/*`, so you do not
need a separate `#utils` import.

</Steps>

## Monorepo

In a monorepo, use package imports for files inside each package and package
exports for files shared across workspaces.

For an app workspace:

```json title="apps/web/package.json" showLineNumbers
{
    "name": "web",
    "private": true,
    "imports": {
        "#components/*": "./src/components/*.tsx",
        "#lib/*": "./src/lib/*.ts",
        "#hooks/*": "./src/hooks/*.ts"
    },
    "dependencies": {
        "@workspace/ui": "workspace:*"
    }
}
```

```json title="apps/web/components.json" showLineNumbers
{
    "aliases": {
        "components": "#components",
        "ui": "@workspace/ui/components",
        "lib": "#lib",
        "hooks": "#hooks",
        "utils": "@workspace/ui/lib/utils"
    }
}
```

For the shared UI package:

```json title="packages/ui/package.json" showLineNumbers
{
    "name": "@workspace/ui",
    "private": true,
    "imports": {
        "#components/*": "./src/components/*.tsx",
        "#lib/*": "./src/lib/*.ts",
        "#hooks/*": "./src/hooks/*.ts"
    },
    "exports": {
        "./globals.css": "./src/styles/globals.css",
        "./components/*": "./src/components/*.tsx",
        "./lib/*": "./src/lib/*.ts",
        "./hooks/*": "./src/hooks/*.ts"
    }
}
```

```json title="packages/ui/components.json" showLineNumbers
{
    "aliases": {
        "components": "#components",
        "ui": "#components",
        "lib": "#lib",
        "hooks": "#hooks",
        "utils": "#lib/utils"
    }
}
```

When you run `add` from `apps/web`, app-local files use `#...` imports and
shared UI files are imported from `@workspace/ui`.

```tsx
import { Button } from "@workspace/ui/components/button";
import { LoginForm } from "#components/login-form";
```

## File extensions

The target pattern in `package.json#imports` controls whether generated imports
include file extensions.

```json title="package.json" showLineNumbers
{
    "imports": {
        "#components/*": "./src/components/*.tsx"
    }
}
```

This generates imports without extensions:

```tsx
import { Button } from "#components/ui/button";
```

If you use a target without the extension:

```json title="package.json" showLineNumbers
{
    "imports": {
        "#components/*": "./src/components/*"
    }
}
```

The generated import keeps the source extension:

```tsx
import { Button } from "#components/ui/button.tsx";
```

For most apps, use the extension in the target pattern.

## Troubleshooting

If TypeScript cannot resolve a `#...` import, check that:

- the specifier starts with `#`
- the `imports` entry is in the nearest `package.json`
- `moduleResolution` is set to `bundler`
- `resolvePackageJsonImports` is enabled
- the matching target exists after components are added

If a component is installed but imports still point to `@/...`, check that
`components.json` uses the same `#...` aliases as your package imports.

---
title: Theming
description: Using CSS variables and theme tokens.
---

<Callout>

Want to build your theme visually? Use [shadcn/create](/create) to preview
colors, radius, fonts, and icons, then generate a preset for your project.

</Callout>

We use and recommend CSS variables for theming.

This gives you semantic theme tokens like `background`, `foreground`, and
`primary` that components use by default. Override those tokens in your CSS to
change the look of your app without rewriting component classes.

```tsx /bg-background/ /text-foreground/
<div className="bg-background text-foreground" />;
```

To use CSS variables for theming, set `tailwind.cssVariables` to `true` in your
`components.json` file. This is the default.

```json {8} title="components.json" showLineNumbers
{
    "style": "base-nova",
    "rsc": true,
    "tailwind": {
        "config": "",
        "css": "app/globals.css",
        "baseColor": "neutral",
        "cssVariables": true
    }
}
```

Tailwind maps these tokens into utilities like `bg-background`,
`text-foreground`, `border-border`, and `ring-ring`.

Dark mode works by overriding the same tokens inside a `.dark` selector. See the
[dark mode docs](/docs/dark-mode/next) for adding a theme provider and toggling
the `.dark` class.

## Token Convention

We use semantic background and foreground pairs. The base token controls the
surface color and the `-foreground` token controls the text and icon color that
sits on that surface.

<Callout className="mt-4">

The background suffix is omitted for the surface token. For example, `primary`
pairs with `primary-foreground`.

</Callout>

Given the following CSS variables:

```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

The `background` color of the following component will be `var(--primary)` and
the `foreground` color will be `var(--primary-foreground)`.

```tsx
<div className="bg-primary text-primary-foreground">Hello</div>;
```

## Theme Tokens

These tokens live in your CSS file under `:root` and `.dark`.

| Token                                            | What it controls                                       | Used by                                                                      |
| ------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `background` / `foreground`                      | The default app background and text color.             | The page shell, page sections, and default text.                             |
| `card` / `card-foreground`                       | Elevated surfaces and the content inside them.         | `Card`, dashboard panels, settings panels.                                   |
| `popover` / `popover-foreground`                 | Floating surfaces and the content inside them.         | `Popover`, `DropdownMenu`, `ContextMenu`, and other overlays.                |
| `primary` / `primary-foreground`                 | High-emphasis actions and brand surfaces.              | Default `Button`, selected states, badges, and active accents.               |
| `secondary` / `secondary-foreground`             | Lower-emphasis filled actions and supporting surfaces. | Secondary buttons, secondary badges, and supporting UI.                      |
| `muted` / `muted-foreground`                     | Subtle surfaces and lower-emphasis content.            | Descriptions, placeholders, empty states, helper text, and subdued surfaces. |
| `accent` / `accent-foreground`                   | Interactive hover, focus, and active surfaces.         | Ghost buttons, menu highlight states, hovered rows, and selected items.      |
| `destructive`                                    | Destructive actions and error emphasis.                | Destructive buttons, invalid states, and destructive menu items.             |
| `border`                                         | Default borders and separators.                        | Cards, menus, tables, separators, and layout dividers.                       |
| `input`                                          | Form control borders and input surface treatment.      | `Input`, `Textarea`, `Select`, and outline-style controls.                   |
| `ring`                                           | Focus rings and outlines.                              | Buttons, inputs, checkboxes, menus, and other focusable controls.            |
| `chart-1` ... `chart-5`                          | The default chart palette.                             | Charts and chart-driven dashboard blocks.                                    |
| `sidebar` / `sidebar-foreground`                 | The base sidebar surface and default sidebar text.     | The `Sidebar` container and its default content.                             |
| `sidebar-primary` / `sidebar-primary-foreground` | High-emphasis actions inside the sidebar.              | Active items, icon tiles, badges, and sidebar CTAs.                          |
| `sidebar-accent` / `sidebar-accent-foreground`   | Hover and selected states inside the sidebar.          | Sidebar menu hover states, open items, and interactive rows.                 |
| `sidebar-border`                                 | Sidebar-specific borders and separators.               | Sidebar headers, groups, and internal dividers.                              |
| `sidebar-ring`                                   | Sidebar-specific focus rings.                          | Focused controls inside the sidebar.                                         |
| `radius`                                         | The base corner radius scale.                          | Cards, inputs, buttons, popovers, and the derived `radius-*` tokens.         |

<Callout className="mt-4">

The chart tokens are covered in more detail in the
[Chart theming docs](/docs/components/chart#theming).

</Callout>

## Radius Scale

`--radius` is the base radius token for your theme.

We derive a small radius scale from it so components can use consistent corner
sizes while still sharing a single source of truth.

```css title="app/globals.css" showLineNumbers
@theme inline {
    --radius-sm: calc(var(--radius) * 0.6);
    --radius-md: calc(var(--radius) * 0.8);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) * 1.4);
    --radius-2xl: calc(var(--radius) * 1.8);
    --radius-3xl: calc(var(--radius) * 2.2);
    --radius-4xl: calc(var(--radius) * 2.6);
}
```

This means:

- `radius-lg` is the base value.
- Smaller radii scale down from `--radius`.
- Larger radii scale up from `--radius`.
- Changing `--radius` updates the entire radius scale.

## Adding New Tokens

To add a new token, define it under `:root` and `.dark`, then expose it to
Tailwind with `@theme inline`.

```css title="app/globals.css" showLineNumbers
:root {
    --warning: oklch(0.84 0.16 84);
    --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
    --warning: oklch(0.41 0.11 46);
    --warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
    --color-warning: var(--warning);
    --color-warning-foreground: var(--warning-foreground);
}
```

You can now use `bg-warning` and `text-warning-foreground` in your components.

```tsx /bg-warning/ /text-warning-foreground/
<div className="bg-warning text-warning-foreground" />;
```

## Base Colors

`tailwind.baseColor` controls the default token values generated for your
project when you run `init` or use a preset.

The available base colors are: **Neutral**, **Stone**, **Zinc**, **Mauve**,
**Olive**, **Mist**, and **Taupe**.

## Default Theme CSS

The following is the full default `neutral` theme scaffold. Copy it into your
global CSS file and adjust the tokens as needed.

<CodeCollapsibleWrapper>

```css showLineNumbers title="app/globals.css"
@import "tailwindcss";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-popover: var(--popover);
    --color-popover-foreground: var(--popover-foreground);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-accent: var(--accent);
    --color-accent-foreground: var(--accent-foreground);
    --color-destructive: var(--destructive);
    --color-border: var(--border);
    --color-input: var(--input);
    --color-ring: var(--ring);
    --color-chart-1: var(--chart-1);
    --color-chart-2: var(--chart-2);
    --color-chart-3: var(--chart-3);
    --color-chart-4: var(--chart-4);
    --color-chart-5: var(--chart-5);
    --color-sidebar: var(--sidebar);
    --color-sidebar-foreground: var(--sidebar-foreground);
    --color-sidebar-primary: var(--sidebar-primary);
    --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
    --color-sidebar-accent: var(--sidebar-accent);
    --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
    --color-sidebar-border: var(--sidebar-border);
    --color-sidebar-ring: var(--sidebar-ring);
    --radius-sm: calc(var(--radius) * 0.6);
    --radius-md: calc(var(--radius) * 0.8);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) * 1.4);
    --radius-2xl: calc(var(--radius) * 1.8);
    --radius-3xl: calc(var(--radius) * 2.2);
    --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
    --radius: 0.625rem;
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0 0);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
    --chart-3: oklch(0.398 0.07 227.392);
    --chart-4: oklch(0.828 0.189 84.429);
    --chart-5: oklch(0.769 0.188 70.08);
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.205 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);
}

.dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.205 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.556 0 0);
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
    --sidebar: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.488 0.243 264.376);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
    * {
        @apply border-border outline-ring/50;
    }

    body {
        @apply bg-background text-foreground;
    }
}
```

</CodeCollapsibleWrapper>

## Without CSS Variables

If you do not want to use CSS variables, the CLI can generate components with
inline Tailwind color utilities instead.

```bash
npx shadcn@latest init --no-css-variables
```

This sets `tailwind.cssVariables` to `false` in your `components.json` file.

```tsx /bg-zinc-950/ /text-zinc-50/ /dark:bg-white/ /dark:text-zinc-950/
<div className="bg-zinc-950 text-zinc-50 dark:bg-white dark:text-zinc-950" />;
```

<Callout className="mt-4">

This is an installation-time choice. To switch an existing project, delete and
re-install your components.

</Callout>

---
title: Next.js
description: Adding dark mode to your Next.js app.
---

<Steps>

## Install next-themes

Start by installing `next-themes`:

```bash
npm install next-themes
```

## Create a theme provider

```tsx title="components/theme-provider.tsx" showLineNumbers
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

## Wrap your root layout

Add the `ThemeProvider` to your root layout and add the
`suppressHydrationWarning` prop to the `html` tag.

```tsx {1,6,9-14,16} title="app/layout.tsx" showLineNumbers
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <>
            <html lang="en" suppressHydrationWarning>
                <head />
                <body>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </>
    );
}
```

## Add a mode toggle

Place a mode toggle on your site to toggle between light and dark mode.

<ComponentPreview name="mode-toggle" className="[&_.preview]:items-start" />

</Steps>

---
title: shadcn
description: Use the shadcn CLI to add components to your project.
---

import { TriangleAlertIcon } from "lucide-react"

## init

Use the `init` command to initialize configuration and dependencies for an
existing project, or create a new project with `--name`.

The `init` command installs dependencies, adds the `cn` util and configures CSS
variables for the project.

```bash
npx shadcn@latest init
```

**Options**

```bash
Usage: shadcn init [options] [components...]

initialize your project and install dependencies

Arguments:
  components                 names, url or local path to component

Options:
  -t, --template <template>  the template to use. (next, vite, start, react-router, laravel, astro)
  -b, --base <base>          the component library to use. (radix, base)
  -p, --preset [name]        use a preset configuration
  -y, --yes                  skip confirmation prompt. (default: true)
  -d, --defaults             use default configuration: --template=next --preset=nova (default: false)
  -f, --force                force overwrite of existing configuration. (default: false)
  -c, --cwd <cwd>            the working directory. defaults to the current directory.
  -n, --name <name>          the name for the new project.
  -s, --silent               mute output. (default: false)
  --css-variables            use css variables for theming. (default: true)
  --no-css-variables         do not use css variables for theming.
  --monorepo                 scaffold a monorepo project.
  --no-monorepo              skip the monorepo prompt.
  --rtl                      enable RTL support.
  --no-rtl                   disable RTL support.
  --pointer                  enable pointer cursor for buttons.
  --no-pointer               disable pointer cursor for buttons.
  --reinstall                re-install existing UI components.
  --no-reinstall             do not re-install existing UI components.
  -h, --help                 display help for command
```

The `create` command is an alias for `init`:

```bash
npx shadcn@latest create
```

---

## add

Use the `add` command to add components and dependencies to your project.

```bash
npx shadcn@latest add [component]
```

**Options**

```bash
Usage: shadcn add [options] [components...]

add a component to your project

Arguments:
  components           name, url or local path to component

Options:
  -y, --yes            skip confirmation prompt. (default: false)
  -o, --overwrite      overwrite existing files. (default: false)
  -c, --cwd <cwd>      the working directory. defaults to the current directory.
  -a, --all            add all available components (default: false)
  -p, --path <path>    the path to add the component to.
  -s, --silent         mute output. (default: false)
  --dry-run            preview changes without writing files. (default: false)
  --diff [path]        show diff for a file.
  --view [path]        show file contents.
  -h, --help           display help for command
```

---

## apply

Use the `apply` command to apply a preset to an existing project.

```bash
npx shadcn@latest apply a2r6bw
```

You can apply only the theme or fonts from a preset without reinstalling UI
components:

```bash
npx shadcn@latest apply a2r6bw --only theme
```

Supported values for `--only` are `theme` and `font`.

**Options**

```bash
Usage: shadcn apply [options] [preset]

apply a preset to an existing project

Arguments:
  preset             the preset to apply

Options:
  --preset <preset>  preset configuration to apply
  --only [parts]     apply only parts of a preset: theme, font
  -y, --yes          skip confirmation prompt. (default: false)
  -c, --cwd <cwd>    the working directory. defaults to the current directory.
  -s, --silent       mute output. (default: false)
  -h, --help         display help for command
```

---

## preset

Use the `preset` command to inspect preset codes and resolve the preset for an
existing project.

```bash
npx shadcn@latest preset decode a2r6bw
```

### preset decode

Use `preset decode` to decode a preset code.

```bash
npx shadcn@latest preset decode a2r6bw
```

**Options**

```bash
Usage: shadcn preset decode [options] <code>

decode a preset code

Arguments:
  code        the preset code to decode

Options:
  --json      output as JSON. (default: false)
  -h, --help  display help for command
```

### preset resolve

Use `preset resolve` to resolve the preset from the current project.

```bash
npx shadcn@latest preset resolve
```

The `preset info` command is an alias for `preset resolve`:

```bash
npx shadcn@latest preset info
```

**Options**

```bash
Usage: shadcn preset resolve|info [options]

resolve a preset from your project

Options:
  -c, --cwd <cwd>  the working directory. defaults to the current directory.
  --json            output as JSON. (default: false)
  -h, --help        display help for command
```

### preset url

Use `preset url` to print the create URL for a preset code.

```bash
npx shadcn@latest preset url a2r6bw
```

**Options**

```bash
Usage: shadcn preset url [options] <code>

get the create URL for a preset code

Arguments:
  code        the preset code

Options:
  -h, --help  display help for command
```

### preset open

Use `preset open` to open a preset code in the browser.

```bash
npx shadcn@latest preset open a2r6bw
```

**Options**

```bash
Usage: shadcn preset open [options] <code>

open a preset code in the browser

Arguments:
  code        the preset code

Options:
  -h, --help  display help for command
```

---

## view

Use the `view` command to view items from the registry before installing them.

```bash
npx shadcn@latest view [item]
```

You can view multiple items at once:

```bash
npx shadcn@latest view button card dialog
```

Or view items from namespaced registries:

```bash
npx shadcn@latest view @acme/auth @v0/dashboard
```

**Options**

```bash
Usage: shadcn view [options] <items...>

view items from the registry

Arguments:
  items            the item names or URLs to view

Options:
  -c, --cwd <cwd>  the working directory. defaults to the current directory.
  -h, --help       display help for command
```

---

## search

Use the `search` command to search for items from registries.

```bash
npx shadcn@latest search [registry]
```

You can search with a query:

```bash
npx shadcn@latest search @shadcn -q "button"
```

Or search multiple registries at once:

```bash
npx shadcn@latest search @shadcn @v0 @acme
```

The `list` command is an alias for `search`:

```bash
npx shadcn@latest list @acme
```

**Options**

```bash
Usage: shadcn search|list [options] <registries...>

search items from registries

Arguments:
  registries             the registry names or urls to search items from. Names
                         must be prefixed with @.

Options:
  -c, --cwd <cwd>        the working directory. defaults to the current directory.
  -q, --query <query>    query string
  -l, --limit <number>   maximum number of items to display per registry (default: "100")
  -o, --offset <number>  number of items to skip (default: "0")
  -h, --help             display help for command
```

---

## build

Use the `build` command to generate the registry JSON files.

```bash
npx shadcn@latest build
```

This command reads the `registry.json` file and generates the registry JSON
files in the `public/r` directory.

**Options**

```bash
Usage: shadcn build [options] [registry]

build components for a shadcn registry

Arguments:
  registry             path to registry.json file (default: "./registry.json")

Options:
  -o, --output <path>  destination directory for json files (default: "./public/r")
  -c, --cwd <cwd>      the working directory. defaults to the current directory.
  -h, --help           display help for command
```

To customize the output directory, use the `--output` option.

```bash
npx shadcn@latest build --output ./public/registry
```

---

## docs

Use the `docs` command to fetch documentation and API references for components.

```bash
npx shadcn@latest docs [component]
```

**Options**

```bash
Usage: shadcn docs [options] [component]

fetch documentation and API references for components

Arguments:
  component          the component to get docs for

Options:
  -c, --cwd <cwd>    the working directory. defaults to the current directory.
  -b, --base <base>  the base to use either 'base' or 'radix'. defaults to project base.
  --json             output as JSON. (default: false)
  -h, --help         display help for command
```

---

## info

Use the `info` command to get information about your project.

```bash
npx shadcn@latest info
```

**Options**

```bash
Usage: shadcn info [options]

get information about your project

Options:
  -c, --cwd <cwd>  the working directory. defaults to the current directory.
  --json            output as JSON. (default: false)
  -h, --help        display help for command
```

---

## migrate

Use the `migrate` command to run migrations on your project.

```bash
npx shadcn@latest migrate [migration]
```

**Available Migrations**

| Migration | Description                                             |
| --------- | ------------------------------------------------------- |
| `icons`   | Migrate your UI components to a different icon library. |
| `radix`   | Migrate to radix-ui.                                    |
| `rtl`     | Migrate your components to support RTL (right-to-left). |

**Options**

```bash
Usage: shadcn migrate [options] [migration] [path]

run a migration.

Arguments:
  migration        the migration to run.
  path             optional path or glob pattern to migrate.

Options:
  -c, --cwd <cwd>  the working directory. defaults to the current directory.
  -l, --list       list all migrations. (default: false)
  -y, --yes        skip confirmation prompt. (default: false)
  -h, --help       display help for command
```

---

### migrate rtl

The `rtl` migration transforms your components to support RTL (right-to-left)
languages.

```bash
npx shadcn@latest migrate rtl
```

This will:

1. Update `components.json` to set `rtl: true`
2. Transform physical CSS properties to logical equivalents (e.g., `ml-4` →
   `ms-4`, `text-left` → `text-start`)
3. Add `rtl:` variants where needed (e.g., `space-x-4` →
   `space-x-4 rtl:space-x-reverse`)

**Migrate specific files**

You can migrate specific files or use glob patterns:

```bash
# Migrate a specific file
npx shadcn@latest migrate rtl src/components/ui/button.tsx

# Migrate files matching a glob pattern
npx shadcn@latest migrate rtl "src/components/ui/**"
```

If no path is provided, the migration will transform all files in your `ui`
directory (from `components.json`).

---

### migrate radix

The `radix` migration updates your imports from individual `@radix-ui/react-*`
packages to the unified `radix-ui` package.

```bash
npx shadcn@latest migrate radix
```

This will:

1. Transform imports from `@radix-ui/react-*` to `radix-ui`
2. Add the `radix-ui` package to your `package.json`

**Before**

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as SelectPrimitive from "@radix-ui/react-select";
```

**After**

```tsx
import { Dialog as DialogPrimitive, Select as SelectPrimitive } from "radix-ui";
```

**Migrate specific files**

You can migrate specific files or use glob patterns:

```bash
# Migrate a specific file.
npx shadcn@latest migrate radix src/components/ui/dialog.tsx

# Migrate files matching a glob pattern.
npx shadcn@latest migrate radix "src/components/ui/**"
```

If no path is provided, the migration will transform all files in your `ui`
directory (from `components.json`).

Once complete, you can remove any unused `@radix-ui/react-*` packages from your
`package.json`.

---

## eject

When you run `init`, shadcn adds `@import "shadcn/tailwind.css"` to your global
CSS file. This import provides shared Tailwind v4 utilities such as custom
variants (`data-open:`, `data-closed:`, etc.) and accordion animations.

Use the `eject` command to inline `shadcn/tailwind.css` into your global CSS
file and remove the `shadcn` dependency from your project.

<Callout icon={<TriangleAlertIcon />}> **Note: This action is irreversible.**
After ejecting, future shadcn CLI updates to `shadcn/tailwind.css` will not
apply automatically.
</Callout>

```bash
npx shadcn@latest eject
```

**Before**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```

**After**

```css
@import "tailwindcss";
@import "tw-animate-css";
/* ejected from shadcn@4.8.3 */
@theme inline {
    @keyframes accordion-down {
        from {
            height: 0;
        }
        to {
            height: var(
                --radix-accordion-content-height,
                var(--accordion-panel-height, auto)
            );
        }
    }
}

@custom-variant data-open {
    &:where([data-state="open"]),
    &:where([data-open]:not([data-open="false"])) {
        @slot;
    }
}

@utility no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
}
```

**Monorepo**

In a monorepo, run the command from the workspace that contains your
`components.json` and global CSS file:

```bash
npx shadcn@latest eject -c packages/ui
```

**Options**

```bash
Usage: shadcn eject [options]

inline shadcn/tailwind.css and remove the shadcn dependency

Options:
  -c, --cwd <cwd>  the working directory. defaults to the current directory.
  -y, --yes        skip confirmation prompt. (default: false)
  -s, --silent     mute output. (default: false)
  -h, --help       display help for command
```

---
title: Monorepo
description: Using shadcn/ui components and CLI in a monorepo.
---

Until now, using shadcn/ui in a monorepo was a bit of a pain. You could add
components using the CLI, but you had to manage where the components were
installed and manually fix import paths.

With the new monorepo support in the CLI, we've made it a lot easier to use
shadcn/ui in a monorepo.

The CLI now understands the monorepo structure and will install the components,
dependencies and registry dependencies to the correct paths and handle imports
for you.

## Getting started

<Steps>

### Create a new monorepo project

To create a new monorepo project, run the `init` command with the `--monorepo`
flag.

```bash
npx shadcn@latest init --monorepo
```

Then select the template you want to use.

```bash
? Select a template ›
❯   Next.js
    Vite
    TanStack Start
    React Router
    Astro
```

This will create a new monorepo project with two workspaces: `web` and `ui`, and
[Turborepo](https://turbo.build/repo/docs) as the build system.

Everything is set up for you, so you can start adding components to your
project.

### Add components to your project

To add components to your project, run the `add` command **in the path of your
app**.

```bash
cd apps/web
```

```bash
npx shadcn@latest add [COMPONENT]
```

The CLI will figure out what type of component you are adding and install the
correct files to the correct path.

For example, if you run `npx shadcn@latest add button`, the CLI will install the
button component under `packages/ui` and update the import path for components
in `apps/web`.

If you run `npx shadcn@latest add login-01`, the CLI will install the `button`,
`label`, `input` and `card` components under `packages/ui` and the `login-form`
component under `apps/web/components`.

### Importing components

You can import components from the `@workspace/ui` package as follows:

```tsx
import { Button } from "@workspace/ui/components/button";
```

You can also import hooks and utilities from the `@workspace/ui` package.

```tsx
import { useTheme } from "@workspace/ui/hooks/use-theme";
import { cn } from "@workspace/ui/lib/utils";
```

</Steps>

## File Structure

When you create a new monorepo project, the CLI will create the following file
structure:

```txt
apps
└── web         # Your app goes here.
    ├── app
    │   └── page.tsx
    ├── components
    │   └── login-form.tsx
    ├── components.json
    └── package.json
packages
└── ui          # Your components and dependencies are installed here.
    ├── src
    │   ├── components
    │   │   └── button.tsx
    │   ├── hooks
    │   ├── lib
    │   │   └── utils.ts
    │   └── styles
    │       └── globals.css
    ├── components.json
    └── package.json
package.json
turbo.json
```

## Requirements

1. Every workspace must have a `components.json` file. A `package.json` file
   tells npm how to install the dependencies. A `components.json` file tells the
   CLI how and where to install components.

2. The `components.json` file must properly define aliases for the workspace.
   This tells the CLI how to import components, hooks, utilities, etc.

```json showLineNumbers title="apps/web/components.json"
{
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "radix-nova",
    "rsc": true,
    "tsx": true,
    "tailwind": {
        "config": "",
        "css": "../../packages/ui/src/styles/globals.css",
        "baseColor": "neutral",
        "cssVariables": true
    },
    "iconLibrary": "lucide",
    "aliases": {
        "components": "@/components",
        "hooks": "@/hooks",
        "lib": "@/lib",
        "utils": "@workspace/ui/lib/utils",
        "ui": "@workspace/ui/components"
    }
}
```

```json showLineNumbers title="packages/ui/components.json"
{
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "radix-nova",
    "rsc": true,
    "tsx": true,
    "tailwind": {
        "config": "",
        "css": "src/styles/globals.css",
        "baseColor": "neutral",
        "cssVariables": true
    },
    "iconLibrary": "lucide",
    "aliases": {
        "components": "@workspace/ui/components",
        "utils": "@workspace/ui/lib/utils",
        "hooks": "@workspace/ui/hooks",
        "lib": "@workspace/ui/lib",
        "ui": "@workspace/ui/components"
    }
}
```

3. Ensure you have the same `style`, `iconLibrary` and `baseColor` in both
   `components.json` files.

4. **For Tailwind CSS v4, leave the `tailwind` config empty in the
   `components.json` file.**

By following these requirements, the CLI will be able to install ui components,
blocks, libs and hooks to the correct paths and handle imports for you.

<Callout className="mt-6">
  `package.json#imports` works well for package-local aliases inside a
  workspace, for example inside `packages/ui`. For shared workspace imports such
  as `@workspace/ui/components`, keep explicit aliases in `components.json`. The
  CLI uses those aliases to route files across workspace boundaries.
</Callout>

## Using `package.json#imports`

For a monorepo that uses package imports and does not rely on `tsconfig.json`
`paths`, use:

- local `#...` aliases for files inside each workspace
- workspace package `exports` for shared imports such as
  `@workspace/ui/components`

For example, an app workspace can use local package imports:

```json showLineNumbers title="apps/web/package.json"
{
    "name": "web",
    "private": true,
    "type": "module",
    "imports": {
        "#components/*": "./src/components/*.tsx",
        "#lib/*": "./src/lib/*.ts",
        "#hooks/*": "./src/hooks/*.ts"
    },
    "dependencies": {
        "@workspace/ui": "workspace:*"
    }
}
```

```json showLineNumbers title="apps/web/components.json"
{
    "aliases": {
        "components": "#components",
        "ui": "@workspace/ui/components",
        "lib": "#lib",
        "hooks": "#hooks",
        "utils": "@workspace/ui/lib/utils"
    }
}
```

And the shared UI package can expose its install targets with `exports`:

```json showLineNumbers title="packages/ui/package.json"
{
    "name": "@workspace/ui",
    "private": true,
    "type": "module",
    "imports": {
        "#components/*": "./src/components/*.tsx",
        "#lib/*": "./src/lib/*.ts",
        "#hooks/*": "./src/hooks/*.ts"
    },
    "exports": {
        "./globals.css": "./src/styles/globals.css",
        "./components/*": "./src/components/*.tsx",
        "./lib/*": "./src/lib/*.ts",
        "./hooks/*": "./src/hooks/*.ts"
    }
}
```

```json showLineNumbers title="packages/ui/components.json"
{
    "aliases": {
        "components": "#components",
        "ui": "#components",
        "lib": "#lib",
        "hooks": "#hooks",
        "utils": "#lib/utils"
    }
}
```

In this setup:

- files added from the app to the shared UI package are routed through
  `@workspace/ui/...`
- files added inside `packages/ui` use the package-local `#...` aliases
- the shared package must export any path referenced by another workspace

For framework-specific package import setup, see the
[package imports guide](/docs/package-imports).

---
title: Skills
description: Give your AI assistant deep knowledge of shadcn/ui components, patterns, and best practices.
---

Skills give AI assistants like Claude Code project-aware context about
shadcn/ui. When installed, your AI assistant knows how to find, install,
compose, and customize components using the correct APIs and patterns for your
project.

For example, you can ask your AI assistant to:

- _"Add a login form with email and password fields."_
- _"Create a settings page with a form for updating profile information."_
- _"Build a dashboard with a sidebar, stats cards, and a data table."_
- _"Switch to --preset [CODE]"_
- _"Can you add a hero from @tailark?"_

The skill reads your project's `components.json` and provides the assistant with
your framework, aliases, installed components, icon library, and base library so
it can generate correct code on the first try.

---

## Install

```bash
npx skills add shadcn/ui
```

This installs the shadcn skill into your project. Once installed, your AI
assistant automatically loads it when working with shadcn/ui components.

Learn more about skills at [skills.sh](https://skills.sh).

---

## What's Included

The skill provides your AI assistant with the following knowledge:

### Project Context

On every interaction, the skill runs `shadcn info --json` to get your project's
configuration: framework, Tailwind version, aliases, base library (`radix` or
`base`), icon library, installed components, and resolved file paths.

### CLI Commands

Full reference for all CLI commands: `init`, `add`, `search`, `view`, `docs`,
`diff`, `info`, and `build`. Includes flags, dry-run mode, smart merge
workflows, presets, and templates.

### Theming and Customization

How CSS variables, OKLCH colors, dark mode, custom colors, border radius, and
component variants work. Includes guidance for both Tailwind v3 and v4.

### Registry Authoring

How to build and publish custom component registries: `registry.json` format,
item types, file objects, dependencies, CSS variables, building, hosting, and
user configuration.

### MCP Server

Setup and tools for the shadcn MCP server, which lets AI assistants search,
browse, and install components from registries.

---

## How It Works

1. **Project detection** — The skill activates when it finds a `components.json`
   file in your project.
2. **Context injection** — It runs `shadcn info --json` to read your project
   configuration and injects the result into the assistant's context.
3. **Pattern enforcement** — The assistant follows shadcn/ui composition rules:
   using `FieldGroup` for forms, `ToggleGroup` for option sets, semantic colors,
   and correct base-specific APIs.
4. **Component discovery** — The assistant uses `shadcn docs`, `shadcn search`,
   or MCP tools to find components and their documentation before generating
   code.

## Learn More

- [CLI](/docs/cli) — Full CLI command reference
- [MCP Server](/docs/mcp) — Connect the MCP server for registry access
- [Theming](/docs/theming) — CSS variables and customization
- [Registry](/docs/registry) — Building and publishing custom registries
- [skills.sh](https://skills.sh) — Learn more about AI skills

---
title: JavaScript
description: How to use shadcn/ui with JavaScript
---

This project and the components are written in TypeScript. We recommend using
TypeScript for your project as well.

However we provide a JavaScript version of the components as well. The
JavaScript version is available via the [cli](/docs/cli).

To opt-out of TypeScript, you can use the `tsx` flag in your `components.json`
file.

```json {4} title="components.json" showLineNumbers
{
    "style": "new-york",
    "rsc": false,
    "tsx": false,
    "tailwind": {
        "config": "",
        "css": "src/app/globals.css",
        "baseColor": "zinc",
        "cssVariables": true
    },
    "iconLibrary": "lucide",
    "aliases": {
        "components": "@/components",
        "utils": "@/lib/utils",
        "ui": "@/components/ui",
        "lib": "@/lib",
        "hooks": "@/hooks"
    }
}
```

To configure import aliases, you can use the following `jsconfig.json`:

```json {4} title="jsconfig.json" showLineNumbers
{
    "compilerOptions": {
        "paths": {
            "@/*": ["./*"]
        }
    }
}
```

---
title: Figma
description: Every component recreated in Figma. With customizable props, typography and icons.
---

<Callout>
  **Note:** The Figma files are contributed by the community. If you have any
  questions or feedback, please reach out to the Figma file maintainers.
</Callout>

## Free

- [shadcn/ui components](https://www.figma.com/community/file/1342715840824755935)
  by [Sitsiilia Bergmann](https://x.com/sitsiilia) - A well-structured component
  library aligned with the shadcn component system, regularly maintained.
- [shadcn/ui design system](https://www.figma.com/community/file/1203061493325953101)
  by [Pietro Schirano](https://twitter.com/skirano) - A design companion for
  shadcn/ui. Each component was painstakingly crafted to perfectly match the
  code implementation.

## Paid

- [shadcn/ui kit](https://shadcndesign.com) by
  [Matt Wierzbicki](https://x.com/matsugfx) - A premium, always up-to-date UI
  kit for Figma - shadcn/ui compatible and optimized for smooth design-to-dev
  handoff.
- [shadcncraft Design System](https://shadcncraft.com) - Production-ready
  shadcn/ui kit with Pro React blocks and 1:1 Figma alignment. Design and ship
  faster with tweakcn theming, AI-assisted workflows, and Figma to React export,
  built for real product UIs.
- [shadcn/studio UI Kit](https://shadcnstudio.com/figma) - Accelerate design &
  development with a shadcn/ui compatible Figma kit with updated components,
  550+ blocks, 10+ templates, 20+ themes, and an AI tool that converts designs
  into shadcn/ui code.
- [Shadcnblocks.com](https://www.shadcnblocks.com) - A Premium Shadcn Figma UI
  Kit with components, 500+ pro blocks, shadcn theme variables, light/dark mode
  and Figma MCP ready.
- [Obra shadcn/ui Pro](https://shadcn.obra.studio/products/obra-shadcn-ui-pro)
  by [Obra Studio](https://obra.studio/) - Focused on designers who need to get
  work done — the best designer experience for shadcn/ui within Figma. variable
  consistency with shadcn, plus custom components, Pro blocks, and a
  design-to-code plugin.
- [Shadcn Space](https://shadcnspace.com/figma) - A collection of beautifully
  designed 320+ blocks, 9+ templates, and 250+ components with a
  shadcn/ui-compatible Figma kit built for modern React and Next.js workflows.
  Design, prototype, and ship faster using Figma components that mirror real
  code architecture and production-ready implementation patterns.

# shadcn/ui

> shadcn/ui is a collection of beautifully-designed, accessible components and a
> code distribution platform. It is built with TypeScript, Tailwind CSS, and
> Radix UI primitives. It supports multiple frameworks including Next.js, Vite,
> Remix, Astro, and more. Open Source. Open Code. AI-Ready. It also comes with a
> command-line tool to install and manage components and a registry system to
> publish and distribute code.

## Overview

- [Introduction](https://ui.shadcn.com/docs): Core principles—Open Code,
  Composition, Distribution, Beautiful Defaults, and AI-Ready design.
- [CLI](https://ui.shadcn.com/docs/cli): Command-line tool for installing and
  managing components.
- [components.json](https://ui.shadcn.com/docs/components-json): Configuration
  file for customizing the CLI and component installation.
- [Theming](https://ui.shadcn.com/docs/theming): Guide to customizing colors,
  typography, and design tokens.
- [Changelog](https://ui.shadcn.com/docs/changelog): Release notes and version
  history.
- [Skills](https://ui.shadcn.com/docs/skills): Deep shadcn/ui knowledge for AI
  assistants like Claude Code.
- [Directory](https://ui.shadcn.com/docs/directory): Community registries built
  into the CLI.

## Installation

- [Next.js](https://ui.shadcn.com/docs/installation/next): Install shadcn/ui in
  a Next.js project.
- [Vite](https://ui.shadcn.com/docs/installation/vite): Install shadcn/ui in a
  Vite project.
- [Remix](https://ui.shadcn.com/docs/installation/remix): Install shadcn/ui in a
  Remix project.
- [Astro](https://ui.shadcn.com/docs/installation/astro): Install shadcn/ui in
  an Astro project.
- [Laravel](https://ui.shadcn.com/docs/installation/laravel): Install shadcn/ui
  in a Laravel project.
- [Gatsby](https://ui.shadcn.com/docs/installation/gatsby): Install shadcn/ui in
  a Gatsby project.
- [React Router](https://ui.shadcn.com/docs/installation/react-router): Install
  shadcn/ui in a React Router project.
- [TanStack Router](https://ui.shadcn.com/docs/installation/tanstack-router):
  Install shadcn/ui in a TanStack Router project.
- [TanStack Start](https://ui.shadcn.com/docs/installation/tanstack): Install
  shadcn/ui in a TanStack Start project.
- [Manual Installation](https://ui.shadcn.com/docs/installation/manual):
  Manually install shadcn/ui without the CLI.

## Components

### Form & Input

- [Field](https://ui.shadcn.com/docs/components/field): Field component for form
  inputs with labels and error messages.
- [Button](https://ui.shadcn.com/docs/components/button): Button component with
  multiple variants.
- [Button Group](https://ui.shadcn.com/docs/components/button-group): Group
  multiple buttons together.
- [Input](https://ui.shadcn.com/docs/components/input): Text input component.
- [Input Group](https://ui.shadcn.com/docs/components/input-group): Input
  component with prefix and suffix addons.
- [Input OTP](https://ui.shadcn.com/docs/components/input-otp): One-time
  password input component.
- [Textarea](https://ui.shadcn.com/docs/components/textarea): Multi-line text
  input component.
- [Checkbox](https://ui.shadcn.com/docs/components/checkbox): Checkbox input
  component.
- [Radio Group](https://ui.shadcn.com/docs/components/radio-group): Radio button
  group component.
- [Select](https://ui.shadcn.com/docs/components/select): Select dropdown
  component.
- [Native Select](https://ui.shadcn.com/docs/components/native-select): Styled
  native HTML select element.
- [Switch](https://ui.shadcn.com/docs/components/switch): Toggle switch
  component.
- [Slider](https://ui.shadcn.com/docs/components/slider): Slider input
  component.
- [Calendar](https://ui.shadcn.com/docs/components/calendar): Calendar component
  for date selection.
- [Date Picker](https://ui.shadcn.com/docs/components/date-picker): Date picker
  component combining input and calendar.
- [Combobox](https://ui.shadcn.com/docs/components/combobox): Searchable select
  component with autocomplete.
- [Label](https://ui.shadcn.com/docs/components/label): Form label component.

### Layout & Navigation

- [Accordion](https://ui.shadcn.com/docs/components/accordion): Collapsible
  accordion component.
- [Breadcrumb](https://ui.shadcn.com/docs/components/breadcrumb): Breadcrumb
  navigation component.
- [Navigation Menu](https://ui.shadcn.com/docs/components/navigation-menu):
  Accessible navigation menu with dropdowns.
- [Sidebar](https://ui.shadcn.com/docs/components/sidebar): Collapsible sidebar
  component for app layouts.
- [Tabs](https://ui.shadcn.com/docs/components/tabs): Tabbed interface
  component.
- [Separator](https://ui.shadcn.com/docs/components/separator): Visual divider
  between content sections.
- [Scroll Area](https://ui.shadcn.com/docs/components/scroll-area): Custom
  scrollable area with styled scrollbars.
- [Resizable](https://ui.shadcn.com/docs/components/resizable): Resizable panel
  layout component.

### Overlays & Dialogs

- [Dialog](https://ui.shadcn.com/docs/components/dialog): Modal dialog
  component.
- [Alert Dialog](https://ui.shadcn.com/docs/components/alert-dialog): Alert
  dialog for confirmation prompts.
- [Sheet](https://ui.shadcn.com/docs/components/sheet): Slide-out panel
  component (drawer).
- [Drawer](https://ui.shadcn.com/docs/components/drawer): Mobile-friendly drawer
  component using Vaul.
- [Popover](https://ui.shadcn.com/docs/components/popover): Floating popover
  component.
- [Tooltip](https://ui.shadcn.com/docs/components/tooltip): Tooltip component
  for additional context.
- [Hover Card](https://ui.shadcn.com/docs/components/hover-card): Card that
  appears on hover.
- [Context Menu](https://ui.shadcn.com/docs/components/context-menu):
  Right-click context menu.
- [Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu): Dropdown
  menu component.
- [Menubar](https://ui.shadcn.com/docs/components/menubar): Horizontal menubar
  component.
- [Command](https://ui.shadcn.com/docs/components/command): Command palette
  component (cmdk).

### Feedback & Status

- [Alert](https://ui.shadcn.com/docs/components/alert): Alert component for
  messages and notifications.
- [Toast](https://ui.shadcn.com/docs/components/toast): Toast notification
  component using Sonner.
- [Sonner](https://ui.shadcn.com/docs/components/sonner): Opinionated toast
  component for React.
- [Progress](https://ui.shadcn.com/docs/components/progress): Progress bar
  component.
- [Spinner](https://ui.shadcn.com/docs/components/spinner): Loading spinner
  component.
- [Skeleton](https://ui.shadcn.com/docs/components/skeleton): Skeleton loading
  placeholder.
- [Badge](https://ui.shadcn.com/docs/components/badge): Badge component for
  labels and status indicators.
- [Empty](https://ui.shadcn.com/docs/components/empty): Empty state component
  for no data scenarios.

### Display & Media

- [Avatar](https://ui.shadcn.com/docs/components/avatar): Avatar component for
  user profiles.
- [Card](https://ui.shadcn.com/docs/components/card): Card container component.
- [Table](https://ui.shadcn.com/docs/components/table): Table component for
  displaying data.
- [Data Table](https://ui.shadcn.com/docs/components/data-table): Advanced data
  table with sorting, filtering, and pagination.
- [Chart](https://ui.shadcn.com/docs/components/chart): Chart components using
  Recharts.
- [Carousel](https://ui.shadcn.com/docs/components/carousel): Carousel component
  using Embla Carousel.
- [Aspect Ratio](https://ui.shadcn.com/docs/components/aspect-ratio): Container
  that maintains aspect ratio.
- [Typography](https://ui.shadcn.com/docs/components/typography): Typography
  styles and components.
- [Item](https://ui.shadcn.com/docs/components/item): Generic item component for
  lists and menus.
- [Kbd](https://ui.shadcn.com/docs/components/kbd): Keyboard shortcut display
  component.

### Misc

- [Collapsible](https://ui.shadcn.com/docs/components/collapsible): Collapsible
  container component.
- [Toggle](https://ui.shadcn.com/docs/components/toggle): Toggle button
  component.
- [Toggle Group](https://ui.shadcn.com/docs/components/toggle-group): Group of
  toggle buttons.
- [Pagination](https://ui.shadcn.com/docs/components/pagination): Pagination
  component for lists and tables.
- [Direction](https://ui.shadcn.com/docs/components/direction): Text direction
  provider for RTL support.

## Dark Mode

- [Dark Mode](https://ui.shadcn.com/docs/dark-mode): Overview of dark mode
  implementation.
- [Dark Mode - Next.js](https://ui.shadcn.com/docs/dark-mode/next): Dark mode
  setup for Next.js.
- [Dark Mode - Vite](https://ui.shadcn.com/docs/dark-mode/vite): Dark mode setup
  for Vite.
- [Dark Mode - Astro](https://ui.shadcn.com/docs/dark-mode/astro): Dark mode
  setup for Astro.
- [Dark Mode - Remix](https://ui.shadcn.com/docs/dark-mode/remix): Dark mode
  setup for Remix.

## RTL

- [RTL](https://ui.shadcn.com/docs/rtl): Overview of right-to-left language
  support.
- [RTL - Next.js](https://ui.shadcn.com/docs/rtl/next): RTL setup for Next.js.
- [RTL - Vite](https://ui.shadcn.com/docs/rtl/vite): RTL setup for Vite.
- [RTL - TanStack Start](https://ui.shadcn.com/docs/rtl/start): RTL setup for
  TanStack Start.

## Forms

- [Forms Overview](https://ui.shadcn.com/docs/forms): Guide to building forms
  with shadcn/ui.
- [React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form): Using
  shadcn/ui with React Hook Form.
- [TanStack Form](https://ui.shadcn.com/docs/forms/tanstack-form): Using
  shadcn/ui with TanStack Form.
- [Formisch](https://ui.shadcn.com/docs/forms/formisch): Using shadcn/ui with
  Formisch.
- [Forms - Next.js](https://ui.shadcn.com/docs/forms/next): Building forms in
  Next.js with Server Actions.

## Advanced

- [Monorepo](https://ui.shadcn.com/docs/monorepo): Using shadcn/ui in a monorepo
  setup.
- [React 19](https://ui.shadcn.com/docs/react-19): React 19 support and
  migration guide.
- [Tailwind CSS v4](https://ui.shadcn.com/docs/tailwind-v4): Tailwind CSS v4
  support and setup.
- [JavaScript](https://ui.shadcn.com/docs/javascript): Using shadcn/ui with
  JavaScript (no TypeScript).
- [Figma](https://ui.shadcn.com/docs/figma): Figma design resources.
- [v0](https://ui.shadcn.com/docs/v0): Generating UI with v0 by Vercel.

## MCP Server

- [MCP Server](https://ui.shadcn.com/docs/mcp): Model Context Protocol server
  for AI integrations. Allows AI assistants to browse, search, and install
  components from registries using natural language. Works with Claude Code,
  Cursor, VS Code (GitHub Copilot), Codex and more.

## Registry

- [Registry Overview](https://ui.shadcn.com/docs/registry): Creating and
  publishing your own component registry.
- [Getting Started](https://ui.shadcn.com/docs/registry/getting-started): Set up
  your own registry.
- [Examples](https://ui.shadcn.com/docs/registry/examples): Example registries.
- [FAQ](https://ui.shadcn.com/docs/registry/faq): Common questions about
  registries.
- [Authentication](https://ui.shadcn.com/docs/registry/authentication): Adding
  authentication to your registry.
- [Registry MCP](https://ui.shadcn.com/docs/registry/mcp): MCP integration for
  registries.
- [Namespaces](https://ui.shadcn.com/docs/registry/namespace): Using multiple
  registries with namespace support.
- [Add a Registry](https://ui.shadcn.com/docs/registry/registry-index): Open
  source registry index and how to submit yours.
- [Open in v0](https://ui.shadcn.com/docs/registry/open-in-v0): Integrating your
  registry with Open in v0.
- [registry.json](https://ui.shadcn.com/docs/registry/registry-json):
  `registry.json` schema for your own registry.
- [registry-item.json](https://ui.shadcn.com/docs/registry/registry-item-json):
  `registry-item.json` specification for registry items.

### Registry Schemas

- [Registry Schema](https://ui.shadcn.com/schema/registry.json): JSON Schema for
  registry index files. Defines the structure for a collection of components,
  hooks, pages, etc. Requires name, homepage, and items array.
- [Registry Item Schema](https://ui.shadcn.com/schema/registry-item.json): JSON
  Schema for individual registry items. Defines components, hooks, themes, and
  other distributable code with properties for dependencies, files, Tailwind
  config, CSS variables, and more.

---
title: Introduction
description: Run your own code registry.
---

You can use the `shadcn` CLI to run your own code registry. Running your own
registry allows you to distribute your custom components, hooks, pages, config,
rules and other files to any project.

<Callout>
  **Note:** The registry works with any project type and any framework, and is
  not limited to React.
</Callout>

<figure className="flex flex-col gap-4">
  <Image
    src="/images/registry-light.png"
    width="1432"
    height="960"
    alt="Registry"
    className="mt-6 w-full overflow-hidden rounded-lg border dark:hidden"
  />
  <Image
    src="/images/registry-dark.png"
    width="1432"
    height="960"
    alt="Registry"
    className="mt-6 hidden w-full overflow-hidden rounded-lg border shadow-sm dark:block"
  />
  <figcaption className="text-center text-sm text-gray-500">
    A distribution system for code
  </figcaption>
</figure>

Ready to create your own registry? In the next section, we'll walk you through
setting up your own custom registry step-by-step, from creating your first
component to publishing it for others to use.

<div className="mt-6 grid gap-4 sm:grid-cols-2">
<LinkedCard
  href="/docs/registry/getting-started"
  className="items-start text-sm md:p-6"
>
  <div className="font-medium">Getting Started</div>
  <div className="text-muted-foreground">
    Set up and build your own registry
  </div>
</LinkedCard>

<LinkedCard href="/docs/registry/github" className="items-start text-sm md:p-6">
  <div className="font-medium">GitHub</div>
  <div className="text-muted-foreground">
    Turn a GitHub repository into a registry
  </div>
</LinkedCard>

<LinkedCard href="/docs/registry/namespace" className="items-start text-sm
md:p-6"



<div className="font-medium">Namespaces</div>
  <div className="text-muted-foreground">
    Configure registries with namespaces
  </div>
</LinkedCard>

<LinkedCard href="/docs/registry/authentication" className="items-start text-sm
md:p-6"



<div className="font-medium">Authentication</div>
  <div className="text-muted-foreground">
    Secure your registry with authentication
  </div>
</LinkedCard>

<LinkedCard href="/docs/registry/examples" className="items-start text-sm
md:p-6"



<div className="font-medium">Examples</div>
  <div className="text-muted-foreground">Browse example registry items</div>
</LinkedCard>

<LinkedCard href="/docs/registry/registry-json" className="items-start text-sm
md:p-6"



<div className="font-medium">Schema</div>
  <div className="text-muted-foreground">
    Schema specification for registry.json
  </div>
</LinkedCard>
</div>

---
title: Getting Started
description: Learn how to get setup and run your own component registry.
---

This guide will walk you through the process of setting up your own registry. It
assumes you already have a project with components, hooks, utilities or other
files you would like to distribute.

**If you have an existing public GitHub repository, you can turn it into a
registry by adding a `registry.json` file at the root.** See
[GitHub Registries](/docs/registry/github) for details.

If you're starting a new registry project, you can use the
[registry template](https://github.com/shadcn-ui/registry-template) as a
starting point. We have already configured it for you.

## Requirements

You are free to design and publish your custom registry as you see fit. The only
requirement is that your registry catalog and registry items must conform to the
[registry schema specification](/docs/registry/registry-json) and
[registry-item schema specification](/docs/registry/registry-item-json).

Your registry can be a Next.js, Vite, Vue, Svelte, PHP or any other framework as
long as it supports serving JSON over HTTP. It can also be a public GitHub
repository with a `registry.json` file at the root.

If you'd like to see an example of a registry, we have a
[template project](https://github.com/shadcn-ui/registry-template) for you to
use as a starting point.

## registry.json

The `registry.json` is the entry point for the registry. It contains the
registry's name, homepage, and defines all the items present in the registry.

Your registry must have this file (or JSON payload) present at the root of the
registry endpoint. The registry endpoint is the URL where your registry is
hosted.

Here's an example `registry.json` file:

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme",
    "homepage": "https://acme.com",
    "items": [
        {
            "name": "button",
            "type": "registry:ui",
            "title": "Button",
            "description": "A simple button component.",
            "files": [
                {
                    "path": "components/ui/button.tsx",
                    "type": "registry:ui"
                }
            ]
        }
    ]
}
```

## Structure your registry

You can structure your source registry in one of two ways:

- Define all items in a single root `registry.json`.
- Use a root `registry.json` with `include` to compose multiple `registry.json`
  files.

### Option A: Single registry.json

Create a `registry.json` file in the root of your project. Add all your registry
items to the `items` array. This is the simplest way to define a registry.

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme",
    "homepage": "https://acme.com",
    "items": [
        {
            "name": "button",
            "type": "registry:ui",
            "title": "Button",
            "description": "A simple button component.",
            "files": [
                {
                    "path": "components/ui/button.tsx",
                    "type": "registry:ui"
                }
            ]
        },
        {
            "name": "hello-world",
            "type": "registry:block",
            "title": "Hello World",
            "description": "A simple hello world component.",
            "registryDependencies": ["button"],
            "files": [
                {
                    "path": "registry/default/hello-world/hello-world.tsx",
                    "type": "registry:component"
                }
            ]
        }
    ]
}
```

This `registry.json` file must conform to the
[registry schema specification](/docs/registry/registry-json).

### Option B: Using include

For larger registries, you can use `include` to compose your source registry
from multiple `registry.json` files.

```txt
registry.json
components
└── ui
    ├── button.tsx
    ├── input.tsx
    └── registry.json
hooks
├── registry.json
├── use-media-query.ts
└── use-toggle.ts
```

The root `registry.json` defines the registry metadata and includes the nested
registry files.

{/* prettier-ignore */}

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme",
    "homepage": "https://acme.com",
    "include": [
        "components/ui/registry.json",
        "hooks/registry.json"
    ]
}
```

Included `registry.json` files are valid registry files for composition and may
omit `name` and `homepage`. Only the root `registry.json` must define the
registry metadata.

```json title="components/ui/registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "items": [
        {
            "name": "button",
            "type": "registry:ui",
            "files": [
                {
                    "path": "button.tsx",
                    "type": "registry:ui"
                }
            ]
        },
        {
            "name": "input",
            "type": "registry:ui",
            "files": [
                {
                    "path": "input.tsx",
                    "type": "registry:ui"
                }
            ]
        }
    ]
}
```

```json title="hooks/registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "items": [
        {
            "name": "use-toggle",
            "type": "registry:hook",
            "files": [
                {
                    "path": "use-toggle.ts",
                    "type": "registry:hook"
                }
            ]
        },
        {
            "name": "use-media-query",
            "type": "registry:hook",
            "files": [
                {
                    "path": "use-media-query.ts",
                    "type": "registry:hook"
                }
            ]
        }
    ]
}
```

When using `include`, file paths are relative to the `registry.json` file that
declares the item.

## Add an item

### Create a UI component

Add your first item. Here's an example of a simple `<Button />` component:

```tsx title="components/ui/button.tsx" showLineNumbers
import * as React from "react";

export function Button(props: React.ComponentProps<"button">) {
    return (
        <button
            {...props}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        />
    );
}
```

<Callout className="mt-6">
  **Note:** This example places the component in the `components/ui` directory.
  You can place it anywhere in your project as long as you set the correct path
  in the `registry.json` file.
</Callout>

```txt
components
└── ui
    └── button.tsx
```

### Add the item to the registry

To add your component to the registry, add an item definition to
`registry.json`. If you are using `include`, add the item to the included
`registry.json` file that owns the component. For example, add a UI component to
`components/ui/registry.json`.

```json title="registry.json" showLineNumbers {6-17}
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme",
    "homepage": "https://acme.com",
    "items": [
        {
            "name": "button",
            "type": "registry:ui",
            "title": "Button",
            "description": "A simple button component.",
            "files": [
                {
                    "path": "components/ui/button.tsx",
                    "type": "registry:ui"
                }
            ]
        }
    ]
}
```

You define your registry item by adding a `name`, `type`, `title`, `description`
and `files`.

For every file you add, you must specify the `path` and `type` of the file. In a
single-file registry, the `path` is relative to the root of your project. When
using `include`, the `path` is relative to the `registry.json` file that
declares the item. The `type` is the type of the file.

You can read more about the registry item schema and file types in the
[registry item schema docs](/docs/registry/registry-item-json).

## Serve your registry

You can serve your registry as static JSON files or from dynamic route handlers.

### Option A: Static JSON files

Run the build command to generate static registry JSON files.

```bash
npx shadcn@latest build
```

If your source registry uses `include`, `shadcn build` resolves the included
registries and writes a flattened registry to your output directory. The
generated `registry.json` does not contain `include`.

<Callout className="mt-6">
  **Note:** By default, the build command will generate the registry JSON files
  in `public/r` e.g `public/r/button.json`. You can change the output directory by passing the `--output` option. See the [shadcn build command](/docs/cli#build) for more information.

</Callout>

If you're running your registry on Next.js, you can serve these files by running
the `next` server. The command might differ for other frameworks.

```bash
npm run dev
```

Your files will now be served at `http://localhost:3000/r/[NAME].json` eg.
`http://localhost:3000/r/button.json`.

### Option B: Dynamic route handlers

If you want to serve registry JSON from your source `registry.json` at request
time, use the producer-side loader APIs from `shadcn/registry`.

Install `shadcn` as a runtime dependency:

```bash
npm install shadcn
```

Use `loadRegistry` to serve the registry catalog.

```ts title="app/r/registry.json/route.ts" showLineNumbers
import { loadRegistry } from "shadcn/registry";

export async function GET() {
    try {
        const registry = await loadRegistry();

        return Response.json(registry);
    } catch (error) {
        console.error(error);

        return Response.json({ error: "Failed to load registry." }, {
            status: 500,
        });
    }
}
```

Use `loadRegistryItem` to serve individual registry items.

```ts title="app/r/[name].json/route.ts" showLineNumbers
import { loadRegistryItem, RegistryItemNotFoundError } from "shadcn/registry";

export async function GET(
    _request: Request,
    context: {
        params: Promise<{
            name: string;
        }>;
    },
) {
    const { name } = await context.params;

    try {
        const item = await loadRegistryItem(name);

        return Response.json(item);
    } catch (error) {
        if (error instanceof RegistryItemNotFoundError) {
            return Response.json(
                { error: `Registry item "${name}" was not found.` },
                { status: 404 },
            );
        }

        console.error(error);

        return Response.json(
            { error: "Failed to load registry item." },
            { status: 500 },
        );
    }
}
```

Both loaders resolve `include` before returning JSON, so route handlers can use
the same source `registry.json` structure without running `shadcn build`.

<Accordion type="single" collapsible>
  <AccordionItem value="content-negotiation">
    <AccordionTrigger>Content negotiation</AccordionTrigger>
    <AccordionContent>

The `shadcn` CLI supports **HTTP Content Negotiation**. This allows you to host
your registry at any endpoint — including the root of your domain — and serve
different content depending on who is asking.

From a single URL, you can serve:

<ul>
  <li>
    <strong>HTML</strong> to browsers — a landing page, documentation, or
    marketing site.
  </li>
  <li>
    <strong>JSON</strong> to the <code>shadcn</code> CLI — an installable
    registry item.
  </li>
  <li>
    <strong>Markdown</strong> to AI agents and LLMs — a machine-readable version
    of your content.
  </li>
</ul>

The client signals its preference using the `Accept` request header, and your
server decides what to return.

#### Request headers

When the CLI makes a request to a registry, it sends the following headers:

- **User-Agent**: `shadcn`
- **Accept**: `application/vnd.shadcn.v1+json, application/json;q=0.9`

#### Root hosting

By checking these headers on your server, you can route CLI traffic to an
installable registry item while keeping browser traffic flowing to your
documentation or homepage.

The examples below assume your built registry item is served at `/r/index.json`.
Adjust the path to match your output.

In Next.js, express this as a rewrite in `next.config.ts`. This keeps the
negotiation in the routing layer and avoids a Proxy function for this static
rewrite:

```typescript title="next.config.ts" showLineNumbers
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: "/",
                    has: [
                        {
                            type: "header",
                            key: "accept",
                            value:
                                "(.*)application/vnd\\.shadcn\\.v1\\+json(.*)",
                        },
                    ],
                    destination: "/r/index.json",
                },
                {
                    source: "/",
                    has: [
                        {
                            type: "header",
                            key: "user-agent",
                            value: "shadcn",
                        },
                    ],
                    destination: "/r/index.json",
                },
            ],
        };
    },
    async headers() {
        return [
            {
                source: "/",
                headers: [{ key: "Vary", value: "Accept, User-Agent" }],
            },
        ];
    },
};

export default nextConfig;
```

Or, in an Express.js server:

```javascript title="server.js" showLineNumbers
app.get("/", (req, res) => {
    res.vary("Accept");
    res.vary("User-Agent");

    // Check if the client prefers the shadcn vendor type.
    if (req.accepts("application/vnd.shadcn.v1+json")) {
        return res.json(registryData);
    }

    // Optional: Secondary check for the User-Agent.
    if (req.get("User-Agent") === "shadcn") {
        return res.json(registryData);
    }

    // Otherwise, serve your documentation or homepage.
    res.send(htmlContent);
});
```

This enables:

<ul>
  <li>
    <strong>Branded Registry URLs</strong>:{" "}
    <code>shadcn add https://ui.example.com</code>
  </li>
  <li>
    <strong>Shorter URLs</strong>: Users type your domain root, not{" "}
    <code>/r/</code> or <code>/registry/</code> sub-paths.
  </li>
  <li>
    <strong>Easy Mnemonics</strong>: Easier for users to remember and share your
    registry.
  </li>
</ul>

      </AccordionContent>

    </AccordionItem>

</Accordion>

## Test your registry

After your registry is being served, test it with the same CLI commands that
other developers will use.

### Using URL

Use the catalog URL for commands that discover items, like `list` and `search`.
Use item URLs for commands that read or install a specific item, like `view` and
`add`.

#### List items

Start by confirming that the registry catalog can be discovered.

```bash
npx shadcn@latest list http://localhost:3000/r/registry.json
```

#### Search items

Search the registry by query.

```bash
npx shadcn@latest search http://localhost:3000/r/registry.json --query button
```

#### View an item

Then view one registry item by name.

```bash
npx shadcn@latest view http://localhost:3000/r/button.json
```

#### Add an item

To test the install flow, run `add` from a project where you want to install the
item.

```bash
npx shadcn@latest add http://localhost:3000/r/button.json
```

### Using namespace

#### Add the registry

You can also test your registry with a namespace. From a project with a
`components.json` file, add your registry URL template to the project.

```bash
npx shadcn@latest registry add @acme=http://localhost:3000/r/{name}.json
```

The `{name}` placeholder must resolve to an item JSON file. For example,
`@acme/button` resolves to `http://localhost:3000/r/button.json`. The catalog is
still served separately at `http://localhost:3000/r/registry.json`.

#### List items

Then list the items in your registry.

```bash
npx shadcn@latest list @acme
```

#### Search items

Search the registry by query.

```bash
npx shadcn@latest search @acme --query button
```

#### View an item

View one registry item by name.

```bash
npx shadcn@latest view @acme/button
```

#### Add an item

To test the install flow, run `add` from a project where you want to install the
item.

```bash
npx shadcn@latest add @acme/button
```

See the [Namespaced Registries](/docs/registry/namespace) docs for more
information.

## Publish your registry

To make your registry available to other developers, publish your project to a
public URL. Once deployed, users can install items directly from item URLs, or
they can add your registry as a namespace in their project.

### Share namespace setup instructions

If you want users to install items with a namespace like `@acme/button`, tell
them to add your registry URL template to their project. The `{name}`
placeholder is replaced by the item name when the CLI resolves the registry
item.

The template must resolve to item JSON files. For example, `@acme/button`
resolves to `https://acme.com/r/button.json`. Your registry catalog should still
be served separately at `https://acme.com/r/registry.json`.

They can add the namespace with the CLI.

```bash
npx shadcn@latest registry add @acme=https://acme.com/r/{name}.json
```

Or they can add it manually under the `registries` field in their
`components.json` file.

```json title="components.json" showLineNumbers
{
    "registries": {
        "@acme": "https://acme.com/r/{name}.json"
    }
}
```

Users can then consume items from your registry by namespace.

```bash
npx shadcn@latest add @acme/button
```

### Add your namespace to the registry index

If your registry is open source and publicly available, you can submit your
namespace to the official registry index. This lets users add your namespace by
name instead of pasting the full URL template.

See the [Registry Index](/docs/registry/registry-index) docs for the submission
requirements.

## Guidelines

Here are some guidelines to follow when building components for a registry.

- Place your registry item in the `registry/[STYLE]/[NAME]` directory. I'm using
  `default` as an example. It can be anything you want as long as it's nested
  under the `registry` directory.
- For blocks, the following properties are required: `name`, `description`,
  `type` and `files`.
- It is recommended to add a proper name and description to your registry item.
  This helps LLMs understand the component and its purpose.
- Make sure to list all registry dependencies in `registryDependencies`. A
  registry dependency is an item address such as `button`, `@acme/input-form`,
  `acme/ui/button` or `http://localhost:3000/r/editor.json`.
- Make sure to list all dependencies in `dependencies`. A dependency is the name
  of the package in the registry eg. `zod`, `sonner`, etc. To set a version, you
  can use the `name@version` format eg. `zod@^3.20.0`.
- **Imports should always use the `@/registry` path.** eg.
  `import { HelloWorld } from "@/registry/default/hello-world/hello-world"`
- Ideally, place your files within a registry item in `components`, `hooks`,
  `lib` directories.

---
title: GitHub Registries
description: Use a public GitHub repository as a registry.
---

You can now turn **any public GitHub repository into a registry.**

Add a `registry.json` file to the root of the repo, describe the files you want
to share, and users can install them with the `shadcn` CLI.

```bash
npx shadcn@latest add <username>/<repo>/<item>
```

You do not need to set up a registry server or publish generated JSON files.
**The GitHub repository becomes the source registry.**

## Distribute Anything

Registry items are **not limited to components or React code.** They can include
any files from your repository: source files, configuration, docs, templates,
workflows, rules or project conventions.

<div className="not-prose my-6 overflow-hidden rounded-lg border text-sm">
  <div className="hidden grid-cols-[220px_1fr] border-b bg-muted/50 px-4 py-3 font-medium md:grid">
    <div>Use case</div>
    <div>Example files</div>
  </div>
  {[
    ["Components", "components/date-picker.tsx", "components/data-table.tsx"],
    [
      "Helpers and utilities",
      "lib/format-date.ts",
      "lib/cn.ts",
      "hooks/use-copy.ts",
    ],
    [
      "Design system packages",
      "tokens/colors.json",
      "styles/theme.css",
      "components/*",
    ],
    [
      "Feature kits",
      "app/(auth)/*",
      "lib/auth.ts",
      "components/login-form.tsx",
    ],
    ["Agent workflows", "AGENTS.md", ".cursor/rules/*", ".claude/commands/*"],
    [
      "Project conventions",
      ".editorconfig",
      "biome.json",
      "docs/conventions.md",
    ],
    [
      "Codemods and migration kits",
      "codemods/*",
      "scripts/migrate.ts",
      "docs/migration.md",
    ],
    ["Testing setup", "vitest.config.ts", "test/setup.ts", "docs/testing.md"],
    [
      "CI and release workflows",
      ".github/workflows/ci.yml",
      ".github/workflows/release.yml",
    ],
    [
      "Project automation",
      "scripts/release.ts",
      "scripts/checks.ts",
      "docs/automation.md",
    ],
    [
      "Issue and pull request templates",
      ".github/ISSUE_TEMPLATE/*",
      ".github/pull_request_template.md",
    ],
    ["MCP configuration", ".mcp.json", ".cursor/mcp.json"],
  ].map(([label, ...files]) => (
    <div
      className="grid gap-2 border-b px-4 py-3 last:border-b-0 md:grid-cols-[220px_1fr]"
      key={label}
    >
      <div className="font-medium">{label}</div>
      <div className="flex min-w-0 flex-wrap gap-1.5">
        {files.map((file) => (
          <code key={file}>{file}</code>
        ))}
      </div>
    </div>
  ))}
</div>

## When to use GitHub

Use a GitHub registry when:

- You already have reusable code in a public GitHub repository.
- You want users to install directly from `owner/repo/item`.
- You want to distribute config files, rules, docs, templates, utilities or any
  other files from the same repository.
- You do not need private repo access or custom request authentication.

## Requirements

A GitHub registry must:

- Be a public `github.com` repository.
- Have a `registry.json` file at the repository root.
- Use valid `registry.json` and `registry-item.json` schemas.
- Reference source files that exist in the repository.

Private repositories and GitHub Enterprise hosts are not currently supported by
GitHub addresses. For private or authenticated registries, use a
[namespace](/docs/registry/namespace) with
[authentication](/docs/registry/authentication).

## Step 1: Add registry.json

Given an existing public repository:

```txt
.
├── ...
├── .editorconfig
├── AGENTS.md
└── docs
    └── conventions.md
```

Add `registry.json` at the root of the repository.

```txt
.
├── ...
├── registry.json
├── .editorconfig
├── AGENTS.md
└── docs
    └── conventions.md
```

Define the item you want to distribute.

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme-toolkit",
    "homepage": "https://github.com/acme/toolkit",
    "items": [
        {
            "name": "project-conventions",
            "type": "registry:item",
            "title": "Project Conventions",
            "description": "Shared project conventions, editor settings and agent instructions.",
            "files": [
                {
                    "path": "AGENTS.md",
                    "type": "registry:file",
                    "target": "~/AGENTS.md"
                },
                {
                    "path": ".editorconfig",
                    "type": "registry:file",
                    "target": "~/.editorconfig"
                },
                {
                    "path": "docs/conventions.md",
                    "type": "registry:file",
                    "target": "~/docs/conventions.md"
                }
            ]
        }
    ]
}
```

Commit and push the file.

```bash
git add registry.json
```

```bash
git commit -m "add registry"
```

```bash
git push
```

Users can now install the item from GitHub.

```bash
npx shadcn@latest add acme/toolkit/project-conventions
```

## Step 2: Distribute any file

A registry item can install one file or many files. Use the `files` array to
declare the files that belong together.

For example, a testing setup can install a Vitest config, a setup file and a
short team guide.

```txt
registry.json
config
└── vitest.config.ts
docs
└── testing.md
test
└── setup.ts
```

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme-toolkit",
    "homepage": "https://github.com/acme/toolkit",
    "items": [
        {
            "name": "vitest-setup",
            "type": "registry:item",
            "title": "Vitest Setup",
            "description": "A Vitest setup with project defaults and docs.",
            "files": [
                {
                    "path": "config/vitest.config.ts",
                    "type": "registry:file",
                    "target": "~/vitest.config.ts"
                },
                {
                    "path": "test/setup.ts",
                    "type": "registry:file",
                    "target": "~/test/setup.ts"
                },
                {
                    "path": "docs/testing.md",
                    "type": "registry:file",
                    "target": "~/docs/testing.md"
                }
            ]
        }
    ]
}
```

Users install it the same way.

```bash
npx shadcn@latest add acme/toolkit/vitest-setup
```

Use `target` when a file should be written to a specific destination in the
user's project.

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme-toolkit",
    "homepage": "https://github.com/acme/toolkit",
    "items": [
        {
            "name": "editorconfig",
            "type": "registry:file",
            "files": [
                {
                    "path": "config/.editorconfig",
                    "type": "registry:file",
                    "target": "~/.editorconfig"
                }
            ]
        }
    ]
}
```

```bash
npx shadcn@latest add acme/toolkit/editorconfig
```

## Step 3: Validate the registry

Before sharing the registry, validate it from the CLI.

```bash
npx shadcn@latest registry validate acme/toolkit
```

The command reads the root `registry.json`, resolves includes, validates the
registry items, and checks that referenced files exist.

You can also validate a branch, tag or commit SHA.

```bash
npx shadcn@latest registry validate acme/toolkit#v1.0.0
```

## Step 4: List and search items

Use `list` to see every item in the repository registry.

```bash
npx shadcn@latest list acme/toolkit
```

Use `search` to filter the catalog.

```bash
npx shadcn@latest search acme/toolkit --query conventions
```

Use `view` to inspect one item payload.

```bash
npx shadcn@latest view acme/toolkit/project-conventions
```

## Organize with include

For larger repositories, keep item definitions close to the source files they
describe.

```txt
registry.json
config
├── prettier.config.mjs
└── registry.json
rules
├── agent.md
└── registry.json
```

The root `registry.json` can include the nested registry files.

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme-toolkit",
    "homepage": "https://github.com/acme/toolkit",
    "include": ["config/registry.json", "rules/registry.json"]
}
```

The included registry file declares items for that directory.

```json title="rules/registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "items": [
        {
            "name": "agent-rules",
            "type": "registry:file",
            "files": [
                {
                    "path": "agent.md",
                    "type": "registry:file",
                    "target": "~/AGENTS.md"
                }
            ]
        }
    ]
}
```

When using `include`, file paths are relative to the `registry.json` file that
declares the item.

```bash
npx shadcn@latest add acme/toolkit/project-conventions
```

## Registry dependencies

Use `registryDependencies` when one registry item depends on another registry
item.

### Same repository dependencies

For dependencies in the same GitHub repository, use the full GitHub item
address.

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme-toolkit",
    "homepage": "https://github.com/acme/toolkit",
    "items": [
        {
            "name": "project-setup",
            "type": "registry:item",
            "registryDependencies": [
                "acme/toolkit/agent-rules",
                "acme/toolkit/prettier-config",
                "acme/toolkit/tsconfig"
            ],
            "files": [
                {
                    "path": "docs/project-setup.md",
                    "type": "registry:file",
                    "target": "~/docs/project-setup.md"
                }
            ]
        }
    ]
}
```

A docs item can depend on a template item from the same repository.

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme-toolkit",
    "homepage": "https://github.com/acme/toolkit",
    "items": [
        {
            "name": "contributing-guide",
            "type": "registry:item",
            "registryDependencies": ["acme/toolkit/readme-template"],
            "files": [
                {
                    "path": "docs/contributing.md",
                    "type": "registry:file",
                    "target": "~/docs/contributing.md"
                }
            ]
        }
    ]
}
```

A CI setup can depend on the same formatting and testing defaults that users can
install separately.

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme-toolkit",
    "homepage": "https://github.com/acme/toolkit",
    "items": [
        {
            "name": "ci-setup",
            "type": "registry:item",
            "registryDependencies": [
                "acme/toolkit/prettier-config",
                "acme/toolkit/vitest-setup"
            ],
            "files": [
                {
                    "path": ".github/workflows/ci.yml",
                    "type": "registry:file",
                    "target": "~/.github/workflows/ci.yml"
                }
            ]
        }
    ]
}
```

### External registry dependencies

Items can also depend on external registries. Use the full item address for the
registry that owns the dependency.

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme-toolkit",
    "homepage": "https://github.com/acme/toolkit",
    "items": [
        {
            "name": "workspace-setup",
            "type": "registry:item",
            "registryDependencies": [
                "@acme/tsconfig",
                "contoso/devtools/prettier-config"
            ],
            "files": [
                {
                    "path": "docs/workspace.md",
                    "type": "registry:file",
                    "target": "~/docs/workspace.md"
                }
            ]
        }
    ]
}
```

### Dependency refs

Refs are not inherited across dependencies. If a dependency should be pinned,
include its own ref.

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme-toolkit",
    "homepage": "https://github.com/acme/toolkit",
    "items": [
        {
            "name": "project-setup",
            "type": "registry:item",
            "registryDependencies": [
                "acme/toolkit/agent-rules#v1.0.0",
                "acme/toolkit/tsconfig#c0ffee254729296a45d6691db565cf707a3fef5d"
            ],
            "files": [
                {
                    "path": "docs/project-setup.md",
                    "type": "registry:file",
                    "target": "~/docs/project-setup.md"
                }
            ]
        }
    ]
}
```

## Useful commands

List every item in a GitHub registry.

```bash
npx shadcn@latest list acme/toolkit
```

Search a GitHub registry.

```bash
npx shadcn@latest search acme/toolkit -q conventions
```

Validate a GitHub registry.

```bash
npx shadcn@latest registry validate acme/toolkit
```

Install an item from a GitHub registry.

```bash
npx shadcn@latest add acme/toolkit/project-conventions
```

View an item from a GitHub registry.

```bash
npx shadcn@latest view acme/toolkit/project-conventions
```

Install an item whose registry item name contains `/`.

```bash
npx shadcn@latest add acme/toolkit/rules/agent
```

<Callout>
  For GitHub item addresses, the first two path segments are the GitHub owner
  and repository. Any remaining segments are the registry item name, not a file
  path. An address ending in `.json` is treated as a file path.
</Callout>

Install from a tag.

```bash
npx shadcn@latest add acme/toolkit/project-conventions#v1.0.0
```

Install from a full commit SHA.

```bash
npx shadcn@latest add acme/toolkit/project-conventions#c0ffee254729296a45d6691db565cf707a3fef5d
```

## Refs

Use `#ref` to install from a branch, tag or commit SHA.

```bash
npx shadcn@latest add acme/toolkit/project-conventions#main
```

Refs may contain slashes.

```bash
npx shadcn@latest add acme/toolkit/project-conventions#feature/conventions
```

If no ref is provided, the CLI uses the repository default branch.

The CLI uses Git to resolve branches, tags and short refs into a commit SHA
before reading files. Full 40-character commit SHAs are used directly and do not
require Git.

## Review before installing

GitHub registry items install code and project files from public repositories.
Treat a GitHub item address like any other third-party code dependency.

Before installing from a source you do not control:

- Review the repository and the root `registry.json`.
- Review the item definition, especially `files`, `target`, `dependencies`,
  `devDependencies`, `registryDependencies` and `envVars`.
- Check any external registry dependencies. They can install files from other
  registries.
- Prefer pinned refs for published install commands. A full 40-character commit
  SHA is the most reproducible option.
- Use `shadcn view acme/toolkit/project-conventions` to inspect the resolved
  item payload before installing.
- Pipe `shadcn view` output to your agent or review tool if you want help
  checking the item.
- Use `shadcn add acme/toolkit/project-conventions --dry-run` to preview an
  install without writing files.
- Use `--diff` or `--view` with `shadcn add` to inspect file changes or file
  contents before applying them.

---
title: Registry Directory
description: Open Source Registry Index
---

The open source registry index is a list of all the open source registries that
are available to use out of the box.

When you run `shadcn add` or `shadcn search`, the CLI will automatically check
the registry index for the registry you are looking for and add it to your
`components.json` file.

You can see the full list at
[https://ui.shadcn.com/r/registries.json](https://ui.shadcn.com/r/registries.json).

You do not need to submit a public GitHub registry to the registry directory to
use it with `owner/repo/item` addresses. The registry directory is for
namespaces such as `@acme`.

## Adding a Registry

1. Add your registry to
   [`apps/v4/registry/directory.json`](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/directory.json)
2. Run `pnpm validate:registries` to validate the registry directory.
3. Create a pull request to https://github.com/shadcn-ui/ui

Once you have submitted your request, it will be validated and reviewed by the
team.

## Requirements

1. The registry must be open source and publicly accessible.
2. The registry must be a valid JSON file that conforms to the
   [registry schema specification](/docs/registry/registry-json).
3. The registry is expected to be a flat registry with no nested items i.e
   `/registry.json` and `/component-name.json` files are expected to be in the
   root of the registry.
4. The `files` array, if present, must NOT include a `content` property.

Here's an example of a valid registry:

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme",
    "homepage": "https://acme.com",
    "items": [
        {
            "name": "login-form",
            "type": "registry:component",
            "title": "Login Form",
            "description": "A login form component.",
            "files": [
                {
                    "path": "registry/new-york/auth/login-form.tsx",
                    "type": "registry:component"
                }
            ]
        },
        {
            "name": "example-login-form",
            "type": "registry:component",
            "title": "Example Login Form",
            "description": "An example showing how to use the login form component.",
            "files": [
                {
                    "path": "registry/new-york/examples/example-login-form.tsx",
                    "type": "registry:component"
                }
            ]
        }
    ]
}
```

---
title: Examples
description: "Examples of registry items: styles, components, css vars, etc."
---

## registry:style

### Custom style that extends shadcn/ui

The following registry item is a custom style that extends shadcn/ui. On
`npx shadcn init`, it will:

- Install `@tabler/icons-react` as a dependency.
- Add the `login-01` block and `calendar` component to the project.
- Add the `editor` from a remote registry.
- Set the `font-sans` variable to `Inter, sans-serif`.
- Install a `brand` color in light and dark mode.

```json title="example-style.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "example-style",
    "type": "registry:style",
    "dependencies": ["@tabler/icons-react"],
    "registryDependencies": [
        "login-01",
        "calendar",
        "https://example.com/r/editor.json"
    ],
    "cssVars": {
        "theme": {
            "font-sans": "Inter, sans-serif"
        },
        "light": {
            "brand": "20 14.3% 4.1%"
        },
        "dark": {
            "brand": "20 14.3% 4.1%"
        }
    }
}
```

### Custom style from scratch

The following registry item is a custom style that doesn't extend shadcn/ui. See
the `extends: none` field.

It can be used to create a new style from scratch, i.e. custom components, css
vars, dependencies, etc.

On `npx shadcn add`, the following will:

- Install `tailwind-merge` and `clsx` as dependencies.
- Add the `utils` registry item from the shadcn/ui registry.
- Add the `button`, `input`, `label`, and `select` components from a remote
  registry.
- Install new css vars: `main`, `bg`, `border`, `text`, `ring`.

```json title="example-style.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "extends": "none",
    "name": "new-style",
    "type": "registry:style",
    "dependencies": ["tailwind-merge", "clsx"],
    "registryDependencies": [
        "utils",
        "https://example.com/r/button.json",
        "https://example.com/r/input.json",
        "https://example.com/r/label.json",
        "https://example.com/r/select.json"
    ],
    "cssVars": {
        "theme": {
            "font-sans": "Inter, sans-serif"
        },
        "light": {
            "main": "#88aaee",
            "bg": "#dfe5f2",
            "border": "#000",
            "text": "#000",
            "ring": "#000"
        },
        "dark": {
            "main": "#88aaee",
            "bg": "#272933",
            "border": "#000",
            "text": "#e6e6e6",
            "ring": "#fff"
        }
    }
}
```

## registry:theme

### Custom theme

```json title="example-theme.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-theme",
    "type": "registry:theme",
    "cssVars": {
        "light": {
            "background": "oklch(1 0 0)",
            "foreground": "oklch(0.141 0.005 285.823)",
            "primary": "oklch(0.546 0.245 262.881)",
            "primary-foreground": "oklch(0.97 0.014 254.604)",
            "ring": "oklch(0.746 0.16 232.661)",
            "sidebar-primary": "oklch(0.546 0.245 262.881)",
            "sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",
            "sidebar-ring": "oklch(0.746 0.16 232.661)"
        },
        "dark": {
            "background": "oklch(1 0 0)",
            "foreground": "oklch(0.141 0.005 285.823)",
            "primary": "oklch(0.707 0.165 254.624)",
            "primary-foreground": "oklch(0.97 0.014 254.604)",
            "ring": "oklch(0.707 0.165 254.624)",
            "sidebar-primary": "oklch(0.707 0.165 254.624)",
            "sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",
            "sidebar-ring": "oklch(0.707 0.165 254.624)"
        }
    }
}
```

### Custom colors

The following style will init using shadcn/ui defaults and then add a custom
`brand` color.

```json title="example-style.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-style",
    "type": "registry:style",
    "cssVars": {
        "light": {
            "brand": "oklch(0.99 0.00 0)"
        },
        "dark": {
            "brand": "oklch(0.14 0.00 286)"
        }
    }
}
```

## registry:block

### Custom block

This block installs the `login-01` block from the shadcn/ui registry.

```json title="login-01.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "login-01",
    "type": "registry:block",
    "description": "A simple login form.",
    "registryDependencies": ["button", "card", "input", "label"],
    "files": [
        {
            "path": "blocks/login-01/page.tsx",
            "content": "import { LoginForm } ...",
            "type": "registry:page",
            "target": "app/login/page.tsx"
        },
        {
            "path": "blocks/login-01/components/login-form.tsx",
            "content": "...",
            "type": "registry:component"
        }
    ]
}
```

### Install a block and override primitives

You can install a block from the shadcn/ui registry and override the primitives
using your custom ones.

On `npx shadcn add`, the following will:

- Add the `login-01` block from the shadcn/ui registry.
- Override the `button`, `input`, and `label` primitives with the ones from the
  remote registry.

```json title="example-style.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-login",
    "type": "registry:block",
    "registryDependencies": [
        "login-01",
        "https://example.com/r/button.json",
        "https://example.com/r/input.json",
        "https://example.com/r/label.json"
    ]
}
```

## registry:ui

### UI component

A `registry:ui` item is a reusable UI component. It can have dependencies,
registry dependencies, and CSS variables.

```json title="button.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "button",
    "type": "registry:ui",
    "dependencies": ["radix-ui"],
    "files": [
        {
            "path": "ui/button.tsx",
            "content": "...",
            "type": "registry:ui"
        }
    ]
}
```

### UI component with CSS variables

```json title="sidebar.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "sidebar",
    "type": "registry:ui",
    "dependencies": ["radix-ui"],
    "registryDependencies": ["button", "separator", "sheet", "tooltip"],
    "files": [
        {
            "path": "ui/sidebar.tsx",
            "content": "...",
            "type": "registry:ui"
        }
    ],
    "cssVars": {
        "light": {
            "sidebar-background": "oklch(0.985 0 0)",
            "sidebar-foreground": "oklch(0.141 0.005 285.823)",
            "sidebar-border": "oklch(0.92 0.004 286.32)"
        },
        "dark": {
            "sidebar-background": "oklch(0.141 0.005 285.823)",
            "sidebar-foreground": "oklch(0.985 0 0)",
            "sidebar-border": "oklch(0.274 0.006 286.033)"
        }
    }
}
```

## registry:lib

### Utility library

A `registry:lib` item is a utility library. Use it to share helper functions,
constants, or other non-component code.

```json title="utils.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "utils",
    "type": "registry:lib",
    "dependencies": ["clsx", "tailwind-merge"],
    "files": [
        {
            "path": "lib/utils.ts",
            "content": "import { clsx, type ClassValue } from \"clsx\"\nimport { twMerge } from \"tailwind-merge\"\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs))\n}",
            "type": "registry:lib"
        }
    ]
}
```

## registry:hook

### Custom hook

A `registry:hook` item is a custom React hook.

```json title="use-mobile.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "use-mobile",
    "type": "registry:hook",
    "files": [
        {
            "path": "hooks/use-mobile.ts",
            "content": "...",
            "type": "registry:hook"
        }
    ]
}
```

### Hook with dependencies

```json title="use-debounce.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "use-debounce",
    "type": "registry:hook",
    "dependencies": ["react"],
    "files": [
        {
            "path": "hooks/use-debounce.ts",
            "content": "...",
            "type": "registry:hook"
        }
    ]
}
```

## Target Placeholders

Use `files[].target` placeholders when a registry item should install files
under the user's configured shadcn directories. The available placeholders are
`@components/`, `@ui/`, `@lib/` and `@hooks/`.

The placeholders are resolved from `components.json`, so the same registry item
works in projects using `@/`, custom TypeScript aliases, package imports or
workspace package exports.

Anything after the placeholder is preserved. For example,
`@ui/ai/prompt-input.tsx` installs under the user's configured `ui` directory at
`ai/prompt-input.tsx`.

```json title="alias-child.json" showLineNumbers {9,15,21}
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "alias-child",
    "type": "registry:item",
    "files": [
        {
            "path": "registry/new-york/alias/target-alias-button.tsx",
            "type": "registry:ui",
            "target": "@ui/target-alias-button.tsx",
            "content": "..."
        },
        {
            "path": "registry/new-york/alias/target-alias-helper.ts",
            "type": "registry:lib",
            "target": "@lib/target-alias-helper.ts",
            "content": "..."
        },
        {
            "path": "registry/new-york/alias/prompt-input.tsx",
            "type": "registry:ui",
            "target": "@ui/ai/prompt-input.tsx",
            "content": "..."
        }
    ]
}
```

Registry dependencies can use target placeholders too. In the following example,
the child item installs a UI component and a helper, while the parent item
installs an app component and a hook.

```json title="alias-parent.json" showLineNumbers {7,13}
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "alias-parent",
    "type": "registry:item",
    "registryDependencies": ["https://example.com/r/alias-child.json"],
    "files": [
        {
            "path": "registry/new-york/alias/target-alias-panel.tsx",
            "type": "registry:component",
            "target": "@components/target-alias-panel.tsx",
            "content": "..."
        },
        {
            "path": "registry/new-york/alias/use-target-alias.ts",
            "type": "registry:hook",
            "target": "@hooks/use-target-alias.ts",
            "content": "..."
        }
    ]
}
```

The `target` controls where the file is written, even when it differs from the
file `type`.

```json title="type-mismatch.json" showLineNumbers {9}
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "type-mismatch",
    "type": "registry:item",
    "files": [
        {
            "path": "registry/new-york/example/format-date.ts",
            "type": "registry:ui",
            "target": "@lib/format-date.ts",
            "content": "..."
        }
    ]
}
```

## registry:font

### Custom font

A `registry:font` item installs a Google Font. The `font` field is required and
configures the font family, provider, import name, and CSS variable.

```json title="font-inter.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "font-inter",
    "type": "registry:font",
    "font": {
        "family": "'Inter Variable', sans-serif",
        "provider": "google",
        "import": "Inter",
        "variable": "--font-sans",
        "subsets": ["latin"],
        "dependency": "@fontsource-variable/inter"
    }
}
```

### Monospace font

```json title="font-jetbrains-mono.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "font-jetbrains-mono",
    "type": "registry:font",
    "font": {
        "family": "'JetBrains Mono Variable', monospace",
        "provider": "google",
        "import": "JetBrains_Mono",
        "variable": "--font-mono",
        "weight": ["400", "500", "600", "700"],
        "subsets": ["latin"],
        "dependency": "@fontsource-variable/jetbrains-mono"
    }
}
```

### Serif font

```json title="font-lora.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "font-lora",
    "type": "registry:font",
    "font": {
        "family": "'Lora Variable', serif",
        "provider": "google",
        "import": "Lora",
        "variable": "--font-serif",
        "subsets": ["latin"],
        "dependency": "@fontsource-variable/lora"
    }
}
```

### Font with custom selector

Use the `selector` field to apply a font to specific CSS selectors instead of
globally on `html`. This is useful for heading fonts or other targeted font
applications.

```json title="font-playfair-display.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "font-playfair-display",
    "type": "registry:font",
    "font": {
        "family": "'Playfair Display Variable', serif",
        "provider": "google",
        "import": "Playfair_Display",
        "variable": "--font-heading",
        "subsets": ["latin"],
        "selector": "h1, h2, h3, h4, h5, h6",
        "dependency": "@fontsource-variable/playfair-display"
    }
}
```

When `selector` is set, the font utility class (e.g. `font-heading`) is applied
via CSS `@apply` on the specified selector within `@layer base`, instead of
being added to the `<html>` element. The CSS variable is still injected on
`<html>` so it's available globally.

## registry:base

### Custom base

A `registry:base` item is a complete design system base. It defines the full set
of dependencies, CSS variables, and configuration for a project. The `config`
field is unique to `registry:base` items.

The `config` field accepts the following properties (all optional):

| Property             | Type                                                                         | Description                                                     |
| -------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `style`              | `string`                                                                     | The style name for the base.                                    |
| `iconLibrary`        | `string`                                                                     | The icon library to use (e.g. `lucide`).                        |
| `rsc`                | `boolean`                                                                    | Whether to enable React Server Components. Defaults to `false`. |
| `tsx`                | `boolean`                                                                    | Whether to use TypeScript. Defaults to `true`.                  |
| `rtl`                | `boolean`                                                                    | Whether to enable right-to-left support. Defaults to `false`.   |
| `menuColor`          | `"default" \| "inverted" \| "default-translucent" \| "inverted-translucent"` | The menu color scheme. Defaults to `"default"`.                 |
| `menuAccent`         | `"subtle" \| "bold"`                                                         | The menu accent style. Defaults to `"subtle"`.                  |
| `tailwind.baseColor` | `string`                                                                     | The base color name (e.g. `neutral`, `slate`, `zinc`).          |
| `tailwind.css`       | `string`                                                                     | Path to the Tailwind CSS file.                                  |
| `tailwind.prefix`    | `string`                                                                     | A prefix to add to all Tailwind classes.                        |
| `aliases.components` | `string`                                                                     | Import alias for components.                                    |
| `aliases.utils`      | `string`                                                                     | Import alias for utilities.                                     |
| `aliases.ui`         | `string`                                                                     | Import alias for UI components.                                 |
| `aliases.lib`        | `string`                                                                     | Import alias for lib.                                           |
| `aliases.hooks`      | `string`                                                                     | Import alias for hooks.                                         |
| `registries`         | `Record<string, string \| object>`                                           | Custom registry URLs. Keys must start with `@`.                 |

```json title="custom-base.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-base",
    "type": "registry:base",
    "config": {
        "style": "custom-base",
        "iconLibrary": "lucide",
        "tailwind": {
            "baseColor": "neutral"
        }
    },
    "dependencies": [
        "class-variance-authority",
        "tw-animate-css",
        "lucide-react"
    ],
    "registryDependencies": ["utils", "font-inter"],
    "cssVars": {
        "light": {
            "background": "oklch(1 0 0)",
            "foreground": "oklch(0.141 0.005 285.823)",
            "primary": "oklch(0.21 0.006 285.885)",
            "primary-foreground": "oklch(0.985 0 0)"
        },
        "dark": {
            "background": "oklch(0.141 0.005 285.823)",
            "foreground": "oklch(0.985 0 0)",
            "primary": "oklch(0.985 0 0)",
            "primary-foreground": "oklch(0.21 0.006 285.885)"
        }
    },
    "css": {
        "@import \"tw-animate-css\"": {},
        "@layer base": {
            "*": {
                "@apply border-border outline-ring/50": {}
            },
            "body": {
                "@apply bg-background text-foreground": {}
            }
        }
    }
}
```

### Base from scratch

Use `extends: none` to create a base that doesn't extend shadcn/ui defaults.

```json title="custom-base.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "my-design-system",
    "extends": "none",
    "type": "registry:base",
    "config": {
        "style": "my-design-system",
        "iconLibrary": "lucide",
        "tailwind": {
            "baseColor": "slate"
        }
    },
    "dependencies": [
        "tailwind-merge",
        "clsx",
        "tw-animate-css",
        "lucide-react"
    ],
    "registryDependencies": ["utils", "font-geist"],
    "cssVars": {
        "light": {
            "background": "oklch(1 0 0)",
            "foreground": "oklch(0.141 0.005 285.823)"
        },
        "dark": {
            "background": "oklch(0.141 0.005 285.823)",
            "foreground": "oklch(0.985 0 0)"
        }
    }
}
```

## Common Fields

### Author

Use the `author` field to add attribution to your registry items.

```json title="example-item.json" showLineNumbers {5}
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-component",
    "type": "registry:ui",
    "author": "shadcn",
    "files": [
        {
            "path": "ui/custom-component.tsx",
            "content": "...",
            "type": "registry:ui"
        }
    ]
}
```

### Dev dependencies

Use the `devDependencies` field to install packages as dev dependencies.

```json title="example-item.json" showLineNumbers {5}
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-item",
    "type": "registry:item",
    "devDependencies": ["@types/mdx"],
    "files": [
        {
            "path": "lib/mdx.ts",
            "content": "...",
            "type": "registry:lib"
        }
    ]
}
```

### Metadata

Use the `meta` field to attach arbitrary metadata to your registry items. This
can be used to store custom data that your tools or scripts can use.

```json title="example-item.json" showLineNumbers {5-8}
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-component",
    "type": "registry:ui",
    "meta": {
        "category": "forms",
        "version": "2.0.0"
    },
    "files": [
        {
            "path": "ui/custom-component.tsx",
            "content": "...",
            "type": "registry:ui"
        }
    ]
}
```

## CSS Variables

### Custom Theme Variables

Add custom theme variables to the `theme` object.

```json title="example-theme.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-theme",
    "type": "registry:theme",
    "cssVars": {
        "theme": {
            "font-heading": "Inter, sans-serif",
            "shadow-card": "0 0 0 1px rgba(0, 0, 0, 0.1)"
        }
    }
}
```

### Override Tailwind CSS variables

```json title="example-theme.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-theme",
    "type": "registry:theme",
    "cssVars": {
        "theme": {
            "spacing": "0.2rem",
            "breakpoint-sm": "640px",
            "breakpoint-md": "768px",
            "breakpoint-lg": "1024px",
            "breakpoint-xl": "1280px",
            "breakpoint-2xl": "1536px"
        }
    }
}
```

## Add custom CSS

### Base styles

```json title="example-base.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-style",
    "type": "registry:style",
    "css": {
        "@layer base": {
            "h1": {
                "font-size": "var(--text-2xl)"
            },
            "h2": {
                "font-size": "var(--text-xl)"
            }
        }
    }
}
```

### Components

```json title="example-card.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-card",
    "type": "registry:component",
    "css": {
        "@layer components": {
            "card": {
                "background-color": "var(--color-white)",
                "border-radius": "var(--rounded-lg)",
                "padding": "var(--spacing-6)",
                "box-shadow": "var(--shadow-xl)"
            }
        }
    }
}
```

## Add custom utilities

### Simple utility

```json title="example-component.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-component",
    "type": "registry:component",
    "css": {
        "@utility content-auto": {
            "content-visibility": "auto"
        }
    }
}
```

### Complex utility

```json title="example-utility.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-component",
    "type": "registry:component",
    "css": {
        "@utility scrollbar-hidden": {
            "scrollbar-hidden": {
                "&::-webkit-scrollbar": {
                    "display": "none"
                }
            }
        }
    }
}
```

### Functional utilities

```json title="example-functional.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-component",
    "type": "registry:component",
    "css": {
        "@utility tab-*": {
            "tab-size": "var(--tab-size-*)"
        }
    }
}
```

## Add CSS imports

Use `@import` to add CSS imports to your registry item. The imports will be
placed at the top of the CSS file.

### Basic import

```json title="example-import.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-import",
    "type": "registry:component",
    "css": {
        "@import \"tailwindcss\"": {},
        "@import \"./styles/base.css\"": {}
    }
}
```

### Import with url() syntax

```json title="example-url-import.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "font-import",
    "type": "registry:item",
    "css": {
        "@import url(\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap\")": {},
        "@import url('./local-styles.css')": {}
    }
}
```

### Import with media queries

```json title="example-media-import.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "responsive-import",
    "type": "registry:item",
    "css": {
        "@import \"print-styles.css\" print": {},
        "@import url(\"mobile.css\") screen and (max-width: 768px)": {}
    }
}
```

## Add custom plugins

Use `@plugin` to add Tailwind plugins to your registry item. Plugins will be
automatically placed after imports and before other content.

**Important:** When using plugins from npm packages, you must also add them to
the `dependencies` array.

### Basic plugin usage

```json title="example-plugin.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-plugin",
    "type": "registry:item",
    "css": {
        "@plugin \"@tailwindcss/typography\"": {},
        "@plugin \"foo\"": {}
    }
}
```

### Plugin with npm dependency

When using plugins from npm packages like `@tailwindcss/typography`, include
them in the dependencies.

```json title="example-typography.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "typography-component",
    "type": "registry:item",
    "dependencies": ["@tailwindcss/typography"],
    "css": {
        "@plugin \"@tailwindcss/typography\"": {},
        "@layer components": {
            ".prose": {
                "max-width": "65ch"
            }
        }
    }
}
```

### Scoped and file-based plugins

```json title="example-scoped-plugin.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "scoped-plugins",
    "type": "registry:component",
    "css": {
        "@plugin \"@headlessui/tailwindcss\"": {},
        "@plugin \"tailwindcss/plugin\"": {},
        "@plugin \"./custom-plugin.js\"": {}
    }
}
```

### Multiple plugins with automatic ordering

When you add multiple plugins, they are automatically grouped together and
deduplicated.

```json title="example-multiple-plugins.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "multiple-plugins",
    "type": "registry:item",
    "dependencies": [
        "@tailwindcss/typography",
        "@tailwindcss/forms",
        "tw-animate-css"
    ],
    "css": {
        "@plugin \"@tailwindcss/typography\"": {},
        "@plugin \"@tailwindcss/forms\"": {},
        "@plugin \"tw-animate-css\"": {}
    }
}
```

## Combined imports and plugins

When using both `@import` and `@plugin` directives, imports are placed first,
followed by plugins, then other CSS content.

```json title="example-combined.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "combined-example",
    "type": "registry:item",
    "dependencies": ["@tailwindcss/typography", "tw-animate-css"],
    "css": {
        "@import \"tailwindcss\"": {},
        "@import url(\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap\")": {},
        "@plugin \"@tailwindcss/typography\"": {},
        "@plugin \"tw-animate-css\"": {},
        "@layer base": {
            "body": {
                "font-family": "Inter, sans-serif"
            }
        },
        "@utility content-auto": {
            "content-visibility": "auto"
        }
    }
}
```

## Add custom animations

Note: you need to define both `@keyframes` in css and `theme` in cssVars to use
animations.

```json title="example-component.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-component",
    "type": "registry:component",
    "cssVars": {
        "theme": {
            "--animate-wiggle": "wiggle 1s ease-in-out infinite"
        }
    },
    "css": {
        "@keyframes wiggle": {
            "0%, 100%": {
                "transform": "rotate(-3deg)"
            },
            "50%": {
                "transform": "rotate(3deg)"
            }
        }
    }
}
```

## Add environment variables

You can add environment variables using the `envVars` field.

```json title="example-item.json" showLineNumbers {5-9}
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "custom-item",
    "type": "registry:item",
    "envVars": {
        "NEXT_PUBLIC_APP_URL": "http://localhost:4000",
        "DATABASE_URL": "postgresql://postgres:postgres@localhost:5432/postgres",
        "OPENAI_API_KEY": ""
    }
}
```

Environment variables are added to the `.env.local` or `.env` file. Existing
variables are not overwritten.

<Callout>

**IMPORTANT:** Use `envVars` to add development or example variables. Do NOT use
it to add production variables.

</Callout>

## Universal Items

As of `2.9.0`, you can create universal items that can be installed without
framework detection or components.json.

To make an item universal i.e framework agnostic, all the files in the item must
have an explicit target.

Here's an example of a registry item that installs custom Cursor rules for
_python_:

```json title=".cursor/rules/custom-python.mdc" showLineNumbers {9}
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "python-rules",
    "type": "registry:item",
    "files": [
        {
            "path": "/path/to/your/registry/default/custom-python.mdc",
            "type": "registry:file",
            "target": "~/.cursor/rules/custom-python.mdc",
            "content": "..."
        }
    ]
}
```

Here's another example for installing a custom ESLint config:

```json title=".eslintrc.json" showLineNumbers {9}
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "my-eslint-config",
    "type": "registry:item",
    "files": [
        {
            "path": "/path/to/your/registry/default/custom-eslint.json",
            "type": "registry:file",
            "target": "~/.eslintrc.json",
            "content": "..."
        }
    ]
}
```

You can also have a universal item that installs multiple files:

```json title="my-custom-starter-template.json" showLineNumbers {9}
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "my-custom-starter-template",
    "type": "registry:item",
    "dependencies": ["better-auth"],
    "files": [
        {
            "path": "/path/to/file-01.json",
            "type": "registry:file",
            "target": "~/file-01.json",
            "content": "..."
        },
        {
            "path": "/path/to/file-02.vue",
            "type": "registry:file",
            "target": "~/pages/file-02.vue",
            "content": "..."
        }
    ]
}
```

---
title: Namespaces
description: Configure and use multiple resource registries with namespace support.
---

Namespaced registries let you configure multiple resource sources in one
project. This means you can install components, libraries, utilities, AI
prompts, configuration files, and other resources from various registries,
whether they're public, third-party, or your own custom private libraries.

## Table of Contents

- [Overview](#overview)
- [Decentralized Namespace System](#decentralized-namespace-system)
- [Getting Started](#getting-started)
- [Registry Naming Convention](#registry-naming-convention)
- [Configuration](#configuration)
- [Authentication & Security](#authentication--security)
- [Versioning](#versioning)
- [Dependency Resolution](#dependency-resolution)
- [Built-in Registries](#built-in-registries)
- [CLI Commands](#cli-commands)
- [Error Handling](#error-handling)
- [Creating Your Own Registry](#creating-your-own-registry)
- [Example Configurations](#example-configurations)
- [Technical Details](#technical-details)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

Registry namespaces are prefixed with `@` and provide a way to organize and
reference resources from different sources. Resources can be any type of
content: components, libraries, utilities, hooks, AI prompts, configuration
files, themes, and more. For example:

- `@shadcn/button` - UI component from the shadcn registry
- `@v0/dashboard` - Dashboard component from the v0 registry
- `@ai-elements/input` - AI prompt input from an AI elements registry
- `@acme/auth-utils` - Authentication utilities from your company's private
  registry
- `@ai/chatbot-rules` - AI prompt rules from an AI resources registry
- `@themes/dark-mode` - Theme configuration from a themes registry

---

## Decentralized Namespace System

We intentionally designed the namespace system to be decentralized. There is a
[central open source registry index](/docs/registry/registry-index) for open
source namespaces but you are free to create and use any namespace you want.

This decentralized approach gives you complete flexibility to organize your
resources however makes sense for your organization.

You can create multiple registries for different purposes:

```json title="components.json" showLineNumbers
{
    "registries": {
        "@acme-ui": "https://registry.acme.com/ui/{name}.json",
        "@acme-docs": "https://registry.acme.com/docs/{name}.json",
        "@acme-ai": "https://registry.acme.com/ai/{name}.json",
        "@acme-themes": "https://registry.acme.com/themes/{name}.json",
        "@acme-internal": {
            "url": "https://internal.acme.com/registry/{name}.json",
            "headers": {
                "Authorization": "Bearer ${INTERNAL_TOKEN}"
            }
        }
    }
}
```

This allows you to:

- **Organize by type**: Separate UI components, documentation, AI resources,
  etc.
- **Organize by team**: Different teams can maintain their own registries
- **Organize by visibility**: Public vs. private resources
- **Organize by version**: Stable vs. experimental registries
- **No naming conflicts**: Since there's no central authority, you don't need to
  worry about namespace collisions

### Examples of Multi-Registry Setups

#### By Resource Type

```json title="components.json" showLineNumbers
{
    "@components": "https://cdn.company.com/components/{name}.json",
    "@hooks": "https://cdn.company.com/hooks/{name}.json",
    "@utils": "https://cdn.company.com/utils/{name}.json",
    "@prompts": "https://cdn.company.com/ai-prompts/{name}.json"
}
```

#### By Team or Department

```json title="components.json" showLineNumbers
{
    "@design": "https://create.company.com/registry/{name}.json",
    "@engineering": "https://eng.company.com/registry/{name}.json",
    "@marketing": "https://marketing.company.com/registry/{name}.json"
}
```

#### By Stability

```json title="components.json" showLineNumbers
{
    "@stable": "https://registry.company.com/stable/{name}.json",
    "@latest": "https://registry.company.com/beta/{name}.json",
    "@experimental": "https://registry.company.com/experimental/{name}.json"
}
```

---

## Getting Started

### Installing Resources

Once configured, you can install resources using the namespace syntax:

```bash
npx shadcn@latest add @v0/dashboard
```

or multiple resources at once:

```bash
npx shadcn@latest add @acme/header @lib/auth-utils @ai/chatbot-rules
```

### Quick Configuration

Add registries to your `components.json`:

```json title="components.json"
{
    "registries": {
        "@v0": "https://v0.dev/chat/b/{name}",
        "@acme": "https://registry.acme.com/resources/{name}.json"
    }
}
```

Then start installing:

```bash
npx shadcn@latest add @acme/button
```

---

## Registry Naming Convention

Registry names must follow these rules:

- Start with `@` symbol
- Contain only alphanumeric characters, hyphens, and underscores
- Examples of valid names: `@v0`, `@acme-ui`, `@my_company`

The pattern for referencing resources is: `@namespace/resource-name`

---

## GitHub and Namespaces

GitHub registry addresses and namespaces solve different problems.

Use a GitHub address when the registry is a public GitHub repository and you
want users to install without configuring `components.json`.

```bash
npx shadcn@latest add acme/ui/button
```

Use a namespace when you want a stable alias, custom hosting, authentication,
request headers, query parameters or private registry support.

```bash
npx shadcn@latest add @acme/button
```

See the [GitHub registry](/docs/registry/github) docs for more information.

---

## Configuration

Namespaced registries are configured in your `components.json` file under the
`registries` field.

### Basic Configuration

The simplest way to configure a registry is with a URL template string:

```json title="components.json"
{
    "registries": {
        "@v0": "https://v0.dev/chat/b/{name}",
        "@acme": "https://registry.acme.com/resources/{name}.json",
        "@lib": "https://lib.company.com/utilities/{name}",
        "@ai": "https://ai-resources.com/r/{name}.json"
    }
}
```

> **Note:** The `{name}` placeholder in the URL is automatically parsed and
> replaced with the resource name when you run
> `npx shadcn@latest add @namespace/resource-name`. For example, `@acme/button`
> becomes `https://registry.acme.com/resources/button.json`. See
> [URL Pattern System](#url-pattern-system) for more details.

### Advanced Configuration

For registries that require authentication or additional parameters, use the
object format:

```json title="components.json"
{
    "registries": {
        "@private": {
            "url": "https://api.company.com/registry/{name}.json",
            "headers": {
                "Authorization": "Bearer ${REGISTRY_TOKEN}",
                "X-API-Key": "${API_KEY}"
            },
            "params": {
                "version": "latest",
                "format": "json"
            }
        }
    }
}
```

> **Note:** Environment variables in the format `${VAR_NAME}` are automatically
> expanded from your environment (process.env). This works in URLs, headers, and
> params. For example, `${REGISTRY_TOKEN}` will be replaced with the value of
> `process.env.REGISTRY_TOKEN`. See
> [Authentication & Security](#authentication--security) for more details on
> using environment variables.

---

### URL Pattern System

Registry URLs support the following placeholders:

### `{name}` Placeholder (required)

The `{name}` placeholder is replaced with the resource name:

```json title="components.json" showLineNumbers
{
    "@acme": "https://registry.acme.com/{name}.json"
}
```

When installing `@acme/button`, the URL becomes:
`https://registry.acme.com/button.json` When installing `@acme/auth-utils`, the
URL becomes: `https://registry.acme.com/auth-utils.json`

### `{style}` Placeholder (optional)

The `{style}` placeholder is replaced with the current style configuration:

```json
{
    "@themes": "https://registry.example.com/{style}/{name}.json"
}
```

With style set to `new-york`, installing `@themes/card` resolves to:
`https://registry.example.com/new-york/card.json`

The style placeholder is optional. Use this when you want to serve different
versions of the same resource. For example, you can serve a different version of
a component for each style.

---

## Authentication & Security

### Environment Variables

Use environment variables to securely store credentials:

```json title="components.json"
{
    "registries": {
        "@private": {
            "url": "https://api.company.com/registry/{name}.json",
            "headers": {
                "Authorization": "Bearer ${REGISTRY_TOKEN}"
            }
        }
    }
}
```

Then set the environment variable:

```bash title=".env.local"
REGISTRY_TOKEN=your_secret_token_here
```

### Authentication Methods

#### Bearer Token (OAuth 2.0)

```json
{
    "@github": {
        "url": "https://api.github.com/repos/org/registry/contents/{name}.json",
        "headers": {
            "Authorization": "Bearer ${GITHUB_TOKEN}"
        }
    }
}
```

#### API Key in Headers

```json title="components.json" showLineNumbers
{
    "@private": {
        "url": "https://api.company.com/registry/{name}",
        "headers": {
            "X-API-Key": "${API_KEY}"
        }
    }
}
```

#### Basic Authentication

```json title="components.json" showLineNumbers
{
    "@internal": {
        "url": "https://registry.company.com/{name}.json",
        "headers": {
            "Authorization": "Basic ${BASE64_CREDENTIALS}"
        }
    }
}
```

#### Query Parameter Authentication

```json title="components.json" showLineNumbers
{
    "@secure": {
        "url": "https://registry.example.com/{name}.json",
        "params": {
            "api_key": "${API_KEY}",
            "client_id": "${CLIENT_ID}",
            "signature": "${REQUEST_SIGNATURE}"
        }
    }
}
```

#### Multiple Authentication Methods

Some registries require multiple authentication methods:

```json title="components.json" showLineNumbers
{
    "@enterprise": {
        "url": "https://api.enterprise.com/v2/registry/{name}",
        "headers": {
            "Authorization": "Bearer ${ACCESS_TOKEN}",
            "X-API-Key": "${API_KEY}",
            "X-Workspace-Id": "${WORKSPACE_ID}"
        },
        "params": {
            "version": "latest"
        }
    }
}
```

### Security Considerations

When working with namespaced registries, especially third-party or public ones,
security is paramount. Here's how we handle security:

### Resource Validation

All resources fetched from registries are validated against our registry item
schema before installation. This ensures:

- **Structure validation**: Resources must conform to the expected JSON schema
- **Type safety**: Resource types are validated (`registry:ui`, `registry:lib`,
  etc.)
- **No arbitrary code execution**: Resources are data files, not executable
  scripts

### Environment Variable Security

Environment variables used for authentication are:

- **Never logged**: The CLI never logs or displays environment variable values
- **Expanded at runtime**: Variables are only expanded when needed, not stored
- **Isolated per registry**: Each registry maintains its own authentication
  context

Example of secure configuration:

```json title="components.json" showLineNumbers
{
    "registries": {
        "@private": {
            "url": "https://api.company.com/registry/{name}.json",
            "headers": {
                "Authorization": "Bearer ${PRIVATE_REGISTRY_TOKEN}"
            }
        }
    }
}
```

Never commit actual tokens to version control. Use `.env.local`:

```bash title=".env.local"
PRIVATE_REGISTRY_TOKEN=actual_token_here
```

### HTTPS Enforcement

We strongly recommend using HTTPS for all registry URLs:

- **Encrypted transport**: Prevents man-in-the-middle attacks
- **Certificate validation**: Ensures you're connecting to the legitimate
  registry
- **Credential protection**: Headers and tokens are encrypted in transit

```json title="components.json" showLineNumbers
{
    "registries": {
        "@secure": "https://registry.example.com/{name}.json", // ✅ Good
        "@insecure": "http://registry.example.com/{name}.json" // ❌ Avoid
    }
}
```

### Content Security

Resources from registries are treated as data, not code:

1. **JSON parsing only**: Resources must be valid JSON
2. **Schema validation**: Must match the registry item schema
3. **File path restrictions**: Files can only be written to configured paths
4. **No script execution**: The CLI doesn't execute any code from registry
   resources

### Registry Trust Model

The namespace system operates on a trust model:

- **You trust what you install**: Only add registries you trust to your
  configuration
- **Explicit configuration**: Registries must be explicitly configured in
  `components.json`
- **No automatic registry discovery**: The CLI never automatically adds
  registries
- **Dependency transparency**: All dependencies are clearly listed in registry
  items

### Best Practices for Registry Operators

If you're running your own registry:

1. **Use HTTPS always**: Never serve registry content over HTTP
2. **Implement authentication**: Require API keys or tokens for private
   registries
3. **Rate limiting**: Protect your registry from abuse
4. **Content validation**: Validate resources before serving them

Example secure registry setup:

```json title="components.json" showLineNumbers
{
    "@company": {
        "url": "https://registry.company.com/v1/{name}.json",
        "headers": {
            "Authorization": "Bearer ${COMPANY_TOKEN}",
            "X-Registry-Version": "1.0"
        }
    }
}
```

### Inspecting Resources Before Installation

The CLI provides transparency about what's being installed. You can see the
payload of a registry item using the following command:

```bash
npx shadcn@latest view @acme/button
```

This will output the payload of the registry item to the console.

---

## Dependency Resolution

### Basic Dependency Resolution

Resources can have dependencies across different registries:

```json title="registry-item.json" showLineNumbers
{
    "name": "dashboard",
    "type": "registry:block",
    "registryDependencies": [
        "@shadcn/card", // From default registry
        "@v0/chart", // From v0 registry
        "@acme/data-table", // From acme registry
        "@lib/data-fetcher", // Utility library
        "@ai/analytics-prompt" // AI prompt resource
    ]
}
```

The CLI automatically resolves and installs all dependencies from their
respective registries.

### Advanced Dependency Resolution

Understanding how dependencies are resolved internally is important if you're
developing registries or need to customize third-party resources.

### How Resolution Works

When you run `npx shadcn@latest add @namespace/resource`, the CLI does the
following:

1. **Clears registry context** to start fresh
2. **Fetches the main resource** from the specified registry
3. **Recursively resolves dependencies** from their respective registries
4. **Applies topological sorting** to ensure proper installation order
5. **Deduplicates files** based on target paths (last one wins)
6. **Deep merges configurations** (tailwind, cssVars, css, envVars)

This means that if you run the following command:

```bash
npx shadcn@latest add @acme/auth @custom/login-form
```

The `login-form.ts` from `@custom/login-form` will override the `login-form.ts`
from `@acme/auth` because it's resolved last.

### Overriding Third-Party Resources

You can leverage the dependency resolution process to override any third-party
resource by adding them to your custom resource under `registryDependencies` and
overriding with your own custom values.

#### Example: Customizing a Third-Party Button

Let's say you want to customize a button from a vendor registry:

**1. Original vendor button** (`@vendor/button`):

```json title="button.json" showLineNumbers
{
    "name": "button",
    "type": "registry:ui",
    "files": [
        {
            "path": "components/ui/button.tsx",
            "type": "registry:ui",
            "content": "// Vendor's button implementation\nexport function Button() { ... }"
        }
    ],
    "cssVars": {
        "light": {
            "--button-bg": "blue"
        }
    }
}
```

**2. Create your custom override** (`@my-company/custom-button`):

```json title="custom-button.json" showLineNumbers
{
    "name": "custom-button",
    "type": "registry:ui",
    "registryDependencies": [
        "@vendor/button" // Import original first
    ],
    "cssVars": {
        "light": {
            "--button-bg": "purple" // Override the color
        }
    }
}
```

**3. Install your custom version**:

```bash
npx shadcn@latest add @my-company/custom-button
```

This installs the original button from `@vendor/button` and then overrides the
`cssVars` with your own custom values.

### Advanced Override Patterns

#### Extending Without Replacing

Keep the original and add extensions:

```json title="extended-table.json" showLineNumbers
{
    "name": "extended-table",
    "registryDependencies": ["@vendor/table"],
    "files": [
        {
            "path": "components/ui/table-extended.tsx",
            "content": "import { Table } from '@vendor/table'\n// Add your extensions\nexport function ExtendedTable() { ... }"
        }
    ]
}
```

This will install the original table from `@vendor/table` and then add your
extensions to `components/ui/table-extended.tsx`.

#### Partial Override (Multi-file Resources)

Override only specific files from a complex component:

```json title="custom-auth.json" showLineNumbers
{
    "name": "custom-auth",
    "registryDependencies": [
        "@vendor/auth" // Has multiple files
    ],
    "files": [
        {
            "path": "lib/auth-server.ts",
            "type": "registry:lib",
            "content": "// Your custom auth server"
        }
    ]
}
```

### Resolution Order Example

When you install `@custom/dashboard` that depends on multiple resources:

```json title="dashboard.json" showLineNumbers
{
    "name": "dashboard",
    "registryDependencies": [
        "@shadcn/card", // 1. Resolved first
        "@vendor/chart", // 2. Resolved second
        "@custom/card" // 3. Resolved last (overrides @shadcn/card)
    ]
}
```

Resolution order:

1. `@shadcn/card` - installs to `components/ui/card.tsx`
2. `@vendor/chart` - installs to `components/ui/chart.tsx`
3. `@custom/card` - overwrites `components/ui/card.tsx` (if same target)

### Key Resolution Features

1. **Source Tracking**: Each resource knows which registry it came from,
   avoiding naming conflicts
2. **Circular Dependency Prevention**: Automatically detects and prevents
   circular dependencies
3. **Smart Installation Order**: Dependencies are installed first, then the
   resources that use them

---

## Versioning

You can implement versioning for your registry resources using query parameters.
This allows users to pin specific versions or use different release channels.

### Basic Version Parameter

```json title="components.json" showLineNumbers
{
    "@versioned": {
        "url": "https://registry.example.com/{name}",
        "params": {
            "version": "v2"
        }
    }
}
```

This resolves `@versioned/button` to:
`https://registry.example.com/button?version=v2`

### Dynamic Version Selection

Use environment variables to control versions across your project:

```json title="components.json" showLineNumbers
{
    "@stable": {
        "url": "https://registry.company.com/{name}",
        "params": {
            "version": "${REGISTRY_VERSION}"
        }
    }
}
```

This allows you to:

- Set `REGISTRY_VERSION=v1.2.3` in production
- Override per environment (dev, staging, prod)

### Semantic Versioning

Implement semantic versioning with range support:

```json title="components.json" showLineNumbers
{
    "@npm-style": {
        "url": "https://registry.example.com/{name}",
        "params": {
            "semver": "^2.0.0",
            "prerelease": "${ALLOW_PRERELEASE}"
        }
    }
}
```

### Version Resolution Best Practices

1. **Use environment variables** for version control across environments
2. **Provide sensible defaults** using the `${VAR:-default}` syntax
3. **Document version schemes** clearly for registry users
4. **Support version pinning** for reproducible builds
5. **Implement version discovery** endpoints (e.g., `/versions/{name}`)
6. **Cache versioned resources** appropriately with proper cache headers

---

## CLI Commands

The shadcn CLI provides several commands for working with namespaced registries:

### Adding Resources

Install resources from any configured registry:

```bash
# Install from a specific registry
npx shadcn@latest add @v0/dashboard

# Install multiple resources
npx shadcn@latest add @acme/button @lib/utils @ai/prompt

# Install from URL directly
npx shadcn@latest add https://registry.example.com/button.json

# Install from local file
npx shadcn@latest add ./local-registry/button.json
```

### Viewing Resources

Inspect registry items before installation:

```bash
# View a resource from a registry
npx shadcn@latest view @acme/button

# View multiple resources
npx shadcn@latest view @v0/dashboard @shadcn/card

# View from URL
npx shadcn@latest view https://registry.example.com/button.json
```

The `view` command displays:

- Resource metadata (name, type, description)
- Dependencies and registry dependencies
- File contents that will be installed
- CSS variables and Tailwind configuration
- Required environment variables

### Searching Registries

Search for available resources in registries:

```bash
# Search a specific registry
npx shadcn@latest search @v0

# Search with query
npx shadcn@latest search @acme --query "auth"

# Search multiple registries
npx shadcn@latest search @v0 @acme @lib

# Limit results
npx shadcn@latest search @v0 --limit 10 --offset 20

# List all items (alias for search)
npx shadcn@latest list @acme
```

Search results include:

- Resource name and type
- Description
- Registry source

---

## Error Handling

### Registry Not Configured

If you reference a registry that isn't configured:

```bash
npx shadcn@latest add @non-existent/component
```

Error:

```txt
Unknown registry "@non-existent". Make sure it is defined in components.json as follows:
{
  "registries": {
    "@non-existent": "[URL_TO_REGISTRY]"
  }
}
```

### Missing Environment Variables

If required environment variables are not set:

```txt
Registry "@private" requires the following environment variables:

  • REGISTRY_TOKEN

Set the required environment variables to your .env or .env.local file.
```

### Resource Not Found

404 Not Found:

```txt
The item at https://registry.company.com/button.json was not found. It may not exist at the registry.
```

This usually means:

- The resource name is misspelled
- The resource doesn't exist in the registry
- The registry URL pattern is incorrect

### Authentication Failures

401 Unauthorized:

```txt
You are not authorized to access the item at https://api.company.com/button.json
Check your authentication credentials and environment variables.
```

403 Forbidden:

```txt
Access forbidden for https://api.company.com/button.json
Verify your API key has the necessary permissions.
```

---

## Creating Your Own Registry

To make your registry compatible with the namespace system, you can serve any
type of resource - components, libraries, utilities, AI prompts, themes,
configurations, or any other shareable code/content:

1. **Implement the registry item schema**: Your registry must return JSON that
   conforms to the [registry item schema](/docs/registry/registry-item-json).

2. **Support the URL pattern**: Include `{name}` in your URL template where the
   resource name will be inserted.

3. **Define resource types**: Use appropriate `type` fields to identify your
   resources (e.g., `registry:ui`, `registry:lib`, `registry:ai`,
   `registry:theme`, etc.).

4. **Handle authentication** (if needed): Accept authentication via headers or
   query parameters.

5. **Document your namespace**: Provide clear instructions for users to
   configure your registry:

```json title="components.json" showLineNumbers
{
    "registries": {
        "@your-registry": "https://your-domain.com/r/{name}.json"
    }
}
```

---

## Technical Details

### Parser Pattern

The namespace parser uses the following regex pattern:

```regex title="namespace-parser.js"
/^(@[a-zA-Z0-9](?:[a-zA-Z0-9-_]*[a-zA-Z0-9])?)\/(.+)$/
```

This ensures valid namespace formatting and proper component name extraction.

### Resolution Process

1. **Parse**: Extract namespace and component name from `@namespace/component`
2. **Lookup**: Find registry configuration for `@namespace`
3. **Build URL**: Replace placeholders with actual values
4. **Set Headers**: Apply authentication headers if configured
5. **Fetch**: Retrieve component from the resolved URL
6. **Validate**: Ensure response matches registry item schema
7. **Resolve Dependencies**: Recursively fetch any registry dependencies

### Cross-Registry Dependencies

When a component has dependencies from different registries, the resolver:

1. Maintains separate authentication contexts for each registry
2. Resolves each dependency from its respective source
3. Deduplicates files based on target paths
4. Merges configurations (tailwind, cssVars, etc.) from all sources

---

## Best Practices

1. **Use environment variables** for sensitive data like API keys and tokens
2. **Namespace your registry** with a unique, descriptive name
3. **Document authentication requirements** clearly for users
4. **Implement proper error responses** with helpful messages
5. **Cache registry responses** when possible to improve performance
6. **Support style variants** if your components have multiple themes

---

## Troubleshooting

### Resources not found

- Verify the registry URL is correct and accessible
- Check that the `{name}` placeholder is included in the URL
- Ensure the resource exists in the registry
- Confirm the resource type matches what the registry provides

### Authentication issues

- Confirm environment variables are set correctly
- Verify API keys/tokens are valid and not expired
- Check that headers are being sent in the correct format

### Dependency conflicts

- Review resources with the same name from different registries
- Use fully qualified names (`@namespace/resource`) to avoid ambiguity
- Check for circular dependencies between registries
- Ensure resource types are compatible when mixing registries

---
title: Authentication
description: Secure your registry with authentication for private and personalized components.
---

Authentication lets you run private registries, control who can access your
components, and give different teams or users different content. This guide
shows common authentication patterns and how to set them up.

Authentication enables these use cases:

- **Private Components**: Keep your business logic and internal components
  secure
- **Team-Specific Resources**: Give different teams different components
- **Access Control**: Limit who can see sensitive or experimental components
- **Usage Analytics**: See who's using which components in your organization
- **Licensing**: Control who gets premium or licensed components

## Common Authentication Patterns

### Token-Based Authentication

The most common approach uses Bearer tokens or API keys:

```json title="components.json"
{
    "registries": {
        "@private": {
            "url": "https://registry.company.com/{name}.json",
            "headers": {
                "Authorization": "Bearer ${REGISTRY_TOKEN}"
            }
        }
    }
}
```

Set your token in environment variables:

```bash title=".env.local"
REGISTRY_TOKEN=your_secret_token_here
```

### API Key Authentication

Some registries use API keys in headers:

```json title="components.json"
{
    "registries": {
        "@company": {
            "url": "https://api.company.com/registry/{name}.json",
            "headers": {
                "X-API-Key": "${API_KEY}",
                "X-Workspace-Id": "${WORKSPACE_ID}"
            }
        }
    }
}
```

### Query Parameter Authentication

For simpler setups, use query parameters:

```json title="components.json"
{
    "registries": {
        "@internal": {
            "url": "https://registry.company.com/{name}.json",
            "params": {
                "token": "${ACCESS_TOKEN}"
            }
        }
    }
}
```

This creates: `https://registry.company.com/button.json?token=your_token`

## Server-Side Implementation

Here's how to add authentication to your registry server:

### Next.js API Route Example

```typescript title="app/api/registry/[name]/route.ts"
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { name: string } },
) {
    // Get token from Authorization header.
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    // Or from query parameters.
    const queryToken = request.nextUrl.searchParams.get("token");

    // Check if token is valid.
    if (!isValidToken(token || queryToken)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if token can access this component.
    if (!hasAccessToComponent(token, params.name)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Return the component.
    const component = await getComponent(params.name);
    return NextResponse.json(component);
}

function isValidToken(token: string | null) {
    // Add your token validation logic here.
    // Check against database, JWT validation, etc.
    return token === process.env.VALID_TOKEN;
}

function hasAccessToComponent(token: string, componentName: string) {
    // Add role-based access control here.
    // Check if token can access specific component.
    return true; // Your logic here.
}
```

### Express.js Example

```javascript title="server.js"
app.get("/registry/:name.json", (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!isValidToken(token)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const component = getComponent(req.params.name);
    if (!component) {
        return res.status(404).json({ error: "Component not found" });
    }

    res.json(component);
});
```

## Advanced Authentication Patterns

### Team-Based Access

Give different teams different components:

```typescript title="api/registry/route.ts"
async function GET(request: NextRequest) {
    const token = extractToken(request);
    const team = await getTeamFromToken(token);

    // Get components for this team.
    const components = await getComponentsForTeam(team);
    return NextResponse.json(components);
}
```

### User-Personalized Registries

Give users components based on their preferences:

```typescript
async function GET(request: NextRequest) {
    const user = await authenticateUser(request);

    // Get user's style and framework preferences.
    const preferences = await getUserPreferences(user.id);

    // Get personalized component version.
    const component = await getPersonalizedComponent(params.name, preferences);

    return NextResponse.json(component);
}
```

### Temporary Access Tokens

Use expiring tokens for better security:

```typescript
interface TemporaryToken {
    token: string;
    expiresAt: Date;
    scope: string[];
}

async function validateTemporaryToken(token: string) {
    const tokenData = await getTokenData(token);

    if (!tokenData) return false;
    if (new Date() > tokenData.expiresAt) return false;

    return true;
}
```

## Multi-Registry Authentication

With [namespaced registries](/docs/registry/namespace), you can set up multiple
registries with different authentication:

```json title="components.json"
{
    "registries": {
        "@public": "https://public.company.com/{name}.json",
        "@internal": {
            "url": "https://internal.company.com/{name}.json",
            "headers": {
                "Authorization": "Bearer ${INTERNAL_TOKEN}"
            }
        },
        "@premium": {
            "url": "https://premium.company.com/{name}.json",
            "headers": {
                "X-License-Key": "${LICENSE_KEY}"
            }
        }
    }
}
```

This lets you:

- Mix public and private registries
- Use different authentication per registry
- Organize components by access level

## Security Best Practices

### Use Environment Variables

Never commit tokens to version control. Always use environment variables:

```bash title=".env.local"
REGISTRY_TOKEN=your_secret_token_here
API_KEY=your_api_key_here
```

Then reference them in `components.json`:

```json
{
    "registries": {
        "@private": {
            "url": "https://registry.company.com/{name}.json",
            "headers": {
                "Authorization": "Bearer ${REGISTRY_TOKEN}"
            }
        }
    }
}
```

### Use HTTPS

Always use HTTPS URLs for registries to protect your tokens in transit:

```json
{
    "@secure": "https://registry.company.com/{name}.json", // ✅
    "@insecure": "http://registry.company.com/{name}.json" // ❌
}
```

### Add Rate Limiting

Protect your registry from abuse:

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/registry", limiter);
```

### Rotate Tokens

Change access tokens regularly:

```typescript
// Create new token with expiration.
function generateToken() {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days.

    return { token, expiresAt };
}
```

### Log Access

Track registry access for security and analytics:

```typescript
async function logAccess(request: Request, component: string, userId: string) {
    await db.accessLog.create({
        timestamp: new Date(),
        userId,
        component,
        ip: request.ip,
        userAgent: request.headers["user-agent"],
    });
}
```

## Testing Authentication

Test your authenticated registry locally:

```bash
# Test with curl.
curl -H "Authorization: Bearer your_token" \
  https://registry.company.com/button.json

# Test with the CLI.
REGISTRY_TOKEN=your_token npx shadcn@latest add @private/button
```

## Error Handling

The shadcn CLI handles authentication errors gracefully:

- **401 Unauthorized**: Token is invalid or missing
- **403 Forbidden**: Token lacks permission for this resource
- **429 Too Many Requests**: Rate limit exceeded

### Custom Error Messages

Your registry server can return custom error messages in the response body, and
the CLI will display them to users:

```typescript
// Registry server returns custom error
return NextResponse.json(
    {
        error: "Unauthorized",
        message:
            "Your subscription has expired. Please renew at company.com/billing",
    },
    { status: 403 },
);
```

The user will see:

```txt
Your subscription has expired. Please renew at company.com/billing
```

This helps provide context-specific guidance:

```typescript
// Different error messages for different scenarios
if (!token) {
    return NextResponse.json(
        {
            error: "Unauthorized",
            message:
                "Authentication required. Set REGISTRY_TOKEN in your .env.local file",
        },
        { status: 401 },
    );
}

if (isExpiredToken(token)) {
    return NextResponse.json(
        {
            error: "Unauthorized",
            message: "Token expired. Request a new token at company.com/tokens",
        },
        { status: 401 },
    );
}

if (!hasTeamAccess(token, component)) {
    return NextResponse.json(
        {
            error: "Forbidden",
            message:
                `Component '${component}' is restricted to the Design team`,
        },
        { status: 403 },
    );
}
```

## Next Steps

To set up authentication with multiple registries and advanced patterns, see the
[Namespaced Registries](/docs/registry/namespace) documentation. It covers:

- Setting up multiple authenticated registries
- Using different authentication per namespace
- Cross-registry dependency resolution
- Advanced authentication patterns

---
title: MCP Server
description: MCP support for registry developers
---

The [shadcn MCP server](/docs/mcp) works out of the box with any
shadcn-compatible registry. You do not need to do anything special to enable MCP
support for your registry.

---

## Prerequisites

The MCP server works by requesting your registry index. Make sure you have a
registry item file at the root of your registry named `registry`.

For example, if your registry is hosted at `https://acme.com/r/[name].json`, you
should have a file at `https://acme.com/r/registry.json` or
`https://acme.com/r/registry` if you're using a JSON file extension.

This file must be a valid JSON file that conforms to the
[registry schema](/docs/registry/registry-json).

---

## Configuring MCP

Ask your registry consumers to configure your registry in their
`components.json` file and install the shadcn MCP server:

<Tabs defaultValue="claude">
  <TabsList>
    <TabsTrigger value="claude">Claude Code</TabsTrigger>
    <TabsTrigger value="cursor">Cursor</TabsTrigger>
    <TabsTrigger value="vscode">VS Code</TabsTrigger>
    <TabsTrigger value="codex">Codex</TabsTrigger>
    <TabsTrigger value="opencode">OpenCode</TabsTrigger>
  </TabsList>
  <TabsContent value="claude" className="mt-4">
    **Configure your registry** in your `components.json` file:

    ```json title="components.json" showLineNumbers
    {
      "registries": {
        "@acme": "https://acme.com/r/{name}.json"
      }
    }
    ```

    **Run the following command** in your project:

    ```bash
    npx shadcn@latest mcp init --client claude
    ```

    **Restart Claude Code** and try the following prompts:
       - Show me the components in the acme registry
       - Create a landing page using items from the acme registry

    **Note:** You can use `/mcp` command in Claude Code to debug the MCP server.

</TabsContent>

<TabsContent value="cursor" className="mt-4">
    **Configure your registry** in your `components.json` file:

    ```json title="components.json" showLineNumbers
    {
      "registries": {
        "@acme": "https://acme.com/r/{name}.json"
      }
    }
    ```
    **Run the following command** in your project:
       ```bash
       npx shadcn@latest mcp init --client cursor
       ```

    Open **Cursor Settings** and **Enable the MCP server** for shadcn. Then try the following prompts:
       - Show me the components in the acme registry
       - Create a landing page using items from the acme registry

</TabsContent>

<TabsContent value="vscode" className="mt-4">
    **Configure your registry** in your `components.json` file:

    ```json title="components.json" showLineNumbers
    {
      "registries": {
        "@acme": "https://acme.com/r/{name}.json"
      }
    }
    ```
    **Run the following command** in your project:
       ```bash
       npx shadcn@latest mcp init --client vscode
       ```

    Open `.vscode/mcp.json` and click **Start** next to the shadcn server. Then try the following prompts with GitHub Copilot:
       - Show me the components in the acme registry
       - Create a landing page using items from the acme registry

</TabsContent>

<TabsContent value="codex" className="mt-4">
    **Configure your registry** in your `components.json` file:

    ```json title="components.json" showLineNumbers
    {
      "registries": {
        "@acme": "https://acme.com/r/{name}.json"
      }
    }
    ```

    **Add the following configuration** to `~/.codex/config.toml`:
       ```toml
       [mcp_servers.shadcn]
       command = "npx"
       args = ["shadcn@latest", "mcp"]
       ```

    **Restart Codex** and try the following prompts:
       - Show me the components in the acme registry
       - Create a landing page using items from the acme registry

</TabsContent>

<TabsContent value="opencode" className="mt-4">
    **Configure your registry** in your `components.json` file:

    ```json title="components.json" showLineNumbers
    {
      "registries": {
        "@acme": "https://acme.com/r/{name}.json"
      }
    }
    ```

    **Run the following command** in your project:
       ```bash
       npx shadcn@latest mcp init --client opencode
       ```

    **Restart OpenCode** and try the following prompts:
       - Show me the components in the acme registry
       - Create a landing page using items from the acme registry

</TabsContent>
</Tabs>

You can read more about the MCP server in the [MCP documentation](/docs/mcp).

---

## Best Practices

Here are some best practices for MCP-compatible registries:

1. **Clear Descriptions**: Add concise, informative descriptions that help AI
   assistants understand what a registry item is for and how to use it.
2. **Proper Dependencies**: List all `dependencies` accurately so MCP can
   install them automatically.
3. **Registry Dependencies**: Use `registryDependencies` to indicate
   relationships between items.
4. **Consistent Naming**: Use kebab-case for component names and maintain
   consistency across your registry.

---
title: Open in v0
description: Integrate your registry with Open in v0.
---

If your registry is hosted and publicly accessible via a URL, you can open a
registry item in v0 by using the `https://v0.dev/chat/api/open?url=[URL]`
endpoint.

eg.
[https://v0.dev/chat/api/open?url=https://ui.shadcn.com/r/styles/new-york/login-01.json](https://v0.dev/chat/api/open?url=https://ui.shadcn.com/r/styles/new-york/login-01.json)

<Callout className="mt-6">
  **Important:** `Open in v0` does not support `cssVars`, `css`, `envVars`,
  namespaced registries, or advanced authentication methods.
</Callout>

## Button

See [Build your Open in v0 button](https://v0.dev/chat/button) for more
information on how to build your own `Open in v0` button.

Here's a simple example of how to add a `Open in v0` button to your site.

```tsx showLineNumbers
import { Button } from "@/components/ui/button";

export function OpenInV0Button({ url }: { url: string }) {
    return (
        <Button
            aria-label="Open in v0"
            className="h-8 gap-1 rounded-[6px] bg-black px-3 text-xs text-white hover:bg-black hover:text-white dark:bg-white dark:text-black"
            asChild
        >
            <a
                href={`https://v0.dev/chat/api/open?url=${url}`}
                target="_blank"
                rel="noreferrer"
            >
                Open in{" "}
                <svg
                    viewBox="0 0 40 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-current"
                >
                    <path
                        d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"
                        fill="currentColor"
                    >
                    </path>
                    <path
                        d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"
                        fill="currentColor"
                    >
                    </path>
                </svg>
            </a>
        </Button>
    );
}
```

```jsx
<OpenInV0Button url="https://example.com/r/hello-world.json" />;
```

## Authentication

Open in v0 only supports query parameter authentication. It does not support
namespaced registries or advanced authentication methods like Bearer tokens or
API keys in headers.

### Using Query Parameter Authentication

To add authentication to your registry for Open in v0, use a `token` query
parameter:

```
https://registry.company.com/r/hello-world.json?token=your_secure_token_here
```

When implementing this on your registry server:

1. Check for the `token` query parameter
2. Validate the token against your authentication system
3. Return a `401 Unauthorized` response if the token is invalid or missing
4. Both the shadcn CLI and Open in v0 will handle the 401 response and display
   an appropriate message to users

### Example Implementation

```typescript
// Next.js API route example
export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get("token");

    if (!isValidToken(token)) {
        return NextResponse.json(
            {
                error: "Unauthorized",
                message: "Invalid or missing token",
            },
            { status: 401 },
        );
    }

    // Return the registry item
    return NextResponse.json(registryItem);
}
```

<Callout className="mt-6">
  **Security Note:** Make sure to encrypt and expire tokens. Never expose
  production tokens in documentation or examples.
</Callout>

---
title: API Reference
description: Programmatic API for working with registries, schemas and presets.
---

The `shadcn` package exposes a set of programmatic APIs in addition to the CLI.
You can use these to fetch and resolve registry items, validate registry JSON,
and build custom tooling on top of the registry.

Each API is available under a dedicated subpath import.

```ts
import { getRegistryItems } from "shadcn/registry";
import { registryItemSchema } from "shadcn/schema";
```

<Callout className="mt-6">
  The CLI commands themselves are not part of the public API. Only the imports
  documented below are considered stable.
</Callout>

## shadcn/registry

Fetch and resolve items from configured registries.

Most functions accept an options object. The two options below are common to all
of them. In the examples that follow, `config` refers to this optional value —
omit it to use the built-in registries.

### config

- **Type:** `Partial<Config>`
- **Default:** built-in registries only

The resolved contents of your `components.json` file. Its `registries` field
maps a namespace (e.g. `@acme`) to a URL and any authentication headers or
environment variables required to reach it.

```ts showLineNumbers
import { getRegistryItems } from "shadcn/registry";

const items = await getRegistryItems(["@acme/login-form"], {
    config: {
        registries: {
            "@acme": "https://acme.com/r/{name}.json",
        },
    },
});
```

### useCache

- **Type:** `boolean`
- **Default:** `true`

Registry responses are cached **in memory for the lifetime of the process**,
keyed by the resolved URL. Because the in-flight promise is cached, concurrent
requests for the same URL are de-duplicated into a single fetch.

Leave this enabled for one-off scripts and CLI runs. Set it to `false` in
long-running processes (servers, watchers, the MCP server) where the registry
can change between requests and you need fresh data each time.

```ts
const fresh = await getRegistry("@shadcn", { useCache: false });
```

### getRegistry

Fetch a single registry by name.

```ts showLineNumbers
import { getRegistry } from "shadcn/registry";

const registry = await getRegistry("@acme", {
    config, // optional Partial<Config>
    useCache: true,
});
```

### getRegistryItems

Fetch one or more registry items by their qualified names.

```ts showLineNumbers
import { getRegistryItems } from "shadcn/registry";

const items = await getRegistryItems(["@acme/button", "@acme/card"], {
    config,
    useCache: true,
});
```

Returns an array of registry items:

```json showLineNumbers
[
    {
        "name": "button",
        "type": "registry:ui",
        "dependencies": ["@radix-ui/react-slot"],
        "files": [
            {
                "path": "ui/button.tsx",
                "type": "registry:ui",
                "content": "..."
            }
        ]
    }
]
```

### resolveRegistryItems

Resolve multiple items together with their registry dependencies, merged into a
single tree. Unlike [`getRegistryItems`](#getregistryitems), which returns the
items as a list, this walks each item's `registryDependencies` and flattens
everything — files, dependencies, CSS variables — into one installable object.

```ts showLineNumbers
import { resolveRegistryItems } from "shadcn/registry";

const tree = await resolveRegistryItems(
    ["@acme/button", "@acme/card", "@acme/dialog"],
    { config },
);
```

Returns a single merged tree:

```json showLineNumbers
{
    "dependencies": ["@radix-ui/react-slot", "@radix-ui/react-dialog"],
    "files": [
        { "path": "ui/button.tsx", "type": "registry:ui", "content": "..." },
        { "path": "ui/card.tsx", "type": "registry:ui", "content": "..." },
        { "path": "ui/dialog.tsx", "type": "registry:ui", "content": "..." }
    ],
    "cssVars": {
        "theme": {
            "font-heading": "Poppins, sans-serif"
        },
        "light": {
            "brand": "oklch(0.205 0.015 18)"
        },
        "dark": {
            "brand": "oklch(0.205 0.015 18)"
        }
    },
    "docs": ""
}
```

### getRegistries

Fetch the registry directory.

```ts showLineNumbers
import { getRegistries } from "shadcn/registry";

const registries = await getRegistries({ useCache: true });
```

Returns an array of registry entries:

```json
[
    {
        "name": "@shadcn",
        "url": "https://ui.shadcn.com/r/{name}.json",
        "homepage": "https://ui.shadcn.com"
    }
]
```

### searchRegistries

Search across one or more registries with fuzzy matching.

```ts showLineNumbers
import { searchRegistries } from "shadcn/registry";

const results = await searchRegistries(["@shadcn"], {
    query: "button",
    types: ["registry:component"],
    limit: 100,
    offset: 0,
    config,
    continueOnError: true, // skip (don't throw on) registries that fail to load
});
```

Returns matching items wrapped in pagination metadata:

```json
{
    "pagination": { "total": 1, "offset": 0, "limit": 100, "hasMore": false },
    "items": [
        {
            "name": "button",
            "type": "registry:ui",
            "description": "A button component.",
            "registry": "@shadcn",
            "addCommandArgument": "@shadcn/button"
        }
    ]
}
```

### loadRegistry

Read and resolve a local `registry.json` file from disk, following any `include`
references, and return the registry catalog.

```ts showLineNumbers
import { loadRegistry } from "shadcn/registry";

const catalog = await loadRegistry({
    cwd: process.cwd(), // defaults to process.cwd()
    registryFile: "registry.json", // defaults to "registry.json"
});
```

The returned catalog lists every item but **omits file contents** — like a built
`registry.json` index.

<Callout className="mt-6" title="How is this different from getRegistry?">
  [`getRegistry`](#getregistry) fetches a **remote** registry over the network
  (by namespace, URL or GitHub address) and expects the served catalog to
  already be flattened — it rejects catalogs that still use `include`.
  `loadRegistry` reads a **local** `registry.json` from disk and resolves
  `include` references itself.
</Callout>

### loadRegistryItem

Read a single item from a local `registry.json` by name, with its file contents
read from disk and inlined.

```ts showLineNumbers
import { loadRegistryItem } from "shadcn/registry";

const item = await loadRegistryItem("login-form", { cwd: process.cwd() });
```

Returns a fully resolved registry item with file contents:

```json
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "login-form",
    "type": "registry:component",
    "files": [
        {
            "path": "registry/new-york/login-form.tsx",
            "type": "registry:component",
            "content": "..."
        }
    ]
}
```

<Callout className="mt-6" title="How is this different from getRegistryItems?">
  [`getRegistryItems`](#getregistryitems) resolves items from a **remote**
  registry over the network. `loadRegistryItem` builds a single item on demand
  from your **local** source files, reading each file from disk. Use it in a
  dynamic route that serves `registry-item.json` responses.
</Callout>

### Errors

All registry functions throw typed errors that extend `RegistryError`. Use the
`RegistryErrorCode` enum or `instanceof` checks to handle them.

```ts showLineNumbers
import { RegistryError, RegistryNotFoundError } from "shadcn/registry";

try {
    await getRegistry("@unknown");
} catch (error) {
    if (error instanceof RegistryNotFoundError) {
        // handle missing registry
    }
}
```

Available error classes:

- `RegistryError`
- `RegistryNotFoundError`
- `RegistryUnauthorizedError`
- `RegistryForbiddenError`
- `RegistryFetchError`
- `RegistryNotConfiguredError`
- `RegistryLocalFileError`
- `RegistryParseError`
- `RegistryValidationError`
- `RegistryItemNotFoundError`
- `RegistriesIndexParseError`
- `RegistryMissingEnvironmentVariablesError`
- `RegistryInvalidNamespaceError`

## shadcn/schema

The Zod schemas used to validate `registry.json`, `registry-item.json` and
`components.json`. Useful for validating registry data in your own tooling.

```ts
import { registryItemSchema, registrySchema } from "shadcn/schema";

const result = registryItemSchema.safeParse(json);
if (!result.success) {
    console.error(result.error);
}
```

Key schemas:

- `registrySchema`
- `registryItemSchema`
- `registryItemFileSchema`
- `registryItemTypeSchema`
- `registryItemCssVarsSchema`
- `registryItemTailwindSchema`
- `registryBaseColorSchema`
- `configSchema`
- `presetSchema`

Inferred types are exported alongside them:

- `Registry`
- `RegistryItem`
- `RegistryBaseItem`
- `RegistryFontItem`
- `Preset`
- `ConfigJson`

## shadcn/preset

Encode, decode and validate theme presets, plus the preset option constants used
by the theme editor.

### encodePreset

Encode a `Partial<PresetConfig>` into a short, URL-safe preset code. Any fields
you omit fall back to `DEFAULT_PRESET_CONFIG`.

```ts showLineNumbers
import { encodePreset } from "shadcn/preset";

const code = encodePreset({
    style: "vega",
    baseColor: "stone",
    theme: "blue",
    radius: "large",
    font: "geist",
});
```

Returns a version-prefixed string:

```ts showLineNumbers
"bJ4FLU0";
```

### decodePreset

Decode a preset code back into a full `PresetConfig`. Returns `null` if the code
is missing or invalid.

```ts showLineNumbers
import { decodePreset } from "shadcn/preset";

const config = decodePreset("bJ4FLU0");
```

Returns the resolved config (omitted fields are filled with their defaults):

```json
{
    "style": "vega",
    "baseColor": "stone",
    "theme": "blue",
    "chartColor": "neutral",
    "iconLibrary": "lucide",
    "font": "geist",
    "fontHeading": "inherit",
    "radius": "large",
    "menuAccent": "subtle",
    "menuColor": "default"
}
```

```ts
decodePreset("not-a-code"); // null
```

### Other exports

Additional functions for validating codes and generating random presets:

- `isPresetCode`
- `isValidPreset`
- `generateRandomConfig`
- `generateRandomPreset`
- `toBase62`
- `fromBase62`

Constants:

- `PRESET_BASES`
- `PRESET_STYLES`
- `PRESET_BASE_COLORS`
- `PRESET_THEMES`
- `PRESET_ICON_LIBRARIES`
- `PRESET_FONTS`
- `PRESET_FONT_HEADINGS`
- `PRESET_RADII`
- `PRESET_MENU_ACCENTS`
- `PRESET_MENU_COLORS`
- `PRESET_CHART_COLORS`
- `DEFAULT_PRESET_CONFIG`

---
title: registry.json
description: Schema for running your own component registry.
---

The `registry.json` schema is used to define your custom component registry.

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "shadcn",
    "homepage": "https://ui.shadcn.com",
    "items": [
        {
            "name": "hello-world",
            "type": "registry:block",
            "title": "Hello World",
            "description": "A simple hello world component.",
            "registryDependencies": [
                "button",
                "@acme/input-form",
                "https://example.com/r/foo"
            ],
            "dependencies": ["is-even@3.0.0", "motion"],
            "files": [
                {
                    "path": "registry/default/hello-world/hello-world.tsx",
                    "type": "registry:component"
                }
            ]
        }
    ]
}
```

You can also organize a large registry across multiple `registry.json` files
using `include`.

{/* prettier-ignore */}

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "acme",
    "homepage": "https://acme.com",
    "include": [
        "components/ui/registry.json",
        "hooks/registry.json"
    ]
}
```

Public GitHub repositories use the same source registry format. The CLI reads
the root `registry.json`, resolves `include`, and installs files from the
repository. See the [GitHub registry](/docs/registry/github) docs for more
information.

## Definitions

You can see the JSON Schema for `registry.json`
[here](https://ui.shadcn.com/schema/registry.json).

### $schema

The `$schema` property is used to specify the schema for the `registry.json`
file.

```json title="registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json"
}
```

### name

The `name` property is used to specify the name of your registry. This is used
for data attributes and other metadata.

```json title="registry.json" showLineNumbers
{
    "name": "acme"
}
```

### homepage

The homepage of your registry. This is used for data attributes and other
metadata.

```json title="registry.json" showLineNumbers
{
    "homepage": "https://acme.com"
}
```

### include

The `include` property is used to compose a registry from other `registry.json`
files.

{/* prettier-ignore */}

```json title="registry.json" showLineNumbers
{
    "include": [
        "components/ui/registry.json",
        "hooks/registry.json"
    ]
}
```

Each include path must be a relative path to an explicit `registry.json` file.
Folder shorthand is not supported.

{/* prettier-ignore */}

```json title="registry.json" showLineNumbers
{
    "include": [
        "components/ui/registry.json"
    ]
}
```

Included `registry.json` files may omit `name` and `homepage`. These fields are
required only on the root `registry.json`.

```json title="components/ui/registry.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "items": [
        {
            "name": "button",
            "type": "registry:ui",
            "files": [
                {
                    "path": "button.tsx",
                    "type": "registry:ui"
                }
            ]
        }
    ]
}
```

When `shadcn build` resolves includes, item file paths are read relative to the
`registry.json` file that declares the item. The generated registry output is
flattened and does not contain `include`.

Registry item names must be unique across the resolved registry, including all
included files.

### items

The `items` in your registry. Each item must implement the
[registry-item schema specification](https://ui.shadcn.com/schema/registry-item.json).

```json title="registry.json" showLineNumbers
{
    "items": [
        {
            "name": "hello-world",
            "type": "registry:block",
            "title": "Hello World",
            "description": "A simple hello world component.",
            "registryDependencies": [
                "button",
                "@acme/input-form",
                "https://example.com/r/foo"
            ],
            "dependencies": ["is-even@3.0.0", "motion"],
            "files": [
                {
                    "path": "registry/default/hello-world/hello-world.tsx",
                    "type": "registry:component"
                }
            ]
        }
    ]
}
```

The root `registry.json` must define at least one of `items` or `include`. If
`items` is omitted, it defaults to an empty array.

See the [registry-item schema documentation](/docs/registry/registry-item-json)
for more information.

---
title: registry-item.json
description: Specification for registry items.
---

The `registry-item.json` schema is used to define your custom registry items.

```json title="registry-item.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "hello-world",
    "type": "registry:block",
    "title": "Hello World",
    "description": "A simple hello world component.",
    "registryDependencies": [
        "button",
        "@acme/input-form",
        "https://example.com/r/foo"
    ],
    "dependencies": ["is-even@3.0.0", "motion"],
    "devDependencies": ["tw-animate-css"],
    "files": [
        {
            "path": "registry/new-york/hello-world/hello-world.tsx",
            "type": "registry:component"
        },
        {
            "path": "registry/new-york/hello-world/use-hello-world.ts",
            "type": "registry:hook"
        }
    ],
    "cssVars": {
        "theme": {
            "font-heading": "Poppins, sans-serif"
        },
        "light": {
            "brand": "oklch(0.205 0.015 18)"
        },
        "dark": {
            "brand": "oklch(0.205 0.015 18)"
        }
    }
}
```

<div className="mt-6 flex items-center gap-2">
  <Link href="/docs/registry/examples">See more examples</Link>
</div>

## Definitions

You can see the JSON Schema for `registry-item.json`
[here](https://ui.shadcn.com/schema/registry-item.json).

### $schema

The `$schema` property is used to specify the schema for the
`registry-item.json` file.

```json title="registry-item.json" showLineNumbers
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json"
}
```

### name

The name of the item. This is used to identify the item in the registry. It
should be unique for your registry.

```json title="registry-item.json" showLineNumbers
{
    "name": "hello-world"
}
```

### title

A human-readable title for your registry item. Keep it short and descriptive.

```json title="registry-item.json" showLineNumbers
{
    "title": "Hello World"
}
```

### description

A description of your registry item. This can be longer and more detailed than
the `title`.

```json title="registry-item.json" showLineNumbers
{
    "description": "A simple hello world component."
}
```

### type

The `type` property is used to specify the type of your registry item. This is
used to determine the type and target path of the item when resolved for a
project.

```json title="registry-item.json" showLineNumbers
{
    "type": "registry:block"
}
```

The following types are supported:

| Type                 | Description                                       |
| -------------------- | ------------------------------------------------- |
| `registry:base`      | Use for entire design systems.                    |
| `registry:block`     | Use for complex components with multiple files.   |
| `registry:component` | Use for simple components.                        |
| `registry:font`      | Use for fonts.                                    |
| `registry:lib`       | Use for lib and utils.                            |
| `registry:hook`      | Use for hooks.                                    |
| `registry:ui`        | Use for UI components and single-file primitives. |
| `registry:page`      | Use for page or file-based routes.                |
| `registry:file`      | Use for miscellaneous files.                      |
| `registry:style`     | Use for registry styles. eg. `new-york`.          |
| `registry:theme`     | Use for themes.                                   |
| `registry:item`      | Use for universal registry items.                 |

### author

The `author` property is used to specify the author of the registry item.

It can be unique to the registry item or the same as the author of the registry.

```json title="registry-item.json" showLineNumbers
{
    "author": "John Doe <john@doe.com>"
}
```

### dependencies

The `dependencies` property is used to specify the dependencies of your registry
item. This is for `npm` packages.

Use `@version` to specify the version of your registry item.

```json title="registry-item.json" showLineNumbers
{
    "dependencies": [
        "@radix-ui/react-accordion",
        "zod",
        "lucide-react",
        "name@1.0.2"
    ]
}
```

### devDependencies

The `devDependencies` property is used to specify the dev dependencies of your
registry item. These are `npm` packages that are only needed during development.

Use `@version` to specify the version of the package.

```json title="registry-item.json" showLineNumbers
{
    "devDependencies": ["tw-animate-css", "name@1.2.0"]
}
```

### registryDependencies

Used for registry dependencies. Each entry is an item address.

- For `shadcn/ui` registry items such as `button`, `input`, `select`, etc use
  the name eg. `['button', 'input', 'select']`.
- For namespaced registry items, use `@namespace/item-name` eg.
  `['@acme/input-form']`.
- For GitHub registry items, use `owner/repo/item-name` eg.
  `['acme/ui/button']`. For published registries, prefer a tag or full commit
  SHA eg. `['acme/ui/button#v1.2.0']`.
- For custom registry items use the URL of the registry item eg.
  `['https://example.com/r/hello-world.json']`.
- For local registry item files use a file path eg. `['./hello-world.json']`.

```json title="registry-item.json" showLineNumbers
{
    "registryDependencies": [
        "button",
        "@acme/input-form",
        "acme/ui/button#v1.2.0",
        "https://example.com/r/editor.json",
        "./editor.json"
    ]
}
```

Note: Bare names keep their existing behavior. `button` means the built-in
shadcn `button` item, not an item from the same GitHub repository. For
same-repository GitHub dependencies, use the full GitHub item address.

Refs are not inherited across dependencies. If a GitHub dependency should be
reproducible, pin that dependency to its own tag or full commit SHA.

See the [GitHub registry](/docs/registry/github) docs for more information.

### files

The `files` property is used to specify the files of your registry item. Each
file has a `path`, `type` and `target` (optional) property.

**The `target` property is required for `registry:page` and `registry:file`
types.**

```json title="registry-item.json" showLineNumbers
{
    "files": [
        {
            "path": "registry/new-york/hello-world/page.tsx",
            "type": "registry:page",
            "target": "app/hello/page.tsx"
        },
        {
            "path": "registry/new-york/hello-world/hello-world.tsx",
            "type": "registry:component"
        },
        {
            "path": "registry/new-york/hello-world/use-hello-world.ts",
            "type": "registry:hook"
        },
        {
            "path": "registry/new-york/hello-world/.env",
            "type": "registry:file",
            "target": "~/.env"
        }
    ]
}
```

#### path

The `path` property is used to specify the path to the file in your registry.
This path is used by the build script to parse, transform and build the registry
JSON payload.

#### type

The `type` property is used to specify the type of the file. See the
[type](#type) section for more information.

#### target

The `target` property is used to indicate where the file should be placed in a
project. This is optional and only required for `registry:page` and
`registry:file` types.

By default, the `shadcn` cli will read a project's `components.json` file to
determine the target path. For some files, such as routes or config you can
specify the target path manually.

Use `~` to refer to the root of the project e.g `~/foo.config.js`.

You can also use registry target placeholders to place files under the
directories configured by the user's `components.json`. These placeholders are
only supported at the start of `target` and are independent of the project's
import prefix. For example, `@ui/button.tsx` works whether the project imports
components with `@/`, `#`, package imports or workspace exports.

| Placeholder    | Resolves to          |
| -------------- | -------------------- |
| `@components/` | `aliases.components` |
| `@ui/`         | `aliases.ui`         |
| `@lib/`        | `aliases.lib`        |
| `@hooks/`      | `aliases.hooks`      |

Use these placeholders when you want a registry item to install into the
project's configured shadcn directories without hardcoding `components`, `src`
or workspace package paths. Anything after the placeholder is preserved, so
`@ui/ai/prompt-input.tsx` installs under the user's configured `ui` directory at
`ai/prompt-input.tsx`.

```json title="registry-item.json" showLineNumbers
{
    "files": [
        {
            "path": "registry/new-york/example/button.tsx",
            "type": "registry:ui",
            "target": "@ui/button.tsx"
        },
        {
            "path": "registry/new-york/example/prompt-input.tsx",
            "type": "registry:ui",
            "target": "@ui/ai/prompt-input.tsx"
        },
        {
            "path": "registry/new-york/example/card.tsx",
            "type": "registry:component",
            "target": "@components/card.tsx"
        },
        {
            "path": "registry/new-york/example/helper.ts",
            "type": "registry:lib",
            "target": "@lib/helper.ts"
        },
        {
            "path": "registry/new-york/example/use-demo.ts",
            "type": "registry:hook",
            "target": "@hooks/use-demo.ts"
        }
    ]
}
```

The `target` property decides where the file is written. It can point to a
different shadcn directory than the file `type`.

```json title="registry-item.json" showLineNumbers
{
    "files": [
        {
            "path": "registry/new-york/example/format-date.ts",
            "type": "registry:ui",
            "target": "@lib/format-date.ts"
        }
    ]
}
```

Unknown placeholders are treated as regular target paths. For example,
`@foo/bar.ts` is written as `foo/bar.ts`. Embedded placeholders such as
`components/@ui/button.tsx` are also treated as regular paths.

<Callout>
  `@utils/` is not supported because `utils` points to a file, not a directory.
</Callout>

### tailwind

**DEPRECATED:** Use `cssVars.theme` instead for Tailwind v4 projects.

The `tailwind` property is used for tailwind configuration such as `theme`,
`plugins` and `content`.

You can use the `tailwind.config` property to add colors, animations and plugins
to your registry item.

```json title="registry-item.json" showLineNumbers
{
    "tailwind": {
        "config": {
            "theme": {
                "extend": {
                    "colors": {
                        "brand": "hsl(var(--brand))"
                    },
                    "keyframes": {
                        "wiggle": {
                            "0%, 100%": { "transform": "rotate(-3deg)" },
                            "50%": { "transform": "rotate(3deg)" }
                        }
                    },
                    "animation": {
                        "wiggle": "wiggle 1s ease-in-out infinite"
                    }
                }
            }
        }
    }
}
```

### cssVars

Use to define CSS variables for your registry item.

```json title="registry-item.json" showLineNumbers
{
    "cssVars": {
        "theme": {
            "font-heading": "Poppins, sans-serif"
        },
        "light": {
            "brand": "20 14.3% 4.1%",
            "radius": "0.5rem"
        },
        "dark": {
            "brand": "20 14.3% 4.1%"
        }
    }
}
```

### css

Use `css` to add new rules to the project's CSS file eg. `@layer base`,
`@layer components`, `@utility`, `@keyframes`, `@plugin`, etc.

```json title="registry-item.json" showLineNumbers
{
    "css": {
        "@plugin @tailwindcss/typography": {},
        "@plugin foo": {},
        "@layer base": {
            "body": {
                "font-size": "var(--text-base)",
                "line-height": "1.5"
            }
        },
        "@layer components": {
            "button": {
                "background-color": "var(--color-primary)",
                "color": "var(--color-white)"
            }
        },
        "@utility text-magic": {
            "font-size": "var(--text-base)",
            "line-height": "1.5"
        },
        "@keyframes wiggle": {
            "0%, 100%": {
                "transform": "rotate(-3deg)"
            },
            "50%": {
                "transform": "rotate(3deg)"
            }
        }
    }
}
```

### envVars

Use `envVars` to add environment variables to your registry item.

```json title="registry-item.json" showLineNumbers
{
    "envVars": {
        "NEXT_PUBLIC_APP_URL": "http://localhost:4000",
        "DATABASE_URL": "postgresql://postgres:postgres@localhost:5432/postgres",
        "OPENAI_API_KEY": ""
    }
}
```

Environment variables are added to the `.env.local` or `.env` file. Existing
variables are not overwritten.

<Callout>

**IMPORTANT:** Use `envVars` to add development or example variables. Do NOT use
it to add production variables.

</Callout>

### font

The `font` property is required for `registry:font` items. It configures the
font family, provider, import name, CSS variable, and the npm package to install
for non-Next.js projects.

```json title="registry-item.json" showLineNumbers
{
    "font": {
        "family": "'Inter Variable', sans-serif",
        "provider": "google",
        "import": "Inter",
        "variable": "--font-sans",
        "subsets": ["latin"],
        "dependency": "@fontsource-variable/inter"
    }
}
```

| Property     | Type       | Required | Description                                                                               |
| ------------ | ---------- | -------- | ----------------------------------------------------------------------------------------- |
| `family`     | `string`   | Yes      | The CSS font-family value.                                                                |
| `provider`   | `string`   | Yes      | The font provider. Currently only `google` is supported.                                  |
| `import`     | `string`   | Yes      | The import name for the font from `next/font/google`.                                     |
| `variable`   | `string`   | Yes      | The CSS variable name for the font (e.g., `--font-sans`, `--font-mono`).                  |
| `weight`     | `string[]` | No       | Array of font weights to include.                                                         |
| `subsets`    | `string[]` | No       | Array of font subsets to include.                                                         |
| `selector`   | `string`   | No       | CSS selector to apply the font to. Defaults to `html`.                                    |
| `dependency` | `string`   | No       | The npm package to install for non-Next.js projects (e.g., `@fontsource-variable/inter`). |

### docs

Use `docs` to show custom documentation or message when installing your registry
item via the CLI.

```json title="registry-item.json" showLineNumbers
{
    "docs": "To get an OPENAI_API_KEY, sign up for an account at https://platform.openai.com."
}
```

### categories

Use `categories` to organize your registry item.

```json title="registry-item.json" showLineNumbers
{
    "categories": ["sidebar", "dashboard"]
}
```

### meta

Use `meta` to add additional metadata to your registry item. You can add any
key/value pair that you want to be available to the registry item.

```json title="registry-item.json" showLineNumbers
{
    "meta": { "foo": "bar" }
}
```
