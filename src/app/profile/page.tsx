import ProfileForm from '@/components/profile-form';
import { MY_PROFILE } from '@/graphql/queries';
import { getApolloClient } from '@/lib/apollo-client';
import { MyProfileQueryData } from '@/types/user';

const ProfilePage = async () => {
  const { data, error } = await getApolloClient().query<MyProfileQueryData>({
    query: MY_PROFILE,
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl my-8">
      <ProfileForm initData={data?.myProfile} />
    </div>
  );
};

export default ProfilePage;
