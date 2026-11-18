import { ROUTES } from "@/routes";
import { getProjectDetail } from "@/service/constructor/Project/getDetail";
import { useProjectListQuery } from "@/service/constructor/Project/getList";
import {
  createSteelProject,
  getSteelCategoryLines,
  updateSteelProject,
  useSteelCategoryListQuery,
  useSteelProjectDetailQuery,
} from "@/service/constructor/SteelProject";
import {
  DiameterSummaryDto,
  SteelBarDto,
  SteelProjectAssemblyMapDto,
  SteelProjectDto,
} from "@/service/constructor/SteelProject/type";
import { toastError, toastSuccess } from "@/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export function computeBarMetrics(bar: SteelBarDto, sameQuantity: number) {
  const segmentLength = (bar.steelLines ?? []).reduce(
    (sum, line) => sum + Number(line.value || 0),
    0
  );
  const splice = Number(bar.spliceLength ?? bar.sliceLength ?? 0);
  const bendDeduction = Number(bar.bendDeduction ?? 0);
  const cutLength = Math.max(0, segmentLength + splice - bendDeduction);
  const cutLengthMeter = cutLength / 1000;
  const diameter = Number(bar.barDiameter || 0);
  const unitWeight = diameter * diameter * 0.00617 * cutLengthMeter;
  const barQty = Math.max(0, Number(bar.barQuantity || 0));
  const sameQty = Math.max(1, Number(sameQuantity || 1));
  const totalBars = barQty * sameQty;
  const totalLength = cutLengthMeter * totalBars;
  const totalWeight = unitWeight * totalBars;

  return {
    segmentLength,
    cutLength,
    cutLengthMeter,
    unitWeight,
    totalBars,
    totalLength,
    totalWeight,
  };
}

const DEFAULT_ASSEMBLY = (): SteelProjectAssemblyMapDto => ({
  assemblyName: "Cấu kiện 1",
  sameQuantity: 1,
  steels: [
    {
      barLabel: "1",
      barDiameter: 16,
      barQuantity: 4,
      spliceLength: 0,
      bendDeduction: 0,
      steelLines: [{ paramName: "L", value: 6000 }],
    },
  ],
});

