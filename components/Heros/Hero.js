import React from 'react';
import styles from '../styles/PromoSection.module.css';
import ImagePopup from '../Misc/ImagePopup';
import { CheckCircle2 } from 'lucide-react';
import { Waitlist } from '@clerk/nextjs';

const Hero = () => {
  return (
    <section className={styles.promoSection}>
      {/* <div className={styles.imageWrapper}>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center items-center">
          <Waitlist
            afterJoinWaitlistUrl="/thank-you" // Redirect after joining the waitlist
            appearance={{
              elements: {
                formButtonPrimary: 'text-white py-2 px-4 rounded-lg hover:bg-blue-600',
                formInput: 'border border-gray-300 rounded-lg p-2',
                formTitle: 'text-2xl font-bold text-center mb-4',
              },
            }}
            fallback={<div>Unable to load the waitlist form. Please try again later.</div>}
          />
        </div>
      </div> */}

      <div className={styles.content}>
        <h1>Smart Expense Tracking
          <span className='text-primary-color'> Made Easy</span>!
        </h1>
        <p className={styles.description}>Track, manage, and optimize your spending with real-time insights. Set budgets, analyze trends, and stay in control—all in one place.</p>



      </div>
    </section>
  );
};

export default Hero;
