import { LegalSource } from './types.js';

export const CURATED_LEGAL_SOURCES: LegalSource[] = [
  {
    id: 'nalsa-legal-aid',
    title: 'NALSA Legal Aid Schemes & Entitlements',
    url: 'https://nalsa.gov.in/legal-aid/',
    authority: 'National Legal Services Authority (NALSA)',
    topic: 'legal_aid',
    jurisdiction: 'National (India)',
    relevance: 'Official criteria for free legal aid under Section 12 of the Legal Services Authorities Act, 1987, including women, children, SC/ST, and low-income criteria.',
    lastChecked: '2025-01-15',
    isOfficial: true
  },
  {
    id: 'nalsa-home',
    title: 'National Legal Services Authority Portal',
    url: 'https://nalsa.gov.in/',
    authority: 'National Legal Services Authority (NALSA)',
    topic: 'legal_aid',
    jurisdiction: 'National (India)',
    relevance: 'Central authority overseeing State (SLSA), District (DLSA), and Taluk (TLSC) legal services authorities across India.',
    lastChecked: '2025-01-15',
    isOfficial: true
  },
  {
    id: 'ecourts-filing',
    title: 'eCourts e-Filing System (v3.0)',
    url: 'https://filing.ecourts.gov.in/',
    authority: 'e-Committee, Supreme Court of India',
    topic: 'general',
    jurisdiction: 'National (India)',
    relevance: 'Electronic filing system enabling advocates and citizens to file cases and petitions across High Courts and District Courts in India.',
    lastChecked: '2025-01-15',
    isOfficial: true
  },
  {
    id: 'ecourts-services',
    title: 'eCourts Services National Portal',
    url: 'https://ecourts.gov.in/',
    authority: 'e-Committee, Supreme Court of India',
    topic: 'general',
    jurisdiction: 'National (India)',
    relevance: 'Official portal for tracking case status, cause lists, orders, and judgments across Indian district and subordinate courts.',
    lastChecked: '2025-01-15',
    isOfficial: true
  },
  {
    id: 'dslsa-delhi',
    title: 'Delhi State Legal Services Authority (DSLSA)',
    url: 'https://dslsa.org/',
    authority: 'Delhi State Legal Services Authority',
    topic: 'legal_aid',
    jurisdiction: 'Delhi',
    relevance: 'Information on free legal aid, panel lawyers, front offices, and Lok Adalats for the National Capital Territory of Delhi.',
    lastChecked: '2025-01-15',
    isOfficial: true
  },
  {
    id: 'mslsa-maharashtra',
    title: 'Maharashtra State Legal Services Authority (MSLSA)',
    url: 'https://legalservices.maharashtra.gov.in/',
    authority: 'Maharashtra State Legal Services Authority',
    topic: 'legal_aid',
    jurisdiction: 'Maharashtra',
    relevance: 'Free legal aid, ADR centers, and District Legal Services Authorities across Maharashtra.',
    lastChecked: '2025-01-15',
    isOfficial: true
  },
  {
    id: 'kslsa-karnataka',
    title: 'Karnataka State Legal Services Authority (KSLSA)',
    url: 'https://kslsa.kar.nic.in/',
    authority: 'Karnataka State Legal Services Authority',
    topic: 'legal_aid',
    jurisdiction: 'Karnataka',
    relevance: 'Legal aid clinics, family counseling, and Lok Adalat services for citizens in Karnataka.',
    lastChecked: '2025-01-15',
    isOfficial: true
  },
  {
    id: 'edaakhil-consumer',
    title: 'e-Daakhil Consumer Grievance Portal',
    url: 'https://edaakhil.nic.in/',
    authority: 'National Consumer Disputes Redressal Commission (NCDRC)',
    topic: 'rental',
    jurisdiction: 'National (India)',
    relevance: 'Official portal for filing consumer complaints online before District, State, and National Consumer Commissions (e.g., deficiency of service, unfair trade practices).',
    lastChecked: '2025-01-15',
    isOfficial: true
  },
  {
    id: 'samadhan-labour',
    title: 'SAMADHAN Conciliation Portal (Ministry of Labour)',
    url: 'https://samadhan.labour.gov.in/',
    authority: 'Ministry of Labour and Employment, Govt. of India',
    topic: 'employment',
    jurisdiction: 'National (India)',
    relevance: 'Official online dispute resolution portal for conciliation and industrial/employment disputes under central labour jurisdiction.',
    lastChecked: '2025-01-15',
    isOfficial: true
  }
];

export function getSourcesForWorkflow(topic: string, jurisdiction?: string): LegalSource[] {
  return CURATED_LEGAL_SOURCES.filter(source => {
    const topicMatch = source.topic === topic || source.topic === 'general';
    const jurisdictionMatch = 
      !jurisdiction || 
      source.jurisdiction === 'National (India)' || 
      source.jurisdiction.toLowerCase().includes(jurisdiction.toLowerCase());
    return topicMatch && jurisdictionMatch;
  });
}
