Plastic Player
--------------

![Image of Plastic Player showing John Coltrane being played](plasticplayer.jpg?raw=true)

An NFC based controller for Spotify using the Mopidy Server

Parts
-----

* Raspberry Pi running [ Pi Musicbox ](http://www.pimusicbox.com)
* [ Espruino Wifi ](https://www.espruino.com)
* Adafruit [ 128 x 32 SPI OLED ](https://www.adafruit.com/product/661)
* [ PN532 NFC breakout ](https://www.espruino.com/PN532)
* 2 x [ Sanwa Arcade Buttons ](https://www.arcadeworlduk.com/products/Sanwa-OBSC-24-C-Arcade-Button.html)
* [ Adafruit half-sized Perma Proto board ](https://www.adafruit.com/product/571)
* [ Adafruit Neopixel breadboard ](https://www.adafruit.com/product/1558)
* 3D printed enclosure (available on this repo)
* A Pro Spotify account
* [ NFC Stickers ](http://zipnfc.com/nfc-stickers/nfc-sticker-midas-tiny-ntag213.html)
* 35mm Blank Slides - via Ebay or other suppliers

How it Works
------------

Plastic Player has two main components — A Raspberry Pi running the Musicbox system and an Espruino WiFi based controller. 

The Raspberry Pi manages and plays the music and it's this you'll connect to your stereo system. 

The controller is what you can build with this repo. The controller uses 35mm photographic slides with NFC stickers to play anything on Spotify. This uses an Espruino Wifi board. Of course you don't have to use 35mm slides — it could be anything you can put an NFC sticker onto.

When you power up the Plastic Player the Espruino connects to your WiFi network and pulls down data in the form of a JSON file — I use Airtable as a simple solution but you could use anything, even a flat text file, as long as it's JSON formatted in the correct way. This JSON file contains a list of NFC tag ids with matching Spotify URIs — these are your albums. When you place an album (slide) into Plastic Player, the Espruino sees the NFC tag consults the list of tags in the JSON file.  When it finds a match it sends the corresponding Spotify URI to the Musicbox over wifi and then starts that track list playing. Plastic Player also includes controls for play/pause and skip (next track).

Raspberry Pi
------------

Install Musicbox on a Raspberry Pi following the instructions on the Musicbox site including entering your Spotify details. Once you have this set up, check you can connect to it via your web browser — usually via musicbox.local. 

Make sure to note down the ip address of the Raspberry Pi as you'll need to enter this in the code for Espruino later. You can find this out via the Terminal by typing 'ping musicbox.local'. This will show the ip address of the Raspberry Pi you have running Musicbox.

That’s all you need to do with the Raspberry Pi. 


Espruino
--------

Solder the Espruino board in the centre of the Perma-Proto board.

Solder the components to the Espruino using the following pin connections.

| OLED | Espruino Wifi |
|------|---------------|
| CS   | GND           |
| RST  | b7            |
| DC   | a0            |
| CLK  | b5            |
| DATA | b6            |
| 3.3  | 3.3           |
| GND  | GND           |


Neo Pixel

+				            3.3
G				            GND
In				          b15

NFC

3.3v				        3.3
MOSI				        b3
SSEL				        b10
GND				          GND
~~~~


