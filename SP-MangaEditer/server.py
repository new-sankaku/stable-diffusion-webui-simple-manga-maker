import http.server
import socketserver
import os

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(CORSRequestHandler, self).end_headers()

    def do_GET(self):
        # サーバーのルートディレクトリを設定
        self.directory = os.getcwd()
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

PORT = 8000

with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()