"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import MessagesTable, { Message } from "@/components/Admin/Tables/MessagesTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Admin/ui/dialog";
import { Button } from "@/components/Admin/ui/button";
import DataTableToolbar from "@/components/Admin/Tables/DataTableToolbar";

/* ---------------------------------------------
   Dialog interne réutilisable : View
---------------------------------------------- */
function MessageViewDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message?: Message | null;
}) {
  const { open, onOpenChange, message } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du message</DialogTitle>
        </DialogHeader>

        {message ? (
          <div className="space-y-4 pt-2">
            <div>
              <p className="text-sm text-gray-500">Nom</p>
              <p className="font-medium">{message.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{message.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sujet</p>
              <p className="font-medium">{message.subject}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Message</p>
              <p className="whitespace-pre-line">{message.message}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Reçu le</p>
              <p className="font-medium">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Aucun message sélectionné</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------------------------------------------
   Page principale : liste des messages
---------------------------------------------- */
export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Toolbar : recherche
  const [search, setSearch] = useState("");

  // Dialog
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<Message | null>(null);

  /* -------- Fetch list -------- */
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", { cache: "no-store" });
      if (!res.ok) throw new Error("Erreur API");
      const result = await res.json();
      setMessages(result.data || []);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Erreur inconnue");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  /* -------- View handler -------- */
  const handleViewOpen = (msg: Message) => {
    setSelected(msg);
    setOpenView(true);
  };

  /* -------- Filtrage côté client -------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q)
    );
  }, [messages, search]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      {/* Toolbar */}
      <DataTableToolbar
        title="Messages reçus"
        searchable
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* États de liste */}
      {loading ? (
        <div className="bg-white shadow-md rounded-xl p-8 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Chargement des messages...</span>
        </div>
      ) : error ? (
        <div className="bg-white shadow-md rounded-xl p-6 text-red-600">
          Erreur : {error}
          <div className="mt-3">
            <Button variant="outline" onClick={fetchMessages}>
              Réessayer
            </Button>
          </div>
        </div>
      ) : (
        <MessagesTable data={filtered} onView={handleViewOpen} />
      )}

      {/* Dialog VIEW */}
      <MessageViewDialog
        open={openView}
        onOpenChange={setOpenView}
        message={selected}
      />
    </div>
  );
}
