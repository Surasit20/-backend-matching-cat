var sendNotification = function (data) {
  var headers = {
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: 'Basic YjNlZGYyZjktYWU1Ni00YjQ0LTk3MjUtZjc1OTYwODE3OGJh',
  };

  var options = {
    host: 'onesignal.com',
    port: 443,
    path: '/api/v1/notifications',
    method: 'POST',
    headers: headers,
  };

  var https = require('https');
  var req = https.request(options, function (res) {
    res.on('data', function (data) {
      console.log('Response:');
      console.log(JSON.parse(data));
    });
  });

  req.on('error', function (e) {
    console.log('ERROR:');
    console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
};

exports.sendNotificationToDevice = (data) => {
  console.log('11111111111111');
  console.log(data);
  var message = {
    app_id: '8fa198de-5027-4d40-a347-4ff7e8ad0c5f',
    contents: { en: data.content },
    included_segments: ['included_player_ids'],
    //channel_for_external_user_ids: 'push',
    //include_player_ids: ['1'],
    channel_for_external_user_ids: 'push',
    include_external_user_ids: data.userId,
    contents_available: true,
    data: {
      PushTitle: 'มีการแจ้งเตือน',
    },
  };

  sendNotification(message);
};
/*
console.log('11111111111111');
//console.log(data);
var message = {
  app_id: '8fa198de-5027-4d40-a347-4ff7e8ad0c5f',
  contents: { en: 'testนะครับ' },
  included_segments: ['included_player_ids'],
  //channel_for_external_user_ids: 'push',
  //include_player_ids: ['1'],
  channel_for_external_user_ids: 'push',
  include_external_user_ids: ['arm@gmail.com'],
  contents_available: true,
  data: {
    PushTitle: 'มีการแจ้งเตือน',
  },
};

sendNotification(message);
*/