export default function useSteelStatisticsSave() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const idParam = router.query.id ? Number(router.query.id) : undefined;
  const actionType = String(router.query.actionType ?? "").toUpperCase();
  const isView = actionType === "VIEW";
  const isEdit = Boolean(idParam);
  const initialProjectId = router.query.projectId
    ? Number(router.query.projectId)
    : undefined;

  const [step, setStep] = useState(0);
  const [assemblies, setAssemblies] = useState<SteelProjectAssemblyMapDto[]>([
    DEFAULT_ASSEMBLY(),
  ]);

  const form = useForm<SteelProjectDto>({
    defaultValues: {
      code: "",
      name: "",
      projectId: initialProjectId ?? null,
      owner: "",
      address: "",
      signDate: "",
      deliveryDate: "",
      description: "",
    },
  });

  const { data: detailData, isLoading: isLoadingDetail } =
    useSteelProjectDetailQuery(idParam, { enabled: Boolean(idParam) });

  const { data: projectListResp } = useProjectListQuery({
    page: 0,
    size: 100,
  });
  const projects = projectListResp?.data?.content ?? [];

  const { data: categoryListResp } = useSteelCategoryListQuery();
  const steelCategories = categoryListResp?.content ?? [];

  useEffect(() => {
    if (!detailData) return;
    form.reset({
      id: detailData.id,
      code: detailData.code ?? "",
      name: detailData.name ?? "",
      projectId: detailData.projectId ?? null,
      owner: detailData.owner ?? "",
      address: detailData.address ?? "",
      signDate: detailData.signDate ?? "",
      deliveryDate: detailData.deliveryDate ?? "",
      description: detailData.description ?? "",
    });
    if (detailData.steelProjectAssemblyMaps?.length) {
      setAssemblies(detailData.steelProjectAssemblyMaps);
    } else {
      setAssemblies([]);
    }
  }, [detailData, form]);

  const handleSelectMainProject = async (projectId: number | null) => {
    form.setValue("projectId", projectId);
    if (!projectId) return;
    try {
      const resp = await getProjectDetail(projectId);
      const p = resp?.data;
      if (!p) return;
      if (!form.getValues("name")) {
        form.setValue("name", `Thống kê thép - ${p.name}`);
      }
      if (!form.getValues("owner") && p.customer?.name) {
        form.setValue("owner", p.customer.name);
      }
      if (!form.getValues("address") && p.address) {
        form.setValue("address", p.address);
      }
      if (!form.getValues("signDate") && p.signDate) {
        form.setValue("signDate", p.signDate);
      }
      if (!form.getValues("deliveryDate") && p.deliveryDate) {
        form.setValue("deliveryDate", p.deliveryDate);
      }
    } catch {
      // ignore auto-fill errors
    }
  };

  useEffect(() => {
    if (!isEdit && initialProjectId) {
      handleSelectMainProject(initialProjectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, initialProjectId]);

  const saveMutation = useMutation({
    mutationFn: (payload: SteelProjectDto) =>
      isEdit ? updateSteelProject(payload) : createSteelProject(payload),
    onSuccess: (res) => {
      toastSuccess(
        isEdit
          ? "Cập nhật bảng thống kê thép thành công"
          : "Tạo bảng thống kê thép thành công"
      );
      queryClient.invalidateQueries({
        queryKey: ["/api/v1/steel-project/list"],
      });
      if (idParam || res?.id) {
        queryClient.invalidateQueries({
          queryKey: ["/api/v1/steel-project", idParam ?? res?.id],
        });
      }
      router.push(ROUTES.STEELSTATISTICS);
    },
    onError: (err) => {
      toastError(err, "Lưu bảng thống kê thép thất bại");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (!values.name?.trim()) {
      toastError(null, "Vui lòng nhập tên bảng thống kê thép");
      setStep(0);
      return;
    }
    const cleanedAssemblies: SteelProjectAssemblyMapDto[] = assemblies
      .filter((a) => a.assemblyName?.trim())
      .map((a, idx) => ({
        ...a,
        assemblyName: a.assemblyName.trim(),
        sameQuantity: Math.max(1, Number(a.sameQuantity || 1)),
        sortOrder: idx + 1,
        steels: (a.steels ?? []).map((bar, bIdx) => ({
          ...bar,
          barLabel: bar.barLabel?.trim() || String(bIdx + 1),
          barDiameter: Number(bar.barDiameter || 0),
          barQuantity: Math.max(0, Number(bar.barQuantity || 0)),
          spliceLength: Number(bar.spliceLength ?? 0),
          bendDeduction: Number(bar.bendDeduction ?? 0),
          sortOrder: bIdx + 1,
          steelLines: (bar.steelLines ?? []).filter((l) =>
            l.paramName?.trim()
          ),
        })),
      }));

    saveMutation.mutate({
      ...values,
      id: idParam,
      signDate: values.signDate || undefined,
      deliveryDate: values.deliveryDate || undefined,
      steelProjectAssemblyMaps: cleanedAssemblies,
    });
  });

  const summary = useMemo(() => {
    let totalLength = 0;
    let totalWeight = 0;
    const byDiameter = new Map<number, DiameterSummaryDto>();

    const assemblyTotals = assemblies.map((assembly) => {
      const sameQty = Math.max(1, Number(assembly.sameQuantity || 1));
      let aLen = 0;
      let aWt = 0;
      for (const bar of assembly.steels ?? []) {
        const m = computeBarMetrics(bar, sameQty);
        aLen += m.totalLength;
        aWt += m.totalWeight;
        const d = Number(bar.barDiameter || 0);
        if (d > 0) {
          const existing = byDiameter.get(d) ?? {
            barDiameter: d,
            totalBars: 0,
            totalLengthMeter: 0,
            totalWeightKg: 0,
          };
          existing.totalBars += m.totalBars;
          existing.totalLengthMeter += m.totalLength;
          existing.totalWeightKg += m.totalWeight;
          byDiameter.set(d, existing);
        }
      }
      totalLength += aLen;
      totalWeight += aWt;
      return { totalLength: aLen, totalWeight: aWt };
    });

    const diameterSummaries = Array.from(byDiameter.values()).sort(
      (a, b) => a.barDiameter - b.barDiameter
    );

    return {
      totalLength,
      totalWeight,
      assemblyTotals,
      diameterSummaries,
    };
  }, [assemblies]);

  const loadCategoryLinesForBar = async (
    assemblyIdx: number,
    barIdx: number,
    steelCategoryId: number | null
  ) => {
    const selectedCat = steelCategories.find((c) => c.id === steelCategoryId);
    if (!steelCategoryId) {
      setAssemblies((prev) =>
        prev.map((a, ai) =>
          ai !== assemblyIdx
            ? a
            : {
                ...a,
                steels: (a.steels ?? []).map((b, bi) =>
                  bi !== barIdx
                    ? b
                    : {
                        ...b,
                        steelCategoryId: null,
                        steelCategoryCode: undefined,
                        steelCategoryName: undefined,
                      }
                ),
              }
        )
      );
      return;
    }

    try {
      const lines = await getSteelCategoryLines(steelCategoryId);
      setAssemblies((prev) =>
        prev.map((a, ai) =>
          ai !== assemblyIdx
            ? a
            : {
                ...a,
                steels: (a.steels ?? []).map((b, bi) => {
                  if (bi !== barIdx) return b;
                  const oldMap = new Map(
                    (b.steelLines ?? []).map((l) => [l.paramName, l.value])
                  );
                  const newLines = lines.length
                    ? lines.map((cl) => ({
                        paramName: cl.paramName,
                        value: oldMap.get(cl.paramName) ?? 0,
                      }))
                    : b.steelLines ?? [{ paramName: "L", value: 0 }];
                  return {
                    ...b,
                    steelCategoryId,
                    steelCategoryCode: selectedCat?.code,
                    steelCategoryName: selectedCat?.name,
                    images: selectedCat?.images ?? b.images,
                    steelLines: newLines,
                  };
                }),
              }
        )
      );
    } catch {
      // ignore
    }
  };

  return {
    form,
    step,
    setStep,
    isView,
    isEdit,
    isLoadingDetail,
    isSaving: saveMutation.isPending,
    projects,
    steelCategories,
    assemblies,
    setAssemblies,
    summary,
    handleSelectMainProject,
    loadCategoryLinesForBar,
    onSubmit,
    onCancel: () => router.push(ROUTES.STEELSTATISTICS),
    switchToEdit: () =>
      router.push({
        pathname: `${ROUTES.STEELSTATISTICS}/${idParam}`,
        query: { actionType: "EDIT" },
      }),
  };
}
