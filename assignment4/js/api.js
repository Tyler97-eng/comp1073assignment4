/* 
    Name: Tyler Elliott
    Student Number: 200345596
    Date: August 4th, 2023
*/

// YouTube API tutorial used: https://medium.com/@cmurphy580/a-quick-walkthrough-of-the-youtube-api-javascript-4f0b0a13f988
// the tutorial would pick a random URL from an array, but I manipulated it to allow the user to get a random video that contains
//    the keyword that they enter which is found in the text input field
// New York Times API tutorial used: https://developer.nytimes.com/docs/articlesearch-product/1/overview
// NYTimes API based on Week 11 class example in order to show multiple APIs functioning; class example did not work, so
//    I basically made my code from scratch with reference to the class code

// store reference to videos section
let videoSpace = document.getElementById('videos');
// store variable with count of 1 to determine which video is being saved
let videoCount = 1;

// store my API key
const YOUTUBE_API_KEY = 'AIzaSyBYCdAM9yU7jJuwIBHcskYkYTjOwPSgNiI';
// store my NY Times API key
const NY_TIMES_API_KEY = "GcAIIVQwiCBkcJsk3vO1J62EQE97LJ2k";

// function to retrieve a youtube video using youtube api and user-defined search term
function getVideo() {
  // get value from text input field
  let getSearchTerm = document.getElementById('searchTerm').value;
  // replace any spaces with URL-friendly %20 text
  let searchTerm = getSearchTerm.replaceAll(' ', '%20');
  // call function and to add article and pass searchTerm as parameter
  appendArticles(searchTerm);
  // create API url connection with user-defined dearch term and my API connection key
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchTerm}&key=${YOUTUBE_API_KEY}`;
  // use fetch function with url to convert url to a JSON
  fetch(url).then(response => response.json()).then(data => {
    // set iframe src value to embedded youtube link with JSON targeting
    document.getElementById('video' + videoCount).src = `https://www.youtube.com/embed/${data.items[0].id.videoId}`;
    // if videoCount is equal to 5, no more videos should be saved so videoCount is reset to 1
    if (videoCount == 5) {
      videoCount = 1;
      // disable submit button and enable enlarge button
      document.getElementById('submit').disabled = true;
      document.getElementById('enlarge').disabled = false;
      // else videoCount is incremented by 1 to store next video
    } else {
      videoCount++;
    }
  });
}

// function to reset stored video sources
function resetVideos() {
  // videoCount reset to 1 for storing first video
  videoCount = 1;
  // enable submit button and disable enlarge button
  document.getElementById('submit').disabled = false;
  document.getElementById('enlarge').disabled = true;
  // for loop to iterate through iframes by index number and reset each src to blank
  for (let i = 1; i < 6; i++) {
    document.getElementById('video' + i).src = '';
  }
  // set src for enlarged video to blank
  document.getElementById('enlarge').src = '';
}

// function to enlarge a video stored in video gallery section
function enlargeVideo() {
  // store the floor of a random number between 1 and 5
  let randomVideo = Math.floor(Math.random() * 6);
  // set the src for the enlarged video to the src of the video determined by the random index value
  document.getElementById('theatre').src = document.getElementById('video' + randomVideo).src;
}

// function to add an article to the New York Times ul
function appendArticles(searchTerm) {
  // create an li, p, and a for storing NY Times articles
  let li = document.createElement('li');
  let p = document.createElement('p');
  let a = document.createElement('a');
  // create article url with searchTerm and my API key
  let article = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchTerm}&api-key=${NY_TIMES_API_KEY}`;
  // use fetch function with url to convert url to a JSON
  fetch(article).then(response => response.json()).then(docs => {
    // try to create an article if one is found
    try {
      // target abstract part of JSON file to GET abstract of article and store in p element
      p.innerText = docs.response.docs[0].abstract;
      // target url part of JSON file to GET url of article and store in a element
      a.href = docs.response.docs[0].web_url;
      // set inner text of a element to clickable link
      a.innerText = 'Visit article';
      // append p with a element
      p.appendChild(a);
      // catch potential errors from search term or API connection issues
    } catch (error) {
      // set p text and set a href to null
      p.innerText = 'No articles found.';
      a.href = null;
      // append p with a element
      p.appendChild(a);
    }
    // append li with p element after storing article info
    li.appendChild(p);
    // append ul with new li element
    document.getElementById('articles').appendChild(li);
  });
}