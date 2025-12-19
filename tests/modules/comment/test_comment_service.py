from modules.comment.comment_service import CommentService
from modules.comment.errors import CommentNotFoundError
from modules.comment.types import (
    CreateCommentParams,
    DeleteCommentParams,
    GetCommentParams,
    GetPaginatedCommentsParams,
    UpdateCommentParams,
)
from modules.application.common.types import PaginationParams
from modules.task.errors import TaskNotFoundError
from tests.modules.comment.base_test_comment import BaseTestComment


class TestCommentService(BaseTestComment):

    def test_create_comment_success(self) -> None:
        account, _ = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)

        comment = CommentService.create_comment(
            params=CreateCommentParams(account_id=account.id, task_id=task.id, content="Test comment content")
        )

        assert comment.id is not None
        assert comment.task_id == task.id
        assert comment.account_id == account.id
        assert comment.content == "Test comment content"

    def test_create_comment_task_not_found(self) -> None:
        account, _ = self.create_account_and_get_token()
        non_existent_task_id = "507f1f77bcf86cd799439011"

        try:
            CommentService.create_comment(
                params=CreateCommentParams(
                    account_id=account.id, task_id=non_existent_task_id, content="Test comment"
                )
            )
            assert False, "Expected TaskNotFoundError to be raised"
        except TaskNotFoundError:
            pass

    def test_get_comment_success(self) -> None:
        account, _ = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        created_comment = self.create_test_comment(account_id=account.id, task_id=task.id, content="Original content")

        retrieved_comment = CommentService.get_comment(
            params=GetCommentParams(account_id=account.id, task_id=task.id, comment_id=created_comment.id)
        )

        assert retrieved_comment.id == created_comment.id
        assert retrieved_comment.task_id == task.id
        assert retrieved_comment.account_id == account.id
        assert retrieved_comment.content == "Original content"

    def test_get_comment_not_found(self) -> None:
        account, _ = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        non_existent_comment_id = "507f1f77bcf86cd799439011"

        try:
            CommentService.get_comment(
                params=GetCommentParams(account_id=account.id, task_id=task.id, comment_id=non_existent_comment_id)
            )
            assert False, "Expected CommentNotFoundError to be raised"
        except CommentNotFoundError:
            pass

    def test_get_paginated_comments_empty(self) -> None:
        account, _ = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)

        pagination_result = CommentService.get_paginated_comments(
            params=GetPaginatedCommentsParams(
                account_id=account.id, task_id=task.id, pagination_params=PaginationParams(page=1, size=10, offset=0)
            )
        )

        assert pagination_result.total_count == 0
        assert len(pagination_result.items) == 0

    def test_get_paginated_comments_with_data(self) -> None:
        account, _ = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        self.create_multiple_test_comments(account_id=account.id, task_id=task.id, count=5)

        pagination_result = CommentService.get_paginated_comments(
            params=GetPaginatedCommentsParams(
                account_id=account.id, task_id=task.id, pagination_params=PaginationParams(page=1, size=10, offset=0)
            )
        )

        assert pagination_result.total_count == 5
        assert len(pagination_result.items) == 5

    def test_get_paginated_comments_with_pagination(self) -> None:
        account, _ = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        self.create_multiple_test_comments(account_id=account.id, task_id=task.id, count=10)

        page1_result = CommentService.get_paginated_comments(
            params=GetPaginatedCommentsParams(
                account_id=account.id, task_id=task.id, pagination_params=PaginationParams(page=1, size=3, offset=0)
            )
        )

        page2_result = CommentService.get_paginated_comments(
            params=GetPaginatedCommentsParams(
                account_id=account.id, task_id=task.id, pagination_params=PaginationParams(page=2, size=3, offset=0)
            )
        )

        assert page1_result.total_count == 10
        assert len(page1_result.items) == 3
        assert page2_result.total_count == 10
        assert len(page2_result.items) == 3
        assert page1_result.items[0].id != page2_result.items[0].id

    def test_update_comment_success(self) -> None:
        account, _ = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        created_comment = self.create_test_comment(account_id=account.id, task_id=task.id, content="Original")

        updated_comment = CommentService.update_comment(
            params=UpdateCommentParams(
                account_id=account.id, task_id=task.id, comment_id=created_comment.id, content="Updated"
            )
        )

        assert updated_comment.id == created_comment.id
        assert updated_comment.content == "Updated"

    def test_update_comment_not_found(self) -> None:
        account, _ = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        non_existent_comment_id = "507f1f77bcf86cd799439011"

        try:
            CommentService.update_comment(
                params=UpdateCommentParams(
                    account_id=account.id, task_id=task.id, comment_id=non_existent_comment_id, content="Updated"
                )
            )
            assert False, "Expected CommentNotFoundError to be raised"
        except CommentNotFoundError:
            pass

    def test_delete_comment_success(self) -> None:
        account, _ = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        created_comment = self.create_test_comment(account_id=account.id, task_id=task.id)

        deletion_result = CommentService.delete_comment(
            params=DeleteCommentParams(account_id=account.id, task_id=task.id, comment_id=created_comment.id)
        )

        assert deletion_result.success is True
        assert deletion_result.comment_id == created_comment.id

        try:
            CommentService.get_comment(
                params=GetCommentParams(account_id=account.id, task_id=task.id, comment_id=created_comment.id)
            )
            assert False, "Expected CommentNotFoundError after deletion"
        except CommentNotFoundError:
            pass

    def test_delete_comment_not_found(self) -> None:
        account, _ = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        non_existent_comment_id = "507f1f77bcf86cd799439011"

        try:
            CommentService.delete_comment(
                params=DeleteCommentParams(
                    account_id=account.id, task_id=task.id, comment_id=non_existent_comment_id
                )
            )
            assert False, "Expected CommentNotFoundError to be raised"
        except CommentNotFoundError:
            pass

    def test_comments_scoped_to_task(self) -> None:
        account, _ = self.create_account_and_get_token()
        task1 = self.create_test_task(account_id=account.id, title="Task 1")
        task2 = self.create_test_task(account_id=account.id, title="Task 2")

        comment1 = self.create_test_comment(account_id=account.id, task_id=task1.id, content="Comment for Task 1")
        comment2 = self.create_test_comment(account_id=account.id, task_id=task2.id, content="Comment for Task 2")

        task1_comments = CommentService.get_paginated_comments(
            params=GetPaginatedCommentsParams(
                account_id=account.id, task_id=task1.id, pagination_params=PaginationParams(page=1, size=10, offset=0)
            )
        )

        task2_comments = CommentService.get_paginated_comments(
            params=GetPaginatedCommentsParams(
                account_id=account.id, task_id=task2.id, pagination_params=PaginationParams(page=1, size=10, offset=0)
            )
        )

        assert task1_comments.total_count == 1
        assert task1_comments.items[0].content == "Comment for Task 1"
        assert task2_comments.total_count == 1
        assert task2_comments.items[0].content == "Comment for Task 2"
