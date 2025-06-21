import React from 'react';

const StarRating = ({ count = 5 }) => {
  return (
    <div className="flex mt-3 gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="16"
          height="15"
          viewBox="0 0 16 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.524.464a.5.5 0 0 1 .952 0l1.432 4.41a.5.5 0 0 0 .476.345h4.637a.5.5 0 0 1 .294.904L11.563 8.85a.5.5 0 0 0-.181.559l1.433 4.41a.5.5 0 0 1-.77.559L8.294 11.65a.5.5 0 0 0-.588 0l-3.751 2.726a.5.5 0 0 1-.77-.56l1.433-4.41a.5.5 0 0 0-.181-.558L.685 6.123A.5.5 0 0 1 .98 5.22h4.637a.5.5 0 0 0 .476-.346z"
            fill={i < count ? "#FF532E" : "#E5E7EB"}
          />
        </svg>
      ))}
    </div>
  );
};


export default StarRating;
