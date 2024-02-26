import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../src/App";

const SERVER_URL = "http://localhost:4000/";

export const usersApi = createApi({
  reducerPath: "usersApi",
  // creo el tag "users" para invalidar request cada vez
  // que se produzca una modificacion en la db
  tagTypes: ["users"],
  baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL }),
  endpoints: (builder) => ({
    getUsers: builder.query<
      { dataset: User[]; totalset: number },
      {
        _limit: number;
        _start: number;
        name_like: string;
        status?: string;
      }
    >({
      query: (params) => ({ url: "users", params }),//envio los params en la request
      transformResponse: (body: User[], meta) => ({
        dataset: body,
        totalset: Number(meta?.response?.headers.get("X-Total-Count")) 
        //obtengo el total set desde la meta data para saber 
        //el total de usuarios en cada busqueda y renderizarlo en <Pagination>
      }),
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
