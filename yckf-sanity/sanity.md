
# YCKF Sanity Folder Structure and Integration

The `yckf-sanity` folder is dedicated to configuring and managing the Sanity headless CMS for the YCKF project. It contains all the necessary files for setting up the CMS backend as well as defining custom content schemas. Here's an overview of its structure and how it interacts with other parts of the application:

## Folder Structure and Key Files

- **Configuration Files**
  - `sanity.config.ts`: Contains the main configuration for the Sanity CMS, including project settings, dataset options, and plugins.
  - `sanity.cli.ts`: Provides CLI commands to manage Sanity tasks such as deploying content or running custom scripts.
  - `tsconfig.json` and `eslint.config.mjs`: Set up TypeScript and linting configurations to ensure code quality and consistency during development.
  - `package.json`: Lists all dependencies and scripts related to the Sanity portion of the project.

- **Schemas**
  The `schemaTypes/` directory houses a collection of TypeScript files that define the schemas for various content types used in the project. These include:
  - `auditLog.ts`
  - `blogs.ts`
  - `careers.ts`
  - `courseProgress.ts`
  - `events.ts`
  - `faq.ts`
  - `freeTraining.tsx`
  - `interns.ts`
  - `paymentLog.ts`
  - `premiumTraining.ts`
  - `studentEnrollment.ts`
  - `team.ts`
  - `testimonial.ts`
  - `top-performers.ts`
  - `user.ts`
  - `volunteers.ts`

  These schema files define the structure of the content, ensuring that data entered into Sanity adheres to predefined formats.

## How It Works with Other Folders

- **Integration with yckf-frontend**
  - The Sanity CMS provides content via APIs that are consumed by the frontend application. The schemas defined here ensure that the data retrieved is structured and formatted correctly, enabling the YCKF Frontend to display dynamic content such as blogs, testimonials, and course information.

- **Integration with yckf-backend**
  - The backend of YCKF can integrate with Sanity to manage content updates, perform analytics on content interactions, or synchronize data between the CMS and other back-office systems. This ensures a unified flow of information across the entire application.

## Summary

The `yckf-sanity` folder is a critical component of the YCKF project, bridging content management with both the frontend and backend. Its well-organized configuration and schema definitions facilitate a smooth integration between the CMS and other parts of the application, allowing for scalable and consistent content delivery.

# Sanity Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)
