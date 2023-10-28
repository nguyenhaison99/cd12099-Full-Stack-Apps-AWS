import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get('/filteredimage', async (req, res) => {

    // 1. validate the image_url query
    try {
      const { image_url } = req.query;
      if (!image_url) {
        console.error('Image URL is missing or malformed');
        return res.status(400).send({ message: 'Image URL is required or malformed' });
      }

      // 2. call filterImageFromURL(image_url) to filter the image
      const localImagePath = await filterImageFromURL(image_url);

      // 3. send the resulting file in the response
      res.sendFile(localImagePath, (err) => {
        if (err) {
          console.error('Error sending the processed image:', err);
        }

        // 4. deletes any files on the server on finish of the response
        deleteLocalFiles([localImagePath]);
      });
    } catch (error) {
      // Log any unhandled errors
      console.error('An unexpected error occurred:', error);
      res.status(500).send({ message: 'An unexpected error occurred' });
    }
  });

  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
