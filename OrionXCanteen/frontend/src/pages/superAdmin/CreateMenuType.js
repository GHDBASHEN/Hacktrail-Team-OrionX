import React, { useState, useEffect, useRef } from 'react';
import { getMenuTypes, addMenuType, getMenus, deleteMenuType, updateMenuTypeById, getMenuTypeById } from '../../services/MenuService';
import CreateCategory from './CreateCategories';

function CreateMenuType({ setRenderContent, handleRenderContent }) {
  const [menuType, setMenuType] = useState({ menu_type_id: '', menu_type_name: '', price: '', menu_list_type_id: '' });
  const [menuTypes, setMenuTypes] = useState([]);
  const [menuListTypes, setMenuListTypes] = useState([]);
  const [btnname, setBtnname] = useState('Add Menu Type');
  const [isAdding, setIsAdding] = useState(false);
  const topRef = useRef(null);

  useEffect(() => {
    const fetchMenuTypes = async () => {
      try {
        const fetchedMenuTypes = await getMenuTypes();
        // Reverse the array to show newest first
        setMenuTypes(fetchedMenuTypes.reverse());
        const nextId = fetchedMenuTypes.length ? `MT${(fetchedMenuTypes.length + 1).toString().padStart(6, '0')}` : 'MT000001';
        setMenuType((prev) => ({ ...prev, menu_type_id: nextId }));
      } catch (error) {
        console.error('Error fetching menu types:', error);
      }
    };

    const fetchMenuListTypes = async () => {
      try {
        const fetchedMenuListTypes = await getMenus();
        setMenuListTypes(fetchedMenuListTypes);
      } catch (error) {
        console.error('Error fetching menu list types:', error);
      }
    };

    fetchMenuTypes();
    fetchMenuListTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = menuType.menu_type_name.trim();

    if (!trimmedName) {
      alert("Menu Type Name cannot be empty or contain only spaces!");
      return;
    }

    if (!menuType.price || !menuType.menu_list_type_id) {
      alert("All fields are required!");
      return;
    }

    if (isNaN(menuType.price) || Number(menuType.price) <= 0) {
      alert("Price must be a positive number!");
      return;
    }

    const isDuplicate = menuTypes.some(mt => mt.menu_type_name.toLowerCase() === trimmedName.toLowerCase());
    if (isDuplicate && btnname === "Add Menu Type") {
      alert("Menu type name already exists!");
      return;
    }

    try {
      if (btnname === 'Add Menu Type') {
        await addMenuType({ ...menuType, menu_type_name: trimmedName });
        alert('Menu Type added successfully!');
        setMenuType({ menu_type_id: '', menu_type_name: '', price: '', menu_list_type_id: '' });

        const updatedMenuTypes = await getMenuTypes();
        // Reverse the array to show newest first
        setMenuTypes(updatedMenuTypes.reverse());
        setIsAdding(false);


        if (handleRenderContent) {
          handleRenderContent('createCategory');
        }

      } else if (btnname === 'Update') {
        await updateMenuTypeById({ ...menuType, menu_type_name: trimmedName });
        alert('Menu Type updated successfully!');

        const updatedMenuTypes = await getMenuTypes();
        // Reverse the array to show newest first
        setMenuTypes(updatedMenuTypes.reverse());
        setBtnname('Add Menu Type');
        setIsAdding(false);
      }

      // Scroll to top after adding/updating
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the menu type.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price" && value !== "" && !/^\d+(\.\d{0,2})?$/.test(value)) {
      return; 
    }

    setMenuType((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (id) => {
    try {
      const menuTypeData = await getMenuTypeById(id);
      if (!menuTypeData) {
        alert('Menu type not found.');
        return;
      }

      setMenuType({
        menu_type_id: id,
        menu_type_name: menuTypeData.menu_type_name,
        price: menuTypeData.price,
        menu_list_type_id: menuTypeData.menu_list_type_id,
      });
      setBtnname('Update');
      setIsAdding(true);

      // Scroll to form when editing
      if (topRef.current) {
       topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error fetching menu type by ID:', error);
      alert('An error occurred while fetching the menu type.');
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this menu?');
    if (!isConfirmed) return; 
    try {
      const response = await deleteMenuType(id);
      if (response) {
        alert(response.message);
        const updatedMenuTypes = await getMenuTypes();
        // Reverse the array to show newest first
        setMenuTypes(updatedMenuTypes.reverse());
      }
    } catch (error) {
      console.error('Error deleting menu type:', error);
      alert('An error occurred while deleting the menu type.');
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
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Menu Type Management</h1>
              <p className="text-gray-600">Organize your menu items by types and categories</p>
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
                {btnname === 'Add Menu Type' ? 'Create New Menu Type' : 'Update Menu Type'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Menu Type Name</label>
                  <input
                    type="text"
                    name="menu_type_name"
                    required
                    placeholder="e.g. Appetizers, Main Course, Desserts"
                    value={menuType.menu_type_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">Rs.</span>
                      </div>
                      <input
                        type="text"
                        name="price"
                        required
                        placeholder="0.00"
                        value={menuType.price}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Menu</label>
                    <select
                      name="menu_list_type_id"
                      required
                      value={menuType.menu_list_type_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    >
                      <option value="" disabled>Select a Menu</option>
                      {menuListTypes.map((menuListType) => (
                        <option key={menuListType.menu_list_type_id} value={menuListType.menu_list_type_id}>
                          {menuListType.menu_list_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setBtnname('Add Menu Type');
                      setMenuType({ menu_type_id: '', menu_type_name: '', price: '', menu_list_type_id: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded-lg font-medium text-white transition duration-200 ${
                      btnname === 'Add Menu Type' 
                        ? 'bg-indigo-600 hover:bg-indigo-700' 
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
            <h2 className="text-xl font-semibold text-gray-800">Current Menu Types</h2>
          </div>
          {menuTypes.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No menu types available</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first menu type</p>
              <button
                onClick={() => {
                  setIsAdding(true);
                  if (topRef.current) {
                    topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                Add Menu Type
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
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Menu
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {menuTypes.map((menuTypeItem, index) => {
                    const category = menuListTypes.find(
                      item => item.menu_list_type_id === menuTypeItem.menu_list_type_id
                    );
                    return (
                      <tr key={index} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{menuTypeItem.menu_type_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">Rs. {menuTypeItem.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {category ? category.menu_list_name : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(menuTypeItem.menu_type_id)}
                            className="text-indigo-600 hover:text-indigo-900 px-3 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 transition duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(menuTypeItem.menu_type_id)}
                            className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md bg-red-50 hover:bg-red-100 transition duration-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
                        Add New Menu Type
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

export default CreateMenuType;