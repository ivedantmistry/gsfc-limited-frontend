// src/components/admin/UsersTable.tsx
"use client";

import React from "react";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  const router = useRouter();
  const handleRowClick = (userId: number) => {
    router.push(`/dashboard/users/${userId}`);
  };
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Designation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              onClick={() => handleRowClick(user.id)}
              className="cursor-pointer hover:bg-slate-50"
            >
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {/* Map over the groups to display them */}
                {user.groups.map((group) => (
                  <Badge key={group.name} variant="outline" className="mr-1">
                    {group.name}
                  </Badge>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
