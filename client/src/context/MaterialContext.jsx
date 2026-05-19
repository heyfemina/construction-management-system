import { createContext, useState } from "react";

export const MaterialContext = createContext();

function MaterialProvider({ children }) {
  const [materials, setMaterials] = useState([]);

  const addMaterial = (newMaterial) => {
    setMaterials([...materials, newMaterial]);
  };

  const deleteMaterial = (id) => {
    const filtered = materials.filter(
      (material) => material.id !== id
    );

    setMaterials(filtered);
  };

  const updateMaterial = (updatedMaterial) => {
    const updatedList = materials.map((material) =>
      material.id === updatedMaterial.id
        ? updatedMaterial
        : material
    );

    setMaterials(updatedList);
  };

  return (
    <MaterialContext.Provider
      value={{
        materials,
        addMaterial,
        deleteMaterial,
        updateMaterial,
      }}
    >
      {children}
    </MaterialContext.Provider>
  );
}

export default MaterialProvider;