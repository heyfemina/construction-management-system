import { createContext, useState } from "react";

export const VendorContext = createContext();

function VendorProvider({ children }) {
  const [vendors, setVendors] = useState([]);

  const addVendor = (vendor) => {
    setVendors([...vendors, vendor]);
  };

  const deleteVendor = (id) => {
    const filtered = vendors.filter(
      (vendor) => vendor.id !== id
    );

    setVendors(filtered);
  };

  return (
    <VendorContext.Provider
      value={{
        vendors,
        addVendor,
        deleteVendor,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}

export default VendorProvider;