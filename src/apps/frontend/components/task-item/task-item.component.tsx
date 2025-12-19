import * as React from 'react';
import { Task } from 'frontend/types';

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
    const [showConfirm, setShowConfirm] = React.useState(false);

    const handleDelete = () => {
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        onDelete(task.id);
        setShowConfirm(false);
    };

    return (
        <div className="task-item">
            <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>
            </div>

            <div className="task-actions">
                <button
                    className="btn-edit"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                >
                    ✏️ Edit
                </button>
                <button
                    className="btn-delete"
                    onClick={handleDelete}
                    title="Delete task"
                >
                    🗑️ Delete
                </button>
            </div>

            {showConfirm && (
                <div className="delete-confirm">
                    <p>Are you sure you want to delete this task?</p>
                    <div className="confirm-actions">
                        <button onClick={() => setShowConfirm(false)}>Cancel</button>
                        <button onClick={confirmDelete} className="danger">
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
