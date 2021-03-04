// A KEY POINT TO KNOW IN THIS APP IS THAT THE INPUT.VALUE (THE VALUE OF THE SEARCH INPUT)
// IS OUR KEY IDENTIFIER FOR ALL OF THE DATA BEING PASSED AROUND AND FOR LOCAL STORAGE.
// I.E. AFTER YOU SEARCH A POSTER, IT'LL BE STORED BASED ON THE SEARCHED TEXT.
// TO TEST THIS, RUN console.log(localStorage) IN YOUR BROWSERS CONSOLE TO SEE IF YOUR
// SEARCH HAS BEEN STORED SUCCESSFULLY.

// ANOTHER KEY NOTE IS TO LOOK AT THE CONSOLE WHEN TESTING, LOTS OF console.log ARE HAPPENING
// SO THAT YOU CAN TRACK WHERE YOU ARE IN THE PROGRAM.

// linking our config.js file so that we can load our API key into this script as a variable
const API_KEY = config.API_KEY;

// creating the function that attempts to load the poster from localStorage
var loadFromStorage = (searchString) => {
    console.log('in load from storage');
    console.log(searchString)
    // creating the new promise to trigger a success or fail response
    return new Promise((suc, fail) => {
        var storage = localStorage.getItem(searchString)
        // checking to see if storage exists, if it does, succeeds the promise and then
        // creates a data JSON object out of the contents of our search (the data stored within the localStorage).
        if (storage) {
            console.log('in success')
            const data = JSON.parse(storage);
            suc(data)
        // if search does not exist locally, sets the promise to fail and passes
        // the data back to the first .catch after calling loadFromStorage.
        } else {
            console.log('in failure')
            fail(searchString)
        }
    })
}

// this is our main function to fetch via the API.
// this procedure is inside of it's own function so that we could call it if
// loadFromStorage failed. This is called via the .catch(fetchAPI) seen below.
// function starts the fetch, converts the data to json object with the first .then,
// followed by running .then for errorHandler on the data, storeLocally on the data,
// and addPoster on the data. a .catch is put at the end to handle cases
// where the movie doesn't exist from their search. this would've been flagged
// when errorHandler was run on the data. if it is flagged, an alert is run and
// displays the error message
var fetchAPI = () => {
    fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&t=${searchResult()}`)
        .then(res => res.json())
        .then(data => errorHandler(data))
        .then(data => storeLocally(data))
        .then(data => addPoster(data))
        .catch(err => {
            console.log('in error')
            console.log(err);
            alert(err)
    })
}

// this function runs when the fetch attempts to pull the data from the URL above.
// it takes our text typed into the input from the HTML, splits the string into an array
// if there are spaces in the search, and then joins the array back to a string utilizing pluses.
// this is done so that we can match our search input to the way the URL handles spaces.
var searchResult = () => {
    var searchBox = document.getElementById('text');
    console.log(searchBox.value);
    var replaced = searchBox.value.split(' ').join('+');
    console.log(replaced);
    return replaced; 
}

// this function makes loadFromStorage work. when the fetch happens because the data doesn't exist locally,
// storeLocally is called on the data so that we can store the data within localStorage.
// this is done via the localStorage.setItem function. the first parameter is our key for the object, the second
// parameter is our value for the object. in this case, we are locally storing the key by the search input and running
// JSON.stringify on our data to make it a string again and store is as the value for the object.
// finally we return the data so that the data can be passed into the next .then
var storeLocally = (data) => {
    console.log(data);
    var replaced = document.getElementById('text').value.split(' ').join('+');
    console.log(replaced);
    localStorage.setItem(replaced, JSON.stringify(data));
    console.log(localStorage.getItem(replaced));
    return data;
}

// this function takes the response from the data and checks to see if it has the data.Response property set
// to 'False'. this only happens in cases where the movie searched does not exist. in these cases we are
// setting the poster display to none so that it no longer appears and then we are running
// throw new Error(data.error) which creates a error that will be caught by a .catch().
// think of it also like a fail state from a promise.
// if the data.Response is not false, the data is returned so we can work with it in the next .then.
var errorHandler = (data) => {
    console.log(data);
    if (data.Response === 'False') {
        var poster = document.getElementById('poster-img');
        poster.style.display = 'none';
        throw new Error(data.Error)
    } else {
        return data;
    }
}

// this function does some DOM manipulation to set the poster display to block and
// set the data's Poster value to the src of the image. Then it appends the html
// into our document's body.
var addPoster = (data) => {
    console.log(data);
    var poster = document.getElementById('poster-img');
    poster.style.display = 'block';
    poster.src = data.Poster;
    console.log(poster);
    document.body.appendChild(poster)
}

// you'll notice that the functions above appear out of order. this is fine because,
// the functions just need to appear above the actual call of the functions. they will be called
// as the .then's happen

// this function is put in place to work around the fact that clicking 'enter' while in the search input
// refreshes the page. to make this work, you need to delete the <form></form> wrap that is around our search input.
// this function add's an event listener that is listening a 'keyup'. specifically, the key
// it is looking for is the Enter key. Enter's keyCode is '13'. keyCode is depricated but, couldn't find
// a good alternative. if it hears a 'keyup' (key release when you press a key on your keyboard), it'll preventDefault
// for that event and then run a click on our submit button
document.getElementById('text').addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        document.getElementById('submit-btn').click();
    }
})

// this function takes out submit button and add's a click addEventListener that runs all of our code.
// the functions inside are next in a function as the second parameter so that they wait until the click happens.
// loadFromStorage is called first utilizing our searchResult() function. if it succeeds, the data is pulled from
// localStorage (again utilize console.log(localStorage) a lot so that you can see what is being stored).
// continuing in the success state, the data is passed into the first .then after the function is called.
// if loadFromStorage fails, fetchAPI is run and the data is pulled from the API. You can scroll up to where we set
// our fetchAPI function to see what happens from there! essentially, the data is converted to json, checked for errors,
// stored locally and then used to manipulate the DOM to get the poster to show up. if the search is invalid, it alerts
// an error on the page.
document.getElementById('submit-btn').addEventListener('click', () => {
    loadFromStorage(searchResult())
        .catch(fetchAPI)
        .then(data => addPoster(data))

})
