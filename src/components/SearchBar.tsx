import { useRef } from 'react'

type Props = {
  query: string
  onChange: (value: string) => void
  onKeyDown: (evt: React.KeyboardEvent<HTMLInputElement>) => void
}

const SearchBar = ({ query, onChange, onKeyDown }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') inputRef.current?.blur()
    onKeyDown(evt)
  }

  return (
    <div className="search-box">
      <input
        ref={inputRef}
        type="text"
        className="search-bar"
        aria-label="Search for a city"
        placeholder="Search..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}

export default SearchBar
