import * as React from 'react';
import { Task, CreateTaskParams, UpdateTaskParams } from 'frontend/types';
import { Button } from 'frontend/components';

interface TaskFormProps {
    task?: Task | null;
    onSubmit: (params: CreateTaskParams | UpdateTaskParams) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
    task,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const [title, setTitle] = React.useState(task?.title || '');
    const [description, setDescription] = React.useState(task?.description || '');
    const [error, setError] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        if (!description.trim()) {
            setError('Description is required');
            return;
        }

        try {
            await onSubmit({ title, description });
        } catch (err: any) {
            setError(err.message || 'Failed to save task');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    disabled={isLoading}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                    disabled={isLoading}
                    rows={4}
                    required
                />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="secondary"
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                </Button>
            </div>
        </form>
    );
};
