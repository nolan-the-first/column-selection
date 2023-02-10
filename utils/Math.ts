export const calculateHypotenuse = (side1, side2) => {
  return Math.sqrt(Math.pow(side1, 2) + Math.pow(side2, 2));
};

export const calculateAngleFromSin = (side1, Hypotenuse) => {
  let rotationAngleSin = side1 / Hypotenuse;
  // Convert from radians to deg
  return (Math.asin(rotationAngleSin) * 180) / Math.PI;
};
