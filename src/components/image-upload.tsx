'use client';

import { IMAGE_UPLOAD_LIMIT } from '@/config';
import { AuthContext } from '@/store/auth';
import { TImage } from '@/types/image';
import axios from 'axios';
import { Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useContext } from 'react';
import Dropzone from 'react-dropzone';
import Resizer from 'react-image-file-resizer';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

type Props = {
  images?: TImage[];
  setImages: React.Dispatch<React.SetStateAction<TImage[]>>;
  // onUpload: (image: TImage) => void;
};

const ImageUpload = ({ images = [], setImages }: Props) => {
  // const [images, setImages] = useState<TImage[]>([]);

  const authCtx = useContext(AuthContext);

  const handleOnDrop = async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > IMAGE_UPLOAD_LIMIT) {
      toast.error(`You can only upload up to ${IMAGE_UPLOAD_LIMIT} images`);
      return;
    }

    for (const file of acceptedFiles) {
      await resizeAndUploadImage(file);
    }
  };

  const resizeAndUploadImage = async (file: File) => {
    if (file) {
      try {
        Resizer.imageFileResizer(
          file,
          1080,
          1080,
          'JPEG',
          80,
          0,
          async (uri) => {
            try {
              const res = await axios.post(
                process.env.NEXT_PUBLIC_REST_URL + '/image/upload',
                { image: uri },
                {
                  headers: {
                    Authorization: authCtx.user?.token,
                  },
                }
              );

              // const newImages = [
              //   ...images,
              //   { url: res.data.url, publicId: res.data.public_id },
              // ];
              // setImages(newImages);

              // const newImage = {
              //   url: res.data.url,
              //   publicId: res.data.public_id,
              // };
              setImages((prev) => [
                ...prev,
                { url: res.data.url, publicId: res.data.public_id },
              ]);

              // onUpload(newImage);

              toast.success('Image uploaded successfully');
            } catch (error) {
              console.log('Cloudinary error', error);
              toast.error('Image upload failed', {
                description: (error as Error).message,
              });
            }
          },
          'base64'
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRemoveImage = async (id: string, showToast = true) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_REST_URL}/image/remove`,
        { publicId: id },
        {
          headers: {
            Authorization: authCtx.user?.token,
          },
        }
      );

      setImages((prev) => prev.filter((img) => img.publicId !== id));

      if (showToast) toast.success('Image removed successfully');
    } catch (error) {
      console.log('Cloudinary delete error', error);
      if (showToast) toast.error((error as Error).message);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Event Images</CardTitle>
        <CardDescription>
          Upload some images to help people get to know your event!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3">
          <Dropzone
            accept={{
              'image/png': ['.png'],
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/gif': ['.gif'],
            }}
            onDrop={handleOnDrop}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                role="button"
                className="w-full h-[200px] p-8 rounded-lg border-2 border-dashed flex flex-col justify-center items-center gap-2 bg-primary-foreground text-muted-foreground"
              >
                <input {...getInputProps()} />
                <Upload className="size-5" />
                <p>Click or Drag &apos;n&apos; drop to upload</p>
                <p>(Up to {IMAGE_UPLOAD_LIMIT} images in total)</p>
              </div>
            )}
          </Dropzone>

          <div className="grid grid-cols-3 gap-2">
            {images.map((image) => (
              <div key={image.publicId} className="group relative">
                <Image
                  src={image.url}
                  alt="Event image"
                  height="100"
                  width="100"
                  className="aspect-square w-full rounded-md object-cover"
                />
                <Trash2
                  role="button"
                  onClick={() => handleRemoveImage(image.publicId)}
                  className="size-6 absolute hidden bottom-2 right-2 group-hover:inline-block text-primary-foreground"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
