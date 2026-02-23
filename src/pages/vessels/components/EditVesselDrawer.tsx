import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import {
  getAssetByIdApiAssetsDetailIdVesselGet,
  getCabangByCompanyApiListCabangAllGet,
  getCompaniesAllApiListCompanyAllGet,
  updateAssetsApiAssetsVesselIdPut,
} from "@/api/base/sdk.gen";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type FormState = {
  asset_name: string;
  id_terminal: string;
  mmsi: string;
  imo: string;
  call_sign: string;
  type: string;
  id_company: number | null;
  cabang: string | null;
  loa: number | null;
  lbp: number | null;
  depth: number | null;
  breadth: number | null;
  draft: number | null;
  gt: number | null;
  build_year: string;
  merek_engine: string;
  engine_type: string;
  engine_hp: string;
  aux_engine_merek: string;
  aux_engine_type: string;
  aux_engine_hp: string;
  no_sertifikat: string;
  tgl_terbit: string;
  tgl_expired: string;
  statussmc: string;
  tahapan_verifikasi: string;
  ssb: number | null;
  vhf: number | null;
  epirb: number | null;
  sar: number | null;
  vms: number | null;
  fuel_censor: number | null;
  telp_sat: number | null;
  passenger: number | null;
  car: number | null;
  note: string;
  image: File | null;
};

type AssetDetailResponse = Partial<FormState> & {
  vessel_name?: string;
  callsign?: string;
  passanger?: number | null;
};

type CompanyOption = { id_com: number; name: string | null };
type RegionOption = { id_reg: number; name: string | null };

const initialForm: FormState = {
  asset_name: "",
  id_terminal: "",
  mmsi: "",
  imo: "",
  call_sign: "",
  type: "",
  id_company: null,
  cabang: null,
  loa: null,
  lbp: null,
  depth: null,
  breadth: null,
  draft: null,
  gt: null,
  build_year: "",
  merek_engine: "",
  engine_type: "",
  engine_hp: "",
  aux_engine_merek: "",
  aux_engine_type: "",
  aux_engine_hp: "",
  no_sertifikat: "",
  tgl_terbit: "",
  tgl_expired: "",
  statussmc: "",
  tahapan_verifikasi: "",
  ssb: null,
  vhf: null,
  epirb: null,
  sar: null,
  vms: null,
  fuel_censor: null,
  telp_sat: null,
  passenger: null,
  car: null,
  note: "",
  image: null,
};

const parseNumberOrNull = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
};

