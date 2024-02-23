import { configureStore } from "@reduxjs/toolkit";
import { usersApi } from "./api/usersApi";


export const store = configureStore({
  //creamos la store que almacenara todos nuestros estados y agregamos el reducer de nuestra API
  //y slices si existieran
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
  },
   // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(usersApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch