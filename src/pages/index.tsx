import { nanoid } from 'nanoid';
import type { NextPage } from 'next';
import React, { ChangeEvent, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Helmet from '@/components/Helmet';

import Dice from '@/assets/svg/dice';

const regexUrl = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [step, setStep] = React.useState<number>(0);
  const [data, setData] = React.useState({
    source: '',
    destination: '',
  });
  const sourceInput = useRef<HTMLInputElement>(null);

  const submitHandler = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/create', {
        method: 'post',
        body: JSON.stringify(data),
      });
      const link = await res.json();
      if (!res.ok) {
        toast.error(`Error: ${link.message}`);
        setIsLoading(false);
        return;
      }
      navigator.clipboard.writeText(window.location.href + link.source);
      setData({
        source: '',
        destination: '',
      });
      setStep(0);
      toast.success('Success, link copied to clipboard');
    } catch (err) {
      toast.error(`Error: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const stepHandler = () => {
    if (step === 0) {
      if (!data.destination) {
        toast.error('field is required');
        return;
      } else if (!regexUrl.test(data.destination)) {
        toast.error('url format is not valid (use http/https)');
        return;
      }
      setStep((prev) => prev + 1);
    } else if (step === 1) {
      if (!data.source) {
        toast.error('field is required');
        return;
      }
      submitHandler();
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className='flex h-screen w-screen justify-center bg-indigo-200'>
      <Toaster />
      <Helmet />
      <div className='flex w-[85%] flex-col justify-center gap-y-3 sm:w-[40%]'>
        {step === 0 && (
          <input
            className='rounded p-3 text-gray-800 shadow-md focus:outline-none focus:ring focus:ring-indigo-400/50'
            type='text'
            name='destination'
            placeholder='https://tailwindcss.com/'
            onChange={changeHandler}
            onKeyDown={(e) => {
              if (e.key === 'Enter') stepHandler();
            }}
            required
          />
        )}
        {step === 1 && (
          <div className='space-y-2'>
            <div className='flex flex-wrap items-center gap-2 sm:flex-nowrap'>
              <p>
                {window.location.href.split('//').pop() || 'localhost:3000/'}
              </p>
              <div className='flex w-full gap-x-2'>
                <input
                  className='w-full rounded p-3 text-gray-800 shadow-md focus:outline-none focus:ring focus:ring-indigo-400/50'
                  type='text'
                  name='source'
                  placeholder='tailwind'
                  onChange={changeHandler}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') stepHandler();
                  }}
                  ref={sourceInput}
                />
                <button
                  onClick={() => {
                    if (!sourceInput.current) return;
                    sourceInput.current.value = nanoid();
                    data.source = sourceInput.current.value;
                  }}
                  className='self-stretch rounded bg-indigo-600 px-4 font-semibold text-white transition-transform hover:-translate-y-[0.1rem] focus:outline-none focus:ring focus:ring-indigo-400/50'
                >
                  <Dice />
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          type='button'
          onClick={stepHandler}
          disabled={isLoading}
          className='rounded bg-indigo-600 px-4 py-2 font-semibold text-white transition-transform hover:-translate-y-[0.1rem] focus:outline-none focus:ring focus:ring-indigo-400/50 disabled:cursor-not-allowed'
        >
          <div className='flex h-7 items-center justify-center'>
            {isLoading ? (
              <svg
                aria-hidden='true'
                className='m-1 mx-auto h-5 w-5 animate-spin fill-indigo-600 text-white'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
            ) : step === 0 ? (
              'Shorten'
            ) : (
              'Generate Short URL'
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Home;
