import axios from "axios";

export async function geocodeAddress(address) {
  const apiKey = process.env.MAPQUEST_KEY;
  try {
    // fetch data from api address
    const response = await axios.get(
      `https://www.mapquestapi.com/geocoding/v1/address?key=${apiKey}&location=${address}`
    );

    // Extract latitude and longitude
    const location = response.data.results[0].locations[0].latLng;

    // save the latitude and longitude
    let geometry = { type: "Point", coordinates: [location.lng, location.lat] };
    return geometry;
  } catch (error) {
    console.log(`Error geocoding address: ${error.message}`);
  }
}

