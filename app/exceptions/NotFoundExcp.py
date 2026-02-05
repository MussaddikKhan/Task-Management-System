class NotFoundError(Exception):
    """
    Raised when requested resource is not found.
    Example: Task with given ID does not exist.
    """
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)
