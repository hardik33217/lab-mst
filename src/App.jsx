import { useState, useEffect } from 'react'
import './App.css'

// API endpoint — JSONPlaceholder provides 10 fake user records
const API_URL = 'https://jsonplaceholder.typicode.com/users'

function App() {
  // ──────────────────────────────────────────────
  // useState hooks — manage component state
  // ──────────────────────────────────────────────

  // Stores the array of student records fetched from the API
  const [students, setStudents] = useState([])

  // Tracks whether the API request is in progress
  const [loading, setLoading] = useState(true)

  // Stores any error message if the API request fails
  const [error, setError] = useState(null)

  // Stores the current search input for live filtering
  const [searchText, setSearchText] = useState('')

  // ──────────────────────────────────────────────
  // useEffect — fetch data when the component mounts
  // The empty dependency array [] means this runs only once on mount.
  // ──────────────────────────────────────────────
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

      // Check if the response status is OK (200–299)
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

  // ──────────────────────────────────────────────
  // Live search filtering — case-insensitive
  // Filters the students array by matching the name field
  // against the current search text, recalculated on every render.
  // ──────────────────────────────────────────────
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchText.toLowerCase())
  )

  // ──────────────────────────────────────────────
  // Render: Loading State
  // Shows an animated spinner while waiting for the API
  // ──────────────────────────────────────────────
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

  // ──────────────────────────────────────────────
  // Render: Error State
  // Shows a friendly error message with a retry button
  // ──────────────────────────────────────────────
  if (error) {
    return (
      <div className="page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Failed to load students</h2>
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={fetchStudents}>
            ↻ Try Again
          </button>
        </div>
      </div>
    )
  }

  // ──────────────────────────────────────────────
  // Render: Main content — search bar + student table
  // ──────────────────────────────────────────────
  return (
    <div className="page">
      {/* Page header */}
      <header className="header">
        <h1>📚 Student Records</h1>
        <p className="subtitle">
          Browse and search student profiles fetched from a REST API
        </p>
      </header>

      {/* Live search input — updates searchText on every keystroke */}
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
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
          <div className="empty-icon">🔍</div>
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
                    <span className="city-badge">📍 {student.address.city}</span>
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

// ──────────────────────────────────────────────
// Helper: highlight the search term within a name
// Wraps the matched substring in a <mark> element
// ──────────────────────────────────────────────
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
