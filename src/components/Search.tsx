import { useState } from "react";

const Search = () => {
    const [query, setQuery] = useState("");

    return (
        <>
            <input
                className="input"
                type="text"
                placeholder="Search.."
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
        </>
    )
}

export default Search;