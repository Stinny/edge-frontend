import { apiSlice } from './apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, pass, rememberMe }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { email, pass, rememberMe },
      }),
    }),
    changePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: '/auth/password/change',
        method: 'POST',
        body: { oldPassword, newPassword },
      }),
    }),
    updateProfile: builder.mutation({
      query: ({ name }) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: { name },
      }),
    }),
  }),
});

export const { useLoginMutation, useChangePasswordMutation, useUpdateProfileMutation } = authApiSlice;
