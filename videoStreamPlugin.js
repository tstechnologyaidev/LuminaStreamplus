import fs from 'fs';
import path from 'path';

export function videoStreamPlugin() {
  return {
    name: 'video-stream',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {

        if (!req.url || !req.url.startsWith('/videos/')) {
          return next();
        }

        const videoPath = path.join(process.cwd(), 'public', decodeURIComponent(req.url));

        if (!fs.existsSync(videoPath)) {
          return next();
        }

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;

        const ext = path.extname(videoPath).toLowerCase();
        const mimeTypes = {
          '.mp4': 'video/mp4',
          '.webm': 'video/webm',
          '.ogg': 'video/ogg',
          '.mkv': 'video/x-matroska',
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        const range = req.headers.range;

        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
          const end = parts[1]
            ? parseInt(parts[1], 10)
            : Math.min(start + CHUNK_SIZE, fileSize - 1);

          const chunkSize = end - start + 1;
          const fileStream = fs.createReadStream(videoPath, { start, end });

          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': contentType,
          });

          fileStream.pipe(res);
        } else {
          res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': contentType,
            'Accept-Ranges': 'bytes',
          });

          const fileStream = fs.createReadStream(videoPath);
          fileStream.pipe(res);
        }
      });
    },
  };
}
