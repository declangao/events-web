'use client';

import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';
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
import { CREATE_EVENT } from '@/graphql/mutations';
import { EventFormPayload, eventFormSchema } from '@/schemas/event-form';
import { TImage } from '@/types/image';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const PostEvent = () => {
  const [images, setImages] = useState<TImage[]>([]);
  const [isPending, setIsPending] = useState(false);

  const [createEvent] = useMutation(CREATE_EVENT);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormPayload>({
    resolver: zodResolver(eventFormSchema),
  });

  const onSubmit = async (data: EventFormPayload) => {
    setIsPending(true);

    try {
      const datetime = new Date(data.date + 'T' + data.time).toISOString();

      await createEvent({
        variables: {
          input: {
            name: data.name,
            location: data.location,
            description: data.description,
            datetime: datetime,
            images: images,
          },
        },
      });

      reset();
      setImages([]);
      toast.success('Event posted successfully');
    } catch (error) {
      toast.error('Failed to post event', {
        description: (error as Error).message,
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4 my-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8"
      >
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Post your own event and get people to join you!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="w-full"
                  />
                  {errors.name && (
                    <span className="text-red-500">{errors.name.message}</span>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    className="w-full"
                  />
                  {errors.location && (
                    <span className="text-red-500">
                      {errors.location.message}
                    </span>
                  )}
                </div>

                {/* <div className="grid gap-3">
                  <Label htmlFor="datetime">Date</Label>
                  <Input
                    id="datetime"
                    type="datetime-local"
                    {...register('datetime')}
                    className="w-full"
                  />
                  {errors.datetime && (
                    <span className="text-red-500">
                      {errors.datetime.message}
                    </span>
                  )}
                </div> */}

                <div className="grid grid-cols-2 gap-4 items-start">
                  <div className="grid gap-3">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      {...register('date')}
                      className="w-full"
                    />
                    {errors.date && (
                      <span className="text-red-500">
                        {errors.date.message}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      {...register('time')}
                      className="w-full"
                    />
                    {errors.time && (
                      <span className="text-red-500">
                        {errors.time.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    className="min-h-32"
                  />
                  {errors.description && (
                    <span className="text-red-500">
                      {errors.description.message}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <div className="grid gap-4 p-8">
              <Button type="submit" disabled={isPending} className="w-full">
                Post
              </Button>
              {/* TODO: Delete uploaaded images when user cancels or navigates away */}
              <Button
                type="button"
                variant="secondary"
                disabled={isPending}
                onClick={() => router.back()}
                className="w-full"
              >
                Cancel
              </Button>
            </div>

            {/* <CardContent></CardContent> */}
          </Card>

          <ImageUpload images={images} setImages={setImages} />
        </div>
      </form>

      {/* <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm">
          Discard
        </Button>
        <Button size="sm">Save Product</Button>
      </div> */}
    </div>
  );
};

export default PostEvent;
