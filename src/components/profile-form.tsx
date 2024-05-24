'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UPDATE_USER, UpdateUserMutationData } from '@/graphql/mutations';
import { MY_PROFILE } from '@/graphql/queries';
import { profileFormPayload, profileFormSchema } from '@/schemas/profile-form';
import { AuthContext } from '@/store/auth';
import { TImage } from '@/types/image';
import { User } from '@/types/user';
import { useMutation } from '@apollo/client';
import { omitDeep } from '@apollo/client/utilities';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import Resizer from 'react-image-file-resizer';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

type Props = {
  initData: User;
};

const ProfileForm = ({ initData }: Props) => {
  const [isPending, setIsPending] = useState(false);
  const [avatar, setAvatar] = useState<TImage | undefined | null>(
    initData.image
  );

  const authCtx = useContext(AuthContext);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<profileFormPayload>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initData,
  });

  const [updateProfile] = useMutation<UpdateUserMutationData>(UPDATE_USER);

  const handleImageResizeAndUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let fileInput = false;
    if (e.target.files) {
      fileInput = true;
    }

    if (fileInput) {
      setIsPending(true);

      try {
        Resizer.imageFileResizer(
          e.target.files![0],
          300,
          300,
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

              setAvatar({ url: res.data.url, publicId: res.data.public_id });

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
      } finally {
        setIsPending(false);
      }
    }
  };

  const handleImageDelete = async (publicId: string) => {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_REST_URL + '/image/remove',
        { publicId },
        {
          headers: {
            Authorization: authCtx.user?.token,
          },
        }
      );

      setAvatar(null);

      toast.success('Image deleted successfully');
    } catch (error) {
      console.log('Cloudinary error', error);
      toast.error('Failed to delete image', {
        description: (error as Error).message,
      });
    }
  };

  const onSubmit = async (data: profileFormPayload) => {
    setIsPending(true);

    await updateProfile({
      variables: {
        input: {
          ...data,
          email: authCtx.user?.email,
          image: avatar ? omitDeep(avatar, '__typename') : undefined,
        },
      },
      refetchQueries: [{ query: MY_PROFILE }],
      onCompleted: () => {
        router.refresh();
        toast.success('Profile updated successfully');
      },
      onError: (error) => {
        toast.error('Failed to update profile', {
          description: error.message,
        });
      },
    });

    setIsPending(false);
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>Update your information</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <div className="grid gap-3 place-items-center">
              <Avatar className="size-32 relative">
                <AvatarImage src={avatar?.url} alt="avatar" />
                <AvatarFallback className="text-5xl">
                  {initData.username[0].toUpperCase()}
                </AvatarFallback>
                <div className="absolute bottom-0 w-full h-8 bg-primary-foreground opacity-70 flex flex-col items-center justify-center">
                  {!avatar && (
                    <>
                      <Label htmlFor="upload">Upload</Label>
                      <Input
                        id="upload"
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleImageResizeAndUpload}
                        hidden
                        className="hidden"
                      />
                    </>
                  )}
                  {avatar && (
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => handleImageDelete(avatar.publicId)}
                    >
                      <Trash2 className="size-4 text-black" />
                    </Button>
                  )}
                </div>
              </Avatar>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                {...register('email')}
                disabled
                className="w-full"
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="location">Username</Label>
              <Input
                id="username"
                {...register('username')}
                className="w-full"
              />
              {errors.username && (
                <span className="text-red-500">{errors.username.message}</span>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">About me</Label>
              <Textarea
                id="about"
                {...register('about')}
                placeholder="Tell us about yourself"
                className="min-h-32"
              />
              {errors.about && (
                <span className="text-red-500">{errors.about.message}</span>
              )}
            </div>

            <Button type="submit">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
