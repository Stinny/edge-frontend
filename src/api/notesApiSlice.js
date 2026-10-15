import { apiSlice } from './apiSlice';

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotesForSite: builder.query({
      query: (siteId) => `/notes/site/${siteId}`,
      providesTags: (_r, _e, siteId) => [{ type: 'Notes', id: siteId }],
    }),
    createNote: builder.mutation({
      query: ({ siteId, content }) => ({
        url: '/notes',
        method: 'POST',
        body: { siteId, content },
      }),
      invalidatesTags: (_r, _e, { siteId }) => [{ type: 'Notes', id: siteId }],
    }),
    updateNote: builder.mutation({
      query: ({ id, content }) => ({
        url: `/notes/${id}`,
        method: 'PUT',
        body: { content },
      }),
      invalidatesTags: (_r, _e, { siteId }) => [{ type: 'Notes', id: siteId }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({ url: `/notes/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, { siteId }) => [{ type: 'Notes', id: siteId }],
    }),
  }),
});

export const {
  useGetNotesForSiteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;
