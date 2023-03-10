// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: 'AIzaSyAzuTfksri5VmDaMzKYD5JDKjHPh6YxFnI',
  authDomain: 'defios-grizzlython.firebaseapp.com',
  projectId: 'defios-grizzlython',
  storageBucket: 'defios-grizzlython.appspot.com',
  messagingSenderId: '378519671126',
  appId: '1:378519671126:web:b96b81bbdcad9850ed86f7',
  measurementId: 'G-1JWJQCDTKJ',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
