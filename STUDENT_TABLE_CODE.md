# Student Records - React Data Table (Complete Code)

A React app that fetches student/user data from JSONPlaceholder API, displays it in a
responsive table with a loading spinner, error handling, and live search filtering by name.

---

## Project Structure

```
student-records/
|-- index.html
|-- package.json
|-- vite.config.js
+-- src/
    |-- main.jsx
    |-- index.css
    |-- App.jsx
    +-- App.css
```

---

## How to Set Up and Run

```bash
# 1. Create a new folder and open terminal inside it
mkdir student-records
cd student-records

# 2. Create the project using Vite + React template
npx -y create-vite@latest ./ --template react --no-interactive --overwrite

# 3. Install dependencies
npm install

# 4. Replace the files below with the code given in this document:
#    - index.html         (root HTML)
#    - src/main.jsx       (entry point - NO changes needed, keep as-is)
#    - src/index.css      (global styles)
#    - src/App.jsx        (main component)
#    - src/App.css        (component styles)

# 5. Start the dev server
npm run dev

# 6. Open http://localhost:5173 in your browser
```

---

## File 1: index.html (root - replace the existing one)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Student Records - Data Explorer</title>
    <meta name="description" content="A React student records dashboard with live search, fetching from JSONPlaceholder API." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## File 2: src/main.jsx (entry point - keep as-is from Vite scaffold)

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

## File 3: src/index.css (global base styles - replace the existing one)

```css
/* ===================================================
   index.css - Global base styles
   =================================================== */

/* Google Font - Inter for clean, modern typography */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color-scheme: dark;
  color: #e2e8f0;
  background: #0b0f19;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  min-height: 100vh;
}

#root {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}
```

---

## File 4: src/App.jsx (main component - replace the existing one)

```jsx
import { useState, useEffect } from 'react'
import './App.css'

// API endpoint - JSONPlaceholder provides 10 fake user records
const API_URL = 'https://jsonplaceholder.typicode.com/users'

function App() {
  // --------------------------------------------------
  // useState hooks - manage component state
  // --------------------------------------------------

  // Stores the array of student records fetched from the API
  const [students, setStudents] = useState([])

  // Tracks whether the API request is in progress
  const [loading, setLoading] = useState(true)

  // Stores any error message if the API request fails
  const [error, setError] = useState(null)

  // Stores the current search input for live filtering
  const [searchText, setSearchText] = useState('')

  // --------------------------------------------------
  // useEffect - fetch data when the component mounts
  // The empty dependency array [] means this runs only once on mount.
  // --------------------------------------------------
  useEffect(() => {
    fetchStudents()
  }, [])

  // Async function to fetch student data from the API
  async function fetchStudents() {
    // Reset state before each fetch attempt
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(API_URL)

      // Check if the response status is OK (200-299)
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`)
      }

      // Parse the JSON response body
      const data = await response.json()

      // Update state with the fetched student data
      setStudents(data)
    } catch (err) {
      // Handle network errors or failed requests gracefully
      setError(err.message || 'Something went wrong while fetching data.')
    } finally {
      // Always turn off loading, whether the request succeeded or failed
      setLoading(false)
    }
  }

  // --------------------------------------------------
  // Live search filtering - case-insensitive
  // Filters the students array by matching the name field
  // against the current search text, recalculated on every render.
  // --------------------------------------------------
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchText.toLowerCase())
  )

  // --------------------------------------------------
  // Render: Loading State
  // Shows an animated spinner while waiting for the API
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="page">
        <div className="spinner-container">
          <div className="spinner" />
          <p className="spinner-text">Loading students...</p>
        </div>
      </div>
    )
  }

  // --------------------------------------------------
  // Render: Error State
  // Shows a friendly error message with a retry button
  // --------------------------------------------------
  if (error) {
    return (
      <div className="page">
        <div className="error-container">
          <div className="error-icon">Warning</div>
          <h2 className="error-title">Failed to load students</h2>
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={fetchStudents}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // --------------------------------------------------
  // Render: Main content - search bar + student table
  // --------------------------------------------------
  return (
    <div className="page">
      {/* Page header */}
      <header className="header">
        <h1>Student Records</h1>
        <p className="subtitle">
          Browse and search student profiles fetched from a REST API
        </p>
      </header>

      {/* Live search input - updates searchText on every keystroke */}
      <div className="search-wrapper">
        <input
          id="search-input"
          type="text"
          placeholder="Search student by name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
        {/* Show result count when a search term is entered */}
        {searchText && (
          <span className="result-count">
            {filteredStudents.length} result{filteredStudents.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Conditionally render the table or a "no results" message */}
      {filteredStudents.length === 0 ? (
        // No students match the search term
        <div className="empty-state">
          <p className="empty-title">No students found</p>
          <p className="empty-hint">
            No results for "<strong>{searchText}</strong>". Try a different name.
          </p>
        </div>
      ) : (
        // Responsive table wrapper
        <div className="table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {/* Map over filtered students to render each row */}
              {/* Using student.id as the React key for stable identity */}
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="id-cell">{student.id}</td>
                  <td className="name-cell">
                    {/* Highlight matching text in name */}
                    {highlightMatch(student.name, searchText)}
                  </td>
                  <td className="username-cell">@{student.username}</td>
                  <td className="email-cell">
                    <a href={`mailto:${student.email}`}>{student.email.toLowerCase()}</a>
                  </td>
                  <td className="city-cell">
                    <span className="city-badge">{student.address.city}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer with record count */}
      <footer className="footer">
        Showing {filteredStudents.length} of {students.length} students
      </footer>
    </div>
  )
}

// --------------------------------------------------
// Helper: highlight the search term within a name
// Wraps the matched substring in a <mark> element
// --------------------------------------------------
function highlightMatch(text, query) {
  if (!query) return text

  // Escape special regex characters in the query
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i}>{part}</mark> : part
  )
}

export default App
```

---

## File 5: src/App.css (component styles - replace the existing one)

```css
/* ===================================================
   App.css - Student Data Table Styles
   =================================================== */

/* --- Page Layout --- */
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 24px 64px;
  min-height: 100vh;
}

/* --- Header --- */
.header {
  text-align: center;
  margin-bottom: 36px;
}

.header h1 {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #6366f1, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px;
  line-height: 1.3;
}

.subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0;
}

