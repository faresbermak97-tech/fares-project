'use client';

import { useState } from 'react';

const PricingSection = () => {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const plans = [
    {
      name: "Essential Support",
      price: "$800",
      period: "/month",
      hours: "20 hours monthly",
      tagline: "Perfect for solopreneurs",
      features: [
        "20 hours monthly support",
        "Email and calendar management",
        "Data entry up to 150 records/month",
        "Basic document organization",
        "Email support (response within 4 hours)",
        "Monthly summary report"
      ],
      bestFor: "Solopreneurs and freelancers needing consistent admin support",
      notIncluded: "Custom automation, CRM management, weekly calls",
      color: "from-pink-500 to-rose-500"
    },
    {
      name: "Full Support",
      price: "$1,400",
      period: "/month",
      hours: "40 hours monthly",
      tagline: "Ideal for small teams",
      popular: true,
      features: [
        "40 hours monthly support",
        "Everything in Essential Support",
        "Data entry up to 400 records/month",
        "CRM management and updates",
        "Client communication handling",
        "Report generation and spreadsheet development",
        "Weekly 15-minute status calls",
        "Priority response (within 2 hours)"
      ],
      bestFor: "Small teams and growing businesses needing comprehensive admin support",
      notIncluded: "Unlimited data entry, custom automation consulting",
      color: "from-[#4D64FF] to-purple-500"
    },
    {
      name: "Premium Support",
      price: "$2,200",
      period: "/month",
      hours: "80 hours monthly",
      tagline: "Best for growing businesses",
      features: [
        "80 hours monthly (½ time dedicated)",
        "Everything in Full Support",
        "Unlimited data entry",
        "Priority response (2-hour turnaround)",
        "Custom automation and process setup",
        "Proactive optimization consulting",
        "Bi-weekly strategy calls",
        "Dedicated Slack channel"
      ],
      bestFor: "Established businesses ready to scale operations",
      bonus: "Free process audit and automation roadmap ($500 value)",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  const addons = [
    { name: "Additional hours", price: "$30/hour" },
    { name: "One-time data cleanup projects", price: "Custom quote" },
    { name: "Advanced automation setup", price: "$200-500 per workflow" }
  ];

  return (
    <section className="relative py-24 md:py-32 bg-[#f5f5f5] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4D64FF] rounded-full opacity-5 blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full opacity-5 blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Pricing & Packages
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Transparent pricing. Flexible plans. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-[#4D64FF] to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Pricing Card */}
              <div className={`relative bg-white rounded-3xl shadow-xl transition-all duration-500 overflow-hidden ${
                plan.popular 
                  ? 'border-2 border-[#4D64FF] scale-105 lg:scale-110' 
                  : 'border border-gray-200 hover:border-[#4D64FF]/50 hover:scale-105'
              }`}>
                {/* Gradient Header */}
                <div className={`bg-gradient-to-br ${plan.color} p-8 text-white`}>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-white/90 mb-6">{plan.tagline}</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-5xl md:text-6xl font-bold">{plan.price}</span>
                    <span className="text-xl text-white/80 mb-2">{plan.period}</span>
                  </div>
                  <p className="text-white/90">{plan.hours}</p>
                </div>

                {/* Features */}
                <div className="p-8">
                  <div className="space-y-4 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-[#4D64FF] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hover Details */}
                  <div className={`transition-all duration-500 overflow-hidden ${
                    hoveredPlan === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pt-6 border-t border-gray-200 space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">Best For:</p>
                        <p className="text-sm text-gray-600">{plan.bestFor}</p>
                      </div>
                      {plan.notIncluded && (
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-1">Not Included:</p>
                          <p className="text-sm text-gray-600">{plan.notIncluded}</p>
                        </div>
                      )}
                      {plan.bonus && (
                        <div className="bg-[#4D64FF]/10 rounded-lg p-4">
                          <p className="text-sm font-semibold text-[#4D64FF] mb-1">Bonus:</p>
                          <p className="text-sm text-gray-700">{plan.bonus}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className={`w-full mt-8 py-4 rounded-full font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#4D64FF] to-purple-500 text-white hover:shadow-xl hover:scale-105'
                      : 'bg-gray-900 text-white hover:bg-[#4D64FF] hover:shadow-xl'
                  }`}>
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-gray-200">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Add-ons Available
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addons.map((addon, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#4D64FF]/30 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#4D64FF]/10 flex items-center justify-center mb-4 group-hover:bg-[#4D64FF]/20 transition-colors">
                  <svg className="w-6 h-6 text-[#4D64FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-gray-900 font-medium mb-2">{addon.name}</p>
                <p className="text-[#4D64FF] font-semibold">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trial Notice */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-lg">
            All packages include a <span className="font-semibold text-gray-900">2-week trial</span>. 
            Cancel anytime with 14 days notice.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;