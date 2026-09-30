import React from 'react';
import {
  Building2,
  Wrench,
  Box,
  Truck,
  Users,
  Zap,
  Settings,
  CheckCircle2,
  ShieldCheck,
  Clock,
  TrendingUp,
  Globe2,
} from 'lucide-react';

export interface SubServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface VerticalData {
  id: string;
  verticalNumber: string;
  badgeText: string;
  badgeVariant: 'teal' | 'mint';
  title: string;
  subtitle: string;
  description: string;
  mainIcon: React.ReactNode;
  subServices: SubServiceItem[];
  ctaText: string;
  ctaLink: string;
  ctaVariant?: 'gradient' | 'outline';
  reversed?: boolean;
  bgVariant: 'white' | 'neutral';
  highlightBox: {
    label: string;
    badgeText: string;
    title: string;
    items?: string[];
    footerLabel?: string;
    footerValue?: string;
  };
}

export interface WhyChoosePillar {
  id: string;
  title: string;
  description: string;
  footerTag: string;
  icon: React.ReactNode;
}

export interface QuickLinkItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const QUICK_LINKS_DATA: QuickLinkItem[] = [
  { id: 'epc-mep', name: 'EPC & MEP Contracting', icon: React.createElement(Building2, { className: 'w-4 h-4' }) },
  { id: 'ifm', name: 'Integrated Facility Management', icon: React.createElement(Wrench, { className: 'w-4 h-4' }) },
  { id: 'distribution', name: 'Product & Board Distribution', icon: React.createElement(Box, { className: 'w-4 h-4' }) },
  { id: 'haulify', name: 'Haulify Heavy Logistics', icon: React.createElement(Truck, { className: 'w-4 h-4' }) },
  { id: 'manpower', name: 'Technical Manpower Supply', icon: React.createElement(Users, { className: 'w-4 h-4' }) },
];

