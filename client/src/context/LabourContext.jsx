import { createContext, useState } from "react";

export const LabourContext = createContext();

function LabourProvider({ children }) {
  const [labours, setLabours] = useState([]);

  const addLabour = (labour) => {
    setLabours([...labours, labour]);
  };

  const deleteLabour = (id) => {
    const filtered = labours.filter(
      (labour) => labour.id !== id
    );

    setLabours(filtered);
  };

  return (
    <LabourContext.Provider
      value={{
        labours,
        addLabour,
        deleteLabour,
      }}
    >
      {children}
    </LabourContext.Provider>
  );
}

export default LabourProvider;