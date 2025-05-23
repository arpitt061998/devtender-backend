 - If error is handled using middleware (app.use("/)) wildcard, always use it at the end as it will handle errors gracefully.
 - if there are two parameters in app.XXX (req,res), three (req,res,next), four( err, req, res, next).
 - model name are treated as classes it is not mandatory but a convention to start the first letter with capital(User).
 - [app.use(express.json())] This will tell Express to use express.json() middleware, which will automatically parse any incoming request with a Content-Type of application/json and populate req.body with the parsed object.
 - it reads the JSON obj convert it into js object and add jsobj and adds it to req.body
 - findOneAndDelete(userId) is a shorthand for findOneAndDelete({ _id: userId }) 
 - PUT replaces the entire resource with the provided data, whereas PATCH only updates the specific fields of the resource
 - const authRouter = express.Router() and const app = express() are similar.
 - Socket.IO provides built-in TypeScript types. When you install the library via npm, the type definitions come with it (no need to install @types/socket.io separately).
 - app.listen() is a shorthand provided by Express that internally calls http.createServer(app).listen(...).
  Since you already created an HTTP server manually (which is required for integrating with Socket.IO or WebSockets), you should stick with server.listen() to avoid redundant or conflicting setups.

