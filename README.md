NotesApp
========

A simple, modern, and beautiful notes application built with Next.js and Prisma, accelerated with AI-powered code generation.

Description
-----------

NotesApp is a full-stack CRUD (Create, Read, Update, Delete) application designed for efficient note-taking. Users can create, view, edit, and delete notes, with all data being persistently stored in a PostgreSQL database. The application features a clean, responsive interface with dynamic search, filtering, and sorting capabilities.

This project was developed as a capstone for the **Student Development Initiative IBM X Hacktiv8**, focusing on leveraging AI tools like IBM Granite to speed up the development process.

Technologies Used
-----------------

*   **Framework**: Next.js 15 (App Router)
    
*   **Language**: TypeScript
    
*   **Database**: PostgreSQL
    
*   **ORM**: Prisma
    
*   **Styling**: Tailwind CSS
    
*   **UI Components**: shadcn/ui
    
*   **Deployment**: Vercel
    

Features
--------

*   **Full CRUD Functionality**: Create, read, update, and delete notes.
    
*   **Persistent Storage**: Data is saved securely in a PostgreSQL database.
    
*   **Dynamic Filtering & Sorting**: Easily find notes by searching keywords, filtering by category, or sorting by date and title.
    
*   **Modern User Experience**:
    
    *   **Skeleton Loading**: Smooth loading states that prevent layout shifts.
        
    *   **Confirmation Dialogs**: Safe and intuitive confirmation for destructive actions like deleting notes.
        
    *   **Toast Notifications**: Clean, non-intrusive feedback for user actions.
        
*   **Responsive Design**: A fully responsive interface that works seamlessly on desktop and mobile devices.
    

Setup and Installation
----------------------

To run this project locally, follow these steps:

1. **Clone the repository:**
```bash
git clone https://github.com/annamaulina654/notes-app.git
cd notes-app
```
2. **Install dependencies:**
```bash
npm install
```    
3. **Set up the database:**
    *   Create a PostgreSQL database (e.g., via Supabase, Neon, or a local installation).
      
    *   Add the database URL to a `.env` file in the project root:
      
        `DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"`
  
3.  **Run the database migration:**
    This command will sync your Prisma schema with the database and create the Note table.
    ```bash
    npx prisma migrate dev
    ```
    
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    
Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the result.

AI Support Explanation
----------------------

As per the project brief, AI (specifically IBM Granite via Watsonx) was used as a development tool to accelerate and improve the coding process, not as a feature in the final product.

Here’s how AI provided support:

*   **Code Generation**:
    
    *   **Boilerplate Code**: Generated initial boilerplate for React components (e.g., forms, cards, skeleton loaders) and Next.js API routes based on descriptions.
        
    *   **SQL & Prisma Queries**: Assisted in writing initial SQL queries for seeding the database and complex Prisma queries for filtering and sorting.
        
*   **Code Optimization & Refactoring**:
    
    *   Provided suggestions for refactoring complex client-side logic, such as improving the useEffect hooks for debouncing and filtering to make them more efficient and bug-free.
        
    *   Helped optimize the UI by suggesting modern components like AlertDialog and Sonner for a better user experience.
        
*   **Debugging & Documentation**:
    
    *   **Error Explanation**: Helped decipher complex error messages, particularly those related to Prisma Client initialization and TypeScript type mismatches.
        
    *   **Documentation**: Assisted in generating clear and standardized commit messages and writing this README.md file.

