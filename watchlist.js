const mainEl = document.querySelector("main")
const emptyWatchlistHtml = mainEl.innerHTML
let movies = []

document.addEventListener("click", e => {
    if(e.target.classList.contains("read-more")){
        const plotEl = e.target.closest("p")
        plotEl.textContent = plotEl.dataset.fullPlot
        plotEl.style.maxHeight = "none"
        e.target.remove()
    }
    
    if(e.target.classList.contains("remove-watchlist-btn")) {
        const movieId = e.target.dataset.movieId                    
        
        if(localStorage.getItem(movieId)){
            localStorage.removeItem(movieId)
            movies.splice(movies.indexOf(movieId), 1)                                    
            
            renderWatchList()
        }                
    }        
})

function getMovies(){
    movies.length = 0

    if(localStorage.length >= 1) {        
        for(let i = 0; i < localStorage.length; i++){        
            movies.push(JSON.parse(localStorage.getItem(localStorage.key(i))))                        
        }        
              
    } else {
        mainEl.innerHTML = emptyWatchlistHtml
    }
}

function renderWatchList(){
    getMovies()
    if(movies.length > 0){
            const watchlistHtml = movies.map(movie => {
        
            const plotLimit = 280                     
            const plotLength = movie.Plot.length
            const genreTitleLimit = 29 
            const genreLength = movie.Genre.length
            const titleLength = movie.Title.length
            const plotLimitEdge = 130
            const plotLimitEdgeTitleGenre = 110
            
            const readMore = `...<span data-full-plot="${movie.Plot}" class="read-more"> Read More</span>`

            const limit = titleLength > genreTitleLimit || genreLength > genreTitleLimit
                ? titleLength > genreTitleLimit && genreLength > genreTitleLimit
                    ? plotLimitEdgeTitleGenre
                    : plotLimitEdge
                : plotLimit

            const plotText = plotLength > limit
                ? movie.Plot.slice(0, limit) + readMore
                : movie.Plot    
                
            return `
            <figure>
                <img src="${movie.Poster}" alt="Poster Image of: ${movie.Title}"/>
                <figcaption>
                    <div class="title-wrapper">
                        <h1>${movie.Title}</h1>
                        <img src="images/starIcon.png" alt="Rating.">
                        <p>${movie.Ratings.slice(0, 1).map(rating => rating.Value).join("").slice(0, -3)}</p>
                    </div>
                    <div class="details-wrapper">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                                            
                        <button class="remove-watchlist-btn" type="button" data-movie-id="${movie.imdbID}">
                            Remove
                            <img src="images/removeIcon.png" alt="Remove from Watchlist." class="remove-watchlist-btn" data-movie-id="${movie.imdbID}"/>
                        </button>
                    </div>                    
                    <p data-full-plot="${movie.Plot}">${plotText}</p>
                </figcaption>
            </figure>          
        `             
        }).join("")
        mainEl.innerHTML = watchlistHtml 
    }        
}

renderWatchList()
