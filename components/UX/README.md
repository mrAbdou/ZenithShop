# UX Components Library

This folder contains reusable UI components that match the project's gradient-based design theme. All components follow consistent styling with blue-indigo-purple gradients, rounded corners, shadows, and smooth animations.

## 🎨 Design Theme

The components use a cohesive design language:
- **Primary Colors**: Blue (#3B82F6) → Indigo (#4F46E5) gradients
- **Success Colors**: Green (#10B981) → Emerald (#059669) gradients
- **Danger Colors**: Red (#EF4444) → Orange (#F97316) gradients
- **Neutral Colors**: Gray scale (50-900)
- **Border Radius**: Rounded (lg, xl, 2xl, 3xl, full)
- **Shadows**: Layered shadows (md, lg, xl, 2xl)
- **Animations**: Smooth hover effects with scale and translate transforms

---

## 📦 Components

### 1. **Button** (`Button.jsx`)

A versatile button component with multiple variants and sizes.

**Props:**
- `variant` - Style variant: `'primary'`, `'secondary'`, `'danger'`, `'success'`, `'outline'` (default: `'primary'`)
- `size` - Button size: `'sm'`, `'md'`, `'lg'` (default: `'md'`)
- `fullWidth` - Take full width (default: `false`)
- `disabled` - Disable button (default: `false`)
- `loading` - Show loading spinner (default: `false`)
- `icon` - Optional icon element
- `className` - Additional CSS classes

**Usage:**
```jsx
import { Button } from '@/components/UX';

// Primary button
<Button variant="primary" onClick={handleClick}>
  Save Changes
</Button>

// Button with icon and loading state
<Button 
  variant="success" 
  loading={isLoading}
  icon={<CheckIcon />}
>
  Submit
</Button>

// Full width danger button
<Button variant="danger" fullWidth>
  Delete Account
</Button>
```

---

### 2. **Card** (`Card.jsx`)

A container component for content with consistent styling.

**Props:**
- `variant` - Card style: `'default'`, `'gradient'`, `'bordered'` (default: `'default'`)
- `hoverable` - Enable hover effects (default: `false`)
- `padding` - Padding size: `'sm'`, `'md'`, `'lg'`, `'xl'` (default: `'md'`)
- `className` - Additional CSS classes

**Usage:**
```jsx
import { Card } from '@/components/UX';

// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Hoverable card with gradient
<Card variant="gradient" hoverable padding="lg">
  <h3>Interactive Card</h3>
  <p>Hover over me!</p>
</Card>
```

---

### 3. **Badge** (`Badge.jsx`)

Small labels for status indicators, tags, and counts.

**Props:**
- `variant` - Color variant: `'primary'`, `'success'`, `'danger'`, `'warning'`, `'info'`, `'neutral'` (default: `'primary'`)
- `size` - Badge size: `'sm'`, `'md'`, `'lg'` (default: `'md'`)
- `rounded` - Pill shape (default: `true`)
- `icon` - Optional icon element
- `className` - Additional CSS classes

**Usage:**
```jsx
import { Badge } from '@/components/UX';

// Status badge
<Badge variant="success">Active</Badge>

// Badge with icon
<Badge variant="danger" icon={<AlertIcon />}>
  Error
</Badge>

// Count badge
<Badge variant="info" size="sm">5</Badge>
```

---

### 4. **Modal** (`Modal.jsx`)

A dialog/modal component with backdrop and animations.

**Props:**
- `isOpen` - Modal visibility (required)
- `onClose` - Close handler function (required)
- `title` - Modal title (required)
- `children` - Modal content
- `footer` - Footer content (buttons, etc.)
- `size` - Modal size: `'sm'`, `'md'`, `'lg'`, `'xl'`, `'full'` (default: `'md'`)
- `closeOnBackdrop` - Close when clicking backdrop (default: `true`)
- `className` - Additional CSS classes

**Usage:**
```jsx
import { Modal, Button } from '@/components/UX';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          </>
        }
      >
        <p>Are you sure you want to proceed?</p>
      </Modal>
    </>
  );
}
```

---

### 5. **Spinner** (`Spinner.jsx`)

Loading spinner with multiple variants.

**Props:**
- `size` - Spinner size: `'sm'`, `'md'`, `'lg'`, `'xl'` (default: `'md'`)
- `variant` - Color: `'primary'`, `'white'`, `'gray'` (default: `'primary'`)
- `text` - Optional loading text
- `fullScreen` - Full-screen overlay (default: `false`)
- `className` - Additional CSS classes

**Usage:**
```jsx
import { Spinner } from '@/components/UX';

// Basic spinner
<Spinner />

// Spinner with text
<Spinner text="Loading..." size="lg" />

// Full-screen loading overlay
<Spinner fullScreen text="Please wait..." />
```

---

### 6. **Form** (`Form.jsx`)

Form wrapper that provides React Hook Form context.

**Props:**
- `form` - react-hook-form instance from `useForm()` (required)
- `onSubmit` - Form submission handler (required)
- `children` - Form fields and content
- `title` - Optional form title
- `description` - Optional form description
- `showHeader` - Show header section (default: `true`)
- `headerIcon` - Optional header icon
- `className` - Additional CSS classes

**Usage:**
```jsx
import { Form, FormInput, Button } from '@/components/UX';
import { useForm } from 'react-hook-form';

function MyForm() {
  const form = useForm({
    defaultValues: { name: '', email: '' }
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      title="Contact Form"
      description="Fill in your details"
      headerIcon={<ContactIcon />}
    >
      <FormInput name="name" label="Name" placeholder="Your name" />
      <FormInput name="email" label="Email" type="email" placeholder="your@email.com" />
      
      <Button type="submit" fullWidth>Submit</Button>
    </Form>
  );
}
```

---

### 7. **FormInput** (`FormInput.jsx`)

Text input field that works with React Hook Form.

**Props:**
- `name` - Field name (required)
- `label` - Field label (required)
- `type` - Input type (default: `'text'`)
- `placeholder` - Placeholder text
- `icon` - Optional icon element
- `className` - Additional CSS classes
- Additional HTML input props

**Usage:**
```jsx
import { FormInput } from '@/components/UX';

<FormInput 
  name="email" 
  label="Email Address" 
  type="email"
  placeholder="Enter your email"
  icon={<EmailIcon />}
/>
```

---

### 8. **FormTextArea** (`FormTextArea.jsx`)

Textarea field that works with React Hook Form.

**Props:**
- `name` - Field name (required)
- `label` - Field label (required)
- `placeholder` - Placeholder text
- `rows` - Number of rows (default: `4`)
- `icon` - Optional icon element
- `className` - Additional CSS classes
- Additional HTML textarea props

**Usage:**
```jsx
import { FormTextArea } from '@/components/UX';

<FormTextArea 
  name="message" 
  label="Your Message" 
  placeholder="Type your message here..."
  rows={6}
/>
```

---

### 9. **Alert** (`Alert.jsx`)

Alert/notification component for messages.

**Props:**
- `variant` - Alert type: `'info'`, `'success'`, `'warning'`, `'danger'` (default: `'info'`)
- `title` - Alert title
- `children` - Alert message content
- `dismissible` - Can be dismissed (default: `false`)
- `onDismiss` - Dismiss handler function
- `icon` - Optional custom icon
- `className` - Additional CSS classes

**Usage:**
```jsx
import { Alert } from '@/components/UX';

// Info alert
<Alert variant="info" title="Information">
  This is an informational message.
</Alert>

// Dismissible success alert
<Alert 
  variant="success" 
  title="Success!"
  dismissible
  onDismiss={() => console.log('dismissed')}
>
  Your changes have been saved.
</Alert>

// Warning alert with custom icon
<Alert variant="warning" icon={<WarningIcon />}>
  Please review your input.
</Alert>
```

---

## 🚀 Quick Import

All components can be imported from the index file:

```jsx
import { 
  Button, 
  Card, 
  Badge, 
  Modal, 
  Spinner, 
  Form,
  FormInput,
  FormTextArea,
  Alert 
} from '@/components/UX';
```

---

## 🎯 Design Consistency

All components follow these principles:
1. **Gradient backgrounds** for primary actions
2. **Rounded corners** (xl, 2xl, 3xl) for modern look
3. **Shadow effects** for depth and elevation
4. **Smooth animations** on hover and interactions
5. **Accessible** with proper ARIA labels
6. **Responsive** design that works on all screen sizes
7. **Consistent spacing** using Tailwind's spacing scale

---

## 📝 Notes

- All form components (Form, FormInput, FormTextArea) require React Hook Form
- Modal component handles ESC key and prevents body scroll
- Button component includes loading state with spinner
- All components accept additional className for customization
- Components use 'use client' directive for Next.js compatibility