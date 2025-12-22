import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";
import AxiosInstance from "@/lib/axios/axiosInstance";

export function useAllLomba() {
    return useQuery({
        queryKey: computed(() => ["all-lomba"]),
        queryFn: async () => {
            const res = await AxiosInstance.get(`lomba/all`);

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
};

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
};

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
};

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
};