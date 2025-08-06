import programsData from "@/services/mockData/programs.json";

let programs = [...programsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getPrograms = async () => {
  await delay(300);
  return programs.map(program => ({ ...program }));
};

export const getProgramBySlug = async (slug) => {
  await delay(200);
  const program = programs.find(p => p.slug === slug);
  if (!program) {
    throw new Error(`Program with slug "${slug}" not found`);
  }
  return { ...program };
};

export const createProgram = async (programData) => {
  await delay(400);
  const newProgram = {
    ...programData,
    Id: Math.max(...programs.map(p => p.Id)) + 1,
    created_at: new Date().toISOString()
  };
  programs.push(newProgram);
  return { ...newProgram };
};

export const updateProgram = async (id, programData) => {
  await delay(350);
  const index = programs.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Program with id ${id} not found`);
  }
  programs[index] = { ...programs[index], ...programData };
  return { ...programs[index] };
};

export const deleteProgram = async (id) => {
  await delay(250);
  const index = programs.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Program with id ${id} not found`);
  }
  programs.splice(index, 1);
  return true;
};