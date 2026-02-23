import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { updateVesselPersonelApiVesselPersonelVesselIdPut } from "@/api/base/sdk.gen";
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

export interface VesselPersonelData {
  nahkoda?: string;
  sid_nahkoda?: string;
  no_telp_nahkoda?: string;
  mualim1?: string;
  sid_mualim1?: string;
  no_telp_mualim1?: string;
  mualim2?: string;
  sid_mualim2?: string;
  no_telp_mualim2?: string;
  kkm?: string;
  sid_kkm?: string;
  no_telp_kkm?: string;
  masinis2?: string;
  sid_masinis2?: string;
  no_telp_masinis2?: string;
  masinis3?: string;
  sid_masinis3?: string;
  no_telp_masinis3?: string;
}

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

const mapAssetToPersonelForm = (data: VesselPersonelData): PersonelForm => ({
  nahkoda: data.nahkoda ?? "",
  sid_nahkoda: data.sid_nahkoda ?? "",
  sid_mualim1: data.sid_mualim1 ?? "",
  sid_mualim2: data.sid_mualim2 ?? "",
  mualim1: data.mualim1 ?? "",
  mualim2: data.mualim2 ?? "",
  kkm: data.kkm ?? "",
  masinis2: data.masinis2 ?? "",
  masinis3: data.masinis3 ?? "",
  sid_kkm: data.sid_kkm ?? "",
  sid_masinis2: data.sid_masinis2 ?? "",
  sid_masinis3: data.sid_masinis3 ?? "",
  no_telp_nahkoda: data.no_telp_nahkoda ?? "",
  no_telp_mualim1: data.no_telp_mualim1 ?? "",
  no_telp_mualim2: data.no_telp_mualim2 ?? "",
  no_telp_kkm: data.no_telp_kkm ?? "",
  no_telp_masinis2: data.no_telp_masinis2 ?? "",
  no_telp_masinis3: data.no_telp_masinis3 ?? "",
});

type Props = {
  vesselId: number;
  asset: VesselPersonelData;
  onUpdated: () => Promise<void> | void;
};

