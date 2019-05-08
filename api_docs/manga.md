- [`/manga`](#manga)
  + [DELETE](#DELETE-manga)
  + [GET](#GET-manga)
  + [POST](#POST-manga)
- [`/manga/<manga_id>`](#manga<manga_id>)
  + [GET](#GET-manga<manga_id>)
- [`/manga/<manga_id>/chapters`](#manga<manga_id>chapters)
  + [GET](#GET-manga<manga_id>chapters)
- [`/manga/<manga_id>/comment`](#manga<manga_id>comment)
  + [POST](#POST-manga<manga_id>comment)
- [`/manga/<manga_id>/comments`](#manga<manga_id>comments)
  + [GET](#GET-manga<manga_id>comments)
- [`/manga/<manga_id>/favorite`](#manga<manga_id>favorite)
  + [GET](#GET-manga<manga_id>favorite)
  + [POST](#POST-manga<manga_id>favorite)
- [`/manga/<manga_id>/rating`](#manga<manga_id>rating)
  + [POST](#POST-manga<manga_id>rating)

## DELETE `/manga`

### Param


### Response
```json
{
  "code": 200,
  "message": "Deleted"
}
```

### Error
**404**
```json
{
  "code": 404,
  "message": "Not Found"
}
```

## GET `/manga`
Return a list of manga, if page is not specified or negetive, return first page,
if page is bigger than total page, return 404,
if page is cannot convert to int, return 400

### Param
param | type
--- | ---
page (optional) | int

### Response
```json
{
  "page": 1,
  "nextPage": 2,
  "prevPage": null,
  "totalPage": 3,
  "results": [
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
  ]
}
```

### Error
**400**
```json
{
  "code": 400,
  "message": "Invalid page number values"
}
```
**404**
```json
{
  "code": 404,
  "message": "Not Found"
}
```

## POST `/manga`

### Param
param | type
--- | ---
title | str
alt_titles (opt) | str
description (opt) | str
cover | str (url)
tags | a string of tag id seperated by a comma
authors | a string of author id seperated by a comma

### Response
```json
{
  "id": 1,
  "title": "Manga Title",
  "alt_titles": "Another Manga Title",
  "url": "/manga/1/manga-title",
  "cover": "cover_url",
  "created": 123456789,
  "description": "manga_description",
  "tags": [
    {
      "id": 1,
      "name": "manga tag",
      "url": "/tag/manga-tag"
    }
  ],
  "authors": [
    {
      "id": 1,
      "name": "manga author",
      "url": "/author/1"
    }
  ]
}
```

### Error
**400**

Uploaded cover is not in list allowed extension file
```json
{
  "code": 400,
  "message": "Unsupported format type"
}
```
**404**
```json
{
  "code": 404,
  "message": "Not Found"
}
```

## GET `/manga/<manga_id>`

### Param


### Response
```json
{
  "id": 1,
  "title": "Manga Title",
  "alt_titles": "Another Manga Title",
  "url": "/manga/1/manga-title",
  "cover": "cover_url",
  "created": 123456789,
  "description": "manga_description",
  "tags": [
    {
      "id": 1,
      "name": "manga tag",
      "url": "/tag/manga-tag"
    }
  ],
  "authors": [
    {
      "id": 1,
      "name": "manga author",
      "url": "/author/1"
    }
  ]
}
```

### Error
**404**
```json
{
  "code": 404,
  "message": "Not Found"
}
```

## GET `/manga/<manga_id>/chapters`

### Param


### Response
```json
[
  {
    "manga": 1,
    "lists": [
      {
        "id": 1,
        "created": 123456789,
        "vol": 1,
        "chapter": 1,
        "manga": [
          {
            "title": "manga title",
            "url": "/manga/1/manga-title",
            "cover": "manga_cover_url"
          }
        ]
      }
    ]
  }
]
```

### Error
**404**
```json
{
  "message": "Not Found"
}
```

## POST `/manga/<manga_id>/comment`

### Param


### Response
```json
[
  {
    "manga": 1,
    "lists": [
      {
        "id": 1,
        "created": 123456789,
        "vol": 1,
        "chapter": 1,
        "manga": [
          {
            "title": "manga title",
            "url": "/manga/1/manga-title",
            "cover": "manga_cover_url"
          }
        ]
      }
    ]
  }
]
```

### Error
**404**
```json
{
  "message": "Not Found"
}
```

## GET `/manga/<manga_id>/comments`

### Param


### Response
```json
[
  {
    "manga": 1,
    "lists": [
      {
        "id": 1,
        "created": 123456789,
        "vol": 1,
        "chapter": 1,
        "manga": [
          {
            "title": "manga title",
            "url": "/manga/1/manga-title",
            "cover": "manga_cover_url"
          }
        ]
      }
    ]
  }
]
```

### Error
**404**
```json
{
  "message": "Not Found"
}
```

## GET `/manga/<manga_id>/favorite`

### Param


### Response
```json
{
  "total": "total_favorited",
  "status": false
}
```

### Error


## POST `/manga/<manga_id>/favorite`

### Param


### Response
```json
{
  "total": "total_favorited",
  "status": false
}
```

### Error


## POST `/manga/<manga_id>/rating`

### Param


### Response
```json
{
  "rating": 7.2,
  "user_rating": 5
}
```

### Error


