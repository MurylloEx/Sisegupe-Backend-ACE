import "reflect-metadata";
import cors from "cors";
import colors from "colors";
import { createConnection } from "typeorm";
import fileUpload from "express-fileupload";
import express, { json, urlencoded } from "express";

import AuthController from "./controllers/Auth.Controller";
import UserController from "./controllers/Users.Controller";
import ProjectController from "./controllers/Project.Controller";
import DocumentController from "./controllers/Document.Controller";
import GraphicsController from "./controllers/Graphics.Controller";
import CommentaryController from "./controllers/Commentary.Controller";

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(fileUpload({ 
  preserveExtension: true,
  useTempFiles: true,
  tempFileDir: 'temp/',
  limits: { 
    fileSize: 7 * 1024 * 1024 
  } 
}));

createConnection().then(() => {

  app.use('/auth', AuthController);
  app.use('/users', UserController);
  app.use('/projects', ProjectController);
  app.use('/graphics', GraphicsController);
  app.use('/documents', DocumentController);
  app.use('/commentaries', CommentaryController);

  app.listen(14295, () => {
    console.log(
      colors.yellow('[') + 
      colors.red('+') + 
      colors.yellow('] ') + 
      colors.cyan('Server started successfully on port 14295.'));
  });

}).catch((e) => {
  console.log('[+] Error ocurred while establishing connection.\n' + e);
});
