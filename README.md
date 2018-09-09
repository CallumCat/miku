# ShareX Custom File Host (SXFH)

## ShareX Config Sample
```json
{
  "Name": "Domain",
  "DestinationType": "ImageUploader, FileUploader",
  "RequestURL": "http://domain.com/up",
  "FileFormName": "file",
  "Arguments": {
    "token": "token"
  }
}```

Make sure to copy the config.sample.json file into config.json and edit it with your msql information, change the port etc., then do `npm install` to install all the dependencies. Finally go into your database management tool of choice (I use phpmyadmin) create the database you specified in config.json, import `Database.sql` into it, and make a new key (name can be of your choosing). Then start this up and register (set key to the key you made just before this), And you're done!