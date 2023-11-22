// Call the function
geocodeAndDisplayMap(addressToGeocode);

// Function to geocode an address and then display the map
async function geocodeAndDisplayMap(address) {
  L.mapquest.key = mapKey;

  try {
    // Make a request to the MapQuest Geocoding API
    const response = await fetch(
      `https://www.mapquestapi.com/geocoding/v1/address?key=${mapKey}&location=${address}`
    );

    // Check if the request was successful (status code 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Extract latitude and longitude from the API response
    let location = data.results[0].locations[0].latLng;

    // Initialize the map
    let map = L.mapquest.map("myMap", {
      center: location,
      layers: L.mapquest.tileLayer("map"),
      zoom: 10,
    });

    // Add a custom icon marker at the geocoded location
    let customIcon = L.icon({
      // iconUrl: "https://assets.mapquestapi.com/icon/v2/marker.png",
      iconUrl: "https://cdn-icons-png.flaticon.com/128/2776/2776067.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const marker = L.marker(location, { icon: customIcon }).addTo(map);

    // Add a popup with text
    marker.bindPopup("You'll live here.").openPopup();
  } catch (error) {
    // Handle any errors that may occur during the fetch request
    console.error("Error:", error);
  }
}
