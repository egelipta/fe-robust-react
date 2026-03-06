import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createAssetsApiAssetsPost,
  getCompaniesAllApiListCompanyAllGet,
  getCabangByCompanyApiListCabangAllGet,
} from "@/api/base/sdk.gen";
import clsx from "clsx";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

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
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddVesselDialog({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [companies, setCompanies] = useState<
    { id_com: number; name: string | null }[]
  >([]);
  const [regions, setRegions] = useState<
    { id_reg: number; name: string | null }[]
  >([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const openRef = useRef(open);
  openRef.current = open;

  const [form, setForm] = useState<FormState>(initialForm);

  const handleChange = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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

  const nextStep = () => {
    if (step === 1 && !form.asset_name.trim()) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const resetAll = () => {
    if (previewUrlRef.current) {
      try {
        URL.revokeObjectURL(previewUrlRef.current);
      } catch {}
      previewUrlRef.current = null;
    }
    setImagePreview(null);

    setForm(initialForm);

    setStep(1);
  };

  const handleSubmit = async () => {
    try {
      if (loading) return;
      if (!form.asset_name.trim()) {
        toast.error("Vessel Name wajib diisi");
        setStep(1);
        return;
      }
      setLoading(true);

      const response = await createAssetsApiAssetsPost({
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

      const data = response.data as any;

      onSuccess();
      toast.success(data?.message);
      resetAll();
      onOpenChange(false);
    } catch (error) {
      console.error("Create vessel failed:", error);
      toast.error("Gagal menambahkan asset");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [companiesRes, regionsRes] = await Promise.all([
          getCompaniesAllApiListCompanyAllGet(),
          getCabangByCompanyApiListCabangAllGet(),
        ]);
        if (cancelled || !openRef.current) return;
        const companiesApi = companiesRes as any;
        const regionsApi = regionsRes as any;
        setCompanies(companiesApi.data?.data || []);
        setRegions(regionsApi.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch add vessel dependencies:", err);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        try {
          URL.revokeObjectURL(previewUrlRef.current);
        } catch {}
        previewUrlRef.current = null;
      }
    };
  }, []);

  const handleFileChange = (file: File | null) => {
    handleChange("image", file);

    if (file) {
      if (previewUrlRef.current) {
        try {
          URL.revokeObjectURL(previewUrlRef.current);
        } catch {}
      }
      const previewUrl = URL.createObjectURL(file);
      previewUrlRef.current = previewUrl;
      setImagePreview(previewUrl);
    } else {
      if (previewUrlRef.current) {
        try {
          URL.revokeObjectURL(previewUrlRef.current);
        } catch {}
        previewUrlRef.current = null;
      }
      setImagePreview(null);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) resetAll();
      }}
    >
      <DialogContent
        className="sm:max-w-3xl"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Vessel</DialogTitle>
        </DialogHeader>

        {/* STEP INDICATOR */}
        <div className="flex items-center justify-center gap-4 mb-4">
          {stepItems.map((label, idx) => {
            const current = idx + 1;
            return (
              <div key={label} className="flex items-center gap-4">
                <div
                  className={clsx(
                    "text-sm font-medium",
                    step === current ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {label}
                </div>
                {current < stepItems.length && (
                  <div className="w-8 h-[1px] bg-border" />
                )}
              </div>
            );
          })}
        </div>

        {/* STEP CONTENT */}
        <div className="space-y-3 min-h-[180px]">
          {/* IDENTITAS */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  onChange={(e) => handleChange("id_terminal", e.target.value)}
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
                    handleChange("id_company", Number(value))
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
                  onValueChange={(value) => handleChange("cabang", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Cabang" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions
                      .filter((c) => c.name)
                      .map((regs) => (
                        <SelectItem
                          key={regs.id_reg}
                          value={String(regs.id_reg)}
                        >
                          {regs.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* DIMENSIONS */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          {/* MESIN */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Merek Engine</Label>
                <Input
                  placeholder="Merek Engine"
                  value={form.merek_engine}
                  onChange={(e) => handleChange("merek_engine", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Engine Type</Label>
                <Input
                  placeholder="Engine Type"
                  value={form.engine_type}
                  onChange={(e) => handleChange("engine_type", e.target.value)}
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
          {/* SERTIFIKAT */}
          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  onChange={(e) => handleChange("tgl_expired", e.target.value)}
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

          {/* PERANGKAT */}
          {step === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    handleChange("telp_sat", parseNumberOrNull(e.target.value))
                  }
                />
              </div>
            </div>
          )}

          {/* OTHER */}
          {step === 6 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    handleFileChange(e.target.files ? e.target.files[0] : null)
                  }
                />

                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-48 object-contain rounded-md border"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <DialogFooter className="mt-4 flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep} disabled={loading}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <Button
              onClick={nextStep}
              disabled={step === 1 && !form.asset_name.trim()}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
