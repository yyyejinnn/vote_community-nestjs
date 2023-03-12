import { Injectable } from "@nestjs/common";
import { AwsException, CustomException } from "@vote/middleware";
import * as AWS from 'aws-sdk'

@Injectable()
export class S3Service {
    private readonly s3;

    constructor() {
        AWS.config.update({
            region: 'ap-northeast-2',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            }
        });
        this.s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    }

    async uploadFile(folder: string, key: string, file: Express.Multer.File) {
        try {
            await this.s3.upload({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `${folder}/${key}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                ContentDisposition: 'inline',
            }).promise();
        } catch (err) {
            console.error(err);
            throw new CustomException(AwsException.FAILED_UPLOAD_S3);
        }
    }
}