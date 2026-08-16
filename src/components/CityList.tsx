import type { GeoCity } from '../hooks/useWeather'

type Props = {
  cities: GeoCity[]
  onSelect: (city: GeoCity) => void
  getCountryName: (code: string) => string
}

const CityList = ({ cities, onSelect, getCountryName }: Props) => (
  <div className="linksContainer">
    {cities.map((city) => (
      <button
        className="linksCities"
        key={`${city.name}-${city.lat}-${city.lon}`}
        onClick={() => onSelect(city)}
      >
        {city.name},{city.state ? ` ${city.state},` : ''} {getCountryName(city.country)}
      </button>
    ))}
  </div>
)

export default CityList
