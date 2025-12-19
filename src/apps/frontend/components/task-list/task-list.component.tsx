import * as React from 'react';
import toast from 'react-hot-toast';
import { Task, CreateTaskParams, UpdateTaskParams } from 'frontend/types';
import { TaskService } from 'frontend/services';
import { TaskItem } from 'frontend/components/task-item/task-item.component';
import { TaskForm } from 'frontend/components/task-form/task-form.component';
import { Button } from 'frontend/components';
import './task-list.styles.css';

const taskService = new TaskService();

export const TaskList: React.FC = () => {
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [editingTask, setEditingTask] = React.useState<Task | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const fetchTasks = React.useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await taskService.getAllTasks();
            setTasks(response.data.items);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load tasks');
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleCreate = () => {
        setEditingTask(null);
        setShowModal(true);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    const handleSubmit = async (params: CreateTaskParams | UpdateTaskParams) => {
        try {
            setIsSubmitting(true);

            if (editingTask) {
                await taskService.updateTask(editingTask.id, params as UpdateTaskParams);
                toast.success('Task updated successfully');
            } else {
                await taskService.createTask(params as CreateTaskParams);
                toast.success('Task created successfully');
            }

            setShowModal(false);
            setEditingTask(null);
            await fetchTasks();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save task');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (taskId: string) => {
        try {
            await taskService.deleteTask(taskId);
            toast.success('Task deleted successfully');
            await fetchTasks();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete task');
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setEditingTask(null);
    };

    if (isLoading) {
        return <div className="loading">Loading tasks...</div>;
    }

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <h2>My Tasks</h2>
                <Button onClick={handleCreate}>+ Create Task</Button>
            </div>

            {tasks.length === 0 ? (
                <div className="empty-state">
                    <p>No tasks yet. Create your first task to get started!</p>
                    <Button onClick={handleCreate}>Create Task</Button>
                </div>
            ) : (
                <div className="tasks-grid">
                    {tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={handleCancel}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
                        <TaskForm
                            task={editingTask}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isLoading={isSubmitting}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
