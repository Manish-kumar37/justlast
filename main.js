import { addEvent, onEventsUpdate } from './firebase.js';

// MapTiler API Key
const apiKey = 'a1hfHdrGhCS1oIvryBVk'; // Your MapTiler API key

// Initialize the map
const map = new maplibregl.Map({
  container: 'map', // Container ID
  style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`, // MapTiler style URL
  center: [72.68, 23.21], // Starting position [lng, lat] (IIT Gandhinagar coordinates)
  zoom: 15, // Starting zoom level
  pitch: 45, // Tilt the map for 3D effect
  bearing: -17.6 // Rotate the map
});

// Add 3D terrain
map.on('load', () => {
  map.addSource('maptiler-dem', {
    type: 'raster-dem',
    url: `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${apiKey}`, // MapTiler terrain tiles
    tileSize: 512,
    maxzoom: 14
  });
  map.setTerrain({ 'source': 'maptiler-dem', 'exaggeration': 1.5 });
});

// Add navigation controls
map.addControl(new maplibregl.NavigationControl());

// Event Creation
document.getElementById('create-event').addEventListener('click', async () => {
  const title = document.getElementById('event-title').value;
  const description = document.getElementById('event-description').value;
  const category = document.getElementById('event-category').value;

  if (title && description && category) {
    await addEvent({
      title,
      description,
      category,
      x: Math.random() * 10 - 5, // Random X position
      y: Math.random() * 10 - 5, // Random Y position
    });

    // Clear form
    document.getElementById('event-title').value = '';
    document.getElementById('event-description').value = '';
    document.getElementById('event-category').value = '';
  }
});

// Real-Time Event Updates
onEventsUpdate((events) => {
  const eventList = document.getElementById('events');
  eventList.innerHTML = '';

  events.forEach(event => {
    // Add event to the list
    const li = document.createElement('li');
    li.className = 'mb-2';
    li.innerHTML = `
      <strong>${event.title}</strong><br>
      <span class="text-sm">${event.description}</span><br>
      <span class="text-xs text-gray-400">${event.category}</span>
    `;
    eventList.appendChild(li);

    // Add marker for event
    new maplibregl.Marker()
      .setLngLat([event.x, event.y])
      .setPopup(new maplibregl.Popup().setHTML(`<h3>${event.title}</h3><p>${event.description}</p>`))
      .addTo(map);
  });
});