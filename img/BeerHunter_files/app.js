var city = "";
var state = "";
var names = [];
//initMap(city);

let queryPatio = "";
let queryDog = "";
let queryFood = "";
let queryTours = "";
let map = "";

function searchBrewery() {
  $("#mapContainer").removeClass("hide");
  city = $("#cityInput").val();
  state = $("#stateInput").val() || "";

  if ($("#patio").prop("checked")) {
    queryPatio = "&by_tag=patio";
  }

  if ($("#dog").prop("checked")) {
    queryDog = "&by_tag=dog";
  }

  if ($("#food").prop("checked")) {
    queryDog = "&by_tag=food";
  }

  if ($("#tours").prop("checked")) {
    queryDog = "&by_tag=tours";
  }

  var queryUrl = `https://api.openbrewerydb.org/breweries?by_city=${city}&by_state=${state}`;

  $.ajax({
    url: queryUrl,
    method: "GET"
  }).then(function(response) {
    initMap(city);
    renderList(response);
    // pinInMap(response[i]);
  });
}

function renderList(response) {
  // get cream filling
  for (i = 0; i < response.length; i++) {
    if (response[i].phone === "") {
      response[i].phone = "info not available yet";
    }
    if (response[i].website_url === "") {
      response[i].website_url = "no website";
    }

    var brewDiv = $(
      `<div class="cardResults no-touch pointer" data-name="${response[i].name}" data-lat="${response[i].latitude}" data-lon="${response[i].longitude}" data-street="${response[i].street}" id="result">
        <h3>
        ${response[i].name}
        </h3>
        <div>
        ${response[i].street}
        </div>
        </div>
      </div>`
    );

    $("#resultBrew").append(brewDiv);

    pinInMap(response[i]);
    names.push(response[i].name);
  }
  //initPin();
}

function initMap(city) {
  var geocoder = new google.maps.Geocoder();

  var options = {
    center: /* { lat: 0, lng: 0 },*/ { lat: 41.8781, lng: -87.6298 },
    zoom: 11
  };
  //intialize id
  map = new google.maps.Map(document.getElementById("map"), options);

  geocoder.geocode({ address: city ? city : state }, function(results, status) {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
    } //else {
    //alert("Geocode was not successful for the following reason: " + status);
    //}
  });

  $(document).on("click", ".cardResults", function() {
    var place = $(this).attr("data-name");
    var street = $(this).attr("data-street");
    console.log("place", place);

    var icon = {
      url: "./smbottle.png", // url
      scaledSize: new google.maps.Size(12, 34), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };

    function codeAddress() {
      geocoder.geocode({ address: place }, function(results, status) {
        if (status == "OK") {
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: map,
            draggable: false,
            position: results[0].geometry.location,
            icon: icon
          });

          marker.setMap(map);
          var contentString = $(
            '<div class="marker-info-win">' +
              '<span class="info-content">' +
              `<h3 class="marker-heading">${place}</h3>` +
              `${street}` +
              "</span>" +
              '<br/><button name="remove-marker" class="remove-marker" title="Remove Marker">Remove Marker</button>' +
              "</div>"
          );

          //Create an infoWindow
          var infowindow = new google.maps.InfoWindow();

          //set the content of infoWindow
          infowindow.setContent(contentString[0]);

          //add click event listener to marker which will open infoWindow
          google.maps.event.addListener(marker, "click", function() {
            infowindow.open(map, marker); // click on marker opens info window
          });
          var removeBtn = contentString.find("button.remove-marker")[0];
          google.maps.event.addDomListener(removeBtn, "click", function(event) {
            marker.setMap(null);
          });
        }
      });
    }

    codeAddress();
  });
}
var geocoder = new google.maps.Geocoder();
function initPin() {
  for (var j = 0; j < 2; j++) {
    if (j === 1) {
      names = names.splice(9, 10);
      console.log("*******names", names);
    }
    for (i = 0; i < names.length; i++) {
      console.log("loop name", names[i]);

      setTimeout(
        geocoder.geocode({ address: names[i] }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            });

            marker.setMap(map);
            var contentString = $(
              '<div class="marker-info-win">' +
                '<span class="info-content">' +
                `<h3 class="marker-heading"></h3>` +
                "This is a new marker infoWindow" +
                "</span>" +
                "</div>"
            );

            //Create an infoWindow
            var infowindow = new google.maps.InfoWindow();

            //set the content of infoWindow
            infowindow.setContent(contentString[0]);

            //add click event listener to marker which will open infoWindow
            google.maps.event.addListener(marker, "click", function() {
              infowindow.open(map, marker); // click on marker opens info window
            });
          }
        }),
        5000
      );
    }
  }
}

function pinInMap(brewery) {
  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: `${brewery.name}` }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });

      marker.setMap(map);
      var contentString = $(
        '<div class="marker-info-win">' +
          '<span class="info-content">' +
          `<h3 class="marker-heading">${brewery.name}</h3>` +
          `${brewery.street}` +
          "</span>" +
          "</div>"
      );

      //Create an infoWindow
      var infowindow = new google.maps.InfoWindow();

      //set the content of infoWindow
      infowindow.setContent(contentString[0]);

      //add click event listener to marker which will open infoWindow
      google.maps.event.addListener(marker, "click", function() {
        infowindow.open(map, marker); // click on marker opens info window
      });
    }
  });
}

$("#startBtn").click(function() {
  $("html,body").animate(
    {
      scrollTop: $(".searchBox").offset().top
    },
    "slow"
  );
});

$("form").submit(function(event) {
  event.preventDefault();
  $("#resultBrew").html("");
  searchBrewery();
  $("html,body").animate(
    {
      scrollTop: $("#mapContainer").offset().top
    },
    "slow"
  );
});