export default function VesselPersonelSection({
  vesselId,
  asset,
  onUpdated,
}: Props) {
  const [openPersonelDialog, setOpenPersonelDialog] = useState(false);
  const [savingPersonel, setSavingPersonel] = useState(false);
  const [personelForm, setPersonelForm] =
    useState<PersonelForm>(initialPersonelForm);

  const handlePersonelFormChange = <K extends keyof PersonelForm>(
    key: K,
    value: PersonelForm[K],
  ) => {
    setPersonelForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleOpenPersonelEdit = () => {
    setPersonelForm(mapAssetToPersonelForm(asset));
    setOpenPersonelDialog(true);
  };

  const handleUpdatePersonel = async () => {
    if (savingPersonel) return;
    if (!Number.isInteger(vesselId) || vesselId <= 0) {
      toast.error("Vessel ID tidak valid");
      return;
    }

    try {
      setSavingPersonel(true);
      await updateVesselPersonelApiVesselPersonelVesselIdPut({
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
      toast.success("Personil kapal berhasil diupdate");
      setOpenPersonelDialog(false);
      await onUpdated();
    } catch (err) {
      console.error("Failed to update vessel personel:", err);
      toast.error("Gagal update personil kapal");
    } finally {
      setSavingPersonel(false);
    }
  };

  return (
    <>
      <Card className="p-2">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="font-bold text-lg">Personil Kapal</div>
            <Button size="sm" variant="ghost" onClick={handleOpenPersonelEdit}>
              <Pencil />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="p-2 border border-dashed space-y-2 rounded-lg">
              <div>NAHKODA</div>
              <div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>Name</div>
                  <div>{asset.nahkoda || "-"}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>SID</div>
                  <div>{asset.sid_nahkoda || "-"}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>Telp</div>
                  <div>{asset.no_telp_nahkoda ?? "-"}</div>
                </div>
              </div>
            </div>

            <div className="p-2 border border-dashed space-y-2 rounded-lg">
              <div>MUALIM I</div>
              <div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>Name</div>
                  <div>{asset.mualim1 || "-"}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>SID</div>
                  <div>{asset.sid_mualim1 || "-"}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>Telp</div>
                  <div>{asset.no_telp_mualim1 ?? "-"}</div>
                </div>
              </div>
            </div>

            <div className="p-2 border border-dashed space-y-2 rounded-lg">
              <div>MUALIM II</div>
              <div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>Name</div>
                  <div>{asset.mualim2 || "-"}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>SID</div>
                  <div>{asset.sid_mualim2 || "-"}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>Telp</div>
                  <div>{asset.no_telp_mualim2 ?? "-"}</div>
                </div>
              </div>
            </div>

            <div className="p-2 border border-dashed space-y-2 rounded-lg">
              <div>KKM</div>
              <div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>Name</div>
                  <div>{asset.kkm || "-"}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>SID</div>
                  <div>{asset.sid_kkm || "-"}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>Telp</div>
                  <div>{asset.no_telp_kkm ?? "-"}</div>
                </div>
              </div>
            </div>

            <div className="p-2 border border-dashed space-y-2 rounded-lg">
              <div>MASINIS II</div>
              <div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>Name</div>
                  <div>{asset.masinis2 || "-"}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>SID</div>
                  <div>{asset.sid_masinis2 || "-"}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>Telp</div>
                  <div>{asset.no_telp_masinis2 ?? "-"}</div>
                </div>
              </div>
            </div>

            <div className="p-2 border border-dashed space-y-2 rounded-lg">
              <div>MASINIS III</div>
              <div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>Name</div>
                  <div>{asset.masinis3 || "-"}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>SID</div>
                  <div>{asset.sid_masinis3 || "-"}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <div>Telp</div>
                  <div>{asset.no_telp_masinis3 ?? "-"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={openPersonelDialog} onOpenChange={setOpenPersonelDialog}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Personil Kapal</DialogTitle>
            <DialogDescription>
              Ubah data personil lalu klik simpan.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 p-3 border rounded-lg">
                <div className="font-semibold">Nahkoda</div>
                <div className="space-y-2">
                  <Label>Nama</Label>
                  <Input
                    value={personelForm.nahkoda}
                    onChange={(e) =>
                      handlePersonelFormChange("nahkoda", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>SID</Label>
                  <Input
                    value={personelForm.sid_nahkoda}
                    onChange={(e) =>
                      handlePersonelFormChange("sid_nahkoda", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>No. Telp</Label>
                  <Input
                    value={personelForm.no_telp_nahkoda}
                    onChange={(e) =>
                      handlePersonelFormChange(
                        "no_telp_nahkoda",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-3 p-3 border rounded-lg">
                <div className="font-semibold">Mualim I</div>
                <div className="space-y-2">
                  <Label>Nama</Label>
                  <Input
                    value={personelForm.mualim1}
                    onChange={(e) =>
                      handlePersonelFormChange("mualim1", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>SID</Label>
                  <Input
                    value={personelForm.sid_mualim1}
                    onChange={(e) =>
                      handlePersonelFormChange("sid_mualim1", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>No. Telp</Label>
                  <Input
                    value={personelForm.no_telp_mualim1}
                    onChange={(e) =>
                      handlePersonelFormChange(
                        "no_telp_mualim1",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-3 p-3 border rounded-lg">
                <div className="font-semibold">Mualim II</div>
                <div className="space-y-2">
                  <Label>Nama</Label>
                  <Input
                    value={personelForm.mualim2}
                    onChange={(e) =>
                      handlePersonelFormChange("mualim2", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>SID</Label>
                  <Input
                    value={personelForm.sid_mualim2}
                    onChange={(e) =>
                      handlePersonelFormChange("sid_mualim2", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>No. Telp</Label>
                  <Input
                    value={personelForm.no_telp_mualim2}
                    onChange={(e) =>
                      handlePersonelFormChange(
                        "no_telp_mualim2",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-3 p-3 border rounded-lg">
                <div className="font-semibold">KKM</div>
                <div className="space-y-2">
                  <Label>Nama</Label>
                  <Input
                    value={personelForm.kkm}
                    onChange={(e) =>
                      handlePersonelFormChange("kkm", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>SID</Label>
                  <Input
                    value={personelForm.sid_kkm}
                    onChange={(e) =>
                      handlePersonelFormChange("sid_kkm", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>No. Telp</Label>
                  <Input
                    value={personelForm.no_telp_kkm}
                    onChange={(e) =>
                      handlePersonelFormChange("no_telp_kkm", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-3 p-3 border rounded-lg">
                <div className="font-semibold">Masinis II</div>
                <div className="space-y-2">
                  <Label>Nama</Label>
                  <Input
                    value={personelForm.masinis2}
                    onChange={(e) =>
                      handlePersonelFormChange("masinis2", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>SID</Label>
                  <Input
                    value={personelForm.sid_masinis2}
                    onChange={(e) =>
                      handlePersonelFormChange("sid_masinis2", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>No. Telp</Label>
                  <Input
                    value={personelForm.no_telp_masinis2}
                    onChange={(e) =>
                      handlePersonelFormChange(
                        "no_telp_masinis2",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-3 p-3 border rounded-lg">
                <div className="font-semibold">Masinis III</div>
                <div className="space-y-2">
                  <Label>Nama</Label>
                  <Input
                    value={personelForm.masinis3}
                    onChange={(e) =>
                      handlePersonelFormChange("masinis3", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>SID</Label>
                  <Input
                    value={personelForm.sid_masinis3}
                    onChange={(e) =>
                      handlePersonelFormChange("sid_masinis3", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>No. Telp</Label>
                  <Input
                    value={personelForm.no_telp_masinis3}
                    onChange={(e) =>
                      handlePersonelFormChange(
                        "no_telp_masinis3",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>

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
