import React from 'react';
import { Button } from './ui/Button';
import { MessageCircle, Handshake, MapPin, Briefcase } from 'lucide-react';

const EntrepreneurCard = ({ entrepreneur }) => {
  const handleMessage = () => {
    console.log('Message entrepreneur:', entrepreneur.name);
  };

  const handleCollaborateRequest = () => {
    console.log('Collaborate request to:', entrepreneur.name);
  };

  return (
    <div className="glass-card rounded-xl p-6 card-hover">
      {/* Profile Section */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <span className="text-white font-bold text-xl">
            {entrepreneur.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg">{entrepreneur.name}</h3>
          <p className="text-gray-300 text-sm flex items-center">
            <Briefcase size={14} className="mr-1" />
            {entrepreneur.company}
          </p>
          <p className="text-gray-400 text-xs flex items-center mt-1">
            <MapPin size={12} className="mr-1" />
            {entrepreneur.location}
          </p>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm leading-relaxed">
          {entrepreneur.bio}
        </p>
      </div>

      {/* Industry Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {entrepreneur.industries.map((industry, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
          >
            {industry}
          </span>
        ))}
      </div>

      {/* Funding Info */}
      <div className="mb-4 p-3 bg-white/5 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-xs">Funding Needed</span>
          <span className="text-green-400 font-semibold text-sm">
            ${entrepreneur.fundingNeeded}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Stage</span>
          <span className="text-blue-400 text-sm">{entrepreneur.stage}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          onClick={handleMessage}
          className="flex-1 btn-secondary text-white hover:text-white flex items-center justify-center space-x-2"
        >
          <MessageCircle size={16} />
          <span>Message</span>
        </Button>
        <Button
          onClick={handleCollaborateRequest}
          className="flex-1 btn-primary text-white hover:text-white flex items-center justify-center space-x-2"
        >
          <Handshake size={16} />
          <span>Collaborate</span>
        </Button>
      </div>
    </div>
  );
};

export default EntrepreneurCard;

