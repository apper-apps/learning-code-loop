// Initialize ApperClient instance
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getLectures = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "programId" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "videoUrl" } },
        { field: { Name: "duration" } },
        { field: { Name: "created_at" } }
      ],
      orderBy: [
        { fieldName: "created_at", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords("lecture", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching lectures:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error fetching lectures:", error.message);
      throw error;
    }
  }
};

export const getLecturesByProgramId = async (programId) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "programId" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "videoUrl" } },
        { field: { Name: "duration" } },
        { field: { Name: "created_at" } }
      ],
      where: [
        { FieldName: "programId", Operator: "EqualTo", Values: [parseInt(programId)] }
      ],
      orderBy: [
        { fieldName: "created_at", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords("lecture", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching lectures by program ID:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error fetching lectures by program ID:", error.message);
      throw error;
    }
  }
};

export const getLectureById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "programId" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "videoUrl" } },
        { field: { Name: "duration" } },
        { field: { Name: "created_at" } }
      ]
    };
    
    const response = await apperClient.getRecordById("lecture", parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      throw new Error(`Lecture with id ${id} not found`);
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching lecture by ID:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error fetching lecture by ID:", error.message);
      throw error;
    }
  }
};

export const createLecture = async (lectureData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields
    const updateableData = {
      Name: lectureData.title || lectureData.Name,
      Tags: lectureData.Tags || "",
      programId: Number(lectureData.programId),
      title: lectureData.title,
      description: lectureData.description,
      videoUrl: lectureData.videoUrl || "",
      duration: lectureData.duration,
      created_at: new Date().toISOString()
    };
    
    const params = {
      records: [updateableData]
    };
    
    const response = await apperClient.createRecord("lecture", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create lectures ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
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
      console.error("Error creating lecture:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error creating lecture:", error.message);
      throw error;
    }
  }
};

export const updateLecture = async (id, lectureData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields
    const updateableData = {
      Name: lectureData.title || lectureData.Name,
      Tags: lectureData.Tags || "",
      programId: Number(lectureData.programId),
      title: lectureData.title,
      description: lectureData.description,
      videoUrl: lectureData.videoUrl || "",
      duration: lectureData.duration
    };
    
    const params = {
      records: [{ Id: parseInt(id), ...updateableData }]
    };
    
    const response = await apperClient.updateRecord("lecture", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update lectures ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
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
      console.error("Error updating lecture:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error updating lecture:", error.message);
      throw error;
    }
  }
};

export const deleteLecture = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord("lecture", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete lectures ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        if (failedDeletions[0]?.message) {
          throw new Error(failedDeletions[0].message);
        }
      }
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting lecture:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error deleting lecture:", error.message);
      throw error;
    }
  }
};