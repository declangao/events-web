'use client';

import { PLACEHOLDER_IMAGE } from '@/config';
import Image from 'next/image';
import type SwiperType from 'swiper';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';

type Props = {
  images: string[];
};

const ImageSlider = ({ images }: Props) => {
  if (images.length === 0) {
    images = [PLACEHOLDER_IMAGE];
  }

  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideConfig, setSlideConfig] = useState({
    isFirst: true,
    isLast: activeIndex === images.length - 1,
  });

  useEffect(() => {
    swiper?.on('slideChange', ({ activeIndex }) => {
      setActiveIndex(activeIndex);
      setSlideConfig({
        isFirst: activeIndex === 0,
        isLast: activeIndex === (images.length ?? 0) - 1,
      });
    });
  }, [swiper, images]);

  const activeStyles =
    'active:scale-[0.97] grid place-items-center opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square size-8 z-50 rounded-full border-2 bg-primary-foreground';

  return (
    <div className="group aspect-square relative">
      <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slidePrev();
          }}
          className={cn(activeStyles, 'left-3 transition', {
            hidden: slideConfig.isFirst,
            'opacity-100': !slideConfig.isFirst,
          })}
          aria-label="Previous image"
        >
          <ChevronLeft className="size-4 text-primary" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slideNext();
          }}
          className={cn(activeStyles, 'right-3 transition', {
            hidden: slideConfig.isLast,
            'opacity-100': !slideConfig.isLast,
          })}
          aria-label="Next image"
        >
          <ChevronRight className="size-4 text-primary" />
        </button>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={8}
        modules={[Pagination]}
        pagination={{
          renderBullet: (_, className) =>
            `<span class="transition duration-300 !size-2 ${className}"></span>`,
        }}
        onSwiper={(swiper) => setSwiper(swiper)}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="w-full h-full">
            <Image
              src={image}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover rounded-md"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
