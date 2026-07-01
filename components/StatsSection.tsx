'use client';

import { FiTrendingUp, FiHome, FiCalendar, FiStar } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';

const ICON_MAP: Record<string, React.ReactNode> = {
  trending_up: <FiTrendingUp className="text-xl text-mosque/40 mb-2" />,
  home: <FiHome className="text-xl text-mosque/40 mb-2" />,
  calendar_today: <FiCalendar className="text-xl text-mosque/40 mb-2" />,
  star: <FiStar className="text-xl text-mosque/40 mb-2" />,
};

interface Stat {
  value: string;
  label: string;
  icon: string;
  numericValue: number;
  suffix?: string;
  prefix?: string;
}

const stats: Stat[] = [
  { value: '$2.4B', label: 'en ventas', icon: 'trending_up', numericValue: 2.4, prefix: '$', suffix: 'B' },
  { value: '1,247', label: 'propiedades vendidas', icon: 'home', numericValue: 1247 },
  { value: '15+', label: 'años en el mercado', icon: 'calendar_today', numericValue: 15, suffix: '+' },
  { value: '98%', label: 'clientes satisfechos', icon: 'star', numericValue: 98, suffix: '%' },
];

function useCountUp(target: number, duration: number, start: boolean, prefix?: string, suffix?: string) {
  const [display, setDisplay] = useState(prefix ? '' : '0');

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (target > 100) {
        setDisplay((prefix || '') + current.toLocaleString() + (suffix || ''));
      } else if (target > 10) {
        setDisplay((prefix || '') + current + (suffix || ''));
      } else {
        setDisplay((prefix || '') + (eased * target).toFixed(1) + (suffix || ''));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay((prefix || '') + (target > 100 ? target.toLocaleString() : target.toString()) + (suffix || ''));
      }
    };

    requestAnimationFrame(animate);
  }, [start, target, duration, prefix, suffix]);

  return display;
}

function StatCard({ stat, start }: { stat: Stat; start: boolean }) {
  const display = useCountUp(stat.numericValue, 2000, start, stat.prefix, stat.suffix);

  return (
    <div className="flex flex-col items-center text-center p-4 md:p-5">
      {ICON_MAP[stat.icon] || null}
      <span className="text-2xl md:text-3xl font-display font-semibold text-nordic mb-1 tabular-nums">
        {display}
      </span>
      <span className="text-[11px] text-nordic-muted/70 uppercase tracking-widest font-medium">
        {stat.label}
      </span>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mq.matches) {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-10 md:py-12 mb-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} start={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
