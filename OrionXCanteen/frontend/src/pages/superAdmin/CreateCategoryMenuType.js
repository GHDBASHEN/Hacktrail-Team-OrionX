import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCategoryMenuTypes,
  addCategoryMenuType,
  getMenuTypes,
  getCategories,
  deleteCategoryMenuType,
  updateCategoryMenuType,
  getCategoryMenuTypeById,
} from '../../services/MenuService';

function CreateCategoryMenuType({ setRenderContent, handleRenderContent }) {
  const [categoryMenu, setCategoryMenu] = useState({
    menu_type_id: '',
    category_id: '',
    item_limit: '',
  });

  const [categoryMenuTypes, setCategoryMenuTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuTypes, setMenuTypes] = useState([]);
  const [btnName, setBtnName] = useState('Add Category Menu Type');
  const [selectedId, setSelectedId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  const topRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategoryMenuTypes, fetchedCategories, fetchedMenuTypes] = await Promise.all([
          getCategoryMenuTypes(),
          getCategories(),
          getMenuTypes()
        ]);

        // Reverse the array to show newest first
        setCategoryMenuTypes(fetchedCategoryMenuTypes.reverse());
        setCategories(fetchedCategories);
        setMenuTypes(fetchedMenuTypes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'item_limit') {
      if (!/^\d*$/.test(value)) return;
      if (value !== '' && parseInt(value, 10) <= 0) return;
    }

    setCategoryMenu((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (btnName === 'Add Category Menu Type') {
        await addCategoryMenuType(categoryMenu);
        alert('Category Menu Type added successfully!');
        setCategoryMenu({ menu_type_id: '', category_id: '', item_limit: '' });
        setIsAdding(false);
        
        if (handleRenderContent) {
          handleRenderContent('createItemCategoryMenuType');
        }

      } else {
        await updateCategoryMenuType(selectedId, categoryMenu);
        alert('Category Menu Type updated successfully!');
        setBtnName('Add Category Menu Type');
        setSelectedId(null);
        setCategoryMenu({ menu_type_id: '', category_id: '', item_limit: '' });
        setIsAdding(false);
      }

      const updated = await getCategoryMenuTypes();
      // Reverse the array to show newest first
      setCategoryMenuTypes(updated.reverse());
      
      // Scroll to top after adding/updating
      if (topRef.current) {
        topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error saving Category Menu Type:', error);
      alert('An error occurred while processing.');
    }
  };

  const handleEdit = async (id) => {
    try {
      const result = await getCategoryMenuTypeById(id);
      setCategoryMenu({
        menu_type_id: result.menu_type_id,
        category_id: result.category_id,
        item_limit: result.item_limit,
      });
      setSelectedId(id);
      setBtnName('Update');
      setIsAdding(true);
      
      // Scroll to form when editing
      if (topRef.current) {
        topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error loading data for edit:', error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this menu?');
    if (!isConfirmed) return;
    try {
      await deleteCategoryMenuType(id);
      alert('Deleted successfully!');
      const updated = await getCategoryMenuTypes();
      // Reverse the array to show newest first
      setCategoryMenuTypes(updated.reverse());
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div
  className="min-h-screen bg-gray-50 p-6 overflow-y-auto"
  style={{ maxHeight: '80vh' }}
  ref={topRef}
>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Category Menu Type Management</h1>
              <p className="text-gray-600">Link menu types with categories and set limits</p>
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New
            </button>
          )}
        </div>

        {isAdding && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {btnName === 'Add Category Menu Type' ? 'Create New Category Menu Type' : 'Update Category Menu Type'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Menu Type</label>
                  <select
                    name="menu_type_id"
                    required
                    value={categoryMenu.menu_type_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  >
                    <option value="">Select Menu Type</option>
                    {menuTypes.map((m) => (
                      <option key={m.menu_type_id} value={m.menu_type_id}>
                        {m.menu_type_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category_id"
                    required
                    value={categoryMenu.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Limit</label>
                  <input
                    type="number"
                    name="item_limit"
                    required
                    placeholder="Enter item limit"
                    value={categoryMenu.item_limit}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setBtnName('Add Category Menu Type');
                      setCategoryMenu({ menu_type_id: '', category_id: '', item_limit: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded-lg font-medium text-white transition duration-200 ${
                      btnName === 'Add Category Menu Type' 
                        ? 'bg-indigo-600 hover:bg-indigo-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {btnName}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Current Category Menu Types</h2>
          </div>
          {categoryMenuTypes.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No category menu types available</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first category menu type</p>
              <button
                onClick={() => {
                  setIsAdding(true);
                  if (topRef.current) {
                    topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                Add Category Menu Type
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Menu Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Limit
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoryMenuTypes.map((cmt, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cmt.menu_type_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cmt.category_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cmt.item_limit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(cmt.category_menu_type_Id)}
                          className="text-indigo-600 hover:text-indigo-900 px-3 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cmt.category_menu_type_Id)}
                          className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md bg-red-50 hover:bg-red-100 transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setIsAdding(true);
                          if (topRef.current) {
                            topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center w-full py-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New 
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

export default CreateCategoryMenuType;