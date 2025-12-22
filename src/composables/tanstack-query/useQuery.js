import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";
import AxiosInstance from "@/lib/axios/axiosInstance";

export function useAllLomba(page = 1, limit = 9, filters = {}) {
    return useQuery({
        queryKey: computed(() => {
            const pageValue = page.value || page;
            const filterValue = filters.value || filters;
            return ["all-lomba", pageValue, limit, filterValue];
        }),
        queryFn: async () => {
            const params = {
                page: page.value || page,
                limit: limit,
            };

            // Add filter params if they exist
            const filterValues = filters.value || filters;
            if (filterValues.kategori) params.id_kategori = filterValues.kategori;
            if (filterValues.tingkat) params.id_pendidikan = filterValues.tingkat;
            if (filterValues.provinsi) params.id_provinsi = filterValues.provinsi;
            if (filterValues.jenis) params.id_jenis = filterValues.jenis;
            if (filterValues.pembayaran) params.id_status_pembayaran = filterValues.pembayaran;

            const res = await AxiosInstance.get(`lomba/all`, { params });

            if (res.data.data) {
                return {
                    data: res.data.data,
                    pagination: res.data.pagination,
                };
            }

            return { data: [], pagination: {} };
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });
}

export function useInsertlomba() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload) => {
            const res = await AxiosInstance.post("lomba/add-new", payload);
            return res;
        },
        onSuccess: (data, variables) => {
            // Invalidate semua lomba
            queryClient.invalidateQueries({ queryKey: ["all-lomba"] });

            // Invalidate semua query lomba user tertentu
            if (variables.id_user) {
                queryClient.invalidateQueries({
                    queryKey: ["lomba-by-id-user"],
                    predicate: (query) => query.queryKey[1] === variables.id_user,
                });
            }
        },
        onError: (error) => {
            console.error("Gagal insert lomba:", error);
        },
    });
}

