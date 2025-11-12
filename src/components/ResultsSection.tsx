'use client';

import { useState } from 'react';

interface ResultHoverData {
  title: string;
  details: string[];
}

const ResultsSection = () => {
  const [hoveredResult, setHoveredResult] = useState<number | null>(null);

  const results = [
    {
      stat: "200-400+",
      label: "Records monthly with 99%+ accuracy",
      hoverData: {
        title: "Wholesale Distribution Company (2021-Present)",
        details: [
          "Processed 200-400 invoices & inventory records monthly",
          "Built Excel templates with data validation (99%+ accuracy)",
          "Organized supplier/customer data across 50+ accounts",
          "Created daily/weekly operational reports for management"
        ]
      }
    },
    {
      stat: "5+ Hours",
      label: "Weekly time saved through automation",
      hoverData: {
        title: "Email Automation Project",
        details: [
          "Identified repetitive email → spreadsheet copying (8 hours/week)",
          "Built Zapier workflow: Email with attachment → Parse data → Google Sheets → Slack notification",
          "Added data validation and duplicate checking",
          "Time saved: 5+ hours weekly (260+ hours annually)"
        ]
      }
    },
    {
      stat: "40%",
      label: "Reduction in month-end reporting time",
      hoverData: {
        title: "Excel Template System",
        details: [
          "Created reusable templates with formulas, pivot tables, conditional formatting",
          "Added dropdown menus and validation rules",
          "Built automated calculation sheets for financial tracking",
          "Reduced month-end reporting time by 40%"
        ]
      }
    },
    {
      stat: "20-25%",
      label: "Improvement in response rates",
      hoverData: {
        title: "Client Follow-up System",
        details: [
          "Implemented systematic email follow-up schedule",
          "Created tracking spreadsheet with reminders",
          "Sent timely payment reminders and check-ins",
          "Response rates improved 20-25%, reduced overdue accounts"
        ]
      }
    }
  ];

  const deliverables = [
    "Organized data systems with clean spreadsheets and structured databases",
    "Custom Zapier automations connecting your essential tools",
    "Operational reports formatted for quick decision-making",
    "Standard operating procedures documenting all workflows",
    "10-15 hours of your time freed weekly"
  ];

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#4D64FF] rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Real Results & What You'll Get
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Hover over each result to see the full story
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-20">
          {results.map((result, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setHoveredResult(index)}
              onMouseLeave={() => setHoveredResult(null)}
            >
              {/* Result Card */}
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 transition-all duration-500 hover:bg-white/10 hover:border-[#4D64FF]/50 hover:-translate-y-2 cursor-pointer overflow-hidden">
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4D64FF]/0 via-[#4D64FF]/0 to-[#4D64FF]/0 group-hover:from-[#4D64FF]/10 group-hover:via-[#4D64FF]/5 group-hover:to-transparent transition-all duration-500 rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#4D64FF] mb-4 group-hover:scale-110 transition-transform duration-500">
                    {result.stat}
                  </div>
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                    {result.label}
                  </p>
                  
                  {/* Hover Indicator */}
                  <div className="mt-4 flex items-center gap-2 text-sm text-[#4D64FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>See details</span>
                    <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Hover Card */}
                <div className={`absolute left-0 right-0 top-full mt-4 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-black/95 backdrop-blur-xl border border-[#4D64FF]/30 rounded-2xl p-6 md:p-8 shadow-2xl transition-all duration-500 ${
                  hoveredResult === index 
                    ? 'opacity-100 translate-y-0 pointer-events-auto' 
                    : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                    {result.hoverData.title}
                  </h3>
                  <div className="space-y-3">
                    {result.hoverData.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="text-[#4D64FF] mt-1.5">•</span>
                        <p className="text-gray-300 leading-relaxed">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Deliverables Section */}
        <div className="bg-gradient-to-br from-[#4D64FF]/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            What You'll Receive
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deliverables.map((item, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 group cursor-default"
              >
                <div className="w-8 h-8 rounded-full bg-[#4D64FF]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#4D64FF]/40 transition-colors duration-300">
                  <svg className="w-5 h-5 text-[#4D64FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;