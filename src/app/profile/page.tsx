import ProfileForm from '@/components/profile-form';
import { MY_PROFILE, MyProfileQueryData } from '@/graphql/queries';
import { getApolloClient } from '@/lib/apollo-client';

const ProfilePage = async () => {
  const { data, error } = await getApolloClient().query<MyProfileQueryData>({
    query: MY_PROFILE,
    fetchPolicy: 'no-cache',
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl my-8">
      <ProfileForm initData={data?.myProfile} />
    </div>
  );
};

export default ProfilePage;
