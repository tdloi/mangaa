- [`/chapter`](#chapter)
  + [POST](#POST-chapter)
- [`/chapter/chapter_id`](#chapterchapter_id)
  + [GET](#GET-chapterchapter_id)

## POST `/chapter`
Create a chapter upon valid request, images field will be uploaded to S3 and
client will do long-polling to get status of uploaded images on `status/task_id`,
location of new created chapters will include in header of `status` when task is
completed

### Param
param | type
--- | ---
images | files,
vol (opt) | float
chapter | float
title | str
manga | int
[header: Authorization] Token | str - firebase token

### Response
```json
{
  "[Header: Location]": "/api/v1/status/task_id"
}
```

### Error
**400**
```json
{
  "code": 400,
  "message": "Unsupport format files"
}
```
**404**

Provided manga id is not valid int or does not exist
```json
{
  "code": 404,
  "message": "Manga does not exist"
}
```
**500**
```json
{
  "code": 500,
  "message": "Something went wronng"
}
```

## GET `/chapter/chapter_id`

### Param


### Response
```json
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
      "url": "/manga/1/manga-title"
    }
  ],
  "lists": [
    {
      "created": 123456789
    }
  ]
}
```

### Error
**404**
```json
{
  "code": 404,
  "message": "Not Founnd"
}
```

