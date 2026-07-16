import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Rack, StorageType, Unit } from './types';

export interface StorageBody {
  name: string;
  capacity: number;
  [parentField: string]: string | number;
}

export interface UnitBody {
  name: string;
  description: string;
  quantity: number;
  minQuantity: number;
  imageKey: string | null;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Tree', 'Search'],
  endpoints: (builder) => ({
    tree: builder.query<Rack[], void>({
      query: () => 'racks/tree',
      providesTags: ['Tree'],
    }),
    search: builder.query<Unit[], string>({
      query: (q) => ({ url: 'units/search', params: { q } }),
      providesTags: ['Search'],
    }),
    createStorage: builder.mutation<unknown, { type: StorageType; body: StorageBody }>({
      query: ({ type, body }) => ({ url: type, method: 'POST', body }),
      invalidatesTags: ['Tree'],
    }),
    updateStorage: builder.mutation<
      unknown,
      { type: StorageType; id: string; body: Partial<StorageBody> }
    >({
      query: ({ type, id, body }) => ({ url: `${type}/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Tree'],
    }),
    deleteStorage: builder.mutation<unknown, { type: StorageType; id: string }>({
      query: ({ type, id }) => ({ url: `${type}/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tree', 'Search'],
    }),
    createUnit: builder.mutation<Unit, UnitBody & { boxId: string }>({
      query: (body) => ({ url: 'units', method: 'POST', body }),
      invalidatesTags: ['Tree', 'Search'],
    }),
    updateUnit: builder.mutation<Unit, { id: string; body: Partial<UnitBody> }>({
      query: ({ id, body }) => ({ url: `units/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Tree', 'Search'],
    }),
    deleteUnit: builder.mutation<unknown, string>({
      query: (id) => ({ url: `units/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tree', 'Search'],
    }),
    reorderUnits: builder.mutation<unknown, { boxId: string; unitIds: string[] }>({
      query: (body) => ({ url: 'units/reorder', method: 'PATCH', body }),
      invalidatesTags: ['Tree'],
    }),
    upload: builder.mutation<{ key: string }, FormData>({
      query: (formData) => ({ url: 'files/upload', method: 'POST', body: formData }),
    }),
  }),
});

export const {
  useTreeQuery,
  useSearchQuery,
  useCreateStorageMutation,
  useUpdateStorageMutation,
  useDeleteStorageMutation,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  useReorderUnitsMutation,
  useUploadMutation,
} = api;

export function errorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const data = (error as { data?: { message?: string | string[] } }).data;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(', ') : data.message;
    }
  }
  return 'Неизвестная ошибка';
}
