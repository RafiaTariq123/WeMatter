import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const groupChatApi = createApi({
  reducerPath: 'groupChatApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/', credentials: 'include' }),
  tagTypes: ['GroupMessages'],
  endpoints: (builder) => ({
    getGroupMessages: builder.query({
      query: (roomId) => `/group-messages/${roomId}`,
      providesTags: (result, error, roomId) => [{ type: 'GroupMessages', id: roomId }],
    }),
    sendGroupMessage: builder.mutation({
      query: ({ roomId, messageData }) => ({
        url: `/group-messages/send/${roomId}`,
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: (result, error, { roomId }) => [{ type: 'GroupMessages', id: roomId }],
    }),
  }),
});

export const { useGetGroupMessagesQuery, useSendGroupMessageMutation } = groupChatApi;
