import React from 'react';
import { Card } from './Card';
import { Heading, Text } from './Typography';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendPositive = true,
}) => {
  return (
    <Card hoverEffect borderAccent className="flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <Text size="small" color="muted" weight="medium" className="uppercase tracking-wider text-xs">
            {title}
          </Text>
          <Heading level={2} color="navy" className="mt-1">
            {value}
          </Heading>
        </div>
        {icon && (
          <div className="p-3.5 bg-mint-100 text-teal-500 rounded-xl">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-body">
          {subtitle && <span className="text-neutral-500">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ${
                trendPositive ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
