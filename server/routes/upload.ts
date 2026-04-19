import { Router } from 'express';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import busboy from 'busboy';
import { authMiddleware } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';

const router = Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB default

// POST upload file
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    let hasResponded = false;
    const respondOnce = (statusCode: number, payload: Record<string, any>) => {
      if (hasResponded || res.headersSent) return;
      hasResponded = true;
      res.status(statusCode).json(payload);
    };

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Create busboy instance to parse form data
    const bb = busboy({
      headers: req.headers,
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    });

    let fileBuffer: Buffer | null = null;
    let filename: string | null = null;
    let mimeType: string | null = null;
    let fileSize = 0;

    bb.on('file', (_fieldname, file, info) => {
      mimeType = info.mimeType;
      const originalFilename = info.filename || 'upload';

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(mimeType)) {
        file.destroy();
        respondOnce(400, { error: 'Only JPEG, PNG, and WebP images are allowed' });
        return;
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const ext = originalFilename.split('.').pop();
      filename = `${timestamp}-${randomString}.${ext}`;

      // Read file
      const chunks: Buffer[] = [];

      file.on('data', (data: Buffer) => {
        fileSize += data.length;

        if (fileSize > MAX_FILE_SIZE) {
          file.destroy();
          respondOnce(400, { error: `File size exceeds ${Math.floor(MAX_FILE_SIZE / (1024 * 1024))}MB limit` });
          return;
        }

        chunks.push(data);
      });

      file.on('end', () => {
        fileBuffer = Buffer.concat(chunks);
      });

      file.on('error', (error: any) => {
        console.error('File read error:', error);
        respondOnce(500, { error: 'File upload failed' });
      });
    });

    bb.on('close', async () => {
      if (hasResponded) return;
      if (!fileBuffer || !filename) {
        respondOnce(400, { error: 'No file provided' });
        return;
      }

      try {
        const filepath = join(UPLOAD_DIR, filename);
        await writeFile(filepath, fileBuffer);

        // Return public URL
        const url = `/uploads/${filename}`;
        console.log('File uploaded successfully:', { url, filename, size: fileSize });

        respondOnce(200, { url, filename });
      } catch (error: any) {
        console.error('File save error:', error);
        respondOnce(500, { error: 'File upload failed' });
      }
    });

    bb.on('error', (error: any) => {
      console.error('Busboy error:', error);
      respondOnce(500, { error: 'File upload failed' });
    });

    req.pipe(bb);
  } catch (error: any) {
    console.error('Upload error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'File upload failed' });
    }
  }
});

export default router;
