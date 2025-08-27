import api from './Api';

export const createCategory = async (categoryName) => {
    const response = await api.post('/categories', { category_name: categoryName });
    return response.data;
};


export const getAllCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};


export const updateCategory = async (categoryId, categoryName) => {
    const response = await api.put(`/categories/${categoryId}`, { category_name: categoryName });
    return response.data;
};


export const deleteCategory = async (categoryId) => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
};

export const createFood = async (foodData) => {
    const response = await api.post('/foods', foodData);
    return response.data;
};

export const getAllFoods = async () => {
    const response = await api.get('/foods');
    return response.data;
};

export const updateFood = async (foodId, foodData) => {
    const response = await api.put(`/foods/${foodId}`, foodData);
    return response.data;
};

export const deleteFood = async (foodId) => {
    const response = await api.delete(`/foods/${foodId}`);
    return response.data;
};



// Daily Food Services
export const createDailyFood = async (dailyFoodData) => {
    const response = await api.post('/admin/daily-foods', dailyFoodData);
    return response.data;
};

export const getAllDailyFoods = async () => {
    const response = await api.get('/admin/daily-foods');
    return response.data;
};

export const updateDailyFood = async (id, dailyFoodData) => {
    const response = await api.put(`/admin/daily-foods/${id}`, dailyFoodData);
    return response.data;
};

export const deleteDailyFood = async (id) => {
    const response = await api.delete(`/admin/daily-foods/${id}`);
    return response.data;
};

// Daily Food Component Services
export const createDailyFoodComponent = async (componentData) => {
    const response = await api.post('/admin/daily-food-components', componentData);
    return response.data;
};

export const getAllDailyFoodComponents = async () => {
    const response = await api.get('/admin/daily-food-components');
    return response.data;
};

export const updateDailyFoodComponent = async (id, componentData) => {
    const response = await api.put(`/admin/daily-food-components/${id}`, componentData);
    return response.data;
};

export const deleteDailyFoodComponent = async (id) => {
    const response = await api.delete(`/admin/daily-food-components/${id}`);
    return response.data;
};
