- [`/status/task_id`](#statustask_id)
  + [GET](#GET-statustask_id)

## GET `/status/task_id`
Return status of current task, if task is completed, address of new collections
resouces will be included in Location Header

### Param
param | type
--- | ---
task_id | str

### Response
```json
{
  "state": "SUCCESS",
  "current": null,
  "total": 10,
  "status": "Completed",
  "results": [
    "some_images_url"
  ]
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

