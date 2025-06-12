import React from 'react';

const LoadingPage = ({ text = "Lagi nentuin gaya belajarmu nih..." }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] flex flex-col items-center justify-center">
      {/* Custom CSS for brutal bounce animation */}
      <style jsx>{`
        @keyframes brutalBounce {
          0%, 100% { 
            transform: translateY(0px);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% { 
            transform: translateY(-40px);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        
        .brutal-bounce {
          animation: brutalBounce 1.2s infinite;
        }
        
        @media (min-width: 768px) {
          @keyframes brutalBounce {
            0%, 100% { 
              transform: translateY(0px);
              animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }
            50% { 
              transform: translateY(-50px);
              animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
            }
          }
        }
        
        @media (min-width: 1024px) {
          @keyframes brutalBounce {
            0%, 100% { 
              transform: translateY(0px);
              animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }
            50% { 
              transform: translateY(-60px);
              animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
            }
          }
        }
      `}</style>
      
      {/* Animated Bouncing Circles - Wave Pattern */}
      <div className="flex space-x-2 sm:space-x-3 lg:space-x-4 mb-8 lg:mb-12">
        <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gradient-to-b from-[#FFFFFF] to-[#D9D9D9] rounded-full brutal-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gradient-to-b from-[#FFFFFF] to-[#D9D9D9] rounded-full brutal-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gradient-to-b from-[#FFFFFF] to-[#D9D9D9] rounded-full brutal-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gradient-to-b from-[#FFFFFF] to-[#D9D9D9] rounded-full brutal-bounce" style={{ animationDelay: '0.3s' }}></div>
      </div>
      
      {/* Loading Text - Responsive */}
      <p className="text-white text-xl sm:text-2xl lg:text-4xl font-bold text-center px-4 max-w-4xl leading-relaxed">
        {text}
      </p>
    </div>
  );
};

export default LoadingPage;