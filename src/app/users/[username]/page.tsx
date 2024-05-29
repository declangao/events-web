import EventCard from '@/components/event-card';
import { PUBLIC_PROFILE, PublicProfileQueryData } from '@/graphql/queries';
import { getApolloClient } from '@/lib/apollo-client';

type Props = {
  params: {
    username: string;
  };
};

const UserPage = async ({ params }: Props) => {
  const { data, error } = await getApolloClient().query<
    PublicProfileQueryData,
    { username: string }
  >({
    query: PUBLIC_PROFILE,
    variables: { username: params.username },
  });

  if (!data) return <div>User not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 grid gap-4">
      <h3 className="text-3xl font-bold text-center">{`${data?.publicProfile?.username}'s events`}</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.publicProfile.createdEvents?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default UserPage;
