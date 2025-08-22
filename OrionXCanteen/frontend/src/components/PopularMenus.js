import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStructuredMenuSelections, getMenuOverview } from "../services/MenuService";
import { Loader2, AlertCircle, Star, ChevronRight } from "lucide-react";

const PopularMenuSelections = ({ setActivePage, closeSidebar }) => {
  const [popularItems, setPopularItems] = useState([]);
  const [menuOverview, setMenuOverview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [selectionsData, overviewData] = await Promise.all([
          getAllStructuredMenuSelections(),
          getMenuOverview()
        ]);

        setMenuOverview(overviewData);

        const itemCounts = {};
        
        selectionsData.forEach(customers => {
          customers.bookings.forEach(booking => {
            booking.menus.forEach(menu => {
              menu.categories.forEach(category => {
                category.items.forEach(item => {
                  const itemKey = `${item.item_id}-${item.item_name}`;
                  itemCounts[itemKey] = (itemCounts[itemKey] || 0) + 1;
                });
              });
            });
          });
        });

        const popularItemsArray = Object.entries(itemCounts)
          .map(([key, count]) => {
            const [item_id, item_name] = key.split('-');
            return { item_id, item_name, count };
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, 12);

        setPopularItems(popularItemsArray);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load popular menu selections.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const findItemMenuType = (itemId) => {
    for (const menuList of menuOverview) {
      for (const menuType of menuList.types) {
        for (const category of menuType.categories) {
          if (category.items.some(item => item.id === itemId)) {
            return {
              menuListId: menuList.id,
              menuListName: menuList.name,
              menuTypeName: menuType.name,
              categoryName: category.name
            };
          }
        }
      }
    }
    return null;
  };

  const handleViewMenu = (itemId) => {
    const menuInfo = findItemMenuType(itemId);
    if (menuInfo) {
      // Store the highlighted menu in session storage
      sessionStorage.setItem('highlightedMenuList', menuInfo.menuListId);
      setActivePage('plan-menulist');
      closeSidebar?.();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 flex items-center justify-center gap-2 mt-10">
        <AlertCircle className="w-6 h-6" /> {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Customer Favorites
      </h1>
      <p className="text-lg text-gray-600 mb-10 text-center">
        Discover our most popular menu selections chosen by our customers
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularItems.map((item, index) => {
          const menuInfo = findItemMenuType(item.item_id);
          
          return (
            <div
              key={item.item_id}
              className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition">
                      {item.item_name}
                    </h3>
                    {menuInfo && (
                      <p className="text-sm text-gray-500 mt-1">
                        From {menuInfo.menuTypeName} • {menuInfo.categoryName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-yellow-700">
                      {item.count} orders
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    #{index + 1} Most Popular
                  </span>
                  <button 
                    onClick={() => handleViewMenu(item.item_id)}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition"
                  >
                    View Menu
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Ready to create your own perfect menu?
        </h2>
        <button
          onClick={() => {
            setActivePage('plan-menulist');
            closeSidebar?.();
          }}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Explore All Menu Options
        </button>
      </div>
    </div>
  );
};

export default PopularMenuSelections;