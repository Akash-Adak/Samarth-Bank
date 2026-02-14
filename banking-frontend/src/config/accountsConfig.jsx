// config/accountsConfig.jsx
import { CreditCard, Building, Wallet } from "lucide-react";

export const bankConfig = {
  name: "VASTA Bank",
  logo: "🏦",
  colors: {
    primary: "#004C6C",
    secondary: "#0088CC",
    accent: "#00B4B4"
  }
};

export const accountTypes = {
  SAVINGS: {
    name: "Savings Account",
    icon: <Wallet size={20} className="text-blue-600" />,
    description: "Perfect for everyday banking with interest earnings",
    features: ["4% interest p.a.", "Free debit card", "Digital banking"],
    minBalance: 5000
  },
  CURRENT: {
    name: "Current Account",
    icon: <CreditCard size={20} className="text-green-600" />,
    description: "For business transactions with no interest",
    features: ["Unlimited transactions", "Overdraft facility", "Business banking"],
    minBalance: 10000
  },
  BUSINESS: {
    name: "Business Account",
    icon: <Building size={20} className="text-purple-600" />,
    description: "Advanced features for business needs",
    features: ["Multi-user access", "Higher limits", "Priority support"],
    minBalance: 25000
  }
};