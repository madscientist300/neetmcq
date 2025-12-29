# NEET-UG MCQ Platform

A comprehensive web application for NEET-UG exam preparation featuring separate admin, teacher, and student portals with quiz functionality, markdown support, image uploads, and advanced question management.

## Features

### Admin Features
- Dedicated admin dashboard for platform management
- Create and manage teacher accounts
- View all registered teachers with statistics
- Monitor teacher contributions (question counts by subject/chapter)
- Delete teacher accounts when needed
- Secure role-based access control
- Dark/Light mode toggle

### Teacher Features
- Create questions with advanced markdown editor
- Live preview while writing questions and explanations
- Tab-based interface (Edit/Preview) for better workflow
- Inline markdown help with quick reference
- Upload question images (supports drag-and-drop)
- Add tags to questions for better organization
- Multi-select categories for questions
- Subject and chapter-based organization (4 subjects: Botany, Zoology, Physics, Chemistry)
- Difficulty levels (Easy, Medium, Hard)
- View and filter question library with markdown rendering
- Delete questions with error feedback
- Dark/Light mode toggle

### Student Features
- View subjects and categories
- Advanced filtering by subject, chapter, category, tags, and difficulty
- Practice quizzes with floating bubble navigation
- Expandable circular navigation panel with color-coded status
- Real-time question status indicators (unattempted, correct, incorrect)
- Enhanced markdown rendering for questions and options with table support
- Image support in questions (uploaded by teachers)
- Previous/Next navigation
- Immediate feedback with explanations
- Progress tracking with attempt statistics
- Dark/Light mode toggle

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Tailwind Typography
- **Backend**: Supabase (PostgreSQL + Auth)
- **Authentication**: Supabase Email/Password
- **Markdown**: react-markdown with rehype plugins
- **Icons**: lucide-react

## Project Structure

```
/src
  /components
    ImageUpload.tsx         # Image upload with drag-and-drop
    MarkdownEditor.tsx      # Advanced markdown editor with preview
    QuestionFilters.tsx     # Multi-criteria filtering component
    QuestionForm.tsx        # Teacher question creation form
    QuestionList.tsx        # Teacher question library
    QuestionNavRing.tsx     # Circular question navigation
    QuizResults.tsx         # Quiz completion results
    QuizView.tsx           # Student quiz interface
    ThemeToggle.tsx        # Dark/Light mode toggle
  /contexts
    AuthContext.tsx        # Authentication state management
    ThemeContext.tsx       # Theme state management
  /pages
    AdminDashboard.tsx     # Admin portal for teacher management
    Login.tsx              # Login page
    Register.tsx           # Student registration page
    StudentDashboard.tsx   # Student portal
    TeacherDashboard.tsx   # Teacher portal
  /lib
    supabase.ts            # Supabase client
    database.types.ts      # TypeScript types for database
  App.tsx                  # Main app with routing
  main.tsx                # App entry point
/supabase
  /migrations             # Database migration files
```

## Database Schema

The application uses the following Supabase tables:

- **profiles**: User profiles with role (admin/teacher/student)
- **subjects**: Academic subjects (Botany, Zoology, Physics, Chemistry)
- **chapters**: Chapters within subjects (with ordering)
- **categories**: Question categories for practice
- **questions**: MCQ questions with options, explanations, tags, and image support
- **question_categories**: Many-to-many relationship between questions and categories
- **student_attempts**: Student quiz attempts and results

**Storage:**
- **question-images**: Public bucket for question image uploads

All tables have Row Level Security (RLS) enabled with appropriate policies for admin, teacher, and student access levels.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Get your Supabase credentials:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to Settings > API
   - Copy the URL and anon/public key

### Database Setup

The database schema is already created via migrations. The tables include:
- profiles
- subjects
- chapters
- categories
- questions
- question_categories
- student_attempts

### Pre-Seeded Data

The following data is automatically created when you set up the database:

**Subjects:**
- Botany (17 chapters)
- Zoology (12 chapters)
- Physics (15 chapters)
- Chemistry (16 chapters)

