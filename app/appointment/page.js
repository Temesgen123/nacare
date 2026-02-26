'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import s from '../home.module.css';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className={s.root}>
      <h1 className="p-24 text-center font-bold text-2xl">
        Page Under Construction!
      </h1>
    </div>
  );
}
