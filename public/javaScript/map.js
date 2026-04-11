
  const key = mapToken;

  const map = new maplibregl.Map({
    container: 'map', // container id
    style: `https://api.maptiler.com/maps/winter-v2/style.json?key=${key}`, // style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 11// starting zoom
  });


  
  const marker = new maplibregl.Marker({color:'red'})
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new maplibregl.Popup({offset:25}).setHTML(
      `<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`
    )
  )
  .addTo(map);

  