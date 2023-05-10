export function clamp(value: number, max: number, min: number = 0){
  return value >= max ? max : value <= min ? min : value;
};

export async function sleep(ms: number){
  return new Promise(resolve => setTimeout(resolve, ms));
};