export const SERVICES_DATA: VerticalData[] = [
  {
    id: 'epc-mep',
    verticalNumber: 'Vertical 01',
    badgeText: 'ISO 9001:2015 & NFPA Standards',
    badgeVariant: 'teal',
    title: 'EPC & MEP Contracting Services',
    subtitle: 'Comprehensive Engineering, Procurement, Construction & Mechanical/Electrical/Plumbing Execution',
    description:
      'Merald Group delivers turnkey EPC and MEP solutions for commercial towers, industrial complexes, refinery infrastructure, and power sub-stations. We handle full project lifecycles—from initial engineering design and procurement to site erection, testing, and final authority commissioning.',
    mainIcon: React.createElement(Building2, { className: 'w-7 h-7 text-teal-600' }),
    subServices: [
      {
        title: 'Electrical & Sub-Stations',
        description: 'High-voltage sub-stations, switchgear panels, grid synchronization, and cabling up to 33kV/132kV.',
        icon: React.createElement(Zap, { className: 'w-5 h-5 text-teal-600 shrink-0' }),
      },
      {
        title: 'HVAC & Cleanroom Systems',
        description: 'Commercial chiller plants, air handling units (AHUs), VRF/VRV systems, ductwork, and cleanrooms.',
        icon: React.createElement(Settings, { className: 'w-5 h-5 text-teal-600 shrink-0' }),
      },
      {
        title: 'Industrial Plumbing & Piping',
        description: 'High-pressure refinery piping, drainage networks, water treatment, and industrial fluid loops.',
        icon: React.createElement(CheckCircle2, { className: 'w-5 h-5 text-teal-600 shrink-0' }),
      },
      {
        title: 'Fire Suppression & BAS',
        description: 'NFPA-compliant automatic sprinklers, gas suppression systems, building automation (BMS), and safety loops.',
        icon: React.createElement(ShieldCheck, { className: 'w-5 h-5 text-teal-600 shrink-0' }),
      },
    ],
    ctaText: 'Request Capability Deck',
    ctaLink: '/contact',
    ctaVariant: 'gradient',
    bgVariant: 'white',
    highlightBox: {
      label: 'Track Record',
      badgeText: '100+ Completed',
      title: 'Turnkey Engineering Highlights',
      items: [
        'Single-point responsibility from FEED design to commercial handover.',
        'In-house BIM modeling (LOD 400) and clash-detection engineering.',
        'Full compliance with local electrical utility grids (TCN Nigeria, DEWA UAE, etc.).',
        'Proven record in high-rise towers, fertilizer plants, and data centers.',
      ],
      footerLabel: 'Average Execution Speed',
      footerValue: 'On-Time Handover Rate 98.4%',
    },
  },
  {
    id: 'ifm',
    verticalNumber: 'Vertical 02',
    badgeText: '24/7 Operations & CMMS',
    badgeVariant: 'mint',
    title: 'Integrated Facility Management (IFM)',
    subtitle: 'Round-the-Clock Technical Operations, Asset Lifecycle Maintenance & Energy Optimization',
    description:
      'Merald Group provides comprehensive Facility Management services designed to maximize facility uptime, reduce operational expenditure, and extend the lifespan of critical building assets. From high-rise corporate headquarters to heavy industrial sites, our certified facility engineers manage daily technical operations with precision.',
    mainIcon: React.createElement(Wrench, { className: 'w-7 h-7 text-teal-600' }),
    reversed: true,
    bgVariant: 'neutral',
    subServices: [
      {
        title: 'Hard Facility Services & MEP Upkeep',
        description: 'Scheduled preventive and corrective maintenance for chillers, boilers, transformers, generators, and plumbing systems.',
        icon: React.createElement(Clock, { className: 'w-5 h-5 text-teal-600 shrink-0 mt-0.5' }),
      },
      {
        title: 'Cleanroom & Environmental Hygiene',
        description: 'Controlled cleanroom maintenance, HVAC HEPA filter replacement, and hazardous chemical compliance.',
        icon: React.createElement(ShieldCheck, { className: 'w-5 h-5 text-teal-600 shrink-0 mt-0.5' }),
      },
      {
        title: 'Energy Efficiency & Asset Stewardship',
        description: 'Continuous energy audits, power factor correction, and lifecycle asset valuation reportings.',
        icon: React.createElement(TrendingUp, { className: 'w-5 h-5 text-teal-600 shrink-0 mt-0.5' }),
      },
    ],
    ctaText: 'Discuss Facility Stewardship',
    ctaLink: '/contact',
    ctaVariant: 'outline',
    highlightBox: {
      label: 'Managed Portfolio',
      badgeText: '1.2M+ Sq. Ft.',
      title: '24/7 Operational Stewardship',
    },
  },
  {
    id: 'distribution',
    verticalNumber: 'Vertical 03',
    badgeText: 'Authorized OEM Partnerships',
    badgeVariant: 'teal',
    title: 'Product & Board Distribution',
    subtitle: 'Authorized Heavy Electrical Equipment, Switchgear Panels & Industrial Supply Warehousing',
    description:
      'Merald Group acts as an authorized distribution partner for global Original Equipment Manufacturers (OEMs). We warehouse, assemble, and distribute heavy electrical boards, LV/MV switchgears, power transformers, and specialized industrial fittings across West Africa and Asia.',
    mainIcon: React.createElement(Box, { className: 'w-7 h-7 text-teal-600' }),
    bgVariant: 'white',
    subServices: [
      {
        title: 'Custom LV/MV Switchgears',
        description: 'Factory-assembled low voltage and medium voltage panel boards built to client engineering specs.',
        icon: React.createElement(Box, { className: 'w-5 h-5 text-teal-600 shrink-0' }),
      },
      {
        title: 'Power Transformers & Cables',
        description: 'Heavy distribution transformers, armored copper/aluminum power cables, and busduct systems.',
        icon: React.createElement(Zap, { className: 'w-5 h-5 text-teal-600 shrink-0' }),
      },
      {
        title: 'Industrial Valves & Piping',
        description: 'High-pressure industrial valves, flanges, flow control meters, and structural pipe fittings.',
        icon: React.createElement(Settings, { className: 'w-5 h-5 text-teal-600 shrink-0' }),
      },
      {
        title: 'Direct OEM Warranty',
        description: 'Complete manufacturer warranty backing, certified spare parts inventory, and onsite testing.',
        icon: React.createElement(ShieldCheck, { className: 'w-5 h-5 text-teal-600 shrink-0' }),
      },
    ],
    ctaText: 'Request Equipment Catalog',
    ctaLink: '/contact',
    ctaVariant: 'gradient',
    highlightBox: {
      label: 'Regional Logistics Hubs',
      badgeText: 'Global Warehousing',
      title: 'Strategic Warehousing & Supply Chain',
    },
  },
  {
    id: 'haulify',
    verticalNumber: 'Vertical 04',
    badgeText: 'Specialized Transport Fleet',
    badgeVariant: 'teal',
    title: 'Haulify Heavy Logistics',
    subtitle: 'Heavy Cargo Transport, Out-of-Gauge (OOG) Logistics & Port-to-Site Mobilization',
    description:
      "Haulify is Merald Group's heavy equipment logistics division. We specialize in transporting out-of-gauge (OOG) machinery, heavy industrial transformers, structural steel components, and construction rigs across challenging terrains in West Africa, Middle East, and Asia.",
    mainIcon: React.createElement(Truck, { className: 'w-7 h-7 text-teal-600' }),
    reversed: true,
    bgVariant: 'neutral',
    subServices: [
      {
        title: 'OOG Heavy Machinery Transport',
        description: 'Lowbed trailers, multi-axle hydraulic modules, and heavy haulage prime movers.',
        icon: React.createElement(Truck, { className: 'w-5 h-5 text-teal-600 shrink-0' }),
      },
      {
        title: 'Route Clearance & Security',
        description: 'Comprehensive route safety clearance, police escort coordination, and weight bridge clearances.',
        icon: React.createElement(ShieldCheck, { className: 'w-5 h-5 text-teal-600 shrink-0' }),
      },
    ],
    ctaText: 'Book Heavy Haulage',
    ctaLink: '/contact',
    ctaVariant: 'outline',
    highlightBox: {
      label: 'Logistics Volume',
      badgeText: '500,000+ Tons/Yr',
      title: 'Heavy Haulage Fleet',
    },
  },
  {
    id: 'manpower',
    verticalNumber: 'Vertical 05',
    badgeText: '6,400+ Active Personnel',
    badgeVariant: 'mint',
    title: 'Global Technical Manpower Supply',
    subtitle: 'Deployment of Vetted Engineers, HSE Officers, Supervisors & Certified Craft Workforce',
    description:
      'Merald Group solves complex technical manpower shortages for multinational EPC contractors, oil & gas operators, and industrial plants. We recruit, vet, deploy, and manage certified engineers, HSE supervisors, QA/QC inspectors, and skilled technicians with full cross-border compliance.',
    mainIcon: React.createElement(Users, { className: 'w-7 h-7 text-teal-600' }),
    bgVariant: 'white',
    subServices: [
      {
        title: 'Certified Site Engineers',
        description: 'Electrical, Mechanical, Civil, HVAC, and Instrumentation site engineers ready for deployment.',
        icon: React.createElement(Users, { className: 'w-5 h-5 text-teal-600 shrink-0' }),
      },
      {
        title: 'HSE & QA/QC Inspectors',
        description: 'NEBOSH/OSHA certified safety officers and ISO-trained quality assurance inspectors.',
        icon: React.createElement(ShieldCheck, { className: 'w-5 h-5 text-teal-600 shrink-0' }),
      },
      {
        title: 'Licensed MEP Technicians',
        description: 'Master electricians, high-pressure welders, certified pipe fitters, and crane operators.',
        icon: React.createElement(Settings, { className: 'w-5 h-5 text-teal-600 shrink-0' }),
      },
      {
        title: 'Cross-Border Compliance',
        description: 'Complete visa sponsorship, international payroll, medical insurance, and site mobilization.',
        icon: React.createElement(Globe2, { className: 'w-5 h-5 text-teal-600 shrink-0' }),
      },
    ],
    ctaText: 'Request Technical Workforce',
    ctaLink: '/contact',
    ctaVariant: 'gradient',
    highlightBox: {
      label: 'Global Deployment Pool',
      badgeText: 'Vetted & Trade-Tested',
      title: 'Site-Ready & Fully Compliant',
    },
  },
];

