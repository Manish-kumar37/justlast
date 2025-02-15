// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQTLh7OOgnWevpEw7aOWdEDIsqvQqhGX8",
    authDomain: "just-last-9ba4a.firebaseapp.com",
    projectId: "just-last-9ba4a",
    storageBucket: "just-last-9ba4a.firebasestorage.appET",
    messagingSenderId: "889147146648",
    appId: "1:889147146648:web:7cacbc802fff15d7a5ebed"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Function to add an event
  export const addEvent = async (event) => {
    try {
      const docRef = await db.collection('events').add({
        ...event,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('Event added with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding event: ', error);
    }
  };
  
  // Function to listen for real-time updates
  export const onEventsUpdate = (callback) => {
    return db.collection('events').onSnapshot((snapshot) => {
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(events);
    });
  };