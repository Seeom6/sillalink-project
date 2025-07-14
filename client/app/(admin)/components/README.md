# Admin Dashboard Components

This directory contains the core components for the Silla Link admin dashboard interface.

## Components

### AdminSidebar (`Sidebar.tsx`)

A comprehensive, responsive sidebar component for the admin dashboard with the following features:

#### Features
- **Responsive Design**: Collapsible on desktop, mobile-friendly overlay
- **Modern Glassmorphism Design**: Consistent with the portfolio design system
- **Smooth Animations**: Framer Motion powered transitions
- **Active Route Highlighting**: Visual indicators for current page
- **User Profile Section**: Displays admin information
- **Navigation Badges**: Shows counts for relevant sections
- **Keyboard Navigation**: Full accessibility support
- **Mobile Menu Toggle**: Touch-friendly mobile interface

#### Navigation Structure
1. **Dashboard** - `/admin/dashboard` - Overview and analytics
2. **Users** - `/admin/users` - User account management
3. **Employees** - `/admin/employees` - Employee management
4. **Projects** - `/admin/projects` - Project management
5. **Technologies** - `/admin/technologies` - Tech stack management
6. **Services** - `/admin/services` - Service offerings management

#### Props
```typescript
interface SidebarProps {
  className?: string;
}
```

#### Usage
```tsx
import { AdminSidebar } from './components/Sidebar';

<AdminSidebar className="custom-class" />
```

### AdminHeader (`AdminHeader.tsx`)

A dynamic header component that adapts to the current page with the following features:

#### Features
- **Dynamic Page Titles**: Automatically updates based on current route
- **Search Functionality**: Global search input (ready for implementation)
- **Notification Center**: Bell icon with badge indicator
- **User Profile**: Quick access to user information
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Animations**: Page title transitions

#### Props
```typescript
interface AdminHeaderProps {
  className?: string;
}
```

#### Usage
```tsx
import { AdminHeader } from './components/AdminHeader';

<AdminHeader className="custom-class" />
```

## Design System Integration

Both components integrate seamlessly with the existing design system:

### Colors Used
- `primary-*`: Main brand colors (purple theme)
- `dark-*`: Dark theme background colors
- `accent-purple`: Accent color for highlights

### Animations
- Hover effects with scale transformations
- Smooth transitions for state changes
- Loading states and micro-interactions

### Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly structure
- High contrast ratios

## Mobile Responsiveness

### Breakpoints
- **Mobile**: `< 1024px` - Overlay sidebar with mobile toggle
- **Desktop**: `>= 1024px` - Fixed sidebar with collapse option

### Mobile Features
- Touch-friendly tap targets
- Swipe-friendly overlay
- Automatic close on route change
- Backdrop blur overlay

## Integration with Admin Layout

The components are integrated in the main admin layout (`layout.tsx`):

```tsx
return (
  <div className="flex h-screen bg-dark-950">
    <AdminSidebar />
    <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
      <AdminHeader />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark-950 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  </div>
);
```

## Customization

### Adding New Navigation Items

To add new navigation items, update the `navigationItems` array in `Sidebar.tsx`:

```typescript
const navigationItems: NavigationItem[] = [
  // ... existing items
  {
    id: 'new-section',
    label: 'New Section',
    href: '/admin/new-section',
    icon: FiNewIcon,
    badge: 5, // optional
    description: 'Description for accessibility'
  }
];
```

### Styling Customization

The components use Tailwind CSS classes that can be customized through:
1. CSS custom properties in `globals.css`
2. Tailwind configuration
3. Component-level className props

## Performance Considerations

- Components use React.memo for optimization where appropriate
- Framer Motion animations are optimized for 60fps
- Lazy loading for icons and heavy components
- Efficient re-rendering with proper dependency arrays

## Future Enhancements

Planned improvements include:
- Search functionality implementation
- Notification system integration
- User settings panel
- Theme switching capability
- Advanced keyboard shortcuts
- Drag-and-drop navigation reordering
