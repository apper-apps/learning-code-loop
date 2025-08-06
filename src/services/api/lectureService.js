import lecturesData from "@/services/mockData/lectures.json";

let lectures = [...lecturesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getLectures = async () => {
  await delay(250);
  return lectures.map(lecture => ({ ...lecture }));
};

export const getLecturesByProgramId = async (programId) => {
  await delay(300);
  return lectures
    .filter(l => l.program_id === parseInt(programId))
    .map(lecture => ({ ...lecture }))
    .sort((a, b) => a.order - b.order);
};

export const getLectureById = async (id) => {
  await delay(200);
  const lecture = lectures.find(l => l.Id === parseInt(id));
  if (!lecture) {
    throw new Error(`Lecture with id ${id} not found`);
  }
  return { ...lecture };
};

export const createLecture = async (lectureData) => {
  await delay(400);
  const newLecture = {
    ...lectureData,
    Id: Math.max(...lectures.map(l => l.Id)) + 1,
    created_at: new Date().toISOString()
  };
  lectures.push(newLecture);
  return { ...newLecture };
};

export const updateLecture = async (id, lectureData) => {
  await delay(350);
  const index = lectures.findIndex(l => l.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Lecture with id ${id} not found`);
  }
  lectures[index] = { ...lectures[index], ...lectureData };
  return { ...lectures[index] };
};

export const deleteLecture = async (id) => {
  await delay(250);
  const index = lectures.findIndex(l => l.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Lecture with id ${id} not found`);
  }
  lectures.splice(index, 1);
  return true;
};