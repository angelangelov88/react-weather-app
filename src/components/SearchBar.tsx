type Props = {
  query: string
  onChange: (value: string) => void
  onKeyDown: (evt: React.KeyboardEvent<HTMLInputElement>) => void
}

const SearchBar = ({ query, onChange, onKeyDown }: Props) => (
  <div className="search-box">
    <input
      type="text"
      className="search-bar"
      aria-label="Search for a city"
      placeholder="Search..."
      value={query}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  </div>
)

export default SearchBar
