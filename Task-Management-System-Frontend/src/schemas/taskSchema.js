//matches the backend taskresponse schema 

export const TaskSchema = {
    id:Number,
    title:String,
    description:String,
   assigned_user: Number,
    status:String,
    due_date: String|null,
    create_date:String
};

export const TaskCreateSchema ={
    title:String,
    description:String,
   assigned_user:Number,
    due_date: String|null
};

export const TaskUpdateSchema = {
    title: String | undefined,
    description: String | undefined,
   assigned_user: Number | undefined
};

export const TaskStatusUpdateSchema = {
    status:String
};
