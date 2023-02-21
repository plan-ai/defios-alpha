import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyAzuTfksri5VmDaMzKYD5JDKjHPh6YxFnI',
  authDomain: 'defios-grizzlython.firebaseapp.com',
  projectId: 'defios-grizzlython',
  storageBucket: 'defios-grizzlython.appspot.com',
  messagingSenderId: '378519671126',
  appId: '1:378519671126:web:b96b81bbdcad9850ed86f7',
  measurementId: 'G-1JWJQCDTKJ',
};

const app = initializeApp(firebaseConfig);

function requestPermission() {
  console.log('Requesting permission...');
  if (!process.browser) return;
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      const messaging = getMessaging(app);
      getToken(messaging, {
        vapidKey:
          'BIsvrL32NIA9gMI-yZqPYoCQbE9LHABPvpP4PJtP5az-t8VFi0tQ0sXqsgMKrZkP4W00JGTo42qB7dE2eZBaSJs',
      }).then((currentToken) => {
        if (currentToken) {
          sessionStorage.setItem('browser-notif-token', currentToken);
        } else {
          console.log('Can not get token');
        }
      });
    } else {
      console.log('Do not have permission!');
    }
  });
}

requestPermission();
