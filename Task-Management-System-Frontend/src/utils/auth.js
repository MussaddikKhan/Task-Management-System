const TOKEN_KEY = 'task_management_token';
const USER_KEY = 'task_management_user';

//save auth token to local storage

export const saveToken = (token) => {
    try{
        localStorage.setItem(TOKEN_KEY, token);

    } catch(error){
        console.error('Failed to save token ', error);
    }
};

//get token from localStorage
export const getToken = () => {
    try{
        return localStorage.getItem(TOKEN_KEY);
    } catch(error){
        console.error('Failed to get token: ', error);
        return null;
    }
};

//remove tokrn from localStorage
export const removeToken = () => {
    try{
        localStorage.removeItem(TOKEN_KEY);

    } catch (error){
        console.error('Failed to remove token: ', error);
    }
};

//save data to local storage
export const saveUser = (user)=>{
    try{
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch(error){
        console.error('Failed to save user: ', error);
    }
};

//get data from the local storage
export const getUser = () =>{
    try{
        const userStr = localStorage.getItem(USER_KEY);
        return userStr? JSON.parse(userStr): null;
    } catch(error){
        console.error('Failed to get user ', error);
    }
};

//remove data fromn the local storage
export const removeUser = () => {
    try {
        localStorage.removeItem(USER_KEY);
    }catch(error){
        console.error('Failed to remove user: ',error);
    }
};

//clear token and user data
export const clearAuth = () => {
    removeToken();
    removeUser();
};

//check if authenticated 
export const isAuthenticated = () =>{
    return !!getToken();
};


