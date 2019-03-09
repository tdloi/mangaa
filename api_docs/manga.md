- [`/manga`](#/manga)
  + [GET](#GET-/manga)

## GET `/manga`

### Param
parem | type
--- | ---
id | int

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
**404**
```json
{
  "code": 404,
  "message": "Not Found"
}
```

