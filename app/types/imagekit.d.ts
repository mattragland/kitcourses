declare module 'imagekit' {
  interface ImageKitOptions {
    publicKey: string;
    privateKey: string;
    urlEndpoint: string;
  }

  interface UploadOptions {
    file: string;
    fileName: string;
    folder?: string;
    [key: string]: any;
  }

  interface UploadResponse {
    url: string;
    fileId: string;
    name: string;
    size: number;
    [key: string]: any;
  }

  class ImageKit {
    constructor(options: ImageKitOptions);
    upload(options: UploadOptions): Promise<UploadResponse>;
    urlEndpoint: string;
  }

  export default ImageKit;
} 