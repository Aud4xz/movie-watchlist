const key = import.meta.env.VITE_OMDB_KEY
const mainEl = document.querySelector("main")
const startHtml = mainEl.innerHTML
let searchedMoviesIds = []
let watchlist = []
let searchedMoviesList = []

document.addEventListener("click", async (e) => {
                
    if (e.target.id === "search-btn") {
        searchedMoviesList.length = 0
        
        const searchValue = document.querySelector("input[name=movie-name]").value
        mainEl.innerHTML = ""
        e.preventDefault()
        
        if(searchValue != ""){
            const res = await fetch(`https://www.omdbapi.com/?apikey=${key}&s=${searchValue}`)
            const data = await res.json()

            if(data.Search){
                searchedMoviesIds = data.Search.map(movie => {
                    return movie.imdbID
                }).slice(0,10)                    
                renderMovies()
            } else {
                                
                const div = document.createElement("div")
                const h1 = document.createElement("h1")
                
                
                div.classList.add("no-results")
                div.append(h1)
                
                h1.textContent = "Unable to find what you're looking for. Please, try another search"
                
                mainEl.append(div)                                                
            }
        } else {
            mainEl.innerHTML = startHtml
        }       

    }
    
    if(e.target.classList.contains("read-more")){
        const plotEl = e.target.closest("p")
        plotEl.textContent = plotEl.dataset.fullPlot
        plotEl.style.maxHeight = "none"
        e.target.remove()
    }
                    
    if(e.target.classList.contains("watchlist-btn")) {
        const movieId = e.target.dataset.movieId                    
        
        if(!localStorage.getItem(movieId)){
            localStorage.setItem(movieId, JSON.stringify(searchedMoviesList.find(movie => movieId === movie.imdbID)))
            console.log("The movie was added to your watchlist")
        } else {
            console.log("This movie is already saved in your watchlist.")
        }
    }
    
    if(e.target.id === "watchlist"){
        renderWatchList()
    }          
})

async function renderMovies(){
    if(searchedMoviesIds){
        const moviePromises = searchedMoviesIds.map(async movieId => {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${key}&i=${movieId}`)
            return await res.json()
            })
            
            const movies = await Promise.all(moviePromises)
            searchedMoviesList = movies
            const movieCards = movies.map(movie => {
                
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
                                            
                        <button class="watchlist-btn" type="button" data-movie-id="${movie.imdbID}">
                            Watchlist
                            <img src="images/addIcon.png" alt="Add to Watchlist." class="watchlist-btn" data-movie-id="${movie.imdbID}"/>
                        </button>
                    </div>                    
                    <p data-full-plot="${movie.Plot}">${plotText}</p>
                </figcaption>
            </figure>                                        
            `                        
            })
            
                                                           
        document.querySelector("main").innerHTML += movieCards.join("")  

    }
}

