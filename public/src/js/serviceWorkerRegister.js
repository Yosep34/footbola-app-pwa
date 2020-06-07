if ('serviceWorker' in navigator) {
	window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
			console.log('Registration success');
			requestPermission();
    } catch (err) {
      console.log('Registration failed', err);
    }
  });
} else {
  console.log('sw not supported');
}

// create notification permission request
const requestPermission = () => {
	if('Notification' in window) {
		Notification.requestPermission().then(result => {
			if(result === 'denied') {
				console.log('Notification feature not permitted');
				return;
			} else if(result === 'default') {
				console.error('user close request dialog box ');
				return;
			}

			if (('PushManager' in window)) {
				navigator.serviceWorker.getRegistration()
				.then(registration => {
					registration.pushManager.subscribe({
						userVisibleOnly: true,
						applicationServerKey: urlBase64Toint8Array("BNag2qc7Wo4owLFkSTNQIu7l5_i2IfLBMEP3KLmgqQN2FHmdb2vpfthqZkJUc8xcgsg-pdY1lZFCmAksPsoQKE0"),
					}).then(subscribe => {
						console.log('subscribe success with endpoint:', subscribe.endpoint);
						console.log('p256dh key:', btoa(String.fromCharCode.apply(
							null, new Uint8Array(subscribe.getKey('p256dh')))));
						console.log('auth key:', btoa(String.fromCharCode.apply(
							null, new Uint8Array(subscribe.getKey('auth')))));
					})
					.catch( err => {
						console.error('Cannot subscribe', err.message);
					});
				})
			}
		});
	}
};

const urlBase64Toint8Array = (base64String) => {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
	.replace(/-/g, '+')
	.replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for(let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
