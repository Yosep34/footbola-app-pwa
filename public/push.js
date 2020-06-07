const webPush = require('web-push');

const vapidKeys = require('./vapid.json');

webPush.setVapidDetails(
	'mailto:yosepalexsander9@gmail.com',
	vapidKeys.publicKey,
	vapidKeys.privateKey
)

const pushSubcription = {
	"endpoint": "https://fcm.googleapis.com/fcm/send/eTrYJv1yvQg:APA91bFwONlth2W4fXiApPjrUfU_5Jyj7pFIExskQGFtZCW3yNtAv6Tp_a6hEz9mwQUzxFCUqJXbkFw5IYBEyvpBs3fBKmpCOBWOfukElWgnyE3QpvGCPUydt2xSKJfRZnlAliK9eJwe",
	"keys": {
		"p256dh": "BMT77Xo/FSgpo+DHmt5aVvPLSMT7QdSKiNQAcxxfAxKbh/FGzUAmN504HgSP/wntrI9Ug3WrJXwARRALIMcgy4k=",
		"auth": "9WFSnbl0JfP0gV76gSn58w=="
	}
};

const payload = "Welcome to The Jungle!";

const options = {
	gcmAPIKey: '353025492412',
	TTL: 60
};

webPush.sendNotification(
	pushSubcription,
	payload,
	options
);