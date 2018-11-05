export const getTouchByTarget = (
  touchList: React.TouchList | TouchList,
  target: string
) => {
  for (let i = 0; i < touchList.length; i++) {
    const item = touchList.item(i);
    if (target === (item.target as HTMLElement).getAttribute('data-target')) {
      return item;
    }
  }

  return null;
};
