import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

import './ImageTrail.css';

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(e: MouseEvent | TouchEvent, rect: DOMRect) {
  let clientX = 0, clientY = 0;
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ('clientX' in e) {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function getMouseDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

class ImageItem {
  DOM: { el: HTMLElement; inner: HTMLElement | null };
  defaultStyle: { scale: number; x: number; y: number; opacity: number };
  rect: DOMRect | null;
  resize: () => void;

  constructor(DOM_el: HTMLElement) {
    this.DOM = { el: DOM_el, inner: null };
    this.DOM.inner = this.DOM.el.querySelector('.content__img-inner') as HTMLElement;
    this.defaultStyle = { scale: 1, x: 0, y: 0, opacity: 0 };
    this.rect = null;
    this.resize = () => {}; // Initialize with empty function
    this.getRect();
    this.initEvents();
  }

  initEvents() {
    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    window.addEventListener('resize', this.resize);
  }

  getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }
}

class ImageTrailVariant1 {
  container: HTMLElement;
  DOM: { el: HTMLElement };
  images: ImageItem[];
  imagesTotal: number;
  imgPosition: number;
  zIndexVal: number;
  activeImagesCount: number;
  isIdle: boolean;
  threshold: number;

  mousePos: { x: number; y: number };
  lastMousePos: { x: number; y: number };
  cacheMousePos: { x: number; y: number };

  constructor(container: HTMLElement) {
    this.container = container;
    this.DOM = { el: container };
    this.images = [...this.DOM.el.querySelectorAll('.content__img')].map(img => new ImageItem(img as HTMLElement));
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 40; // Reduced threshold for hover sensitivity

    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };

    // Use document events to capture all mouse movement during hovering
    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      
      // If this is the first mouse movement, initialize the cache
      if (this.isIdle) {
        this.cacheMousePos = { ...this.mousePos };
        this.isIdle = false;
      }
    };

    const handlePointerLeave = () => {
      // Stop the trail when mouse leaves the window
      this.isIdle = true;
      this.activeImagesCount = 0;
    };

    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('touchmove', handlePointerMove);
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('touchend', handlePointerLeave);

    // Start rendering immediately
    requestAnimationFrame(() => this.render());
  }

  render() {
    let distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.15);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.15);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    
    requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];

    if (!img.rect) return;

    gsap.killTweensOf(img.DOM.el);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
      .fromTo(img.DOM.el, {
        opacity: 1,
        scale: 0.8,
        zIndex: this.zIndexVal,
        x: this.cacheMousePos.x - img.rect.width / 2,
        y: this.cacheMousePos.y - img.rect.height / 2
      }, {
        duration: 0.3,
        ease: 'power1',
        scale: 1,
        x: this.mousePos.x - img.rect.width / 2,
        y: this.mousePos.y - img.rect.height / 2
      }, 0)
      .to(img.DOM.el, {
        duration: 0.3,
        ease: 'power3',
        opacity: 0,
        scale: 0.2
      }, 0.3);
  }

  onImageActivated() {
    this.activeImagesCount++;
    this.isIdle = false;
  }

  onImageDeactivated() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }
}

class ImageTrailVariant6 {
  container: HTMLElement;
  DOM: { el: HTMLElement };
  images: ImageItem[];
  imagesTotal: number;
  imgPosition: number;
  zIndexVal: number;
  activeImagesCount: number;
  isIdle: boolean;
  threshold: number;

  mousePos: { x: number; y: number };
  lastMousePos: { x: number; y: number };
  cacheMousePos: { x: number; y: number };

  constructor(container: HTMLElement) {
    this.container = container;
    this.DOM = { el: container };
    this.images = [...container.querySelectorAll('.content__img')].map(img => new ImageItem(img as HTMLElement));
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 40; // Reduced threshold for hover sensitivity

    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };

