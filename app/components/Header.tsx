import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-black">
            Kit Course
          </Link>
        </div>
        
        <nav className="hidden space-x-4 md:flex">
          <Link href="/courses" className="text-gray-600 hover:text-black">
            Courses
          </Link>
          <Link href="/lessons/sample" className="text-gray-600 hover:text-black">
            Sample Lesson
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-black">
            About
          </Link>
          <Link href="/creator" className="text-gray-600 hover:text-black">
            Creator Dashboard
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
} 