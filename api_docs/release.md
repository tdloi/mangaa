- [`/release/chapters`](#releasechapters)
  + [GET](#GET-releasechapters)
- [`/release/following`](#releasefollowing)
  + [GET](#GET-releasefollowing)
- [`/release/manga`](#releasemanga)
  + [GET](#GET-releasemanga)
- [`/release/popular`](#releasepopular)
  + [GET](#GET-releasepopular)

## GET `/release/chapters`

### Param
param | type
--- | ---
page (opt) | int - default 1
total (opt) | int - default 10

### Response
```json
[
  {
    "id": 1,
    "created": 123456789,
    "vol": 1,
    "chapter": 1,
    "title": "Chapter titles",
    "url": "/chapter/1",
    "manga": [
      {
        "title": "manga title",
        "url": "/manga/1/manga-title",
        "cover": "manga_cover_url"
      }
    ]
  }
]
```

### Error
**404**
```json
{
  "code": 404,
  "message": "Not Found"
}
```

## GET `/release/following`

### Param
param | type
--- | ---
[header: Authorization] Token | str - Token received from firebase

### Response
```json
[
  {
    "id": 1,
    "created": 123456789,
    "vol": 1,
    "chapter": 1,
    "title": "Chapter titles",
    "url": "/chapter/1",
    "manga": [
      {
        "title": "manga title",
        "url": "/manga/1/manga-title",
        "cover": "manga_cover_url"
      }
    ]
  }
]
```

### Error
**404**
```json
{
  "code": 404,
  "message": "There are no new chapters available"
}
```

## GET `/release/manga`

### Param


### Response
```json
{
  "id": 1,
  "title": "Manga Title",
  "alt_titles": "Another Manga Title",
  "url": "/manga/1/manga-title",
  "cover": "cover_url",
  "description": "Manga descriptions",
  "tags": [
    {
      "id": 1,
      "name": "tag_name",
      "url": "/tag/tag_name"
    }
  ],
  "authors": [
    {
      "id": 1,
      "name": "author_name",
      "url": "/author/author_name"
    }
  ]
}
```

### Error


## GET `/release/popular`

### Param


### Response
```json
{
  "id": 1,
  "title": "Manga Title",
  "alt_titles": "Another Manga Title",
  "url": "/manga/1/manga-title",
  "cover": "cover_url",
  "description": "Manga descriptions",
  "tags": [
    {
      "id": 1,
      "name": "tag_name",
      "url": "/tag/tag_name"
    }
  ],
  "authors": [
    {
      "id": 1,
      "name": "author_name",
      "url": "/author/author_name"
    }
  ]
}
```

### Error


