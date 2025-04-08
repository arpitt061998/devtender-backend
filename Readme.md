 - If error is handled using middleware (app.use("/)) wildcard, always use it at the end as it will handle errors gracefully.
 - if there are two parameters in app.XXX (req,res), three (req,res,next), four( err, req, res, next).


 