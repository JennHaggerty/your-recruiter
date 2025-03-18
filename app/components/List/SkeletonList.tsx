import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
} from "@heroui/react";
import React from "react";

const columns = [
  { name: "Details", uid: "name" },
  { name: "Role", uid: "role" },
  { name: "Salary", uid: "salary" },
  { name: "Stage", uid: "stage" },
  { name: "Cover Letter", uid: "coverLetter" },
  { name: "Actions", uid: "actions" },
];

const items = Array.apply(null, Array(15)).map((u, i) => {
  return { i };
});

const SkeletonList = () => {
  return (
    <div className="flex flex-col w-full gap-10">
      <div className="w-full sm:max-w-[44%]">
        <Skeleton className="w-full rounded-lg">
          <div className="h-10 w-full rounded-lg bg-secondary" />
        </Skeleton>
      </div>

      <Table isStriped aria-label="Loading items, please wait">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.i}>
              {(columnKey) => (
                <TableCell className="p-4">
                  <Skeleton className="w-full rounded-lg ">
                    <div className="h-8 w-full rounded-lg bg-secondary" />
                  </Skeleton>
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="w-full sm:max-w-[40%] mx-auto">
        <Skeleton className="w-full rounded-lg">
          <div className="h-10 w-full rounded-lg bg-secondary" />
        </Skeleton>
      </div>
    </div>
  );
};

export default SkeletonList;
