import type { NextFunction, Request, Response } from "express";

import multer from "multer";

export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_MAX_BYTES = 2 * 1024 * 1024;

const RESUME_ALLOWED_MIME_TYPES = new Set(["application/pdf"]);

const IMAGE_ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const storage = multer.memoryStorage();

function makeUploader(options: {
  maxBytes: number;
  allowedMimeTypes: Set<string>;
  label: string;
}) {
  const upload = multer({
    storage,
    limits: { fileSize: options.maxBytes },
    fileFilter: (_req, file, callback) => {
      if (!options.allowedMimeTypes.has(file.mimetype)) {
        return callback(
          new Error(
            `Invalid ${options.label} file type. Allowed: ${[...options.allowedMimeTypes].join(", ")}`,
          ),
        );
      }

      callback(null, true);
    },
  }).single("file");

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (error: unknown) => {
      if (!error) {
        return next();
      }

      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: `${options.label} file exceeds the maximum size of ${Math.round(options.maxBytes / (1024 * 1024))}MB`,
          });
        }

        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(400).json({
        success: false,
        message: "File upload failed",
      });
    });
  };
}

export const uploadResumeFile = makeUploader({
  maxBytes: RESUME_MAX_BYTES,
  allowedMimeTypes: RESUME_ALLOWED_MIME_TYPES,
  label: "Resume",
});

export const uploadImageFile = makeUploader({
  maxBytes: IMAGE_MAX_BYTES,
  allowedMimeTypes: IMAGE_ALLOWED_MIME_TYPES,
  label: "Image",
});
