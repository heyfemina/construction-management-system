import { createContext, useState } from "react";

export const SiteContext = createContext();

function SiteProvider({ children }) {
  const [sites, setSites] = useState([]);

  const addSite = (site) => {
    setSites([...sites, site]);
  };

  const deleteSite = (id) => {
    const filtered = sites.filter(
      (site) => site.id !== id
    );

    setSites(filtered);
  };

  return (
    <SiteContext.Provider
      value={{
        sites,
        addSite,
        deleteSite,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export default SiteProvider;