    // Use document events to capture all mouse movement during hovering
    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      
      // If this is the first mouse movement, initialize the cache
      if (this.isIdle) {
        this.cacheMousePos = { ...this.mousePos };
        this.isIdle = false;
      }
    };

    const handlePointerLeave = () => {
      // Stop the trail when mouse leaves the window
      this.isIdle = true;
      this.activeImagesCount = 0;
    };

    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('touchmove', handlePointerMove);
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('touchend', handlePointerLeave);

    // Start rendering immediately
    requestAnimationFrame(() => this.render());
  }

  render() {
    let distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.3);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.3);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    
    requestAnimationFrame(() => this.render());
  }

  mapSpeedToSize(speed: number, minSize: number, maxSize: number) {
    const maxSpeed = 200;
    return minSize + (maxSize - minSize) * Math.min(speed / maxSpeed, 1);
  }

  mapSpeedToBrightness(speed: number, minB: number, maxB: number) {
    const maxSpeed = 70;
    return minB + (maxB - minB) * Math.min(speed / maxSpeed, 1);
  }

  mapSpeedToBlur(speed: number, minBlur: number, maxBlur: number) {
    const maxSpeed = 90;
    return minBlur + (maxBlur - minBlur) * Math.min(speed / maxSpeed, 1);
  }

  mapSpeedToGrayscale(speed: number, minG: number, maxG: number) {
    const maxSpeed = 90;
    return minG + (maxG - minG) * Math.min(speed / maxSpeed, 1);
  }

  showNextImage() {
    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let speed = Math.sqrt(dx * dx + dy * dy);

    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];

    if (!img.rect) return;

    let scaleFactor = this.mapSpeedToSize(speed, 0.3, 2);
    let brightnessValue = this.mapSpeedToBrightness(speed, 0, 1.3);
    let blurValue = this.mapSpeedToBlur(speed, 20, 0);
    let grayscaleValue = this.mapSpeedToGrayscale(speed, 600, 0);

    gsap.killTweensOf(img.DOM.el);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
      .fromTo(img.DOM.el, {
        opacity: 1, 
        scale: 0,
        zIndex: this.zIndexVal,
        x: this.cacheMousePos.x - img.rect.width / 2,
        y: this.cacheMousePos.y - img.rect.height / 2
      }, {
        duration: 0.8,
        ease: 'power3',
        scale: scaleFactor,
        filter: `grayscale(${grayscaleValue * 100}%) brightness(${brightnessValue * 100}%) blur(${blurValue}px)`,
        x: this.mousePos.x - img.rect.width / 2,
        y: this.mousePos.y - img.rect.height / 2
      }, 0)
      .fromTo(img.DOM.inner, {
        scale: 2
      }, {
        duration: 0.8, 
        ease: 'power3', 
        scale: 1
      }, 0)
      .to(img.DOM.el, {
        duration: 0.4, 
        ease: 'power3.in',
        opacity: 0, 
        scale: 0.2
      }, 0.45);
  }

  onImageActivated() { 
    this.activeImagesCount++; 
    this.isIdle = false; 
  }
  
  onImageDeactivated() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }
}

class ImageTrailVariant3 {
  container: HTMLElement;
  DOM: { el: HTMLElement };
  images: ImageItem[];
  imagesTotal: number;
  imgPosition: number;
  zIndexVal: number;
  activeImagesCount: number;
  isIdle: boolean;
  threshold: number;

  mousePos: { x: number; y: number };
  lastMousePos: { x: number; y: number };
  cacheMousePos: { x: number; y: number };

  constructor(container: HTMLElement) {
    this.container = container;
    this.DOM = { el: container };
    this.images = [...container.querySelectorAll('.content__img')].map(img => new ImageItem(img as HTMLElement));
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 40; // Reduced threshold for hover sensitivity

    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };

    // Use document events to capture all mouse movement during hovering
    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      
      // If this is the first mouse movement, initialize the cache
      if (this.isIdle) {
        this.cacheMousePos = { ...this.mousePos };
        this.isIdle = false;
      }
    };

    const handlePointerLeave = () => {
      // Stop the trail when mouse leaves the window
      this.isIdle = true;
      this.activeImagesCount = 0;
    };

    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('touchmove', handlePointerMove);
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('touchend', handlePointerLeave);

    // Start rendering immediately
    requestAnimationFrame(() => this.render());
  }

  render() {
    let distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    
    requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];

    if (!img.rect) return;

    gsap.killTweensOf(img.DOM.el);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
      .fromTo(img.DOM.el, {
        opacity: 1, 
        scale: 0, 
        zIndex: this.zIndexVal,
        xPercent: 0, 
        yPercent: 0,
        x: this.cacheMousePos.x - img.rect.width / 2,
        y: this.cacheMousePos.y - img.rect.height / 2
      }, {
        duration: 0.4, 
        ease: 'power1',
        scale: 1,
        x: this.mousePos.x - img.rect.width / 2,
        y: this.mousePos.y - img.rect.height / 2
      }, 0)
      .fromTo(img.DOM.inner, {
        scale: 1.2
      }, {
        duration: 0.4, 
        ease: 'power1', 
        scale: 1
      }, 0)
      .to(img.DOM.el, {
        duration: .6, 
        ease: 'power2',
        opacity: 0, 
        scale: 0.2,
        xPercent: () => gsap.utils.random(-30, 30),
        yPercent: -200
      }, 0.6);
  }

  onImageActivated() { 
    this.activeImagesCount++; 
    this.isIdle = false; 
  }
  
  onImageDeactivated() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }
}

class ImageTrailVariant5 {
  container: HTMLElement;
  DOM: { el: HTMLElement };
  images: ImageItem[];
  imagesTotal: number;
  imgPosition: number;
  zIndexVal: number;
  activeImagesCount: number;
  isIdle: boolean;
  threshold: number;

  mousePos: { x: number; y: number };
  lastMousePos: { x: number; y: number };
  cacheMousePos: { x: number; y: number };
  lastAngle: number;

  constructor(container: HTMLElement) {
    this.container = container;
    this.DOM = { el: container };
    this.images = [...container.querySelectorAll('.content__img')].map(img => new ImageItem(img as HTMLElement));
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 40; // Reduced threshold for hover sensitivity

    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };
    this.lastAngle = 0;

