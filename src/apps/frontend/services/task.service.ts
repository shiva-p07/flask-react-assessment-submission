import APIService from 'frontend/services/api.service';
import {
    Task,
    CreateTaskParams,
    UpdateTaskParams,
    PaginatedTasksResponse,
    ApiResponse,
} from 'frontend/types';
import { getAccessTokenFromStorage } from 'frontend/utils/storage-util';

export default class TaskService extends APIService {
    getAccountId(): string {
        const token = getAccessTokenFromStorage();
        if (!token) throw new Error('No access token found');
        return token.accountId;
    }

    getAllTasks = async (
        page: number = 1,
        size: number = 20,
    ): Promise<ApiResponse<PaginatedTasksResponse>> => {
        const accountId = this.getAccountId();
        const response = await this.apiClient.get<PaginatedTasksResponse>(
            `/accounts/${accountId}/tasks`,
            {
                params: { page, size },
            },
        );
        return new ApiResponse(response.data);
    };

    createTask = async (
        params: CreateTaskParams,
    ): Promise<ApiResponse<Task>> => {
        const accountId = this.getAccountId();
        const response = await this.apiClient.post<Task>(
            `/accounts/${accountId}/tasks`,
            params,
        );
        return new ApiResponse(response.data);
    };

    updateTask = async (
        taskId: string,
        params: UpdateTaskParams,
    ): Promise<ApiResponse<Task>> => {
        const accountId = this.getAccountId();
        const response = await this.apiClient.patch<Task>(
            `/accounts/${accountId}/tasks/${taskId}`,
            params,
        );
        return new ApiResponse(response.data);
    };

    deleteTask = async (taskId: string): Promise<ApiResponse<void>> => {
        const accountId = this.getAccountId();
        await this.apiClient.delete(`/accounts/${accountId}/tasks/${taskId}`);
        return new ApiResponse(undefined);
    };
}
