import React from 'react';
import { Link } from '@heroui/react';
import strings from '@/common/strings';
import LearnMore from '../LearnMore/LearnMore';
interface Props {}
const Footer = (props: Props) => {
  return (
    <footer className='w-full text-center justify-center mb-8 mt-20'>
      <div className='mb-10'>
        <LearnMore />
      </div>
      <div className='text-default-500'>
        {strings.siteTitle} was created by{' '}
        <Link href={'https://www.jenniferhaggerty.com'}>Jennifer Haggerty</Link>
        .
      </div>
    </footer>
  );
};
export default Footer;
