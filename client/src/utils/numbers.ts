const numberFormatCompact = (num: number = 0) => {
  return Intl.NumberFormat('en', { notation: 'compact' }).format(num);
};

export { numberFormatCompact };
