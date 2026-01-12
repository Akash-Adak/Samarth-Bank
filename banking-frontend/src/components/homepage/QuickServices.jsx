import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Banking product data
const bankingProducts = {
  accounts: [
    {
      id: 1,
      name: "Savings Account",
      description: "Start your savings journey with us",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/regular-saving?fmt=webp-alpha",
      primaryAction: { label: "Open Now", link: "" },
      secondaryAction: { label: "Know More", link: "/savings-account" },
      bgColor: "#73B8FF"
    },
    {
      id: 2,
      name: "PPF Account",
      description: "Secure your long-term investment with a PPF account",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/ppf-desktop?fmt=webp-alpha",
      secondaryAction: { label: "Know More", link: "/public-provident-fund" },
      bgColor: "#73B8FF"
    },
    {
      id: 3,
      name: "Salary Account",
      description: "Manage your earnings, your way",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/salary-account-desktop?fmt=webp-alpha",
      primaryAction: { label: "Open Instantly", link: "" },
      secondaryAction: { label: "Know More", link: "/salary-account" },
      bgColor: "#ECEDF3"
    },
    {
      id: 4,
      name: "Current Account",
      description: "Your everyday business banking companion",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/current-account-updated?fmt=webp-alpha",
      secondaryAction: { label: "Know More", link: "/current-accounts" },
      bgColor: "#73B8FF"
    },
    {
      id: 5,
      name: "Rural Account",
      description: "Unique savings accounts for farm support",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/rural-account-desktop?fmt=webp-alpha",
      primaryAction: { label: "Locate Us", link: "" },
      secondaryAction: { label: "Know More", link: "/agri-banking/rural-account" },
      bgColor: "#ECEDF3"
    }
  ],
  deposits: [
    {
      id: 1,
      name: "Fixed Deposit",
      description: "A growth plan with peace of mind",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/fixed-deposit-desktop?fmt=webp-alpha",
      primaryAction: { label: "Quick Apply", link: "" },
      secondaryAction: { label: "Learn More", link: "/fixed-deposit" },
      bgColor: "#73B8FF"
    },
    {
      id: 2,
      name: "Recurring Deposit",
      description: "An easy way for savings growth",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/recurring-deposit-desktop?fmt=webp-alpha",
      secondaryAction: { label: "Learn More", link: "/recurring-deposit" },
      bgColor: "#ECEDF3"
    },
    {
      id: 3,
      name: "Safe Deposit Locker",
      description: "Your Valuables, Securely Stored",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/safe-deposit-locker-desktop?fmt=webp-alpha",
      primaryAction: { label: "Get Your Locker", link: "" },
      secondaryAction: { label: "Learn More", link: "/safe-deposit-locker" },
      bgColor: "#73B8FF"
    }
  ],
  cards: [
    {
      id: 1,
      name: "Credit Card",
      description: "Explore a range of Credit Cards for every lifestyle",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/credit-card-desktop?fmt=webp-alpha",
      primaryAction: { label: "Apply Now", link: "" },
      secondaryAction: { label: "Know More", link: "/credit-cards" },
      bgColor: "#73B8FF"
    },
    {
      id: 2,
      name: "Debit Card",
      description: "Simplify your spending with debit cards",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/debit-card-desktop?fmt=webp-alpha",
      primaryAction: { label: "Apply Now", link: "" },
      secondaryAction: { label: "Learn More", link: "/debit-cards" },
      bgColor: "#ECEDF3"
    },
    {
      id: 3,
      name: "Forex Card",
      description: "Easy-to-use forex cards",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/forex-card-desktop?fmt=webp-alpha",
      primaryAction: { label: "Explore Cards", link: "" },
      secondaryAction: { label: "Know More", link: "/forex-cards" },
      bgColor: "#73B8FF"
    },
    {
      id: 4,
      name: "Prepaid Card",
      description: "Flexibility and ease packed into one card",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/prepaid-card-desktop?fmt=webp-alpha",
      secondaryAction: { label: "Know More", link: "/prepaid-cards" },
      bgColor: "#ECEDF3"
    },
    {
      id: 5,
      name: "Commercial Credit Card",
      description: "Specialized cards for business payments",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/commercial-credit-card-desktop?fmt=webp-alpha",
      secondaryAction: { label: "Know More", link: "/commercial-credit-cards" },
      bgColor: "#73B8FF"
    },
    {
      id: 6,
      name: "Business Credit Card",
      description: "Business payments made easy",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/business-credit-card-desktop?fmt=webp-alpha",
      secondaryAction: { label: "Know More", link: "/business-credit-cards" },
      bgColor: "#ECEDF3"
    }
  ],
  loans: [
    {
      id: 1,
      name: "Personal Loan",
      description: "A loan for everything from dreams to emergencies",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/personal-loan-desktop?fmt=webp-alpha",
      primaryAction: { label: "Apply Online", link: "" },
      secondaryAction: { label: "Learn More", link: "/personal-loan" },
      bgColor: "#73B8FF"
    },
    {
      id: 2,
      name: "Home Loan",
      description: "Own your dream home with our home loans",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/home-loan-updated?fmt=webp-alpha",
      primaryAction: { label: "Quick Apply", link: "" },
      secondaryAction: { label: "Explore", link: "/home-loan" },
      bgColor: "#ECEDF3"
    },
    {
      id: 3,
      name: "Car Loan",
      description: "Bring your dream wheels home",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/car-loan-updated?fmt=webp-alpha",
      primaryAction: { label: "Get Funds", link: "" },
      secondaryAction: { label: "View More", link: "/car-loan" },
      bgColor: "#73B8FF"
    },
    {
      id: 4,
      name: "Business Loan",
      description: "Fuel your business growth with our loans",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/business-loan-desktop-1?fmt=webp-alpha",
      primaryAction: { label: "Ready to Apply?", link: "" },
      secondaryAction: { label: "Know More", link: "/business-loan" },
      bgColor: "#ECEDF3"
    },
    {
      id: 5,
      name: "Two Wheeler Loan",
      description: "Flexible 2-wheeler loans for everyone",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/two-wheeler-loan-updated?fmt=webp-alpha",
      primaryAction: { label: "Apply Now", link: "" },
      secondaryAction: { label: "View More", link: "/two-wheeler-loan" },
      bgColor: "#73B8FF"
    },
    {
      id: 6,
      name: "Gold Loan",
      description: "Turn your gold into possibilities",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/gold-loan-desktop?fmt=webp-alpha",
      primaryAction: { label: "Get Loan", link: "" },
      secondaryAction: { label: "Know More", link: "/gold-loan" },
      bgColor: "#ECEDF3"
    }
  ],
  insurance: [
    {
      id: 1,
      name: "Travel Insurance",
      description: "Travel the world with confidence",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/travel-insurance-desktop?fmt=webp-alpha",
      secondaryAction: { label: "Explore", link: "/travel-insurance" },
      bgColor: "#ECEDF3"
    },
    {
      id: 2,
      name: "Health Insurance",
      description: "Protection for your health and well-being",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/health-insurance-desktop?fmt=webp-alpha",
      secondaryAction: { label: "Explore", link: "/health-and-accident-insurance" },
      bgColor: "#73B8FF"
    },
    {
      id: 3,
      name: "Life Insurance",
      description: "Securing the financial future of your loved ones",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/life-insurance-desktop?fmt=webp-alpha",
      secondaryAction: { label: "Explore", link: "/life-insurance" },
      bgColor: "#73B8FF"
    },
    {
      id: 4,
      name: "Vehicle Insurance",
      description: "Protect your ride",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/vehicle-insurance-desktop?fmt=webp-alpha",
      secondaryAction: { label: "Explore", link: "/vehicle-insurance" },
      bgColor: "#ECEDF3"
    }
  ],
  investments: [
    {
      id: 1,
      name: "Mutual Funds",
      description: "Grow your wealth with our suite of funds",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/mutual-funds-desktop?fmt=webp-alpha",
      secondaryAction: { label: "Know More", link: "/mutual-funds" },
      bgColor: "#73B8FF"
    },
    {
      id: 2,
      name: "Demat Account",
      description: "Experience seamless investments with Demat accounts",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/demat-desktop?fmt=webp-alpha",
      secondaryAction: { label: "Know More", link: "/open-demat-account" },
      bgColor: "#73B8FF"
    },
    {
      id: 3,
      name: "Bonds & Securities",
      description: "Your gateway to profitable investments with bonds",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/bonds-and-securites-desktop?fmt=webp-alpha",
      primaryAction: { label: "Know More", link: "/bonds-and-securities" },
      bgColor: "#ECEDF3"
    },
    {
      id: 4,
      name: "IPO",
      description: "Start your journey towards successful investing",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/ipo-desktop?fmt=webp-alpha",
      secondaryAction: { label: "Know More", link: "/ipo-application-through-asba" },
      bgColor: "#ECEDF3"
    },
    {
      id: 5,
      name: "PPF Account",
      description: "Secure your long-term investment with a PPF account",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/ppf-desktop?fmt=webp-alpha",
      primaryAction: { label: "Know More", link: "/public-provident-fund" },
      bgColor: "#73B8FF"
    },
    {
      id: 6,
      name: "SSY Account",
      description: "Secure future for your girl child",
      image: "https://s7ap1.scene7.com/is/image/hdfcbankPWS/SSY_Banner_302x257?fmt=webp-alpha",
      primaryAction: { label: "Know More", link: "/sukanya-samriddhi-yojana-account" },
      bgColor: "#ECEDF3"
    }
  ]
};

