// Initialize ApperClient instance
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getPrograms = async () => {
  try {
    const apperClient = getApperClient();
const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "slug" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "thumbnail_url" } },
        { field: { Name: "description_short" } },
        { field: { Name: "description_long" } },
        { field: { Name: "has_common_course" } },
        { field: { Name: "type" } },
        { field: { Name: "price" } },
        { field: { Name: "duration" } },
        { field: { Name: "level" } },
        { field: { Name: "created_at" } }
      ],
      orderBy: [
        { fieldName: "created_at", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords("program", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching programs:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error fetching programs:", error.message);
      throw error;
    }
  }
};

export const getProgramBySlug = async (slug) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
{ field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "slug" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "thumbnail_url" } },
        { field: { Name: "description_short" } },
        { field: { Name: "description_long" } },
        { field: { Name: "has_common_course" } },
        { field: { Name: "type" } },
        { field: { Name: "price" } },
        { field: { Name: "duration" } },
        { field: { Name: "level" } },
        { field: { Name: "created_at" } }
      ],
      where: [
        { FieldName: "slug", Operator: "EqualTo", Values: [slug] }
      ]
    };
    
    const response = await apperClient.fetchRecords("program", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data || response.data.length === 0) {
      throw new Error(`Program with slug "${slug}" not found`);
    }
    
    return response.data[0];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching program by slug:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error fetching program by slug:", error.message);
      throw error;
    }
  }
};

export const createProgram = async (programData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields
    const updateableData = {
Name: programData.title || programData.Name,
      Tags: programData.Tags || "",
      slug: programData.slug,
      title: programData.title,
      description: programData.description,
      thumbnail_url: programData.thumbnail_url || "",
      description_short: programData.description_short || "",
      description_long: programData.description_long || "",
      has_common_course: Boolean(programData.has_common_course),
      type: programData.type,
      price: Number(programData.price),
      duration: programData.duration,
      level: programData.level,
      created_at: new Date().toISOString()
    };
    
    const params = {
      records: [updateableData]
    };
    
    const response = await apperClient.createRecord("program", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create programs ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
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
      console.error("Error creating program:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error creating program:", error.message);
      throw error;
    }
  }
};

export const updateProgram = async (id, programData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields
    const updateableData = {
      Name: programData.title || programData.Name,
Tags: programData.Tags || "",
      slug: programData.slug,
      title: programData.title,
      description: programData.description,
      thumbnail_url: programData.thumbnail_url || "",
      description_short: programData.description_short || "",
      description_long: programData.description_long || "",
      has_common_course: Boolean(programData.has_common_course),
      type: programData.type,
      price: Number(programData.price),
      duration: programData.duration,
      level: programData.level
    };
    
    const params = {
      records: [{ Id: parseInt(id), ...updateableData }]
    };
    
    const response = await apperClient.updateRecord("program", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update programs ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            console.error(`${error.fieldLabel}: ${error.message}`);
          });
        });
        
        if (failedUpdates[0]?.message) {
          throw new Error(failedUpdates[0].message);
        }
      }
      
      return successfulUpdates[0]?.data || { Id: parseInt(id), ...updateableData };
    }
    
    return { Id: parseInt(id), ...updateableData };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating program:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error updating program:", error.message);
      throw error;
    }
  }
};

export const deleteProgram = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord("program", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete programs ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        if (failedDeletions[0]?.message) {
          throw new Error(failedDeletions[0].message);
        }
      }
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting program:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error deleting program:", error.message);
      throw error;
    }
  }
};