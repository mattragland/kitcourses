import { getDatabase } from './db';
import { createCourse, createSection, createLesson } from './courseRepository';
import { getMockCreator } from './userRepository';

/**
 * Seeds the database with initial data
 */
export function seedDatabase() {
  const db = getDatabase();
  
  // Check if we already have courses
  const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number };
  
  if (courseCount.count > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }
  
  console.log('Seeding database...');
  
  // Get or create the mock creator
  const creator = getMockCreator();
  
  // Create courses
  const webDevCourseId = createCourse({
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of web development, including HTML, CSS, and JavaScript. This course is perfect for beginners who want to start building websites.',
    image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
    creator_id: creator.id
  });
  
  const reactCourseId = createCourse({
    title: 'React for Beginners',
    description: 'Learn React from scratch and build modern, interactive web applications. This course covers components, state, props, hooks, and more.',
    image_url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    creator_id: creator.id
  });
  
  const pythonCourseId = createCourse({
    title: 'Python Programming',
    description: 'Master Python programming with this comprehensive course. Learn syntax, data structures, functions, and build real-world applications.',
    image_url: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    creator_id: creator.id
  });
  
  // Create sections for Web Development course
  const htmlSectionId = createSection({
    course_id: webDevCourseId,
    title: 'HTML Basics',
    order: 1
  });
  
  const cssSectionId = createSection({
    course_id: webDevCourseId,
    title: 'CSS Styling',
    order: 2
  });
  
  const jsSectionId = createSection({
    course_id: webDevCourseId,
    title: 'JavaScript Fundamentals',
    order: 3
  });
  
  // Create sections for React course
  const reactBasicsSectionId = createSection({
    course_id: reactCourseId,
    title: 'React Basics',
    order: 1
  });
  
  const reactHooksSectionId = createSection({
    course_id: reactCourseId,
    title: 'React Hooks',
    order: 2
  });
  
  // Create sections for Python course
  const pythonBasicsSectionId = createSection({
    course_id: pythonCourseId,
    title: 'Python Basics',
    order: 1
  });
  
  const pythonOopSectionId = createSection({
    course_id: pythonCourseId,
    title: 'Object-Oriented Programming',
    order: 2
  });
  
  // Create lessons for HTML section
  createLesson({
    section_id: htmlSectionId,
    title: 'Introduction to HTML',
    content: `
      <h2>Introduction to HTML</h2>
      <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page and consists of a series of elements that tell the browser how to display the content.</p>
      <h3>Basic Structure</h3>
      <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Page Title&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;My First Heading&lt;/h1&gt;
    &lt;p&gt;My first paragraph.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
    `,
    is_free: true,
    order: 1
  });
  
  createLesson({
    section_id: htmlSectionId,
    title: 'HTML Elements',
    content: `
      <h2>HTML Elements</h2>
      <p>HTML elements are the building blocks of HTML pages. Elements are represented by tags, written using angle brackets.</p>
      <h3>Common HTML Elements</h3>
      <ul>
        <li><strong>&lt;h1&gt; to &lt;h6&gt;</strong> - Headings</li>
        <li><strong>&lt;p&gt;</strong> - Paragraph</li>
        <li><strong>&lt;a&gt;</strong> - Link</li>
        <li><strong>&lt;img&gt;</strong> - Image</li>
        <li><strong>&lt;ul&gt; and &lt;ol&gt;</strong> - Lists</li>
        <li><strong>&lt;div&gt;</strong> - Division or section</li>
      </ul>
    `,
    is_free: false,
    order: 2
  });
  
  // Create lessons for CSS section
  createLesson({
    section_id: cssSectionId,
    title: 'Introduction to CSS',
    content: `
      <h2>Introduction to CSS</h2>
      <p>CSS (Cascading Style Sheets) is used to style and layout web pages. It describes how HTML elements should be displayed.</p>
      <h3>CSS Syntax</h3>
      <pre><code>selector {
  property: value;
  property: value;
}</code></pre>
      <p>For example:</p>
      <pre><code>body {
  background-color: lightblue;
  font-family: Arial, sans-serif;
}</code></pre>
    `,
    is_free: true,
    order: 1
  });
  
  // Create lessons for JavaScript section
  createLesson({
    section_id: jsSectionId,
    title: 'Introduction to JavaScript',
    content: `
      <h2>Introduction to JavaScript</h2>
      <p>JavaScript is a programming language that enables interactive web pages. It is an essential part of web applications.</p>
      <h3>Basic JavaScript Syntax</h3>
      <pre><code>// Variables
let name = 'John';
const age = 30;

// Functions
function greet() {
  console.log('Hello, ' + name + '!');
}

// Calling a function
greet();</code></pre>
    `,
    is_free: false,
    order: 1
  });
  
  // Create lessons for React Basics section
  createLesson({
    section_id: reactBasicsSectionId,
    title: 'Introduction to React',
    content: `
      <h2>Introduction to React</h2>
      <p>React is a JavaScript library for building user interfaces. It allows you to create reusable UI components.</p>
      <h3>Creating a React Component</h3>
      <pre><code>import React from 'react';

function Welcome() {
  return (
    &lt;div&gt;
      &lt;h1&gt;Hello, React!&lt;/h1&gt;
      &lt;p&gt;Welcome to React development.&lt;/p&gt;
    &lt;/div&gt;
  );
}

export default Welcome;</code></pre>
    `,
    is_free: true,
    order: 1
  });
  
  // Create lessons for Python Basics section
  createLesson({
    section_id: pythonBasicsSectionId,
    title: 'Introduction to Python',
    content: `
      <h2>Introduction to Python</h2>
      <p>Python is a high-level, interpreted programming language known for its readability and simplicity.</p>
      <h3>Basic Python Syntax</h3>
      <pre><code># Variables and data types
name = "John"
age = 30
is_student = True

# Print to console
print("Hello, " + name + "!")

# Conditional statements
if age > 18:
    print("You are an adult")
else:
    print("You are a minor")</code></pre>
    `,
    is_free: true,
    order: 1
  });
  
  console.log('Database seeded successfully!');
} 