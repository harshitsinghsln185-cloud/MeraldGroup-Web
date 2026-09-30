import React from 'react';
import { Heading, Text } from './Typography';
import { Badge } from './Badge';

export interface SectionHeadProps {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  badgeVariant?: 'mint' | 'navy' | 'teal' | 'success' | 'warning' | 'danger';
  inverted?: boolean;
  className?: string;
}

export const SectionHead: React.FC<SectionHeadProps> = ({
  eyebrow,
  title,
  lede,
  align = 'center',
  badgeVariant,
  inverted = false,
  className = '',
}) => {
  const alignClass =
    align === 'center'
      ? 'text-center items-center mx-auto'
      : align === 'right'
      ? 'text-right items-end ml-auto'
      : 'text-left items-start';

  const defaultBadgeVariant = badgeVariant
    ? badgeVariant
    : inverted
    ? 'mint'
    : 'mint';

  return (
    <div className={`flex flex-col max-w-3xl mb-12 sm:mb-16 ${alignClass} ${className}`}>
      {eyebrow && (
        <div className="mb-3">
          <Badge variant={defaultBadgeVariant} className="px-3.5 py-1 text-xs font-semibold tracking-wide">
            {eyebrow}
          </Badge>
        </div>
      )}

      <Heading
        level={2}
        color={inverted ? 'white' : 'navy'}
        align={align}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3"
      >
        {title}
      </Heading>

      {lede && (
        <Text
          size="large"
          color={inverted ? 'white' : 'muted'}
          align={align}
          className={`max-w-2xl text-base sm:text-lg leading-relaxed ${
            inverted ? 'opacity-90' : ''
          }`}
        >
          {lede}
        </Text>
      )}
    </div>
  );
};

export default SectionHead;