export const WHY_CHOOSE_DATA: WhyChoosePillar[] = [
  {
    id: 'single-point',
    title: 'Single-Point Accountability',
    description:
      'From preliminary engineering design to material procurement, haulage, construction, and 24/7 facility management—Merald assumes total responsibility, eliminating vendor friction.',
    footerTag: 'Zero Sub-Contractor Delays',
    icon: React.createElement(Building2, { className: 'w-6 h-6' }),
  },
  {
    id: 'multi-country',
    title: 'Multi-Country Operational Network',
    description:
      'Physical operations and registered entities in Nigeria, India, UAE, Ghana, and Uganda ensure rapid local mobilization backed by international standards and cross-border agility.',
    footerTag: '5 Active National Hubs',
    icon: React.createElement(Globe2, { className: 'w-6 h-6' }),
  },
  {
    id: 'quality-safety',
    title: 'ISO & NFPA Quality Assurance',
    description:
      'Rigorous ISO 9001:2015 quality management and strict NFPA fire & electrical safety protocols guarantee long-term asset integrity and zero-incident site performance.',
    footerTag: 'ISO 9001 & HSE Compliant',
    icon: React.createElement(ShieldCheck, { className: 'w-6 h-6' }),
  },
  {
    id: 'logistics-fleet',
    title: 'In-House Logistics & Heavy Equipment',
    description:
      'Haulify Heavy Logistics owns lowbed trailers and prime movers, guaranteeing seamless port-to-site equipment delivery without relying on third-party freight brokers.',
    footerTag: 'Owned Fleet & Route Clearance',
    icon: React.createElement(Truck, { className: 'w-6 h-6' }),
  },
  {
    id: 'uptime-support',
    title: '24/7 Technical Operations Uptime',
    description:
      'Round-the-clock rapid response teams for MEP breakdowns, power backup failures, and emergency facility dispatch ensure continuous business operation for clients.',
    footerTag: '24/7 Emergency Technical Support',
    icon: React.createElement(Clock, { className: 'w-6 h-6' }),
  },
  {
    id: 'oem-pricing',
    title: 'Direct OEM Pricing & Spare Support',
    description:
      'Authorized OEM relationships mean clients receive authentic switchgears, transformers, and industrial fittings at direct factory rates with certified warranties.',
    footerTag: 'Direct Factory Pricing',
    icon: React.createElement(Box, { className: 'w-6 h-6' }),
  },
];
