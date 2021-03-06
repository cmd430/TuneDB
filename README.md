# TuneDB
REST api for music, use it to make media streaming services. It contains

  - Metadata about Albums and individual Tracks (info from the id3 tags)
  - Album art (from id3, disabled by default: enable in `config.js`)
  - Path to stream tracks from
  - Search
  
**Supports**

*Only tested with mp3

* mp3 (1.1, 2.2, 2.3, 2.4)
* m4a (mp4)
* vorbis (ogg, flac)
* asf (wma, wmv)

Installation
============

Install NodeJS, MongoDB and Git
`sudo apt-get install -y node mongodb git`

Setup MongoDB dirs
`mkdir -p /data/db`

Clone the repo
`git clone https://github.com/cmd430/TuneDB.git`

Install dependencies
`cd TuneDB`
`npm install`

Add your music to `./media`, this can be changed in `config.js`.

Fire it up!
`node index`

Hint: the default port os set to `80` currently, but can be changed in the `config.js` file.


Routes
======

**Notice**

Currently IDs are created using `seedrandom`

  - Tracks are seeded with track name and duration
  - Albums are seeded with album name and release year

====
  
The API contains the following 'routes' which produce the example output

`/` - returns basic info about the API

**Example**

`https://<YOUR_URL>/` returns the following:

```
{
	"status": "online",
	"uptime": 347,
	"server": "TEST-SERVER",
	"updated": "Unknown",
	"version": "0.1.1",
	"albums": 156,
	"pages": 4,
	"routes": [
		"/",
		"/music",
		"/music/:page",
		"/album/:id",
		"/album/search/:search",
		"/album/search/:search/:page",
		"/track/:id",
		"/track/search/:search",
		"/track/search/:search/:page",
		"/artist/:artist",
		"/artist/:artist/:page",
		"/genre/:genre",
		"/genre/:genre/:page"
	]
}
```

`album/:id` - This returns all info and tracks for a particular album. Useful for the "album details" page in your app

**Example**

`https://<YOUR_URL>/album/1654878758` returns the following:

```
[  
   {  
      "_id":"1654878758",
      "album":"1989",
      "year":"2014",
      "num_tracks":13,
      "last_updated":1450279456682,
      "artwork":[  
         null
      ],
      "tracks":[  
         {  
            "_id":"1076576860",
            "name":"Welcome to New York",
            "genres": "Dance/Dance",
            "track":{  
               "no":1,
               "of":0
            },
            "disk":{  
               "no":0,
               "of":0
            },
            "file":"/Taylor Swift/1989/01 Welcome to New York.mp3",
            "duration":212.32915625
         },
         {  
            "_id":"1785765497",
            "name":"Blank Space",
            "genres": "Dance/Dance",
            "track":{  
               "no":2,
               "of":0
            },
            "disk":{  
               "no":0,
               "of":0
            },
            "file":"/Taylor Swift/1989/02 Blank Space.mp3",
            "duration":231.53415625
         },
         {  
            "_id":"1502702560",
            "name":"Style",
            "genres": "Dance/Dance",
            "track":{  
               "no":3,
               "of":0
            },
            "disk":{  
               "no":0,
               "of":0
            },
            "file":"/Taylor Swift/1989/03 Style.mp3",
            "duration":230.69915625
         },
         ...
      ],
      "artist": "Taylor Swift"
   }
]
```

`track/:id` - This returns album with only the specific track in the tracks array.

**Example**

`https://<YOUR_URL>/track/1654878758` returns the following:

```
{  
   "_id":"1654878758",
   "album":"1989",
   "year":"2014",
   "num_tracks":13,
   "last_updated":1450279456682,
   "artwork":[  
      null
   ],
   "tracks":[  
      {  
         "_id":"1076576860",
         "name":"Welcome to New York",
         "genres": "Dance/Dance",
         "track":{  
            "no":1,
            "of":0
         },
         "disk":{  
            "no":0,
            "of":0
         },
         "file":"/Taylor Swift/1989/01 Welcome to New York.mp3",
         "duration":212.32915625
      }
   ],
   "artist": "Taylor Swift"
}
```

`music/` This returns the number of pages available to list 50 albums at a time (used for pagination etc)