/* --- Search Bar --- */
.search-wrapper {
  position: relative;
  max-width: 480px;
  margin: 0 auto 28px;
}

.search-input {
  width: 100%;
  padding: 14px 110px 14px 16px;
  border-radius: 12px;
  border: 1.5px solid rgba(99, 102, 241, 0.2);
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(12px);
  color: #f1f5f9;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: #64748b;
}

/* Focus glow effect on the search bar */
.search-input:focus {
  border-color: rgba(129, 140, 248, 0.6);
  box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
}

.result-count {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  background: rgba(99, 102, 241, 0.12);
  padding: 3px 10px;
  border-radius: 999px;
  animation: fade-in 0.2s ease;
}

/* --- Table Card --- */
.table-wrapper {
  background: rgba(17, 24, 39, 0.65);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 16px;
  box-shadow: 0 0 60px -12px rgba(99, 102, 241, 0.2);
  overflow: hidden;
}

/* --- Table --- */
.student-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.student-table thead th {
  text-align: left;
  padding: 14px 20px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
  background: rgba(99, 102, 241, 0.05);
  border-bottom: 1px solid rgba(99, 102, 241, 0.12);
  white-space: nowrap;
}

.student-table tbody tr {
  transition: background 0.2s ease;
  animation: row-in 0.35s ease both;
}

/* Staggered row entrance - each row slightly delayed */
.student-table tbody tr:nth-child(1)  { animation-delay: 0ms; }
.student-table tbody tr:nth-child(2)  { animation-delay: 40ms; }
.student-table tbody tr:nth-child(3)  { animation-delay: 80ms; }
.student-table tbody tr:nth-child(4)  { animation-delay: 120ms; }
.student-table tbody tr:nth-child(5)  { animation-delay: 160ms; }
.student-table tbody tr:nth-child(6)  { animation-delay: 200ms; }
.student-table tbody tr:nth-child(7)  { animation-delay: 240ms; }
.student-table tbody tr:nth-child(8)  { animation-delay: 280ms; }
.student-table tbody tr:nth-child(9)  { animation-delay: 320ms; }
.student-table tbody tr:nth-child(10) { animation-delay: 360ms; }

