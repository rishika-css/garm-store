import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <footer className="bg-[var(--garm-white)] text-[var(--garm-black)] mt-24">
      {/* Top Border */}
      <div className="border-t border-black/10">
        <div className="max-w-screen-2xl mx-auto px-6 py-12 flex flex-col items-center">
          
          {/* First Row: Social Logos | Info Links */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-12">
            {/* Social Logos */}
            <div className="flex items-center gap-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity" aria-label="X (Twitter)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.055-4.425 5.055H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"/>
                </svg>
              </a>
            </div>

            {/* Separator (Pipe) */}
            <span className="hidden md:block text-black/20 text-lg font-light">|</span>

            {/* Info Links */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 label-sm text-[10px] md:text-[11px] tracking-[0.2em]">
              <Link to="/faq" className="hover:opacity-60 transition-opacity">FAQ</Link>
              <Link to="/contact" className="hover:opacity-60 transition-opacity">CONTACT</Link>
              <Link to="/refunds" className="hover:opacity-60 transition-opacity">REFUNDS</Link>
              <Link to="/terms" className="hover:opacity-60 transition-opacity">TERMS</Link>
              <Link to="/privacy" className="hover:opacity-60 transition-opacity">PRIVACY POLICY</Link>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="w-full max-w-[420px] text-center">
            <p className="label-sm text-[10px] md:text-[11px] tracking-[0.2em] mb-4 font-bold">
              BE THE FIRST TO HEAR OF RELEASES:
            </p>
            
            {submitted ? (
              <p className="label-sm text-[var(--garm-orange)]">THANK YOU FOR SUBSCRIBING</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-0 border border-black/10 rounded-lg overflow-hidden focus-within:border-black/30 transition-colors">
                <input
                  type="email"
                  placeholder="ENTER EMAIL ADDRESS"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent px-5 py-3 text-[10px] md:text-[11px] tracking-widest outline-none placeholder:text-black/30"
                />
                <button 
                  type="submit"
                  className="bg-[var(--garm-orange)] text-white px-8 py-3 label-sm text-[10px] md:text-[11px] hover:bg-black transition-colors"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
          
          <div className="mt-16 text-[9px] tracking-[0.3em] text-black/30 uppercase">
            © 2024 GARM STORE. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}
