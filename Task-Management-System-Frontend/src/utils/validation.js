//emailk validation
export const isValidEmail = (email) => {
    if(!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

//validate password 
export const validatePassword = (password, minLength = 6)=>{
    if(!password){
        return {isValid: false, message:'Password is required'};
    }

    if(password.length < minLength){
        return {
            isValid: false,
            message:`Password must be at least ${minLength} character long`
        };
    }
    return { isValid: true, message: '' };
};

//validate required fields
export const validateRequiredFields = (data, requiredFields) =>{
    const missingFields = requiredFields.filter(field => !data[field]);

    return {
        isValid: missingFields.length === 0,
        missingFields
    };
};

//Format date to iso strings for api
export const formatDateForAPI = (date) =>{
    if(!date) return null;

    try{
        const dateObj = date instanceof Date ? date:new Date(date);
        return dateObj.toISOString();
    } catch (error){
        console.error('Failed to format date: ',error);
        return null;
    }
};


//format date for display in ui
export const formatDateForDisplay = (dateString) => {
    if(!dateString) return '';

    try{
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US',{
            year:'numeric',
            month:'short',
            day:'numeric',
            hour:'2-digit',
            minute:'2-digit'
        });
    } catch(error){
        console.error('Failed to format date for display: ', error);
        return dateString;
    }
};

/** Alias for formatDateForDisplay (used by TaskCard for due_date, created_at) */
export const formatDataForDisplay = formatDateForDisplay;

