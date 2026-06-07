import axios, { HttpStatusCode } from 'axios';
import type { BetResponse, CreateBetRequest, RankResponse, WorldCupResponse } from './types';

axios.defaults.baseURL = "http://localhost:5073/";

export type ApiResponse<T> = {
   status: HttpStatusCode;
   data: T | null;
   errors: string[];
}

export async function request<T>(
  promise: Promise<{ data: T; status: number }>
): Promise<ApiResponse<T>> {
  try {
    const response = await promise;

    return {
      status: response.status as HttpStatusCode,
      data: response.data,
      errors: [],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
    console.log(error.response);
    console.log(error.message);

      return {
        status:
          (error.response?.status as HttpStatusCode) ??
          HttpStatusCode.InternalServerError,
        data: null,
        errors: [error.message],
      };
    }

    return {
      status: HttpStatusCode.InternalServerError,
      data: null,
      errors: ['Erro inesperado'],
    };
  }
}
 
export const getWorldCupData = () => 
   request<WorldCupResponse>(axios.get("/worldcup"));

export const getRanking = (page: number, pageSize: number) =>
   request<RankResponse>(
      axios.get("/bet/rank", {
         params: {
            Page: page,
            PageSize: pageSize
         },
      })
   );

export const getBet = (betId: string) =>
  request<BetResponse>(axios.get(`/bet/${betId}`));

export const createBet = (data: CreateBetRequest) =>
  request<BetResponse>(axios.post("/bet", data));