`music/:page` this retuns a list of 50 albums with metadata

**Example**

`https://<YOUR_URL>/music/1`

```
[  
   {  
      "_id":"-1504478421",
      "album":"x (Deluxe Edition)",
      "year":"2014",
      "num_tracks":15,
      "last_updated":1450279457411,
      "artwork":[  
         null
      ],
      "artist": "Ed Sheeran"
   },
   {  
      "_id":"1098819766",
      "album":"while (1<2)",
      "year":"2014",
      "num_tracks":25,
      "last_updated":1450279453084,
      "artwork":[  
         null
      ],
      "artist": "deadmau5"
   },
   ...
]
```

`track/search/:search` - This returns albums with tracks matching search with only the tracks matching the search in the tracks array.

`track/search/:search/:page` - This returns albums with tracks matching search with only the tracks matching the search in the tracks array, 
paginated

**Example**

`https://<YOUR_URL>/track/search/Welcome` returns the following:

```
[  
   {  
      "_id":"1654878758",
      "album":"1989",
      "year":"2014",
      "num_tracks":13,
      "last_updated":1450279456682,
      "artwork":[  
         null
      ],
      "tracks":[  
         {  
            "_id":"1076576860",
            "name":"Welcome to New York",
            "genres": "Dance/Dance",
            "track":{  
               "no":1,
               "of":0
            },
            "disk":{  
               "no":0,
               "of":0
            },
            "file":"/Taylor Swift/1989/01 Welcome to New York.mp3",
            "duration":212.32915625
         }
      ],
      "artist": "Taylor Swift"
   },
   {  
      "_id":"-51451698",
      "album":"Appetite for Destruction",
      "year":"1987",
      "num_tracks":12,
      "last_updated":1450279456131,
      "artwork":[  
         null
      ],
      "tracks":[  
         {  
            "_id":"498125268",
            "name":"Welcome to the Jungle",
            "genres": "Rock/Rock",
            "track":{  
               "no":1,
               "of":0
            },
            "disk":{  
               "no":0,
               "of":0
            },
            "file":"/Guns N' Roses/Appetite for Destruction/01 Welcome to the Jungle.mp3",
            "duration":273.34875
         }
      ],
      "artist": "Guns N' Roses"
   }
]
```

`album/search/:search` - This returns albums matching search.

`album/search/:search/:page` - This returns albums matching search. paginated

**Example**

`https://<YOUR_URL>/album/search/1989` returns the following:

```
[  
   {  
      "_id":"1654878758",
      "album":"1989",
      "year":"2014",
      "num_tracks":13,
      "last_updated":1450279456682,
      "artwork":[  
         null
      ],
      "tracks":[  
         {  
            "_id":"1076576860",
            "name":"Welcome to New York",
            "genres": "Dance/Dance",
            "track":{  
               "no":1,
               "of":0
            },
            "disk":{  
               "no":0,
               "of":0
            },
            "file":"/Taylor Swift/1989/01 Welcome to New York.mp3",
            "duration":212.32915625
         },
         {  
            "_id":"1785765497",
            "name":"Blank Space",
            "genres": "Dance/Dance",
            "track":{  
               "no":2,
               "of":0
            },
            "disk":{  
               "no":0,
               "of":0
            },
            "file":"/Taylor Swift/1989/02 Blank Space.mp3",
            "duration":231.53415625
         },
         {  
            "_id":"1502702560",
            "name":"Style",
            "genres": "Dance/Dance",
            "track":{  
               "no":3,
               "of":0
            },
            "disk":{  
               "no":0,
               "of":0
            },
            "file":"/Taylor Swift/1989/03 Style.mp3",
            "duration":230.69915625
         },
         ...
      ],
      "artist": "Taylor Swift"
      ]
   }
]
```

`artist/:artist` - This returns albums by artist.

`artist/:artist/:page` - This returns albums by artist. paginated

**Example**

`https://<YOUR_URL>/artist/Taylor Swift`

-----

`genre/:genre` - This returns tracks matching genre.

`genre/:genre/:page` - This returns tracks matching genre.. paginated

**Example**

`https://<YOUR_URL>/genre/Dance`