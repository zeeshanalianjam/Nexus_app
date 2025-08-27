import React from 'react';
import { Button } from './ui/Button';
import { Check, X, MapPin, Building, DollarSign, TrendingUp } from 'lucide-react';

const InvestorCard = ({ investor }) => {
  const handleAccept = () => {
    console.log('Accept investor:', investor.name);
  };

  const handleReject = () => {
    console.log('Reject investor:', investor.name);
  };

  return (
    <div className="glass-card rounded-xl p-6 card-hover">
      {/* Profile Section */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
          <span className="text-white font-bold text-xl">
            {investor.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg">{investor.name}</h3>
          <p className="text-gray-300 text-sm flex items-center">
            <Building size={14} className="mr-1" />
            {investor.firm}
          </p>
          <p className="text-gray-400 text-xs flex items-center mt-1">
            <MapPin size={12} className="mr-1" />
            {investor.location}
          </p>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm leading-relaxed">
          {investor.bio}
        </p>
      </div>

      {/* Investment Focus */}
      <div className="flex flex-wrap gap-2 mb-4">
        {investor.focusAreas.map((area, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30"
          >
            {area}
          </span>
        ))}
      </div>

      {/* Investment Info */}
      <div className="mb-4 p-3 bg-white/5 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-xs">Investment Range</span>
          <span className="text-green-400 font-semibold text-sm flex items-center">
            <DollarSign size={12} className="mr-1" />
            {investor.investmentRange}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-xs">Portfolio Size</span>
          <span className="text-blue-400 text-sm">{investor.portfolioSize} companies</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Success Rate</span>
          <span className="text-purple-400 text-sm flex items-center">
            <TrendingUp size={12} className="mr-1" />
            {investor.successRate}%
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          onClick={handleReject}
          className="flex-1 bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200 border border-red-500/30 flex items-center justify-center space-x-2 transition-all duration-300"
        >
          <X size={16} />
          <span>Reject</span>
        </Button>
        <Button
          onClick={handleAccept}
          className="flex-1 bg-green-500/20 text-green-300 hover:bg-green-500/30 hover:text-green-200 border border-green-500/30 flex items-center justify-center space-x-2 transition-all duration-300"
        >
          <Check size={16} />
          <span>Accept</span>
        </Button>
      </div>
    </div>
  );
};

export default InvestorCard;

