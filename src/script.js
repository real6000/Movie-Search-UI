const apiKey = 'd6e93a1e'; 

window.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const results = document.getElementById('results');
  const viewWatchlistBtn = document.getElementById('viewWatchlistBtn');

  const pagination = document.getElementById('pagination');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageInfo = document.getElementById('pageInfo');

  let currentPage = 1;
  let totalResults = 0;
  let currentQuery = '';

  async function fetchMovies(query, page = 1) {
    results.innerHTML = '<p style="opacity: 0.6;">Searching...</p>';
    try {
      const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}&page=${page}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.Response === "False") {
        results.innerHTML = `<p>No results found for "<strong>${query}</strong>"</p>`;
        pagination.style.display = 'none';
        return;
      }

      totalResults = parseInt(data.totalResults, 10);
      results.innerHTML = '';
      pagination.style.display = 'flex';

      data.Search.forEach(movie => {
        const poster = movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image';
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
          <img src="${poster}" alt="${movie.Title}" />
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>
        `;

        card.addEventListener('click', async () => {
          try {
            const res = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
            const detail = await res.json();

            results.innerHTML = `
              <div class="movie-details">
                <img src="${detail.Poster !== "N/A" ? detail.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${detail.Title}" />
                <div class="info">
                  <h2>${detail.Title} (${detail.Year})</h2>
                  <p><strong>Genre:</strong> ${detail.Genre}</p>
                  <p><strong>Director:</strong> ${detail.Director}</p>
                  <p><strong>Actors:</strong> ${detail.Actors}</p>
                  <p><strong>Plot:</strong> ${detail.Plot}</p>
                  <button id="addWatchlistBtn">⭐ Add to Watchlist</button>
                  <button id="backBtn">⬅ Back to results</button>
                </div>
              </div>
            `;

            document.getElementById('backBtn').addEventListener('click', () => {
              fetchMovies(currentQuery, currentPage);
              updatePaginationButtons();
            });

            document.getElementById('addWatchlistBtn').addEventListener('click', () => {
              let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

              if (!watchlist.find(m => m.imdbID === detail.imdbID)) {
                watchlist.push(detail);
                localStorage.setItem('watchlist', JSON.stringify(watchlist));
                alert(`${detail.Title} added to your watchlist!`);
              } else {
                alert(`${detail.Title} is already in your watchlist.`);
              }
            });

          } catch (err) {
            console.error(err);
            results.innerHTML = `<p>Error loading movie details.</p>`;
          }
        });

        results.appendChild(card);
      });

      pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(totalResults / 10)}`;
      updatePaginationButtons();

    } catch (err) {
      console.error(err);
      results.innerHTML = `<p>Something went wrong. Try again later.</p>`;
      pagination.style.display = 'none';
    }
  }

  function updatePaginationButtons() {
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= Math.ceil(totalResults / 10);
  }

  searchBtn.addEventListener('click', () => {
    currentQuery = searchInput.value.trim();
    if (!currentQuery) return;
    currentPage = 1;
    fetchMovies(currentQuery, currentPage);
  });

  searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchMovies(currentQuery, currentPage);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < Math.ceil(totalResults / 10)) {
      currentPage++;
      fetchMovies(currentQuery, currentPage);
    }
  });

  // Watchlist button logic
  viewWatchlistBtn.addEventListener('click', () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    results.innerHTML = '';
    pagination.style.display = 'none';

    if (watchlist.length === 0) {
      results.innerHTML = '<p>Your watchlist is empty.</p>';
      return;
    }

    watchlist.forEach(movie => {
      const poster = movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image';
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img src="${poster}" alt="${movie.Title}" />
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      `;

      card.addEventListener('click', async () => {
        try {
          const res = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
          const detail = await res.json();

          results.innerHTML = `
            <div class="movie-details">
              <img src="${detail.Poster !== "N/A" ? detail.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${detail.Title}" />
              <div class="info">
                <h2>${detail.Title} (${detail.Year})</h2>
                <p><strong>Genre:</strong> ${detail.Genre}</p>
                <p><strong>Director:</strong> ${detail.Director}</p>
                <p><strong>Actors:</strong> ${detail.Actors}</p>
                <p><strong>Plot:</strong> ${detail.Plot}</p>
                <button id="backBtn">⬅ Back to watchlist</button>
              </div>
            </div>
          `;

          document.getElementById('backBtn').addEventListener('click', () => {
            viewWatchlistBtn.click();
          });

        } catch {
          results.innerHTML = '<p>Error loading movie details.</p>';
        }
      });

      results.appendChild(card);
    });
  });
});
