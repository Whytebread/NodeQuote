// Import required Node.js modules
let http = require("http");
let url = require("url");
let quotes = require("./quotes");

// Use environment-provided port or fall back to 3000
let port = process.env.PORT || 3000;

// Create an HTTP server
let server = http.createServer((req, res) => {
    // Set CORS headers to allow requests from any origin
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    // Parse the URL and query parameters
    let parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname;
    let query = parsedUrl.query;
    
    // Handle requests to the /quotes endpoint
    if (path === "/quotes") {
        // Get topic parameter, default to 'wisdom' if not provided
        let topic = query.topic;
        if (!topic) {
            topic = "wisdom";
        }
        
        // Get count parameter, default to 1 if not provided
        let count = parseInt(query.count);
        if (isNaN(count) || count < 1) {
            count = 1;
        } else if (count > 5) {
            // Limit count to a maximum of 5
            count = 5;
        }
        
        // Check if the requested topic exists
        if (quotes[topic]) {
            // Get the quotes for the requested topic
            let topicQuotes = quotes[topic];
            
            // Select random quotes up to the count
            let selectedQuotes = [];
            let usedIndices = {};
            
            for (let i = 0; i < count && i < topicQuotes.length; i++) {
                let randomIndex;
                
                // Find an unused random index
                do {
                    randomIndex = Math.floor(Math.random() * topicQuotes.length);
                } while (usedIndices[randomIndex]);
                
                // Mark this index as used
                usedIndices[randomIndex] = true;
                
                // Add the quote to our selected quotes
                selectedQuotes.push(topicQuotes[randomIndex]);
            }
            
            // Send the response with the selected quotes
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(selectedQuotes));
        } else {
            // If the topic doesn't exist, send an error response
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ 
                error: "Invalid topic. Available topics: love, motivational, wisdom, humor" 
            }));
        }
    } else {
        // For any other path, return a 404 response
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not Found" }));
    }
});

// Start the server
server.listen(port, () => {
    console.log("Server is running on port " + port);
});