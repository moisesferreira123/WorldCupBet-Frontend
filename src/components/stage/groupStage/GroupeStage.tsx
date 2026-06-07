import GroupMatch from "./GroupMatchs";
import GroupTable from "./GroupTable";
import PaginationDots from "./PaginationDots";

export default function GroupStage() {
  return (
    <div className="space-y-4 max-w-6xl">
      <PaginationDots />
      <h1 className="font-bold text-center text-2xl uppercase">GRUPO A</h1>
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <GroupMatch />
          <GroupMatch />
          <GroupMatch />
        </div>
        <GroupTable />
      </div>
    </div>
  );
}