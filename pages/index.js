
import Hero from '../components/Heros/Hero';
import Faq from '../components/Faqs/Faq';
import WhatsNew from '../components/Heros/WhatsNew';
import HowItWorks from '../components/Heros/Howitworks';
import Seo from '../components/Misc/Seo';
import CountdownTimer from '../components/Misc/CountdownTimer';
import ContactForm from "../components/ContactForms/ContactForm";
import WhatsAppChat from '../components/Misc/WhatsAppChat';
import SocialMedia from '../components/Misc/SocialMedia';
import PricingComponent from '../components/Misc/PricingComponent';
import ImagePopup from '../components/Misc/ImagePopup';
import HeroMinimal from '../components/Heros/HeroMinimal';

export default function Home() {

  return (
    <>
      <Seo 
          siteTitle="Expense Goose"
          pageTitle="Best Online Expense Software & Business Expense Tracking"
          description="Expense Goose is the leading free expense tracking software for small businesses. Manage your finances with powerful expense management tools and tracking software."
          url="https://www.expensegoose.com"
          image="https://www.expensegoose.com/images/hero.jpg"
      />


      <Hero />
      <PricingComponent />
            {/* <HowItWorks /> */}
      {/* <WhatsNew /> */}
      {/* <Faq /> */}

    </>
  );
}
