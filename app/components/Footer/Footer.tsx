import React, { useState } from 'react';
import { Button, Link } from '@heroui/react';
import strings from '@/common/strings';
import LearnMore from '../LearnMore/LearnMore';
import LegendDrawer from '../Drawers/LegendDrawer';
const Footer = () => {
  const [showLegend, setShowLegend] = useState<boolean>();
  return (
    <>
      {showLegend && (
        <LegendDrawer
          isOpen={showLegend}
          onClose={() => setShowLegend(false)}
        />
      )}
      <footer className='w-full text-center justify-center mb-8 mt-20'>
        <div className='mb-10'>
          <LearnMore />
        </div>
        <div className='justify-center'>
          <div className='text-default-500 pb-3'>
            {strings.siteTitle} was created by{' '}
            <Link href={'https://www.jenniferhaggerty.com'}>
              Jennifer Haggerty
            </Link>
            .
          </div>
          <Button
            color='primary'
            variant='flat'
            onPress={() => setShowLegend(true)}
          >
            Legend
          </Button>
        </div>
      </footer>
    </>
  );
};
export default Footer;
