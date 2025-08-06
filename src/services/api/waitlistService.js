import waitlistData from "@/services/mockData/waitlist.json";

let waitlist = [...waitlistData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getWaitlist = async () => {
  await delay(250);
  return waitlist
    .map(entry => ({ ...entry }))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const addToWaitlist = async (email, programSlug) => {
  await delay(300);
  
  // Check if email is already on waitlist for this program
  const existing = waitlist.find(w => w.email === email && w.program_slug === programSlug);
  if (existing) {
    throw new Error("Email is already on the waitlist for this program");
  }
  
  const newEntry = {
    Id: Math.max(...waitlist.map(w => w.Id)) + 1,
    email,
    program_slug: programSlug,
    created_at: new Date().toISOString()
  };
  
  waitlist.push(newEntry);
  return { ...newEntry };
};

export const removeFromWaitlist = async (id) => {
  await delay(200);
  const index = waitlist.findIndex(w => w.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Waitlist entry with id ${id} not found`);
  }
  waitlist.splice(index, 1);
  return true;
};