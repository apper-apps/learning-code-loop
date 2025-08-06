// Initialize ApperClient instance
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getWaitlist = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "email" } },
        { field: { Name: "programSlug" } },
        { field: { Name: "created_at" } }
      ],
      orderBy: [
        { fieldName: "created_at", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords("waitlist", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching waitlist:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error fetching waitlist:", error.message);
      throw error;
    }
  }
};

export const addToWaitlist = async (email, programSlug) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields
    const updateableData = {
      Name: email, // Use email as the name field
      Tags: "",
      email: email,
      programSlug: programSlug,
      created_at: new Date().toISOString()
    };
    
    const params = {
      records: [updateableData]
    };
    
    const response = await apperClient.createRecord("waitlist", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create waitlist entries ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            console.error(`${error.fieldLabel}: ${error.message}`);
          });
        });
        
        if (failedRecords[0]?.message) {
          throw new Error(failedRecords[0].message);
        }
      }
      
      return successfulRecords[0]?.data || updateableData;
    }
    
    return updateableData;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error adding to waitlist:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error adding to waitlist:", error.message);
      throw error;
    }
  }
};

export const removeFromWaitlist = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord("waitlist", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete waitlist entries ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        if (failedDeletions[0]?.message) {
          throw new Error(failedDeletions[0].message);
        }
      }
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error removing from waitlist:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error removing from waitlist:", error.message);
      throw error;
    }
  }
};