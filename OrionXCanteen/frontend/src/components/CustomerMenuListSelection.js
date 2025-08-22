import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CusgetMenuListType } from "../services/MenuService";
import { Loader2, AlertCircle } from "lucide-react";
import CustomerMenuTypeSelection from "./CustomerMenuTypeSelection";

const CustomerMenuListSelection = ({ setActivePage }) => {
  const [menuListTypes, setMenuListTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMenuTypeId, setSelectedMenuTypeId] = useState(null);
  const [highlightedMenu, setHighlightedMenu] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const highlightedMenuId = sessionStorage.getItem('highlightedMenuList');
    if (highlightedMenuId) {
      setHighlightedMenu(highlightedMenuId);
      sessionStorage.removeItem('highlightedMenuList');
    }

    const fetchMenuListTypes = async () => {
      try {
        const data = await CusgetMenuListType();
        const updatedData = data.map((item, index) => ({
          ...item,
          image: `/images/menu${index + 1}.jpg`,
        }));
        setMenuListTypes(updatedData);
      } catch (err) {
        console.error("Failed to fetch menu list types", err);
        setError("Failed to load menu list types.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuListTypes();
  }, []);

  const handleMenuTypeClick = (menuListTypeId) => {
    setSelectedMenuTypeId(menuListTypeId);
    setHighlightedMenu(null);
  };

  const handleCloseMenuSelection = () => {
    setSelectedMenuTypeId(null);
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
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Menus We Offer
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuListTypes.map((type) => (
          <div
            key={type.menu_list_type_id}
            onClick={() => handleMenuTypeClick(type.menu_list_type_id)}
            className="group relative bg-white rounded-2xl overflow-hidden transition-transform transform hover:scale-[1.02] cursor-pointer border-2 border-gray-100 hover:border-blue-400 hover:shadow-xl"
          >
            {/* Animated blue border effect */}
            {highlightedMenu === type.menu_list_type_id && (
              <>
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-300 opacity-75 animate-pulse-ring blur-sm"></div>
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-300 opacity-75 animate-pulse-ring"></div>
              </>
            )}

            <img
              src={type.image}
              alt={type.menu_list_name}
              className="w-full h-48 object-cover group-hover:brightness-90 transition relative z-10"
            />

            <div className="p-4 text-center relative z-10">
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition">
                {type.menu_list_name}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Tap to explore menu options
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedMenuTypeId && (
        <CustomerMenuTypeSelection 
          menuListTypeId={selectedMenuTypeId} 
          onClose={handleCloseMenuSelection}
        />
      )}

      {/* Add the animation keyframes to your CSS */}
      <style jsx global>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.95);
            opacity: 0.75;
          }
          70% {
            transform: scale(1.05);
            opacity: 0;
          }
          100% {
            transform: scale(0.95);
            opacity: 0;
          }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
        }
      `}</style>
    </div>
  );
};

export default CustomerMenuListSelection;