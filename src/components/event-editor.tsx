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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORIES } from '@/config';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

type Props = {
  isPending: boolean;
  onSubmit: (data: EventFormPayload) => Promise<void>;
  onCancel?: () => void;
  initData?: Event;
};

// const defaultValues = {
//   name: 'Test event 1',
//   date: '2025-03-21',
//   time: '13:00',
//   description: 'Test description',
// };
const defaultValues = {
  name: '',
  location: '',
  date: '',
  time: '',
  category: '',
  description: '',
};

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

  const form = useForm<EventFormPayload>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initData
      ? {
          ...initData,
          date: format(new Date(initData.datetime), 'yyyy-MM-dd'),
          time: format(new Date(initData.datetime), 'HH:mm'),
        }
      : defaultValues,
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
    if (!lat.current || !lng.current || !address.current) {
      toast.error('Address not found. Please select a different location');
      return;
    }

    onSubmit({
      ...data,
      images,
      lat: lat.current,
      lng: lng.current,
      address: address.current,
    });
  };

  const handleCancel = () => {
    form.reset();
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleEventSubmit)}
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
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Name of the event"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="location"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <>
                          <Command
                            ref={commandRef}
                            className="h-fit rounded-lg border border-input shadow-none relative overflow-visible"
                          >
                            <CommandInput
                              value={locationInput}
                              onClick={() => setLocationHasFocus(true)}
                              onValueChange={(text) => {
                                setLocationInput(text);
                              }}
                              placeholder="Enter name or address to search"
                            />
                            <CommandList className="absolute top-full inset-x-0 bg-primary-foreground dark:bg-secondary">
                              {locationHasFocus &&
                                locationInput &&
                                locationResults.length === 0 && (
                                  <CommandEmpty>
                                    No location found.
                                  </CommandEmpty>
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
                                        lat.current =
                                          result.location?.lat() ?? 0;
                                        lng.current =
                                          result.location?.lng() ?? 0;
                                        address.current =
                                          result.formattedAddress!;
                                        field.onChange(result.displayName!);
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
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-3 gap-4 items-start">
                  <FormField
                    name="date"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="date">Date</FormLabel>
                        <FormControl>
                          <Input
                            id="date"
                            type="date"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="time"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="time">Time</FormLabel>
                        <FormControl>
                          <Input
                            id="time"
                            type="time"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="category"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="category">Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="description">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          id="description"
                          placeholder="Description of the event"
                          {...field}
                          className="min-h-32"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
    </Form>
  );
};

export default EventEditor;
