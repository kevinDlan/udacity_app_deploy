import express from 'express';
import { valideExtension } from './constant/constant';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Auth } from './routes/auth';
import { authenticated } from './middleware/auth';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(Auth);
  
  app.get("/filteredimage",authenticated,async (req, res) => {
    const image_url:string = req.query.image_url;
    if(!image_url)
    {
      return res.status(403).send({error:"image url is required."})
    }
   let urlPart = image_url.split('.');
   if (!valideExtension.includes(urlPart[urlPart.length - 1]))
   {
      return res.status(403).send({error:"provided url is not image url."})
   }
    const filterUrl:string = await filterImageFromURL(image_url.trim(), res);
     res.status(200).sendFile(filterUrl);
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();