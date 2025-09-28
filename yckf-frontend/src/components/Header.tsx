'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import * as Toggle from '@radix-ui/react-toggle';
import { useState, useEffect } from 'react';
import { Search, Moon, Sun, Menu, X, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(theme === 'light');

  useEffect(() => {
    setIsDarkTheme(theme === 'dark');
  }, [theme]);

  return (
    <header className="sticky top-0 z-50 text-gray-900 bg-white shadow-md dark:bg-gray-900 dark:text-white">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-2xl italic font-bold text-gray-900 dark:text-white">
            YCKF
          </Link>
        </motion.div>
        <nav className="hidden space-x-8 md:flex">
          <Link href="/" className="py-2 font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
            Home
          </Link>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-1 py-2 font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400 focus:outline-none hover:bg-transparent">
                <Link href="/company" className="flex items-center gap-1">
                  Company <ChevronDown size={16} />
                </Link>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 w-48 min-w-[180px] border border-gray-200 dark:border-gray-700 z-50">
                <DropdownMenu.Item asChild>
                  <Link href="/about" className="block px-4 py-2 text-gray-900 dark:hover:text-white hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700">
                    About
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/team" className="block px-4 py-2 text-gray-900 dark:hover:text-white hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700">
                    Team
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/interns" className="block px-4 py-2 text-gray-900 dark:hover:text-white hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700">
                    Interns
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/volunteers" className="block px-4 py-2 text-gray-900 dark:hover:text-white hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700">
                    Volunteers
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/top-performers" className="block px-4 py-2 text-gray-900 dark:hover:text-white hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700">
                    Top Performers
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/events" className="block px-4 py-2 text-gray-900 dark:hover:text-white hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700">
                    Events
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/careers" className="block px-4 py-2 text-gray-900 dark:hover:text-white hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700">
                    Careers
                  </Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <Link href="/services" className="py-2 font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
            Free Training
          </Link>
          <Link href="/contact" className="py-2 font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
            Contact
          </Link>
          <Link href="/complaints" className="py-2 font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
            Complaints
          </Link>
        </nav>
        <div className="md:hidden">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-2xl text-gray-900 hover:text-gray-900 dark:text-white dark:hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
        <div className="items-center hidden space-x-4 md:flex">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300 focus:outline-none"
                aria-label="Open search"
              >
                <Search size={20} />
              </motion.button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed z-50 w-full max-w-md p-6 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md top-1/2 left-1/2 dark:bg-gray-800">
                <Dialog.Title className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Search</Dialog.Title>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 py-2 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600"
                  />
                  <button className="absolute text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-300">
                    <Search size={16} />
                  </button>
                </div>
                <Dialog.Close asChild>
                  <button className="mt-4 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Close</button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <Toggle.Root
            pressed={theme === 'dark'}
            onPressedChange={() => {
              const newTheme = theme === 'dark' ? 'light' : 'dark';
              setTheme(newTheme);
            }}
            className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <motion.span
                  animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-400 dark:text-white" />}
                </motion.span>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="absolute right-0 z-50 w-32 py-2 mt-2 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <DropdownMenu.Item
                    onSelect={() => setTheme('system')}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-white dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900"
                  >
                    <span>System</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={() => setTheme('light')}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-white dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900"
                  >
                    <Sun size={16} className="text-yellow-400" /> Light
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={() => setTheme('dark')}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-white dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900"
                  >
                    <Moon size={16} className="text-gray-400 dark:text-white" /> Dark
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </Toggle.Root>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="p-4 space-y-3 text-center bg-white md:hidden dark:bg-gray-900">
          <Link href="/" className="block py-1 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="block w-full py-1 text-left text-gray-900 dark:text-white hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none">
                <Link href="/company" className="flex items-center gap-1">
                  Company <ChevronDown size={16} />
                </Link>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 w-48 min-w-[180px] border border-gray-200 dark:border-gray-700 z-50">
                <DropdownMenu.Item asChild>
                  <Link href="/about" className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
                    About
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/team" className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
                    Team
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/interns" className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
                    Interns
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/volunteers" className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
                    Volunteers
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/top-performers" className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
                    Top Performers
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/events" className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
                    Events
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/careers" className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
                    Careers
                  </Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <Link href="/services" className="block py-1 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300" onClick={() => setIsMobileMenuOpen(false)}>
            Free Training
          </Link>
          <Link href="/contact" className="block py-1 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300" onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </Link>
          <Link href="/complaints" className="block py-1 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300" onClick={() => setIsMobileMenuOpen(false)}>
            Complaints
          </Link>
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600"
              />
              <button className="absolute text-gray-700 -translate-y-1/2 right-2 top-1/2 dark:text-gray-300">
                <Search size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center pt-3 space-x-4">
            <Toggle.Root
              pressed={theme === 'dark'}
              onPressedChange={() => {
                const newTheme = theme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
              }}
              className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <motion.span
                    animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center"
                  >
                    {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-400 dark:text-white" />}
                  </motion.span>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="absolute right-0 z-50 w-32 py-2 mt-2 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <DropdownMenu.Item
                      onSelect={() => setTheme('system')}
                      className="flex items-center gap-2 px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900"
                    >
                      <span>System</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={() => setTheme('light')}
                      className="flex items-center gap-2 px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900"
                    >
                      <Sun size={16} className="text-yellow-400" /> Light
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={() => setTheme('dark')}
                      className="flex items-center gap-2 px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900"
                    >
                      <Moon size={16} className="text-gray-400 dark:text-white" /> Dark
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </Toggle.Root>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;