import type { NextPage } from 'next';

import Helmet from '@/components/Helmet';

const Home: NextPage = () => {
  return (
    <div>
      <Helmet />
      <div className='p-10'>
        <h1 className='tes text-center font-bold'>
          Dhana&apos;s Personal Next Js Starter
        </h1>
      </div>
    </div>
  );
};

export default Home;
