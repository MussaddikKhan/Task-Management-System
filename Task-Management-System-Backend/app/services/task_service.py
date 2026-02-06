from app.dao.task_dao import TaskDAO
from app.schemas.task_schema import TaskCreate, TaskUpdate, TaskResponse
from app.exceptions.NotFoundExcp import NotFoundError
from app.models.enums.TaskStatus import TaskStatus
from app.services.user_service import user_service


class TaskService:

    def __init__(self, dao: TaskDAO):
        self.dao = dao


    # CREATE TASK (ADMIN assigns to employee)
    async def create_task(self, task_in: TaskCreate) -> TaskResponse:

        # 🔥 Check employee exists
        user = await user_service.get_user_by_id(task_in.assigned_to_id)

        if not user:
            raise NotFoundError("Assigned employee does not exist")

        if user.role != "EMPLOYEE":
            raise NotFoundError("Task can only be assigned to employees")

        return await self.dao.create(task_in)

    # ==================================================
    async def get_all_tasks(self) -> list[TaskResponse]:
        return await self.dao.get_all()

    # ==================================================
    async def get_task(self, task_id: int) -> TaskResponse:
        task = await self.dao.get_by_id(task_id)
        if not task:
            raise NotFoundError("Task not found")
        return task

    async def update_task(self, task_id: int, task_update: TaskUpdate) -> TaskResponse:
        existing_task = await self.dao.get_by_id(task_id)

        if not existing_task:
            raise NotFoundError("Task not found")

        # Validate assigned employee only if reassignment requested
        if task_update.assigned_to_id is not None:

            assigned_user = await user_service.get_user_by_id(
                task_update.assigned_to_id
            )

            if not assigned_user:
                raise NotFoundError("Assigned employee does not exist")

            if assigned_user.role != "EMPLOYEE":
                raise NotFoundError("Task can only be assigned to employees")

        updated_task = await self.dao.update(task_id, task_update)
        return updated_task or existing_task


    # Get User's Task 
    async def get_user_task(self, user_id: int) -> list[TaskResponse]:
        return await self.dao.get_task_by_user_id(user_id)


    # EMPLOYEE STATUS UPDATE
    async def update_status(self, user_id: int, task_id: int, status: TaskStatus) -> TaskResponse:

        task = await self.get_task(task_id)

        #  Handle 
        if task.assigned_to_id != user_id:
            raise NotFoundError("This task is not assigned to this user")

        update_data = TaskUpdate(status=status)

        updated_task = await self.dao.update(task_id, update_data)

        return updated_task or task

    #Delete task 
    async def delete_task(self, task_id: int):

        task = await self.dao.get_by_id(task_id)

        if not task:
            raise NotFoundError("Task not found")

        await self.dao.delete(task_id)
