'use client';

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
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const PostEvent = () => {
  const [createEvent] = useMutation(CREATE_EVENT);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormPayload>({
    resolver: zodResolver(eventFormSchema),
  });

  const onSubmit = async (data: EventFormPayload) => {
    try {
      console.log(data);
      const datetime = new Date(data.date + 'T' + data.time).toISOString();

      await createEvent({
        variables: {
          input: {
            name: data.name,
            location: data.location,
            description: data.description,
            datetime: datetime,
            images: data.images,
          },
        },
      });

      toast.success('Event posted successfully');
    } catch (error) {
      toast.error('Failed to post event', {
        description: (error as Error).message,
      });
    }
  };

  return (
    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 my-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8"
      >
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
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
          <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
            <CardHeader>
              <CardTitle>Event Images</CardTitle>
              <CardDescription>
                Upload some images to help people get to know your event!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Image
                  alt="Product image"
                  className="aspect-square w-full rounded-md object-cover"
                  height="300"
                  src="/placeholder.svg"
                  width="300"
                />
                <div className="grid grid-cols-3 gap-2">
                  <button>
                    <Image
                      alt="Product image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="84"
                      src="https://res.cloudinary.com/deyam11l5/image/upload/v1715194153/1715194153300.jpg"
                      width="84"
                    />
                  </button>
                  <button>
                    <Image
                      alt="Product image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="84"
                      src="https://res.cloudinary.com/deyam11l5/image/upload/v1715035479/1715035479656.jpg"
                      width="84"
                    />
                  </button>
                  <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Upload</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button
          type="submit"
          // onClick={() =>
          //   console.log(document.querySelector('#datetime')!.value)
          // }
        >
          Post
        </Button>
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