const productCategories = [
  { key: 'accounts', label: 'Accounts' },
  { key: 'deposits', label: 'Deposits' },
  { key: 'cards', label: 'Cards' },
  { key: 'loans', label: 'Loans' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'investments', label: 'Investments' }
];

export default function BankingProducts() {
  const [activeCategory, setActiveCategory] = useState('cards');
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs for swiper navigation
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

const renderProductCard = (product) => (
  <div
    className="relative rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[400px]"
    style={{ backgroundColor: product.bgColor }}
  >
    {/* LEFT: Content */}
    <div className="p-6 flex flex-col md:w-1/2 z-10">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {product.name}
      </h3>

      <p className="text-gray-700 text-sm font-medium mb-6 flex-1">
        {product.description}
      </p>

      <div className="flex flex-wrap gap-3 mt-auto">
        {product.primaryAction && (
          <a
            href={product.primaryAction.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-blue-900 hover:bg-blue-800 text-white font-medium py-2.5 px-5 rounded-lg text-sm transition-colors shadow-sm"
          >
            {product.primaryAction.label}
          </a>
        )}

        {product.secondaryAction && (
          <a
            href={product.secondaryAction.link}
            className="inline-flex items-center justify-center border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white font-medium py-2.5 px-5 rounded-lg text-sm transition-colors"
          >
            {product.secondaryAction.label}
          </a>
        )}
      </div>
    </div>

    {/* RIGHT: Image */}
    <div className="relative md:w-1/2 h-56 md:h-auto">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  </div>
);


  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
       <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Smart Banking For
          <br />
          <span className="text-blue-900">Modern Lives</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Seamless financial solutions combining technology with personalized service
        </p>
      </div>

        {/* Category Tabs */}
        <div className="mb-10">
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
            <div className="flex mx-auto">
              {productCategories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`flex-shrink-0 px-6 py-4 font-bold text-base transition-all ${
                    activeCategory === category.key
                      ? 'text-blue-900 border-b-2 border-blue-900'
                      : 'text-gray-600 hover:text-blue-900'
                  }`}
                  style={{ minWidth: '140px' }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={isMobile ? 1.2 : 2}
            centeredSlides={isMobile}
            pagination={{
              clickable: true,
              type: 'bullets',
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            className="pb-12"
          >
            {bankingProducts[activeCategory]?.map((product) => (
              <SwiperSlide key={product.id}>
                {renderProductCard(product)}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              ref={prevRef}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-sm active:scale-95 bg-white"
              aria-label="Previous products"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              ref={nextRef}
              className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all duration-300 shadow-md active:scale-95 hover:shadow-lg"
              aria-label="Next products"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

     
      </div>
    </section>
  );
}