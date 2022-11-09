Admin photo/video gallery
-drag and drop
-the order of the photos and videos is stored in the configuration table
-the exif meta data of a photo taken from a camera (make, model, lens, settings, date) is stored in the database automatically upon uploading

AWS s3
-videos are uploaded directly via the browser to s3 bucket using a pre-signed url because of there size and server memory requirements
-photos are uploaded via the laravel server for the purpose of manipulating the size before storing them in the s3 bucket

TODOS
-Provide appropriate error codes from the server when something goes wrong
-Crud operation for users
