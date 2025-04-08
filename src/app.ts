import express, { NextFunction, Request, Response } from 'express';

const app = express();
const port = 3000;

// Define a simple route

app.get('/user', (req: Request, res: Response): void => {
    console.log(req.params);
    console.log(req.query);
    throw new Error("Something went wrong!");
    res.send('Hello, TypeScript with Express!');
});

app.use("/",(err:Error, req: Request, res: Response,next: NextFunction): void => {
    if(err) {
     res.status(500).send("error");
    }
 })

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
 