export function useAllKategori() {
    return useQuery({
        queryKey: computed(() => ["all-kategori"]),
        queryFn: async () => {
            const res = await AxiosInstance.get(`kategori/all`);

            if (res.data.data) {
                return {
                    data: res.data.data.map((data) => ({
                        value: data.id_kategori,
                        name: data.kategori_lomba,
                    })),
                };
            }

            return [];
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });
}

export function useAllPendidikan() {
    return useQuery({
        queryKey: computed(() => ["all-pendidikan"]),
        queryFn: async () => {
            const res = await AxiosInstance.get(`pendidikan/all`);

            if (res.data.data) {
                return {
                    data: res.data.data.map((data) => ({
                        value: data.id_pendidikan,
                        name: data.tingkat_pendidikan,
                    })),
                };
            }

            return [];
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });
}

export function useAllProvinsi() {
    return useQuery({
        queryKey: computed(() => ["all-provinsi"]),
        queryFn: async () => {
            const res = await AxiosInstance.get(`lokasi/provinsi`);

            if (res.data.data) {
                return {
                    data: res.data.data.map((data) => ({
                        value: data.id_provinsi,
                        name: data.nama_provinsi,
                    })),
                };
            }

            return [];
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });
}

export function useAllKabupatenByIdProvinsi(provinsi) {
    return useQuery({
        queryKey: ["all-kabupaten-by-id-provinsi", provinsi.value],
        queryFn: async () => {
            const res = await AxiosInstance.get("lokasi/kabupaten", {
                params: { id_provinsi: provinsi.value },
            });

            if (res.data.data) {
                return {
                    data: res.data.data.map((data) => ({
                        value: data.id_kabupaten,
                        name: data.nama_kabupaten,
                    })),
                };
            }

            return [];
        },
        enabled: !!provinsi.value,
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });
}

export function useAllJenis() {
    return useQuery({
        queryKey: computed(() => ["all-jenis"]),
        queryFn: async () => {
            const res = await AxiosInstance.get(`jenis/all`);

            if (res.data.data) {
                return {
                    data: res.data.data.map((data) => ({
                        value: data.id_jenis,
                        name: data.jenis_lomba,
                    })),
                };
            }

            return [];
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });
}

export function useAllPembayaran() {
    return useQuery({
        queryKey: computed(() => ["all-pembayaran"]),
        queryFn: async () => {
            const res = await AxiosInstance.get(`pembayaran/all`);

            if (res.data.data) {
                return {
                    data: res.data.data.map((data) => ({
                        value: data.id_status_pembayaran,
                        name: data.status_pembayaran,
                    })),
                };
            }

            return [];
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });
}

export function useAllLombaByIdUser(payload) {
    return useQuery({
        queryKey: computed(() => ["lomba-by-id-user", payload.value.id_user, payload.value.page, payload.value.limit]),
        queryFn: async () => {
            const { page, limit, id_user } = payload.value;

            const res = await AxiosInstance.get("lomba/user", {
                params: { page, limit, id_user },
            });

            return {
                data: res.data?.data ?? [],
                pagination: res.data?.pagination ?? {},
            };
        },
        enabled: computed(() => !!payload.value.id_user),
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });
}

// ini untuk hapus lomba di halaman dashboard panitia
export function useDeleteLomba() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload) => {
            const res = await AxiosInstance.delete(`lomba/delete/${payload.id_lomba}`);

            // Validasi response dari BE
            if (res.data.success === false || res.data.message?.includes("kesalahan")) {
                throw new Error(res.data.message || "Gagal menghapus lomba");
            }

            return res.data;
        },
        onSuccess: (data, payload) => {
            // Invalidate query key "lomba by-user" biar auto refresh
            queryClient.invalidateQueries({ queryKey: ["lomba-by-id-user", payload.id_user] });
        },
        onError: (error) => {
            console.error("Error delete lomba:", error);
        },
    });
}

export function useGetLombaById(id) {
    return useQuery({
        queryKey: ["lomba", id],
        queryFn: async () => {
            const res = await AxiosInstance.get("lomba", {
                params: { id_lomba: id },
            });
            return res.data;
        },
        enabled: !!id,
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });
}

// ini untuk edit lomba di panitia
export function useUpdateLomba() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await AxiosInstance.put(`lomba/update/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lomba"] });
            queryClient.invalidateQueries({ queryKey: ["lomba-by-id-user"] });
            queryClient.invalidateQueries({ queryKey: ["all-lomba"] });
        },
    });
}

export function useDetailLomba(id_lomba) {
    return useQuery({
        queryKey: ["detail-lomba", id_lomba],
        queryFn: async () => {
            const res = await AxiosInstance.get("lomba", {
                params: { id_lomba: id_lomba },
            });

            const data = res.data?.data;
            if (!data) return null;

            return {
                ...data,
            };
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });
}

// ini riwayat lomba untuk panitia melihat peserta yang mendaftar lomba
export function useAllRiwayatLomba(page = 1, limit = 100, filters = {}) {
    return useQuery({
        queryKey: computed(() => {
            const pageValue = page.value || page;
            const limitValue = limit.value || limit;
            const filterValue = filters.value || filters;
            return ["all-riwayat-lomba", pageValue, limitValue, filterValue];
        }),
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.value || page,
                limit: limit.value || limit,
            });

            // Add filter params if they exist
            const filterValues = filters.value || filters;
            if (filterValues.id_user) params.append("id_user", filterValues.id_user);
            if (filterValues.id_lomba) params.append("id_lomba", filterValues.id_lomba);
            if (filterValues.id_pembayaran) params.append("id_pembayaran", filterValues.id_pembayaran);

            // Gunakan endpoint yang sudah ada: /riwayat-lomba/all
            const res = await AxiosInstance.get(`riwayat-lomba/all?${params.toString()}`);

            console.log("Response dari /riwayat/all:", res.data);

            // Handle berbagai format response
            if (res.data && (res.data.ok === true || res.data.data)) {
                return {
                    data: res.data.data || [],
                    pagination: res.data.pagination || {},
                    total: res.data.pagination?.totalData || res.data.total || res.data.data?.length || 0,
                };
            }

            // Jika response langsung array
            if (Array.isArray(res.data)) {
                return {
                    data: res.data,
                    pagination: {},
                    total: res.data.length,
                };
            }

            return { data: [], pagination: {}, total: 0 };
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}

export function useUserProfile() {
    return useQuery({
        queryKey: ["user-profile", new Date().getTime()],
        queryFn: async () => {
            const res = await AxiosInstance.get("auth/profile");

            if (res.data.data) {
                return res.data.data;
            }

            return null;
        },
        staleTime: 0, // selalu fetch fresh data
        cacheTime: 0, // tidak cache data
        retry: 0,
    });
}
