import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../src/App";

export const usersApi = createApi({
  reducerPath: "usersApi",
  tagTypes: ["users"], //creo el tag "users" para invalidar request cada vez
  //que se produzca una modificacion en la bd
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "users",
      providesTags: ["users"]
    }),
    deleteUserById: builder.mutation<void, User["id"]>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["users"]
    }),
    updateUserById: builder.mutation<User, User>({
      query: (updatedUser) => ({
        url: `users/${updatedUser.id}`,
        method: "PUT",
        body: updatedUser
      }),
      invalidatesTags: ["users"]
    }),
    createUser: builder.mutation<User, User>({
      query: (newUser) => ({
        url: "users",
        method: "POST",
        body: newUser
      }),
      invalidatesTags: ["users"]
    })
  })
});

export const {
  useGetUsersQuery,
  useDeleteUserByIdMutation,
  useCreateUserMutation,
  useUpdateUserByIdMutation
} = usersApi;
