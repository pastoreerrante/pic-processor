pic-processor is typescript-based, node.js web app allowing you to resize an image placed in the asset/full folder present in the project root directory. The resized image is then served over http to the browser issuing the resize command. 

Once the image has been placed in asset/full, open a web browser and visit the following url (assuming pic-processor is running locally):

http://localhost:3000/api/images?filename={imageName}&width={number}&height={number} 

The resized image should appear immediately.

Additional features: 

- {imageName} does not need the extension (.jpg, .png, etc.). Photo extension gets automatically found.
- pic-processor keeps track of photo dimensions hence, once resized, there could be as many as you like instances of the same photo with different dimensions in the cache.

If the same url is GETted more than once, the image will be served from a local cache. In this way, yu can place the above url inside an html img src attribute and use it as a placeholder photo service.

pic-processor can be used with the following scripts:

1. npm run build: compile the typescript code
2. npm run start: watch for any changes in the typescript code and dynamically recompile on save.
3. npm run format: run prettier to properly format the code.
4. npm run lint: run eslint to quality-check the code and suggest possible improvements or fix.
5. npm run test: compile the code and run all the test
6. npm run jasmine: run the test without compiling

Endpoint:

the main endpoint is: 

/api/images

Query parameters to be appended to /api/images are:

- filename: photo name
- width: desidered width
- height: desired height

Hitting just / or /api endpoints retrieves an help page.