const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// load movies from API
async function loadMovies(searchTerm) {
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=ce0e4ca5`;
    try {
        const res = await fetch(URL);
        const data = await res.json();
        if (data.Response == "True") displayMovieList(data.Search);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function findMovies() {
    let searchTerm = movieSearchBox.value.trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');
        let moviePoster = (movies[idx].Poster != "N/A") ? movies[idx].Poster : "image_not_found.png";

        movieListItem.innerHTML = `
        <div class="search-item-thumbnail">
            <img src="${moviePoster}">
        </div>
        <div class="search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);

        // Add click event listener to each movie item
        movieListItem.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const movieID = movies[idx].imdbID;
            try {
                const result = await fetch(`https://www.omdbapi.com/?i=${movieID}&apikey=ce0e4ca5`);
                const movieDetails = await result.json();
                displayMovieDetails(movieDetails);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        });
    }
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Ratings: ${details.Rated}</li>
            <li class="released">Released: ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writer:</b> ${details.Writer}</p>
        <p class="actors"><b>Actors: </b>${details.Actors}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}</p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}

window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") {
        searchList.classList.add('hide-search-list');
    }
});
