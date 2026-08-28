import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CustomerStepGuide } from './components/CustomerStepGuide';
import { ServicesCatalog } from './components/ServicesCatalog';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { PriceCalculatorModal } from './components/PriceCalculatorModal';
import { PortfolioGallery } from './components/PortfolioGallery';
import { PricingMatrix } from './components/PricingMatrix';
import { PaymentIntegrationsSection } from './components/PaymentIntegrationsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CartDrawer } from './components/CartDrawer';
import { FloatingContact } from './components/FloatingContact';
import { Footer } from './components/Footer';
import { AdminGuideModal } from './components/AdminGuideModal';
import { SmartGuideBot } from './components/SmartGuideBot';
import { CartItem, ServiceItem, UploadedFile } from './types';
import { calculateServicePrice } from './utils/pricing';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('okbw_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('okbw_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAdminGuideOpen, setIsAdminGuideOpen] = useState(false);
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [botInitialTopic, setBotInitialTopic] = useState<string | undefined>(undefined);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);

  const handleOpenGuideBot = (topic?: string) => {
    setBotInitialTopic(topic);
    setIsBotOpen(true);
  };

  // Sync theme class to html element
  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('okbw_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Visitor counter increment
  useEffect(() => {
    try {
      const storedVisits = localStorage.getItem('okbw_stat_visits');
      const current = storedVisits ? parseInt(storedVisits, 10) + 1 : 143;
      localStorage.setItem('okbw_stat_visits', current.toString());
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('okbw_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Add to cart with volume pricing recalculated
  const handleAddToCart = (
    service: ServiceItem,
    quantity: number = 1,
    customNotes?: string,
    fileName?: string,
    files?: UploadedFile[],
    turnaroundId?: string
  ) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.service.id === service.id && item.customNotes === (customNotes || '')
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        const { unitPrice, totalPrice } = calculateServicePrice(service, newQty);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          unitPrice,
          totalPrice,
          fileName: fileName || updated[existingIndex].fileName,
          files: files && files.length > 0 ? files : updated[existingIndex].files,
          selectedTurnaroundId: turnaroundId || updated[existingIndex].selectedTurnaroundId
        };
        return updated;
      } else {
        const { unitPrice, totalPrice } = calculateServicePrice(service, quantity);
        const newItem: CartItem = {
          service,
          quantity,
          unitPrice,
          totalPrice,
          customNotes,
          fileName,
          files,
          selectedTurnaroundId: turnaroundId
        };
        return [...prevCart, newItem];
      }
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(index);
      return;
    }

    setCart((prevCart) => {
      const updated = [...prevCart];
      const item = updated[index];
      if (!item) return prevCart;

      const { unitPrice, totalPrice } = calculateServicePrice(item.service, newQty);
      updated[index] = {
        ...item,
        quantity: newQty,
        unitPrice,
        totalPrice
      };
      return updated;
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogue');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F9] dark:bg-[#0B1320] text-slate-900 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300">
      
      {/* Sticky Header Navigation with Theme Switcher & Admin Guide */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAdminGuide={() => setIsAdminGuideOpen(true)}
        onOpenGuideBot={() => handleOpenGuideBot()}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Hero Section with Official Logo, Slogan & Action Hub */}
        <Hero
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onExploreServices={scrollToCatalog}
          onOpenAdminGuide={() => setIsAdminGuideOpen(true)}
          onOpenGuideBot={handleOpenGuideBot}
        />

        {/* Visual Step-by-Step Customer Guide (Orienting Clients) */}
        <CustomerStepGuide
          onExploreCatalog={scrollToCatalog}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenGuideBot={handleOpenGuideBot}
        />

        {/* E-commerce Services Catalog & Ordering */}
        <ServicesCatalog
          onAddToCart={handleAddToCart}
          onSelectService={(service) => setSelectedServiceForModal(service)}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
        />

        {/* Portfolio & Visual Realizations Gallery with Before/After Slider */}
        <PortfolioGallery
          onSelectServiceForOrder={(service) => setSelectedServiceForModal(service)}
        />

        {/* Pricing Matrix & Volume Discount Tables */}
        <PricingMatrix
          onOpenCalculator={() => setIsCalculatorOpen(true)}
        />

        {/* Payment Integration Hub (Wave Business & WhatsApp) */}
        <PaymentIntegrationsSection />

        {/* Testimonials & Client Reviews */}
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdminGuide={() => setIsAdminGuideOpen(true)} />

      {/* Modals and Slide-Overs */}
      
      {/* Smart Intelligent Step-by-Step Guide Bot (100% Zero-API) */}
      <SmartGuideBot
        isOpen={isBotOpen}
        initialQuery={botInitialTopic}
        onClose={() => {
          setIsBotOpen(false);
          setBotInitialTopic(undefined);
        }}
        onOpenServiceModal={(service) => {
          setIsBotOpen(false);
          setSelectedServiceForModal(service);
        }}
        onOpenCalculatorModal={(serviceId) => {
          setIsBotOpen(false);
          setIsCalculatorOpen(true);
        }}
        onAddToCart={(service, quantity, notes) => {
          handleAddToCart(service, quantity, undefined, undefined, notes);
        }}
        onScrollToCatalog={() => {
          setIsBotOpen(false);
          scrollToCatalog();
        }}
      />

      {/* Service Detail & Custom Order Modal */}
      <ServiceDetailModal
        service={selectedServiceForModal}
        onClose={() => setSelectedServiceForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Interactive Price Calculator Simulator Modal */}
      <PriceCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onAddToCart={(service, qty) => handleAddToCart(service, qty)}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onExploreCatalog={scrollToCatalog}
      />

      {/* Owner / Admin Guide & Live Activity Monitor Modal */}
      <AdminGuideModal
        isOpen={isAdminGuideOpen}
        onClose={() => setIsAdminGuideOpen(false)}
      />

      {/* Floating WhatsApp, Cart, Guide Bot and Quick Guide buttons */}
      <FloatingContact
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdminGuide={() => setIsAdminGuideOpen(true)}
        onOpenGuideBot={() => setIsBotOpen(true)}
      />

    </div>
  );
}

