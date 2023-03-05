
import cors from 'cors-anywhere';

let port = (process.argv.length > 2) ? parseInt (process.argv[2]) : 8080; // default
cors.createServer().listen(port, 'localhost')