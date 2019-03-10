- [`/user`](#user)
  + [GET](#GET-user)

## GET `/user`

### Param
param | type
--- | ---
uid | string

### Response
```json
{
  "uid": "abcdefgh-abcd-abcd-abcd-abcdefgh",
  "username": "user",
  "avatar": "user_avatar",
  "mangas": [
    {
      "id": 1,
      "title": "Manga Title",
      "alt_titles": "Another Manga Title",
      "url": "/manga/1/manga-title",
      "cover": "cover_url",
      "description": "Manga descriptions"
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

