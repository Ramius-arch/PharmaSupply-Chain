// Utility for resolving photography-grade commercial product imagery

export const getProductImage = (product) => {
  if (product?.image && !product.image.includes('picsum.photos') && !product.image.includes('placeholder')) {
    return product.image;
  }

  const name = (product?.name || '').toLowerCase();
  const category = (product?.category || '').toLowerCase();

  if (name.includes('amoxicillin')) return '/images/amoxicillin.png';
  if (name.includes('atorvastatin')) return '/images/atorvastatin.png';
  if (name.includes('insulin')) return '/images/insulin.png';
  if (name.includes('metformin')) return '/images/metformin.png';
  if (name.includes('azithromycin')) return '/images/azithromycin.png';
  if (name.includes('ibuprofen')) return '/images/ibuprofen.png';
  if (name.includes('loratadine')) return '/images/loratadine.png';
  if (name.includes('vaccine') || name.includes('spikevax')) return '/images/vaccine.png';

  if (category.includes('antibiotic')) return '/images/amoxicillin.png';
  if (category.includes('cardio')) return '/images/atorvastatin.png';
  if (category.includes('vaccine') || category.includes('biologic')) return '/images/vaccine.png';
  if (category.includes('pain') || category.includes('analgesic')) return '/images/ibuprofen.png';
  if (category.includes('allergy') || category.includes('antihistamine')) return '/images/loratadine.png';
  if (category.includes('endocrine') || category.includes('diabet')) return '/images/metformin.png';

  return '/images/amoxicillin.png';
};
