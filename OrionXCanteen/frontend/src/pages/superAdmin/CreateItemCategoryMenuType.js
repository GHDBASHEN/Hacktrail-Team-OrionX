import React, { useState, useEffect, useRef } from "react";
import {
  getItemCategoryMenuTypes,
  addItemCategoryMenuType,
  getCategoryMenuTypes,
  getItems,
  deleteItemCategoryMenuType,
  updateItemCategoryMenuTypeById,
  getItemCategoryMenuTypeById
} from "../../services/MenuService";

function CreateItemCategoryMenuType() {
  const [itemCategoryMenu, setItemCategoryMenu] = useState({
    item_id: "",
    category_menu_type_id: ""
  });

  const [itemCategoryMenuTypes, setItemCategoryMenuTypes] = useState([]);
  const [categoryMenuTypes, setCategoryMenuTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [btnName, setBtnName] = useState('Add Association');
  const [selectedId, setSelectedId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [menuTypeFilter, setMenuTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const topRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [icmts, cmts, its] = await Promise.all([
          getItemCategoryMenuTypes(),
          getCategoryMenuTypes(),
          getItems()
        ]);

        // Reverse the array to show newest first
        setItemCategoryMenuTypes(icmts.reverse());
        setCategoryMenuTypes(cmts);
        setItems(its);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (btnName === 'Add Association') {
        await addItemCategoryMenuType(itemCategoryMenu);
        alert("Added successfully!");
      } else {
        await updateItemCategoryMenuTypeById(selectedId, itemCategoryMenu);
        alert("Updated successfully!");
        setBtnName('Add Association');
        setSelectedId(null);
      }

      const updated = await getItemCategoryMenuTypes();
      // Reverse the array to show newest first
      setItemCategoryMenuTypes(updated.reverse());
      setItemCategoryMenu({ item_id: "", category_menu_type_id: "" });
      setIsAdding(false);

      // Scroll to top after adding/updating
      if (topRef.current) {
        topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      alert("Operation failed!");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemCategoryMenu(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (icmtId) => {
    try {
      const data = await getItemCategoryMenuTypeById(icmtId);
      setItemCategoryMenu({
        item_id: data.item_id,
        category_menu_type_id: data.category_menu_type_id
      });
      setSelectedId(icmtId);
      setBtnName('Update');
      setIsAdding(true);
      
      // Scroll to form when editing
      if (topRef.current) {
        topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Error fetching for edit:", error);
    }
  };

  const handleDelete = async (icmtId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteItemCategoryMenuType(icmtId);
      alert("Deleted successfully!");
      const updated = await getItemCategoryMenuTypes();
      // Reverse the array to show newest first
      setItemCategoryMenuTypes(updated.reverse());
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const getItemName = (itemId) =>
    items.find(i => i.item_id === itemId)?.item_name || itemId;

  const getCMTName = (cmtId) => {
    const match = categoryMenuTypes.find(c => c.category_menu_type_Id == cmtId);
    if (match) {
      return `${match.menu_type_name} - ${match.category_name}`;
    }
    return cmtId;
  };

  const filteredItemCategoryMenuTypes = itemCategoryMenuTypes.filter(icmt => {
    const cmt = categoryMenuTypes.find(c => c.category_menu_type_Id == icmt.category_menu_type_id);
    if (!cmt) return false;

    const menuMatch = menuTypeFilter ? cmt.menu_type_name === menuTypeFilter : true;
    const categoryMatch = categoryFilter ? cmt.category_name === categoryFilter : true;

    return menuMatch && categoryMatch;
  });

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Menu Item Associations</h1>
              <p className="text-gray-600">Link menu items with category types to organize your menu structure</p>
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
              Create New Association
            </button>
          )}
        </div>

        {isAdding && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {btnName === 'Add Association' ? 'Create New Association' : 'Update Association'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Menu Item</label>
                    <select
                      name="item_id"
                      required
                      value={itemCategoryMenu.item_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    >
                      <option value="">Select menu item</option>
                      {items.map(item => (
                        <option key={item.item_id} value={item.item_id}>{item.item_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Menu Type</label>
                    <select
                      name="category_menu_type_id"
                      required
                      value={itemCategoryMenu.category_menu_type_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    >
                      <option value="">Select category type</option>
                      {categoryMenuTypes.map(cmt => (
                        <option key={cmt.category_menu_type_Id} value={cmt.category_menu_type_Id}>
                          {`${cmt.menu_type_name} - ${cmt.category_name}`}
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
                      setBtnName('Add Association');
                      setItemCategoryMenu({ item_id: "", category_menu_type_id: "" });
                      setSelectedId(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded-lg font-medium text-white transition duration-200 ${
                      btnName === 'Add Association' 
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
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Current Associations</h2>
            <div className="flex space-x-3">
              <select
                value={menuTypeFilter}
                onChange={(e) => setMenuTypeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Menu Types</option>
                {[...new Set(categoryMenuTypes.map(c => c.menu_type_name))].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {[...new Set(categoryMenuTypes.map(c => c.category_name))].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredItemCategoryMenuTypes.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No associations available</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first association</p>
              <button
                onClick={() => {
                  setIsAdding(true);
                  if (topRef.current) {
                    topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                Create Association
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th> */}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Menu Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItemCategoryMenuTypes.map(icmt => (
                    <tr key={icmt.ICMT_Id} className="hover:bg-gray-50 transition duration-150">
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{icmt.ICMT_Id}</div>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getCMTName(icmt.category_menu_type_id)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{getItemName(icmt.item_id)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(icmt.ICMT_Id)}
                          className="text-indigo-600 hover:text-indigo-900 px-3 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(icmt.ICMT_Id)}
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
                        Create New Association
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

export default CreateItemCategoryMenuType;