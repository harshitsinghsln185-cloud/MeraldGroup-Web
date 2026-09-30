import React from 'react';
import type { WhyChoosePillar } from '../../data/servicesData';
import { ScrollReveal } from '../ui/ScrollReveal';

export interface WhyChooseCardProps {
  data: WhyChoosePillar;
  delay?: number;
}

export const WhyChooseCard: React.FC<WhyChooseCardProps> = ({ data, delay = 0.1 }) => {
  return (
    <ScrollReveal direction="up" delay={delay}>
      <div className="bg-white border border-gray-200 border-t-2 border-l-2 border-t-sky-400 border-l-sky-400 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:bg-sky-50/50 transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col justify-between">
        <div>
          <div className="p-3.5 bg-sky-50 text-sky-600 rounded-xl inline-block mb-4 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300 border border-sky-100">
            {data.icon}
          </div>
          <h3 className="font-heading font-bold text-lg text-navy-900 mb-2 group-hover:text-sky-600 transition-colors">
            {data.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-body">
            {data.description}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-sky-600 font-heading font-semibold">
          {data.footerTag}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default WhyChooseCard;
