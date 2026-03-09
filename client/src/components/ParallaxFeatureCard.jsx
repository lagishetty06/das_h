import React, { useState } from 'react';

const ParallaxFeatureCard = ({ icon, title, description }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!isHovering) setIsHovering(true);
    const card = e.currentTarget;
    const { width, height, left, top } = card.getBoundingClientRect();
    
    const xVal = e.clientX - (left + width / 2);
    const yVal = e.clientY - (top + height / 2);

    // Adjust '20' for more/less tilt sensitivity
    const yRotation = (xVal / width) * 20;
    const xRotation = -(yVal / height) * 20;

    setRotate({ x: xRotation, y: yRotation });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative p-6 bg-white rounded-lg shadow-xl border border-gray-200"
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transformStyle: 'preserve-3d',
        // Only apply smooth transition when mouse leaves, not while moving
        transition: isHovering ? 'none' : 'transform 0.3s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Inner element that "pops out" using translateZ */}
      <div style={{ transform: 'translateZ(40px)' }}>
        <dt className="text-lg font-semibold leading-7 text-gray-900 flex items-center mb-2">
          <span className="h-6 w-6 flex items-center justify-center rounded-full bg-indigo-100 text-button-primary mr-3">
            {icon}
          </span>
          {title}
        </dt>
        <dd className="mt-2 text-base leading-7 text-gray-600">
          {description}
        </dd>
        <div className="mt-4 text-sm text-text-link hover:text-text-link-hover font-medium cursor-pointer">
          Learn More
        </div>
      </div>
    </div>
  );
};

export default ParallaxFeatureCard;