/* Row hover effect */
.student-table tbody tr:hover {
  background: rgba(99, 102, 241, 0.07);
}

.student-table tbody td {
  padding: 14px 20px;
  font-size: 0.875rem;
  border-bottom: 1px solid rgba(99, 102, 241, 0.06);
  color: #94a3b8;
  vertical-align: middle;
}

.student-table tbody tr:last-child td {
  border-bottom: none;
}

@keyframes row-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- Cell-specific styles --- */
.id-cell {
  font-weight: 700;
  color: #6366f1 !important;
  font-variant-numeric: tabular-nums;
  width: 48px;
}

.name-cell {
  color: #f1f5f9 !important;
  font-weight: 600;
}

.username-cell {
  color: #64748b !important;
  font-size: 0.82rem !important;
}

.email-cell a {
  color: #818cf8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.email-cell a:hover {
  color: #a78bfa;
  text-decoration: underline;
}

.city-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.12);
  font-size: 0.78rem;
  font-weight: 500;
  color: #94a3b8;
  white-space: nowrap;
}

/* Search match highlight */
mark {
  background: rgba(129, 140, 248, 0.25);
  color: #f1f5f9;
  border-radius: 3px;
  padding: 0 2px;
}

/* --- Loading Spinner --- */
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
}

.spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3.5px solid rgba(99, 102, 241, 0.15);
  border-top-color: #818cf8;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner-text {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
  letter-spacing: 0.02em;
  margin: 0;
}

/* --- Error State --- */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 14px;
  text-align: center;
}

.error-icon {
  font-size: 2.5rem;
}

.error-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fca5a5;
  margin: 0;
}

.error-message {
  font-size: 0.85rem;
  color: #64748b;
  max-width: 380px;
  line-height: 1.6;
  margin: 0;
}

.retry-button {
  margin-top: 8px;
  padding: 10px 24px;
  border: 1.5px solid rgba(99, 102, 241, 0.2);
  border-radius: 10px;
  background: rgba(17, 24, 39, 0.7);
  color: #818cf8;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.retry-button:hover {
  background: rgba(99, 102, 241, 0.12);
  border-color: rgba(129, 140, 248, 0.5);
  box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.15);
}

/* --- Empty State (no search results) --- */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  gap: 10px;
  text-align: center;
  background: rgba(17, 24, 39, 0.65);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 16px;
}

.empty-title {
  font-size: 1rem;
  font-weight: 600;
  color: #cbd5e1;
  margin: 0;
}

.empty-hint {
  font-size: 0.82rem;
  color: #64748b;
  margin: 0;
}

/* --- Footer --- */
.footer {
  text-align: center;
  margin-top: 20px;
  font-size: 0.78rem;
  color: #475569;
}

/* --- Responsive --- */
.table-wrapper {
  overflow-x: auto;
}

@media (max-width: 640px) {
  .page {
    padding: 24px 12px 48px;
  }

  .header h1 {
    font-size: 1.5rem;
  }
}

/* --- Fade-in utility --- */
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

---

## File 6: vite.config.js (keep as-is from Vite scaffold)

```js
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

---

## File 7: package.json (auto-generated by Vite - keep as-is)

```json
{
  "name": "lab-mst",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  },
  "devDependencies": {
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.7",
    "@vitejs/plugin-react": "^6.1.1",
    "oxlint": "^1.81.0",
    "vite": "^8.3.0"
  }
}
```

---

## App Flow

```
Page loads
  -> Shows animated loading spinner ("Loading students...")
  -> useEffect fires fetch to https://jsonplaceholder.typicode.com/users
    -> Success -> Renders student table (ID, Name, Username, Email, City)
    -> Failure -> Shows error message + "Try Again" retry button
  -> User types in search -> Table filters live by name (case-insensitive)
    -> No matches -> Shows "No students found"
```

---

## Key React Concepts Used

| Concept              | Where                                       |
|----------------------|---------------------------------------------|
| useState             | students, loading, error, searchText        |
| useEffect            | Fetch data on component mount ([] deps)     |
| async/await          | API fetch inside fetchStudents()            |
| Conditional render   | Loading -> Error -> Table / Empty           |
| .map() with key      | Rendering table rows with student.id        |
| .filter()            | Live search filtering                       |
| .toLowerCase()       | Case-insensitive comparison                 |

---

Made with React + Vite
