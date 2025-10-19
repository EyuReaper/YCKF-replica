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
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme-based class definitions 
  const bgClass = theme === 'light' ? 'bg-white shadow-md' : 'bg-gray-900';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const secondaryTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const mutedTextClass = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const linkHoverClass = theme === 'light' ? 'hover:text-blue-600' : 'hover:text-blue-400';
  const dropdownBgClass = theme === 'light' ? 'bg-white border-gray-200 dark:border-gray-700' : 'bg-gray-800 border-gray-700';
  const dropdownItemClass = theme === 'light' ? 'text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700' : 'text-gray-100 hover:bg-gray-700';
  const mobileMenuBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const searchInputClass = theme === 'light' ? 'text-gray-900 placeholder-gray-400 bg-white border-gray-300' : 'text-white placeholder-gray-400 bg-gray-700 border-gray-600';
  const dialogBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-800';

  // Sync theme with document class on client mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    // Optional: Persist theme to localStorage if not handled by context
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <header className={`sticky top-0 z-50 ${bgClass} ${textClass}`}>
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className={`text-2xl italic font-bold ${textClass}`}>
            YCKF
          </Link>
        </motion.div>
        <nav className="hidden space-x-8 md:flex">
          <Link href="/" className={`py-2 font-semibold transition-colors ${linkHoverClass}`}>
            Home
          </Link>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className={`flex items-center gap-1 py-2 font-semibold transition-colors ${linkHoverClass} focus:outline-none hover:bg-transparent`}>
                <span>Company</span>
                <ChevronDown size={16} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className={`${dropdownBgClass} rounded-md shadow-lg py-2 w-48 min-w-[180px] z-50`}>
                <DropdownMenu.Item asChild>
                  <Link href="/about" className={`block px-4 py-2 ${dropdownItemClass}`}>
                    About
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/team" className={`block px-4 py-2 ${dropdownItemClass}`}>
                    Team
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/interns" className={`block px-4 py-2 ${dropdownItemClass}`}>
                    Interns
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/volunteers" className={`block px-4 py-2 ${dropdownItemClass}`}>
                    Volunteers
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/top-performers" className={`block px-4 py-2 ${dropdownItemClass}`}>
                    Top Performers
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/events" className={`block px-4 py-2 ${dropdownItemClass}`}>
                    Events
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/careers" className={`block px-4 py-2 ${dropdownItemClass}`}>
                    Careers
                  </Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className={`flex items-center gap-1 py-2 font-semibold transition-colors ${linkHoverClass} focus:outline-none hover:bg-transparent`}>
                <span>Training</span>
                <ChevronDown size={16} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className={`${dropdownBgClass} rounded-md shadow-lg py-2 w-48 min-w-[180px] z-50`}>
                <DropdownMenu.Item asChild>
                  <Link href="/free-training" className={`block px-4 py-2 ${dropdownItemClass}`}>
                    Free Training
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/premium-training" className={`block px-4 py-2 ${dropdownItemClass}`}>
                    Premium Training
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/student-dashboard" className={`block px-4 py-2 ${dropdownItemClass}`}>
                    Student Dashboard
                  </Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <Link href="/blogs" className={`py-2 font-semibold transition-colors ${linkHoverClass}`}>
            Blogs
          </Link>
          <Link href="/contact" className={`py-2 font-semibold transition-colors ${linkHoverClass}`}>
            Contact
          </Link>
          <Link href="/complaints" className={`py-2 font-semibold transition-colors ${linkHoverClass}`}>
            Complaints
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`text-2xl ${textClass} hover:${textClass.replace('text-', 'text-gray-700 dark:text-')} focus:outline-none`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className={`p-2 ${secondaryTextClass} focus:outline-none ${linkHoverClass}`}
                aria-label="Open search"
              >
                <Search size={20} />
              </motion.button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className={`fixed z-50 w-full max-w-md p-6 -translate-x-1/2 -translate-y-1/2 ${dialogBgClass} rounded-md top-1/2 left-1/2`}>
                <Dialog.Title className={`mb-4 text-xl font-semibold ${textClass}`}>Search</Dialog.Title>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`${searchInputClass} w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                  />
                  <button className={`absolute ${mutedTextClass} -translate-y-1/2 right-2 top-1/2 ${linkHoverClass}`}>
                    <Search size={16} />
                  </button>
                </div>
                <Dialog.Close asChild>
                  <button className={`mt-4 ${secondaryTextClass} ${linkHoverClass}`}>
                    Close
                  </button>
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
            className={`relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hidden md:flex`}
          >
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <motion.span
                  animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className={`${mutedTextClass}`} />}
                </motion.span>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className={`${dropdownBgClass} absolute right-0 z-50 w-32 py-2 mt-2 rounded-md shadow-lg`}>
                  <DropdownMenu.Item
                    onSelect={() => setTheme('system')}
                    className={`flex items-center gap-2 px-4 py-2 ${dropdownItemClass}`}
                  >
                    <span>System</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={() => setTheme('light')}
                    className={`flex items-center gap-2 px-4 py-2 ${dropdownItemClass}`}
                  >
                    <Sun size={16} className="text-yellow-400" /> Light
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={() => setTheme('dark')}
                    className={`flex items-center gap-2 px-4 py-2 ${dropdownItemClass}`}
                  >
                    <Moon size={16} className={`${mutedTextClass}`} /> Dark
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </Toggle.Root>
        </div>
        {isMobileMenuOpen && (
          <div className={`${mobileMenuBgClass} fixed inset-0 z-40 p-6 pt-16 space-y-4 text-center md:hidden`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`absolute top-4 right-4 ${textClass} hover:${textClass.replace('text-', 'text-gray-700 dark:text-')} focus:outline-none`}
              aria-label="Close menu"
            >
              <X size={24} />
            </motion.button>
            <Link href="/" className={`block w-full py-3 font-semibold ${linkHoverClass}`} onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className={`block w-full py-3 text-left font-semibold ${linkHoverClass} focus:outline-none`}>
                  <span className="flex items-center gap-1">Company <ChevronDown size={16} /></span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className={`${dropdownBgClass} rounded-md shadow-lg py-1 w-48 min-w-[180px] z-50`}>
                  <DropdownMenu.Item asChild>
                    <Link href="/about" className={`block px-4 py-2 ${dropdownItemClass}`} onClick={() => setIsMobileMenuOpen(false)}>
                      About
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/team" className={`block px-4 py-2 ${dropdownItemClass}`} onClick={() => setIsMobileMenuOpen(false)}>
                      Team
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/interns" className={`block px-4 py-2 ${dropdownItemClass}`} onClick={() => setIsMobileMenuOpen(false)}>
                      Interns
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/volunteers" className={`block px-4 py-2 ${dropdownItemClass}`} onClick={() => setIsMobileMenuOpen(false)}>
                      Volunteers
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/top-performers" className={`block px-4 py-2 ${dropdownItemClass}`} onClick={() => setIsMobileMenuOpen(false)}>
                      Top Performers
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/events" className={`block px-4 py-2 ${dropdownItemClass}`} onClick={() => setIsMobileMenuOpen(false)}>
                      Events
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/careers" className={`block px-4 py-2 ${dropdownItemClass}`} onClick={() => setIsMobileMenuOpen(false)}>
                      Careers
                    </Link>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className={`block w-full py-3 text-left font-semibold ${linkHoverClass} focus:outline-none`}>
                  <span className="flex items-center gap-1">Training <ChevronDown size={16} /></span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className={`${dropdownBgClass} rounded-md shadow-lg py-1 w-48 min-w-[180px] z-50`}>
                  <DropdownMenu.Item asChild>
                    <Link href="/free-training" className={`block px-4 py-2 ${dropdownItemClass}`} onClick={() => setIsMobileMenuOpen(false)}>
                      Free Training
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/premium-training" className={`block px-4 py-2 ${dropdownItemClass}`} onClick={() => setIsMobileMenuOpen(false)}>
                      Premium Training
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/student-dashboard" className={`block px-4 py-2 ${dropdownItemClass}`} onClick={() => setIsMobileMenuOpen(false)}>
                      Student Dashboard
                    </Link>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <Link href="/blogs" className={`block w-full py-3 font-semibold ${linkHoverClass}`} onClick={() => setIsMobileMenuOpen(false)}>
              Blogs
            </Link>
            <Link href="/contact" className={`block w-full py-3 font-semibold ${linkHoverClass}`} onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </Link>
            <Link href="/complaints" className={`block w-full py-3 font-semibold ${linkHoverClass}`} onClick={() => setIsMobileMenuOpen(false)}>
              Complaints
            </Link>
            <Toggle.Root
              pressed={theme === 'dark'}
              onPressedChange={() => {
                const newTheme = theme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
              }}
              className={`relative p-2 rounded-md w-full text-left font-semibold ${linkHoverClass} focus:outline-none`}
            >
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <span className="flex items-center gap-2 py-3">
                    Theme {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className={`${mutedTextClass}`} />}
                  </span>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className={`${dropdownBgClass} rounded-md shadow-lg py-1 w-48 min-w-[180px] z-50`}>
                    <DropdownMenu.Item
                      onSelect={() => setTheme('system')}
                      className={`flex items-center gap-2 px-4 py-2 ${dropdownItemClass}`}
                    >
                      <span>System</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={() => setTheme('light')}
                      className={`flex items-center gap-2 px-4 py-2 ${dropdownItemClass}`}
                    >
                      <Sun size={16} className="text-yellow-400" /> Light
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={() => setTheme('dark')}
                      className={`flex items-center gap-2 px-4 py-2 ${dropdownItemClass}`}
                    >
                      <Moon size={16} className={`${mutedTextClass}`} /> Dark
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </Toggle.Root>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;