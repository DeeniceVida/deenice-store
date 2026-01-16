
import React from 'react';
import { Star, Quote, ExternalLink, CheckCircle } from 'lucide-react';
import { MOCK_REVIEWS, SOCIAL_LINKS } from '../constants';

const ReviewSection: React.FC = () => {
  return (
    <section className="reviews-section" id="reviews">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] hero-blob" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 blur-[100px] hero-blob" />

      <div className="container relative z-10">
        <div className="hot-deals-header">
          <div className="verified-badge">
            <CheckCircle size={14} className="text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">500+ Verified Customers</span>
          </div>
          <h2 className="section-title text-4xl mb-6">What <span className="text-accent">People Say</span></h2>
          <p className="section-subtitle">Real experiences from our tribe of tech enthusiasts across Kenya.</p>
        </div>

        <div className="reviews-grid">
          {MOCK_REVIEWS.map((review) => (
            <div key={review.id} className="review-card">
              <Quote className="review-quote-icon" />
              <div className="reviewer-info">
                <img src={review.userAvatar} className="reviewer-avatar" />
                <div>
                  <h4 className="font-bold text-sm">{review.userName}</h4>
                  <div className="flex text-accent mt-1">
                    {[...Array(review.rating)].map((_, j) => (<Star key={j} size={12} className="fill-current" />))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{review.comment}"</p>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <span>Verified Purchase</span>
                <span>{review.date}</span>
              </div>
            </div>
          ))}

          {/* Official Google Reviews Link Embed Card */}
          <div className="google-review-box group">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-accent/20 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src="https://www.google.com/favicon.ico" className="w-6 h-6" />
                <span className="font-black text-xs uppercase tracking-widest opacity-60">Google Reviews</span>
              </div>
              <h3 className="text-4xl font-black mb-2 tracking-tighter italic">4.9 Stars</h3>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">We pride ourselves on the best review tech production curation in Kenya.</p>
            </div>
            <a
              href={SOCIAL_LINKS.googleReviews}
              target="_blank"
              className="w-full bg-textPrimary text-white px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent hover:text-textPrimary transition-all shadow-xl group"
            >
              Browse All Reviews <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
