import { Navbar1 } from '@/components/landing/navbar';
import { Hero12 } from '@/components/landing/hero';
import { Blog7 } from '@/components/landing/blog';
import { Footer7 } from '@/components/landing/footer';

export default function Home() {
  return (
    <div>
      <Navbar1 />
      <div className="flex flex-col items-center justify-center py-2 gap-4">
        <Hero12 />
        <Blog7 />
        <Footer7 />
      </div>
    </div>
  );
}
