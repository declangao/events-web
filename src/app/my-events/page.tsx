import MyEventsGrid from '@/components/my-events-grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MyEventsGridType } from '@/types/event';

const MyEventsPage = () => {
  return (
    <div className="container my-8">
      <Tabs defaultValue="published" className="">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="published" className="">
            Published Events
          </TabsTrigger>
          <TabsTrigger value="registered" className="">
            Registered Events
          </TabsTrigger>
        </TabsList>
        <TabsContent value="published">
          <MyEventsGrid type={MyEventsGridType.PUBLISHED} />
        </TabsContent>
        <TabsContent value="registered">
          <MyEventsGrid type={MyEventsGridType.REGISTERED} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyEventsPage;
