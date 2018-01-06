// Foursquare API Info
const clientId = 'X300CL4Y4M1F3QT1AAOSQPX4PTEIIRQIEV40Z04EHJVULQ3Y';
const clientSecret = 'PAYRGKI4BBCH5UCET0JJGDH2YENOV3CDNWNDNB20Y4CXS1BQ';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';
const imgPrefix = 'https://igx.4sqi.net/img/general/150x200';

// APIXU Info
const apiKey = '8403fec3c61c4b428b0145310180501';
const forecastUrl = 'https://api.apixu.com/v1/forecast.json?key=';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4"), $("#venue5"), $("#venue6"), $("#venue7"), $("#venue8"), $("#venue9"), $("#venue10")];
const $weatherDivs = [$("#weather1"), $("#weather2"), $("#weather3"), $("#weather4"), $("#weather5"), $("#weather6"), $("#weather7")];
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// AJAX functions
async function getVenues() {
  const city = $input.val();
  const urlToFetch = url + city + '&venuePhotos=1&limit=10&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20170305';
  try {
    let response = await fetch(urlToFetch);
    if(response.ok) {
      let jsonResponse = await response.json();
      console.log(jsonResponse);
      let venues = jsonResponse.response.groups[0].items.map(location => location.venue);
      console.log(venues);
      return venues;
    }
    throw new Error('Venue request failed!');
  } catch (error) {
    console.log(error);
  }
}

async function getForecast() {
  const urlToFetch = forecastUrl + apiKey + '&q=' + $input.val() + '&days=7';
  try {
    let response = await fetch(urlToFetch);
    if(response.ok) {
      let jsonResponse = await response.json();
      console.log(jsonResponse);
      let days = jsonResponse.forecast.forecastday;
      console.log(days);
      return days;
    }
    throw new Error('Forecast request failed!');
  } catch (error) {
    console.log(error);
  }
}

// Render functions
function renderVenues(venues) {
  $venueDivs.forEach(($venue, index) => {
    let venueContent =
      '<h2>' + venues[index].name + '</h2>' +
      '<p> Rating: ' + venues[index].rating + '</p>' +
      '<img class="venueimage" src="' + imgPrefix +
      venues[index].photos.groups[0].items[0].suffix + '"/>' +
      '<h3>Address:</h3>' +
      '<p>' + venues[index].location.address + '</p>' +
      '<p>' + venues[index].location.city + '</p>' +
      '<p>' + venues[index].location.country + '</p>';
    $venue.append(venueContent);
  });
  $destination.append('<h2>' + venues[0].location.city + '</h2>');
}

function renderForecast(days) {
  $weatherDivs.forEach(($day, index) => {
    let weatherContent =
       '<h2> Sunrise: ' + days[index].astro.sunrise +
       '<h2> High: ' + days[index].day.maxtemp_f +
      '</h2>' + '<h2> Low: ' + days[index].day.mintemp_f +
      '</h2>' + '<h2> Total Precipitation: ' + days[index].day.totalprecip_in +
      '</h2>' + '<img src="http://' +  days[index].day.condition.icon + '" class="weathericon" />' +
      '<h2> Sunset: ' + days[index].astro.sunset +
      '<h2> Humidity: ' + days[index].day.avghumidity +
      '<h2>' + weekDays[(new Date(days[index].date)).getDay()] + '</h2>';
    $day.append(weatherContent);
  });
}

function executeSearch() {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDivs.forEach(day => day.empty());
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues => renderVenues(venues));
  getForecast().then(forecast => renderForecast(forecast));
  return false;
}

$submit.click(executeSearch)
