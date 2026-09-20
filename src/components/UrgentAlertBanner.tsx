import React from 'react';
import { AlertOctagon, PhoneCall } from 'lucide-react';

interface UrgentAlertBannerProps {
  customMessage?: string;
}

export const UrgentAlertBanner: React.FC<UrgentAlertBannerProps> = ({ customMessage }) => {
  return (
    <div className="urgent-banner" role="alert" aria-live="assertive">
      <AlertOctagon className="urgent-banner-icon" aria-hidden="true" />
      <div className="urgent-banner-content">
        <h3>High Urgency or Immediate Risk Detected</h3>
        <p>
          {customMessage || 
            'You have indicated an urgent situation involving imminent safety risk, criminal allegation, arrest, domestic violence, immediate physical danger, or an impending court deadline. Automated AI guidance is strictly insufficient for urgent situations.'
          }
        </p>
        <p style={{ fontWeight: 600 }}>
          Please reach out immediately to qualified authorities or official emergency helplines:
        </p>
        <div className="helpline-badges" role="list" aria-label="Official emergency helplines">
          <span className="helpline-badge" role="listitem">
            <PhoneCall size={14} aria-hidden="true" /> National Emergency: 112
          </span>
          <span className="helpline-badge" role="listitem">
            <PhoneCall size={14} aria-hidden="true" /> NALSA Free Legal Aid: 15100
          </span>
          <span className="helpline-badge" role="listitem">
            <PhoneCall size={14} aria-hidden="true" /> Women Helpline: 1091
          </span>
          <span className="helpline-badge" role="listitem">
            <PhoneCall size={14} aria-hidden="true" /> Childline: 1098
          </span>
        </div>
        <p style={{ marginTop: '0.6rem', fontSize: '0.82rem', opacity: 0.9 }}>
          *Note: These emergency numbers and legal assistance desks are official government services, provided here for rapid access. They do not constitute formal legal representation until assigned.
        </p>
      </div>
    </div>
  );
};
