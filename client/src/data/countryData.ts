import nigeriaImg from '../assets/nigrria.png';
import indiaImg from '../assets/india.png';
import uaeImg from '../assets/uae.png';
import ghanaImg from '../assets/ghana.png';
import ugandaImg from '../assets/uganda.png';

export interface KeyProject {
  title: string;
  category: string;
  description: string;
}

export interface LocalOffice {
  address: string;
  phone: string;
  email: string;
}

export interface CountryStat {
  label: string;
  value: string;
}

export interface CountryData {
  name: string;
  slug: string;
  flag: string;
  capital: string;
  currency: string;
  code: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  focusOneLiner: string;
  overviewText: string;
  cardImage: string;
  heroImage: string;
  mapEmbedUrl: string;
  keyProjects: KeyProject[];
  localOffice: LocalOffice;
  stats: CountryStat[];
}

export const COUNTRY_DATA: CountryData[] = [
  {
    name: 'Nigeria',
    slug: 'nigeria',
    flag: '🇳🇬',
    capital: 'Abuja',
    currency: 'NGN (₦)',
    code: '+234',
    metaTitle: 'Merald Group Nigeria — EPC Contracting, IFM & Technical Manpower',
    metaDescription: 'Leading infrastructure, MEP engineering, facility management & skilled manpower supply in Lagos, Abuja & Port Harcourt.',
    heroHeadline: 'Driving Infrastructure Growth Across West Africa',
    focusOneLiner: 'Heavy industrial EPC contracting, oil & gas services, commercial high-rise MEP, and IFM.',
    overviewText: 'Merald Group Nigeria stands at the forefront of engineering construction, facility management, and workforce deployment in West Africa. From 22-storey commercial towers in Victoria Island to heavy industrial piping networks in oil & gas zones.',
    cardImage: nigeriaImg,
    heroImage: nigeriaImg,
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63430.730248232!2d3.398687!3d6.430076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c7d9e1!2sVictoria%20Island%2C%20Lagos%2C%20Nigeria!5e0!3m2!1sen!2sin!4v1680000000000',
    keyProjects: [
      { title: 'Lagos Financial Hub MEP Contracting', category: 'MEP Engineering', description: 'Complete electrical, HVAC, and fire suppression installation for a 22-storey commercial tower.' },
      { title: 'Abuja Corporate Complex IFM', category: 'Integrated Facility Management', description: 'Comprehensive 24/7 facility maintenance and power management for corporate headquarters.' },
    ],
    localOffice: {
      address: 'Plot 14, Victoria Island Commercial District, Lagos, Nigeria',
      phone: '+234 1 234 5678',
      email: 'nigeria@meraldgroup.com',
    },
    stats: [
      { label: 'Active Sites', value: '14+' },
      { label: 'Manpower Deployed', value: '1,800+' },
      { label: 'Projects Completed', value: '45+' },
    ],
  },
  {
    name: 'India',
    slug: 'india',
    flag: '🇮🇳',
    capital: 'New Delhi',
    currency: 'INR (₹)',
    code: '+91',
    metaTitle: 'Merald Group India — Technical Workforce, MEP Engineering & Logistics',
    metaDescription: 'Premier engineering operations, MEP solutions and industrial workforce hub in Gurgaon, Mumbai & Bengaluru.',
    heroHeadline: 'Engineering Excellence & Global Resource Hub',
    focusOneLiner: 'Technical engineering center, heavy logistics management, and global resource recruitment hub.',
    overviewText: 'Our Indian operational centers in New Delhi and Gurgaon drive heavy MEP engineering design, technical recruitment, and Haulify supply chain fleet management across Asia and international markets.',
    cardImage: indiaImg,
    heroImage: indiaImg,
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14002.32!2d77.1610!3d28.6922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0240d4f6c40d%3A0x6b4a3a6b5711a12!2sTri%20Nagar%2C%20Delhi%2C%20110035!5e0!3m2!1sen!2sin!4v1680000000000',
    keyProjects: [
      { title: 'Gurgaon Tech Park HVAC & Power Infrastructure', category: 'EPC / MEP', description: 'High-efficiency chiller plant and substation commissioning.' },
      { title: 'Mumbai Logistics Hub Haulify Fleet', category: 'Haulify Logistics', description: 'Fleet management and heavy equipment transportation for industrial parks.' },
    ],
    localOffice: {
      address: 'Plot 42, Commercial Complex, Tri Nagar, New Delhi 110035, India',
      phone: '+91 11 2738 4567',
      email: 'india@meraldgroup.com',
    },
    stats: [
      { label: 'Active Sites', value: '20+' },
      { label: 'Manpower Deployed', value: '3,200+' },
      { label: 'Projects Completed', value: '80+' },
    ],
  },
  {
    name: 'United Arab Emirates',
    slug: 'uae',
    flag: '🇦🇪',
    capital: 'Abu Dhabi',
    currency: 'AED',
    code: '+971',
    metaTitle: 'Merald Group UAE — MEP Engineering & High-End Facility Management',
    metaDescription: 'World-class MEP contracting, IFM services and specialized manpower in Dubai & Abu Dhabi.',
    heroHeadline: 'Next-Generation MEP Solutions & Facility Operations',
    focusOneLiner: 'High-spec MEP engineering, cleanroom facility management, and commercial tower operations.',
    overviewText: 'In the Middle East, Merald Group delivers high-spec MEP engineering, cleanroom environmental management, and sustainable facility operations for landmark towers and Dubai logistics parks.',
    cardImage: uaeImg,
    heroImage: uaeImg,
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28882.11!2d55.2708!3d25.1862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682def26a615%3A0x296f8c44c538356!2sBusiness%20Bay%2C%20Dubai%2C%20UAE!5e0!3m2!1sen!2sin!4v1680000000000',
    keyProjects: [
      { title: 'Dubai Logistics City Facility Operations', category: 'IFM Services', description: 'Comprehensive MEP maintenance and cleanroom environmental management.' },
      { title: 'Abu Dhabi Marina High-Rise MEP Installation', category: 'MEP Engineering', description: 'Smart building automation, HVAC, and plumbing infrastructure.' },
    ],
    localOffice: {
      address: 'Business Bay Tower, Office 1402, Dubai, UAE',
      phone: '+971 4 567 8900',
      email: 'uae@meraldgroup.com',
    },
    stats: [
      { label: 'Active Sites', value: '10+' },
      { label: 'Manpower Deployed', value: '1,100+' },
      { label: 'Projects Completed', value: '30+' },
    ],
  },
  {
    name: 'Ghana',
    slug: 'ghana',
    flag: '🇬🇭',
    capital: 'Accra',
    currency: 'GHS',
    code: '+233',
    metaTitle: 'Merald Group Ghana — Industrial MEP & Workforce Supply',
    metaDescription: 'Reliable engineering construction and technical manpower supply in Accra & Tema industrial zones.',
    heroHeadline: 'Building Sustainable Infrastructure in Ghana',
    focusOneLiner: 'Industrial power distribution, switchgear assembly, and port logistics management.',
    overviewText: 'Supporting Ghana’s industrial growth through heavy engineering solutions, power distribution switchgears, Tema port logistics, and technical workforce deployment.',
    cardImage: ghanaImg,
    heroImage: ghanaImg,
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15882.3!2d-0.1833!3d5.6000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9a75161048e9%3A0xb36bfaae471869e5!2sAirport%20Residential%20Area%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2sin!4v1680000000000',
    keyProjects: [
      { title: 'Tema Port Industrial Distribution Center', category: 'Product Distribution', description: 'Electrical distribution board fabrication and power grid integration.' },
    ],
    localOffice: {
      address: 'Airport Residential Area, Accra, Ghana',
      phone: '+233 30 212 3456',
      email: 'ghana@meraldgroup.com',
    },
    stats: [
      { label: 'Active Sites', value: '6+' },
      { label: 'Manpower Deployed', value: '600+' },
      { label: 'Projects Completed', value: '18+' },
    ],
  },
  {
    name: 'Uganda',
    slug: 'uganda',
    flag: '🇺🇬',
    capital: 'Kampala',
    currency: 'UGX',
    code: '+256',
    metaTitle: 'Merald Group Uganda — Energy & Technical Manpower Solutions',
    metaDescription: 'Leading technical workforce supply, MEP contracting & industrial logistics in Kampala.',
    heroHeadline: 'Empowering East African Infrastructure Projects',
    focusOneLiner: 'Power infrastructure substations, heavy industrial piping, and technical workforce deployment.',
    overviewText: 'Delivering technical workforce solutions, MEP power grid installations, and haulify heavy equipment logistics across Kampala and East Africa.',
    cardImage: ugandaImg,
    heroImage: ugandaImg,
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.0!2d32.5822!3d0.3163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb7e8d249f05%3A0xa97c9b8cfcb08e33!2sNakasero%2C%20Kampala%2C%20Uganda!5e0!3m2!1sen!2sin!4v1680000000000',
    keyProjects: [
      { title: 'Kampala Industrial Estate Power Substation', category: 'EPC / MEP', description: 'Substation installation and high-voltage cabling.' },
    ],
    localOffice: {
      address: 'Nakasero Business Hill, Kampala, Uganda',
      phone: '+256 41 412 3456',
      email: 'uganda@meraldgroup.com',
    },
    stats: [
      { label: 'Active Sites', value: '5+' },
      { label: 'Manpower Deployed', value: '450+' },
      { label: 'Projects Completed', value: '12+' },
    ],
  },
];

export const getCountriesList = (): CountryData[] => {
  return COUNTRY_DATA;
};

export const getCountryBySlug = (slug: string): CountryData | undefined => {
  return COUNTRY_DATA.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
};
