Plastic Player
--------------

An NFC based controller for Spotify using the Mopidy Server

Parts
-----

* Raspberry Pi running Musicbox
* Espruino Wifi
* Adafruit 128 x 32 SPI OLED
* PN532 NFC breakout
* 2 x Sanwa Arcade Buttons
* Adafruit half-sized Perma Proto board
* Adafruit Neopixel breadboard
* 3D printed enclosure
* A Pro Spotify account
* NFC Stickers

How it Works
------------

Plastic Player has two main components — A Raspberry Pi running the Musicbox system and an Espruino WiFi based controller. 

The Raspberry Pi manages and plays the music and it's this you'll connect to your stereo system. 

The controller is what you can build with this repo. The controller uses 35mm photographic slides with NFC stickers to play anything on Spotify. This uses an Espruino Wifi board. Of course you don't have to use 35mm slides — it could be anything you can put an NFC sticker onto.

When you power up the Plastic Player the Espruino connects to your WiFi network and pulls down data in the form of a JSON file — I use Airtable as a simple solution but you could use anything, even a flat text file, as long as it's JSON formatted in the correct way. This JSON file contains a list of NFC tag ids with matching Spotify URIs — these are your albums. When you place an album (slide) into Plastic Player, the Espruino sees the NFC tag consults the list of tags in the JSON file.  When it finds a match it sends the corresponding Spotify URI to the Musicbox over wifi and then starts that tracklist playing. Plastick Player also includes controls for play/pause and skip (next track).

Making
------

Install Musicbox on a Raspberry Pi following the instructions on the Musicbox site including entering your Spotify details. Once you have this set up, check you can connect to it via your web browser — usually via musicbox.local. 

That’s all you need to do with the Raspberry Pi. 

Next we’ll setup the Espruino WiFi. 

Install the EspruinoWebIDE via the Chrome web browser following instructions on the Espruino site. 

Download PlasticPlayer.js file from this repo. Edit the file with your WiFi network name and password. 