**Chapters:**
- **Botany**: The Living World, Biological Classification, Plant Kingdom, Morphology of Flowering Plants, Anatomy of Flowering Plants, Cell: The unit of Life, Cell Cycle and Cell Division, Photosynthesis in Higher Plants, Respiration in Plants, Plant Growth and Development, Sexual Reproduction in Flowering Plants, Principle of Inheritance and Variation, Molecular Basis of Inheritance, Microbes in Human Welfare, Organisms and Populations, Ecosystem, Biodiversity and Conservation

- **Zoology**: Animal Kingdom, Structural Organization in Animals, Biomolecules, Digestion and Absorption, Breathing and Exchange of Gases, Body Fluids and Circulation, Excretory Products and Elimination, Locomotion and Movement, Neural Control and Coordination, Chemical Coordination and Integration, Human Reproduction, Reproductive Health

- **Physics**: Physical World, Units and Measurements, Motion in a Straight Line, Motion in a Plane, Laws of Motion, Work Energy and Power, System of Particles and Rotational Motion, Gravitation, Mechanical Properties of Solids, Mechanical Properties of Fluids, Thermal Properties of Matter, Thermodynamics, Kinetic Theory, Oscillations, Waves

- **Chemistry**: Some Basic Concepts of Chemistry, Structure of Atom, Classification of Elements and Periodicity, Chemical Bonding and Molecular Structure, States of Matter, Thermodynamics, Equilibrium, Redox Reactions, Hydrogen, s-Block Elements, p-Block Elements, Organic Chemistry Basics, Hydrocarbons, Environmental Chemistry, Solid State, Solutions

**Categories (Exam Types):**
1. NEET PYQs - Previous Year Questions from NEET exams
2. NCERT Boosters - Important NCERT-based questions for concept clarity
3. Sample Papers - Practice test papers for exam preparation
4. Test Series - Full-length mock tests to assess preparation

Admins can create teacher accounts, and teachers can immediately start creating questions.

## Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Deployment on Netlify

### Step 1: Push to GitHub

