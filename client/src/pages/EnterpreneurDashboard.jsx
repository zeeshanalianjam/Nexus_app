import React, { useState } from 'react';
import Navbar from '../components/chatApp/Navbar';
import InvestorCard from '../components/chatApp/InvestorCard';
import { Search } from 'lucide-react';

const EntrepreneurDashboard = ({ onProfileClick, onLogoutClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for investors
  const investors = [
    {
      id: 1,
      name: 'Alexandra Morgan',
      firm: 'Venture Capital Partners',
      location: 'Palo Alto, CA',
      bio: 'Seasoned investor with 15+ years in tech startups. Led investments in 50+ companies with 8 successful exits including 2 unicorns.',
      focusAreas: ['AI/ML', 'SaaS', 'FinTech'],
      investmentRange: '1M - 10M',
      portfolioSize: 42,
      successRate: 78
    },
    {
      id: 2,
      name: 'Robert Chen',
      firm: 'Innovation Fund',
      location: 'San Francisco, CA',
      bio: 'Former entrepreneur turned investor. Specializes in early-stage B2B software companies and has a track record of hands-on mentorship.',
      focusAreas: ['B2B SaaS', 'Enterprise', 'Productivity'],
      investmentRange: '500K - 5M',
      portfolioSize: 28,
      successRate: 85
    },
    {
      id: 3,
      name: 'Maria Rodriguez',
      firm: 'GreenTech Ventures',
      location: 'Austin, TX',
      bio: 'Climate tech investor passionate about sustainable solutions. Focuses on companies addressing environmental challenges and clean energy.',
      focusAreas: ['CleanTech', 'Sustainability', 'Energy'],
      investmentRange: '2M - 15M',
      portfolioSize: 35,
      successRate: 72
    },
    {
      id: 4,
      name: 'David Kim',
      firm: 'HealthTech Capital',
      location: 'Boston, MA',
      bio: 'Healthcare industry veteran with deep expertise in medical devices and digital health. Former VP at major pharmaceutical company.',
      focusAreas: ['HealthTech', 'MedTech', 'Digital Health'],
      investmentRange: '3M - 20M',
      portfolioSize: 31,
      successRate: 80
    },
    {
      id: 5,
      name: 'Jennifer Liu',
      firm: 'Future Fund',
      location: 'New York, NY',
      bio: 'Next-generation investor focused on emerging technologies. Strong network in Asia-Pacific markets and cross-border investments.',
      focusAreas: ['Blockchain', 'Web3', 'Gaming'],
      investmentRange: '1M - 8M',
      portfolioSize: 24,
      successRate: 75
    },
    {
      id: 6,
      name: 'Michael Thompson',
      firm: 'Retail Innovation Partners',
      location: 'Chicago, IL',
      bio: 'E-commerce and retail technology expert. Previously founded and sold two successful retail startups. Now investing in the future of commerce.',
      focusAreas: ['E-commerce', 'Retail Tech', 'Consumer'],
      investmentRange: '500K - 7M',
      portfolioSize: 38,
      successRate: 82
    }
  ];

  const filteredInvestors = investors.filter(investor =>
    investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.focusAreas.some(area => 
      area.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen nexus-bg">
      <Navbar onProfileClick={onProfileClick} onLogoutClick={onLogoutClick} />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Entrepreneur Dashboard</h1>
          <p className="text-gray-300">Connect with investors who align with your vision</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search investors, firms, or focus areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Investors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestors.map(investor => (
            <InvestorCard
              key={investor.id}
              investor={investor}
            />
          ))}
        </div>

        {/* No results message */}
        {filteredInvestors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No investors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;

