'use client';

import React from 'react';
import Link from '../header/ElectricalLink';
import { ThankYouProps } from '../header/electricalTypes';
import { Check } from 'lucide-react';

export default function ThankYou({ data }: ThankYouProps) {
  return (
    <section className="max-w-xl mx-auto px-4 text-center py-10">
      <div className="h-20 w-20 mx-auto rounded-full bg-[#1B8A3E] text-white flex items-center justify-center mb-6">
        <Check size={36} />
      </div>
      <h1 className="text-[40px] font-black text-[#0b2540]">{data.title} <span className="text-[#1B8A3E]">{data.title_highlight}</span></h1>
      <p className="text-[#64748b] mt-3 mb-6">{data.description}</p>
      <Link href={data.button.href} className="inline-block bg-[#1B8A3E] text-white font-bold px-6 py-3 rounded-md">{data.button.text}</Link>
    </section>
  );
}
