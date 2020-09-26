import React, { useState, useRef, useCallback } from 'react'
import useBookSearch from './useBookSearch'

function App() {
  const [query, setQuery] = useState('')
  const [pageNo, setPageNo] = useState(1)
  const { loading, error, books, hasMore } = useBookSearch(query, pageNo)

  const observer = useRef()
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNo((prevPageNo) => prevPageNo + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  return (
    <>
      <h1>Infinite Scrolling Book search</h1>
      <input
        type='text'
        name='title'
        onChange={(e) => {
          setQuery(e.target.value)
          setPageNo(1)
        }}
        value={query}
      />
      <ul>
        {books.map((book, index) => {
          if (books.length === index + 1)
            return (
              <li ref={lastBookElementRef} key={book}>
                {book}
              </li>
            )
          else return <li key={book}>{book}</li>
        })}
      </ul>
      <div style={{ color: 'red' }}>{loading && 'Loading...'}</div>
      <div style={{ color: 'red' }}>{error && 'An Error occured'}</div>
    </>
  )
}

export default App
