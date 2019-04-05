# Upcoming Movies

A backend coding assessment.

Test out the deoployed project at [https://ogilvie-movies.herokuapp.com](https://ogilvie-movies.herokuapp.com)

## The Assignment

Pull data about upcoming movies from the TMDb API and display it to the user. Users should be able to:

- See​ ​a​ ​list​ ​of​ ​upcoming​ ​movies​ ​-​ ​including​ ​the​ ​movies'​ ​name,​ ​poster​ ​or​ ​backdrop​ ​image,​ ​genre​ ​and​ ​release date.​ ​The​ ​list​ ​should​ ​not​ ​be​ ​limited​ ​to​ ​only​ ​the​ ​first​ ​20​ ​movies​ ​as​ ​returned​ ​by​ ​the​ ​API.
- Select​ ​a​ ​specific​ ​movie​ ​to​ ​see​ ​its​ ​details​ ​(name,​ ​poster​ ​image,​ ​genre,​ ​overview​ ​and​ ​release​ ​date).
- Search​ ​for​ ​movies​ ​by​ ​entering​ ​a​ ​partial​ ​or​ ​full​ ​movie​ ​name.

I was instructed to try to keep all the business logic on the back-end, including access to the TMDb API.

Finally, I was encouraged to ​use​ ​any​ ​package/dependency​ ​managers​ ​if​ ​I saw ​fit.

## Architecture

I approached this project with the top prority of getting responses to the user as quickly as possible. To that end, I utilized a database to cache results from the API, which could be updated once daily. 

When the server gets a request for movies, it first checks whether there is an updated cache in the database and sends the first page of results. If there is not a recent cache, the server sends a request to the TMDb API, which sends only twenty records at a time. The server optimizes the data (which I'll discuss below) and immediately sends it back to the client. After sending the response, the server then queries TMDb for all the remaining pages and caches them in the database for use on all subsequent requests.

### Server-side Logic

TMDb movie responses come with a "poster\_path" and an array of "genre\_ids", which both require a separate API call to be useful. The poster path requires a base URL and a size parameter in order to contruct a full image URL. This information came from the TMDb /config endpoint. The genre ids must be matched with strings from the TMDb /genres endpoint in order to be human readable. 

With the goal of keeping the front-end of this application lightweight, I decided to perform all of this logic on the server and deliver full image URLs as well as genre strings with the response. For the sake of speed, I cache all genre and image configuration data in the database, and update it from TMDb once per week.

### Optimizing the Data

In order to keep responses small, and to require minimal data parsing on the front-end, I modified the data from TMDb to be only what was necessary for my application before sending it to the user and caching it in the database. This enabled me to send subsequent responses without performing any further logic. This included building two image URLs (one for large posters and another small posters) and assembling an array of genre strings.

Then I selected only the columns necessary for each endpoint, as follows.

| endpoint(s) | columns |
| --- | --- |
| /movies <br> /movies/search | movie_id, title, genres, poster\_path\_small, release\_date |
| /movies/lookup/:movie_id | movie_id, title, genres, poster\_path\_large, release\_date, overview |

### Front End

I utilized a simple layout for the front end of this application. On page load, a list of upcoming movies is displayed on the left-hand side, and more deails about the first movie in the list are displayed on the right. A search form is in the top left. 

Though I was instructed to keep the front-end simple, I did include a few nice features to make the experience fun for the user.

- I implemented an "infinite scroll" for the movie list. When the user scrolls through the list, the next group of movies is automatically loaded when they reach the bottom, giving the illusion that they can scroll forever. 
- I made a simple CSS animation to indicate network activity. These are presented any time the user initiates an action that could take some time, such as selecting a movie to view or performing a search. This gives the user instant feedback that the application is working on their request.
- I added CSS shadows with a large blur radius to the posters and to the elements in the movie list as well as a gradient to give the movie list the appearance of disappearing behind the search form. These features give the application some depth.

## Assumptions

I needed to make a few decisions about how often to update my cached data with new data from the TMDb API. As per their documentation, once every now and again is plenty for the image configuration data and for the genre list. I chose to update these only once per week. As for the movies themselves, I decided that once per day was appropriate, as release dates don't often change, and new movies would likely not be added more often than that.

## Technologies Used

### Database

I elected to use a Postgres database due to its ability to handle a wide range of datatypes (such as arrays and JSON) as well as case-insensitive pattern matching. This last feature made searching the database by movie title very clean and easy.

### Server

I built server in Node.js using Express and Sequelize. These two packages work very well together, especially in concert with Postgres to deleiver fast responses, using the full capability of ES6 Javascript syntax. Express is a lightweight collection of middleware, which enables the creation of small, clean functions that perform logic on requests and then pass the request to the next function in line, if necessary, until a response is sent to the client. Sequelize is an ORM (Object Relational Mapper) which enables the develper to interact with a database using JavaScript syntax, rather than raw SQL queries and string injection. This makes for very clean, readable code. Sequelize also keeps track of database migrations.

### Front End

I biult the front end of the application in React for several reasons. First, its Virtual DOM delivers blazing fast performance by tracking changes and only updating the necessary components of the actual DOM. Also, React is designed to utilize small, modular components which can be reused throughout the app. This enabled me to reuse the same code for a Poster, for instance, throughout the app. Also, since each component manages its own state, I could protect the global namespace by keeping track of movie titles or serch terms, for example, inside of separate files and classes.


## Build Instructions

In order to build and run this app on your local machine, you will need a bit global enviromnet setup. 

Postgres: `brew install postgresql`

Node: `brew install node`

Once those are in place, you can fork and clone this repository and run the following command in the resulting directory:

`npm install`

In order to run both servers together in your development environment, you'll need to execute the following command: 

`npm run dev`

That's it. Happy hacking!

## Third-Party Packages Used

#### Express, React, Sequelize

These have been discussed at length above.

#### Sequelize-CLI

A command line tool for managing the creation of models and database migrations in Sequelize.

#### Axios

Axios is an incredibly useful library for making HTTP requests. Axios uses Promises for handling asyncronous actions, which can be paired with ES6 async/await syntax for very clean, readable code which behaves predictably.

#### Body-Parser

A necessary extension to Express for extracting the body of HTTP requests.

#### Morgan

A logging tool used in concert with Express. Gives a very clean readout of the requests being made and their subsequent responses.

#### Concurrently

A lightweight tool for running two servers at once. Since this is a self-contained application, I needed to run a front-end server and a back-end server simultaneously in one terminal window.

#### dotenv

Very lightweight package that allows a developer to set up and use environment variables for local development. This makes the transition to a production environment much simpler.