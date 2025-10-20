# YCKF Frontend

This project is the frontend portion of the YCKF application. It is built using Next.js and is organized into several well-defined sections to promote modularity and ease of maintenance.

## Project Structure

- **Root Files**
  - Configuration files such as `eslint.config.mjs`, `next-env.d.ts`, `next.config.ts`, `postcss.config.js`, `postcss.config.mjs`, `tailwind.config.js`, and `tsconfig.json`.
  - `package.json` contains all the project dependencies and scripts.
  - `README.md` provides an overview of the project structure and purpose.

- **public/**
  - Contains static assets like images, fonts, and other files publically accessible to the browser.

- **src/**
  - **app/**: Holds the Next.js application pages and global layout definitions.
    - Includes pages for routes such as Home, About, Blogs, Careers, Complaints, Contact, Events, Free Training, Interns, Premium Training (with dynamic routes using `[slug]`), Student Dashboard, Team, Top Performers, and Volunteers.
  
  - **components/**: Contains reusable UI components like `Header.tsx`, `Footer.tsx`, `HeroSection.tsx`, `TestimonialSection.tsx`, `GallerySection.tsx`, `CurrencyDisplay.tsx`, and others.

  - **context/**: Provides React context for managing state across the application (e.g., `AuthContext.tsx`, `ThemeContext.tsx`).
  
  - **lib/**: Houses utility libraries to interface with the backend and Sanity CMS, supporting data fetching and other shared logic.
  
  - **themecontext/**: Offers additional theming functionalities using React context.

- **Testing**
  - Located in the `src/__tests__/` directory, this folder contains tests to ensure the frontend components and pages behave as expected.

## Summary

The YCKF Frontend is designed with a clear separation of concerns, leveraging Next.js for efficient routing, reusable components for a consistent UI, and context providers for state management. This structured approach facilitates scalable and maintainable development.
