import os
from http.server import SimpleHTTPRequestHandler, HTTPServer

# This is the magic line: change into the app/ folder
os.chdir('app')

server_address = ('', 8001)
Handler = SimpleHTTPRequestHandler

# Make sure .js files load as JavaScript modules
Handler.extensions_map.update({
    ".js": "application/javascript",
    ".mjs": "application/javascript",
})

print("🚀 Serving from 'app/' at http://localhost:8001")
httpd = HTTPServer(server_address, Handler)
httpd.serve_forever()