interface Props {
  open: boolean;
  vesselId: number | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditVesselDrawer({
  open,
  vesselId,
  onOpenChange,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [regions, setRegions] = useState<RegionOption[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  const stepItems = useMemo(
    () => [
      "Identitas",
      "Dimensions",
      "Mesin",
      "Sertifikat",
      "Perangkat",
      "Other",
    ],
    [],
  );

  const handleChange = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    if (previewUrlRef.current) {
      try {
        URL.revokeObjectURL(previewUrlRef.current);
      } catch {
        // noop
      }
      previewUrlRef.current = null;
    }

    setImagePreview(null);
    setForm(initialForm);
    setStep(1);
    setLoading(false);
  };

  const handleFileChange = (file: File | null) => {
    handleChange("image", file);

    if (file) {
      if (previewUrlRef.current) {
        try {
          URL.revokeObjectURL(previewUrlRef.current);
        } catch {
          // noop
        }
      }
      const previewUrl = URL.createObjectURL(file);
      previewUrlRef.current = previewUrl;
      setImagePreview(previewUrl);
      return;
    }

    if (previewUrlRef.current) {
      try {
        URL.revokeObjectURL(previewUrlRef.current);
      } catch {
        // noop
      }
      previewUrlRef.current = null;
    }
    setImagePreview(null);
  };

  const nextStep = () => {
    if (step === 1 && !form.asset_name.trim()) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!vesselId) return;
    if (loading) return;

    if (!form.asset_name.trim()) {
      toast.error("Vessel Name wajib diisi");
      setStep(1);
      return;
    }

    try {
      setLoading(true);

      await updateAssetsApiAssetsVesselIdPut({
        path: {
          vessel_id: vesselId,
        },
        body: {
          asset_name: form.asset_name,
          id_terminal: form.id_terminal || null,
          mmsi: form.mmsi || null,
          imo: form.imo || null,
          call_sign: form.call_sign || null,
          type: form.type || null,
          id_company: form.id_company,
          image: form.image,
          loa: form.loa,
          lbp: form.lbp,
          depth: form.depth,
          breadth: form.breadth,
          draft: form.draft,
          gt: form.gt,
          build_year: form.build_year || null,
          merek_engine: form.merek_engine || null,
          engine_type: form.engine_type || null,
          engine_hp: form.engine_hp || null,
          aux_engine_merek: form.aux_engine_merek || null,
          aux_engine_type: form.aux_engine_type || null,
          aux_engine_hp: form.aux_engine_hp || null,
          passanger: form.passenger,
          car: form.car,
          note: form.note || null,
          ssb: form.ssb,
          vhf: form.vhf,
          epirb: form.epirb,
          sar: form.sar,
          vms: form.vms,
          fuel_censor: form.fuel_censor,
          telp_sat: form.telp_sat,
          cabang: form.cabang,
          no_sertifikat: form.no_sertifikat || null,
          tgl_terbit: form.tgl_terbit || null,
          tgl_expired: form.tgl_expired || null,
          statussmc: form.statussmc || null,
          tahapan_verifikasi: form.tahapan_verifikasi || null,
        },
      });

      toast.success("Asset berhasil diupdate");
      onSuccess();
      onOpenChange(false);
      resetAll();
    } catch (error) {
      console.error("Update asset failed:", error);
      toast.error("Gagal update asset");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !vesselId) return;

    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [companiesRes, regionsRes, assetRes] = await Promise.all([
          getCompaniesAllApiListCompanyAllGet(),
          getCabangByCompanyApiListCabangAllGet(),
          getAssetByIdApiAssetsDetailIdVesselGet({
            path: { id_vessel: vesselId },
          }),
        ]);

        if (cancelled) return;

        const companiesData = companiesRes as {
          data?: { data?: CompanyOption[] };
        };
        const regionsData = regionsRes as { data?: { data?: RegionOption[] } };
        const assetData = assetRes as { data?: { data?: AssetDetailResponse } };

        setCompanies(companiesData.data?.data ?? []);
        setRegions(regionsData.data?.data ?? []);

        const detail = assetData.data?.data;
        if (!detail) {
          toast.error("Data asset tidak ditemukan");
          onOpenChange(false);
          resetAll();
          return;
        }

        setForm({
          asset_name: detail.asset_name ?? detail.vessel_name ?? "",
          id_terminal: detail.id_terminal ?? "",
          mmsi: detail.mmsi ?? "",
          imo: detail.imo ?? "",
          call_sign: detail.call_sign ?? detail.callsign ?? "",
          type: detail.type ?? "",
          id_company: detail.id_company ?? null,
          cabang: detail.cabang ?? null,
          loa: detail.loa ?? null,
          lbp: detail.lbp ?? null,
          depth: detail.depth ?? null,
          breadth: detail.breadth ?? null,
          draft: detail.draft ?? null,
          gt: detail.gt ?? null,
          build_year: detail.build_year ?? "",
          merek_engine: detail.merek_engine ?? "",
          engine_type: detail.engine_type ?? "",
          engine_hp: detail.engine_hp ?? "",
          aux_engine_merek: detail.aux_engine_merek ?? "",
          aux_engine_type: detail.aux_engine_type ?? "",
          aux_engine_hp: detail.aux_engine_hp ?? "",
          no_sertifikat: detail.no_sertifikat ?? "",
          tgl_terbit: detail.tgl_terbit ?? "",
          tgl_expired: detail.tgl_expired ?? "",
          statussmc: detail.statussmc ?? "",
          tahapan_verifikasi: detail.tahapan_verifikasi ?? "",
          ssb: detail.ssb ?? null,
          vhf: detail.vhf ?? null,
          epirb: detail.epirb ?? null,
          sar: detail.sar ?? null,
          vms: detail.vms ?? null,
          fuel_censor: detail.fuel_censor ?? null,
          telp_sat: detail.telp_sat ?? null,
          passenger: detail.passanger ?? detail.passenger ?? null,
          car: detail.car ?? null,
          note: detail.note ?? "",
          image: null,
        });
      } catch (error) {
        console.error("Failed to fetch edit dependencies:", error);
        toast.error("Gagal mengambil data asset");
        onOpenChange(false);
        resetAll();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [open, vesselId, onOpenChange]);

  useEffect(() => {
    if (open) return;
    resetAll();
  }, [open]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        try {
          URL.revokeObjectURL(previewUrlRef.current);
        } catch {
          // noop
        }
      }
    };
  }, []);

  return (
    <Drawer open={open} direction="right" onOpenChange={onOpenChange}>
      <DrawerContent className="data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-3xl">
        <DrawerHeader>
          <DrawerTitle>Edit Vessel</DrawerTitle>
          <DrawerDescription>Ubah data vessel</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-2">
          <div className="mb-4 flex items-center justify-center gap-4">
            {stepItems.map((label, idx) => {
              const current = idx + 1;
              return (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className={clsx(
                      "text-sm font-medium",
                      step === current
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </div>
                  {current < stepItems.length && (
                    <div className="h-[1px] w-8 bg-border" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
            {step === 1 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Vessel Name</Label>
                  <Input
                    placeholder="Vessel Name *"
                    value={form.asset_name}
                    onChange={(e) => handleChange("asset_name", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">ID Terminal</Label>
                  <Input
                    placeholder="Terminal"
                    value={form.id_terminal}
                    onChange={(e) =>
                      handleChange("id_terminal", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">MMSI</Label>
                  <Input
                    placeholder="MMSI"
                    value={form.mmsi}
                    onChange={(e) => handleChange("mmsi", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">IMO</Label>
                  <Input
                    placeholder="IMO"
                    value={form.imo}
                    onChange={(e) => handleChange("imo", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Callsign</Label>
                  <Input
                    placeholder="Callsign"
                    value={form.call_sign}
                    onChange={(e) => handleChange("call_sign", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Type</Label>
                  <Input
                    placeholder="Type"
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Company</Label>
                  <Select
                    value={
                      form.id_company !== null ? String(form.id_company) : ""
                    }
                    onValueChange={(value) =>
                      handleChange("id_company", value ? Number(value) : null)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies
                        .filter((c) => c.name)
                        .map((company) => (
                          <SelectItem
                            key={company.id_com}
                            value={String(company.id_com)}
                          >
                            {company.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Cabang</Label>
                  <Select
                    value={form.cabang !== null ? String(form.cabang) : ""}
                    onValueChange={(value) =>
                      handleChange("cabang", value.length > 0 ? value : null)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Cabang" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions
                        .filter((c) => c.name)
                        .map((region) => (
                          <SelectItem
                            key={region.id_reg}
                            value={String(region.id_reg)}
                          >
                            {region.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">LOA</Label>
                  <Input
                    placeholder="LOA"
                    value={form.loa ?? ""}
                    onChange={(e) =>
                      handleChange("loa", parseNumberOrNull(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">LBP</Label>
                  <Input
                    placeholder="LBP"
                    value={form.lbp ?? ""}
                    onChange={(e) =>
                      handleChange("lbp", parseNumberOrNull(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Depth</Label>
                  <Input
                    placeholder="Depth"
                    value={form.depth ?? ""}
                    onChange={(e) =>
                      handleChange("depth", parseNumberOrNull(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Breadth</Label>
                  <Input
                    placeholder="Breadth"
                    value={form.breadth ?? ""}
                    onChange={(e) =>
                      handleChange("breadth", parseNumberOrNull(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Draft</Label>
                  <Input
                    placeholder="Draft"
                    value={form.draft ?? ""}
                    onChange={(e) =>
                      handleChange("draft", parseNumberOrNull(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">GT</Label>
                  <Input
                    placeholder="GT"
                    value={form.gt ?? ""}
                    onChange={(e) =>
                      handleChange("gt", parseNumberOrNull(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Build Year</Label>
                  <Input
                    placeholder="Build Year"
                    value={form.build_year}
                    onChange={(e) => handleChange("build_year", e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Merek Engine</Label>
                  <Input
                    placeholder="Merek Engine"
                    value={form.merek_engine}
                    onChange={(e) =>
                      handleChange("merek_engine", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Engine Type</Label>
                  <Input
                    placeholder="Engine Type"
                    value={form.engine_type}
                    onChange={(e) =>
                      handleChange("engine_type", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Engine HP</Label>
                  <Input
                    placeholder="Engine HP"
                    value={form.engine_hp ?? ""}
                    onChange={(e) => handleChange("engine_hp", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Merek AUX Engine</Label>
                  <Input
                    placeholder="Merek AUX Engine"
                    value={form.aux_engine_merek}
                    onChange={(e) =>
                      handleChange("aux_engine_merek", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Type AUX Engine</Label>
                  <Input
                    placeholder="Type AUX Engine"
                    value={form.aux_engine_type}
                    onChange={(e) =>
                      handleChange("aux_engine_type", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">HP AUX Engine</Label>
                  <Input
                    placeholder="HP AUX Engine"
                    value={form.aux_engine_hp}
                    onChange={(e) =>
                      handleChange("aux_engine_hp", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">NO Sertifikat</Label>
                  <Input
                    placeholder="NO Sertifikat"
                    value={form.no_sertifikat}
                    onChange={(e) =>
                      handleChange("no_sertifikat", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tgl. Terbit</Label>
                  <Input
                    placeholder="Tgl. Terbit"
                    value={form.tgl_terbit}
                    onChange={(e) => handleChange("tgl_terbit", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tgl. Expired</Label>
                  <Input
                    placeholder="Tgl. Expired"
                    value={form.tgl_expired ?? ""}
                    onChange={(e) =>
                      handleChange("tgl_expired", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Status SMC</Label>
                  <Input
                    placeholder="Status SMC"
                    value={form.statussmc}
                    onChange={(e) => handleChange("statussmc", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tahapan Verifikasi</Label>
                  <Input
                    placeholder="Tahapan Verifikasi"
                    value={form.tahapan_verifikasi}
                    onChange={(e) =>
                      handleChange("tahapan_verifikasi", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">SSB</Label>
                  <Input
                    placeholder="SSB"
                    value={form.ssb ?? ""}
                    onChange={(e) =>
                      handleChange("ssb", parseNumberOrNull(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">VHF</Label>
                  <Input
                    placeholder="VHF"
                    value={form.vhf ?? ""}
                    onChange={(e) =>
                      handleChange("vhf", parseNumberOrNull(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">EPIRB</Label>
                  <Input
                    placeholder="EPIRB"
                    value={form.epirb ?? ""}
                    onChange={(e) =>
                      handleChange("epirb", parseNumberOrNull(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">SAR</Label>
                  <Input
                    placeholder="SAR"
                    value={form.sar ?? ""}
                    onChange={(e) =>
                      handleChange("sar", parseNumberOrNull(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">VMS</Label>
                  <Input
                    placeholder="VMS"
                    value={form.vms ?? ""}
                    onChange={(e) =>
                      handleChange("vms", parseNumberOrNull(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Fuel Censor</Label>
                  <Input
                    placeholder="Fuel Censor"
                    value={form.fuel_censor ?? ""}
                    onChange={(e) =>
                      handleChange(
                        "fuel_censor",
                        parseNumberOrNull(e.target.value),
                      )
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Telp Sat</Label>
                  <Input
                    placeholder="Telp Sat"
                    value={form.telp_sat ?? ""}
                    onChange={(e) =>
                      handleChange(
                        "telp_sat",
                        parseNumberOrNull(e.target.value),
                      )
                    }
                  />
                </div>
              </div>
            )}

            {step === 6 && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Passengers</Label>
                    <Input
                      placeholder="Passengers"
                      value={form.passenger ?? ""}
                      onChange={(e) =>
                        handleChange(
                          "passenger",
                          parseNumberOrNull(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Cars</Label>
                    <Input
                      placeholder="Cars"
                      value={form.car ?? ""}
                      onChange={(e) =>
                        handleChange("car", parseNumberOrNull(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Note</Label>
                  <Textarea
                    placeholder="Note"
                    value={form.note}
                    onChange={(e) => handleChange("note", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(
                        e.target.files ? e.target.files[0] : null,
                      )
                    }
                  />

                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 w-full rounded-md border object-contain"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <DrawerFooter className="border-t">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep} disabled={loading}>
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}

          {step < 6 ? (
            <Button
              onClick={nextStep}
              disabled={loading || (step === 1 && !form.asset_name.trim())}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
