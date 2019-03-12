- [`/manga`](#manga)
  + [GET](#GET-manga)

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