    // Use document events to capture all mouse movement during hovering
    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      
      // If this is the first mouse movement, initialize the cache
      if (this.isIdle) {
        this.cacheMousePos = { ...this.mousePos };
        this.isIdle = false;
      }
    };

    const handlePointerLeave = () => {
      // Stop the trail when mouse leaves the window
      this.isIdle = true;
      this.activeImagesCount = 0;
    };

    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('touchmove', handlePointerMove);
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('touchend', handlePointerLeave);

    // Start rendering immediately
    requestAnimationFrame(() => this.render());
  }

  render() {
    let distance = getMouseDistance(this.mousePos, this.lastMousePos);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    
    requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    if (angle > 90 && angle <= 270) angle += 180;
    const isMovingClockwise = angle >= this.lastAngle;
    this.lastAngle = angle;
    let startAngle = isMovingClockwise ? angle - 10 : angle + 10;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) { dx /= distance; dy /= distance; }
    dx *= distance / 150; dy *= distance / 150;

    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];

    if (!img.rect) return;

    gsap.killTweensOf(img.DOM.el);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
      .fromTo(img.DOM.el, {
        opacity: 1, 
        filter: 'brightness(80%)',
        scale: 0.1, 
        zIndex: this.zIndexVal,
        x: this.cacheMousePos.x - img.rect.width / 2,
        y: this.cacheMousePos.y - img.rect.height / 2,
        rotation: startAngle
      }, {
        duration: 1, 
        ease: 'power2',
        scale: 1, 
        filter: 'brightness(100%)',
        x: this.mousePos.x - img.rect.width / 2 + (dx * 70),
        y: this.mousePos.y - img.rect.height / 2 + (dy * 70),
        rotation: this.lastAngle
      }, 0)
      .to(img.DOM.el, {
        duration: 0.4, 
        ease: 'expo', 
        opacity: 0
      }, 0.5)
      .to(img.DOM.el, {
        duration: 1.5, 
        ease: 'power4',
        x: `+=${dx * 120}`, 
        y: `+=${dy * 120}`
      }, 0.05);
  }

  onImageActivated() { 
    this.activeImagesCount++; 
    this.isIdle = false; 
  }
  
  onImageDeactivated() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }
}

const variantMap: Record<number, typeof ImageTrailVariant1> = {
  1: ImageTrailVariant1,
  3: ImageTrailVariant3,
  5: ImageTrailVariant5,
  6: ImageTrailVariant6
};

export default function ImageTrail({ 
  items = [], 
  variant = 1, 
  config = {} 
}: { 
  items: string[], 
  variant?: number,
  config?: {
    threshold?: number;
    animationDuration?: number;
    fadeOutDelay?: number;
  }
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    if (!containerRef.current) return;

    const Cls = variantMap[variant] || variantMap[1];
    
    // Create a custom class that extends the base variant with custom config
    class CustomImageTrail extends Cls {
      customAnimationDuration?: number;
      customFadeOutDelay?: number;
      
      constructor(container: HTMLElement) {
        super(container);
        
        // Override threshold if provided
        if (config.threshold !== undefined) {
          this.threshold = config.threshold;
        }
        
        // Override animation duration if provided
        if (config.animationDuration !== undefined) {
          this.customAnimationDuration = config.animationDuration;
        }
        
        // Override fade out delay if provided
        if (config.fadeOutDelay !== undefined) {
          this.customFadeOutDelay = config.fadeOutDelay;
        }
      }
      
      // Override showNextImage method to use custom timing
      showNextImage() {
        // Call parent method first
        super.showNextImage();
        
        // Then customize the timing if custom values are provided
        if (this.customAnimationDuration || this.customFadeOutDelay) {
          const img = this.images[this.imgPosition];
          if (!img || !img.rect) return;
          
          // Kill existing tweens and recreate with custom timing
          gsap.killTweensOf(img.DOM.el);
          
          const duration = this.customAnimationDuration || 0.3;
          const fadeOutDelay = this.customFadeOutDelay || 0.3;
          
          gsap.timeline({
            onStart: () => this.onImageActivated(),
            onComplete: () => this.onImageDeactivated()
          })
            .fromTo(img.DOM.el, {
              opacity: 1,
              scale: 0.8,
              zIndex: this.zIndexVal,
              x: this.cacheMousePos.x - img.rect.width / 2,
              y: this.cacheMousePos.y - img.rect.height / 2
            }, {
              duration: duration,
              ease: 'power1',
              scale: 1,
              x: this.mousePos.x - img.rect.width / 2,
              y: this.mousePos.y - img.rect.height / 2
            }, 0)
            .to(img.DOM.el, {
              duration: duration,
              ease: 'power3',
              opacity: 0,
              scale: 0.2
            }, fadeOutDelay);
        }
      }
    }
    
    const instance = new CustomImageTrail(containerRef.current);

    // Cleanup function
    return () => {
      // Clean up any ongoing animations
      if (instance && instance.images) {
        instance.images.forEach(img => {
          gsap.killTweensOf(img.DOM.el);
        });
      }
    };
  }, [variant, items, config]);

  return (
    <div className="content" ref={containerRef}>
      {items.map((url, i) => (
        <div className="content__img" key={i}>
          <div
            className="content__img-inner"
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ))}
    </div>
  );
}
