import { company } from './company.js';

export const careers = {
  // Replace only when ARRC confirms a dedicated recruitment email address.
  email: company.email,
  introduction:
    'Good service begins with people who care. Explore opportunities to contribute to security, facility management and the teams that keep our operations connected.',
  note: 'These are areas of work, rather than a list of confirmed vacancies. Our team can discuss current requirements and suitable opportunities with you.',
};

export const careerCategories = [
  {
    id: 'direct',
    title: 'Direct staff',
    eyebrow: 'ON THE GROUND. MAKING A DIFFERENCE.',
    icon: 'ShieldCheck',
    description:
      'Bring professionalism and care to the places we protect. Explore on-site security, supervision, training and facility roles.',
    roles: [
      'Security Guards',
      'Supervisors',
      'ASO',
      'SO',
      'Gunman-Civilian',
      'Ex-serviceman',
      'Ex-Service Man Training Officer',
      'PSO',
      'Facility Staff',
    ],
  },
  {
    id: 'indirect',
    title: 'Indirect staff',
    eyebrow: 'BEHIND THE SCENES. MOVING US FORWARD.',
    icon: 'BriefcaseBusiness',
    description:
      'Support the people who deliver our services. Explore opportunities across our business, administration and operational support functions.',
    roles: [
      'Management Staff',
      'Sales',
      'Accounts & Finance',
      'Operations',
      'Payroll Management',
      'HR',
      'CRM',
    ],
  },
];
