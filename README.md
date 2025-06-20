# Photodit - Clipping Path Service

A Next.js template for a photo editing service website with a dynamic admin panel.

## Features

- Responsive design for all devices
- Dynamic content management through admin panel
- Server-side rendering for SEO optimization
- Contact and quote forms with email notifications
- News/blog management system
- Before/after image comparison
- YouTube video integration

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd photodit
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```
   # Admin password for the admin panel
   ADMIN_PASSWORD=your-secure-password

   # Email configuration for sending emails
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password
   EMAIL_FROM=noreply@photodit.com
   ```

4. Run the development server:

   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Admin Panel

The admin panel is accessible at [http://localhost:3000/admin](http://localhost:3000/admin). You'll need to log in using the password specified in the `ADMIN_PASSWORD` environment variable.

### Admin Panel Features

- **Dashboard**: Overview of the website content
- **Home Page**: Edit all sections of the home page
- **News**: Manage news articles
- **Media**: Upload and manage images
- **Settings**: Configure site settings, contact information, and email preferences

## Content Structure

All content is stored in JSON files in the `src/data` directory:

- `home.json`: Home page content
- `news.json`: News articles and categories
- `settings.json`: Site settings, contact information, and email preferences

## Email Configuration

To enable email sending for contact and quote forms, configure the email settings in the `.env.local` file. The application uses Nodemailer to send emails.

## Customization

### Styling

The website uses SCSS for styling. The main styles are in the `src/styles` directory.

### Components

React components are organized in the `src/components` directory:

- `layout`: Layout components like header, footer, and banners
- `containers`: Page-specific components
- `admin`: Admin panel components

## Deployment

The website can be deployed to any platform that supports Next.js, such as Vercel, Netlify, or a custom server.

### Build for Production

```
npm run build
# or
yarn build
```

### Start Production Server

```
npm start
# or
yarn start
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
