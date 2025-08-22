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