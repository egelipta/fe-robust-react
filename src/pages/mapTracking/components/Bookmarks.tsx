import { useCallback, useState } from "react";
import { Bookmark, CirclePlus, Trash } from "lucide-react";

import {
  createBookmarkApiBookmarkPost,
  deleteBookmarkApiBookmarkBookmarkIdDelete,
  getBookmarksApiBookmarkGet,
} from "@/api/base/sdk.gen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export type BookmarkData = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  zoom: number;
  vessel: string;
  date_created: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (bookmark: BookmarkData) => void;
  selectedVesselName?: string | null;
  defaultLat?: number;
  defaultLon?: number;
  defaultZoom?: number;
};

export default function Bookmarks({
  open,
  onOpenChange,
  onSelect,
  selectedVesselName,
  defaultLat,
  defaultLon,
  defaultZoom,
}: Props) {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getBookmarksApiBookmarkGet();
      const r = (resp as any)?.data ?? resp;

      if (Array.isArray(r?.data)) {
        setBookmarks(r.data);
      } else {
        setBookmarks([]);
      }
    } catch (err) {
      console.error("Failed to fetch bookmarks", err);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    if (!selectedVesselName) {
      toast.error("Pilih vessel dulu");
      return;
    }

    const lat = Number(defaultLat);
    const lon = Number(defaultLon);
    const zoom = Number(defaultZoom);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      !Number.isFinite(zoom)
    ) {
      toast.error("Posisi map tidak valid");
      return;
    }

    setCreating(true);
    try {
      await createBookmarkApiBookmarkPost({
        body: {
          name,
          lat,
          lon,
          zoom,
          vessel: selectedVesselName,
        },
      });

      toast.success("Berhasil ditambahkan");
      setNewName("");
      await loadBookmarks();
    } catch (err) {
      console.error("Failed to create bookmark", err);
      toast.error("Gagal menambahkan bookmark");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!Number.isFinite(id)) return;

    setDeletingId(id);
    try {
      await deleteBookmarkApiBookmarkBookmarkIdDelete({
        path: { bookmark_id: id },
      });

      toast.success("Bookmark dihapus");
      await loadBookmarks();
    } catch (err) {
      console.error("Failed to delete bookmark", err);
      toast.error("Gagal menghapus bookmark");
    } finally {
      setDeletingId((cur) => (cur === id ? null : cur));
    }
  };

  return (
    <div className="relative flex items-start gap-3">
      <Button
        onClick={async () => {
          const next = !open;
          onOpenChange(next);
          if (next) await loadBookmarks();
        }}
        className={`w-10 h-10 rounded-full bg-[var(--navbar)] text-[var(--text-primary)] shadow-lg
          flex items-center justify-center transition-all duration-200
          hover:bg-primary hover:text-white
          ${open ? "bg-primary text-white shadow-none" : ""}`}
      >
        <Bookmark size={20} />
      </Button>

      <div
        className={`absolute left-12 top-0 transition-all duration-300 ease-in-out
          ${open ? "w-72 opacity-100 pointer-events-auto" : "w-0 opacity-0 pointer-events-none"}`}
      >
        <div className="bg-[var(--background)] shadow-xl rounded-md p-2 max-h-80 overflow-hidden">
          <div className="space-y-1 overflow-y-auto max-h-72 p-2">
            <span>Bookmarks</span>
            <div className="flex items-center gap-2 mt-2">
              <Input
                placeholder="bookmark name..."
                className="h-9"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={creating}
              />
              <Button
                size={"sm"}
                onClick={handleCreate}
                disabled={creating || !newName.trim()}
              >
                <CirclePlus />
              </Button>
            </div>
            <ScrollArea className="h-[180px] mt-2 pr-2">
              {bookmarks.map((b) => (
                <div
                  onClick={() => onSelect(b)}
                  key={b.id}
                  className="px-3 py-2 rounded-lg cursor-pointer hover:bg-muted transition mt-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{b.name}</div>
                      {/* <div className="text-xs text-muted-foreground">
                      {Number(b.lat).toFixed(3)}, {Number(b.lon).toFixed(3)}
                    </div> */}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(b.id);
                      }}
                      disabled={deletingId === b.id}
                      className={
                        deletingId === b.id
                          ? "opacity-50 cursor-not-allowed"
                          : "opacity-80 hover:opacity-100"
                      }
                      aria-label={`delete bookmark ${b.name}`}
                      title="Delete"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {loading && (
            <div className="p-3 text-sm text-muted-foreground">
              Loading bookmarks...
            </div>
          )}

          {!loading && bookmarks.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground">
              No bookmarks
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
