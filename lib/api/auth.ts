// // src/api/user.ts

// import useSWR from "swr";
// import api from "@/lib/api";
// import { User, PaginatedResponse } from "@/lib/types"; // ✅ 1. Import PaginatedResponse

// const USERS_ENDPOINT = "/auth/users/";

// const fetcher = (url: string) => api.get(url).then((res) => res.data);

// /**
//  * Fetches a list of all users.
//  */
// export function useUsers() {
//   // ✅ 2. Tell SWR to expect a PaginatedResponse object containing Users
//   const { data, error, isLoading } = useSWR<PaginatedResponse<User>>(USERS_ENDPOINT, fetcher);

//   return {
//     // ✅ 3. Return the 'results' array from the data object
//     users: data?.results, 
//     isLoading,
//     error,
//   };
// }