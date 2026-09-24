"use client";

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_1800 = Math.sqrt(1800);

const testimonials = [
  {
    tempId: 0,
    testimonial: "The booking flow feels effortless and the property details are beautifully presented.",
    by: "Ava, frequent traveler",
    imgSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    tempId: 1,
    testimonial: "I found flexible stays and trustworthy hosts in minutes. It completely changed how I plan trips.",
    by: "Liam, remote worker",
    imgSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  },
  {
    tempId: 2,
    testimonial: "The interface feels polished and the ratings help me choose the perfect place every time.",
    by: "Sophia, digital nomad",
    imgSrc: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  },
  {
    tempId: 3,
    testimonial: "TrustSpace makes property discovery feel personal, modern, and incredibly simple.",
    by: "Noah, business traveler",
    imgSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    tempId: 4,
    testimonial: "A great mix of comfort, design, and reliable reviews. I keep coming back for more stays.",
    by: "Mia, weekend explorer",
    imgSrc: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80",
  },
  {
    tempId: 5,
    testimonial: "Finding a safe, spacious homestay for my family was a breeze. The verified badges give genuine peace of mind.",
    by: "Rahul, family vacationer",
    imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    tempId: 6,
    testimonial: "The local host recommendations were spot on. It felt less like a rental and more like a warm welcome to the city.",
    by: "Ananya, cultural enthusiast",
    imgSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  },
  {
    tempId: 7,
    testimonial: "Seamless invoicing and great WiFi filters. Perfect for my monthly work trips to Bangalore and Pune.",
    by: "Arjun, tech consultant",
    imgSrc: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
  },
  {
    tempId: 8,
    testimonial: "Customer support is incredibly responsive, and the wishlist feature makes collaborative trip planning so much easier.",
    by: "Ethan, travel blogger",
    imgSrc: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
  },
  {
    tempId: 9,
    testimonial: "As a woman traveling solo, the safety filters and detailed neighborhood guides on TrustSpace are absolute lifesavers.",
    by: "Priya, solo backpacker",
    imgSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    tempId: 10,
    testimonial: "I love the long-term stay discounts. It made my three-month stint across Europe highly affordable and stress-free.",
    by: "Isabella, freelance designer",
    imgSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: (typeof testimonials)[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        'absolute left-1/2 top-1/2 cursor-pointer border-2 p-3 transition-all duration-500 ease-in-out sm:p-4',
        isCenter
          ? 'z-10 border-primary bg-primary text-primary-foreground'
          : 'z-0 border-border bg-card text-card-foreground hover:border-primary/50'
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: 'polygon(30px 0%, calc(100% - 30px) 0%, 100% 30px, 100% 100%, calc(100% - 30px) 100%, 30px 100%, 0 100%, 0 0)',
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.45) * position}px)
          translateY(${isCenter ? -39 : position % 2 ? 8 : -8}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? '0px 5px 0px 2px hsl(var(--border))' : '0px 0px 0px 0px transparent',
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{ right: -2, top: 29, width: SQRT_1800, height: 2 }}
      />
      <img
        src={testimonial.imgSrc}
        alt={testimonial.by}
        className="mb-2 h-9 w-7 bg-muted object-cover object-top"
        style={{ boxShadow: '2px 2px 0px hsl(var(--background))' }}
      />
      <h3 className={cn('text-[10px] leading-tight font-medium sm:text-xs sm:leading-snug', isCenter ? 'text-primary-foreground' : 'text-foreground')}>
        “{testimonial.testimonial}”
      </h3>
      <p className={cn('absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 mt-2 text-[9px] sm:text-[10px] italic', isCenter ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
        — {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(219);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia('(min-width: 640px)');
      setCardSize(matches ? 219 : 174);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-border bg-muted/30" style={{ height: 360 }}>
      {testimonialsList.map((testimonial, index) => {
        const position = index - Math.floor(testimonialsList.length / 2);

        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            'flex h-9 w-9 items-center justify-center border-2 border-border bg-background text-lg transition-colors hover:bg-primary hover:text-primary-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            'flex h-9 w-9 items-center justify-center border-2 border-border bg-background text-lg transition-colors hover:bg-primary hover:text-primary-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
