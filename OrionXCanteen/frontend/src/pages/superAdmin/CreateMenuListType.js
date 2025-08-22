import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMenuListType, deleteMenuListType, getMenuListTypeById, getMenus, updateMenuListTypeById } from '../../services/MenuService';
import CreateMenuType from './CreateMenuType';

function CreateMenuListType({ setRenderContent, handleRenderContent }) {
  const [menu, setMenu] = useState({ menu_list_type_id: '', menu_list_name: '' });
  const [menus, setMenus] = useState([]);
  const [btnname, setBtnname] = useState('Add Menu');
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  const topRef = useRef(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const fetchedMenus = await getMenus();
        // Reverse the array to show newest first
        setMenus(fetchedMenus.reverse());
        const nextId = fetchedMenus.length ? `MLT${(fetchedMenus.length + 1).toString().padStart(6, '0')}` : 'MLT000001';
        setMenu((prevMenu) => ({ ...prevMenu, menu_list_type_id: nextId }));
      } catch (error) {
        console.error('Error fetching menu list types:', error);
      }
    };
    fetchMenus();
  }, []);

  const handleValidation = () => {
    return menus.some((item) => item.menu_list_name.toLowerCase() === menu.menu_list_name.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!menu.menu_list_name.trim()) {
      alert('Menu name cannot be empty or just spaces!');
      return;
    }

    if (handleValidation()) {
      alert('This menu name already exists! Please enter a unique name.');
      return;
    }

    try {
      if (btnname === 'Add Menu') {
        await addMenuListType(menu);
        alert('Menu added successfully!');
        setMenu({ menu_list_name: '' });

        const updatedMenus = await getMenus();
        // Reverse the array to show newest first
        setMenus(updatedMenus.reverse());
        setIsAdding(false);
        // Navigate to CreateMenuType after successful addition
        if (handleRenderContent) {
          handleRenderContent('createMenuTypes');
        }

      } else if (btnname === 'Update') {
        await updateMenuListTypeById(menu.menu_list_type_id, menu.menu_list_name);
        setMenu({ menu_list_name: '' });
        alert('Menu updated successfully!');

        const updatedMenus = await getMenus();
        // Reverse the array to show newest first
        setMenus(updatedMenus.reverse());
        setBtnname('Add Menu');
        setIsAdding(false);
      }

      // Scroll to top after adding/updating
      if (topRef.current) {
        topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the menu.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((prevMenu) => ({ ...prevMenu, [name]: value }));
  };

  const handleEdit = async (id) => {
    try {
      const menuById = await getMenuListTypeById(id);
      if (!menuById) {
        alert('Menu ID not found.');
        return;
      }

      setMenu({
        menu_list_type_id: id,
        menu_list_name: menuById.menu_list_name,
      });

      setBtnname('Update');
      setIsAdding(true);

      // Scroll to form when editing
      if (topRef.current) {
       topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error fetching menu list type by ID:', error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this menu?');
    if (!isConfirmed) return; 

    try {
      const deleteResponse = await deleteMenuListType(id);
      if (deleteResponse) {
        alert(deleteResponse.message);
        const updatedMenus = await getMenus();
        // Reverse the array to show newest first
        setMenus(updatedMenus.reverse());
      }
    } catch (error) {
      console.error('Error deleting menu list type:', error);
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
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
              <p className="text-gray-600">Manage your menus</p>
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center"
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
                {btnname === 'Add Menu' ? 'Create New Menu' : 'Update Menu'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Menu Name</label>
                  <input
                    type="text"
                    name="menu_list_name"
                    required
                    placeholder="e.g. Breakfast, Lunch, Dinner"
                    value={menu.menu_list_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setBtnname('Add Menu');
                      setMenu({ menu_list_name: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded-lg font-medium text-white transition duration-200 ${
                      btnname === 'Add Menu' 
                        ? 'bg-blue-600 hover:bg-blue-700' 
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
            <h2 className="text-xl font-semibold text-gray-800">Current Menus</h2>
          </div>
          {menus.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No menus available</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first menu</p>
              <button
                onClick={() => {
                  setIsAdding(true);
                  if (topRef.current) {
                    topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                Add Menu
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Menu Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {menus.map((menuItem, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{menuItem.menu_list_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(menuItem.menu_list_type_id)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(menuItem.menu_list_type_id)}
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
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center w-full py-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Menu
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

export default CreateMenuListType;