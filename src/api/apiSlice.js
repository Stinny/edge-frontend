import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers) => {
    const aToken = Cookies.get('aToken') || null;
    if (aToken) headers.set('Authorization', `Bearer ${aToken}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403 || result?.error?.status === 401) {
    const rToken = Cookies.get('rToken') || null;

    if (rToken) {
      const refreshResult = await baseQuery(`/auth/tkn/${rToken}`, api, extraOptions);

      if (refreshResult?.data?.tkn) {
        Cookies.set('aToken', refreshResult.data.tkn, { sameSite: 'Lax' });
        result = await baseQuery(args, api, extraOptions);
      } else {
        Cookies.remove('currentUser');
        Cookies.remove('aToken');
        Cookies.remove('rToken');
        window.location.href = '/login';
      }
    } else {
      Cookies.remove('currentUser');
      Cookies.remove('aToken');
      Cookies.remove('rToken');
      window.location.href = '/login';
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Sites', 'Notes'],
  endpoints: () => ({}),
});
