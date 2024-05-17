import MyEventsGrid from '@/components/my-events-grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MyEventsGridType } from '@/types/event';

const MyEventsPage = () => {
  return (
    <div className="my-8">
      <Tabs defaultValue="registered" className="">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="registered">Registered Events</TabsTrigger>
          <TabsTrigger value="published">Published Events</TabsTrigger>
        </TabsList>
        <TabsContent value="registered">
          <MyEventsGrid type={MyEventsGridType.REGISTERED} />
        </TabsContent>
        <TabsContent value="published">
          <MyEventsGrid type={MyEventsGridType.PUBLISHED} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyEventsPage;
