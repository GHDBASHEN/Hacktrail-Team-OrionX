import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, addCategory, getCategoryById, deleteCategory, updateCategoryById } from '../../services/MenuService';
import CreateItem from './CreateItem';

function CreateCategory({ setRenderContent, handleRenderContent }) {
  const [category, setCategory] = useState({ category_id: '', category_name: '' });
  const [categories, setCategories] = useState([]);
  const [btnname, setBtnname] = useState('Add Category');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const topRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        // Reverse the array to show newest first
        setCategories(fetchedCategories.reverse());

        const nextId = fetchedCategories.length
          ? `C${(fetchedCategories.length + 1).toString().padStart(6, '0')}`
          : 'C000001';

        setCategory((prev) => ({ ...prev, category_id: nextId }));
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again.');
      }
    };
    fetchCategories();
  }, []);

  const handleValidation = () => {
    return categories.some(
      (item) => item.category_name.toLowerCase() === category.category_name.toLowerCase()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!category.category_name.trim()) {
      setError('Category name cannot be empty or just spaces!');
      return;
    }

    if (handleValidation()) {
      setError('This category name already exists! Please enter a unique name.');
      return;
    }

    try {
      if (btnname === 'Add Category') {
        const newCategory = {
          category_name: category.category_name
        };
        await addCategory(newCategory);
        alert('Category added successfully!');
        setCategory({ category_name: '' });
        setIsAdding(false);
       
        
        if (handleRenderContent) {
          handleRenderContent('createItem');
        }

      } else if (btnname === 'Update') {
        await updateCategoryById(category.category_id, category.category_name);
        alert('Category updated successfully!');
        setCategory({ category_name: '' });
        setBtnname('Add Category');
        setIsAdding(false);
      }

      const updatedCategories = await getCategories();
      // Reverse the array to show newest first
      setCategories(updatedCategories.reverse());
      
      // Scroll to top after adding/updating
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'An error occurred while processing the category. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (id) => {
    try {
      const fetchedCategory = await getCategoryById(id);
      if (!fetchedCategory) {
        setError('Category ID not found.');
        return;
      }
      setCategory({ category_id: id, category_name: fetchedCategory.category_name });
      setBtnname('Update');
      setIsAdding(true);
      
      // Scroll to form when editing
      if (topRef.current) {
       topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      setError('Failed to load category details. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this menu?');
    if (!isConfirmed) return;

    try {
      const deleteResponse = await deleteCategory(id);
      if (deleteResponse) {
        alert(deleteResponse.message || 'Category deleted successfully');
        const updatedCategories = await getCategories();
        // Reverse the array to show newest first
        setCategories(updatedCategories.reverse());
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setError(error.response?.data?.message || 'Failed to delete category. Please try again.');
    }
  };

  return (
    <div
  className="min-h-screen bg-gray-50 p-6 overflow-y-auto"
  style={{ maxHeight: '80vh' }}
  ref={topRef}
>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
              <p className="text-gray-600">Organize your menu items into categories</p>
            </div>
          </div>
          {!isAdding && (
            <button
              onClick={() => {
                setIsAdding(true);
                if (topRef.current) {
                  topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {isAdding && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {btnname === 'Add Category' ? 'Create New Category' : 'Update Category'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    name="category_name"
                    required
                    placeholder="e.g. Appetizers, Main Course, Desserts"
                    value={category.category_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setBtnname('Add Category');
                      setCategory({ category_name: '' });
                      setError(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded-lg font-medium text-white transition duration-200 ${
                      btnname === 'Add Category' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {btnname}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Current Categories</h2>
          </div>
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No categories available</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first category</p>
              <button
                onClick={() => {
                  setIsAdding(true);
                  if (topRef.current) {
                    topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                Add Category
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((cat, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{cat.category_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(cat.category_id)}
                          className="text-purple-600 hover:text-purple-900 px-3 py-1 rounded-md bg-purple-50 hover:bg-purple-100 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.category_id)}
                          className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md bg-red-50 hover:bg-red-100 transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setIsAdding(true);
                          if (topRef.current) {
                            topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center w-full py-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Category
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateCategory;