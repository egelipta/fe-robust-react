import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, List, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Image } from "antd";
import {
  deletePersonnelPhotoApiVesselVesselIdPersonnelPhotoPhotoTypeDelete,
  updatePersonnelPhotoApiVesselVesselIdPersonnelPhotoPut,
  updateVesselPersonnelApiVesselVesselIdPersonnelPut,
} from "@/api/base/sdk.gen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type PersonelForm = {
  nahkoda: string;
  sid_nahkoda: string;
  sid_mualim1: string;
  sid_mualim2: string;
  mualim1: string;
  mualim2: string;
  kkm: string;
  masinis2: string;
  masinis3: string;
  sid_kkm: string;
  sid_masinis2: string;
  sid_masinis3: string;
  no_telp_nahkoda: string;
  no_telp_mualim1: string;
  no_telp_mualim2: string;
  no_telp_kkm: string;
  no_telp_masinis2: string;
  no_telp_masinis3: string;
};

const initialPersonelForm: PersonelForm = {
  nahkoda: "",
  sid_nahkoda: "",
  sid_mualim1: "",
  sid_mualim2: "",
  mualim1: "",
  mualim2: "",
  kkm: "",
  masinis2: "",
  masinis3: "",
  sid_kkm: "",
  sid_masinis2: "",
  sid_masinis3: "",
  no_telp_nahkoda: "",
  no_telp_mualim1: "",
  no_telp_mualim2: "",
  no_telp_kkm: "",
  no_telp_masinis2: "",
  no_telp_masinis3: "",
};

const normalizeNullable = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

type Props = {
  vesselId: number;
  personnel?: VesselPersonnelData | null;
  onUpdated: () => Promise<void> | void;
};

type PersonelViewMode = "grid" | "list";

type PersonelRoleId =
  | "nahkoda"
  | "mualim1"
  | "mualim2"
  | "kkm"
  | "masinis2"
  | "masinis3";

type PersonnelMember = {
  name: string | null;
  sid: string | null;
  phone: string | null;
  photo_url: string | null;
};

export type VesselPersonnelData = {
  vessel_id: number;
  vessel_name: string;
  personnel: Partial<Record<PersonelRoleId, PersonnelMember>>;
};

type PersonelItem = {
  id: PersonelRoleId;
  title: string;
  name?: string;
  sid?: string;
  telp?: string;
  imageUrl?: string;
};

const formatPersonelValue = (value?: string | null) => {
  if (value == null) return "-";
  const trimmed = value.trim();
  return trimmed.length ? trimmed : "-";
};

const getInitials = (value?: string) => {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "?";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase();
};

const AVATAR_BG = [
  "#0ea5e9",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#ef4444",
  "#14b8a6",
  "#eab308",
  "#64748b",
];

const pickAvatarBg = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_BG[hash % AVATAR_BG.length];
};

const buildAvatarDataUrl = (text: string, bg: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="${bg}"/><text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="28" font-weight="700" fill="#ffffff">${text}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const getPersonelAvatarSrc = (item: PersonelItem) => {
  if (item.imageUrl && item.imageUrl.trim().length) return item.imageUrl;
  const initials = getInitials(item.name || item.title);
  const bg = pickAvatarBg(`${item.id}:${item.name ?? ""}`);
  return buildAvatarDataUrl(initials, bg);
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

type PersonelPhotoOverride = {
  file: File;
  previewUrl: string;
};

type PersonnelPhotoField =
  | "photo_nahkoda"
  | "photo_mualim1"
  | "photo_mualim2"
  | "photo_kkm"
  | "photo_masinis2"
  | "photo_masinis3";

const ROLE_TO_PHOTO_KEY: Record<PersonelRoleId, PersonnelPhotoField> = {
  nahkoda: "photo_nahkoda",
  mualim1: "photo_mualim1",
  mualim2: "photo_mualim2",
  kkm: "photo_kkm",
  masinis2: "photo_masinis2",
  masinis3: "photo_masinis3",
};

const PERSONEL_EDIT_SECTIONS: Array<{
  id: PersonelRoleId;
  title: string;
  nameKey: keyof PersonelForm;
  sidKey: keyof PersonelForm;
  telpKey: keyof PersonelForm;
}> = [
  {
    id: "nahkoda",
    title: "Nahkoda",
    nameKey: "nahkoda",
    sidKey: "sid_nahkoda",
    telpKey: "no_telp_nahkoda",
  },
  {
    id: "mualim1",
    title: "Mualim I",
    nameKey: "mualim1",
    sidKey: "sid_mualim1",
    telpKey: "no_telp_mualim1",
  },
  {
    id: "mualim2",
    title: "Mualim II",
    nameKey: "mualim2",
    sidKey: "sid_mualim2",
    telpKey: "no_telp_mualim2",
  },
  {
    id: "kkm",
    title: "KKM",
    nameKey: "kkm",
    sidKey: "sid_kkm",
    telpKey: "no_telp_kkm",
  },
  {
    id: "masinis2",
    title: "Masinis II",
    nameKey: "masinis2",
    sidKey: "sid_masinis2",
    telpKey: "no_telp_masinis2",
  },
  {
    id: "masinis3",
    title: "Masinis III",
    nameKey: "masinis3",
    sidKey: "sid_masinis3",
    telpKey: "no_telp_masinis3",
  },
];

function PersonelInfoRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value?: string;
  valueClassName?: string;
}) {
  const formatted = formatPersonelValue(value);
  return (
    <div className="grid grid-cols-[84px_1fr] gap-x-2 min-w-0">
      <div className="text-muted-foreground">{label}</div>
      <div
        className={cn("min-w-0 truncate", valueClassName)}
        title={formatted === "-" ? undefined : formatted}
      >
        {formatted}
      </div>
    </div>
  );
}

export default function VesselPersonelSection({
  vesselId,
  personnel,
  onUpdated,
}: Props) {
  const [openPersonelDialog, setOpenPersonelDialog] = useState(false);
  const [savingPersonel, setSavingPersonel] = useState(false);
  const [deletingPhotoRoleId, setDeletingPhotoRoleId] =
    useState<PersonelRoleId | null>(null);
  const [viewMode, setViewMode] = useState<PersonelViewMode>("grid");
  const [personelForm, setPersonelForm] =
    useState<PersonelForm>(initialPersonelForm);
  const [personelPhotoOverrides, setPersonelPhotoOverrides] = useState<
    Partial<Record<PersonelRoleId, PersonelPhotoOverride>>
  >({});

  const photoOverridesRef = useRef(personelPhotoOverrides);
  useEffect(() => {
    photoOverridesRef.current = personelPhotoOverrides;
  }, [personelPhotoOverrides]);

  useEffect(() => {
    return () => {
      Object.values(photoOverridesRef.current).forEach((override) => {
        if (!override) return;
        URL.revokeObjectURL(override.previewUrl);
      });
    };
  }, []);

  const memberByRole = useMemo(() => {
    return (roleId: PersonelRoleId): PersonnelMember => {
      const member = personnel?.personnel?.[roleId];
      return {
        name: member?.name ?? null,
        sid: member?.sid ?? null,
        phone: member?.phone ?? null,
        photo_url: member?.photo_url ?? null,
      };
    };
  }, [personnel]);

  const handlePersonelFormChange = <K extends keyof PersonelForm>(
    key: K,
    value: PersonelForm[K],
  ) => {
    setPersonelForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleOpenPersonelEdit = () => {
    const nahkoda = memberByRole("nahkoda");
    const mualim1 = memberByRole("mualim1");
    const mualim2 = memberByRole("mualim2");
    const kkm = memberByRole("kkm");
    const masinis2 = memberByRole("masinis2");
    const masinis3 = memberByRole("masinis3");

    setPersonelForm({
      nahkoda: nahkoda.name ?? "",
      sid_nahkoda: nahkoda.sid ?? "",
      no_telp_nahkoda: nahkoda.phone ?? "",
      mualim1: mualim1.name ?? "",
      sid_mualim1: mualim1.sid ?? "",
      no_telp_mualim1: mualim1.phone ?? "",
      mualim2: mualim2.name ?? "",
      sid_mualim2: mualim2.sid ?? "",
      no_telp_mualim2: mualim2.phone ?? "",
      kkm: kkm.name ?? "",
      sid_kkm: kkm.sid ?? "",
      no_telp_kkm: kkm.phone ?? "",
      masinis2: masinis2.name ?? "",
      sid_masinis2: masinis2.sid ?? "",
      no_telp_masinis2: masinis2.phone ?? "",
      masinis3: masinis3.name ?? "",
      sid_masinis3: masinis3.sid ?? "",
      no_telp_masinis3: masinis3.phone ?? "",
    });
    setOpenPersonelDialog(true);
  };

  const handlePersonelPhotoChange = async (
    roleId: PersonelRoleId,
    file?: File,
  ) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error("Ukuran gambar maksimal 2MB");
      return;
    }

    try {
      await readFileAsDataUrl(file);
      const previewUrl = URL.createObjectURL(file);
      setPersonelPhotoOverrides((prev) => {
        const current = prev[roleId];
        if (current) URL.revokeObjectURL(current.previewUrl);
        return { ...prev, [roleId]: { file, previewUrl } };
      });
    } catch (err) {
      console.error("Failed to read personel photo:", err);
      toast.error("Gagal memuat gambar");
    }
  };

  const handleRemovePersonelPhoto = (roleId: PersonelRoleId) => {
    setPersonelPhotoOverrides((prev) => {
      const next = { ...prev };
      const current = next[roleId];
      if (current) URL.revokeObjectURL(current.previewUrl);
      delete next[roleId];
      return next;
    });
  };

  const getPersonelDisplayImageUrl = (roleId: PersonelRoleId) => {
    const override = personelPhotoOverrides[roleId];
    if (override?.previewUrl) return override.previewUrl;
    const url = memberByRole(roleId).photo_url ?? "";
    if (url.trim().length) return url;
    return "";
  };

  const handleDeletePersonelPhoto = async (roleId: PersonelRoleId) => {
    if (!Number.isInteger(vesselId) || vesselId <= 0) {
      toast.error("Vessel ID tidak valid");
      return;
    }

    const serverUrl = memberByRole(roleId).photo_url;
    if (!serverUrl || !serverUrl.trim().length) return;

    const confirmed = window.confirm("Yakin ingin menghapus foto ini?");
    if (!confirmed) return;

    try {
      setDeletingPhotoRoleId(roleId);
      await deletePersonnelPhotoApiVesselVesselIdPersonnelPhotoPhotoTypeDelete({
        path: { vessel_id: vesselId, photo_type: roleId },
      });
      toast.success("Foto berhasil dihapus");
      await onUpdated();
    } catch (err) {
      console.error("Failed to delete personnel photo:", err);
      toast.error("Gagal menghapus foto");
    } finally {
      setDeletingPhotoRoleId(null);
    }
  };

  const handleUpdatePersonel = async () => {
    if (savingPersonel) return;
    if (!Number.isInteger(vesselId) || vesselId <= 0) {
      toast.error("Vessel ID tidak valid");
      return;
    }

    try {
      setSavingPersonel(true);
      await updateVesselPersonnelApiVesselVesselIdPersonnelPut({
        path: {
          vessel_id: vesselId,
        },
        body: {
          nahkoda: normalizeNullable(personelForm.nahkoda),
          sid_nahkoda: normalizeNullable(personelForm.sid_nahkoda),
          sid_mualim1: normalizeNullable(personelForm.sid_mualim1),
          sid_mualim2: normalizeNullable(personelForm.sid_mualim2),
          mualim1: normalizeNullable(personelForm.mualim1),
          mualim2: normalizeNullable(personelForm.mualim2),
          kkm: normalizeNullable(personelForm.kkm),
          masinis2: normalizeNullable(personelForm.masinis2),
          masinis3: normalizeNullable(personelForm.masinis3),
          sid_kkm: normalizeNullable(personelForm.sid_kkm),
          sid_masinis2: normalizeNullable(personelForm.sid_masinis2),
          sid_masinis3: normalizeNullable(personelForm.sid_masinis3),
          no_telp_nahkoda: normalizeNullable(personelForm.no_telp_nahkoda),
          no_telp_mualim1: normalizeNullable(personelForm.no_telp_mualim1),
          no_telp_mualim2: normalizeNullable(personelForm.no_telp_mualim2),
          no_telp_kkm: normalizeNullable(personelForm.no_telp_kkm),
          no_telp_masinis2: normalizeNullable(personelForm.no_telp_masinis2),
          no_telp_masinis3: normalizeNullable(personelForm.no_telp_masinis3),
        },
      });

      const photoEntries = Object.entries(personelPhotoOverrides) as Array<
        [PersonelRoleId, PersonelPhotoOverride]
      >;
      if (photoEntries.length > 0) {
        const photoBody: Partial<Record<PersonnelPhotoField, File>> = {};
        photoEntries.forEach(([roleId, override]) => {
          if (!override?.file) return;
          const key = ROLE_TO_PHOTO_KEY[roleId];
          photoBody[key] = override.file;
        });

        await updatePersonnelPhotoApiVesselVesselIdPersonnelPhotoPut({
          path: { vessel_id: vesselId },
          body: photoBody,
        });
      }

      toast.success("Personil kapal berhasil diupdate");
      setOpenPersonelDialog(false);
      Object.values(personelPhotoOverrides).forEach((override) => {
        if (!override) return;
        URL.revokeObjectURL(override.previewUrl);
      });
      setPersonelPhotoOverrides({});
      await onUpdated();
    } catch (err) {
      console.error("Failed to update vessel personel:", err);
      toast.error("Gagal update personil kapal");
    } finally {
      setSavingPersonel(false);
    }
  };

  const personelItems: PersonelItem[] = [
    {
      id: "nahkoda",
      title: "Nahkoda",
      name: memberByRole("nahkoda").name ?? undefined,
      sid: memberByRole("nahkoda").sid ?? undefined,
      telp: memberByRole("nahkoda").phone ?? undefined,
      imageUrl: getPersonelDisplayImageUrl("nahkoda"),
    },
    {
      id: "mualim1",
      title: "Mualim I",
      name: memberByRole("mualim1").name ?? undefined,
      sid: memberByRole("mualim1").sid ?? undefined,
      telp: memberByRole("mualim1").phone ?? undefined,
      imageUrl: getPersonelDisplayImageUrl("mualim1"),
    },
    {
      id: "mualim2",
      title: "Mualim II",
      name: memberByRole("mualim2").name ?? undefined,
      sid: memberByRole("mualim2").sid ?? undefined,
      telp: memberByRole("mualim2").phone ?? undefined,
      imageUrl: getPersonelDisplayImageUrl("mualim2"),
    },
    {
      id: "kkm",
      title: "KKM",
      name: memberByRole("kkm").name ?? undefined,
      sid: memberByRole("kkm").sid ?? undefined,
      telp: memberByRole("kkm").phone ?? undefined,
      imageUrl: getPersonelDisplayImageUrl("kkm"),
    },
    {
      id: "masinis2",
      title: "Masinis II",
      name: memberByRole("masinis2").name ?? undefined,
      sid: memberByRole("masinis2").sid ?? undefined,
      telp: memberByRole("masinis2").phone ?? undefined,
      imageUrl: getPersonelDisplayImageUrl("masinis2"),
    },
    {
      id: "masinis3",
      title: "Masinis III",
      name: memberByRole("masinis3").name ?? undefined,
      sid: memberByRole("masinis3").sid ?? undefined,
      telp: memberByRole("masinis3").phone ?? undefined,
      imageUrl: getPersonelDisplayImageUrl("masinis3"),
    },
  ];

  return (
    <>
      <Card className="p-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="font-bold text-[20px]">Personil Kapal</div>
            <div className="flex items-center gap-1">
              <Button
                size="icon-sm"
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                title="Tampilan grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                size="icon-sm"
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === "list"}
                title="Tampilan list"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleOpenPersonelEdit}
                title="Edit personil"
              >
                <Pencil />
              </Button>
            </div>
          </div>
          {(() => {
            const content = (
              <div
                className={cn(
                  "gap-2",
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-3 items-stretch"
                    : "flex flex-col",
                )}
              >
                {personelItems.map((item) =>
                  viewMode === "grid" ? (
                    <div
                      key={item.id}
                      className="p-2 border border-dashed rounded-lg flex flex-col min-h-[124px] overflow-hidden"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Image
                          src={getPersonelAvatarSrc(item)}
                          alt={item.title}
                          width={36}
                          height={36}
                          fallback={buildAvatarDataUrl(
                            getInitials(item.name || item.title),
                            pickAvatarBg(`${item.id}:${item.name ?? ""}`),
                          )}
                          preview={false}
                          className="rounded-full object-cover"
                        />
                        <div className="font-bold uppercase tracking-wide truncate">
                          {item.title}
                        </div>
                      </div>
                      <div className="mt-2 space-y-0 text-sm">
                        <PersonelInfoRow label="Name" value={item.name} />
                        <PersonelInfoRow label="SID" value={item.sid} />
                        <PersonelInfoRow label="Telp" value={item.telp} />
                      </div>
                    </div>
                  ) : (
                    <div
                      key={item.id}
                      className="p-2 border border-dashed rounded-lg min-h-[72px] flex items-center"
                    >
                      <div className="grid w-full grid-cols-1 md:grid-cols-[140px_1fr] gap-2 items-center min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <Image
                            src={getPersonelAvatarSrc(item)}
                            alt={item.title}
                            width={28}
                            height={28}
                            fallback={buildAvatarDataUrl(
                              getInitials(item.name || item.title),
                              pickAvatarBg(`${item.id}:${item.name ?? ""}`),
                            )}
                            preview={false}
                            className="rounded-full object-cover"
                          />
                          <div className="text-sm font-semibold uppercase tracking-wide truncate">
                            {item.title}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm min-w-0">
                          <PersonelInfoRow
                            label="Name"
                            value={item.name}
                            valueClassName="line-clamp-1"
                          />
                          <PersonelInfoRow
                            label="SID"
                            value={item.sid}
                            valueClassName="line-clamp-1"
                          />
                          <PersonelInfoRow
                            label="Telp"
                            value={item.telp}
                            valueClassName="line-clamp-1"
                          />
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            );

            if (viewMode !== "list") return content;

            return (
              <ScrollArea className="h-[180px] sm:h-[220px] pr-1">
                {content}
              </ScrollArea>
            );
          })()}
        </div>
      </Card>

      <Dialog open={openPersonelDialog} onOpenChange={setOpenPersonelDialog}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Personil Kapal</DialogTitle>
          <DialogDescription>
              Ubah data personil lalu klik simpan. Upload foto akan tersimpan ke
              server.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
	              {PERSONEL_EDIT_SECTIONS.map((section) => {
	                const photoOverride = personelPhotoOverrides[section.id];
	                const imageUrl = getPersonelDisplayImageUrl(section.id);
	                const serverPhotoUrl =
	                  memberByRole(section.id).photo_url ?? "";
	                const hasServerPhoto = serverPhotoUrl.trim().length > 0;
	                const fallbackAvatar = buildAvatarDataUrl(
	                  getInitials(personelForm[section.nameKey] || section.title),
	                  pickAvatarBg(
	                    `${section.id}:${personelForm[section.nameKey]}`,
                  ),
                );

                return (
                  <div
                    key={section.id}
                    className="p-4 border rounded-xl bg-muted/10 space-y-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Image
                          src={imageUrl || fallbackAvatar}
                          alt={section.title}
                          width={48}
                          height={48}
                          preview={true}
                          fallback={fallbackAvatar}
                          className="rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold truncate">
                            {section.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            Foto bersifat lokal sementara.
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!hasServerPhoto && (
                          <>
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              disabled={savingPersonel}
                            >
                              <label
                                htmlFor={`personel-photo-${section.id}`}
                                className="cursor-pointer"
                              >
                                Upload
                              </label>
                            </Button>
                            <input
                              id={`personel-photo-${section.id}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                void handlePersonelPhotoChange(section.id, file);
                                e.currentTarget.value = "";
                              }}
                            />
                          </>
                        )}

                        {photoOverride ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={savingPersonel}
                            onClick={() => handleRemovePersonelPhoto(section.id)}
                            title="Batalkan foto yang dipilih"
                          >
                            Batal
                          </Button>
                        ) : hasServerPhoto ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={
                              savingPersonel ||
                              deletingPhotoRoleId === section.id
                            }
                            onClick={() => void handleDeletePersonelPhoto(section.id)}
                            title="Hapus foto dari server"
                          >
                            {deletingPhotoRoleId === section.id ? "Menghapus..." : "Hapus"}
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Nama</Label>
                        <Input
                          value={personelForm[section.nameKey]}
                          onChange={(e) =>
                            handlePersonelFormChange(
                              section.nameKey,
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>SID</Label>
                          <Input
                            value={personelForm[section.sidKey]}
                            onChange={(e) =>
                              handlePersonelFormChange(
                                section.sidKey,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>No. Telp</Label>
                          <Input
                            value={personelForm[section.telpKey]}
                            onChange={(e) =>
                              handlePersonelFormChange(
                                section.telpKey,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenPersonelDialog(false)}
              disabled={savingPersonel}
            >
              Batal
            </Button>
            <Button onClick={handleUpdatePersonel} disabled={savingPersonel}>
              {savingPersonel ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
