# Image Trail Effect for Card Shuffling

This component adds a beautiful image trail effect when dragging cards in the deck after names have been written.

## How It Works

The image trail effect is automatically activated when:
1. Names have been submitted (`namesSubmitted` is true)
2. The user is dragging cards (`isDragging` is true)
3. The names input is not visible (`!showNamesInput`)

## Available Variants

### Variant 1 (Default)
- Simple fade-in/fade-out effect
- Images follow the mouse cursor
- Smooth scaling and opacity transitions

### Variant 3 (Dramatic)
- Images scale up and fly off in random directions
- More dynamic and eye-catching effect
- Good for creating excitement during card shuffling

### Variant 6 (Speed-Based)
- Dynamic effects based on mouse movement speed
- Faster movement = larger images, more brightness, less blur
- Slower movement = smaller images, less brightness, more blur
- Creates a responsive and engaging experience

## Usage

The component is automatically integrated into the main Index.tsx file and will appear when dragging cards after names have been written.

To change variants, modify the `variant` prop in `src/pages/Index.tsx`:

```tsx
<ImageTrail 
  items={[...]}
  variant={6} // Change this number to switch variants
/>
```

## Customization

### Adding New Variants
1. Create a new class extending the base functionality
2. Add it to the `variantMap` object
3. Implement custom animation logic in the `showNextImage()` method

### Modifying Images
Change the `items` array to use different images:

```tsx
items={[
  '/path/to/image1.png',
  '/path/to/image2.png',
  // ... more images
]}
```

### Adjusting Effects
- Modify the `threshold` value to change sensitivity
- Adjust animation durations in the GSAP timelines
- Change the lerp values for smoother/faster following

## Technical Details

- Uses GSAP for smooth animations
- Captures mouse events at the document level for reliable tracking
- Automatically cleans up animations when component unmounts
- Optimized with `will-change` CSS properties for better performance
- Responsive design that works on both desktop and mobile

## Performance Notes

- The effect only runs when actively dragging
- Images are recycled from a pool to avoid memory issues
- GSAP animations are properly killed to prevent memory leaks
- Uses `requestAnimationFrame` for smooth 60fps animations
