OMDB API Movie Poster Project

This project utilizes Fetch, thens, catches, and localStorage to pull in data from an API and then use functionality to reduce the amount of pings that are needed to access data.

- Input accepts type to search for a movie
- Titles of two words are more have their spaces converted to +s to be able to be read by the API
- Fetches attempt to load data locally first before actually calling their fetch
- Error handlers are put in place to handle situations where a movie does not exist
- API key is stored in config.js file that is gitignored for security
- Extensive notation in-app to explain thought processes

Technologies used include Asynchronous Javascript, HTML, CSS