'use client';
import { useState } from 'react';

export default function Accordion() {
  const [activeStep, setActiveStep] = useState('01');

  const steps = [
    {
      num: '01',
      name: 'Brief & References',
      body: 'We align on visual direction — mood boards, reference films, brand identity. Your vision becomes my north star. I don\'t start a single node until we\'re speaking the same visual language.'
    },
    {
      num: '02',
      name: 'Technical Setup',
      body: 'LUT loading, camera profile matching, scene normalization — every frame starts from the best possible foundation. ACES or custom pipeline depending on the project.'
    },
    {
      num: '03',
      name: 'Primary Grade',
      body: 'Shot-by-shot balance and scene continuity — the invisible foundation that separates professional work from ordinary. Exposure, contrast, white balance: perfect first, creative second.'
    },
    {
      num: '04',
      name: 'Creative Look',
      body: 'Emotion, atmosphere, story-driven color decisions. This is where footage becomes feeling. The look that makes someone lean forward in their seat without knowing why — that\'s what I\'m after.'
    },
    {
      num: '05',
      name: 'Review & Delivery',
      body: 'Client review via Frame.io, revisions, final delivery in DCP, ProRes, or H.265 — whatever your pipeline demands. I stay through delivery, not just the grade.'
    }
  ];

  const handleToggle = (num) => {
    setActiveStep(activeStep === num ? null : num);
  };

  return (
    <div className="proc-list">
      {steps.map((step) => {
        const isActive = activeStep === step.num;
        return (
          <div 
            key={step.num}
            className={`proc-item ${isActive ? 'active' : ''}`} 
            data-step={step.num}
          >
            <div className="proc-header" onClick={() => handleToggle(step.num)}>
              <span className="proc-num">{step.num}</span>
              <span className="proc-name rgb-hover">{step.name}</span>
              <span 
                className="proc-arrow"
                style={{ 
                  transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                  display: 'inline-block',
                  transition: 'transform 0.3s ease'
                }}
              >
                ↓
              </span>
            </div>
            <div 
              className="proc-body" 
              style={{ 
                maxHeight: isActive ? '200px' : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.4s ease-in-out'
              }}
            >
              <p style={{ paddingBottom: '30px' }}>{step.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
