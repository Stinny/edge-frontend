import { apiSlice } from './apiSlice';

export const sitesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSites: builder.query({
      query: () => '/sites',
      providesTags: ['Sites'],
    }),
    getSite: builder.query({
      query: (id) => `/sites/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Sites', id }],
    }),
    createSite: builder.mutation({
      query: (body) => ({ url: '/sites', method: 'POST', body }),
      invalidatesTags: ['Sites'],
    }),
    updateSite: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/sites/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Sites'],
    }),
    deleteSite: builder.mutation({
      query: (id) => ({ url: `/sites/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Sites'],
    }),
  }),
});

export const {
  useGetSitesQuery,
  useGetSiteQuery,
  useCreateSiteMutation,
  useUpdateSiteMutation,
  useDeleteSiteMutation,
} = sitesApiSlice;
