# Kit Course App

A lightweight, minimalist course app designed for creators who want a quick and easy way to set up and sell online courses.

## Features

- **Public Course Dashboard**: Browse available courses
- **Course Structure**: Organized into sections and lessons
- **Free and Premium Content**: Some lessons are free, others require login
- **Rich Content**: Support for text, images, and embedded content
- **Minimalist Design**: Clean, distraction-free interface

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, ShadCN UI
- **Backend**: Next.js API Routes, SQLite
- **Storage**: ImageKit for optimized images, oEmbed for external content

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kitcourse.git
   cd kitcourse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Seed the database with sample data:
   ```bash
   npm run seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app`: Next.js app directory
  - `/api`: API routes
  - `/components`: Reusable UI components
  - `/courses`: Course-related pages
  - `/db`: Database models and utilities
  - `/lib`: Utility functions

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id/
```

## Future Enhancements

- Magic Link Authentication via Kit
- Payments and access control via Kit Commerce
- User progress tracking
- Course completion certificates

## License

This project is licensed under the MIT License - see the LICENSE file for details.
