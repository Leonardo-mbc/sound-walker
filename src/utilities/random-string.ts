export const randomString = () => {
  return Math.random()
    .toString(36)
    .slice(-8);
};
