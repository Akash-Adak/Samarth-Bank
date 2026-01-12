const premiumCards = [
  {
    name: "Imperia Metal",
    type: "Super Premium",
    image: "https://images.unsplash.com/photo-1613243555988-441166d4d6fd?q=80&w=600&auto=format&fit=crop",
    benefits: ["Unlimited Lounge Access", "2% Forex Markup", "10,000 Bonus Points"]
  },
  {
    name: "Regalia Gold",
    type: "Lifestyle",
    image: "https://www.cardexpert.in/wp-content/uploads/2023/11/hdfc-regalia-gold-credit-card-1024x576.jpg",
    benefits: ["12 Lounge Visits", "Marriott Membership", "Air Accident Cover"]
  }
];

export default function PremiumCards() {
  return (
    <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/40 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-yellow-500 font-bold tracking-widest uppercase text-sm">Privilege Collection</span>
            <h2 className="text-4xl lg:text-5xl font-serif mt-2 mb-6">Experience the Power of Metal</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Exclusive credit cards designed for the elite. Complimentary golf games, unlimited airport lounge access, and 24/7 concierge.
            </p>
            
            <div className="space-y-6">
              {premiumCards.map((card, idx) => (
                <div key={idx} className="flex items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <img src={card.image} alt={card.name} className="w-24 h-16 rounded-lg object-cover shadow-lg" />
                  <div>
                    <h4 className="text-xl font-bold">{card.name}</h4>
                    <p className="text-sm text-gray-400 mb-2">{card.type}</p>
                    <div className="flex flex-wrap gap-2">
                      {card.benefits.map((b, i) => (
                        <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded text-blue-200">{b}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CreditCardVisual />
        </div>
      </div>
    </section>
  );
}

function CreditCardVisual() {
  return (
    <div className="relative flex justify-center">
      {/* Floating Card Effect */}
      <div className="relative w-full max-w-md aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-gray-700 via-gray-900 to-black p-8 shadow-2xl border border-gray-600 transform hover:scale-105 transition-transform duration-500 group">
        <div className="flex justify-between items-start mb-12">
           <i className="fas fa-wifi text-gray-400 rotate-90 text-2xl"></i>
           <span className="font-serif italic text-2xl text-gray-300">V Λ S T Λ</span>
        </div>
        <div className="space-y-1">
          <div className="text-xl tracking-[0.2em] font-mono text-gray-300">4588 22XX XXXX 9012</div>
          <div className="flex justify-between items-end mt-4">
            <div>
              <div className="text-[10px] text-gray-400 uppercase">Card Holder</div>
              <div className="text-sm text-gray-200 font-medium">XXXX XXXX</div>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-10 opacity-80" alt="Mastercard" />
          </div>
        </div>
        {/* Shiny glint effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl pointer-events-none"></div>
      </div>
    </div>
  );
}