1. Initialize git (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push to GitHub

### Step 2: Deploy on Netlify

1. Go to [Netlify](https://www.netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

5. Add environment variables:
   - Go to Site settings > Environment variables
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

6. Click "Deploy site"

### Step 3: Custom Domain (Optional)

1. Go to Site settings > Domain management
2. Add your custom domain
3. Configure DNS settings as instructed

## Usage Guide

### For Admins

1. Get admin access by manually updating your profile role to 'admin' (see [ADMIN_SETUP_GUIDE.md](./ADMIN_SETUP_GUIDE.md))
2. Login to access Admin Dashboard
3. View all registered teachers with their statistics
4. Create new teacher accounts:
   - Click "Add Teacher" button
   - Enter full name, email, and password
   - Share credentials with the teacher
5. Monitor teacher contributions by subject and chapter
6. Delete teacher accounts when necessary

### For Teachers

1. Receive account credentials from admin
2. Login to access Teacher Dashboard
3. Create questions using the advanced markdown editor:
   - **Edit Tab**: Write question text with markdown formatting
   - **Preview Tab**: See exactly how it will appear to students
   - Click "Markdown Help" for quick formatting tips
   - Use tables, bold, italic, lists, and more
   - Character count shows as you type
   - Upload question images (drag-and-drop or click to select)
   - Add optional tags for better organization
   - Enter 4 options (A, B, C, D)
   - Select correct answer
   - Choose subject and chapter
   - Choose difficulty level
   - Select applicable categories
   - Add explanation (also with markdown support and preview)
4. View and manage questions in the library
5. Filter by subject, chapter, or category
6. Delete questions (with error feedback if issues occur)

### For Students

1. Register freely with email/password
2. Login to access Student Dashboard
3. Apply filters to find specific questions:
   - Subject (Botany, Zoology, Physics, Chemistry)
   - Multiple chapters within a subject
   - Multiple categories (NEET PYQs, NCERT Boosters, etc.)
   - Tags added by teachers
   - Difficulty level
4. Click "Start Practice Quiz" to begin
5. Click the floating navigation bubble (bottom-right) to see all questions
6. Use the circular navigation grid to jump between questions
7. Select an answer and submit
8. View immediate feedback with explanations
9. Navigate using Previous/Next buttons
10. Track progress with color-coded indicators:
    - Grey: Unattempted
    - Green: Correct
    - Red: Incorrect
    - Blue ring: Current question
11. View attempt statistics in the navigation panel
12. Exit quiz anytime to return to dashboard

## Markdown Editor with Live Preview

The platform features an advanced markdown editor that makes creating formatted questions easy and intuitive.

### Features

**Dual Tab Interface:**
- **Edit Tab**: Write your content with markdown syntax
- **Preview Tab**: See exactly how it will render for students
- Instant switching between tabs
- No need to save to see preview

**Built-in Help:**
- Click "Markdown Help" button for quick reference
- Shows common markdown syntax
- Link to complete guide
- Context-aware assistance

**Smart Formatting:**
- Character counter
- Syntax highlighting in preview
- Proper table rendering with borders
- Code block support
- Dark mode compatible

**Supported Markdown Features:**
- **Bold** and *italic* text
- Tables (perfect for data-based NEET questions)
- Lists (ordered and unordered)
- Headings (H1-H6)
- Line breaks and paragraphs
- Basic HTML (sanitized for security)

**Where Available:**
- Question Text field (with help)
- Explanation field (streamlined version)
- Both fields support full markdown

**Benefits:**
- See formatting before creating question
- Avoid markdown syntax errors
- Create professional-looking questions
- Consistent formatting across all questions

**Complete Guides:**
- [MARKDOWN_GUIDE.md](./MARKDOWN_GUIDE.md) - Markdown syntax reference with examples
- [EDITOR_GUIDE.md](./EDITOR_GUIDE.md) - Step-by-step editor usage guide

Example markdown table question:
```markdown
Study the following table:

| Root Region         | Permeability | Nutrient Uptake Rate |
|---------------------|--------------|----------------------|
| Root Hair Zone      | High         | Maximum              |
| Mature Zone         | Medium       | Moderate             |
| Meristematic Zone   | Low          | Minimum              |

**Question:** Which region absorbs the most minerals?
```

## Theme System

The application supports dark and light modes:
- Toggle using the button in the top-right corner
- Theme preference is saved in localStorage
- Respects system dark mode preference by default
- No flash on page load (pre-hydration script)

## Security

- All database tables have Row Level Security (RLS) enabled
- **Admin Role**: Can manage all teacher accounts, view all data
- **Teacher Role**: Can only create/edit/delete their own questions, upload images
- **Student Role**: Can only read questions and insert their own attempts
- Admin role can only be assigned via direct database access (manual SQL)
- Teachers can only be created by admins
- Students can self-register freely
- Authentication required for all operations
- Secure password handling via Supabase Auth
- Image uploads are scoped to authenticated teachers only
- All storage policies enforce proper access control

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Additional Documentation

- **[ADMIN_SETUP_GUIDE.md](./ADMIN_SETUP_GUIDE.md)** - Complete guide for setting up admin accounts and managing teachers
- **[MARKDOWN_GUIDE.md](./MARKDOWN_GUIDE.md)** - Markdown syntax reference with examples for creating questions
- **[EDITOR_GUIDE.md](./EDITOR_GUIDE.md)** - Step-by-step guide for using the markdown editor

## Troubleshooting

### Build Errors

If you encounter build errors:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working

Make sure your environment variables are prefixed with `VITE_`:
- Correct: `VITE_SUPABASE_URL`
- Wrong: `SUPABASE_URL`

### Dark Mode Flash

The pre-hydration script in `index.html` prevents theme flash. Ensure it's present before the app loads.

### Image Upload Issues

If image uploads fail:
- Verify the `question-images` storage bucket exists in Supabase
- Check storage policies allow authenticated users to upload
- Ensure file size is under the limit (typically 5MB)
- Verify the file format is supported (jpg, png, gif, webp)

### Cannot Access Admin Dashboard

- Verify your role is set to 'admin' in the profiles table
- Use Supabase SQL Editor to run: `UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';`
- Clear browser cache and login again

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
