var WIFI_NAME = "<NETWORK NAME>";
var WIFI_OPTIONS = { password : "<PASSWORD>" };
var PATH_TO_DATA = "<WEB ADDRESS OF YOUR JSON DATA>"
var host = "<IP ADDRESS OF RASPBERRY PI>";
var isPlaying = true;
var uris = [];
var nfc;
var g;
var spi;
var currentId = "";
var foundCard = false;
var timer;
var isReady = false;
var HTTP;
var NE0PIXEL;

pinMode(B1, 'input_pulldown');

pinMode(B14, 'input_pulldown');


function onCheckPlayState(data){
  console.log(data);
  if (data.result == "playing") {
        isPlaying = true;
      } else {
        isPlaying = false;
      }
  setLEDColor();
}

function onGetTitle(data){
  console.log(data);
  if (data.result.name !== null){
  g.clear();
   g.drawString(data.result.name,0,0);
var artist = JSON.stringify(data.result.artists[0]);
console.log(artist);
   artist = JSON.parse(artist);
 g.drawString(artist.name,0,10);
 g.flip();
  setLEDColor();
  } else {
    g.clear();
    g.drawString("Plastic Player",0,0);
    g.flip();
    
  }
}

function onCommand(data) {
  console.log(data);
}

function start(){
 g.clear();
 g.drawString("Connecting to network",0,0);
 g.flip(); 

}

function setup(){
  HTTP = require("http");
  NEOPIXEL = require("neopixel");
  require("neopixel").write(B15, [0,0,0]);
  I2C2.setup({scl:B10, sda:B3});

 nfc = require("PN532").connect(I2C2);
  console.log(nfc.getVersion());
   nfc.SAMConfig();
  
 
 setInterval(function() {
 
 nfc.findCards(function(card) {
 // print("Found card "+card);
  card = JSON.stringify(card);
  checkCard(card); 
   return;
 });
 
}, 1000);

  
  spi = new SPI();
  spi.setup({mosi: B6 /* D1 */, sck:B5 /* D0 */});
  g = require("SSD1306").connectSPI(spi, A0 /* DC */, B7, start,{ height : 32 });
}

function isCardInDatabase(id){


  for (var i=0; i < uris.length; i++){
    
    var record = uris[i];
    if (record.tag == id ) {
	    return record;
    }
  }
	return false;

}


function checkCard(id) {
  if (uris.length < 1) {
    getDatabase();
  } else {
  var record = isCardInDatabase(id);
  if (record !== false && currentId != id){
      currentId = id;
      changeTracklist(record.uri);
  }
  
  if (record === false) {
    g.clear();
    g.drawString(id,0,0);
    g.flip();
  }
  }
  
}



function startWifi(){
  NEOPIXEL.write(B15, [255,255,0]);
  var wifi = require("EspruinoWiFi");
  wifi.connect(WIFI_NAME, WIFI_OPTIONS, function(err) {
  if (err) {
    digitalWrite(LED1,1);
      g.clear();
     g.drawString("Connection error: "+err,0,0);
     g.flip(); 
    console.log("Connection error: "+err);
    return;
  }
    require("neopixel").write(B15, [255,0,0]);
  console.log("Connected!");
   g.clear();
   g.drawString("Connected to "+WIFI_NAME,0,0);
   g.flip();
  digitalWrite(LED2,1);
  getDatabase();
    //initPlayer();
    
});
}


function initPlayer(){
sendData("core.playback.get_state",null,function(data){  
  if (data.result == "playing") {
        isPlaying = true;
      } else {
        isPlaying = false;
      }
  setLEDColor();
   g.clear();
   g.drawString("Plastic Player",0,0);
   g.flip();
  //sendData("core.playback.get_current_track",null,onGetTitle);
 });


}





function mopidyCommand(method,params) {
  var body = {
    method: method,
    id:1,
    jsonrpc:"2.0"
  };
  
  if (params !== null){
    
    body.params = {
    uri: params
    };
  }
  
  body = JSON.stringify(body);
  
  return body;
}

function playRandomUri(){
   var selection = uris[Math.floor(Math.random() * uris.length)];
   console.log(selection.uri);
   changeTracklist(selection.uri);
}

function getDatabase() {
   g.clear();
   g.drawString("Requesting Database...",0,0);
   g.flip();
var finalData ="";
  var req = HTTP.get(PATH_TO_DATA, function(res) {
    res.on('data', function(data) {
     finalData += data;
    });
    res.on('close', function(data) {
      uris = [];
      console.log(finalData);
      var json = JSON.parse(finalData);
      for (var i=0; i < json.records.length; i++){
        var record = json.records[i].fields;
        uris.push(record);
      }
   // console.log(uris);
   g.clear();
   g.drawString(json.records.length+ " records read",0,0);
   g.flip();
   initPlayer();
      console.log("Airtable Connection closed");
    });
  });
  
  req.on('error',function(err){
    console.log('error >'+err.message);
     g.clear();
   g.drawString("database: "+err.message,0,0);
   g.flip();
    
   
  });
  
  req.end();
  console.log("Airtable Request sent");  
}


function sendData(method,params,callback) {
  var finalData ="";
  var body = mopidyCommand(method,params);
  var options = {
    host: host, 
    port: 80,
    path: '/mopidy/rpc',
    method: 'POST',
    headers: { "Content-Type" : "application/json",
             "Content-Length": body.length} 
  };
  
  var req = HTTP.request(options, function(res) {
    res.on('data', function(data) {
      finalData += data;
     
    });
    res.on('close', function(data) {
      var obj = JSON.parse(finalData);
      callback(obj);
      console.log("Connection closed");
      
    });
  });
  
  req.on('error',function(err){
    console.log("request error> "+err.message);
    g.clear();
    g.drawString("Mopidy: " +err.message,0,0);
    g.flip();
   // callback(err);
    //req = null;
  });
  
  req.end(body);  
  //console.log("Request sent");  
}


function changeTracklist(uri) {
  console.log("Change");
  if (uri !== "") {
	  g.clear();
	  g.drawString("Changing tracklist...",0,0);
	  g.flip();
     NEOPIXEL.write(B15, [255,255,0]);
  sendData("core.tracklist.clear",null,function(e){
   console.log(e);
    NEOPIXEL.write(B15, [0,0,255]);
    sendData("core.tracklist.add",uri,function(d){
      NEOPIXEL.write(B15, [255,0,0]);
      console.log(d);
      sendData("core.playback.play",null,function(f){
      
      sendData("core.playback.get_current_track",null,onGetTitle);
      });
    });
  });
  }
}
function getPage() {
  require("http").get("http://httpbin.org/ip", function(res) {
    console.log("Response: ",res);
    res.on('data', function(d) {
      console.log("--->"+d);
    });
  });
}

function setLEDColor(){
  if (isPlaying) {
     NEOPIXEL.write(B15, [100,100,100]);
  } else {
     NEOPIXEL.write(B15, [0,255,0]);
  }
}

function togglePlay(){
   if (isPlaying) {
      isPlaying = false;
      sendData("core.playback.pause",null,onCommand);
    } else {
      isPlaying = true;
      sendData("core.playback.resume",null,function(d){ sendData("core.playback.get_current_track",null,onGetTitle);});
     
    }
  setLEDColor();
}

setWatch(function(e) {
  togglePlay();
}, B1, { repeat: true, edge: 'rising',debounce: 100 });

setWatch(function(e) {
   sendData("core.playback.next",null,function(e){
   sendData("core.playback.get_current_track",null,onGetTitle);
   });
}, B14, { repeat: true, edge: 'rising',debounce: 100 });


console.log = function(){};

setup();
startWifi();

