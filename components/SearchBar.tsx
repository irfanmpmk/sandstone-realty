// Plain GET form: works without JavaScript and produces shareable URLs.
const select = "w-full rounded-xl bg-white text-ink px-3 py-3 text-sm outline-none";

export default function SearchBar({ areas }: { areas: string[] }) {
  return (
    <form action="/properties" className="grid gap-2 rounded-2xl bg-white/95 p-2 shadow-xl sm:grid-cols-[1fr_1.4fr_1fr_1fr_auto] max-w-4xl">
      <select name="purpose" aria-label="Buy or rent" className={select} defaultValue="sale">
        <option value="sale">Buy</option>
        <option value="rent">Rent</option>
      </select>
      <select name="area" aria-label="Area" className={select} defaultValue="">
        <option value="">All areas</option>
        {areas.map((a) => (
          <option key={a}>{a}</option>
        ))}
      </select>
      <select name="type" aria-label="Property type" className={select} defaultValue="">
        <option value="">Any type</option>
        <option value="apartment">Apartment</option>
        <option value="villa">Villa</option>
        <option value="townhouse">Townhouse</option>
        <option value="penthouse">Penthouse</option>
      </select>
      <select name="beds" aria-label="Bedrooms" className={select} defaultValue="">
        <option value="">Any beds</option>
        <option value="0">Studio</option>
        <option value="1">1 bed</option>
        <option value="2">2 beds</option>
        <option value="3">3 beds</option>
        <option value="4">4+ beds</option>
      </select>
      <button className="rounded-xl bg-sand-600 hover:bg-sand-700 text-white px-6 py-3 text-sm font-semibold">Search</button>
    </form>
  );
}
