# LearnHub Branding Guide 🎨

## Logo Usage

### Logo Location
- **File**: `/public/logo.png`
- **Original**: `/logo.png` (root directory)

### Where the Logo Appears

#### 1. Authentication Page
- **Size**: 96x96px (h-24 w-24)
- **Style**: Perfect circle (rounded-full) with white background
- **Position**: Center of the card header
- **Effect**: Shadow-xl and ring-4 with primary color
- **Padding**: p-2 for breathing room

#### 2. Student Dashboard Header
- **Size**: 48x48px (h-12 w-12)
- **Style**: Perfect circle (rounded-full) with white background
- **Position**: Top-left corner, sticky header
- **Effect**: Shadow-lg and ring-2 with primary color
- **Padding**: p-1.5 for breathing room

#### 3. Teacher Dashboard Header
- **Size**: 48x48px (h-12 w-12)
- **Style**: Perfect circle (rounded-full) with white background
- **Position**: Top-left corner, sticky header
- **Effect**: Shadow-lg and ring-2 with primary color
- **Padding**: p-1.5 for breathing room

#### 4. 404 Not Found Page
- **Size**: 80x80px (h-20 w-20)
- **Style**: Perfect circle (rounded-full) with white background
- **Position**: Center above the 404 text
- **Effect**: Shadow-xl and ring-4 with primary color
- **Padding**: p-2 for breathing room

#### 5. Browser Tab (Favicon)
- **File**: `/public/logo.png`
- **Format**: PNG
- **Usage**: Automatically displayed in browser tabs

## Color Scheme

### Light Mode
- **Primary**: `rgb(168, 67, 112)` - Pink
- **Accent**: `rgb(241, 196, 230)` - Light Pink
- **Background**: `rgb(250, 245, 250)` - Very Light Pink
- **Foreground**: `rgb(80, 24, 84)` - Deep Purple

### Dark Mode
- **Primary**: `rgb(163, 0, 76)` - Deep Pink
- **Accent**: `rgb(70, 55, 83)` - Purple
- **Background**: `rgb(34, 29, 39)` - Dark Purple
- **Foreground**: `rgb(210, 196, 222)` - Light Purple

## Typography

### Font Family
- **Primary**: Belanosima (Google Fonts)
- **Fallback**: ui-sans-serif, sans-serif, system-ui

### Usage
- **Headings**: Bold, gradient text (primary to accent)
- **Body**: Regular weight
- **Buttons**: Medium weight

## Logo Styling Classes

### Standard Logo Container (Headers)
```tsx
<div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-card p-1.5 shadow-lg ring-2 ring-primary/20">
  <img src="/logo.png" alt="LearnHub Logo" className="h-full w-full object-contain rounded-full" />
</div>
```

### Large Logo (Auth Page & 404)
```tsx
<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white dark:bg-card p-2 shadow-xl ring-4 ring-primary/20">
  <img src="/logo.png" alt="LearnHub Logo" className="h-full w-full object-contain rounded-full" />
</div>
```

### Key Design Elements
- **Shape**: Always `rounded-full` for perfect circles
- **Background**: `bg-white dark:bg-card` for contrast
- **Padding**: `p-1.5` (small) or `p-2` (large) for breathing room
- **Shadow**: `shadow-lg` or `shadow-xl` for depth
- **Ring**: `ring-2` or `ring-4` with `ring-primary/20` for accent
- **Image**: `object-contain` to preserve aspect ratio

## Brand Name

### Display
- **Name**: LearnHub
- **Style**: Gradient text from primary to accent
- **Class**: `bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`

### Taglines
- **Student Portal**: "Student Portal"
- **Teacher Portal**: "Teacher Portal"
- **Auth Page**: "Sign in to access your learning dashboard"

## Visual Effects

### Shadows
- **Small**: `shadow-lg`
- **Large**: `shadow-xl`
- **Cards**: `shadow-lg hover:shadow-xl transition-shadow`

### Rings
- **Logo**: `ring-2 ring-primary/20` or `ring-4 ring-primary/20`
- **Focus**: `ring-primary`

### Gradients
- **Background**: `bg-gradient-to-br from-primary/5 via-background to-accent/5`
- **Text**: `bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`
- **Cards**: `bg-gradient-to-r from-primary/5 to-accent/5`

## Accessibility

- **Alt Text**: Always use "LearnHub Logo"
- **Contrast**: Ensure text meets WCAG AA standards
- **Focus States**: Visible focus indicators on all interactive elements

## Meta Tags

### Page Title
```html
<title>LearnHub - Interactive Learning Platform</title>
```

### Description
```html
<meta name="description" content="LearnHub - A collaborative learning platform for teachers and students with notes, mind maps, and audio lessons" />
```

### Open Graph
```html
<meta property="og:title" content="LearnHub - Interactive Learning Platform" />
<meta property="og:image" content="/logo.png" />
```

---

**Maintain consistency across all pages and components!** 🎨✨
