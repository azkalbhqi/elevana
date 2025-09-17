// utils/DoctorCard.tsx
import React from "react";

interface DoctorCardProps {
  name: string;
  experience: string;
  rating: number;
  reviews: number;
  isOnline: boolean;
  imageUrl: string;
  onChatClick?: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  name,
  experience,
  rating,
  reviews,
  isOnline,
  imageUrl,
  onChatClick,
}) => {
  return (
    <div className="flex items-center gap-4 bg-[#f6f6fe] rounded-2xl p-4 shadow-sm">
      {/* Doctor Image */}
      <img
        src={imageUrl}
        alt={name}
        className="w-28 h-28 object-cover rounded-lg"
      />

      {/* Info */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-lg font-semibold text-[#2f2f5b]">{name}</h2>
          <p className="text-sm text-gray-600">{experience}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-yellow-400 text-lg">
                ★
              </span>
            ))}
            <span className="text-sm text-gray-700">
              {rating.toFixed(1)} ({reviews.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Status + Button */}
        <div className="flex items-center justify-between mt-2">
  <span
    className={`flex items-center gap-1 text-sm font-medium ${
      isOnline ? "text-green-500" : "text-gray-400"
    }`}
  >
    <span
      className={`w-2 h-2 rounded-full ${
        isOnline ? "bg-green-500" : "bg-gray-400"
      }`}
    ></span>
    {isOnline ? "Online" : "Offline"}
  </span>

  <button
    onClick={onChatClick}
    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition bg-[#5a4fcf] text-white hover:bg-[#4b3fc2]"
  >
    {isOnline ? "💬 Chat Sekarang" : "💬 Booking Chat"}
    
  </button>
</div>

      </div>
    </div>
  );
};

export default DoctorCard;
