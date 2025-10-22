"use client";
import { Eye } from "lucide-react";
import DataTable from "./DataTable";

export type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

type MessageTableProps = {
  data: Message[];
  onView: (msg: Message) => void;
};

export default function MessagesTable({ data, onView }: MessageTableProps) {
  return (
    <DataTable
      data={data}
      pageSize={20}
      searchable
      columns={[
        { key: "name", label: "Nom", sortable: true },
        { key: "email", label: "Email", sortable: true },
        {
          key: "createdAt",
          label: "Reçu le",
          sortable: true,
          render: (msg) => new Date(msg.createdAt).toLocaleString(),
        },
        {
          key: "actions",
          label: "Actions",
          render: (msg) => (
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => onView(msg)}
                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          ),
        },
      ]}
      emptyMessage="Aucun message pour le moment."
    />
  );
}
