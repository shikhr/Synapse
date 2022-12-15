const displayDate = (date: Date) => {
  return date.toLocaleDateString('default', {
    year: 'numeric',
    day: '2-digit',
    month: 'short',
  });
};

const convertDateTOYYMMDD = (date: Date) => {
  const year = date.toLocaleString('default', { year: 'numeric' });
  const month = date.toLocaleString('default', { month: '2-digit' });
  const day = date.toLocaleString('default', { day: '2-digit' });

  return year + '-' + month + '-' + day;
};

export { displayDate, convertDateTOYYMMDD };
