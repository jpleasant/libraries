import { serveDir } from "jsr:@std/http/file-server";

// Define the directory to serve static files from
const staticFilesRoot = "./";

// Define the port for the server
const port = 8333;

Deno.serve({ port }, (req) => {
    // Serve the directory using serveDir
    return serveDir(req, {
        fsRoot: staticFilesRoot,
        urlRoot: "", // Serve from the root of the URL path
        showDirListing: true, // Optional: Show directory listings
    });
});