import type { SVGProps } from 'react';

const EadersLogoComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg 
    width="160" 
    height="70" 
    viewBox="0 0 160 70" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Eaders by Nizami LTD Logo"
    {...props}
  >
    {/* Background rectangle - typically this would be transparent to inherit from header */}
    {/* <rect width="160" height="70" fill="#2A3B4C"/> */}

    {/* Book Icon */}
    <g transform="translate(55, 0) scale(0.35)">
      <path d="M83.3334 16.6667H16.6667C13.9053 16.6667 11.6667 18.9053 11.6667 21.6667V78.3333C11.6667 81.0947 13.9053 83.3333 16.6667 83.3333H83.3334C86.0947 83.3333 88.3334 81.0947 88.3334 78.3333V21.6667C88.3334 18.9053 86.0947 16.6667 83.3334 16.6667Z" fill="currentColor"/>
      <path d="M50 25V75C50 75 66.6667 70.8333 66.6667 50C66.6667 29.1667 50 25 50 25Z" fill="currentColor" fill-opacity="0.6"/>
      <path d="M50 25V75C50 75 33.3333 70.8333 33.3333 50C33.3333 29.1667 50 25 50 25Z" fill="currentColor" fill-opacity="0.6"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M50.0001 25.0001C50.0001 25.0001 33.3334 29.1668 33.3334 50.0001C33.3334 70.8335 50.0001 75.0001 50.0001 75.0001L50.0001 79.1668C29.1667 75.0001 29.1667 54.1668 29.1667 50.0001C29.1667 45.8335 29.1667 25.0001 50.0001 20.8335L50.0001 25.0001Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M50.0001 25.0001C50.0001 25.0001 66.6667 29.1668 66.6667 50.0001C66.6667 70.8335 50.0001 75.0001 50.0001 75.0001L50.0001 79.1668C70.8334 75.0001 70.8334 54.1668 70.8334 50.0001C70.8334 45.8335 70.8334 25.0001 50.0001 20.8335L50.0001 25.0001Z" fill="currentColor"/>
    </g>

    {/* Eaders Text */}
    <text 
      x="50%" 
      y="50" 
      dominantBaseline="middle" 
      textAnchor="middle" 
      fill="currentColor" 
      fontSize="28" 
      fontFamily="Georgia, 'Times New Roman', Times, serif"
      fontWeight="bold"
    >
      Eaders
    </text>

    {/* BY NIZAMI LTD Text */}
    <text 
      x="50%" 
      y="65" 
      dominantBaseline="middle" 
      textAnchor="middle" 
      fill="currentColor" 
      fontSize="8" 
      fontFamily="Poppins, Arial, sans-serif"
      letterSpacing="0.05em"
    >
      BY NIZAMI LTD
    </text>
  </svg>
);

export default EadersLogoComponent;
