import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
    private readonly logger = new Logger(StorageService.name);
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly publicUrl: string;

    constructor(private configService: ConfigService) {
        const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
        const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');

        if (!accountId || !accessKeyId || !secretAccessKey) {
            this.logger.warn('R2 credentials are not configured - file uploads will be disabled');
            this.bucketName = '';
            this.publicUrl = '';
            this.s3Client = null as any;
            return;
        }

        this.bucketName = this.configService.get<string>('R2_BUCKET_NAME') || 'maithilvivah';
        this.publicUrl = this.configService.get<string>('R2_PUBLIC_URL') || `https://pub-${accountId}.r2.dev`;

        this.s3Client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });

        this.logger.log('R2 Storage Service initialized');
    }

    /**
     * Upload a file to R2
     * @param file - The file buffer
     * @param profileId - Profile ID for organizing files
     * @param fileType - File type: 'images', 'docs', 'videos'
     * @param filename - Original filename
     * @returns Public URL of the uploaded file
     */
    async uploadFile(
        file: Buffer,
        profileId: string,
        fileType: 'images' | 'docs' | 'videos',
        filename: string,
    ): Promise<string> {
        try {
            const fileExtension = filename.split('.').pop() || 'bin';
            const uniqueFilename = `${uuidv4()}.${fileExtension}`;
            const key = `${profileId}/${fileType}/${uniqueFilename}`;

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file,
                ContentType: this.getContentType(fileExtension),
            });

            await this.s3Client.send(command);

            const publicUrl = `${this.publicUrl}/${key}`;
            this.logger.log(`File uploaded successfully: ${key}`);

            return publicUrl;
        } catch (error) {
            this.logger.error(`Failed to upload file: ${error.message}`);
            throw new Error('File upload failed');
        }
    }

    /**
     * Delete a file from R2
     * @param fileUrl - The public URL of the file to delete
     */
    async deleteFile(fileUrl: string): Promise<void> {
        try {
            // Extract key from URL
            const key = fileUrl.replace(`${this.publicUrl}/`, '');

            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            await this.s3Client.send(command);
            this.logger.log(`File deleted successfully: ${key}`);
        } catch (error) {
            this.logger.error(`Failed to delete file: ${error.message}`);
            throw new Error('File deletion failed');
        }
    }

    /**
     * Generate a signed URL for private file access
     * @param fileUrl - The public URL of the file
     * @param expiresIn - Expiration time in seconds (default: 1 hour)
     * @returns Signed URL
     */
    async getSignedUrl(fileUrl: string, expiresIn: number = 3600): Promise<string> {
        try {
            const key = fileUrl.replace(`${this.publicUrl}/`, '');

            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
            return signedUrl;
        } catch (error) {
            this.logger.error(`Failed to generate signed URL: ${error.message}`);
            throw new Error('Failed to generate signed URL');
        }
    }

    /**
     * Get content type based on file extension
     */
    private getContentType(extension: string): string {
        const contentTypes: Record<string, string> = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp',
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        };

        return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
    }
}
