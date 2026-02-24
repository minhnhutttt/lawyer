import { get } from '../api';
import { LawyerHistoryParams, LawyerHistoryResponse } from "../types/lawyer-history";
import { ApiResponse } from '../types/api';

/**
 * Fetch lawyer history with pagination
 */
export async function getLawyerHistory(params: LawyerHistoryParams): Promise<LawyerHistoryResponse> {
  return get(`/lawyers/${params.lawyer_id}/history`, {
    page: params.page || 1,
    limit: params.limit || 10
  });
}

export default {
  getLawyerHistory
};
