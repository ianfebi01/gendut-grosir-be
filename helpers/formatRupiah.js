exports.formatRupiah = (angka) => {
  let result = 0;
  if (angka) {
    result = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    })
      .format(angka)
      .split(",")[0];
  }

  return result;
};
