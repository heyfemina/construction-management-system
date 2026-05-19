export const createSiteService =
  async (siteData) => {
    return {
      ...siteData,
      created_at: new Date(),
    };
  };

export const updateSiteService =
  async (siteData) => {
    return {
      ...siteData,
      updated_at: new Date(),
    };
  };