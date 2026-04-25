import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ_ITEMS = [
  {
    question: "IS MY PERSONAL INFORMATION SECURE?",
    answer: "FOR SECURITY PURPOSES, WE DO NOT STORE ANY CREDIT CARD INFORMATION. ALL PAYMENTS ARE PROCESSED THROUGH SHOPIFY PAYMENTS, WHICH USES ADVANCED ENCRYPTION AND SECURE SERVERS THAT EXCEED INDUSTRY STANDARDS."
  },
  {
    question: "HOW DO I KNOW MY SIZE?",
    answer: "PLEASE REFER TO OUR SIZE GUIDE ON EACH PRODUCT PAGE FOR DETAILED MEASUREMENTS. IF YOU ARE BETWEEN SIZES, WE RECOMMEND SIZING UP FOR A MORE RELAXED FIT."
  },
  {
    question: "WHERE DO YOU SHIP TO?",
    answer: "WE CURRENTLY SHIP DOMESTICALLY AND INTERNATIONALLY TO OVER 50 COUNTRIES. SHIPPING COSTS AND DELIVERY TIMES VARY BY LOCATION."
  },
  {
    question: "WILL I BE CHARGED TAXES AND DUTIES?",
    answer: "ALL INTERNATIONAL ORDERS ARE SUBJECT TO CUSTOMS DUTIES AND TAXES AS DETERMINED BY THE DESTINATION COUNTRY. THESE FEES ARE THE RESPONSIBILITY OF THE CUSTOMER."
  },
  {
    question: "CAN I CHANGE MY ORDER ONCE IT HAS BEEN PLACED?",
    answer: "ORDERS ARE PROCESSED QUICKLY TO ENSURE TIMELY DELIVERY. ONCE AN ORDER HAS BEEN PLACED, WE MAY NOT BE ABLE TO MAKE CHANGES. PLEASE CONTACT US IMMEDIATELY IF YOU NEED ASSISTANCE."
  },
  {
    question: "WHAT DO I DO IF MY SHIPPED ORDER IS INCORRECT?",
    answer: "IF YOU RECEIVE AN INCORRECT ITEM, PLEASE CONTACT OUR CUSTOMER SERVICE TEAM WITHIN 48 HOURS OF DELIVERY WITH YOUR ORDER NUMBER AND PHOTOS OF THE ITEM."
  },
  {
    question: "MY ORDER WAS RETURNED TO SENDER, WHAT DO I DO?",
    answer: "IF YOUR ORDER IS RETURNED TO US, WE WILL CONTACT YOU TO ARRANGE RESHIPMENT. ADDITIONAL SHIPPING FEES MAY APPLY."
  }
];

const CONTACT_ITEMS = [
  {
    question: "SEND AN EMAIL TO OUR INBOX",
    answer: "OUR CUSTOMER SERVICE TEAM IS AVAILABLE AT HELLO@GARMSTORE.COM. WE STRIVE TO RESPOND TO ALL INQUIRIES WITHIN 24 BUSINESS HOURS."
  },
  {
    question: "CALL OUR SERVICE TEAM",
    answer: "YOU CAN REACH US AT +1 (555) 123-4567 FROM MONDAY TO FRIDAY, 9AM - 6PM EST."
  },
  {
    question: "OPERATING HOURS",
    answer: "OUR ONLINE STORE IS OPEN 24/7. OUR CUSTOMER SERVICE AND WAREHOUSE TEAMS OPERATE MONDAY THROUGH FRIDAY, EXCLUDING PUBLIC HOLIDAYS."
  },
  {
    question: "RESPONSE TIMES",
    answer: "DURING HIGH-VOLUME PERIODS SUCH AS NEW RELEASES OR SALES, RESPONSE TIMES MAY BE SLIGHTLY LONGER. WE APPRECIATE YOUR PATIENCE."
  }
];

const REFUND_ITEMS = [
  {
    question: "REFUND TERMS",
    answer: "WE OFFER FULL REFUNDS ON ALL UNWORN, UNWASHED ITEMS WITH ORIGINAL TAGS ATTACHED WITHIN 14 DAYS OF DELIVERY."
  },
  {
    question: "ONLINE RETURN",
    answer: "TO INITIATE A RETURN, PLEASE VISIT OUR RETURNS PORTAL AND ENTER YOUR ORDER NUMBER AND EMAIL ADDRESS."
  }
];

function FAQItem({ item, isOpen, onClick }) {
  return (
    <div className="border-b border-black/10">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 md:py-6 text-left hover:bg-black/5 transition-colors px-2 md:px-4"
      >
        <span className="text-[10px] md:text-sm font-bold tracking-[0.1em] uppercase">{item.question}</span>
        <span className={`text-xl font-light transition-transform duration-300 ${isOpen ? 'text-[var(--garm-orange)]' : 'text-black'}`}>
          {isOpen ? '✕' : '＋'}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[300px] pb-8' : 'max-h-0'}`}>
        <div className="px-2 md:px-4 text-[9px] md:text-xs leading-relaxed tracking-wider text-black/70">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [openContact, setOpenContact] = useState(-1);
  const [openRefund, setOpenRefund] = useState(-1);

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 min-h-screen">
      {/* FAQ SECTION */}
      <h1 className="text-xl md:text-3xl font-bold text-center tracking-[0.2em] mb-12 uppercase">FAQ</h1>
      <div className="border-t border-black/10 mb-24">
        {FAQ_ITEMS.map((item, index) => (
          <FAQItem 
            key={index}
            item={item}
            isOpen={openFaq === index}
            onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
          />
        ))}
      </div>

      {/* CONTACT SECTION */}
      <h2 className="text-xl md:text-3xl font-bold text-center tracking-[0.2em] mb-12 uppercase">CONTACT</h2>
      <div className="border-t border-black/10 mb-24">
        {CONTACT_ITEMS.map((item, index) => (
          <FAQItem 
            key={index}
            item={item}
            isOpen={openContact === index}
            onClick={() => setOpenContact(openContact === index ? -1 : index)}
          />
        ))}
      </div>

      {/* REFUND SECTION */}
      <h2 className="text-xl md:text-3xl font-bold text-center tracking-[0.2em] mb-12 uppercase">REFUND</h2>
      <div className="border-t border-black/10 mb-24">
        {REFUND_ITEMS.map((item, index) => (
          <FAQItem 
            key={index}
            item={item}
            isOpen={openRefund === index}
            onClick={() => setOpenRefund(openRefund === index ? -1 : index)}
          />
        ))}
      </div>
    </div>
  );
}
