# 로컬 미리보기 서버 — GitHub Pages처럼 확장자 없는 주소(/about)를 about.html로 연결
import http.server, os

class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = super().translate_path(path)
        if not os.path.exists(p) and os.path.exists(p + ".html"):
            return p + ".html"
        return p

http.server.ThreadingHTTPServer(("", 8791), Handler).serve_forever()
