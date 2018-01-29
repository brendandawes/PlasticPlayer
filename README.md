Plastic Player
--------------

![Image of Plastic Player showing John Coltrane being played](plasticplayer.jpg?raw=true)

An NFC based controller for Spotify using the Mopidy Server. This isn't a step by step instructables style build guide but hopefully there's enough information here to allow you build your own version. Knowledge of building stuff like this, soldering and understanding JSON files and the like would be good.

Materials
---------

* [ Raspberry Pi ](http://raspberrypi.org)
* [ Pi Musicbox ](http://www.pimusicbox.com)
* [ Espruino Wifi ](https://www.espruino.com)
* Adafruit [ 128 x 32 SPI OLED ](https://www.adafruit.com/product/661)
* [ PN532 NFC breakout ](https://www.espruino.com/PN532)
* 2 x [ Sanwa Arcade Buttons ](https://www.arcadeworlduk.com/products/Sanwa-OBSC-24-C-Arcade-Button.html)
* [ Adafruit half-sized Perma Proto board ](https://www.adafruit.com/product/571)
* [ Adafruit Neopixel breadboard ](https://www.adafruit.com/product/1558)
* [Panel Mount Micro USB](https://uk.rs-online.com/web/p/micro-usb-connectors/9125114/)
* 3D printed enclosure (available on this repo)
* A Pro Spotify account
* [ NFC Stickers ](http://zipnfc.com/nfc-stickers/nfc-sticker-midas-tiny-ntag213.html)
* 35mm Blank Slides - via Ebay or other suppliers

How it Works
------------

Plastic Player has two main components — A Raspberry Pi running the Musicbox system and an Espruino WiFi based controller. 

The Raspberry Pi manages and plays the music and it's this you'll connect to your stereo system. 

The controller is what you can build with this repo. The controller uses 35mm photographic slides with NFC stickers to play anything on Spotify. This uses an Espruino Wifi board. Of course you don't have to use 35mm slides — it could be anything you can put an NFC sticker onto.

When you power up the Plastic Player the Espruino connects to your WiFi network and pulls down data in the form of a JSON file — I use [Airtable](http://airtable.com) as a simple solution but you could use anything, even a flat text file, as long as it's JSON formatted in the correct way. This JSON file contains a list of NFC tag ids with matching Spotify URIs — these are your albums. When you place an album (slide) into Plastic Player, the Espruino sees the NFC tag and looks-up that tag in the JSON file.  When it finds a match it sends the corresponding Spotify URI to the Musicbox over wifi and then starts that track list playing. Plastic Player also includes controls for play/pause and skip (next track).

Raspberry Pi
------------

Install Musicbox on a Raspberry Pi following the instructions on the Musicbox site including entering your Spotify details. Once you have this set up, check you can connect to it via your web browser — usually via musicbox.local. 

Make sure to note down the ip address of the Raspberry Pi as you'll need to enter this in the code for Espruino later. You can find this out via the Terminal by typing 'ping musicbox.local'. This will show the ip address of the Raspberry Pi you have running Musicbox.

That’s all you need to do with the Raspberry Pi. 


Espruino
--------

Solder the Espruino board in the centre of the Perma-Proto board.

Connect the - and + rails on the Perma-Proto to the 3.3v terminal and the GND terminal respectively.

Wire the components to the Espruino / Perma-proto using the following pin connections. 

| OLED | Espruino Wifi |
|------|---------------|
| CS   | GND           |
| RST  | b7            |
| DC   | a0            |
| CLK  | b5            |
| DATA | b6            |
| 3.3  | 3.3           |
| GND  | GND           |

| Neo Pixel | Espruino Wifi |
|-----------|---------------|
| +         | 3.3           |
| G         | GND           |
| In        | b15           |

| NFC  | Espruino Wifi |
|------|---------------|
| 3.3  | 3.3           |
| MOSI | b3            |
| SSEL | b10           |
| GND  | GND           |

| Pause Button | Espruino Wifi |
|--------------|---------------|
| +            | 3.3           |
| -            | B1            |

| Next Button | Espruino Wifi |
|-------------|---------------|
| +           | 3.3           |
| -           | B14           |

Code
----

Download the Javascript code from this repo. Plug-in your Espruino and using the Espruino Chrome app launch the Editor and load in the code you've just downloaded. Alter the wifi network name and password details to match your network settings and change the host to be the ip address you noted down earlier that locates the Raspberry Pi on your network. Change the PATH to be the web address of your json source.

Transfer the code to your Espruino. Hopefully it should start up and work as expected.

Enclosure
---------

You can enclose this project in whatever you see fit but I've included the .stl files for you to use and either print at home of send to a service such as Shapeways to create the enclosure. Once you have that you can place the parts and then snap-fit the enclosure back together.

To provide power to the Plastic Player, I used a panel mount female USB (see parts list above) which I then attached to another USB lead I had cut up, wiring the cut end to the panel mount USB and plugging the male end into the Espruino as normal.

NFC Tags
--------

Place an NFC tag on a slide and place it into the Plastic Player. Any unknown tags will display the tag ID on the OLED display. You can then use this to create the JSON file (see below).

Setting up the database of albums
---------------------------------

Plastic Player consults a JSON file to match NFC tags with Spotify albums URIs. An example JSON schema is included in this repo. I use Airtable to easily manage and serve this file but you can use whatever you want as long as it's web accessible. 

Construct your JSON file using the tag IDs and the corresponding Spotify URIs.

Once you have this JSON file done and existing on the web, and that location is in the PATH variable as detailed above, then when you place the relevant NFC tag into the Plastic Player it should talk to the Musicbox and play!




