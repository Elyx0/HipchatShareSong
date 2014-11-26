 //To run:
//      $ node example.js [your-hipchat-api-key] [email of target hipchat account]
var Hipchatter = require('hipchatter'),
    applescript = require("applescript");

//pass the constructor a config object with your key
var key = process.argv[2];
var target = process.argv[3];
var hipchatter = new Hipchatter(key);

if (key === undefined || target === undefined) {
    console.error('Please include your API key and Notification API key as command line arguments.');
    console.error('eg. node example.js 123456789abcdef bob@dailymotion.com');
    process.exit(1);
}

var lastDate = null,
    lastPlayed = false,
    toPlay = null;

 var checkMessages = function(){
    hipchatter.history_user(target,function(err, msgs){
           if(!err)
           {
            msgs.items.forEach(function(e){
                if (e.message_links && e.message_links[0].url.match(/open\.spotify\.com/))
                {
                    var msg_time = new Date(e.date);
                    if (msg_time >= lastDate)
                    {
                        var link = e.message_links[0].url;
                        toPlay = link;
                    }
                    lastDate = msg_time;
                }
            });
            if (toPlay && (lastPlayed != toPlay))
            {
                lastPlayed = toPlay;
                console.log('Playing: ' + toPlay);
                var script = 'tell application "Spotify" to play track "' + toPlay + '"';

                applescript.execString(script, function(err, rtn) {
                  if (err) {
                    // Something went wrong!
                    console.log(err);
                  }
                  if (Array.isArray(rtn)) {
                    rtn.forEach(function(songName) {
                      console.log(songName);
                    });
                  }
                });
            }
           }
           setTimeout(checkMessages, 10000);
       });
};

 checkMessages();