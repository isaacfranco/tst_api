export const getOmdbMovie = async (imdbID: string) => {
  try {
    const res = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apiKey=${process.env.OMDB_API_KEY}`)
    
    const json = await res.json()

    if (json.Response === "True") {
      return json;
    } else {
      return null;
    }
    
  } catch(error) {
    return null;
  }
}