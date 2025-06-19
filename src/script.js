const apiKey = 'd6e93a1e'; 

window.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const results = document.getElementById('results');

  searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;

    results.innerHTML = '<p style="opacity: 0.6;">Searching...</p>';

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.Response === "False") {
        results.innerHTML = `<p>No results found for "<strong>${query}</strong>"</p>`;
        return;
      }

      results.innerHTML = '';

      data.Search.forEach(movie => {
        const poster = movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image';
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
          <img src="${poster}" alt="${movie.Title}" />
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>
        `;
        results.appendChild(card);
      });

    } catch (err) {
      console.error(err);
      results.innerHTML = `<p>Something went wrong. Try again later.</p>`;
    }
  });
});