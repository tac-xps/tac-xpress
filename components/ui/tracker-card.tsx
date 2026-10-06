import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

import { cn } from '@/lib/utils';
import { springs, microGestures } from '@/lib/animations';

// Props interface for type safety and reusability
export interface PackageTrackerCardProps {
  status: string;
  packageNumber: string;
  destination: string;
  destinationFlag: React.ReactNode;
  date: string;
  description?: string;
  qrCodeValue?: string;
  packageImage: React.ReactNode;
  onTrackClick?: () => void;
  isExpanded?: boolean;
  className?: string;
}

// A simple container for the package image with an animated background
const PackageImageContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex h-48 w-full items-center justify-center overflow-hidden">
    {/* Animated background to simulate a conveyor belt */}
    <div
      className={cn(
        'absolute inset-0 z-0 h-full w-full',
        'bg-muted/30',
        'bg-[size:80px_80px]',
        'bg-gradient-to-r from-transparent via-muted/30 to-transparent',
        'animate-conveyor-belt'
      )}
      style={{
        backgroundImage: `
          repeating-linear-gradient(45deg, transparent, transparent 25px, currentColor 25px, currentColor 50px),
          repeating-linear-gradient(-45deg, transparent, transparent 25px, currentColor 25px, currentColor 50px)
        `,
        opacity: 0.05,
      }}
    />
    <div className="z-10">{children}</div>
  </div>
);

export const PackageTrackerCard = ({
  status,
  packageNumber,
  destination,
  destinationFlag,
  date,
  description,
  qrCodeValue,
  packageImage,
  onTrackClick,
  isExpanded,
  className,
}: PackageTrackerCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            ...springs.gentle,
            staggerChildren: 0.08,
          },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion ? { duration: 0 } : springs.snappy,
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={shouldReduceMotion ? undefined : { y: -4, transition: springs.gentle }}
      className={cn(
        'w-full max-w-sm overflow-hidden rounded-none border border-border bg-card text-card-foreground shadow-xs transition-shadow duration-300 hover:shadow-lg',
        className
      )}
    >
      {/* Top Section */}
      {onTrackClick && (
        <div className="p-4">
          <motion.button
            variants={itemVariants}
            whileHover={shouldReduceMotion ? undefined : microGestures.hoverScale}
            whileTap={shouldReduceMotion ? undefined : microGestures.tap}
            onClick={onTrackClick}
            className="flex w-full items-center justify-center gap-2 rounded-none border border-border bg-muted/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <CheckCircle2 className="size-4 shrink-0 text-status-delivered" />
            <span>Show full tracking</span>
          </motion.button>
        </div>
      )}

      {/* Image Section */}
      <motion.div variants={itemVariants}>
        <PackageImageContainer>{packageImage}</PackageImageContainer>
      </motion.div>

      {/* Details Section */}
      <div className="p-6">
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          {destinationFlag}
          <span className="text-sm font-medium text-muted-foreground">{destination}</span>
        </motion.div>

        <motion.h2 variants={itemVariants} className="mt-2 text-3xl font-bold tracking-tight capitalize">
          {status}
        </motion.h2>

        <div className="mt-6 flex items-end justify-between">
          <motion.div variants={itemVariants} className="space-y-1">
            <p className="text-xs text-muted-foreground">Package Number:</p>
            <p className="font-mono text-sm">{packageNumber}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-none border border-border p-1 bg-card"
          >
            {qrCodeValue ? (
              <QRCodeCanvas value={qrCodeValue} size={64} bgColor="#ffffff" fgColor="#000000" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center bg-muted">
                <QrCode className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        </div>

        {description && (
          <motion.div
            variants={itemVariants}
            className="mt-6 rounded-none bg-muted/30 p-3 ring-1 ring-border/50"
          >
            <p className="text-sm leading-relaxed font-medium text-muted-foreground italic">
              &quot;{description.replace(/<\/?[^>]+(>|$)/g, "")}&quot;
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
