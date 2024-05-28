'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { EventFormPayload, eventFormSchema } from '@/schemas/event-form';
import { Event } from '@/types/event';
import { TImage } from '@/types/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
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
  // console.log(initData);
  const [images, setImages] = useState<TImage[]>(initData?.images || []);
  const [locationInput, setLocationInput] = useState(initData?.location || '');
  const [locationResults, setLocationResults] = useState<
    google.maps.places.Place[]
  >([]);
  const [locationHasFocus, setLocationHasFocus] = useState(false);

  const router = useRouter();

  const commandRef = useRef<HTMLDivElement>(null);
  const placesLib = useMapsLibrary('places');

  const address = useRef<string>(initData?.address ?? '');
  const lat = useRef<number>(initData?.lat ?? 0);
  const lng = useRef<number>(initData?.lng ?? 0);

  const [debouncedInput] = useDebounce(locationInput, 500);

  useOnClickOutside(commandRef, () => {
    if (locationHasFocus) {
      setLocationInput('');
      address.current = '';
      lat.current = 0;
      lng.current = 0;
    }

    setLocationHasFocus(false);
    setLocationResults([]);
  });

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

  useEffect(() => {
    if (!placesLib || !debouncedInput || !locationHasFocus) return;

    placesLib.Place.searchByText({
      textQuery: debouncedInput,
      fields: ['displayName', 'location', 'formattedAddress'],
      maxResultCount: 5,
    }).then((res) => {
      if (res.places.length) {
        setLocationResults(res.places);
      }
    });
  }, [placesLib, debouncedInput, locationHasFocus]);

  const handleEventSubmit = async (data: EventFormPayload) => {
    if (!locationInput || !lat.current || !lng.current || !address.current) {
      toast.error('Please select a location');
      return;
    }

    onSubmit({
      ...data,
      images,
      location: locationInput,
      lat: lat.current,
      lng: lng.current,
      address: address.current,
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
                <Command
                  ref={commandRef}
                  className="rounded-lg border shadow-none relative overflow-visible"
                >
                  <CommandInput
                    value={locationInput}
                    onClick={() => setLocationHasFocus(true)}
                    onValueChange={(text) => {
                      setLocationInput(text);
                    }}
                    placeholder="Enter an address to search..."
                  />
                  <CommandList className="absolute top-full inset-x-0 bg-primary-foreground dark:bg-secondary">
                    {locationHasFocus &&
                      locationInput &&
                      locationResults.length === 0 && (
                        <CommandEmpty>No location found.</CommandEmpty>
                      )}
                    {locationHasFocus &&
                      locationResults.map((result) => {
                        return (
                          <CommandItem
                            key={result.id}
                            value={`${result.displayName} - ${result.formattedAddress}`}
                            onSelect={() => {
                              setLocationHasFocus(false);
                              setLocationInput(result.displayName!);
                              lat.current = result.location?.lat() ?? 0;
                              lng.current = result.location?.lng() ?? 0;
                              address.current = result.formattedAddress!;
                            }}
                          >
                            {`${result.displayName} - ${result.formattedAddress}`}
                          </CommandItem>
                        );
                      })}
                  </CommandList>
                </Command>
                <p className="text-xs text-muted-foreground">
                  {address.current}
                </p>
                {/* <Input
                  id="location"
                  {...register('location')}
                  className="w-full"
                />
                {errors.location && (
                  <span className="text-red-500">
                    {errors.location.message}
                  </span>
                )} */}
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
