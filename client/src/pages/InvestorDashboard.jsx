import React, { useState } from 'react';
import Navbar from '../components/chatApp/Navbar';
import EntrepreneurCard from '../components/chatApp/EnterpreneurCard';
import { Search } from 'lucide-react';

const InvestorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for entrepreneurs
  const entrepreneurs = [
    {
      id: 1,
      name: 'Sarah Johnson',
      company: 'EcoTech Solutions',
      location: 'San Francisco, CA',
      bio: 'Building sustainable technology solutions for a greener future. Our AI-powered platform helps companies reduce their carbon footprint by 40%.',
      industries: ['CleanTech', 'AI', 'Sustainability'],
      fundingNeeded: '2.5M',
      stage: 'Series A'
    },
    {
      id: 2,
      name: 'Michael Chen',
      company: 'HealthAI Labs',
      location: 'Boston, MA',
      bio: 'Revolutionizing healthcare with machine learning. Our diagnostic platform can detect diseases 3x faster than traditional methods.',
      industries: ['HealthTech', 'AI', 'Diagnostics'],
      fundingNeeded: '5M',
      stage: 'Series B'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      company: 'FinFlow',
      location: 'New York, NY',
      bio: 'Democratizing financial services for underbanked communities. Our mobile-first platform serves 100K+ users across Latin America.',
      industries: ['FinTech', 'Mobile', 'Inclusion'],
      fundingNeeded: '1.8M',
      stage: 'Seed'
    },
    {
      id: 4,
      name: 'David Kim',
      company: 'SpaceLogistics',
      location: 'Los Angeles, CA',
      bio: 'Next-generation satellite deployment and space logistics. Reducing launch costs by 60% through innovative propulsion technology.',
      industries: ['SpaceTech', 'Logistics', 'Hardware'],
      fundingNeeded: '10M',
      stage: 'Series A'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      company: 'EduVerse',
      location: 'Austin, TX',
      bio: 'Immersive VR education platform transforming how students learn. Partnered with 200+ schools to deliver engaging STEM education.',
      industries: ['EdTech', 'VR', 'STEM'],
      fundingNeeded: '3.2M',
      stage: 'Series A'
    },
    {
      id: 6,
      name: 'James Wilson',
      company: 'AgriBot',
      location: 'Denver, CO',
      bio: 'Autonomous farming robots increasing crop yields by 35%. Our AI-powered bots handle planting, monitoring, and harvesting.',
      industries: ['AgTech', 'Robotics', 'AI'],
      fundingNeeded: '4.5M',
      stage: 'Series A'
    }
  ];

  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur =>
    entrepreneur.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entrepreneur.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entrepreneur.industries.some(industry => 
      industry.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen nexus-bg">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Investor Dashboard</h1>
          <p className="text-gray-300">Discover and connect with innovative entrepreneurs</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search entrepreneurs, companies, or industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Entrepreneurs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntrepreneurs.map(entrepreneur => (
            <EntrepreneurCard
              key={entrepreneur.id}
              entrepreneur={entrepreneur}
            />
          ))}
        </div>

        {/* No results message */}
        {filteredEntrepreneurs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No entrepreneurs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorDashboard;

