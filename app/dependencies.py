from app.dao.task_dao import TaskDAO
from app.services.task_service import TaskService
from app.services.user_service import UserService
from app.dao.user_dao import UserDAO

task_dao = TaskDAO()
task_service = TaskService(task_dao)

user_dao = UserDAO(); 
user_service = UserService(user_dao)