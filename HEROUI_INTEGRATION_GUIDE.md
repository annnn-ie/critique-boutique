# HeroUI Integration Guide

This guide shows how to integrate [HeroUI](https://www.heroui.com/docs/guide/introduction) components throughout your Critique Boutique app.

## 🚀 Quick Start

HeroUI has been successfully installed and configured in your project. Here's what was set up:

### 1. Installation
```bash
npm install @heroui/react framer-motion
```

### 2. Configuration
- **Tailwind Config**: Updated `tailwind.config.ts` with HeroUI plugin
- **App Provider**: Wrapped your app with `HeroUIProvider` in `App.tsx`
- **Demo Route**: Added `/heroui-demo` route to showcase components

## 📋 Available HeroUI Components

HeroUI provides 210+ beautiful, accessible components. Here are the key categories:

### 🎨 Layout Components
- `Card`, `CardBody`, `CardHeader`, `CardFooter`
- `Navbar`, `NavbarBrand`, `NavbarContent`, `NavbarItem`
- `Sidebar`, `Drawer`, `Modal`
- `Container`, `Grid`, `Spacer`

### 🎯 Form Components
- `Input`, `Textarea`, `Select`, `SelectItem`
- `Checkbox`, `RadioGroup`, `Radio`
- `Switch`, `Slider`, `DatePicker`
- `Button`, `Link`

### 🎪 Interactive Components
- `Dropdown`, `DropdownTrigger`, `DropdownMenu`, `DropdownItem`
- `Popover`, `PopoverTrigger`, `PopoverContent`
- `Tooltip`, `Modal`, `Accordion`
- `Tabs`, `Tab`, `Breadcrumbs`

### 🎨 Display Components
- `Avatar`, `Badge`, `Chip`, `Progress`
- `Skeleton`, `Spinner`, `Image`
- `User`, `Code`, `Divider`

### 📊 Data Components
- `Table`, `Pagination`
- `Calendar`, `DateRangePicker`
- `Autocomplete`, `Listbox`

## 🔄 Replacing Existing Components

### Example 1: Replace Custom Input with HeroUI Input

**Before (Custom Input):**
```tsx
<input
  type="text"
  value={names}
  onChange={(e) => setNames(e.target.value)}
  placeholder="e.g., Lorem, Ipsum, Dolor"
  className="w-80 px-4 py-3 text-neutral-50 placeholder-neutral-400 border-b border-neutral-500 outline-none bg-transparent text-center text-lg transition-colors duration-200"
/>
```

**After (HeroUI Input):**
```tsx
import { Input } from '@heroui/react';

<Input
  type="text"
  value={names}
  onValueChange={setNames}
  placeholder="e.g., Lorem, Ipsum, Dolor"
  variant="bordered"
  size="lg"
  className="w-80 text-center"
  classNames={{
    input: "text-center",
    inputWrapper: "bg-transparent border-neutral-500 hover:border-neutral-400 focus-within:border-neutral-300"
  }}
/>
```

### Example 2: Replace Custom Button with HeroUI Button

**Before (Custom Button):**
```tsx
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
  Click me
</button>
```

**After (HeroUI Button):**
```tsx
import { Button } from '@heroui/react';

<Button 
  color="primary" 
  variant="solid"
  size="md"
  onPress={handleClick}
>
  Click me
</Button>
```

### Example 3: Replace Custom Modal with HeroUI Modal

**Before (Custom Modal):**
```tsx
{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md">
      <h2>Modal Title</h2>
      <p>Modal content...</p>
      <button onClick={closeModal}>Close</button>
    </div>
  </div>
)}
```

**After (HeroUI Modal):**
```tsx
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@heroui/react';

const { isOpen, onOpen, onClose } = useDisclosure();

<Button onPress={onOpen}>Open Modal</Button>

<Modal isOpen={isOpen} onClose={onClose}>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalBody>
          <p>Modal content...</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={onClose}>
            Action
          </Button>
        </ModalFooter>
      </>
    )}
  </ModalContent>
</Modal>
```

## 🎨 Customizing HeroUI Components

### 1. Using ClassNames Prop
```tsx
<Button
  color="primary"
  className="custom-button"
  classNames={{
    base: "bg-gradient-to-r from-purple-500 to-pink-500",
    content: "text-white font-bold"
  }}
>
  Custom Button
</Button>
```

### 2. Using Variants and Colors
```tsx
// Different variants
<Button variant="solid">Solid</Button>
<Button variant="bordered">Bordered</Button>
<Button variant="light">Light</Button>
<Button variant="flat">Flat</Button>
<Button variant="faded">Faded</Button>
<Button variant="shadow">Shadow</Button>
<Button variant="ghost">Ghost</Button>

// Different colors
<Button color="default">Default</Button>
<Button color="primary">Primary</Button>
<Button color="secondary">Secondary</Button>
<Button color="success">Success</Button>
<Button color="warning">Warning</Button>
<Button color="danger">Danger</Button>
```

### 3. Responsive Design
```tsx
<Card className="w-full md:w-1/2 lg:w-1/3">
  <CardBody>
    <p className="text-sm md:text-base lg:text-lg">Responsive text</p>
  </CardBody>
</Card>
```

## 🎯 Integration Examples for Your App

### 1. Enhanced Card Information Modal

Replace your current card information display with a HeroUI Modal:

```tsx
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Divider } from '@heroui/react';

{selectedCard && (
  <Modal isOpen={showInformation} onClose={() => setShowInformation(false)}>
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">{selectedCard.name.title}</h2>
            <Chip color="primary" variant="flat">{selectedCard.critique.title}</Chip>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Role Description</h3>
                <p className="text-neutral-600">
                  Detailed description of the {selectedCard.name.title} role...
                </p>
              </div>
              <Divider />
              <div>
                <h3 className="text-lg font-semibold mb-2">Critique Focus</h3>
                <p className="text-neutral-600">
                  How this role approaches critique and feedback...
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={onClose}>
              Learn More
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
)}
```

### 2. Enhanced Names Input with Validation

```tsx
import { Input, Button, Card, CardBody, Text } from '@heroui/react';

<Card className="w-full max-w-md mx-auto">
  <CardBody className="space-y-4">
    <Text h3 className="text-center">Who will be participating?</Text>
    <Input
      type="text"
      label="Participant Names"
      placeholder="e.g., Alice, Bob, Charlie"
      value={names}
      onValueChange={setNames}
      variant="bordered"
      description="Enter names separated by commas"
      isInvalid={names.trim() === '' && namesSubmitted}
      errorMessage={names.trim() === '' && namesSubmitted ? "Please enter at least one name" : ""}
    />
    <Button 
      color="primary" 
      className="w-full"
      onPress={handleNamesSubmit}
      isDisabled={names.trim() === ''}
    >
      Start Session
    </Button>
  </CardBody>
</Card>
```

### 3. Loading States with HeroUI

```tsx
import { Spinner, Skeleton } from '@heroui/react';

// Loading spinner
{isDrawingCards && (
  <div className="flex items-center justify-center space-x-2">
    <Spinner color="primary" size="lg" />
    <span className="text-neutral-50">Drawing cards...</span>
  </div>
)}

// Skeleton loading
{isLoading && (
  <div className="space-y-3">
    <Skeleton className="w-3/5 rounded-lg">
      <div className="h-3 w-3/5 rounded-lg bg-default-300"></div>
    </Skeleton>
    <Skeleton className="w-4/5 rounded-lg">
      <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
    </Skeleton>
  </div>
)}
```

### 4. Enhanced Navigation

```tsx
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link } from '@heroui/react';

<Navbar className="bg-neutral-950/50 backdrop-blur-md border-b border-neutral-800">
  <NavbarBrand>
    <p className="font-bold text-neutral-50">Critique Boutique</p>
  </NavbarBrand>
  <NavbarContent justify="end">
    <NavbarItem>
      <Button 
        color="primary" 
        variant="flat"
        onPress={() => window.location.href = '/heroui-demo'}
      >
        View Demo
      </Button>
    </NavbarItem>
  </NavbarContent>
</Navbar>
```

## 🎨 Theme Customization

### 1. Custom Color Palette
```tsx
// In your HeroUIProvider
<HeroUIProvider
  theme={{
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        // ... more shades
        900: '#0c4a6e',
      },
      // Add your custom colors
      custom: {
        50: '#fdf4ff',
        100: '#fae8ff',
        // ... more shades
        900: '#581c87',
      }
    }
  }}
>
  {/* Your app */}
</HeroUIProvider>
```

### 2. Custom Component Styles
```tsx
// Create a custom button component
const CustomButton = ({ children, ...props }) => (
  <Button
    {...props}
    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
    classNames={{
      base: "shadow-lg hover:shadow-xl transition-all duration-200",
      content: "text-white font-bold"
    }}
  >
    {children}
  </Button>
);
```

## 🚀 Best Practices

### 1. Component Composition
```tsx
// Good: Compose components
<Card>
  <CardHeader>
    <h3>Title</h3>
  </CardHeader>
  <CardBody>
    <p>Content</p>
  </CardBody>
</Card>

// Avoid: Over-nesting
<div className="card">
  <div className="card-header">
    <h3>Title</h3>
  </div>
  <div className="card-body">
    <p>Content</p>
  </div>
</div>
```

### 2. Accessibility
HeroUI components are built with accessibility in mind, but always:
- Use proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast

### 3. Performance
- Use `React.memo()` for components that don't need frequent re-renders
- Lazy load components when possible
- Use HeroUI's built-in loading states

## 📚 Additional Resources

- [HeroUI Documentation](https://www.heroui.com/docs/guide/introduction)
- [Component Examples](https://www.heroui.com/docs/components)
- [Theme Customization](https://www.heroui.com/docs/customize/theme)
- [GitHub Repository](https://github.com/nextui-org/nextui)

## 🎯 Next Steps

1. **Visit the Demo**: Navigate to `/heroui-demo` to see all components in action
2. **Start Small**: Begin by replacing simple components like buttons and inputs
3. **Gradual Migration**: Replace components one at a time to ensure stability
4. **Customize**: Adjust the theme to match your brand colors and design system
5. **Test**: Ensure all interactions work as expected across different devices

Happy coding with HeroUI! 🎉
