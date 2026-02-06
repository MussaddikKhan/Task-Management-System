from  enum import Enum


"""
   Enum showing fixed task status options.
   Only these values are allowed: Pending, In Progress, Completed.
"""
class TaskStatus(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"