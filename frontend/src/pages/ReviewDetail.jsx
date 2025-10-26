import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ReviewDetail.css';

function ReviewDetail() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReview() {
      setLoading(true);
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/${id}`);
      const data = await res.json();
      setReview(data.data);
      setLoading(false);
    }
    fetchReview();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!review) return <div>No review found.</div>;

  // Görselleri review'dan al, yoksa örneklerle başlat
  const images = review.images || [
    "https://hostaway-platform.s3.us-west-2.amazonaws.com/listing/23248-148313-NWoAF5rxoZae-xWgmYWKlgcMDZzAIWa4qUgoYb4vnBA-68e64779b8814",
    "https://hostaway-platform.s3.us-west-2.amazonaws.com/listing/23248-148313-GO4qK--qaL6qf5bNQYAz83--QsbvdKMV1pSC40j3HpNgg-68e6477f6f156",
    "https://hostaway-platform.s3.us-west-2.amazonaws.com/listing/23248-148313-bEE4pakIRQ91LrWFN5a0r3KxNm-CCwvLPwC-9gVpbo0-68e64784925cb"
  ];

  return (
    <div className="container mx-auto max-w-7xl px-3 md:px-4" style={{ backgroundColor: "#FFFDF6" }}>
      {/* Carousel ve grid görseller */}
      <div className="py-2 md:py-4">
        <button className="inline-flex items-center justify-center whitespace-nowrap font-medium rounded-md text-xs p-0 h-auto text-[#5C5C5A] hover:text-[#333333] mb-4 md:hidden" onClick={() => navigate(-1)}>
          Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-[#333333] leading-tight mb-2">{review.property_name}</h1>
      </div>
      <div className="relative mb-8 md:mb-12">
        <div className="flex gap-4 flex-wrap justify-start">
          {images.slice(0, 4).map((src, i) => (
            <div key={i} className="relative cursor-pointer group">
              <img style={{ width: 200, height: 200, borderRadius: i === 0 ? '16px 0 0 16px' : i === 3 ? '0 16px 16px 0' : '0' }} src={src} alt={review.property_name + " - Image " + (i + 1)} className="object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="mb-8 md:mb-12">
        <div className="grid grid-cols-2 gap-4 rounded-2xl p-4" style={{ backgroundColor: "#FFFDF6" }}>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-md text-[#5C5C5A]">Guest: </span>
            <span className="font-normal text-[#333333] block">{review.guest_name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-md font-semibold text-[#5C5C5A]">Rating: </span>
            <span className="font-normal text-[#333333] block">{review.rating}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-md font-semibold text-[#5C5C5A]">Cleanliness: </span>
            <span className="font-normal text-[#333333] block">{review.cleanliness}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-md font-semibold text-[#5C5C5A]">Communication: </span>
            <span className="font-normal text-[#333333] block">{review.communication}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-md font-semibold text-[#5C5C5A]">Respect House Rules: </span>
            <span className="font-normal text-[#333333] block">{review.respect_house_rules}</span>
          </div>
        </div>
      </div>
      <div className="rounded-lg text-card-foreground mb-8 p-6 bg-white border-0 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-[#333333]">Review</h2>
        <div className="space-y-4">
          <p className="text-[#5C5C5A] font-semibold text-lg whitespace-pre-line leading-relaxed">{review.comment}</p>
        </div>
        <div className={`review-status-badge status-${review.review_status}`}>Status: {review.review_status}</div>
        {review.review_status === 'pending' && (
          <button style={{ marginTop: 16, padding: '8px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', marginLeft: 15 }} onClick={async () => {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/${id}/approve`, { method: 'POST' });
            setLoading(true);
              const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/${id}`);
            const data = await res.json();
            setReview(data.data || data);
            setLoading(false);
          }}>APPROVE</button>
        )}
      </div>
      <div className="rounded-lg text-card-foreground mb-8 p-6 bg-white border-0 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-[#333333]">About this property</h2>
        <div className="space-y-4">
          <p className="text-[#5C5C5A] whitespace-pre-line leading-relaxed">This studio in Pimlico offers a comfortable and convenient space for up to three guests. The room features a cozy double bed, perfect for 2 people, and in the living area, there is an extra bed to accommodate 1 more. The studio also has a fully equipped kitchen with everything you need to cook your...</p>
        </div>
      </div>
    </div>
  );
}

export default ReviewDetail;
