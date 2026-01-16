
import React from 'react';
import { ArrowUpRight, Play, BookOpen } from 'lucide-react';
import { MOCK_BLOGS } from '../constants';

const BlogSection: React.FC = () => {
  return (
    <section className="blog-section" id="guides">
      <div className="hot-deals-container">
        <div className="blog-header">
          <div>
            <h2 className="section-title text-4xl mb-4">Tech & <span className="bg-primary/30 px-2 rounded">Guides</span></h2>
            <p className="text-gray-500">Learn how to elevate your setup and save on imports.</p>
          </div>
          <button className="hidden md:flex items-center gap-2 font-bold hover:text-primary transition-colors">
            View All Articles <ArrowUpRight size={20} />
          </button>
        </div>

        <div className="blog-grid">
          {/* Featured Post */}
          <div className="group cursor-pointer">
            <div className="featured-blog-card">
              <img
                src={MOCK_BLOGS[0].image}
                alt={MOCK_BLOGS[0].title}
                className="featured-img"
              />
              <div className="blog-overlay">
                <div>
                  <span className="blog-tag">Featured Guide</span>
                  <h3 className="text-3xl font-black text-white mb-4 leading-tight">{MOCK_BLOGS[0].title}</h3>
                  <p className="text-white/60 text-sm max-w-lg mb-6">{MOCK_BLOGS[0].excerpt}</p>
                  <div className="flex items-center gap-4">
                    <button className="bg-white text-textPrimary px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-accent transition-colors">
                      Read Guide <BookOpen size={18} />
                    </button>
                    <button className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-textPrimary transition-all">
                      <Play size={18} fill="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="blog-list">
            {MOCK_BLOGS.slice(1).map(post => (
              <div key={post.id} className="blog-item group">
                <div className="blog-item-thumb">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="blog-item-img"
                  />
                </div>
                <div>
                  <span className="text-primary text-[10px] font-bold uppercase tracking-widest mb-2 block">{post.date}</span>
                  <h3 className="blog-item-title">{post.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
                </div>
              </div>
            ))}

            <div className="submission-box">
              <h4 className="text-xl font-bold">Have a Setup Video?</h4>
              <p className="text-sm text-gray-500">Tag us on Instagram @deenicestore to get featured on our blog!</p>
              <button className="bg-white px-8 py-3 rounded-full font-bold shadow-sm hover:shadow-md transition-shadow">Submit Content</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
