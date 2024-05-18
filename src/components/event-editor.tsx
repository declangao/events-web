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
import { EventFormPayload, eventFormSchema } from '@/schemas/event-form';
import { Event } from '@/types/event';
import { TImage } from '@/types/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ImageUpload from './image-upload';

type Props = {
  isPending: boolean;
  onSubmit: (data: EventFormPayload) => Promise<void>;
  onCancel?: () => void;
  initData?: Event;
};

// const defaultValues = {
//   name: 'Test event 1',
//   location: 'Test location',
//   date: '2025-03-21',
//   time: '13:00',
//   description: 'Test description',
// };

const EventEditor = ({ isPending, onSubmit, initData, onCancel }: Props) => {
  const [images, setImages] = useState<TImage[]>(initData?.images || []);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormPayload>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initData
      ? {
          ...initData,
          date: format(new Date(initData.datetime), 'yyyy-MM-dd'),
          time: format(new Date(initData.datetime), 'HH:mm'),
        }
      : {},
  });

  const handleEventSubmit = async (data: EventFormPayload) => {
    onSubmit({
      ...data,
      images,
    });
  };

  const handleCancel = () => {
    reset();
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleEventSubmit)}
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
                    <span className="text-red-500">{errors.date.message}</span>
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
                    <span className="text-red-500">{errors.time.message}</span>
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
        <Card className="order-last md:order-first">
          <div className="grid gap-4 p-8">
            <Button type="submit" disabled={isPending} className="w-full">
              {initData ? 'Update Event' : 'Publish Event'}
            </Button>

            {/* TODO: Delete uploaaded images when user cancels or navigates away */}
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={handleCancel}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </Card>

        <ImageUpload images={images} setImages={setImages} />
      </div>
    </form>
  );
};

export default EventEditor;
