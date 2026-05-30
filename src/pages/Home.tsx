import GroupMatch from "../components/GroupMatch";
import GroupTable from "../components/GroupTable";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="">
      <Header />
      <div className="flex flex-col h-[calc(100vh-60px)] items-center justify-center">
        <div className="space-y-6 max-w-6xl">
          <div className="grid grid-cols-3 gap-4">
            <GroupMatch />
            <GroupMatch />
            <GroupMatch />
          </div>
          <GroupTable />
        </div>
      </div>
    </div>
  );
}