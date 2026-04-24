import { useState } from "react";


export default function SearchPage({ goBack }) {
  const [search, setSearch] = useState("");

  return (
    <div style={{ padding: "10px" }}>
      
      {/* Top bar */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={goBack}>⬅</button>
        
        <input
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      {/* Content */}
      {search === "" ? (
        <div>
          <h3>Trending 🔥</h3>
          <p>Pizza, Burger, Momos...</p>

          <h3>Categories 🍕</h3>
          <button onClick={() => setSearch("pizza")}>Pizza</button>
          <button onClick={() => setSearch("burger")}>Burger</button>
        </div>
      ) : (
        <div>
          <h3>Results for "{search}"</h3>
          {/* yaha filter karke cards dikha */}
        </div>
      )}
    </div>
  );
}

