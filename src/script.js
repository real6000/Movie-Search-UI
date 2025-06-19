document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.trim();
  if (query === '') return;

  // Placeholder — real API coming next
  const results = document.getElementById('results');
  results.innerHTML = `
    <div class="movie-card">
      <h2>Placeholder Movie</h2>
      <p>Results for: <strong>${query}</strong></p>
    </div>
  `;
});
