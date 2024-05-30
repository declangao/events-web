'use client';

import { cn } from '@/lib/utils';
import {
  MotionValue,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { buttonVariants } from './ui/button';

export const HeroParallax = ({
  events,
}: {
  events: {
    name: string;
    link: string;
    image: string;
  }[];
}) => {
  const firstRow = events.slice(0, 5);
  const secondRow = events.slice(5, 10);
  const thirdRow = events.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="min-h-[250vh] lg:h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse gap-4 md:gap-8 lg:gap-20 mb-20">
          {firstRow.map((product) => (
            <SimpleEventCard
              event={product}
              translate={translateX}
              key={product.name}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row gap-4 md:gap-8 lg:gap-20 mb-20">
          {secondRow.map((product) => (
            <SimpleEventCard
              event={product}
              translate={translateXReverse}
              key={product.name}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse gap-4 md:gap-8 lg:gap-20">
          {thirdRow.map((product) => (
            <SimpleEventCard
              event={product}
              translate={translateX}
              key={product.name}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 -top-32 z-10">
      <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
        The <span className="text-primary">Ultimate</span> <br />
        <Highlight>Networking</Highlight> Platform
      </h1>
      <p className="max-w-2xl text-base font-semibold md:text-xl mt-8 dark:text-neutral-200">
        Don&apos;t know what to do and don&apos;t have anyone to go do something
        with?
      </p>
      <p className="max-w-2xl text-base md:text-xl mt-4 dark:text-neutral-200">
        We provide a platform for everyone to post their own events and join
        others. Say goodbye to the hassle of finding things to do or someone to
        go out with.
      </p>
      <div className="flex gap-4 mt-8">
        <Link href="/events" className={buttonVariants()}>
          See All Events
        </Link>
        <Link
          href="/events/publish"
          className={buttonVariants({ variant: 'secondary' })}
        >
          Post Your Event
        </Link>
      </div>
    </div>
  );
};

export const SimpleEventCard = ({
  event,
  translate,
}: {
  event: {
    name: string;
    link: string;
    image: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={event.name}
      className="group/event h-48 w-[15rem] md:h-72 md:w-[22rem] lg:h-96 lg:w-[30rem] relative flex-shrink-0 rounded-md overflow-hidden"
    >
      <Link href={event.link} className="block group-hover/event:shadow-2xl">
        <Image
          src={event.image}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={event.name}
        />
      </Link>
      <div className="absolute bottom-0 left-0 h-12 w-full opacity-60 bg-black pointer-events-none flex flex-col justify-center">
        <h2 className="ml-4 text-white">{event.name}</h2>
      </div>
    </motion.div>
  );
};

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.span
      initial={{
        backgroundSize: '0% 100%',
      }}
      animate={{
        backgroundSize: '100% 100%',
      }}
      transition={{
        duration: 2,
        ease: 'linear',
        delay: 0.5,
      }}
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        display: 'inline',
      }}
      className={cn(
        `relative inline-block pb-1   px-1 rounded-lg bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-500 dark:to-purple-500`,
        className
      )}
    >
      {children}
    </motion.span>
  );
};
